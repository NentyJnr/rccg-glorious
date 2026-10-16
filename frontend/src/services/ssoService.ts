import { api, setAuthSession, ApiResponse } from './apiClient';

export interface SsoUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  assignedDepartment?: string;
  mustChangePassword: boolean;
  isActive: boolean;
  token?: string;
}

export interface SsoCallbackResult {
  isCallback: boolean;
  success: boolean;
  user?: SsoUser;
  error?: string;
}

function cleanEnv(val?: string): string {
  if (!val) return '';
  return val.trim().replace(/^["']|["']$/g, '').trim();
}

const DEFAULT_GOOGLE_CLIENT_ID = '930892872796-advtrgb8dn9ar87cv61uu037tkvjbo3b.apps.googleusercontent.com';

const GOOGLE_CLIENT_ID = cleanEnv(
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  import.meta.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
) || DEFAULT_GOOGLE_CLIENT_ID;
const MICROSOFT_CLIENT_ID = cleanEnv(
  import.meta.env.VITE_MICROSOFT_CLIENT_ID ||
  import.meta.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID
);
const MICROSOFT_TENANT_ID = cleanEnv(
  import.meta.env.VITE_MICROSOFT_TENANT_ID ||
  import.meta.env.NEXT_PUBLIC_MICROSOFT_TENANT_ID
) || 'common';

function getRedirectUri(): string {
  // Use the origin so both localhost and Vercel production work automatically
  return `${window.location.origin}/auth/callback`;
}

function generateRandomNonce(): string {
  const array = new Uint32Array(4);
  window.crypto.getRandomValues(array);
  return Array.from(array, dec => dec.toString(36)).join('');
}

/**
 * Initiates the Google OAuth 2.0 / OpenID Connect (OIDC) implicit flow
 */
export function redirectToGoogle(): void {
  const clientId = GOOGLE_CLIENT_ID;

  if (!clientId || clientId.includes('your-google-client-id')) {
    throw new Error(
      'Google Single Sign-On is not configured with a live Google Client ID yet. Please set VITE_GOOGLE_CLIENT_ID in your frontend .env file.'
    );
  }

  const redirectUri = getRedirectUri();
  const nonce = generateRandomNonce();

  try {
    localStorage.setItem('sso_pending_provider', 'google');
  } catch (err) {
    console.warn('[SSO] Could not set pending provider in localStorage:', err);
  }

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=id_token` +
    `&scope=openid%20profile%20email` +
    `&nonce=${encodeURIComponent(nonce)}` +
    `&state=google`;

  window.location.assign(authUrl);
}

/**
 * Initiates the Microsoft Entra ID (Azure AD) OIDC flow
 */
export function redirectToMicrosoft(): void {
  const clientId = MICROSOFT_CLIENT_ID;

  if (!clientId || clientId.includes('your-azure-app-client')) {
    throw new Error(
      'Microsoft Entra ID Single Sign-On is not configured with a live Azure App Client ID yet. Please set VITE_MICROSOFT_CLIENT_ID in your frontend .env file.'
    );
  }

  const redirectUri = getRedirectUri();
  const nonce = generateRandomNonce();

  try {
    localStorage.setItem('sso_pending_provider', 'microsoft');
  } catch (err) {
    console.warn('[SSO] Could not set pending provider in localStorage:', err);
  }

  const authUrl = `https://login.microsoftonline.com/${MICROSOFT_TENANT_ID}/oauth2/v2.0/authorize?` +
    `client_id=${encodeURIComponent(clientId)}` +
    `&response_type=id_token` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=openid%20profile%20email` +
    `&response_mode=fragment` +
    `&nonce=${encodeURIComponent(nonce)}` +
    `&state=microsoft`;

  window.location.assign(authUrl);
}

/**
 * Parses URL hash and search params to extract OIDC id_token from Google/Microsoft
 */
export function extractOidcCallbackToken(): { 
  idToken: string | null; 
  provider: 'google' | 'microsoft' | null; 
  isCallback: boolean;
  error?: string;
} {
  // Check hash fragment first (#id_token=...)
  const hash = window.location.hash.startsWith('#') ? window.location.hash.substring(1) : window.location.hash;
  const hashParams = new URLSearchParams(hash);
  const searchParams = new URLSearchParams(window.location.search);

  const errorParam = hashParams.get('error') || searchParams.get('error');
  const errorDesc = hashParams.get('error_description') || searchParams.get('error_description');

  let idToken = hashParams.get('id_token') || searchParams.get('id_token');

  // Detect provider from state or saved localStorage flag
  const state = (hashParams.get('state') || searchParams.get('state') || '').toLowerCase();
  let provider: 'google' | 'microsoft' | null = null;

  if (state.includes('microsoft')) {
    provider = 'microsoft';
  } else if (state.includes('google')) {
    provider = 'google';
  } else {
    const saved = (localStorage.getItem('sso_pending_provider') || '').toLowerCase();
    if (saved.includes('microsoft')) provider = 'microsoft';
    else if (saved.includes('google')) provider = 'google';
  }

  const isCallback = Boolean(idToken || errorParam || window.location.pathname.includes('/auth/callback'));
  const error = errorParam
    ? (errorDesc ? decodeURIComponent(errorDesc) : `Authentication cancelled or rejected (${errorParam})`)
    : undefined;

  return { idToken, provider, isCallback, error };
}

/**
 * Authenticates the OIDC token against the backend API and stores the session
 */
export async function processSsoCallback(): Promise<SsoCallbackResult> {
  const { idToken, provider, isCallback, error } = extractOidcCallbackToken();

  if (!isCallback) {
    return { isCallback: false, success: false };
  }

  if (error) {
    try {
      localStorage.removeItem('sso_pending_provider');
      window.history.replaceState(null, '', window.location.pathname.replace(/\/auth\/callback\/?$/, '') || '/');
    } catch {}
    return { isCallback: true, success: false, error };
  }

  if (!idToken) {
    return { isCallback: true, success: false, error: 'No identity token received from provider.' };
  }

  const targetEndpoint = provider === 'microsoft' ? '/Auth/microsoft' : '/Auth/google';

  try {
    const response: ApiResponse<any> = await api.post(targetEndpoint, { idToken });

    // Clean up stored state and URL hash
    try {
      localStorage.removeItem('sso_pending_provider');
      window.history.replaceState(null, '', window.location.pathname.replace(/\/auth\/callback\/?$/, '') || '/');
    } catch {
      // Fallback
    }

    if (response.success && response.data) {
      const token = response.data.token || '';
      const user: SsoUser = {
        id: response.data.userId || 'u-sso',
        fullName: response.data.fullName || response.data.email?.split('@')[0] || 'Parish Member',
        email: response.data.email,
        phone: response.data.phone || '',
        role: response.data.role || 'Member',
        mustChangePassword: response.data.mustChangePassword || false,
        isActive: true,
        token
      };

      if (token) {
        setAuthSession(token, user);
      }

      return { isCallback: true, success: true, user };
    }

    return {
      isCallback: true,
      success: false,
      error: response.message || 'SSO authentication failed on the server.'
    };
  } catch (err: any) {
    return {
      isCallback: true,
      success: false,
      error: err?.message || 'Network error communicating with the authentication server.'
    };
  }
}
