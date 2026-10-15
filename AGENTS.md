# Project Instructions & Rules: RCCG Glorious Church Parish Management System

## Architectural Principles & Rules
- **Enterprise Single Sign-On (SSO)**: All login experiences in this application support both Google OAuth 2.0 and Microsoft Entra ID (Azure AD) SSO, alongside secure username/password credentials. See [enterprise_sso.md](file:///c:/Development/CMS/.agents/rules/enterprise_sso.md).
- **Backend Architecture**: ASP.NET Core 9 Web API using Clean Architecture (`CMS.API`, `CMS.Application`, `CMS.Domain`, `CMS.Infrastructure`).
- **Frontend Architecture**: React 19 + TypeScript + Vite + Tailwind CSS.
- **API Envelope Standard**: All API endpoints return `{ success: boolean, message: string, data: T }`.
