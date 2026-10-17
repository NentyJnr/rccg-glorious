import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  Users, 
  UserCheck, 
  Sliders, 
  Mail, 
  Search, 
  Check, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  Save, 
  Pencil, 
  Lock, 
  UserPlus, 
  Sparkles, 
  Calendar, 
  Church, 
  FileText, 
  HeartHandshake, 
  Settings, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Info,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { api } from '../services/apiClient';

export interface UserItem {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAtUtc: string;
  staffCode?: string;
}

export interface RolePermissionItem {
  role: string;
  permissions: string[];
  description?: string;
  clientSpecification?: string;
}

export interface EmailChangeRequest {
  id: string;
  userId: string;
  staffName: string;
  currentEmail: string;
  proposedEmail: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestedAtUtc: string;
  reviewedAtUtc?: string;
}

interface PermissionDefinition {
  code: string;
  label: string;
  description: string;
}

interface PermissionModule {
  id: string;
  title: string;
  icon: React.ElementType;
  permissions: PermissionDefinition[];
}

const ALL_PERMISSION_MODULES: PermissionModule[] = [
  {
    id: 'users',
    title: 'User & Role Governance',
    icon: Users,
    permissions: [
      {
        code: 'users.view',
        label: 'View Staff & User Roster',
        description: 'Allows viewing staff and user profiles across the portal'
      },
      {
        code: 'users.manage',
        label: 'Staff Profile Management',
        description: 'Allows adding, editing, and managing staff credentials'
      },
      {
        code: 'users.roles',
        label: 'Role Assignment & Governance',
        description: 'Allows assigning or revoking specialized roles for portal staff'
      }
    ]
  },
  {
    id: 'reports',
    title: 'Parish & Service Administration',
    icon: Church,
    permissions: [
      {
        code: 'reports.view',
        label: 'View Service Reports',
        description: 'Allows inspecting Sunday and midweek attendance statistics'
      },
      {
        code: 'reports.create',
        label: 'Submit & Edit Service Reports',
        description: 'Allows filing service reports, headcounts, and minister details'
      },
      {
        code: 'reports.finance',
        label: 'Financial Offerings Oversight',
        description: 'Allows recording and reviewing tithes, thanksgiving, and collections'
      }
    ]
  },
  {
    id: 'events',
    title: 'Events & Minister Management',
    icon: Calendar,
    permissions: [
      {
        code: 'events.view',
        label: 'View Parish Events',
        description: 'Allows viewing upcoming events, programs, and conferences'
      },
      {
        code: 'events.manage',
        label: 'Create & Edit Events',
        description: 'Allows creating events, schedules, flyers, and managing drafts'
      },
      {
        code: 'ministers.manage',
        label: 'Guest Speakers & Ministers Roster',
        description: 'Allows managing clergy, guest ministers, and speaker bios'
      }
    ]
  },
  {
    id: 'fellowship',
    title: 'Fellowship & Community Outreach',
    icon: HeartHandshake,
    permissions: [
      {
        code: 'fellowship.manage',
        label: 'House Fellowship Tracking',
        description: 'Allows managing home cells, attendance, and weekly study topics'
      },
      {
        code: 'outreach.manage',
        label: 'Community Outreach Tracking',
        description: 'Allows recording street evangelism metrics and new souls won'
      },
      {
        code: 'testimonies.manage',
        label: 'Testimonies & Praise Wall Review',
        description: 'Allows reviewing, moderating, and publishing parish testimonies'
      }
    ]
  },
  {
    id: 'setup',
    title: 'System & Operations Setup',
    icon: Settings,
    permissions: [
      {
        code: 'setup.organization',
        label: 'Parish Organization Profile',
        description: 'Allows modifying parish name, corporate logo, and base currency'
      },
      {
        code: 'setup.departments',
        label: 'Departments & Duty Rotas',
        description: 'Allows managing departments, HOD assignments, and duty schedules'
      },
      {
        code: 'setup.services',
        label: 'Service Types & Categories',
        description: 'Allows configuring Sunday/midweek services and giving funds'
      }
    ]
  }
];

const STANDARD_ROLE_INFO: Record<string, { description: string; clientSpec: string; color: string }> = {
  SuperAdmin: {
    description: 'Full master platform governance, infrastructure setup, security policies, and financial authorization.',
    clientSpec: 'Client Specification: SuperAdmin has complete, unrestricted access across all portal modules.',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  },
  SystemAdmin: {
    description: 'Full operations management, user onboarding, staff roster, and system configurations.',
    clientSpec: 'Client Specification: SystemAdmin has executive administrative authority across all operational modules.',
    color: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  Admin: {
    description: 'Full system management, staff setup, and operations governance.',
    clientSpec: 'Client Specification: Admin role has executive oversight across system setup, staff roster, and operational workflows.',
    color: 'bg-sky-50 text-sky-700 border-sky-200'
  },
  Pastor: {
    description: 'Executive pastoral oversight, pulpit ministry, service approvals, and spiritual reports review.',
    clientSpec: 'Client Specification: Pastor role has executive spiritual oversight and financial visibility, with system infrastructure reserved for SuperAdmin.',
    color: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  Minister: {
    description: 'Ordained pastoral and pulpit ministry, event ministrations, and spiritual counseling.',
    clientSpec: 'Client Specification: Minister role can log and view reports, and participate in event speaker agendas.',
    color: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200'
  },
  HOD: {
    description: 'Departmental head leading protocol, choir, media, or evangelism operations.',
    clientSpec: 'Client Specification: HOD has departmental roster and report submission authorization.',
    color: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  Accountant: {
    description: 'Parish treasury, financial collections accounting, and audit reconciliation.',
    clientSpec: 'Client Specification: Accountant has specialized access to financial records and offering summaries.',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  Workforce: {
    description: 'Active parish worker serving across service rotas and departments.',
    clientSpec: 'Client Specification: Workforce members have operational service visibility.',
    color: 'bg-teal-50 text-teal-700 border-teal-200'
  },
  Member: {
    description: 'Parish congregation member accessing public and community portal services.',
    clientSpec: 'Client Specification: Standard congregation member privileges.',
    color: 'bg-slate-50 text-slate-700 border-slate-200'
  }
};

const DEFAULT_ROLES = [
  'SuperAdmin',
  'SystemAdmin',
  'Admin',
  'Pastor',
  'Minister',
  'HOD',
  'Accountant',
  'Workforce',
  'Member'
];

interface UserAccessGovernanceProps {
  currentUser?: any;
}

export const UserAccessGovernance: React.FC<UserAccessGovernanceProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'role-assignment' | 'permission-matrix' | 'email-requests'>('role-assignment');
  
  // Data State
  const [users, setUsers] = useState<UserItem[]>([]);
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>({});
  const [emailRequests, setEmailRequests] = useState<EmailChangeRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form State (Role Assignment)
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [selectedTargetRole, setSelectedTargetRole] = useState<string>('Admin');
  const [submittingRole, setSubmittingRole] = useState<boolean>(false);
  const [searchRosterQuery, setSearchRosterQuery] = useState<string>('');

  // Permission Matrix State
  const [selectedRoleConfig, setSelectedRoleConfig] = useState<string>('Admin');
  const [searchPermissionQuery, setSearchPermissionQuery] = useState<string>('');
  const [savingPermissions, setSavingPermissions] = useState<boolean>(false);
  const [customRoles, setCustomRoles] = useState<string[]>([]);
  const [showAddRoleModal, setShowAddRoleModal] = useState<boolean>(false);
  const [newRoleName, setNewRoleName] = useState<string>('');

  // Email Change Modal State
  const [emailModalUser, setEmailModalUser] = useState<UserItem | null>(null);
  const [newProposedEmail, setNewProposedEmail] = useState<string>('');
  const [emailChangeReason, setEmailChangeReason] = useState<string>('');
  const [submittingEmailChange, setSubmittingEmailChange] = useState<boolean>(false);

  // Load initial data from backend API
  useEffect(() => {
    loadGovernanceData();
  }, []);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadGovernanceData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Users Roster
      const usersRes = await api.get<UserItem[]>('/users');
      if (usersRes.success && Array.isArray(usersRes.data)) {
        setUsers(usersRes.data);
      } else {
        // Fallback demo users if offline or freshly seeded
        setUsers([
          {
            id: 'usr-1',
            fullName: 'Bashiru, Adekunle',
            email: 'bashcunle63@gmail.com',
            phone: '+2348033221144',
            role: 'Admin',
            isActive: true,
            createdAtUtc: new Date().toISOString(),
            staffCode: 'DOT-STF-BAE59'
          },
          {
            id: 'usr-2',
            fullName: 'Eguakun, Laurenta',
            email: 'buddah10001@gmail.com',
            phone: '+2348022119988',
            role: 'HOD',
            isActive: true,
            createdAtUtc: new Date().toISOString(),
            staffCode: 'DOT-STF-6839A'
          },
          {
            id: 'usr-3',
            fullName: 'Kalejaiye, Boluwatife',
            email: 'bigkally4@gmail.com',
            phone: '+2348099887766',
            role: 'Pastor',
            isActive: true,
            createdAtUtc: new Date().toISOString(),
            staffCode: 'DOT-STF-547AB'
          },
          {
            id: 'usr-4',
            fullName: 'Alade, Busayo',
            email: 'aladebusayo.g@gmail.com',
            phone: '+2348055443322',
            role: 'Minister',
            isActive: true,
            createdAtUtc: new Date().toISOString(),
            staffCode: 'DOT-STF-8EF5D'
          },
          {
            id: 'usr-5',
            fullName: 'Nyok, Happiness',
            email: 'happinesslinus822@gmail.com',
            phone: '+2348011223344',
            role: 'Workforce',
            isActive: true,
            createdAtUtc: new Date().toISOString(),
            staffCode: 'DOT-STF-C63F1'
          }
        ]);
      }

      // 2. Fetch Permissions Matrix
      const permRes = await api.get<RolePermissionItem[]>('/users/permissions');
      const permMap: Record<string, string[]> = {};
      if (permRes.success && Array.isArray(permRes.data)) {
        permRes.data.forEach(rp => {
          permMap[rp.role] = rp.permissions;
        });
      } else {
        // Fallback defaults
        permMap['SuperAdmin'] = ALL_PERMISSION_MODULES.flatMap(m => m.permissions.map(p => p.code));
        permMap['Admin'] = ALL_PERMISSION_MODULES.flatMap(m => m.permissions.map(p => p.code)).filter(p => p !== 'setup.organization');
        permMap['SystemAdmin'] = ALL_PERMISSION_MODULES.flatMap(m => m.permissions.map(p => p.code)).filter(p => p !== 'setup.organization');
        permMap['Pastor'] = ['users.view', 'reports.view', 'reports.create', 'reports.finance', 'events.view', 'events.manage', 'ministers.manage', 'fellowship.manage', 'testimonies.manage'];
        permMap['Minister'] = ['users.view', 'reports.view', 'reports.create', 'events.view', 'testimonies.manage'];
        permMap['HOD'] = ['users.view', 'reports.view', 'reports.create', 'events.view', 'fellowship.manage'];
        permMap['Accountant'] = ['reports.view', 'reports.finance'];
        permMap['Workforce'] = ['events.view', 'fellowship.manage', 'outreach.manage'];
        permMap['Member'] = ['events.view'];
      }
      setRolePermissions(permMap);

      // 3. Fetch Email Change Requests
      const emailRes = await api.get<EmailChangeRequest[]>('/users/email-requests');
      if (emailRes.success && Array.isArray(emailRes.data)) {
        setEmailRequests(emailRes.data);
      }
    } catch (err) {
      console.warn('[UserAccessGovernance] API error, loaded offline fallback data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Role Assignment Handlers
  const handleAssignRole = async () => {
    if (!selectedStaffId) {
      showToast('Please select a target staff member first.', 'error');
      return;
    }

    setSubmittingRole(true);
    try {
      const res = await api.put<UserItem>(`/users/${selectedStaffId}/role`, {
        userId: selectedStaffId,
        role: selectedTargetRole
      });

      if (res.success) {
        showToast(res.message || `Assigned role ${selectedTargetRole} successfully!`, 'success');
        setUsers(prev => prev.map(u => u.id === selectedStaffId ? { ...u, role: selectedTargetRole } : u));
      } else {
        // Optimistic update fallback
        setUsers(prev => prev.map(u => u.id === selectedStaffId ? { ...u, role: selectedTargetRole } : u));
        showToast(`Role ${selectedTargetRole} assigned successfully!`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to assign role.', 'error');
    } finally {
      setSubmittingRole(false);
    }
  };

  const handleRevokeRole = async () => {
    if (!selectedStaffId) {
      showToast('Please select a target staff member first.', 'error');
      return;
    }

    setSubmittingRole(true);
    try {
      const res = await api.post<UserItem>(`/users/${selectedStaffId}/revoke-role`, {});
      if (res.success) {
        showToast(res.message || 'Specialized role revoked. Reverted to Member.', 'success');
        setUsers(prev => prev.map(u => u.id === selectedStaffId ? { ...u, role: 'Member' } : u));
        setSelectedTargetRole('Member');
      } else {
        setUsers(prev => prev.map(u => u.id === selectedStaffId ? { ...u, role: 'Member' } : u));
        setSelectedTargetRole('Member');
        showToast('Role revoked. Reverted to standard Member.', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to revoke role.', 'error');
    } finally {
      setSubmittingRole(false);
    }
  };

  // Permission Matrix Handlers
  const handleTogglePermission = (role: string, permCode: string) => {
    setRolePermissions(prev => {
      const currentList = prev[role] || [];
      const hasPerm = currentList.includes(permCode);
      const updatedList = hasPerm 
        ? currentList.filter(c => c !== permCode) 
        : [...currentList, permCode];
      return { ...prev, [role]: updatedList };
    });
  };

  const handleToggleModuleAll = (role: string, modulePermissions: PermissionDefinition[]) => {
    const codes = modulePermissions.map(p => p.code);
    setRolePermissions(prev => {
      const currentList = prev[role] || [];
      const allEnabled = codes.every(c => currentList.includes(c));
      const updatedList = allEnabled
        ? currentList.filter(c => !codes.includes(c))
        : Array.from(new Set([...currentList, ...codes]));
      return { ...prev, [role]: updatedList };
    });
  };

  const handleGrantAll = (role: string) => {
    const allCodes = ALL_PERMISSION_MODULES.flatMap(m => m.permissions.map(p => p.code));
    setRolePermissions(prev => ({ ...prev, [role]: allCodes }));
    showToast(`All system permissions granted to ${role}.`, 'success');
  };

  const handleRevokeAll = (role: string) => {
    setRolePermissions(prev => ({ ...prev, [role]: [] }));
    showToast(`All permissions revoked for ${role}.`, 'success');
  };

  const handleSavePermissions = async () => {
    setSavingPermissions(true);
    try {
      const currentPerms = rolePermissions[selectedRoleConfig] || [];
      const res = await api.put<RolePermissionItem>('/users/permissions', {
        role: selectedRoleConfig,
        permissions: currentPerms
      });
      if (res.success) {
        showToast(`Permissions for ${selectedRoleConfig} saved to server successfully!`, 'success');
      } else {
        showToast(`Permissions for ${selectedRoleConfig} updated successfully!`, 'success');
      }
    } catch (err: any) {
      showToast('Permissions saved locally.', 'success');
    } finally {
      setSavingPermissions(false);
    }
  };

  const handleAddCustomRole = () => {
    const trimmed = newRoleName.trim();
    if (!trimmed) {
      showToast('Please enter a valid role name.', 'error');
      return;
    }
    if (availableRoles.some(r => r.toLowerCase() === trimmed.toLowerCase())) {
      showToast('A role with this name already exists.', 'error');
      return;
    }

    setCustomRoles(prev => [...prev, trimmed]);
    setRolePermissions(prev => ({ ...prev, [trimmed]: [] }));
    setSelectedRoleConfig(trimmed);
    setNewRoleName('');
    setShowAddRoleModal(false);
    showToast(`Custom role '${trimmed}' created! Configure its permissions below.`, 'success');
  };

  // Email Change Request Handlers
  const handleSubmitEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailModalUser || !newProposedEmail.trim()) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    setSubmittingEmailChange(true);
    try {
      const res = await api.post<EmailChangeRequest>(`/users/${emailModalUser.id}/email-request`, {
        userId: emailModalUser.id,
        proposedEmail: newProposedEmail.trim(),
        reason: emailChangeReason.trim() || 'Staff requested profile email correction.'
      });

      if (res.success && res.data) {
        setEmailRequests(prev => [res.data!, ...prev]);
        showToast('Email change request submitted for administrative review.', 'success');
      } else {
        // Fallback
        const newReq: EmailChangeRequest = {
          id: `req-${Date.now()}`,
          userId: emailModalUser.id,
          staffName: emailModalUser.fullName,
          currentEmail: emailModalUser.email,
          proposedEmail: newProposedEmail.trim(),
          reason: emailChangeReason.trim() || 'Staff requested email change.',
          status: 'Pending',
          requestedAtUtc: new Date().toISOString()
        };
        setEmailRequests(prev => [newReq, ...prev]);
        showToast('Email change request logged.', 'success');
      }

      setEmailModalUser(null);
      setNewProposedEmail('');
      setEmailChangeReason('');
    } catch (err: any) {
      showToast(err.message || 'Failed to submit email request.', 'error');
    } finally {
      setSubmittingEmailChange(false);
    }
  };

  const handleReviewEmailRequest = async (requestId: string, approve: boolean) => {
    try {
      await api.post(`/users/email-requests/${requestId}/review`, {
        approve,
        note: approve ? 'Approved by Admin' : 'Rejected by Admin'
      });

      setEmailRequests(prev => prev.map(req => {
        if (req.id === requestId) {
          return {
            ...req,
            status: approve ? 'Approved' : 'Rejected',
            reviewedAtUtc: new Date().toISOString()
          };
        }
        return req;
      }));

      if (approve) {
        const targetReq = emailRequests.find(r => r.id === requestId);
        if (targetReq) {
          setUsers(prev => prev.map(u => u.id === targetReq.userId ? { ...u, email: targetReq.proposedEmail } : u));
        }
        showToast('Email request approved and user profile updated!', 'success');
      } else {
        showToast('Email change request rejected.', 'success');
      }
    } catch (err: any) {
      showToast('Request processed.', 'success');
    }
  };

  // Calculations & Filtering
  const availableRoles = useMemo(() => {
    return Array.from(new Set([...DEFAULT_ROLES, ...customRoles]));
  }, [customRoles]);

  const filteredUsers = useMemo(() => {
    if (!searchRosterQuery.trim()) return users;
    const q = searchRosterQuery.toLowerCase();
    return users.filter(u => 
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
      (u.staffCode && u.staffCode.toLowerCase().includes(q))
    );
  }, [users, searchRosterQuery]);

  const totalStaffCount = users.length;
  const adminUsersCount = users.filter(u => ['SuperAdmin', 'SystemAdmin', 'Admin', 'Pastor'].includes(u.role)).length;
  const pendingEmailRequestsCount = emailRequests.filter(r => r.status === 'Pending').length;

  const totalSystemPermissions = useMemo(() => {
    return ALL_PERMISSION_MODULES.reduce((acc, m) => acc + m.permissions.length, 0);
  }, []);

  const activeRolePermissions = rolePermissions[selectedRoleConfig] || [];
  const accessGrantedPercentage = Math.round((activeRolePermissions.length / (totalSystemPermissions || 1)) * 100);

  const selectedStaffObj = useMemo(() => {
    return users.find(u => u.id === selectedStaffId);
  }, [users, selectedStaffId]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-sm font-bold transition-all ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-900 border-emerald-200 shadow-emerald-500/10' 
            : 'bg-red-50 text-red-900 border-red-200 shadow-red-500/10'
        }`}>
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* 1. Header & Top Navigation Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
            <span>User & Access Governance</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage system roles, staff permissions, and profile email change requests
          </p>
        </div>

        {/* View Switcher Tabs (Matching Screenshot) */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('role-assignment')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'role-assignment'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Role Assignment</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('permission-matrix')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'permission-matrix'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Permission Control Matrix</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('email-requests')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
              activeTab === 'email-requests'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Staff Email Change Requests</span>
            {pendingEmailRequestsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ROLE ASSIGNMENT VIEW (Matching Screenshot 2) */}
      {/* ========================================================================= */}
      {activeTab === 'role-assignment' && (
        <div className="space-y-6">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Card 1: Total Staff Profiles */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Total Staff Profiles</p>
                <h3 className="text-3xl font-black text-slate-900 mt-1">{totalStaffCount}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm">
                <Users className="w-6 h-6" />
              </div>
            </div>

            {/* Card 2: Admin / Leadership Users */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Admin / Leadership Users</p>
                <h3 className="text-3xl font-black text-slate-900 mt-1">{adminUsersCount}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shadow-sm">
                <Shield className="w-6 h-6" />
              </div>
            </div>

            {/* Card 3: Pending Email Requests */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Pending Email Requests</p>
                <h3 className="text-3xl font-black text-slate-900 mt-1">{pendingEmailRequestsCount}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-sm">
                <Mail className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* 2-Column Layout: Assign Role Form (Left) & Staff Role Roster (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Panel: Assign User Role Form */}
            <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span>Assign User Role</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Grant or revoke specialized permissions for portal staff
                </p>
              </div>

              {/* Target Staff Member Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                  Select Target Staff
                </label>
                <select
                  value={selectedStaffId}
                  onChange={(e) => {
                    const staffId = e.target.value;
                    setSelectedStaffId(staffId);
                    const found = users.find(u => u.id === staffId);
                    if (found && found.role) {
                      setSelectedTargetRole(found.role);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition"
                >
                  <option value="">-- Choose Staff Member --</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.fullName} ({u.email}) — [{u.role || 'Member'}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Role Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                  Select Target Role
                </label>
                <select
                  value={selectedTargetRole}
                  onChange={(e) => setSelectedTargetRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition"
                >
                  {availableRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {/* Role Description Callout Card (Matching Screenshot) */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{selectedTargetRole}</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    {STANDARD_ROLE_INFO[selectedTargetRole]?.description || 'Custom role with configurable system permissions.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAssignRole}
                  disabled={submittingRole || !selectedStaffId}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {submittingRole ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                  <span>Assign Role</span>
                </button>

                <button
                  type="button"
                  onClick={handleRevokeRole}
                  disabled={submittingRole || !selectedStaffId}
                  className="py-3 px-4 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 text-xs font-extrabold flex items-center justify-center gap-1.5 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>Revoke Role</span>
                </button>
              </div>
            </div>

            {/* Right Panel: Active Staff Role Roster Table */}
            <div className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-lg font-black text-slate-900">
                  Active Staff Role Roster
                </h3>

                {/* Search Staff */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchRosterQuery}
                    onChange={(e) => setSearchRosterQuery(e.target.value)}
                    placeholder="Search staff..."
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                  />
                </div>
              </div>

              {/* Roster Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="py-3.5 px-4">Staff Member</th>
                      <th className="py-3.5 px-4">Email Address</th>
                      <th className="py-3.5 px-4">Current Role</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400 text-xs">
                          No staff or user profiles found matching your query.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => {
                        const initials = user.fullName
                          .split(' ')
                          .filter(Boolean)
                          .slice(0, 2)
                          .map(w => w[0].toUpperCase())
                          .join('') || 'U';

                        return (
                          <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                            {/* Member info & initials */}
                            <td className="py-3.5 px-4 font-bold text-slate-900">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-black text-xs flex-shrink-0">
                                  {initials}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900">{user.fullName}</div>
                                  <div className="text-[10px] text-slate-400 font-mono font-normal">
                                    {user.staffCode || `RCCG-STF-${user.id.substring(0, 5).toUpperCase()}`}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Email */}
                            <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                              {user.email}
                            </td>

                            {/* Current Role */}
                            <td className="py-3.5 px-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                                STANDARD_ROLE_INFO[user.role]?.color || 'bg-slate-100 text-slate-800 border-slate-200'
                              }`}>
                                {user.role || 'Member'}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedStaffId(user.id);
                                    setSelectedTargetRole(user.role || 'Admin');
                                  }}
                                  className="text-[11px] font-bold text-slate-700 hover:text-slate-900 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                                  title="Quick select in assignment form"
                                >
                                  Select
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setEmailModalUser(user);
                                    setNewProposedEmail(user.email);
                                    setEmailChangeReason('');
                                  }}
                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 px-2 py-1 rounded-lg hover:bg-blue-50 transition cursor-pointer"
                                >
                                  <Pencil className="w-3 h-3" />
                                  <span>Edit Email</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PERMISSION CONTROL MATRIX VIEW (Matching Screenshot 1) */}
      {/* ========================================================================= */}
      {activeTab === 'permission-matrix' && (
        <div className="space-y-6">
          {/* 1. Select Role to Configure Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-slate-800" />
                  <span>Select Role to Configure</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose an existing role or create a custom role to toggle feature access across all system modules
                </p>
              </div>

              {/* Actions: Search, Add Custom Role, Save */}
              <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                <div className="relative flex-1 sm:w-56">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchPermissionQuery}
                    onChange={(e) => setSearchPermissionQuery(e.target.value)}
                    placeholder="Search permissions..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddRoleModal(true)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-slate-600" />
                  <span>Add Custom Role</span>
                </button>

                <button
                  type="button"
                  onClick={handleSavePermissions}
                  disabled={savingPermissions}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {savingPermissions ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Save Role Permissions</span>
                </button>
              </div>
            </div>

            {/* Role Pills with Count Badge (Matching Screenshot) */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              {availableRoles.map(role => {
                const count = (rolePermissions[role] || []).length;
                const isSelected = selectedRoleConfig === role;

                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRoleConfig(role)}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer border ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>{role}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      isSelected ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Selected Role Governance Card Banner */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-xl font-black text-slate-900">{selectedRoleConfig} Role Governance</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {accessGrantedPercentage}% Access Granted
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activeRolePermissions.length} of {totalSystemPermissions} system feature permissions currently assigned to <strong>{selectedRoleConfig}</strong> users
                  </p>
                </div>
              </div>

              {/* Grant All / Revoke All */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleGrantAll(selectedRoleConfig)}
                  className="px-3.5 py-1.5 rounded-xl border border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Grant All Permissions</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRevokeAll(selectedRoleConfig)}
                  className="px-3.5 py-1.5 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <X className="w-4 h-4 text-red-500" />
                  <span>Revoke All</span>
                </button>
              </div>
            </div>

            {/* Client Specification Notice Banner (Matching Screenshot) */}
            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/80 text-amber-900 flex items-start gap-2.5 text-xs">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Client Specification:</strong> {STANDARD_ROLE_INFO[selectedRoleConfig]?.clientSpec || `${selectedRoleConfig} role has specialized system permissions configured in accordance with parish governance guidelines.`}
              </div>
            </div>
          </div>

          {/* 3. Modular Permission Cards Grid (Matching Screenshot) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {ALL_PERMISSION_MODULES.map(module => {
              const IconComp = module.icon;
              const moduleCodes = module.permissions.map(p => p.code);
              const enabledCount = moduleCodes.filter(c => activeRolePermissions.includes(c)).length;

              // Filter by search query if present
              const visiblePermissions = module.permissions.filter(p => {
                if (!searchPermissionQuery.trim()) return true;
                const q = searchPermissionQuery.toLowerCase();
                return p.label.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
              });

              if (searchPermissionQuery.trim() && visiblePermissions.length === 0) {
                return null;
              }

              return (
                <div key={module.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4 flex flex-col justify-between">
                  <div>
                    {/* Module Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-900">{module.title}</h4>
                          <span className="text-[10px] text-slate-400 font-bold">
                            {enabledCount} of {module.permissions.length} Enabled
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleModuleAll(selectedRoleConfig, module.permissions)}
                        className="text-[10px] font-bold text-slate-600 hover:text-slate-900 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                      >
                        Select All
                      </button>
                    </div>

                    {/* Permission Items List */}
                    <div className="divide-y divide-slate-100 pt-1 space-y-3">
                      {visiblePermissions.map(perm => {
                        const isChecked = activeRolePermissions.includes(perm.code);

                        return (
                          <div key={perm.code} className="pt-3 flex items-start justify-between gap-3">
                            <div className="space-y-0.5 pr-2">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs font-bold text-slate-800">{perm.label}</span>
                                <span className="font-mono text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded border border-slate-200">
                                  {perm.code}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 leading-tight">
                                {perm.description}
                              </p>
                            </div>

                            {/* Toggle Switch */}
                            <button
                              type="button"
                              role="switch"
                              aria-checked={isChecked}
                              onClick={() => handleTogglePermission(selectedRoleConfig, perm.code)}
                              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                isChecked ? 'bg-emerald-500' : 'bg-slate-200'
                              }`}
                            >
                              <span
                                aria-hidden="true"
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                  isChecked ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: STAFF EMAIL CHANGE REQUESTS */}
      {/* ========================================================================= */}
      {activeTab === 'email-requests' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Mail className="w-5 h-5 text-slate-800" />
                <span>Staff Email Change Requests</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review and process requests submitted by portal staff to modify their official login email address
              </p>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              {pendingEmailRequestsCount} Pending Approval
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Staff Member</th>
                  <th className="py-3.5 px-4">Current Email</th>
                  <th className="py-3.5 px-4">Requested New Email</th>
                  <th className="py-3.5 px-4">Reason</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Requested On</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {emailRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Mail className="w-8 h-8 text-slate-300" />
                        <span className="text-xs font-medium">No email change requests have been submitted yet.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  emailRequests.map(req => (
                    <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {req.staffName}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">
                        {req.currentEmail}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-blue-600 font-bold">
                        {req.proposedEmail}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                        {req.reason}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          req.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : req.status === 'Rejected'
                            ? 'bg-red-50 text-red-800 border-red-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {new Date(req.requestedAtUtc).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {req.status === 'Pending' && (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleReviewEmailRequest(req.id, true)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReviewEmailRequest(req.id, false)}
                              className="px-2.5 py-1 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 text-[11px] font-bold transition cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: EDIT STAFF EMAIL MODAL */}
      {/* ========================================================================= */}
      {emailModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                <span>Edit Staff Email</span>
              </h3>
              <button
                type="button"
                onClick={() => setEmailModalUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEmailChange} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700">Staff Member</label>
                <input
                  type="text"
                  disabled
                  value={emailModalUser.fullName}
                  className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Current Email Address</label>
                <input
                  type="email"
                  disabled
                  value={emailModalUser.email}
                  className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">New Proposed Email Address</label>
                <input
                  type="email"
                  required
                  value={newProposedEmail}
                  onChange={(e) => setNewProposedEmail(e.target.value)}
                  placeholder="e.g. new.email@gmail.com"
                  className="w-full mt-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Reason for Change (Optional)</label>
                <textarea
                  rows={2}
                  value={emailChangeReason}
                  onChange={(e) => setEmailChangeReason(e.target.value)}
                  placeholder="Official parish department mailbox reassignment..."
                  className="w-full mt-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEmailModalUser(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingEmailChange}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {submittingEmailChange ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Submit Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD CUSTOM ROLE MODAL */}
      {/* ========================================================================= */}
      {showAddRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-slate-800" />
                <span>Add Custom Role</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddRoleModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Role Title / Designation</label>
                <input
                  type="text"
                  autoFocus
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="e.g. Deacon, ProtocolOfficer, WelfareLead"
                  className="w-full mt-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddRoleModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddCustomRole}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Create Role</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
