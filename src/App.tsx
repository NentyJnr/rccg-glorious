import React, { useState, useEffect } from 'react';
import { 
  Church, 
  Users, 
  Calendar, 
  DollarSign, 
  UserPlus, 
  ShieldCheck, 
  HeartHandshake, 
  MapPin, 
  Settings, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Sparkles,
  FileText,
  Lock,
  Mail,
  Phone,
  RefreshCw,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Activity,
  X,
  Clock,
  Sliders,
  Plus,
  Upload,
  Trash2,
  Pencil,
  Link,
  Globe
} from 'lucide-react';
import { LoginPage } from './components/LoginPage';
import { ChurchWebsite } from './components/ChurchWebsite';
import { PortalComingSoonPage } from './components/PortalComingSoonPage';

interface OrganizationSetting {
  parishName: string;
  logoUrl: string;
  baseCurrency: string;
}

interface Minister {
  id: string;
  title: string;
  fullName: string;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  mustChangePassword: boolean;
  isActive: boolean;
}

interface OfferingItem {
  categoryId: string;
  name: string;
  amount: number;
}

interface ServiceReport {
  id: string;
  serviceTypeName: string;
  category: 'Midweek' | 'Sunday';
  serviceDate: string;
  menCount: number;
  womenCount: number;
  childrenCount: number;
  totalAttendance: number;
  firstTimersCount: number;
  newConvertsCount: number;
  preacherName?: string;
  totalOffering: number;
}

export interface HouseFellowshipReportItem {
  id: string;
  centerName: string;
  reportDate: string;
  menCount: number;
  womenCount: number;
  childrenCount: number;
  totalAttendance: number;
  offeringAmount: number;
  studyTopic: string;
  leaderName?: string;
}

export interface OutreachReportItem {
  id: string;
  locationName: string;
  reportDate: string;
  menReached: number;
  womenReached: number;
  childrenReached: number;
  totalReached: number;
  soulsWonCount: number;
  leaderName?: string;
}

interface ServiceCategoryItem {
  id: string;
  name: string;
  description?: string;
  colorTheme?: string;
}

interface ServiceTypeItem {
  id: string;
  name: string;
  category: string;
  code?: string;
  defaultDay?: string;
  defaultTime?: string;
  leadMinisterId?: string;
  trackAttendance: boolean;
  trackOfferings: boolean;
  description?: string;
  isActive: boolean;
}

interface OfferingCategoryItem {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
}

interface DepartmentItem {
  id: string;
  name: string;
  code: string;
  headOfDepartment?: string;
  description?: string;
  meetingSchedule?: string;
  isActive: boolean;
}

export default function App() {
  const [viewMode, setViewMode] = useState<'website' | 'portal'>('website');
  const [showDraftLogin, setShowDraftLogin] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'service-report' | 'users' | 'fellowship' | 'setup'>('dashboard');
  
  // Organization Branding State
  const [org, setOrg] = useState<OrganizationSetting>({
    parishName: 'RCCG Glorious Church',
    logoUrl: '/glorious_church_logo.png',
    baseCurrency: 'NGN'
  });

  // --- SETUP & USER MANAGEMENT SUB-TABS & DATA COLLECTIONS ---
  const [userSubTab, setUserSubTab] = useState<'portal-users' | 'ministers'>('portal-users');
  const [setupSubTab, setSetupSubTab] = useState<'service-types' | 'offering-categories' | 'departments' | 'branding'>('service-types');

  // Configured Service Categories
  const [serviceCategories, setServiceCategories] = useState<ServiceCategoryItem[]>([
    { id: 'sc1', name: 'Sunday Service', description: 'Main Lord’s Day Worship Services', colorTheme: 'blue' },
    { id: 'sc2', name: 'Midweek Service', description: 'Tuesday Digging Deep & Thursday Faith Clinic', colorTheme: 'emerald' },
    { id: 'sc3', name: 'Special Program / Vigil', description: 'Holy Ghost Night, monthly vigils, and revival programs', colorTheme: 'emerald' },
    { id: 'sc4', name: 'Youth & Young Adults', description: 'Youth Church & Teenagers Fellowship', colorTheme: 'purple' },
    { id: 'sc5', name: 'Outreach & Evangelism', description: 'Church on the Street and Missions', colorTheme: 'red' }
  ]);

  // Service Types Setup State
  const [serviceTypes, setServiceTypes] = useState<ServiceTypeItem[]>([
    { id: 'st1', name: 'Sunday 1st Service', category: 'Sunday Service', code: 'SUN-01', defaultDay: 'Sunday', defaultTime: '07:30 AM', trackAttendance: true, trackOfferings: true, isActive: true },
    { id: 'st2', name: 'Sunday 2nd Service', category: 'Sunday Service', code: 'SUN-02', defaultDay: 'Sunday', defaultTime: '09:30 AM', trackAttendance: true, trackOfferings: true, isActive: true },
    { id: 'st3', name: 'Digging Deep (Bible Study)', category: 'Midweek Service', code: 'MDW-01', defaultDay: 'Tuesday', defaultTime: '06:00 PM', trackAttendance: true, trackOfferings: true, isActive: true },
    { id: 'st4', name: 'Faith Clinic (Prayer Meeting)', category: 'Midweek Service', code: 'MDW-02', defaultDay: 'Thursday', defaultTime: '06:00 PM', trackAttendance: true, trackOfferings: true, isActive: true },
    { id: 'st5', name: 'Holy Ghost Night / Vigil', category: 'Special Program / Vigil', code: 'SPC-01', defaultDay: 'First Friday', defaultTime: '10:00 PM', trackAttendance: true, trackOfferings: true, isActive: true },
    { id: 'st6', name: 'Thanksgiving & Anointing Service', category: 'Sunday Service', code: 'SUN-03', defaultDay: 'First Sunday', defaultTime: '08:30 AM', trackAttendance: true, trackOfferings: true, isActive: true }
  ]);

  // Offering Categories Setup State
  const [offeringCategories, setOfferingCategories] = useState<OfferingCategoryItem[]>([
    { id: 'oc1', name: 'Sunday / Main Service Offering', code: 'OFF-01', isActive: true },
    { id: 'oc2', name: 'Tithe', code: 'TTH-01', isActive: true },
    { id: 'oc3', name: 'Thanksgiving Offering', code: 'THK-01', isActive: true },
    { id: 'oc4', name: 'Building Project Fund', code: 'BLD-01', isActive: true },
    { id: 'oc5', name: 'Missions & Evangelism', code: 'MIS-01', isActive: true },
    { id: 'oc6', name: 'Welfare & Mercy Fund', code: 'WLF-01', isActive: true }
  ]);

  // Ministers Directory Setup State
  const [ministers, setMinisters] = useState<Minister[]>([
    { id: 'm1', title: 'Pastor', fullName: 'Pastor E. A. Adeboye' },
    { id: 'm2', title: 'Pastor', fullName: 'Pastor Oluwaseun Adeleke' },
    { id: 'm3', title: 'Deaconess', fullName: 'Deaconess Mary Johnson' },
    { id: 'm4', title: 'Minister', fullName: 'Minister David Okafor' }
  ]);

  // Departments Setup State
  const [departments, setDepartments] = useState<DepartmentItem[]>([
    { id: 'd1', name: 'Ushering Department', code: 'USH-01', headOfDepartment: 'Deaconess Mary Johnson', meetingSchedule: 'Saturday 05:00 PM', description: 'Orderliness, guest reception, seating, and sanctuary protocol during services.', isActive: true },
    { id: 'd2', name: 'Choir & Music Ministry', code: 'CHO-01', headOfDepartment: 'Minister David Okafor', meetingSchedule: 'Saturday 04:00 PM', description: 'Praise and worship leadership, special ministration, and choir rehearsals.', isActive: true },
    { id: 'd3', name: 'Technical & Media Unit', code: 'TEC-01', headOfDepartment: 'Brother Samuel', meetingSchedule: 'Sunday 07:00 AM', description: 'Sound engineering, live streaming, projection, and media production.', isActive: true },
    { id: 'd4', name: 'Sunday School & Believers Class', code: 'SDS-01', headOfDepartment: 'Pastor Oluwaseun Adeleke', meetingSchedule: 'Sunday 07:45 AM', description: 'Doctrinal teaching, manual distribution, and discipleship classes.', isActive: true },
    { id: 'd5', name: 'Sanctuary Keepers', code: 'SNK-01', headOfDepartment: 'Sister Grace Usang', meetingSchedule: 'Saturday 07:00 AM', description: 'Sanctuary cleanliness, floral arrangement, and environment care.', isActive: true },
    { id: 'd6', name: 'Welfare & Mercy Unit', code: 'WLF-01', headOfDepartment: 'Deaconess Mary Johnson', meetingSchedule: 'First Sunday 12:00 PM', description: 'Member care, food/clothing support, and benevolent visitation.', isActive: true }
  ]);

  // Modal Visibility States
  const [isAddSetupModalOpen, setIsAddSetupModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

  // Detailed Service Type Modal Form State
  const [modalServiceName, setModalServiceName] = useState('');
  const [modalServiceCategory, setModalServiceCategory] = useState('Sunday Service');
  const [modalServiceCode, setModalServiceCode] = useState('');
  const [modalDefaultDay, setModalDefaultDay] = useState('Sunday');
  const [modalDefaultTime, setModalDefaultTime] = useState('08:00 AM');
  const [modalLeadMinister, setModalLeadMinister] = useState('');
  const [modalTrackAttendance, setModalTrackAttendance] = useState(true);
  const [modalTrackOfferings, setModalTrackOfferings] = useState(true);
  const [modalDescription, setModalDescription] = useState('');

  // New Category Inline Modal State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');

  // Setup Inline Inputs
  const [showAddSetupForm, setShowAddSetupForm] = useState(false);
  
  const [newOfferingName, setNewOfferingName] = useState('');
  const [newOfferingCode, setNewOfferingCode] = useState('');

  // Offering Category Edit & Delete State
  const [editingOfferingCategory, setEditingOfferingCategory] = useState<OfferingCategoryItem | null>(null);
  const [editOfferingName, setEditOfferingName] = useState('');
  const [editOfferingCode, setEditOfferingCode] = useState('');
  const [isEditOfferingModalOpen, setIsEditOfferingModalOpen] = useState(false);

  const [newMinisterTitle, setNewMinisterTitle] = useState('Pastor');
  const [newMinisterName, setNewMinisterName] = useState('');

  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [newDepartmentCode, setNewDepartmentCode] = useState('');
  const [newDepartmentHod, setNewDepartmentHod] = useState('');
  const [newDepartmentSchedule, setNewDepartmentSchedule] = useState('');
  const [newDepartmentDescription, setNewDepartmentDescription] = useState('');

  // Department Edit & Delete State
  const [editingDepartment, setEditingDepartment] = useState<DepartmentItem | null>(null);
  const [editDepartmentName, setEditDepartmentName] = useState('');
  const [editDepartmentCode, setEditDepartmentCode] = useState('');
  const [editDepartmentHod, setEditDepartmentHod] = useState('');
  const [editDepartmentSchedule, setEditDepartmentSchedule] = useState('');
  const [editDepartmentDescription, setEditDepartmentDescription] = useState('');
  const [isEditDepartmentModalOpen, setIsEditDepartmentModalOpen] = useState(false);

  const [users, setUsers] = useState<User[]>([
    { id: 'u1', fullName: 'John Doe (Admin)', email: 'admin@rccgvictory.org', phone: '+2348012345678', role: 'SystemAdmin', mustChangePassword: false, isActive: true },
    { id: 'u2', fullName: 'Grace Usang', email: 'grace@rccgvictory.org', phone: '+2348023456789', role: 'UsheringDepartment', mustChangePassword: true, isActive: true },
    { id: 'u3', fullName: 'Brother Samuel', email: 'samuel@rccgvictory.org', phone: '+2348034567890', role: 'HouseFellowshipLeader', mustChangePassword: true, isActive: true }
  ]);

  const [reports, setReports] = useState<ServiceReport[]>([
    {
      id: 'r1',
      serviceTypeName: 'Sunday 1st Service',
      category: 'Sunday',
      serviceDate: '2026-09-13',
      menCount: 140,
      womenCount: 180,
      childrenCount: 95,
      totalAttendance: 415,
      firstTimersCount: 18,
      newConvertsCount: 6,
      totalOffering: 245000
    },
    {
      id: 'r2',
      serviceTypeName: 'Digging Deep (Midweek)',
      category: 'Midweek',
      serviceDate: '2026-09-16',
      menCount: 65,
      womenCount: 85,
      childrenCount: 20,
      totalAttendance: 170,
      firstTimersCount: 4,
      newConvertsCount: 1,
      preacherName: 'Pastor Oluwaseun Adeleke',
      totalOffering: 68500
    }
  ]);

  // Notifications
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showNotification('Image file size must be under 5MB.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setOrg((prev) => ({ ...prev, logoUrl: event.target!.result as string }));
        showNotification('Parish Logo uploaded successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  // --- SETUP CREATION HANDLERS ---
  const handleSaveServiceTypeModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalServiceName.trim()) {
      showNotification('Service Type Name is required.', 'error');
      return;
    }

    const code = modalServiceCode.trim() || modalServiceName.trim().slice(0, 3).toUpperCase() + '-0' + (serviceTypes.length + 1);

    const newItem: ServiceTypeItem = {
      id: 'st_' + Date.now(),
      name: modalServiceName.trim(),
      category: modalServiceCategory,
      code: code,
      defaultDay: modalDefaultDay,
      defaultTime: modalDefaultTime,
      leadMinisterId: modalLeadMinister,
      trackAttendance: modalTrackAttendance,
      trackOfferings: modalTrackOfferings,
      description: modalDescription.trim(),
      isActive: true
    };

    setServiceTypes([newItem, ...serviceTypes]);
    showNotification(`Service Type "${newItem.name}" (${newItem.category}) configured successfully!`);
    
    setModalServiceName('');
    setModalServiceCode('');
    setModalDescription('');
    setIsAddSetupModalOpen(false);

    try {
      await fetch('http://localhost:5230/api/v1/Setup/service-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newItem.name, category: newItem.category, isActive: true })
      });
    } catch {}
  };

  const handleSaveCategoryModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      showNotification('Category Name is required.', 'error');
      return;
    }

    const newCat: ServiceCategoryItem = {
      id: 'sc_' + Date.now(),
      name: newCategoryName.trim(),
      description: newCategoryDescription.trim() || 'Custom Parish Service Category',
      colorTheme: 'blue'
    };

    setServiceCategories([...serviceCategories, newCat]);
    setModalServiceCategory(newCat.name);
    showNotification(`New Service Category "${newCat.name}" created!`);
    setNewCategoryName('');
    setNewCategoryDescription('');
    setIsAddCategoryModalOpen(false);
  };

  const handleAddOfferingCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfferingName.trim()) {
      showNotification('Offering category name is required.', 'error');
      return;
    }

    const code = newOfferingCode.trim() || newOfferingName.trim().slice(0, 4).toUpperCase();
    const newItem: OfferingCategoryItem = {
      id: 'oc_' + Date.now(),
      name: newOfferingName.trim(),
      code: code,
      isActive: true
    };

    setOfferingCategories([newItem, ...offeringCategories]);
    showNotification(`Offering Category "${newItem.name}" (${code}) added successfully!`);
    setNewOfferingName('');
    setNewOfferingCode('');
    setShowAddSetupForm(false);

    try {
      await fetch('http://localhost:5230/api/v1/Setup/offering-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newItem.name, code: code, isActive: true })
      });
    } catch {}
  };

  const handleStartEditOfferingCategory = (oc: OfferingCategoryItem) => {
    setEditingOfferingCategory(oc);
    setEditOfferingName(oc.name);
    setEditOfferingCode(oc.code);
    setIsEditOfferingModalOpen(true);
  };

  const handleUpdateOfferingCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOfferingCategory) return;
    if (!editOfferingName.trim()) {
      showNotification('Offering category name is required.', 'error');
      return;
    }

    const updatedCode = editOfferingCode.trim() || editOfferingName.trim().slice(0, 4).toUpperCase();
    const updatedItem: OfferingCategoryItem = {
      ...editingOfferingCategory,
      name: editOfferingName.trim(),
      code: updatedCode
    };

    setOfferingCategories((prev) =>
      prev.map((item) => (item.id === editingOfferingCategory.id ? updatedItem : item))
    );

    showNotification(`Offering Category "${updatedItem.name}" updated successfully!`);
    setIsEditOfferingModalOpen(false);
    setEditingOfferingCategory(null);

    try {
      await fetch(`http://localhost:5230/api/v1/Setup/offering-categories/${editingOfferingCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: updatedItem.name, code: updatedCode, isActive: true })
      });
    } catch {}
  };

  const handleDeleteOfferingCategory = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the offering category "${name}"?`)) return;

    setOfferingCategories((prev) => prev.filter((item) => item.id !== id));
    showNotification(`Offering Category "${name}" deleted successfully.`);

    try {
      await fetch(`http://localhost:5230/api/v1/Setup/offering-categories/${id}`, {
        method: 'DELETE'
      });
    } catch {}
  };

  const handleAddMinister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMinisterName.trim()) {
      showNotification('Minister full name is required.', 'error');
      return;
    }

    const newItem: Minister = {
      id: 'm_' + Date.now(),
      title: newMinisterTitle,
      fullName: `${newMinisterTitle} ${newMinisterName.trim()}`
    };

    setMinisters([newItem, ...ministers]);
    showNotification(`Minister "${newItem.fullName}" added to parish directory!`);
    setNewMinisterName('');
    setShowAddSetupForm(false);

    try {
      await fetch('http://localhost:5230/api/v1/Setup/ministers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newItem.title, fullName: newItem.fullName })
      });
    } catch {}
  };

  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDepartmentName.trim()) {
      showNotification('Department name is required.', 'error');
      return;
    }

    const code = newDepartmentCode.trim() || newDepartmentName.trim().slice(0, 3).toUpperCase() + '-01';
    const newDep: DepartmentItem = {
      id: 'd_' + Date.now(),
      name: newDepartmentName.trim(),
      code: code,
      headOfDepartment: newDepartmentHod.trim() || 'Unassigned',
      meetingSchedule: newDepartmentSchedule.trim() || 'To be scheduled',
      description: newDepartmentDescription.trim() || 'Parish department unit.',
      isActive: true
    };

    setDepartments([newDep, ...departments]);
    showNotification(`Department "${newDep.name}" configured successfully!`);
    setNewDepartmentName('');
    setNewDepartmentCode('');
    setNewDepartmentHod('');
    setNewDepartmentSchedule('');
    setNewDepartmentDescription('');
    setShowAddSetupForm(false);

    try {
      await fetch('http://localhost:5230/api/v1/Setup/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDep)
      });
    } catch {}
  };

  const handleStartEditDepartment = (dep: DepartmentItem) => {
    setEditingDepartment(dep);
    setEditDepartmentName(dep.name);
    setEditDepartmentCode(dep.code);
    setEditDepartmentHod(dep.headOfDepartment || '');
    setEditDepartmentSchedule(dep.meetingSchedule || '');
    setEditDepartmentDescription(dep.description || '');
    setIsEditDepartmentModalOpen(true);
  };

  const handleUpdateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDepartment) return;
    if (!editDepartmentName.trim()) {
      showNotification('Department name is required.', 'error');
      return;
    }

    const updatedCode = editDepartmentCode.trim() || editDepartmentName.trim().slice(0, 3).toUpperCase() + '-01';
    const updatedItem: DepartmentItem = {
      ...editingDepartment,
      name: editDepartmentName.trim(),
      code: updatedCode,
      headOfDepartment: editDepartmentHod.trim() || 'Unassigned',
      meetingSchedule: editDepartmentSchedule.trim() || 'To be scheduled',
      description: editDepartmentDescription.trim() || 'Parish department unit.'
    };

    setDepartments((prev) =>
      prev.map((item) => (item.id === editingDepartment.id ? updatedItem : item))
    );

    showNotification(`Department "${updatedItem.name}" updated successfully!`);
    setIsEditDepartmentModalOpen(false);
    setEditingDepartment(null);

    try {
      await fetch(`http://localhost:5230/api/v1/Setup/departments/${editingDepartment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
      });
    } catch {}
  };

  const handleDeleteDepartment = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the department "${name}"?`)) return;

    setDepartments((prev) => prev.filter((item) => item.id !== id));
    showNotification(`Department "${name}" deleted successfully.`);

    try {
      await fetch(`http://localhost:5230/api/v1/Setup/departments/${id}`, {
        method: 'DELETE'
      });
    } catch {}
  };

  // --- Dynamic Service Report Form State ---
  const [serviceCategory, setServiceCategory] = useState<'Midweek' | 'Sunday'>('Sunday');
  const [serviceTypeName, setServiceTypeName] = useState('Sunday 1st Service');
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [menCount, setMenCount] = useState<number>(100);
  const [womenCount, setWomenCount] = useState<number>(120);
  const [childrenCount, setChildrenCount] = useState<number>(60);
  const [firstTimers, setFirstTimers] = useState<number>(10);
  const [newConverts, setNewConverts] = useState<number>(3);
  
  // Midweek Specific
  const [selectedPreacher, setSelectedPreacher] = useState('Pastor Oluwaseun Adeleke');
  const [midweekOffering, setMidweekOffering] = useState<number>(45000);

  // Sunday Line Items Breakdown
  const [sundayOfferings, setSundayOfferings] = useState<OfferingItem[]>([
    { categoryId: 'c1', name: 'Workers Offering', amount: 35000 },
    { categoryId: 'c2', name: 'Sunday School Offering', amount: 20000 },
    { categoryId: 'c3', name: 'Children Offering', amount: 15000 },
    { categoryId: 'c4', name: 'Love Offering', amount: 50000 },
    { categoryId: 'c5', name: 'Thanksgiving & Dedication', amount: 75000 },
    { categoryId: 'c6', name: 'Firstfruit & Welfare', amount: 40000 }
  ]);

  const totalCalculatedAttendance = Number(menCount || 0) + Number(womenCount || 0) + Number(childrenCount || 0);
  const totalCalculatedOffering = serviceCategory === 'Midweek' 
    ? Number(midweekOffering || 0)
    : sundayOfferings.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const handleSundayOfferingChange = (index: number, val: number) => {
    const updated = [...sundayOfferings];
    updated[index].amount = val;
    setSundayOfferings(updated);
  };

  const handleServiceReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation Checks
    if (serviceCategory === 'Midweek' && !selectedPreacher) {
      showNotification('Preacher field is required for Midweek Services.', 'error');
      return;
    }

    const newReport: ServiceReport = {
      id: 'r_' + Date.now(),
      serviceTypeName: serviceTypeName,
      category: serviceCategory,
      serviceDate: serviceDate,
      menCount: Number(menCount),
      womenCount: Number(womenCount),
      childrenCount: Number(childrenCount),
      totalAttendance: totalCalculatedAttendance,
      firstTimersCount: Number(firstTimers),
      newConvertsCount: Number(newConverts),
      preacherName: serviceCategory === 'Midweek' ? selectedPreacher : undefined,
      totalOffering: totalCalculatedOffering
    };

    setReports([newReport, ...reports]);
    showNotification(`Service Report submitted successfully! Total Offering: ${org.baseCurrency} ${totalCalculatedOffering.toLocaleString()}`);
    setActiveTab('dashboard');
  };

  // --- Onboarding User Form State ---
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState('UsheringDepartment');
  const [createdTempCredentials, setCreatedTempCredentials] = useState<{ email: string; tempPass: string } | null>(null);

  const handleOnboardUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) {
      showNotification('Please fill in required user details.', 'error');
      return;
    }

    const tempPassword = 'Temp' + Math.random().toString(36).slice(-8) + '!';
    const newUser: User = {
      id: 'u_' + Date.now(),
      fullName: newUserName,
      email: newUserEmail,
      phone: newUserPhone,
      role: newUserRole,
      mustChangePassword: true,
      isActive: true
    };

    setUsers([newUser, ...users]);
    setCreatedTempCredentials({ email: newUserEmail, tempPass: tempPassword });
    showNotification(`User created! Onboarding email dispatched with temp password.`);
    
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
  };

  // --- Fellowship & Outreach Sub-tab State ---
  const [fellowshipSubTab, setFellowshipSubTab] = useState<'house-fellowship' | 'outreach'>('house-fellowship');

  // House Fellowship Form & Reports State
  const [fellowshipCenter, setFellowshipCenter] = useState('Grace Center - Victoria Island');
  const [fellowshipMen, setFellowshipMen] = useState<number>(8);
  const [fellowshipWomen, setFellowshipWomen] = useState<number>(12);
  const [fellowshipChildren, setFellowshipChildren] = useState<number>(5);
  const [fellowshipOffering, setFellowshipOffering] = useState<number>(25000);
  const [fellowshipTopic, setFellowshipTopic] = useState('Living a Life of Holiness');

  const [houseFellowshipReports, setHouseFellowshipReports] = useState<HouseFellowshipReportItem[]>([
    {
      id: 'hfr_1',
      centerName: 'Grace Center - Victoria Island',
      reportDate: '2026-09-20',
      menCount: 8,
      womenCount: 12,
      childrenCount: 5,
      totalAttendance: 25,
      offeringAmount: 25000,
      studyTopic: 'Living a Life of Holiness',
      leaderName: 'Brother Samuel'
    },
    {
      id: 'hfr_2',
      centerName: 'Faith Fellowship Center - Lekki Phase 1',
      reportDate: '2026-09-13',
      menCount: 12,
      womenCount: 15,
      childrenCount: 8,
      totalAttendance: 35,
      offeringAmount: 42000,
      studyTopic: 'Walking in Divine Favor',
      leaderName: 'Deaconess Mary Johnson'
    },
    {
      id: 'hfr_3',
      centerName: 'Victory Center - Ikoyi',
      reportDate: '2026-09-06',
      menCount: 10,
      womenCount: 14,
      childrenCount: 6,
      totalAttendance: 30,
      offeringAmount: 35000,
      studyTopic: 'The Power of Prevailing Prayer',
      leaderName: 'Sister Grace Usang'
    }
  ]);

  // Outreach Form & Reports State
  const [outreachLocation, setOutreachLocation] = useState('Market Square Outreach');
  const [outreachMen, setOutreachMen] = useState<number>(25);
  const [outreachWomen, setOutreachWomen] = useState<number>(30);
  const [outreachChildren, setOutreachChildren] = useState<number>(15);
  const [outreachSouls, setOutreachSouls] = useState<number>(14);

  const [outreachReports, setOutreachReports] = useState<OutreachReportItem[]>([
    {
      id: 'out_1',
      locationName: 'Market Square Outreach',
      reportDate: '2026-09-19',
      menReached: 25,
      womenReached: 30,
      childrenReached: 15,
      totalReached: 70,
      soulsWonCount: 14,
      leaderName: 'Minister David Okafor'
    },
    {
      id: 'out_2',
      locationName: 'Bus Terminal Evangelism Crusade',
      reportDate: '2026-09-12',
      menReached: 40,
      womenReached: 45,
      childrenReached: 20,
      totalReached: 105,
      soulsWonCount: 22,
      leaderName: 'Evang. Oluwaseun Adeleke'
    },
    {
      id: 'out_3',
      locationName: 'Community Medical & Gospel Outreach',
      reportDate: '2026-09-05',
      menReached: 60,
      womenReached: 75,
      childrenReached: 30,
      totalReached: 165,
      soulsWonCount: 31,
      leaderName: 'Deaconess Mary Johnson'
    }
  ]);

  const handleHouseFellowshipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fellowshipCenter.trim()) {
      showNotification('Center location name is required.', 'error');
      return;
    }

    const totalAtt = Number(fellowshipMen || 0) + Number(fellowshipWomen || 0) + Number(fellowshipChildren || 0);

    const newReport: HouseFellowshipReportItem = {
      id: 'hfr_' + Date.now(),
      centerName: fellowshipCenter.trim(),
      reportDate: new Date().toISOString().split('T')[0],
      menCount: Number(fellowshipMen || 0),
      womenCount: Number(fellowshipWomen || 0),
      childrenCount: Number(fellowshipChildren || 0),
      totalAttendance: totalAtt,
      offeringAmount: Number(fellowshipOffering || 0),
      studyTopic: fellowshipTopic.trim() || 'Holiness & Grace',
      leaderName: 'Brother Samuel'
    };

    setHouseFellowshipReports([newReport, ...houseFellowshipReports]);
    showNotification(`House Fellowship report for "${newReport.centerName}" submitted successfully!`);
  };

  const handleOutreachSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!outreachLocation.trim()) {
      showNotification('Outreach location is required.', 'error');
      return;
    }

    const totalR = Number(outreachMen || 0) + Number(outreachWomen || 0) + Number(outreachChildren || 0);

    const newReport: OutreachReportItem = {
      id: 'out_' + Date.now(),
      locationName: outreachLocation.trim(),
      reportDate: new Date().toISOString().split('T')[0],
      menReached: Number(outreachMen || 0),
      womenReached: Number(outreachWomen || 0),
      childrenReached: Number(outreachChildren || 0),
      totalReached: totalR,
      soulsWonCount: Number(outreachSouls || 0),
      leaderName: 'Evangelism Team'
    };

    setOutreachReports([newReport, ...outreachReports]);
    showNotification(`Outreach report for "${newReport.locationName}" (${newReport.soulsWonCount} souls won) submitted successfully!`);
  };

  // Current Authenticated User Session
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Sidebar Layout State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (viewMode === 'website') {
    return (
      <ChurchWebsite
        onOpenPortal={() => setViewMode('portal')}
        parishName={org.parishName}
      />
    );
  }

  if (!currentUser) {
    if (!showDraftLogin) {
      return (
        <PortalComingSoonPage
          onReturnToWebsite={() => setViewMode('website')}
          onOpenLiveLogin={() => setShowDraftLogin(true)}
          parishName={org.parishName}
        />
      );
    }

    return (
      <div>
        <div className="bg-slate-900 text-white text-xs py-2 px-4 flex items-center justify-between border-b border-slate-800">
          <span className="font-semibold text-emerald-400">RCCG CMS Administrative Portal (Draft Preview)</span>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowDraftLogin(false)}
              className="text-emerald-400 hover:text-emerald-300 text-xs font-mono"
            >
              &larr; Back to Coming Soon Page
            </button>
            <button
              onClick={() => setViewMode('website')}
              className="text-slate-300 hover:text-white underline text-xs font-mono"
            >
              Return to Website
            </button>
          </div>
        </div>
        <LoginPage
          onLoginSuccess={(u) => {
            setCurrentUser(u);
            showNotification(`Welcome back, ${u.fullName}! Signed in successfully.`);
          }}
          availableUsers={users}
          orgSetting={org}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans overflow-x-hidden">
      {/* MOBILE SIDEBAR OVERLAY */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)} 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* SIDEBAR NAVIGATION CONTAINER */}
      <aside className={`rccg-gradient-header text-white flex flex-col justify-between fixed md:sticky top-0 h-screen z-50 transition-all duration-300 shadow-xl ${
        mobileSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
      } ${isSidebarCollapsed ? 'md:w-20' : 'md:w-64'}`}>
        
        {/* BRANDING HEADER */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-md flex-shrink-0 flex items-center justify-center">
              <img src={org.logoUrl} alt="Parish Logo" className="h-8 w-8 object-contain" />
            </div>
            {!isSidebarCollapsed && (
              <div className="overflow-hidden">
                <span className="bg-rccg-red text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider block w-max">
                  RCCG Parish
                </span>
                <h1 className="text-xs font-extrabold tracking-tight text-white truncate mt-0.5">
                  {org.parishName}
                </h1>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition"
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* NAVIGATION ITEMS */}
        <div className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {!isSidebarCollapsed && (
            <div className="px-3 text-[10px] font-mono tracking-wider text-slate-400 uppercase mb-2">
              Main Menu
            </div>
          )}

          {/* DASHBOARD */}
          <button
            onClick={() => { setActiveTab('dashboard'); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'space-x-3 px-3.5'} py-3 rounded-xl text-xs font-bold transition ${
              activeTab === 'dashboard' 
                ? 'bg-emerald-500/20 text-white border border-emerald-400/40 shadow-inner' 
                : 'text-slate-200 hover:bg-white/10'
            }`}
            title="Dashboard"
          >
            <Church className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Dashboard</span>}
          </button>

          {/* SERVICE REPORTS */}
          <button
            onClick={() => { setActiveTab('service-report'); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'space-x-3 px-3.5'} py-3 rounded-xl text-xs font-bold transition ${
              activeTab === 'service-report' 
                ? 'bg-emerald-500/20 text-white border border-emerald-400/40 shadow-inner' 
                : 'text-slate-200 hover:bg-white/10'
            }`}
            title="Service Reports"
          >
            <FileText className="w-5 h-5 text-emerald-300 flex-shrink-0" />
            {!isSidebarCollapsed && (
              <div className="flex-1 flex items-center justify-between">
                <span>Service Reports</span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-400 text-slate-950 rounded">New</span>
              </div>
            )}
          </button>

          {/* USER MANAGEMENT */}
          <button
            onClick={() => { setActiveTab('users'); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'space-x-3 px-3.5'} py-3 rounded-xl text-xs font-bold transition ${
              activeTab === 'users' 
                ? 'bg-sky-500/20 text-white border border-sky-400/40 shadow-inner' 
                : 'text-slate-200 hover:bg-white/10'
            }`}
            title="User Management"
          >
            <Users className="w-5 h-5 text-sky-300 flex-shrink-0" />
            {!isSidebarCollapsed && <span>User Management</span>}
          </button>

          {/* FELLOWSHIP & OUTREACH */}
          <button
            onClick={() => { setActiveTab('fellowship'); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'space-x-3 px-3.5'} py-3 rounded-xl text-xs font-bold transition ${
              activeTab === 'fellowship' 
                ? 'bg-teal-500/20 text-white border border-teal-400/40 shadow-inner' 
                : 'text-slate-200 hover:bg-white/10'
            }`}
            title="Fellowship & Outreach"
          >
            <HeartHandshake className="w-5 h-5 text-teal-300 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Fellowship & Outreach</span>}
          </button>

          {/* SYSTEM SETUP */}
          <button
            onClick={() => { setActiveTab('setup'); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'space-x-3 px-3.5'} py-3 rounded-xl text-xs font-bold transition ${
              activeTab === 'setup' 
                ? 'bg-blue-500/20 text-white border border-blue-400/40 shadow-inner' 
                : 'text-slate-200 hover:bg-white/10'
            }`}
            title="System Setup"
          >
            <Settings className="w-5 h-5 text-slate-300 flex-shrink-0" />
            {!isSidebarCollapsed && (
              <div className="flex-1 flex items-center justify-between">
                <span>System Setup</span>
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              </div>
            )}
          </button>
        </div>

        {/* USER PROFILE & LOGOUT FOOTER */}
        <div className="p-3 border-t border-white/10 bg-slate-900/40">
          <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} gap-2`}>
            {!isSidebarCollapsed && (
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center text-xs font-extrabold flex-shrink-0">
                  {currentUser.fullName.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-white truncate">{currentUser.fullName}</div>
                  <div className="text-[10px] text-emerald-300 font-mono truncate uppercase">{currentUser.role}</div>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setCurrentUser(null);
                showNotification('Signed out of portal session.', 'success');
              }}
              title="Sign Out"
              className="p-2 rounded-lg bg-red-500/20 hover:bg-red-600 text-red-200 hover:text-white transition flex items-center justify-center flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WORKSPACE AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP WORKSPACE HEADER BAR */}
        <header className="bg-white border-b border-slate-200 h-16 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-medium">Portal /</span>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 capitalize tracking-tight flex items-center gap-2">
                {activeTab === 'dashboard' && <Church className="w-4 h-4 text-emerald-600" />}
                {activeTab === 'service-report' && <FileText className="w-4 h-4 text-emerald-600" />}
                {activeTab === 'users' && <Users className="w-4 h-4 text-sky-600" />}
                {activeTab === 'fellowship' && <HeartHandshake className="w-4 h-4 text-teal-600" />}
                {activeTab === 'setup' && <Settings className="w-4 h-4 text-blue-600" />}
                <span>{activeTab.replace('-', ' ')}</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setViewMode('website')}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 transition flex items-center space-x-1.5 shadow-sm"
              title="View Public Church Website"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Public Website</span>
            </button>

            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>Currency: <strong className="text-slate-800">{org.baseCurrency}</strong></span>
            </div>

            <button
              onClick={() => setActiveTab('service-report')}
              className="px-4 py-2 bg-rccg-blue hover:bg-blue-900 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center space-x-2"
            >
              <PlusCircle className="w-4 h-4 text-emerald-300" />
              <span className="hidden sm:inline">Submit Service Report</span>
            </button>
          </div>
        </header>

        {/* Global Notification Banner */}
        {notification && (
          <div className={`py-3 px-4 shadow-md text-white text-sm font-medium flex items-center justify-center space-x-2 transition ${
            notification.type === 'success' ? 'bg-rccg-green' : 'bg-rccg-red'
          }`}>
            {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Main Content Body */}
        <main className="p-4 sm:p-8 flex-1 w-full max-w-7xl mx-auto">
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Parish Analytics Overview</h2>
                <p className="text-slate-500 text-sm mt-1">Real-time attendance, financial metrics, and souls won across parish services.</p>
              </div>
              <button
                onClick={() => setActiveTab('service-report')}
                className="bg-rccg-blue hover:bg-rccg-navy text-white font-semibold px-5 py-2.5 rounded-xl shadow-md flex items-center space-x-2 transition"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Submit Service Report</span>
              </button>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-rccg-blue"></div>
                <div className="flex justify-between items-center text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Service Attendance</span>
                  <Users className="w-5 h-5 text-rccg-blue" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900">
                  {reports.reduce((sum, r) => sum + r.totalAttendance, 0).toLocaleString()}
                </div>
                <div className="text-xs text-emerald-600 font-semibold mt-2 flex items-center space-x-1">
                  <span>Across {reports.length} recorded services</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-rccg-green"></div>
                <div className="flex justify-between items-center text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Offerings ({org.baseCurrency})</span>
                  <DollarSign className="w-5 h-5 text-rccg-green" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900">
                  {org.baseCurrency} {reports.reduce((sum, r) => sum + r.totalOffering, 0).toLocaleString()}
                </div>
                <div className="text-xs text-slate-500 mt-2">Combined Sunday & Midweek summary</div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-rccg-red"></div>
                <div className="flex justify-between items-center text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">First Timers Registered</span>
                  <Sparkles className="w-5 h-5 text-rccg-red" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900">
                  {reports.reduce((sum, r) => sum + r.firstTimersCount, 0)}
                </div>
                <div className="text-xs text-rccg-red font-semibold mt-2">Ushering follow-up active</div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-emerald-600"></div>
                <div className="flex justify-between items-center text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Souls Won (New Converts)</span>
                  <HeartHandshake className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900">
                  {reports.reduce((sum, r) => sum + r.newConvertsCount, 0)}
                </div>
                <div className="text-xs text-emerald-600 font-semibold mt-2">Glory be to God!</div>
              </div>
            </div>

            {/* Recent Service Reports Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">Recent Service Submissions</h3>
                <span className="text-xs text-slate-500">Showing {reports.length} records</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 uppercase text-xs font-bold tracking-wider">
                    <tr>
                      <th className="py-3.5 px-6">Service & Category</th>
                      <th className="py-3.5 px-6">Date</th>
                      <th className="py-3.5 px-6">Preacher / Minister</th>
                      <th className="py-3.5 px-6">Attendance (M/W/C)</th>
                      <th className="py-3.5 px-6">Total Headcount</th>
                      <th className="py-3.5 px-6">Total Offering</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reports.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-4 px-6 font-semibold text-slate-900">
                          <div>{r.serviceTypeName}</div>
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                            r.category === 'Sunday' ? 'bg-blue-100 text-rccg-blue' : 'bg-emerald-100 text-rccg-green'
                          }`}>
                            {r.category} Service
                          </span>
                        </td>
                        <td className="py-4 px-6">{r.serviceDate}</td>
                        <td className="py-4 px-6 font-medium text-slate-700">
                          {r.preacherName ? r.preacherName : <span className="text-slate-400 italic">Embedded Breakdown</span>}
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-500">
                          {r.menCount} Men / {r.womenCount} Women / {r.childrenCount} Children
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-900">{r.totalAttendance}</td>
                        <td className="py-4 px-6 font-extrabold text-rccg-green">
                          {org.baseCurrency} {r.totalOffering.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SERVICE REPORTING TAB - Dynamic Form Engine */}
        {activeTab === 'service-report' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-rccg-blue/10 rounded-xl text-rccg-blue">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Service Attendance & Financial Report</h2>
                  <p className="text-xs text-slate-500">Dynamic workflow adapts based on Midweek vs Sunday service category selection.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleServiceReportSubmit} className="space-y-6">
              {/* Category & Service Type Selector */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                <h3 className="text-md font-bold text-slate-900 flex items-center space-x-2 border-b pb-3">
                  <Calendar className="w-5 h-5 text-rccg-blue" />
                  <span>1. Service Type & Date Configuration</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Service Category</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => { setServiceCategory('Sunday'); setServiceTypeName('Sunday 1st Service'); }}
                        className={`py-3 px-4 rounded-xl text-xs font-bold border text-center transition ${
                          serviceCategory === 'Sunday'
                            ? 'bg-rccg-blue text-white border-rccg-blue shadow-md'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        Sunday Service
                      </button>
                      <button
                        type="button"
                        onClick={() => { setServiceCategory('Midweek'); setServiceTypeName('Digging Deep'); }}
                        className={`py-3 px-4 rounded-xl text-xs font-bold border text-center transition ${
                          serviceCategory === 'Midweek'
                            ? 'bg-rccg-green text-white border-rccg-green shadow-md'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        Midweek Service
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Service Name</label>
                    <select
                      value={serviceTypeName}
                      onChange={(e) => setServiceTypeName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-rccg-blue"
                    >
                      {serviceCategory === 'Sunday' ? (
                        <>
                          <option value="Sunday 1st Service">Sunday 1st Service</option>
                          <option value="Sunday 2nd Service">Sunday 2nd Service</option>
                          <option value="Combined Thanksgiving Service">Combined Thanksgiving Service</option>
                        </>
                      ) : (
                        <>
                          <option value="Digging Deep">Digging Deep (Tuesday)</option>
                          <option value="Faith Clinic">Faith Clinic (Thursday)</option>
                          <option value="Commanding The Morning">Commanding The Morning</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Service Date</label>
                  <input
                    type="date"
                    value={serviceDate}
                    onChange={(e) => setServiceDate(e.target.value)}
                    className="w-full sm:w-1/2 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800"
                  />
                </div>
              </div>

              {/* Headcount Breakdown Section */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="text-md font-bold text-slate-900 flex items-center space-x-2">
                    <Users className="w-5 h-5 text-rccg-blue" />
                    <span>2. Headcount & Demographics</span>
                  </h3>
                  <div className="bg-blue-50 text-rccg-blue px-3 py-1 rounded-full text-xs font-bold">
                    Calculated Total: {totalCalculatedAttendance}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Men Count</label>
                    <input
                      type="number"
                      min="0"
                      value={menCount}
                      onChange={(e) => setMenCount(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Women Count</label>
                    <input
                      type="number"
                      min="0"
                      value={womenCount}
                      onChange={(e) => setWomenCount(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Children Count</label>
                    <input
                      type="number"
                      min="0"
                      value={childrenCount}
                      onChange={(e) => setChildrenCount(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">First Timers Registered</label>
                    <input
                      type="number"
                      min="0"
                      value={firstTimers}
                      onChange={(e) => setFirstTimers(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">New Converts (Souls Won)</label>
                    <input
                      type="number"
                      min="0"
                      value={newConverts}
                      onChange={(e) => setNewConverts(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Financial & Preacher Sub-Workflow */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="text-md font-bold text-slate-900 flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-rccg-green" />
                    <span>3. {serviceCategory === 'Midweek' ? 'Midweek Preacher & Financial Summary' : 'Sunday Offering Embedded Accounts Breakdown'}</span>
                  </h3>
                  <div className="bg-emerald-50 text-rccg-green px-3 py-1 rounded-full text-xs font-bold">
                    Total Offering: {org.baseCurrency} {totalCalculatedOffering.toLocaleString()}
                  </div>
                </div>

                {serviceCategory === 'Midweek' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Preacher / Minister <span className="text-rccg-red">*</span></label>
                      <select
                        value={selectedPreacher}
                        onChange={(e) => setSelectedPreacher(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800"
                        required
                      >
                        {ministers.map((m) => (
                          <option key={m.id} value={m.fullName}>{m.title} {m.fullName}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Summary Offering Amount ({org.baseCurrency})</label>
                      <input
                        type="number"
                        min="0"
                        value={midweekOffering}
                        onChange={(e) => setMidweekOffering(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500">Enter line-item amounts for each offering category configured under Parish Setup:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {sundayOfferings.map((item, idx) => (
                        <div key={item.categoryId} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="text-xs font-semibold text-slate-700">{item.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-slate-400">{org.baseCurrency}</span>
                            <input
                              type="number"
                              min="0"
                              value={item.amount}
                              onChange={(e) => handleSundayOfferingChange(idx, parseFloat(e.target.value) || 0)}
                              className="w-32 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-900 text-right"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="px-6 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-rccg-blue hover:bg-rccg-navy text-white text-sm font-bold shadow-md flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Submit Service Report</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* USER MANAGEMENT TAB */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">User Management & Personnel Directory</h2>
                <p className="text-slate-500 text-sm mt-1">Manage portal access credentials, departmental access roles, and ministers directory.</p>
              </div>
            </div>

            {/* USER MANAGEMENT SUB-TAB NAVIGATION */}
            <div className="flex space-x-2 border-b border-slate-200 pb-2 overflow-x-auto">
              <button
                onClick={() => setUserSubTab('portal-users')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 whitespace-nowrap ${
                  userSubTab === 'portal-users' ? 'bg-rccg-blue text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Portal System Users ({users.length})</span>
              </button>

              <button
                onClick={() => setUserSubTab('ministers')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 whitespace-nowrap ${
                  userSubTab === 'ministers' ? 'bg-rccg-blue text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Ministers Directory ({ministers.length})</span>
              </button>
            </div>

            {/* SUB-PANEL 1: PORTAL USERS & ACCESS ROLES */}
            {userSubTab === 'portal-users' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Onboard User Form */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2 border-b pb-3">
                    <UserPlus className="w-5 h-5 text-rccg-blue" />
                    <span>Onboard New User</span>
                  </h3>

                  <form onSubmit={handleOnboardUser} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Sister Mercy Johnson"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="mercy@rccgvictory.org"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
                      <input
                        type="text"
                        placeholder="+2348000000000"
                        value={newUserPhone}
                        onChange={(e) => setNewUserPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Portal Role / Department</label>
                      <select
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm"
                      >
                        <option value="UsheringDepartment">Ushering Department</option>
                        <option value="HouseFellowshipLeader">House Fellowship Leader</option>
                        <option value="SystemAdmin">System Admin</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-rccg-blue hover:bg-rccg-navy text-white text-sm font-bold rounded-xl shadow-md transition flex items-center justify-center space-x-2"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Send Onboarding Email</span>
                    </button>
                  </form>

                  {createdTempCredentials && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-2">
                      <div className="font-bold text-emerald-800 flex items-center space-x-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Temporary Pass Generated</span>
                      </div>
                      <div><span className="text-slate-500">Email:</span> {createdTempCredentials.email}</div>
                      <div><span className="text-slate-500">Temp Pass:</span> <code className="bg-white px-2 py-0.5 rounded font-mono border text-emerald-900">{createdTempCredentials.tempPass}</code></div>
                      <p className="text-[11px] text-slate-500 italic mt-1">User will be prompted to reset password upon initial login.</p>
                    </div>
                  )}
                </div>

                {/* Registered Users List */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900">Parish Portal Users</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                      <thead className="bg-slate-50 text-slate-700 uppercase text-xs font-bold tracking-wider">
                        <tr>
                          <th className="py-3.5 px-6">User & Role</th>
                          <th className="py-3.5 px-6">Contact</th>
                          <th className="py-3.5 px-6">Must Change Password</th>
                          <th className="py-3.5 px-6">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {users.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-50/80">
                            <td className="py-4 px-6 font-medium text-slate-900">
                              <div>{u.fullName}</div>
                              <span className="text-xs text-slate-400 font-normal">{u.role}</span>
                            </td>
                            <td className="py-4 px-6 text-xs text-slate-500">
                              <div>{u.email}</div>
                              <div>{u.phone}</div>
                            </td>
                            <td className="py-4 px-6">
                              {u.mustChangePassword ? (
                                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center w-max space-x-1">
                                  <Lock className="w-3 h-3" />
                                  <span>Pending Reset</span>
                                </span>
                              ) : (
                                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center w-max space-x-1">
                                  <ShieldCheck className="w-3 h-3" />
                                  <span>Active & Verified</span>
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-6">
                              <span className="text-xs font-semibold text-emerald-600">Active</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-PANEL 2: MINISTERS DIRECTORY */}
            {userSubTab === 'ministers' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-rccg-blue" />
                    <span>Register New Minister / Preacher / Leader</span>
                  </h3>
                  <form onSubmit={handleAddMinister} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Ecclesiastical Title</label>
                      <select
                        value={newMinisterTitle}
                        onChange={(e) => setNewMinisterTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm font-bold text-slate-800"
                      >
                        <option value="Pastor">Pastor</option>
                        <option value="Minister">Minister</option>
                        <option value="Deacon">Deacon</option>
                        <option value="Deaconess">Deaconess</option>
                        <option value="Evangelist">Evangelist</option>
                        <option value="Brother">Brother</option>
                        <option value="Sister">Sister</option>
                        <option value="Mummy">Mummy</option>
                        <option value="Daddy">Daddy</option>
                        <option value="Guest Preacher">Guest Preacher</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={newMinisterName}
                        onChange={(e) => setNewMinisterName(e.target.value)}
                        placeholder="e.g. Oluwaseun Adeleke"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-rccg-blue focus:outline-none"
                      />
                    </div>
                    <div className="flex items-end">
                      <button type="submit" className="w-full py-2.5 bg-rccg-green text-white font-bold text-sm rounded-xl shadow hover:bg-emerald-700 transition">
                        Save Minister
                      </button>
                    </div>
                  </form>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Parish Ministers & Leadership Directory</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ministers.map((m) => (
                      <div key={m.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-rccg-blue text-white flex items-center justify-center font-bold text-sm shadow">
                          {m.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{m.fullName}</div>
                          <div className="text-xs text-slate-500 font-mono">{m.title}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* HOUSE FELLOWSHIP & OUTREACH TAB */}
        {activeTab === 'fellowship' && (
          <div className="space-y-6">
            
            {/* SUB-TABS NAVIGATION HEADER */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <Building2 className="w-6 h-6 text-rccg-blue" />
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Parish Fellowship & Outreach Reports</h2>
                  <p className="text-xs text-slate-500">Record weekly house fellowship attendance & street evangelism souls won.</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                <button
                  onClick={() => setFellowshipSubTab('house-fellowship')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
                    fellowshipSubTab === 'house-fellowship'
                      ? 'bg-rccg-blue text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>House Fellowship ({houseFellowshipReports.length})</span>
                </button>

                <button
                  onClick={() => setFellowshipSubTab('outreach')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
                    fellowshipSubTab === 'outreach'
                      ? 'bg-rccg-red text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Church on the Street Outreach ({outreachReports.length})</span>
                </button>
              </div>
            </div>

            {/* SUB-TAB 1: HOUSE FELLOWSHIP REPORTS */}
            {fellowshipSubTab === 'house-fellowship' && (
              <div className="space-y-6">
                {/* 1. TOP FORM */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 bg-rccg-blue/10 rounded-xl text-rccg-blue">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">Submit House Fellowship Weekly Report</h3>
                        <p className="text-xs text-slate-500">For Center Leaders and Ushering Admin oversight.</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-blue-50 text-rccg-blue rounded-full text-xs font-bold font-mono border border-blue-200">
                      Weekly Entry
                    </span>
                  </div>

                  <form onSubmit={handleHouseFellowshipSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Center / Location Name *</label>
                        <input
                          type="text"
                          required
                          value={fellowshipCenter}
                          onChange={(e) => setFellowshipCenter(e.target.value)}
                          placeholder="e.g. Grace Center - Victoria Island"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-rccg-blue focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Study Topic / Manual Title</label>
                        <input
                          type="text"
                          value={fellowshipTopic}
                          onChange={(e) => setFellowshipTopic(e.target.value)}
                          placeholder="e.g. Living a Life of Holiness"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-rccg-blue focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Men Count</label>
                        <input
                          type="number"
                          value={fellowshipMen}
                          onChange={(e) => setFellowshipMen(parseInt(e.target.value) || 0)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Women Count</label>
                        <input
                          type="number"
                          value={fellowshipWomen}
                          onChange={(e) => setFellowshipWomen(parseInt(e.target.value) || 0)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Children Count</label>
                        <input
                          type="number"
                          value={fellowshipChildren}
                          onChange={(e) => setFellowshipChildren(parseInt(e.target.value) || 0)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Offering Amount ({org.baseCurrency})</label>
                        <input
                          type="number"
                          value={fellowshipOffering}
                          onChange={(e) => setFellowshipOffering(parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm font-bold text-emerald-700"
                        />
                      </div>
                    </div>

                    <button type="submit" className="w-full py-3 bg-rccg-blue hover:bg-blue-900 text-white font-extrabold text-sm rounded-xl shadow-md transition cursor-pointer">
                      Submit House Fellowship Report
                    </button>
                  </form>
                </div>

                {/* 2. GET ALL BELOW SORTED BY MOST RECENT */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden space-y-4 p-6">
                  <div className="flex justify-between items-center border-b pb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <Clock className="w-4 h-4 text-rccg-blue" />
                        <span>Submitted House Fellowship Reports</span>
                      </h3>
                      <p className="text-xs text-slate-500">Sorted by most recent entry date.</p>
                    </div>
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold font-mono">
                      {houseFellowshipReports.length} Reports Logged
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4">Center / Location</th>
                          <th className="py-3 px-4">Study Topic</th>
                          <th className="py-3 px-4 text-center">Attendance (M/W/C)</th>
                          <th className="py-3 px-4 text-center">Total Att.</th>
                          <th className="py-3 px-4 text-right">Offering ({org.baseCurrency})</th>
                          <th className="py-3 px-4">Center Leader</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs font-medium">
                        {houseFellowshipReports
                          .sort((a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime())
                          .map((rep) => (
                            <tr key={rep.id} className="hover:bg-slate-50/80 transition">
                              <td className="py-3 px-4 font-mono font-bold text-slate-900">{rep.reportDate}</td>
                              <td className="py-3 px-4 font-bold text-rccg-blue">{rep.centerName}</td>
                              <td className="py-3 px-4 text-slate-700">{rep.studyTopic}</td>
                              <td className="py-3 px-4 text-center font-mono text-slate-600">
                                {rep.menCount} / {rep.womenCount} / {rep.childrenCount}
                              </td>
                              <td className="py-3 px-4 text-center font-bold text-slate-900">
                                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-rccg-blue border border-blue-200 font-mono">
                                  {rep.totalAttendance}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right font-bold text-emerald-700 font-mono">
                                {rep.offeringAmount.toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-slate-600 font-semibold">{rep.leaderName || 'Center Leader'}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 2: CHURCH ON THE STREET (OUTREACH) */}
            {fellowshipSubTab === 'outreach' && (
              <div className="space-y-6">
                {/* 1. TOP FORM */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 bg-rccg-red/10 rounded-xl text-rccg-red">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">Church on the Street (Outreach Report)</h3>
                        <p className="text-xs text-slate-500">Record outreach souls won & street attendance.</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-red-50 text-rccg-red rounded-full text-xs font-bold font-mono border border-red-200">
                      Evangelism Log
                    </span>
                  </div>

                  <form onSubmit={handleOutreachSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Outreach Street / Location *</label>
                      <input
                        type="text"
                        required
                        value={outreachLocation}
                        onChange={(e) => setOutreachLocation(e.target.value)}
                        placeholder="e.g. Market Square Outreach"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-rccg-red focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Men Reached</label>
                        <input
                          type="number"
                          value={outreachMen}
                          onChange={(e) => setOutreachMen(parseInt(e.target.value) || 0)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Women Reached</label>
                        <input
                          type="number"
                          value={outreachWomen}
                          onChange={(e) => setOutreachWomen(parseInt(e.target.value) || 0)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Children Reached</label>
                        <input
                          type="number"
                          value={outreachChildren}
                          onChange={(e) => setOutreachChildren(parseInt(e.target.value) || 0)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-rccg-red mb-1">Souls Won (Converts)</label>
                        <input
                          type="number"
                          value={outreachSouls}
                          onChange={(e) => setOutreachSouls(parseInt(e.target.value) || 0)}
                          className="w-full bg-red-50 border border-red-300 rounded-xl px-4 py-2 text-sm font-black text-rccg-red focus:ring-2 focus:ring-red-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <button type="submit" className="w-full py-3 bg-rccg-red hover:bg-red-700 text-white font-extrabold text-sm rounded-xl shadow-md transition cursor-pointer">
                      Submit Outreach Report
                    </button>
                  </form>
                </div>

                {/* 2. GET ALL BELOW SORTED BY MOST RECENT */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden space-y-4 p-6">
                  <div className="flex justify-between items-center border-b pb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <Clock className="w-4 h-4 text-rccg-red" />
                        <span>Submitted Church on the Street Outreach Logs</span>
                      </h3>
                      <p className="text-xs text-slate-500">Sorted by most recent outreach date.</p>
                    </div>
                    <span className="px-3 py-1 bg-red-50 text-rccg-red rounded-full text-xs font-bold font-mono border border-red-200">
                      {outreachReports.length} Outreaches Logged
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4">Outreach Street / Location</th>
                          <th className="py-3 px-4 text-center">People Reached (M/W/C)</th>
                          <th className="py-3 px-4 text-center">Total Reached</th>
                          <th className="py-3 px-4 text-center font-bold text-rccg-red">Souls Won (Converts)</th>
                          <th className="py-3 px-4">Evangelism Leader</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs font-medium">
                        {outreachReports
                          .sort((a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime())
                          .map((rep) => (
                            <tr key={rep.id} className="hover:bg-slate-50/80 transition">
                              <td className="py-3 px-4 font-mono font-bold text-slate-900">{rep.reportDate}</td>
                              <td className="py-3 px-4 font-bold text-slate-900">{rep.locationName}</td>
                              <td className="py-3 px-4 text-center font-mono text-slate-600">
                                {rep.menReached} / {rep.womenReached} / {rep.childrenReached}
                              </td>
                              <td className="py-3 px-4 text-center font-bold text-slate-900">
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200 font-mono">
                                  {rep.totalReached}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className="px-3 py-1 rounded-full bg-red-100 text-rccg-red font-black text-xs border border-red-200 font-mono shadow-2xs">
                                  ✨ {rep.soulsWonCount} Souls
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-600 font-semibold">{rep.leaderName || 'Evangelism Team'}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SETUP TAB */}
        {activeTab === 'setup' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            {/* SETUP HEADER & CONTROL BAR */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <Settings className="w-6 h-6 text-rccg-blue" />
                  <h2 className="text-xl font-bold text-slate-900">System Setup & Configuration</h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Manage Service Types, Offering Categories, Ministers Directory, and Parish Branding.
                </p>
              </div>

              {setupSubTab === 'service-types' ? (
                <button
                  onClick={() => setIsAddSetupModalOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-rccg-blue hover:bg-blue-900 text-white font-bold text-sm rounded-xl shadow-md transition"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-300" />
                  <span>Configure Service Type & Category</span>
                </button>
              ) : setupSubTab !== 'branding' ? (
                <button
                  onClick={() => setShowAddSetupForm(!showAddSetupForm)}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-rccg-blue hover:bg-blue-900 text-white font-bold text-sm rounded-xl shadow-md transition"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-300" />
                  <span>{showAddSetupForm ? 'Close Add Form' : 'Add New Setup'}</span>
                </button>
              ) : null}
            </div>

            {/* SETUP SUB-TAB NAVIGATION */}
            <div className="flex space-x-2 border-b border-slate-200 pb-2 overflow-x-auto">
              <button
                onClick={() => { setSetupSubTab('service-types'); setShowAddSetupForm(false); }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 whitespace-nowrap ${
                  setupSubTab === 'service-types' ? 'bg-rccg-blue text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Service Types Setup ({serviceTypes.length})</span>
              </button>

              <button
                onClick={() => { setSetupSubTab('offering-categories'); setShowAddSetupForm(false); }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 whitespace-nowrap ${
                  setupSubTab === 'offering-categories' ? 'bg-rccg-blue text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Offering Categories ({offeringCategories.length})</span>
              </button>

              <button
                onClick={() => { setSetupSubTab('departments'); setShowAddSetupForm(false); }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 whitespace-nowrap ${
                  setupSubTab === 'departments' ? 'bg-rccg-blue text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Departments ({departments.length})</span>
              </button>

              <button
                onClick={() => { setSetupSubTab('branding'); setShowAddSetupForm(false); }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 whitespace-nowrap ${
                  setupSubTab === 'branding' ? 'bg-rccg-blue text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Parish Branding</span>
              </button>
            </div>

            {/* SUB-TAB 1: SERVICE TYPES SETUP */}
            {setupSubTab === 'service-types' && (
              <div className="space-y-6">
                {/* SERVICE CATEGORIES DIRECTORY */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-4 border-b pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Parish Service Categories</h3>
                      <p className="text-xs text-slate-500">Categorize services by category parameters, schedules, and reporting rules.</p>
                    </div>
                    <button
                      onClick={() => setIsAddCategoryModalOpen(true)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-rccg-blue font-bold text-xs rounded-xl transition flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Service Category</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {serviceCategories.map((cat) => (
                      <div key={cat.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-xs font-bold text-slate-900">{cat.name}</h4>
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2">{cat.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CONFIGURED SERVICE TYPES LIST */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 bg-slate-50 border-b flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Configured Service Types</h3>
                      <p className="text-xs text-slate-500">Custom services configured for parish reporting.</p>
                    </div>
                    <button
                      onClick={() => setIsAddSetupModalOpen(true)}
                      className="px-4 py-2 bg-rccg-blue hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Configure New Service Type</span>
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {serviceTypes.map((st) => (
                      <div key={st.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition">
                        <div className="flex items-start space-x-3.5">
                          <div className={`p-3 rounded-2xl flex-shrink-0 ${
                            st.category.includes('Sunday') ? 'bg-blue-100 text-blue-800' :
                            st.category.includes('Midweek') ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-slate-900">{st.name}</h4>
                              {st.code && (
                                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-mono font-bold">
                                  {st.code}
                                </span>
                              )}
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-rccg-blue border border-blue-200">
                                {st.category}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                              {st.defaultDay && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  <span>{st.defaultDay} {st.defaultTime ? `• ${st.defaultTime}` : ''}</span>
                                </span>
                              )}
                              {st.leadMinisterId && (
                                <span>Leader: <strong className="text-slate-700">{st.leadMinisterId}</strong></span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:self-center">
                          {st.trackAttendance && (
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              ✓ Attendance
                            </span>
                          )}
                          {st.trackOfferings && (
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                              ✓ Offering
                            </span>
                          )}
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Active
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 2: OFFERING CATEGORIES SETUP */}
            {setupSubTab === 'offering-categories' && (
              <div className="space-y-6">
                {showAddSetupForm && (
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4 animate-fadeIn">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <PlusCircle className="w-5 h-5 text-rccg-blue" />
                      <span>Add New Offering Category Setup</span>
                    </h3>
                    <form onSubmit={handleAddOfferingCategory} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Category Name</label>
                        <input
                          type="text"
                          required
                          value={newOfferingName}
                          onChange={(e) => setNewOfferingName(e.target.value)}
                          placeholder="e.g. Welfare & Mercy Fund"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-rccg-blue focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Category Code</label>
                        <input
                          type="text"
                          value={newOfferingCode}
                          onChange={(e) => setNewOfferingCode(e.target.value)}
                          placeholder="e.g. WLF-01 (Auto-generated if empty)"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm font-mono focus:ring-2 focus:ring-rccg-blue focus:outline-none"
                        />
                      </div>
                      <div className="flex items-end">
                        <button type="submit" className="w-full py-2.5 bg-rccg-green text-white font-bold text-sm rounded-xl shadow hover:bg-emerald-700 transition">
                          Save Offering Category
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 bg-slate-50 border-b flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Configured Offering Categories</h3>
                    <span className="text-xs text-slate-500 font-mono">{offeringCategories.length} Categories</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                    {offeringCategories.map((oc) => (
                      <div key={oc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between group hover:border-emerald-300 transition">
                        <div className="flex items-center space-x-3">
                          <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
                            <DollarSign className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">{oc.name}</h4>
                            <span className="text-[11px] font-mono text-slate-500">Code: {oc.code}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Active
                          </span>
                          <button
                            onClick={() => handleStartEditOfferingCategory(oc)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition border border-transparent hover:border-blue-200 cursor-pointer"
                            title="Edit Category"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteOfferingCategory(oc.id, oc.name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition border border-transparent hover:border-red-200 cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}



            {/* SUB-TAB 4: PARISH DEPARTMENTS SETUP */}
            {setupSubTab === 'departments' && (
              <div className="space-y-6">
                {showAddSetupForm && (
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4 animate-fadeIn">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <PlusCircle className="w-5 h-5 text-rccg-blue" />
                      <span>Configure New Parish Department / Ministry</span>
                    </h3>
                    <form onSubmit={handleAddDepartment} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Department Name *</label>
                          <input
                            type="text"
                            required
                            value={newDepartmentName}
                            onChange={(e) => setNewDepartmentName(e.target.value)}
                            placeholder="e.g. Media & Technical Unit"
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-rccg-blue focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Department Code</label>
                          <input
                            type="text"
                            value={newDepartmentCode}
                            onChange={(e) => setNewDepartmentCode(e.target.value)}
                            placeholder="e.g. TEC-01 (Auto-generated if empty)"
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm font-mono focus:ring-2 focus:ring-rccg-blue focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Head of Department (HOD)</label>
                          <select
                            value={newDepartmentHod}
                            onChange={(e) => setNewDepartmentHod(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm font-medium text-slate-800"
                          >
                            <option value="">-- Select HOD / Leader --</option>
                            {ministers.map((m) => (
                              <option key={m.id} value={m.fullName}>
                                {m.fullName} ({m.title})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Meeting Schedule</label>
                          <input
                            type="text"
                            value={newDepartmentSchedule}
                            onChange={(e) => setNewDepartmentSchedule(e.target.value)}
                            placeholder="e.g. Saturdays at 05:00 PM"
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-rccg-blue focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Brief Description / Mandate</label>
                          <input
                            type="text"
                            value={newDepartmentDescription}
                            onChange={(e) => setNewDepartmentDescription(e.target.value)}
                            placeholder="e.g. Sound engineering, live streaming, and media production."
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-rccg-blue focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button type="submit" className="px-6 py-2.5 bg-rccg-green text-white font-bold text-sm rounded-xl shadow hover:bg-emerald-700 transition">
                          Save Department Setup
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 bg-slate-50 border-b flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Configured Parish Departments & Directorates</h3>
                      <p className="text-xs text-slate-500">Departments configured for workforce management and roster scheduling.</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-rccg-blue rounded-full text-xs font-bold font-mono">
                      {departments.length} Units Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
                    {departments.map((dep) => (
                      <div key={dep.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-3 bg-rccg-blue text-white rounded-xl shadow-sm">
                              <Users className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900">{dep.name}</h4>
                              <span className="text-[11px] font-mono font-bold text-slate-500">Code: {dep.code}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              Active Unit
                            </span>
                            <button
                              onClick={() => handleStartEditDepartment(dep)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition border border-transparent hover:border-blue-200 cursor-pointer"
                              title="Edit Department"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDepartment(dep.id, dep.name)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition border border-transparent hover:border-red-200 cursor-pointer"
                              title="Delete Department"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {dep.description && (
                          <p className="text-xs text-slate-600 line-clamp-2">{dep.description}</p>
                        )}

                        <div className="pt-2 border-t border-slate-200/80 grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Head of Dept (HOD)</span>
                            <span className="font-semibold text-slate-800">{dep.headOfDepartment || 'Unassigned'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Meeting Schedule</span>
                            <span className="font-semibold text-slate-800">{dep.meetingSchedule || 'Flexible'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 4: PARISH BRANDING SETUP */}
            {setupSubTab === 'branding' && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                <h3 className="text-lg font-bold text-slate-900 border-b pb-3 flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-rccg-blue" />
                  <span>Parish Identity & Base Currency Setup</span>
                </h3>

                <form onSubmit={(e) => { e.preventDefault(); showNotification('Parish Branding updated globally!'); }} className="space-y-6 max-w-2xl">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Parish Name</label>
                    <input
                      type="text"
                      value={org.parishName}
                      onChange={(e) => setOrg({ ...org, parishName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900"
                    />
                  </div>

                  {/* PARISH LOGO SELECTION AND UPLOAD */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Parish Logo & Emblem</label>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                      {/* Logo Preview */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-2xl bg-white border border-slate-300 shadow-sm p-2 flex items-center justify-center overflow-hidden relative group">
                          {org.logoUrl ? (
                            <img src={org.logoUrl} alt="Parish Logo" className="w-full h-full object-contain" />
                          ) : (
                            <Building2 className="w-8 h-8 text-slate-400" />
                          )}
                        </div>
                      </div>

                      {/* Upload Actions & Direct Input */}
                      <div className="space-y-3 flex-1 w-full">
                        <div className="flex flex-wrap items-center gap-3">
                          <label className="px-4 py-2 bg-rccg-blue hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition flex items-center gap-2">
                            <Upload className="w-3.5 h-3.5 text-emerald-300" />
                            <span>Upload Image File</span>
                            <input
                              type="file"
                              accept="image/png, image/jpeg, image/webp, image/svg+xml"
                              onChange={handleLogoFileUpload}
                              className="hidden"
                            />
                          </label>

                          {org.logoUrl && (
                            <button
                              type="button"
                              onClick={() => setOrg({ ...org, logoUrl: '' })}
                              className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                              <span>Remove</span>
                            </button>
                          )}
                        </div>

                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Link className="w-3.5 h-3.5" />
                          </div>
                          <input
                            type="text"
                            value={org.logoUrl}
                            onChange={(e) => setOrg({ ...org, logoUrl: e.target.value })}
                            placeholder="Or enter direct image URL (https://...)"
                            className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-rccg-blue"
                          />
                        </div>
                        <p className="text-[11px] text-slate-500">Supports PNG, JPG, WebP, or SVG format (Max 5MB).</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Base Currency</label>
                    <select
                      value={org.baseCurrency}
                      onChange={(e) => setOrg({ ...org, baseCurrency: e.target.value })}
                      className="w-full sm:w-1/2 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900"
                    >
                      <option value="NGN">NGN (Nigerian Naira - ₦)</option>
                      <option value="USD">USD (US Dollar - $)</option>
                      <option value="GBP">GBP (British Pound - £)</option>
                      <option value="EUR">EUR (Euro - €)</option>
                    </select>
                  </div>

                  <div className="pt-4">
                    <button type="submit" className="px-8 py-3 bg-rccg-blue text-white text-sm font-bold rounded-xl shadow-md">
                      Save Branding Settings
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ---------------- MODAL 1: DETAILED SERVICE TYPE & CATEGORY SETUP POPUP ---------------- */}
      {isAddSetupModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="rccg-gradient-header text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-white/10 rounded-xl">
                  <Calendar className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Configure New Service Type & Category</h3>
                  <p className="text-xs text-slate-300">Set up custom parish services, schedules, and tracking parameters.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddSetupModalOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveServiceTypeModal} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* SECTION 1: IDENTITY & CATEGORY */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
                  <Sliders className="w-3.5 h-3.5 text-rccg-blue" />
                  1. Service Identity & Category Assignment
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Service Type Name *</label>
                    <input
                      type="text"
                      required
                      value={modalServiceName}
                      onChange={(e) => setModalServiceName(e.target.value)}
                      placeholder="e.g. Covenant Hour of Prayer / Youth Vigil"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-rccg-blue focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">Service Category *</label>
                      <button
                        type="button"
                        onClick={() => setIsAddCategoryModalOpen(true)}
                        className="text-[11px] font-bold text-rccg-blue hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>New Category</span>
                      </button>
                    </div>
                    <select
                      value={modalServiceCategory}
                      onChange={(e) => setModalServiceCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-rccg-blue"
                    >
                      {serviceCategories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Service Code / Tag</label>
                    <input
                      type="text"
                      value={modalServiceCode}
                      onChange={(e) => setModalServiceCode(e.target.value)}
                      placeholder="e.g. YTH-01 (Auto-generated if empty)"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Lead Minister</label>
                    <select
                      value={modalLeadMinister}
                      onChange={(e) => setModalLeadMinister(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800"
                    >
                      <option value="">-- Select Preacher/Minister (Optional) --</option>
                      {ministers.map((m) => (
                        <option key={m.id} value={m.fullName}>
                          {m.fullName} ({m.title})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2: SCHEDULE & TIMING */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  2. Default Schedule & Service Timing
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Default Service Day</label>
                    <select
                      value={modalDefaultDay}
                      onChange={(e) => setModalDefaultDay(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800"
                    >
                      <option value="Sunday">Sunday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                      <option value="First Sunday">First Sunday of Month</option>
                      <option value="First Friday">First Friday Vigil</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Default Start Time</label>
                    <input
                      type="text"
                      value={modalDefaultTime}
                      onChange={(e) => setModalDefaultTime(e.target.value)}
                      placeholder="e.g. 08:00 AM"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: METRICS TRACKING REQUIREMENTS */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  3. Reporting & Audit Tracking Parameters
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <label className="flex items-center space-x-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={modalTrackAttendance}
                      onChange={(e) => setModalTrackAttendance(e.target.checked)}
                      className="w-4 h-4 rounded text-rccg-blue focus:ring-rccg-blue"
                    />
                    <span className="text-xs font-bold text-slate-800">Track Headcount (Men/Women/Children)</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={modalTrackOfferings}
                      onChange={(e) => setModalTrackOfferings(e.target.checked)}
                      className="w-4 h-4 rounded text-rccg-green focus:ring-rccg-green"
                    />
                    <span className="text-xs font-bold text-slate-800">Track Financial Offerings & Breakdown</span>
                  </label>
                </div>
              </div>

              {/* SECTION 4: DESCRIPTION */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Service Description / Notes</label>
                <textarea
                  rows={2}
                  value={modalDescription}
                  onChange={(e) => setModalDescription(e.target.value)}
                  placeholder="Additional information or guidelines for ushers recording this service..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-rccg-blue focus:outline-none"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddSetupModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-rccg-blue hover:bg-blue-900 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>Save Service Type Configuration</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 2: INLINE ADD NEW SERVICE CATEGORY ---------------- */}
      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="bg-rccg-blue text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                <span>Create New Service Category</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddCategoryModalOpen(false)}
                className="text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategoryModal} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Youth Church & Teenagers"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category Description</label>
                <textarea
                  rows={2}
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  placeholder="Brief scope of services under this category..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-medium text-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rccg-green text-white text-xs font-bold rounded-xl shadow"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT OFFERING CATEGORY MODAL */}
      {isEditOfferingModalOpen && editingOfferingCategory && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => { setIsEditOfferingModalOpen(false); setEditingOfferingCategory(null); }}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Pencil className="w-5 h-5 text-blue-600" />
                <span>Edit Offering Category</span>
              </h3>
              <p className="text-xs text-slate-500">Update category title and classification code.</p>
            </div>

            <form onSubmit={handleUpdateOfferingCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editOfferingName}
                  onChange={(e) => setEditOfferingName(e.target.value)}
                  placeholder="e.g. Welfare & Mercy Fund"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category Code</label>
                <input
                  type="text"
                  value={editOfferingCode}
                  onChange={(e) => setEditOfferingCode(e.target.value)}
                  placeholder="e.g. WLF-01"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => { setIsEditOfferingModalOpen(false); setEditingOfferingCategory(null); }}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* EDIT DEPARTMENT MODAL */}
      {isEditDepartmentModalOpen && editingDepartment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => { setIsEditDepartmentModalOpen(false); setEditingDepartment(null); }}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Pencil className="w-5 h-5 text-blue-600" />
                <span>Edit Parish Department</span>
              </h3>
              <p className="text-xs text-slate-500">Update department details, leadership assignment, and schedule.</p>
            </div>

            <form onSubmit={handleUpdateDepartment} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department Name *</label>
                  <input
                    type="text"
                    required
                    value={editDepartmentName}
                    onChange={(e) => setEditDepartmentName(e.target.value)}
                    placeholder="e.g. Media & Technical Unit"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department Code</label>
                  <input
                    type="text"
                    value={editDepartmentCode}
                    onChange={(e) => setEditDepartmentCode(e.target.value)}
                    placeholder="e.g. TEC-01"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Head of Department (HOD)</label>
                  <select
                    value={editDepartmentHod}
                    onChange={(e) => setEditDepartmentHod(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm font-medium text-slate-800"
                  >
                    <option value="">-- Select HOD / Leader --</option>
                    {ministers.map((m) => (
                      <option key={m.id} value={m.fullName}>
                        {m.fullName} ({m.title})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Meeting Schedule</label>
                  <input
                    type="text"
                    value={editDepartmentSchedule}
                    onChange={(e) => setEditDepartmentSchedule(e.target.value)}
                    placeholder="e.g. Saturdays at 05:00 PM"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Brief Description / Mandate</label>
                <textarea
                  rows={2}
                  value={editDepartmentDescription}
                  onChange={(e) => setEditDepartmentDescription(e.target.value)}
                  placeholder="Sanctuary protocol, guest reception, etc."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => { setIsEditDepartmentModalOpen(false); setEditingDepartment(null); }}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}
