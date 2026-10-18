/// <reference types="vite/client" />

/**
 * RCCG Glorious Parish CMS Portal - Centralized Enterprise API Client
 * Connects the React 19 Frontend with the Live ASP.NET Core 9.0 Web API (MonsterASP)
 */

function resolveApiBaseUrl(): string {
  const envUrl = (
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    import.meta.env.NEXT_PUBLIC_API_URL ||
    ''
  ).trim();

  let base = envUrl;
  if (!base) {
    base = import.meta.env.PROD 
      ? 'https://rccggloriouschurch.runasp.net/api/v1' 
      : 'http://localhost:5230/api/v1';
  }

  base = base.replace(/\/+$/, '');
  if (!base.endsWith('/api/v1') && !base.includes('/api/')) {
    base = `${base}/api/v1`;
  }

  return base;
}

export const API_BASE_URL = resolveApiBaseUrl();

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
  status: number;
}

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem('cms_auth_token');
  } catch {
    return null;
  }
}

export function setAuthSession(token: string, user: any) {
  try {
    localStorage.setItem('cms_auth_token', token);
    localStorage.setItem('cms_auth_user', JSON.stringify(user));
  } catch (err) {
    console.error('[API Client] Failed to store auth session:', err);
  }
}

export function clearAuthSession() {
  try {
    localStorage.removeItem('cms_auth_token');
    localStorage.removeItem('cms_auth_user');
  } catch (err) {
    console.error('[API Client] Failed to clear auth session:', err);
  }
}

function buildHeaders(customHeaders?: HeadersInit, isFormData?: boolean): Headers {
  const headers = new Headers(customHeaders);
  if (!isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  const token = getAuthToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return headers;
}

function resolveUrl(endpoint: string): string {
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
}

async function request<T>(endpoint: string, init?: RequestInit): Promise<ApiResponse<T>> {
  const url = resolveUrl(endpoint);
  const isFormData = typeof FormData !== 'undefined' && init?.body instanceof FormData;
  const headers = buildHeaders(init?.headers, isFormData);

  try {
    const res = await fetch(url, {
      ...init,
      headers
    });

    const contentType = res.headers.get('content-type') || '';
    let json: any = null;
    if (contentType.includes('application/json')) {
      json = await res.json();
    }

    if (res.status === 401) {
      console.warn('[API Client] 401 Unauthorized encountered. Dispatching session expiry.');
      window.dispatchEvent(new CustomEvent('cms:unauthorized'));
    }

    if (res.ok) {
      return {
        success: json?.success ?? true,
        message: json?.message,
        data: json?.data !== undefined ? json.data : (json as T),
        status: res.status
      };
    }

    return {
      success: false,
      message: json?.message || `Request failed with status ${res.status}`,
      errors: json?.errors || [],
      status: res.status
    };
  } catch (error: any) {
    console.error(`[API Client Network Error] ${init?.method || 'GET'} ${url}:`, error);
    return {
      success: false,
      message: error?.message || 'Network unreachable. Please check your internet connection.',
      status: 0
    };
  }
}

// Typed API Client
export const api = {
  get: <T>(endpoint: string, init?: RequestInit) =>
    request<T>(endpoint, { ...init, method: 'GET' }),

  post: <T>(endpoint: string, body?: any, init?: RequestInit) =>
    request<T>(endpoint, {
      ...init,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined
    }),

  upload: <T>(endpoint: string, formData: FormData, init?: RequestInit) =>
    request<T>(endpoint, {
      ...init,
      method: 'POST',
      body: formData
    }),

  put: <T>(endpoint: string, body?: any, init?: RequestInit) =>
    request<T>(endpoint, {
      ...init,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined
    }),

  delete: <T>(endpoint: string, init?: RequestInit) =>
    request<T>(endpoint, { ...init, method: 'DELETE' }),

  /**
   * Ping backend to test connectivity to MonsterASP / local API
   */
  async checkHealth(): Promise<{ online: boolean; environment?: string }> {
    try {
      // MonsterASP root endpoint returns { status: "Healthy", service: "...", environment: "Production" }
      const rootUrl = API_BASE_URL.replace(/\/api\/v1\/?$/, '');
      const res = await fetch(`${rootUrl}/`, { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        return { online: true, environment: data?.environment || 'Production' };
      }
      return { online: false };
    } catch {
      return { online: false };
    }
  }
};

// Legacy exports for backwards compatibility with any remaining call sites
export async function fetchApiData<T>(endpoint: string, fallbackData: T): Promise<T> {
  const result = await api.get<T>(endpoint);
  return result.success && result.data !== undefined ? result.data : fallbackData;
}

export async function postApiData<T>(endpoint: string, payload: any, fallbackData?: T): Promise<{ success: boolean; data?: T; message?: string }> {
  const result = await api.post<T>(endpoint, payload);
  if (result.success) {
    return { success: true, data: result.data, message: result.message };
  }
  return { success: false, data: fallbackData, message: result.message };
}

export async function putApiData<T>(endpoint: string, payload: any): Promise<{ success: boolean; data?: T; message?: string }> {
  const result = await api.put<T>(endpoint, payload);
  return { success: result.success, data: result.data, message: result.message };
}

export async function deleteApiData(endpoint: string): Promise<{ success: boolean; message?: string }> {
  const result = await api.delete(endpoint);
  return { success: result.success, message: result.message };
}
