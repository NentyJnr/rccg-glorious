# Enterprise Authentication & Single Sign-On (SSO) Standard

## 1. Mandate
- Unless explicitly instructed otherwise by the user, ALL web applications, backend APIs, and frontend client templates created or modified in this workspace MUST implement Single Sign-On (SSO) supporting both **Google OAuth 2.0** and **Microsoft Entra ID (Azure AD)**.
- Local username/password authentication may exist as a development fallback, but Google and Microsoft SSO buttons and token verification flows are mandatory primary login options.

## 2. Security & Architecture Invariants
- **Zero Vendor Lock-in & Cryptographic Server Validation**: Identity provider tokens (OIDC `id_token`) must be cryptographically validated on the server using public JWKS before issuing system JWTs.
- **Provider-Based Architecture**: Authentication must follow plug-and-play provider interfaces (`ISsoTokenValidatorService`, `ISsoUserProvisioningService`).
- **Just-In-Time (JIT) Provisioning**: If a user authenticates via SSO with a verified email address for the first time, the system must provision their user entity atomically, set `MustChangePassword = false`, assign default membership/staff roles, and issue a system JWT session token.
- **Secrets Isolation**: Client IDs are configured via environment variables and `appsettings.json`. Identity provider client secrets are NEVER bundled or exposed in frontend clients.
