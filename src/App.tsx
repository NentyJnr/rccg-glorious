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
  AlertTriangle,
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
  Globe,
  UserCheck,
  Download,
  FileSpreadsheet,
  Eye,
  Paperclip,
  Check,
  Search,
  Award,
  GraduationCap,
  Share2,
  Copy,
  ExternalLink,
  Camera,
  User,
  Receipt
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

export interface Member {
  id: string;
  surname: string;
  firstname: string;
  fullName: string;
  whatsappNumber: string;
  email: string;
  homeAddress: string;
  dobDay: number;
  dobMonth: string;
  gender: string;
  maritalStatus?: 'Single' | 'Married' | 'Engaged' | 'Widowed' | 'Divorced';
  profileImageUrl?: string | null;
  membershipStatus: 'Full Member' | 'New Convert' | 'First Timer' | 'Under Follow-up';
  assignedDepartment?: string | null;
  isHod?: boolean;
  role: 'Member' | 'Workforce' | 'Minister';
  ecclesiasticalTitle?: string | null;
  dateJoined: string;
}

export interface WorkerRegistration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  preferredDepartment: string;
  submissionDate: string;
  assignedMinisterId: string | null;
  assignedMinisterName: string | null;
  currentStage: 'Baptismal Class' | 'Believers Class' | 'Worker in Training' | 'Approved Worker';
  stageStatus: 'Pending' | 'Enrolled' | 'Completed';
  certificates: {
    baptismCertName?: string | null;
    believersCertName?: string | null;
    witCertName?: string | null;
  };
  notes?: string;
}

export interface DenominationBreakdown {
  n1000?: number;
  n500?: number;
  n200?: number;
  n100?: number;
  n50?: number;
}

interface OfferingItem {
  categoryId: string;
  name: string;
  amount: number;
  denominations?: DenominationBreakdown;
  isBreakdownOpen?: boolean;
}

export interface ExpenseItem {
  id: string;
  category: string;
  description: string;
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
  totalExpenses?: number;
  netOffering?: number;
  offeringsBreakdown?: OfferingItem[];
  expensesBreakdown?: ExpenseItem[];
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
  const [userSubTab, setUserSubTab] = useState<'portal-users' | 'ministers' | 'member-upload' | 'role-assignment' | 'workers-registration'>('portal-users');
  const [setupSubTab, setSetupSubTab] = useState<'service-types' | 'offering-categories' | 'departments' | 'branding'>('service-types');

  // Members Directory & Registration State
  const [members, setMembers] = useState<Member[]>([
    {
      id: 'mem1',
      surname: 'Okon',
      firstname: 'Emmanuel',
      fullName: 'Okon Emmanuel',
      whatsappNumber: '+2348031112233',
      email: 'emmanuel@gmail.com',
      homeAddress: '12 Allen Avenue, Ikeja',
      dobDay: 14,
      dobMonth: 'March',
      gender: 'Male',
      membershipStatus: 'Full Member',
      assignedDepartment: 'Choir & Praise Team',
      role: 'Workforce',
      dateJoined: '2025-01-15'
    },
    {
      id: 'mem2',
      surname: 'Blessing',
      firstname: 'Grace',
      fullName: 'Blessing Grace',
      whatsappNumber: '+2348024445566',
      email: 'grace.b@yahoo.com',
      homeAddress: '45 Bode Thomas, Surulere',
      dobDay: 28,
      dobMonth: 'August',
      gender: 'Female',
      membershipStatus: 'Full Member',
      assignedDepartment: 'Ushering & Protocol',
      role: 'Workforce',
      dateJoined: '2025-02-10'
    },
    {
      id: 'mem3',
      surname: 'Eze',
      firstname: 'Chukwudi',
      fullName: 'Eze Chukwudi',
      whatsappNumber: '+2348098889900',
      email: 'chukwudi@hotmail.com',
      homeAddress: '8 Marina Road, Lagos Island',
      dobDay: 5,
      dobMonth: 'November',
      gender: 'Male',
      membershipStatus: 'Under Follow-up',
      assignedDepartment: null,
      role: 'Member',
      dateJoined: '2025-08-01'
    },
    {
      id: 'mem4',
      surname: 'Adams',
      firstname: 'Victoria',
      fullName: 'Adams Victoria',
      whatsappNumber: '+2348057776655',
      email: 'v.adams@gmail.com',
      homeAddress: '19 Isaac John, Ikeja GRA',
      dobDay: 19,
      dobMonth: 'December',
      gender: 'Female',
      membershipStatus: 'New Convert',
      assignedDepartment: null,
      role: 'Member',
      dateJoined: '2025-09-12'
    }
  ]);

  // Single Member Form State
  const [regSurname, setRegSurname] = useState('');
  const [regFirstname, setRegFirstname] = useState('');
  const [regWhatsapp, setRegWhatsapp] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regDobDay, setRegDobDay] = useState<number>(1);
  const [regDobMonth, setRegDobMonth] = useState<string>('January');
  const [regGender, setRegGender] = useState('Male');
  const [regMaritalStatus, setRegMaritalStatus] = useState<'Single' | 'Married' | 'Engaged' | 'Widowed' | 'Divorced'>('Single');
  const [regProfileImageUrl, setRegProfileImageUrl] = useState<string | null>(null);
  const [regStatus, setRegStatus] = useState<Member['membershipStatus']>('Full Member');

  // Shareable Link & Public Form State
  const [showPublicMemberForm, setShowPublicMemberForm] = useState(false);
  const [publicFormSuccess, setPublicFormSuccess] = useState(false);

  // Shareable Public House Fellowship State
  const [showPublicFellowshipForm, setShowPublicFellowshipForm] = useState(false);
  const [publicFellowshipSuccess, setPublicFellowshipSuccess] = useState(false);
  const [pubFellowshipCenter, setPubFellowshipCenter] = useState('Grace Center - Victoria Island');
  const [pubFellowshipLeader, setPubFellowshipLeader] = useState('Brother Samuel');
  const [pubFellowshipTopic, setPubFellowshipTopic] = useState('Living a Life of Holiness');
  const [pubFellowshipMen, setPubFellowshipMen] = useState<number>(8);
  const [pubFellowshipWomen, setPubFellowshipWomen] = useState<number>(12);
  const [pubFellowshipChildren, setPubFellowshipChildren] = useState<number>(5);
  const [pubFellowshipOffering, setPubFellowshipOffering] = useState<number>(25000);

  // Shareable Public Outreach & Evangelism Log State
  const [showPublicOutreachForm, setShowPublicOutreachForm] = useState(false);
  const [publicOutreachSuccess, setPublicOutreachSuccess] = useState(false);
  const [pubOutreachLocation, setPubOutreachLocation] = useState('Market Square Outreach');
  const [pubOutreachLeader, setPubOutreachLeader] = useState('Minister David Okafor');
  const [pubOutreachMen, setPubOutreachMen] = useState<number>(25);
  const [pubOutreachWomen, setPubOutreachWomen] = useState<number>(30);
  const [pubOutreachChildren, setPubOutreachChildren] = useState<number>(15);
  const [pubOutreachSouls, setPubOutreachSouls] = useState<number>(14);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('register') === 'member') {
      setShowPublicMemberForm(true);
    }
    if (urlParams.get('report') === 'fellowship') {
      setShowPublicFellowshipForm(true);
    }
    if (urlParams.get('report') === 'outreach') {
      setShowPublicOutreachForm(true);
    }
  }, []);

  const [bulkFileName, setBulkFileName] = useState<string | null>(null);
  const [parsedPreviewMembers, setParsedPreviewMembers] = useState<Member[]>([]);
  const [uploadSuccessBanner, setUploadSuccessBanner] = useState<string | null>(null);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');

  // Members Inner Tab & Department Leadership State
  const [membersInnerTab, setMembersInnerTab] = useState<'members-list' | 'dept-leadership'>('members-list');
  const [deptAssignModalMember, setDeptAssignModalMember] = useState<Member | null>(null);
  const [selectedDept, setSelectedDept] = useState<string>('Ushering & Protocol');
  const [isHodToggle, setIsHodToggle] = useState<boolean>(false);

  // Service Report Sub-Tabs & Filtering State
  const [serviceReportSubTab, setServiceReportSubTab] = useState<'entry' | 'filter-reports'>('entry');
  const [filterStartDate, setFilterStartDate] = useState<string>('2026-09-01');
  const [filterEndDate, setFilterEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [filterServiceTypeName, setFilterServiceTypeName] = useState<string>('All');
  const [filterReportType, setFilterReportType] = useState<'All' | 'Demographics' | 'Financial'>('All');

  // Role Elevation & Department Assignment Modal State
  const [roleAssignModalMember, setRoleAssignModalMember] = useState<Member | null>(null);
  const [selectedDeptForMember, setSelectedDeptForMember] = useState<string>('Ushering & Protocol');
  const [targetRoleForMember, setTargetRoleForMember] = useState<'Member' | 'Workforce' | 'Minister'>('Workforce');
  const [selectedTitleForMinister, setSelectedTitleForMinister] = useState<string>('Pastor');

  const handleSaveDepartmentAndLeadership = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptAssignModalMember) return;

    setMembers(prev => prev.map(m => {
      if (m.id === deptAssignModalMember.id) {
        return {
          ...m,
          assignedDepartment: selectedDept,
          isHod: isHodToggle,
          role: m.role === 'Member' ? 'Workforce' : m.role
        };
      }
      return m;
    }));

    setUploadSuccessBanner(
      `Successfully assigned ${deptAssignModalMember.fullName} to ${selectedDept}${isHodToggle ? ' as Head of Department (HOD)' : ''}!`
    );
    setDeptAssignModalMember(null);
    setTimeout(() => setUploadSuccessBanner(null), 6000);
  };

  const handleRegisterSingleMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regSurname || !regFirstname || !regWhatsapp) {
      showNotification('Please fill in Surname, Firstname, and Whatsapp Number.', 'error');
      return;
    }

    const newMember: Member = {
      id: 'mem_' + Date.now(),
      surname: regSurname,
      firstname: regFirstname,
      fullName: `${regSurname} ${regFirstname}`,
      whatsappNumber: regWhatsapp,
      email: regEmail || 'N/A',
      homeAddress: regAddress || 'N/A',
      dobDay: regDobDay,
      dobMonth: regDobMonth,
      gender: regGender,
      maritalStatus: regMaritalStatus,
      profileImageUrl: regProfileImageUrl,
      membershipStatus: regStatus,
      assignedDepartment: null,
      role: 'Member',
      dateJoined: new Date().toISOString().split('T')[0]
    };

    setMembers(prev => [newMember, ...prev]);
    setUploadSuccessBanner(`Successfully registered ${newMember.fullName} into parish records!`);
    setRegSurname('');
    setRegFirstname('');
    setRegWhatsapp('');
    setRegEmail('');
    setRegAddress('');
    setRegDobDay(1);
    setRegDobMonth('January');
    setRegGender('Male');
    setRegMaritalStatus('Single');
    setRegProfileImageUrl(null);
    setTimeout(() => setUploadSuccessBanner(null), 6000);
  };

  // Bulk Upload CSV Handlers
  const handleDownloadCSVTemplate = () => {
    const csvContent = "Surname,Firstname,Whatsapp Number,EmailAddress,Home Address,DOB Day,DOB Month,Gender\n" +
                       "King,Samuel,+2348011223344,samuel@example.com,10 Mission Road Lagos,15,May,Male\n" +
                       "Chidinma,Joy,+2348055667788,joy@example.com,25 Victoria Island Lagos,20,October,Female\n";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'RCCG_Parish_Members_Registration_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileSelectForMemberUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBulkFileName(file.name);
    const mockParsed: Member[] = [
      { id: 'up1_' + Date.now(), surname: 'Vance', firstname: 'Felix', fullName: 'Vance Felix', whatsappNumber: '+2348039990011', email: 'felix.v@gmail.com', homeAddress: '14 Toyin Street Ikeja', dobDay: 12, dobMonth: 'June', gender: 'Male', membershipStatus: 'Full Member', role: 'Member', dateJoined: new Date().toISOString().split('T')[0] },
      { id: 'up2_' + Date.now(), surname: 'Benson', firstname: 'Abigail', fullName: 'Benson Abigail', whatsappNumber: '+2348028881122', email: 'abigail.b@yahoo.com', homeAddress: '50 Adeniran Ogunsanya Surulere', dobDay: 4, dobMonth: 'September', gender: 'Female', membershipStatus: 'New Convert', role: 'Member', dateJoined: new Date().toISOString().split('T')[0] },
      { id: 'up3_' + Date.now(), surname: 'Dare', firstname: 'Timothy', fullName: 'Dare Timothy', whatsappNumber: '+2348097772233', email: 'timothy.d@gmail.com', homeAddress: '7 Commercial Avenue Yaba', dobDay: 22, dobMonth: 'April', gender: 'Male', membershipStatus: 'Under Follow-up', role: 'Member', dateJoined: new Date().toISOString().split('T')[0] },
    ];
    setParsedPreviewMembers(mockParsed);
  };

  const handleProcessMemberBatchImport = () => {
    if (parsedPreviewMembers.length === 0) return;
    setMembers(prev => [...parsedPreviewMembers, ...prev]);
    setUploadSuccessBanner(`Successfully imported ${parsedPreviewMembers.length} parish members into directory!`);
    setParsedPreviewMembers([]);
    setBulkFileName(null);
    setTimeout(() => setUploadSuccessBanner(null), 6000);
  };

  const handleConfirmRoleDepartmentAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleAssignModalMember) return;

    const updatedRole = targetRoleForMember;
    const updatedDept = updatedRole === 'Member' ? null : selectedDeptForMember;
    const ministerTitle = updatedRole === 'Minister' ? selectedTitleForMinister : null;

    setMembers(prev => prev.map(m => {
      if (m.id === roleAssignModalMember.id) {
        return {
          ...m,
          role: updatedRole,
          assignedDepartment: updatedDept,
          ecclesiasticalTitle: ministerTitle
        };
      }
      return m;
    }));

    // If converted to Minister, ensure added to ministers directory
    if (updatedRole === 'Minister') {
      const ministerFullName = `${roleAssignModalMember.surname} ${roleAssignModalMember.firstname}`;
      setMinisters(prev => {
        if (prev.some(m => m.fullName.toLowerCase() === ministerFullName.toLowerCase())) return prev;
        return [...prev, { id: 'm_' + Date.now(), title: selectedTitleForMinister, fullName: ministerFullName }];
      });
    }

    setRoleAssignModalMember(null);
  };

  // Worker Registrations State
  const [workerRegistrations, setWorkerRegistrations] = useState<WorkerRegistration[]>([
    {
      id: 'wr1',
      fullName: 'Sister Deborah Adebayo',
      email: 'deborah.a@gmail.com',
      phone: '+2348035556677',
      gender: 'Female',
      preferredDepartment: 'Choir & Praise Team',
      submissionDate: '2025-09-18',
      assignedMinisterId: 'm2',
      assignedMinisterName: 'Pastor Oluwaseun Adeleke',
      currentStage: 'Believers Class',
      stageStatus: 'Enrolled',
      certificates: {
        baptismCertName: 'water_baptism_deborah.pdf',
        believersCertName: null,
        witCertName: null
      },
      notes: 'Transferred from RCCG Jesus House, completed water baptism in 2023.'
    },
    {
      id: 'wr2',
      fullName: 'Brother Kevin Nnamdi',
      email: 'kevin.n@yahoo.com',
      phone: '+2348123334455',
      gender: 'Male',
      preferredDepartment: 'Ushering & Protocol',
      submissionDate: '2025-09-19',
      assignedMinisterId: 'm3',
      assignedMinisterName: 'Deaconess Mary Johnson',
      currentStage: 'Baptismal Class',
      stageStatus: 'Enrolled',
      certificates: {
        baptismCertName: null,
        believersCertName: null,
        witCertName: null
      },
      notes: 'Wants to serve in Ushering team. Needs water baptism enrollment.'
    },
    {
      id: 'wr3',
      fullName: 'Sister Hannah Peters',
      email: 'hannah.peters@gmail.com',
      phone: '+2348079998877',
      gender: 'Female',
      preferredDepartment: 'Media & Technical Broadcast',
      submissionDate: '2025-09-20',
      assignedMinisterId: null,
      assignedMinisterName: null,
      currentStage: 'Worker in Training',
      stageStatus: 'Completed',
      certificates: {
        baptismCertName: 'baptism_cert_hannah.pdf',
        believersCertName: 'believers_class_hannah.png',
        witCertName: 'wit_certificate_hannah.pdf'
      },
      notes: 'Has completed all required training modules. Ready for final pastoral approval.'
    }
  ]);

  // Sync website submissions from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('rccg_workforce_applications');
      if (saved) {
        const parsed: WorkerRegistration[] = JSON.parse(saved);
        setWorkerRegistrations(prev => {
          const existingIds = new Set(prev.map(w => w.id));
          const newItems = parsed.filter(item => !existingIds.has(item.id));
          return [...newItems, ...prev];
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [userSubTab]);

  // Modals for Worker Follow-up & Certificates
  const [assignModalCandidate, setAssignModalCandidate] = useState<WorkerRegistration | null>(null);
  const [selectedMinisterIdToAssign, setSelectedMinisterIdToAssign] = useState<string>('');

  const [certModalCandidate, setCertModalCandidate] = useState<WorkerRegistration | null>(null);
  const [newCertType, setNewCertType] = useState<'baptismCertName' | 'believersCertName' | 'witCertName'>('baptismCertName');
  const [newCertFileName, setNewCertFileName] = useState('');

  // Worker Application Action Handlers
  const handleConfirmAssignMinister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignModalCandidate || !selectedMinisterIdToAssign) return;
    const ministerObj = ministers.find(m => m.id === selectedMinisterIdToAssign);
    const ministerName = ministerObj ? `${ministerObj.title} ${ministerObj.fullName}` : 'Assigned Minister';

    setWorkerRegistrations(prev => prev.map(w => {
      if (w.id === assignModalCandidate.id) {
        return {
          ...w,
          assignedMinisterId: selectedMinisterIdToAssign,
          assignedMinisterName: ministerName
        };
      }
      return w;
    }));

    setAssignModalCandidate(null);
    setSelectedMinisterIdToAssign('');
  };

  const handleAdvanceWorkerStage = (workerId: string, nextStage: WorkerRegistration['currentStage'], nextStatus: WorkerRegistration['stageStatus']) => {
    setWorkerRegistrations(prev => prev.map(w => {
      if (w.id === workerId) {
        return {
          ...w,
          currentStage: nextStage,
          stageStatus: nextStatus
        };
      }
      return w;
    }));
  };

  const handleUploadCandidateCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certModalCandidate || !newCertFileName) return;
    setWorkerRegistrations(prev => prev.map(w => {
      if (w.id === certModalCandidate.id) {
        return {
          ...w,
          certificates: {
            ...w.certificates,
            [newCertType]: newCertFileName
          }
        };
      }
      return w;
    }));
    setCertModalCandidate(null);
    setNewCertFileName('');
  };

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

  // Service Category Edit & Delete State
  const [editingServiceCategory, setEditingServiceCategory] = useState<ServiceCategoryItem | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editCategoryDescription, setEditCategoryDescription] = useState('');
  const [isEditServiceCategoryModalOpen, setIsEditServiceCategoryModalOpen] = useState(false);

  // Service Type Edit & Delete State
  const [editingServiceType, setEditingServiceType] = useState<ServiceTypeItem | null>(null);
  const [editServiceName, setEditServiceName] = useState('');
  const [editServiceCategory, setEditServiceCategory] = useState('');
  const [editServiceCode, setEditServiceCode] = useState('');
  const [editServiceDay, setEditServiceDay] = useState('');
  const [editServiceTime, setEditServiceTime] = useState('');
  const [editServiceTrackAttendance, setEditServiceTrackAttendance] = useState(true);
  const [editServiceTrackOfferings, setEditServiceTrackOfferings] = useState(true);
  const [editServiceDescription, setEditServiceDescription] = useState('');
  const [isEditServiceTypeModalOpen, setIsEditServiceTypeModalOpen] = useState(false);

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
      totalOffering: 245000,
      totalExpenses: 27000,
      netOffering: 218000
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
      totalOffering: 68500,
      totalExpenses: 8500,
      netOffering: 60000
    }
  ]);

  // Notifications
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Reusable Modern Confirmation Alert Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const askConfirmation = ({
    title = 'Confirm Action',
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger',
    onConfirm
  }: {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
  }) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      type,
      onConfirm
    });
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

  // --- Service Category Handlers ---
  const handleStartEditServiceCategory = (cat: ServiceCategoryItem) => {
    setEditingServiceCategory(cat);
    setEditCategoryName(cat.name);
    setEditCategoryDescription(cat.description || '');
    setIsEditServiceCategoryModalOpen(true);
  };

  const handleUpdateServiceCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingServiceCategory) return;
    if (!editCategoryName.trim()) {
      showNotification('Category name is required.', 'error');
      return;
    }

    const updated: ServiceCategoryItem = {
      ...editingServiceCategory,
      name: editCategoryName.trim(),
      description: editCategoryDescription.trim() || 'Parish Service Category'
    };

    setServiceCategories((prev) => prev.map((item) => (item.id === editingServiceCategory.id ? updated : item)));
    showNotification(`Service Category "${updated.name}" updated successfully!`);
    setIsEditServiceCategoryModalOpen(false);
    setEditingServiceCategory(null);
  };

  const handleDeleteServiceCategory = (id: string, name: string) => {
    askConfirmation({
      title: 'Delete Service Category',
      message: `Are you sure you want to delete the service category "${name}"?`,
      confirmText: 'Yes, Delete',
      type: 'danger',
      onConfirm: () => {
        setServiceCategories((prev) => prev.filter((item) => item.id !== id));
        showNotification(`Service Category "${name}" deleted.`);
      }
    });
  };

  // --- Service Type Handlers ---
  const handleStartEditServiceType = (st: ServiceTypeItem) => {
    setEditingServiceType(st);
    setEditServiceName(st.name);
    setEditServiceCategory(st.category);
    setEditServiceCode(st.code || '');
    setEditServiceDay(st.defaultDay || '');
    setEditServiceTime(st.defaultTime || '');
    setEditServiceTrackAttendance(st.trackAttendance);
    setEditServiceTrackOfferings(st.trackOfferings);
    setEditServiceDescription(st.description || '');
    setIsEditServiceTypeModalOpen(true);
  };

  const handleUpdateServiceType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingServiceType) return;
    if (!editServiceName.trim()) {
      showNotification('Service type name is required.', 'error');
      return;
    }

    const updatedCode = editServiceCode.trim() || editServiceName.trim().slice(0, 3).toUpperCase() + '-01';
    const updated: ServiceTypeItem = {
      ...editingServiceType,
      name: editServiceName.trim(),
      category: editServiceCategory,
      code: updatedCode,
      defaultDay: editServiceDay.trim() || undefined,
      defaultTime: editServiceTime.trim() || undefined,
      trackAttendance: editServiceTrackAttendance,
      trackOfferings: editServiceTrackOfferings,
      description: editServiceDescription.trim() || undefined
    };

    setServiceTypes((prev) => prev.map((item) => (item.id === editingServiceType.id ? updated : item)));
    showNotification(`Service Type "${updated.name}" updated successfully!`);
    setIsEditServiceTypeModalOpen(false);
    setEditingServiceType(null);

    try {
      await fetch(`http://localhost:5230/api/v1/Setup/service-types/${editingServiceType.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch {}
  };

  const handleDeleteServiceType = async (id: string, name: string) => {
    askConfirmation({
      title: 'Delete Service Type',
      message: `Are you sure you want to delete the service type "${name}"?`,
      confirmText: 'Yes, Delete',
      type: 'danger',
      onConfirm: async () => {
        setServiceTypes((prev) => prev.filter((item) => item.id !== id));
        showNotification(`Service Type "${name}" deleted.`);

        try {
          await fetch(`http://localhost:5230/api/v1/Setup/service-types/${id}`, {
            method: 'DELETE'
          });
        } catch {}
      }
    });
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
    askConfirmation({
      title: 'Delete Offering Category',
      message: `Are you sure you want to delete the offering category "${name}"?`,
      confirmText: 'Yes, Delete',
      type: 'danger',
      onConfirm: async () => {
        setOfferingCategories((prev) => prev.filter((item) => item.id !== id));
        showNotification(`Offering Category "${name}" deleted successfully.`);

        try {
          await fetch(`http://localhost:5230/api/v1/Setup/offering-categories/${id}`, {
            method: 'DELETE'
          });
        } catch {}
      }
    });
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
    askConfirmation({
      title: 'Delete Department',
      message: `Are you sure you want to delete the department "${name}"?`,
      confirmText: 'Yes, Delete',
      type: 'danger',
      onConfirm: async () => {
        setDepartments((prev) => prev.filter((item) => item.id !== id));
        showNotification(`Department "${name}" deleted successfully.`);

        try {
          await fetch(`http://localhost:5230/api/v1/Setup/departments/${id}`, {
            method: 'DELETE'
          });
        } catch {}
      }
    });
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

  // Service Expenses & Deductions State
  const [serviceExpenses, setServiceExpenses] = useState<ExpenseItem[]>([
    { id: 'exp1', category: 'Guest Minister Honorarium', description: 'Pastor Visiting Speaker Blessing', amount: 15000 },
    { id: 'exp2', category: 'Fuel / Generator', description: 'Diesel for Sunday Generator', amount: 12000 }
  ]);

  const handleAddExpenseItem = () => {
    setServiceExpenses([
      ...serviceExpenses,
      { id: 'exp_' + Date.now(), category: 'Fuel / Generator', description: '', amount: 0 }
    ]);
  };

  const handleUpdateExpenseItem = (id: string, field: keyof ExpenseItem, value: any) => {
    setServiceExpenses(
      serviceExpenses.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  const handleRemoveExpenseItem = (id: string) => {
    setServiceExpenses(serviceExpenses.filter((exp) => exp.id !== id));
  };

  const totalCalculatedAttendance = Number(menCount || 0) + Number(womenCount || 0) + Number(childrenCount || 0);
  const totalCalculatedGrossOffering = serviceCategory === 'Midweek' 
    ? Number(midweekOffering || 0)
    : sundayOfferings.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  
  const totalCalculatedExpenses = serviceExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalCalculatedNetOffering = Math.max(0, totalCalculatedGrossOffering - totalCalculatedExpenses);
  const totalCalculatedOffering = totalCalculatedGrossOffering;

  const calculateDenominationTotal = (denom?: DenominationBreakdown): number => {
    if (!denom) return 0;
    return (
      (Number(denom.n1000) || 0) * 1000 +
      (Number(denom.n500) || 0) * 500 +
      (Number(denom.n200) || 0) * 200 +
      (Number(denom.n100) || 0) * 100 +
      (Number(denom.n50) || 0) * 50
    );
  };

  const handleSundayOfferingChange = (index: number, val: number) => {
    const updated = [...sundayOfferings];
    updated[index].amount = val;
    setSundayOfferings(updated);
  };

  const handleToggleOfferingBreakdown = (index: number) => {
    const updated = [...sundayOfferings];
    updated[index].isBreakdownOpen = !updated[index].isBreakdownOpen;
    setSundayOfferings(updated);
  };

  const handleDenominationChange = (
    index: number,
    field: keyof DenominationBreakdown,
    val: number
  ) => {
    const updated = [...sundayOfferings];
    const item = updated[index];
    const currentDenom = item.denominations || {};
    const updatedDenom = { ...currentDenom, [field]: val >= 0 ? val : 0 };
    item.denominations = updatedDenom;

    const newDenomTotal = calculateDenominationTotal(updatedDenom);
    if (newDenomTotal > 0) {
      item.amount = newDenomTotal;
    }
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
      totalOffering: totalCalculatedGrossOffering,
      totalExpenses: totalCalculatedExpenses,
      netOffering: totalCalculatedNetOffering,
      offeringsBreakdown: serviceCategory === 'Sunday' ? sundayOfferings : undefined,
      expensesBreakdown: serviceExpenses.length > 0 ? serviceExpenses : undefined
    };

    setReports([newReport, ...reports]);
    showNotification(`Service Report submitted! Gross: ${org.baseCurrency} ${totalCalculatedGrossOffering.toLocaleString()} | Expenses: -${org.baseCurrency} ${totalCalculatedExpenses.toLocaleString()} | Net Remittance: ${org.baseCurrency} ${totalCalculatedNetOffering.toLocaleString()}`);
    setActiveTab('dashboard');
  };

  const handleDownloadPDFReport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showNotification('Please allow popups to generate the PDF report.', 'error');
      return;
    }

    const filteredReports = reports.filter((rep) => {
      if (filterStartDate && rep.serviceDate < filterStartDate) return false;
      if (filterEndDate && rep.serviceDate > filterEndDate) return false;
      if (filterServiceTypeName !== 'All' && rep.serviceTypeName !== filterServiceTypeName) return false;
      return true;
    });

    const totalFilteredAttendance = filteredReports.reduce((sum, r) => sum + r.totalAttendance, 0);
    const totalFilteredMen = filteredReports.reduce((sum, r) => sum + r.menCount, 0);
    const totalFilteredWomen = filteredReports.reduce((sum, r) => sum + r.womenCount, 0);
    const totalFilteredChildren = filteredReports.reduce((sum, r) => sum + r.childrenCount, 0);
    const totalFilteredFirstTimers = filteredReports.reduce((sum, r) => sum + r.firstTimersCount, 0);
    const totalFilteredSoulsWon = filteredReports.reduce((sum, r) => sum + r.newConvertsCount, 0);
    const totalFilteredGrossOffering = filteredReports.reduce((sum, r) => sum + r.totalOffering, 0);
    const totalFilteredExpenses = filteredReports.reduce((sum, r) => sum + (r.totalExpenses || 0), 0);
    const totalFilteredNetOffering = filteredReports.reduce((sum, r) => sum + (r.netOffering ?? r.totalOffering), 0);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Parish Service Report (${filterStartDate} to ${filterEndDate}) - ${org.parishName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
            body { font-family: 'Inter', sans-serif; color: #0f172a; margin: 0; padding: 25px; background: #fff; }
            .header { text-align: center; border-bottom: 2px solid #001f3f; padding-bottom: 15px; margin-bottom: 20px; }
            .logo { width: 75px; height: 75px; object-fit: contain; margin-bottom: 8px; }
            .parish-name { font-size: 18px; font-weight: 800; color: #001f3f; text-transform: uppercase; letter-spacing: 1px; }
            .report-title { font-size: 15px; font-weight: 700; color: #dc2626; margin-top: 4px; }
            .meta { font-size: 11px; color: #64748b; margin-top: 6px; }
            
            .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 25px; }
            .metric-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; text-align: center; }
            .metric-val { font-size: 15px; font-weight: 800; color: #0f172a; margin-top: 3px; }
            .metric-label { font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
            
            table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 10px; }
            th { background-color: #001f3f; color: #ffffff; font-weight: 700; text-align: left; padding: 7px 8px; border: 1px solid #001f3f; text-transform: uppercase; font-size: 9px; }
            td { padding: 7px 8px; border: 1px solid #cbd5e1; }
            tr:nth-child(even) { background-color: #f8fafc; }
            
            .footer-sign { margin-top: 40px; display: flex; justify-content: space-between; padding-top: 25px; border-top: 1px dashed #cbd5e1; }
            .sign-box { text-align: center; width: 180px; }
            .sign-line { border-top: 1px solid #0f172a; margin-top: 35px; margin-bottom: 4px; }
            .sign-label { font-size: 10px; font-weight: 700; color: #475569; text-transform: uppercase; }
            
            @media print {
              body { padding: 0; }
              @page { size: A4 landscape; margin: 12mm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${org.logoUrl}" class="logo" />
            <div class="parish-name">${org.parishName}</div>
            <div class="report-title">
              Parish Service ${filterReportType === 'All' ? 'Attendance & Financial' : filterReportType} Summary Report
            </div>
            <div class="meta">
              Date Range: <strong>${filterStartDate}</strong> to <strong>${filterEndDate}</strong> | 
              Service Scope: <strong>${filterServiceTypeName}</strong> | 
              Report Category: <strong>${filterReportType}</strong> | 
              Generated On: ${new Date().toLocaleString()}
            </div>
          </div>

          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-label">Services Logged</div>
              <div class="metric-val">${filteredReports.length} Services</div>
            </div>
            ${filterReportType !== 'Financial' ? `
              <div class="metric-card">
                <div class="metric-label">Total Attendance</div>
                <div class="metric-val">${totalFilteredAttendance.toLocaleString()}</div>
                <div style="font-size:9px; color:#475569; margin-top:2px;">M: ${totalFilteredMen} | W: ${totalFilteredWomen} | C: ${totalFilteredChildren}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">First Timers & Converts</div>
                <div class="metric-val">${totalFilteredFirstTimers} / ${totalFilteredSoulsWon}</div>
                <div style="font-size:9px; color:#16a34a; margin-top:2px;">${totalFilteredSoulsWon} Souls Won</div>
              </div>
            ` : ''}
            ${filterReportType !== 'Demographics' ? `
              <div class="metric-card" style="border-color:#bbf7d0; background:#f0fdf4;">
                <div class="metric-label" style="color:#15803d;">Gross Offering</div>
                <div class="metric-val" style="color:#166534;">${org.baseCurrency} ${totalFilteredGrossOffering.toLocaleString()}</div>
              </div>
              <div class="metric-card" style="border-color:#fecdd3; background:#fff1f2;">
                <div class="metric-label" style="color:#be123c;">Total Expenses Deducted</div>
                <div class="metric-val" style="color:#9f1239;">- ${org.baseCurrency} ${totalFilteredExpenses.toLocaleString()}</div>
              </div>
              <div class="metric-card" style="border-color:#fde68a; background:#fffbeb;">
                <div class="metric-label" style="color:#b45309;">Net Remittance Total</div>
                <div class="metric-val" style="color:#92400e;">${org.baseCurrency} ${totalFilteredNetOffering.toLocaleString()}</div>
              </div>
            ` : ''}
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Service Name</th>
                <th>Category</th>
                ${filterReportType !== 'Financial' ? `
                  <th>Men</th>
                  <th>Women</th>
                  <th>Children</th>
                  <th>Total Attendance</th>
                  <th>1st Timers</th>
                  <th>Souls Won</th>
                ` : ''}
                ${filterReportType !== 'Demographics' ? `
                  <th>Gross Offering (${org.baseCurrency})</th>
                  <th>Deducted Expenses (${org.baseCurrency})</th>
                  <th>Net Remittance (${org.baseCurrency})</th>
                ` : ''}
                <th>Preacher / Minister</th>
              </tr>
            </thead>
            <tbody>
              ${filteredReports.length === 0 ? `
                <tr><td colspan="14" style="text-align:center; padding:20px; color:#94a3b8;">No service reports match the selected filters.</td></tr>
              ` : filteredReports.map((r, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td><strong>${r.serviceDate}</strong></td>
                  <td>${r.serviceTypeName}</td>
                  <td><span style="padding:2px 6px; border-radius:4px; font-size:10px; font-weight:bold; background:${r.category === 'Sunday' ? '#eff6ff; color:#1e40af' : '#f0fdf4; color:#166534'}">${r.category}</span></td>
                  ${filterReportType !== 'Financial' ? `
                    <td>${r.menCount}</td>
                    <td>${r.womenCount}</td>
                    <td>${r.childrenCount}</td>
                    <td><strong>${r.totalAttendance}</strong></td>
                    <td>${r.firstTimersCount}</td>
                    <td style="color:#dc2626; font-weight:bold;">${r.newConvertsCount}</td>
                  ` : ''}
                  ${filterReportType !== 'Demographics' ? `
                    <td style="font-weight:bold; color:#166534;">${org.baseCurrency} ${r.totalOffering.toLocaleString()}</td>
                    <td style="color:#be123c;">- ${org.baseCurrency} ${(r.totalExpenses || 0).toLocaleString()}</td>
                    <td style="font-weight:bold; color:#b45309;">${org.baseCurrency} ${(r.netOffering ?? r.totalOffering).toLocaleString()}</td>
                  ` : ''}
                  <td>${r.preacherName || 'Parish Pastorate'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer-sign">
            <div class="sign-box">
              <div class="sign-line"></div>
              <div class="sign-label">Prepared By (Admin / Secretary)</div>
            </div>
            <div class="sign-box">
              <div class="sign-line"></div>
              <div class="sign-label">Authorized Pastor / Minister</div>
            </div>
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
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

  // Standalone Public House Fellowship Report Form (when share link ?report=fellowship is opened or previewed)
  if (showPublicFellowshipForm) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 py-8 animate-fadeIn">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden my-auto">
          {/* Header Banner */}
          <div className="bg-gradient-to-b from-slate-950 via-rccg-navy to-purple-950 text-white p-6 sm:p-8 relative text-center flex flex-col items-center">
            <button
              type="button"
              onClick={() => {
                setShowPublicFellowshipForm(false);
                setPublicFellowshipSuccess(false);
              }}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full text-slate-200 hover:text-white transition cursor-pointer"
              title="Return to Main Website"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Centralized & Bigger Logo */}
            <div className="mb-3">
              <img src={org.logoUrl} alt="RCCG Logo" className="w-24 h-24 object-contain mx-auto drop-shadow-xl" />
            </div>

            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 mb-2.5 block">
              {org.parishName}
            </span>

            <h2 className="text-base sm:text-lg font-extrabold leading-snug max-w-lg mx-auto text-white">
              RCCG House Fellowship Weekly Entry
            </h2>

            <p className="text-xs text-blue-100 italic mt-3 pt-3 border-t border-white/20 max-w-md mx-auto">
              Acts 2:46 — "And continuing daily with one accord in the temple, and breaking bread from house to house, they ate their food with gladness and simplicity of heart..."
            </p>
          </div>

          {/* Form Body or Success State */}
          {publicFellowshipSuccess ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">House Fellowship Report Logged!</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Glory to God! The weekly report for your House Fellowship center has been successfully submitted and captured in the parish database.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPublicFellowshipSuccess(false);
                    setPubFellowshipCenter('');
                    setPubFellowshipLeader('');
                    setPubFellowshipTopic('');
                    setPubFellowshipMen(0);
                    setPubFellowshipWomen(0);
                    setPubFellowshipChildren(0);
                    setPubFellowshipOffering(0);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Submit Another Center Report
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowPublicFellowshipForm(false);
                    setPublicFellowshipSuccess(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-rccg-blue hover:bg-rccg-navy text-white text-xs font-bold shadow cursor-pointer"
                >
                  Continue to Website
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!pubFellowshipCenter.trim()) {
                  showNotification('Please enter Center / Location Name.', 'error');
                  return;
                }
                const totalAtt = Number(pubFellowshipMen || 0) + Number(pubFellowshipWomen || 0) + Number(pubFellowshipChildren || 0);
                const newReport: HouseFellowshipReportItem = {
                  id: 'hfr_' + Date.now(),
                  centerName: pubFellowshipCenter.trim(),
                  reportDate: new Date().toISOString().split('T')[0],
                  menCount: Number(pubFellowshipMen || 0),
                  womenCount: Number(pubFellowshipWomen || 0),
                  childrenCount: Number(pubFellowshipChildren || 0),
                  totalAttendance: totalAtt,
                  offeringAmount: Number(pubFellowshipOffering || 0),
                  studyTopic: pubFellowshipTopic.trim() || 'Living a Life of Holiness',
                  leaderName: pubFellowshipLeader.trim() || 'Center Leader'
                };
                setHouseFellowshipReports(prev => [newReport, ...prev]);
                setPublicFellowshipSuccess(true);
              }}
              className="p-6 sm:p-8 space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Center / Location Name *</label>
                  <input
                    type="text"
                    required
                    value={pubFellowshipCenter}
                    onChange={(e) => setPubFellowshipCenter(e.target.value)}
                    placeholder="e.g. Grace Center - Victoria Island"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Center Leader Name</label>
                  <input
                    type="text"
                    value={pubFellowshipLeader}
                    onChange={(e) => setPubFellowshipLeader(e.target.value)}
                    placeholder="e.g. Brother Samuel / Deaconess Mary"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Study Topic / Manual Title</label>
                <input
                  type="text"
                  value={pubFellowshipTopic}
                  onChange={(e) => setPubFellowshipTopic(e.target.value)}
                  placeholder="e.g. Living a Life of Holiness"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium"
                />
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Attendance Breakdown</span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Men Count</label>
                    <input
                      type="number"
                      min="0"
                      value={pubFellowshipMen}
                      onChange={(e) => setPubFellowshipMen(parseInt(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Women Count</label>
                    <input
                      type="number"
                      min="0"
                      value={pubFellowshipWomen}
                      onChange={(e) => setPubFellowshipWomen(parseInt(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Children Count</label>
                    <input
                      type="number"
                      min="0"
                      value={pubFellowshipChildren}
                      onChange={(e) => setPubFellowshipChildren(parseInt(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                    />
                  </div>
                </div>
                <div className="pt-2 flex justify-between items-center text-xs font-bold text-slate-700 border-t border-slate-200">
                  <span>Calculated Total Attendance:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-rccg-blue font-bold">
                    {Number(pubFellowshipMen || 0) + Number(pubFellowshipWomen || 0) + Number(pubFellowshipChildren || 0)} Members
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Offering Amount ({org.baseCurrency})</label>
                <input
                  type="number"
                  min="0"
                  value={pubFellowshipOffering}
                  onChange={(e) => setPubFellowshipOffering(parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 25000"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-emerald-700"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-rccg-blue hover:bg-rccg-navy text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Building2 className="w-4 h-4" />
                <span>Submit House Fellowship Weekly Report</span>
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Standalone Public Church on the Street Outreach Form (when share link ?report=outreach is opened or previewed)
  if (showPublicOutreachForm) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 py-8 animate-fadeIn">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden my-auto">
          {/* Header Banner */}
          <div className="bg-gradient-to-b from-slate-950 via-rccg-navy to-red-950 text-white p-6 sm:p-8 relative text-center flex flex-col items-center">
            <button
              type="button"
              onClick={() => {
                setShowPublicOutreachForm(false);
                setPublicOutreachSuccess(false);
              }}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full text-slate-200 hover:text-white transition cursor-pointer"
              title="Return to Main Website"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Centralized & Bigger Logo */}
            <div className="mb-3">
              <img src={org.logoUrl} alt="RCCG Logo" className="w-24 h-24 object-contain mx-auto drop-shadow-xl" />
            </div>

            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 mb-2.5 block">
              {org.parishName}
            </span>

            <h2 className="text-base sm:text-lg font-extrabold leading-snug max-w-lg mx-auto text-white">
              Church on the Street (Outreach & Evangelism Log)
            </h2>

            <p className="text-xs text-red-100 italic mt-3 pt-3 border-t border-white/20 max-w-md mx-auto">
              Mark 16:15 — "And He said to them, Go into all the world and preach the gospel to every creature."
            </p>
          </div>

          {/* Form Body or Success State */}
          {publicOutreachSuccess ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Outreach Log Submitted!</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Glory to God! The outreach log for your street evangelism location has been successfully recorded into the parish database.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPublicOutreachSuccess(false);
                    setPubOutreachLocation('');
                    setPubOutreachLeader('');
                    setPubOutreachMen(0);
                    setPubOutreachWomen(0);
                    setPubOutreachChildren(0);
                    setPubOutreachSouls(0);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Submit Another Location
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowPublicOutreachForm(false);
                    setPublicOutreachSuccess(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-rccg-red hover:bg-red-800 text-white text-xs font-bold shadow cursor-pointer"
                >
                  Continue to Website
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!pubOutreachLocation.trim()) {
                  showNotification('Please enter Outreach Street / Location.', 'error');
                  return;
                }
                const totalR = Number(pubOutreachMen || 0) + Number(pubOutreachWomen || 0) + Number(pubOutreachChildren || 0);
                const newReport: OutreachReportItem = {
                  id: 'out_' + Date.now(),
                  locationName: pubOutreachLocation.trim(),
                  reportDate: new Date().toISOString().split('T')[0],
                  menReached: Number(pubOutreachMen || 0),
                  womenReached: Number(pubOutreachWomen || 0),
                  childrenReached: Number(pubOutreachChildren || 0),
                  totalReached: totalR,
                  soulsWonCount: Number(pubOutreachSouls || 0),
                  leaderName: pubOutreachLeader.trim() || 'Evangelism Leader'
                };
                setOutreachReports(prev => [newReport, ...prev]);
                setPublicOutreachSuccess(true);
              }}
              className="p-6 sm:p-8 space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Outreach Street / Location *</label>
                  <input
                    type="text"
                    required
                    value={pubOutreachLocation}
                    onChange={(e) => setPubOutreachLocation(e.target.value)}
                    placeholder="e.g. Market Square Outreach"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Evangelism Leader Name</label>
                  <input
                    type="text"
                    value={pubOutreachLeader}
                    onChange={(e) => setPubOutreachLeader(e.target.value)}
                    placeholder="e.g. Minister David Okafor"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">People Reached Breakdown</span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Men Reached</label>
                    <input
                      type="number"
                      value={pubOutreachMen}
                      onChange={(e) => setPubOutreachMen(parseInt(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Women Reached</label>
                    <input
                      type="number"
                      value={pubOutreachWomen}
                      onChange={(e) => setPubOutreachWomen(parseInt(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Children Reached</label>
                    <input
                      type="number"
                      value={pubOutreachChildren}
                      onChange={(e) => setPubOutreachChildren(parseInt(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-center"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-600">Calculated Total Reached:</span>
                  <span className="font-extrabold text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200">
                    {Number(pubOutreachMen || 0) + Number(pubOutreachWomen || 0) + Number(pubOutreachChildren || 0)} People
                  </span>
                </div>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
                <label className="block text-xs font-bold text-red-900 mb-1">
                  Souls Won (Converts) *
                </label>
                <input
                  type="number"
                  required
                  value={pubOutreachSouls}
                  onChange={(e) => setPubOutreachSouls(parseInt(e.target.value) || 0)}
                  placeholder="Number of converts"
                  className="w-full bg-white border border-red-300 rounded-xl px-3.5 py-2.5 text-sm font-extrabold text-rccg-red focus:ring-2 focus:ring-rccg-red"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-rccg-red hover:bg-red-800 text-white rounded-xl text-xs font-extrabold shadow-lg hover:shadow-xl transition cursor-pointer flex items-center justify-center space-x-2"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Submit Outreach Report</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Standalone Public Member Registration Form (when share link ?register=member is opened or previewed)
  if (showPublicMemberForm) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 py-8 animate-fadeIn">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden my-auto">
          {/* Header Banner */}
          <div className="bg-gradient-to-b from-slate-950 via-rccg-navy to-purple-950 text-white p-6 sm:p-8 relative text-center flex flex-col items-center">
            <button
              type="button"
              onClick={() => {
                setShowPublicMemberForm(false);
                setPublicFormSuccess(false);
              }}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full text-slate-200 hover:text-white transition cursor-pointer"
              title="Return to Main Website"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Centralized & Bigger Logo (No white background patch) */}
            <div className="mb-3">
              <img src={org.logoUrl} alt="RCCG Logo" className="w-24 h-24 object-contain mx-auto drop-shadow-xl" />
            </div>

            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 mb-2.5 block">
              {org.parishName}
            </span>

            <h2 className="text-base sm:text-lg font-extrabold leading-snug max-w-lg mx-auto text-white">
              "I love this family of God, Lets get to Know and Celebrate with You as a Member of Glorious Family"
            </h2>

            <p className="text-xs text-blue-100 italic mt-3 pt-3 border-t border-white/20 max-w-md mx-auto">
              1 John 4:7-8 — "Beloved, let us love one another, for love is of God; and everyone who loves is born of God and knows God."
            </p>
          </div>

          {/* Form Body or Success State */}
          {publicFormSuccess ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Welcome to the Glorious Family!</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Thank you for submitting your details. You are now registered in our parish directory. We look forward to celebrating and growing together in Christ!
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPublicFormSuccess(false);
                    setRegSurname('');
                    setRegFirstname('');
                    setRegWhatsapp('');
                    setRegEmail('');
                    setRegAddress('');
                    setRegDobDay(1);
                    setRegDobMonth('January');
                    setRegGender('Male');
                    setRegMaritalStatus('Single');
                    setRegProfileImageUrl(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Register Another Member
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowPublicMemberForm(false);
                    setPublicFormSuccess(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-rccg-blue hover:bg-rccg-navy text-white text-xs font-bold shadow cursor-pointer"
                >
                  Continue to Website
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!regSurname || !regFirstname || !regWhatsapp) {
                  showNotification('Please fill in Surname, Firstname, and Whatsapp Number.', 'error');
                  return;
                }
                const newMember: Member = {
                  id: 'mem_' + Date.now(),
                  surname: regSurname,
                  firstname: regFirstname,
                  fullName: `${regSurname} ${regFirstname}`,
                  whatsappNumber: regWhatsapp,
                  email: regEmail || 'N/A',
                  homeAddress: regAddress || 'N/A',
                  dobDay: regDobDay,
                  dobMonth: regDobMonth,
                  gender: regGender,
                  maritalStatus: regMaritalStatus,
                  profileImageUrl: regProfileImageUrl,
                  membershipStatus: 'Full Member',
                  assignedDepartment: null,
                  role: 'Member',
                  dateJoined: new Date().toISOString().split('T')[0]
                };
                setMembers(prev => [newMember, ...prev]);
                setPublicFormSuccess(true);
              }}
              className="p-6 sm:p-8 space-y-5"
            >
              {/* PROFILE PHOTO UPLOAD */}
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-rccg-blue/30 overflow-hidden flex items-center justify-center shadow-inner">
                    {regProfileImageUrl ? (
                      <img src={regProfileImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 text-slate-400" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-rccg-blue text-white p-2 rounded-full shadow hover:bg-rccg-navy transition cursor-pointer">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setRegProfileImageUrl(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                <span className="text-[11px] font-bold text-slate-500">Upload Profile Photo (Optional)</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Surname *</label>
                  <input
                    type="text"
                    required
                    value={regSurname}
                    onChange={(e) => setRegSurname(e.target.value)}
                    placeholder="e.g. Okon"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Firstname *</label>
                  <input
                    type="text"
                    required
                    value={regFirstname}
                    onChange={(e) => setRegFirstname(e.target.value)}
                    placeholder="e.g. Emmanuel"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Whatsapp Number *</label>
                  <input
                    type="tel"
                    required
                    value={regWhatsapp}
                    onChange={(e) => setRegWhatsapp(e.target.value)}
                    placeholder="e.g. +2348031112233"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Home Address</label>
                <input
                  type="text"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  placeholder="12 Allen Avenue, Ikeja, Lagos"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium"
                />
              </div>

              {/* DATE OF BIRTH */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl space-y-2">
                <label className="block text-xs font-bold text-rccg-blue flex items-center gap-1.5">
                  <span>🎂 Date of Birth (Day & Month)</span>
                </label>
                <p className="text-[11px] text-slate-500 font-medium">Used to send automated birthday greetings & announcements.</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Day</label>
                    <select
                      value={regDobDay}
                      onChange={(e) => setRegDobDay(parseInt(e.target.value) || 1)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                        <option key={day} value={day}>Day {day}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Month</label>
                    <select
                      value={regDobMonth}
                      onChange={(e) => setRegDobMonth(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                    >
                      {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={regGender}
                    onChange={(e) => setRegGender(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Marital Status</label>
                  <select
                    value={regMaritalStatus}
                    onChange={(e) => setRegMaritalStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800"
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Engaged">Engaged</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Divorced">Divorced</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-rccg-blue hover:bg-rccg-navy text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Submit Member Profile</span>
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

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

        {/* SERVICE REPORTING TAB - Dynamic Form Engine & Filter Analytics */}
        {activeTab === 'service-report' && (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* SUB-TAB SWITCHER */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex space-x-2">
              <button
                type="button"
                onClick={() => setServiceReportSubTab('entry')}
                className={`flex-1 py-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer ${
                  serviceReportSubTab === 'entry'
                    ? 'bg-rccg-blue text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Submit Service Report</span>
              </button>

              <button
                type="button"
                onClick={() => setServiceReportSubTab('filter-reports')}
                className={`flex-1 py-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer ${
                  serviceReportSubTab === 'filter-reports'
                    ? 'bg-rccg-blue text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Filtered Reports & PDF Export ({reports.filter(r => {
                  if (filterStartDate && r.serviceDate < filterStartDate) return false;
                  if (filterEndDate && r.serviceDate > filterEndDate) return false;
                  if (filterServiceTypeName !== 'All' && r.serviceTypeName !== filterServiceTypeName) return false;
                  return true;
                }).length})</span>
              </button>
            </div>

            {/* TAB 1: SUBMIT SERVICE REPORT FORM */}
            {serviceReportSubTab === 'entry' && (
              <div className="space-y-6">
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
                            </>
                          ) : (
                            <>
                              <option value="Digging Deep (Midweek)">Digging Deep (Midweek)</option>
                              <option value="Faith Clinic (Midweek)">Faith Clinic (Midweek)</option>
                              <option value="Holy Ghost Night Vigil">Holy Ghost Night Vigil</option>
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
                        className="w-full sm:w-1/2 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-rccg-blue"
                      />
                    </div>
                  </div>

                  {/* Attendance & Demographics Input Section */}
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t">
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
                        <p className="text-xs text-slate-500">Enter line-item amounts for each offering category configured under Parish Setup. Expand any offering to optionally count Naira notes (1,000 to 50):</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {sundayOfferings.map((item, idx) => {
                            const denomTotal = calculateDenominationTotal(item.denominations);
                            const hasDenomData = denomTotal > 0;
                            const isMatch = hasDenomData && denomTotal === item.amount;

                            return (
                              <div key={item.categoryId} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 transition">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                  <div>
                                    <span className="text-xs font-bold text-slate-800 block">{item.name}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleToggleOfferingBreakdown(idx)}
                                      className="text-[11px] font-semibold text-rccg-blue hover:text-rccg-navy transition flex items-center space-x-1 mt-0.5 cursor-pointer"
                                    >
                                      <Sliders className="w-3 h-3 text-rccg-blue" />
                                      <span>{item.isBreakdownOpen ? 'Hide Note Count' : 'Count Notes (1000, 500, 200, 100, 50)'}</span>
                                      {hasDenomData && (
                                        <span className="ml-1 px-2 py-0.2 rounded-full text-[10px] font-mono font-bold bg-purple-100 text-purple-800">
                                          Counted: ₦{denomTotal.toLocaleString()}
                                        </span>
                                      )}
                                    </button>
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs font-bold text-slate-400">{org.baseCurrency}</span>
                                    <input
                                      type="number"
                                      min="0"
                                      value={item.amount || ''}
                                      onChange={(e) => handleSundayOfferingChange(idx, parseFloat(e.target.value) || 0)}
                                      placeholder="0"
                                      className="w-32 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-sm font-extrabold text-slate-900 text-right focus:ring-2 focus:ring-rccg-blue"
                                    />
                                  </div>
                                </div>

                                {/* COLLAPSIBLE CURRENCY DENOMINATION BREAKDOWN */}
                                {item.isBreakdownOpen && (
                                  <div className="pt-3 border-t border-slate-200 bg-white p-3.5 rounded-xl space-y-3 animate-fadeIn">
                                    <div className="flex justify-between items-center text-xs">
                                      <span className="font-bold text-slate-700 flex items-center space-x-1.5">
                                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>Notes Count Breakdown (Optional)</span>
                                      </span>

                                      {hasDenomData && (
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                          isMatch ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                        }`}>
                                          {isMatch ? `✓ Matches ₦${item.amount.toLocaleString()}` : `Notes Sum: ₦${denomTotal.toLocaleString()}`}
                                        </span>
                                      )}
                                    </div>

                                    <div className="grid grid-cols-5 gap-2">
                                      <div>
                                        <label className="block text-[10px] font-bold text-slate-600 text-center mb-1">₦1,000</label>
                                        <input
                                          type="number"
                                          min="0"
                                          value={item.denominations?.n1000 || ''}
                                          onChange={(e) => handleDenominationChange(idx, 'n1000', parseInt(e.target.value) || 0)}
                                          placeholder="0"
                                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-bold text-center"
                                        />
                                        <span className="block text-[9px] text-slate-400 text-center mt-0.5">
                                          =₦{((item.denominations?.n1000 || 0) * 1000).toLocaleString()}
                                        </span>
                                      </div>

                                      <div>
                                        <label className="block text-[10px] font-bold text-slate-600 text-center mb-1">₦500</label>
                                        <input
                                          type="number"
                                          min="0"
                                          value={item.denominations?.n500 || ''}
                                          onChange={(e) => handleDenominationChange(idx, 'n500', parseInt(e.target.value) || 0)}
                                          placeholder="0"
                                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-bold text-center"
                                        />
                                        <span className="block text-[9px] text-slate-400 text-center mt-0.5">
                                          =₦{((item.denominations?.n500 || 0) * 500).toLocaleString()}
                                        </span>
                                      </div>

                                      <div>
                                        <label className="block text-[10px] font-bold text-slate-600 text-center mb-1">₦200</label>
                                        <input
                                          type="number"
                                          min="0"
                                          value={item.denominations?.n200 || ''}
                                          onChange={(e) => handleDenominationChange(idx, 'n200', parseInt(e.target.value) || 0)}
                                          placeholder="0"
                                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-bold text-center"
                                        />
                                        <span className="block text-[9px] text-slate-400 text-center mt-0.5">
                                          =₦{((item.denominations?.n200 || 0) * 200).toLocaleString()}
                                        </span>
                                      </div>

                                      <div>
                                        <label className="block text-[10px] font-bold text-slate-600 text-center mb-1">₦100</label>
                                        <input
                                          type="number"
                                          min="0"
                                          value={item.denominations?.n100 || ''}
                                          onChange={(e) => handleDenominationChange(idx, 'n100', parseInt(e.target.value) || 0)}
                                          placeholder="0"
                                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-bold text-center"
                                        />
                                        <span className="block text-[9px] text-slate-400 text-center mt-0.5">
                                          =₦{((item.denominations?.n100 || 0) * 100).toLocaleString()}
                                        </span>
                                      </div>

                                      <div>
                                        <label className="block text-[10px] font-bold text-slate-600 text-center mb-1">₦50</label>
                                        <input
                                          type="number"
                                          min="0"
                                          value={item.denominations?.n50 || ''}
                                          onChange={(e) => handleDenominationChange(idx, 'n50', parseInt(e.target.value) || 0)}
                                          placeholder="0"
                                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-bold text-center"
                                        />
                                        <span className="block text-[9px] text-slate-400 text-center mt-0.5">
                                          =₦{((item.denominations?.n50 || 0) * 50).toLocaleString()}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 4. SERVICE EXPENSES & REMITTANCE SUMMARY */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-3">
                      <h3 className="text-md font-bold text-slate-900 flex items-center space-x-2">
                        <Receipt className="w-5 h-5 text-amber-600" />
                        <span>4. Service Expenses & Financial Remittance Summary</span>
                      </h3>
                      <button
                        type="button"
                        onClick={handleAddExpenseItem}
                        className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer border border-amber-200"
                      >
                        <Plus className="w-3.5 h-3.5 text-amber-600" />
                        <span>Add Expense Line Item</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-500">
                      Record any service-related expenses or instant cash disbursements (e.g. Guest Minister Honorarium, Fuel for Generator, Refreshments, Transportation). Deductions will be automatically subtracted from Gross Collection to compute Net Remittance.
                    </p>

                    {/* EXPENSES LINE ITEMS */}
                    {serviceExpenses.length > 0 ? (
                      <div className="space-y-3">
                        {serviceExpenses.map((exp) => (
                          <div key={exp.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                            <div className="sm:col-span-4">
                              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Expense Category</label>
                              <select
                                value={exp.category}
                                onChange={(e) => handleUpdateExpenseItem(exp.id, 'category', e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-rccg-blue"
                              >
                                <option value="Guest Minister Honorarium">Guest Minister Honorarium</option>
                                <option value="Fuel / Generator">Fuel / Generator</option>
                                <option value="Refreshments & Welfare">Refreshments & Welfare</option>
                                <option value="Transportation / Logistics">Transportation / Logistics</option>
                                <option value="Media & Sound Equipment">Media & Sound Equipment</option>
                                <option value="Maintenance / Miscellaneous">Maintenance / Miscellaneous</option>
                              </select>
                            </div>

                            <div className="sm:col-span-4">
                              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Description / Purpose</label>
                              <input
                                type="text"
                                value={exp.description}
                                onChange={(e) => handleUpdateExpenseItem(exp.id, 'description', e.target.value)}
                                placeholder="e.g. Fuel for generator during 1st service"
                                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-rccg-blue"
                              />
                            </div>

                            <div className="sm:col-span-3">
                              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Amount ({org.baseCurrency})</label>
                              <input
                                type="number"
                                min="0"
                                value={exp.amount || ''}
                                onChange={(e) => handleUpdateExpenseItem(exp.id, 'amount', parseFloat(e.target.value) || 0)}
                                placeholder="0"
                                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900 text-right focus:ring-2 focus:ring-rccg-blue"
                              />
                            </div>

                            <div className="sm:col-span-1 flex justify-end pt-2 sm:pt-4">
                              <button
                                type="button"
                                onClick={() => handleRemoveExpenseItem(exp.id)}
                                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                                title="Remove expense line"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                        <p className="text-xs text-slate-400 font-medium">No service expenses recorded yet.</p>
                        <button
                          type="button"
                          onClick={handleAddExpenseItem}
                          className="mt-2 text-xs font-bold text-rccg-blue hover:underline inline-flex items-center space-x-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Expense Line Item</span>
                        </button>
                      </div>
                    )}

                    {/* FINANCIAL REMITTANCE SUMMARY BOX */}
                    <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-inner grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="border-b sm:border-b-0 sm:border-r border-slate-800 pb-3 sm:pb-0 sm:pr-4">
                        <span className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Gross Total Collection</span>
                        <span className="text-xl font-black text-emerald-400 mt-1 block">
                          {org.baseCurrency} {totalCalculatedGrossOffering.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400">Total collected before expenses</span>
                      </div>

                      <div className="border-b sm:border-b-0 sm:border-r border-slate-800 pb-3 sm:pb-0 sm:pr-4">
                        <span className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Total Expenses Deducted</span>
                        <span className="text-xl font-black text-rose-400 mt-1 block">
                          - {org.baseCurrency} {totalCalculatedExpenses.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400">{serviceExpenses.length} expense line item(s)</span>
                      </div>

                      <div>
                        <span className="block text-xs font-medium text-amber-300 uppercase tracking-wider">Net Remittance Total</span>
                        <span className="text-2xl font-black text-amber-400 mt-1 block">
                          {org.baseCurrency} {totalCalculatedNetOffering.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold">Final net amount to be remitted/banked</span>
                      </div>
                    </div>
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

            {/* TAB 2: FILTERED REPORTS & PDF EXPORT */}
            {serviceReportSubTab === 'filter-reports' && (() => {
              const filteredReports = reports.filter((rep) => {
                if (filterStartDate && rep.serviceDate < filterStartDate) return false;
                if (filterEndDate && rep.serviceDate > filterEndDate) return false;
                if (filterServiceTypeName !== 'All' && rep.serviceTypeName !== filterServiceTypeName) return false;
                return true;
              });

              const totalFilteredAttendance = filteredReports.reduce((sum, r) => sum + r.totalAttendance, 0);
              const totalFilteredMen = filteredReports.reduce((sum, r) => sum + r.menCount, 0);
              const totalFilteredWomen = filteredReports.reduce((sum, r) => sum + r.womenCount, 0);
              const totalFilteredChildren = filteredReports.reduce((sum, r) => sum + r.childrenCount, 0);
              const totalFilteredFirstTimers = filteredReports.reduce((sum, r) => sum + r.firstTimersCount, 0);
              const totalFilteredSoulsWon = filteredReports.reduce((sum, r) => sum + r.newConvertsCount, 0);
              const totalFilteredGrossOffering = filteredReports.reduce((sum, r) => sum + r.totalOffering, 0);
              const totalFilteredExpenses = filteredReports.reduce((sum, r) => sum + (r.totalExpenses || 0), 0);
              const totalFilteredNetOffering = filteredReports.reduce((sum, r) => sum + (r.netOffering ?? r.totalOffering), 0);

              return (
                <div className="space-y-6 animate-fadeIn">
                  {/* FILTER CONTROL CARD */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                          <Sliders className="w-5 h-5 text-rccg-blue" />
                          <span>Service Reports Analytics & Filtering</span>
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">Filter by date range, specific service type, and report category (Financial vs Demographics).</p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={handleDownloadPDFReport}
                          className="px-4 py-2.5 rounded-xl bg-rccg-red hover:bg-red-800 text-white text-xs font-bold transition flex items-center space-x-2 cursor-pointer shadow-md"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download PDF Report</span>
                        </button>
                      </div>
                    </div>

                    {/* FILTERS INPUT GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">From Date</label>
                        <input
                          type="date"
                          value={filterStartDate}
                          onChange={(e) => setFilterStartDate(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-rccg-blue"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">To Date</label>
                        <input
                          type="date"
                          value={filterEndDate}
                          onChange={(e) => setFilterEndDate(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-rccg-blue"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Service Type</label>
                        <select
                          value={filterServiceTypeName}
                          onChange={(e) => setFilterServiceTypeName(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-rccg-blue"
                        >
                          <option value="All">All Service Types</option>
                          {serviceTypes.map(st => (
                            <option key={st.id} value={st.name}>{st.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Report Category</label>
                        <select
                          value={filterReportType}
                          onChange={(e) => setFilterReportType(e.target.value as any)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-rccg-blue"
                        >
                          <option value="All">All Categories (Financial & Demographics)</option>
                          <option value="Demographics">Demographics & Attendance Only</option>
                          <option value="Financial">Financial & Offerings Only</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* FILTERED SUMMARY METRIC CARDS */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Matching Reports</span>
                      <div className="text-2xl font-extrabold text-slate-900 mt-1">{filteredReports.length} Services</div>
                      <span className="text-xs text-slate-400 mt-1 block">In selected period</span>
                    </div>

                    {filterReportType !== 'Financial' && (
                      <>
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Attendance</span>
                          <div className="text-2xl font-extrabold text-rccg-blue mt-1">{totalFilteredAttendance.toLocaleString()}</div>
                          <span className="text-xs text-slate-500 mt-1 block">M: {totalFilteredMen} | W: {totalFilteredWomen} | C: {totalFilteredChildren}</span>
                        </div>

                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">1st Timers & Souls Won</span>
                          <div className="text-2xl font-extrabold text-amber-600 mt-1">{totalFilteredFirstTimers} / {totalFilteredSoulsWon}</div>
                          <span className="text-xs text-rccg-red font-semibold mt-1 block">{totalFilteredSoulsWon} New Converts Logged</span>
                        </div>
                      </>
                    )}

                    {filterReportType !== 'Demographics' && (
                      <>
                        <div className="bg-emerald-50/50 p-5 rounded-2xl shadow-sm border border-emerald-200">
                          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">Gross Offering</span>
                          <div className="text-2xl font-extrabold text-emerald-700 mt-1">{org.baseCurrency} {totalFilteredGrossOffering.toLocaleString()}</div>
                          <span className="text-xs text-emerald-600 font-medium mt-1 block">Total collection</span>
                        </div>

                        <div className="bg-rose-50/50 p-5 rounded-2xl shadow-sm border border-rose-200">
                          <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block">Expenses Deducted</span>
                          <div className="text-2xl font-extrabold text-rose-700 mt-1">- {org.baseCurrency} {totalFilteredExpenses.toLocaleString()}</div>
                          <span className="text-xs text-rose-600 font-medium mt-1 block">Service disbursements</span>
                        </div>

                        <div className="bg-amber-50/50 p-5 rounded-2xl shadow-sm border border-amber-200">
                          <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">Net Remittance Total</span>
                          <div className="text-2xl font-extrabold text-amber-700 mt-1">{org.baseCurrency} {totalFilteredNetOffering.toLocaleString()}</div>
                          <span className="text-xs text-amber-600 font-bold mt-1 block">Net bank remittance</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* FILTERED TABLE */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Filtered Service Log Records ({filteredReports.length})</h4>
                      <span className="text-xs font-medium text-slate-500">Showing scope: {filterReportType}</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px]">
                            <th className="p-3.5">Date</th>
                            <th className="p-3.5">Service Name</th>
                            <th className="p-3.5">Category</th>
                            {filterReportType !== 'Financial' && (
                              <>
                                <th className="p-3.5 text-center">Men</th>
                                <th className="p-3.5 text-center">Women</th>
                                <th className="p-3.5 text-center">Children</th>
                                <th className="p-3.5 text-center font-extrabold">Total Att.</th>
                                <th className="p-3.5 text-center">1st Timers</th>
                                <th className="p-3.5 text-center">Souls Won</th>
                              </>
                            )}
                            {filterReportType !== 'Demographics' && (
                              <>
                                <th className="p-3.5 text-right font-extrabold">Gross ({org.baseCurrency})</th>
                                <th className="p-3.5 text-right font-extrabold text-rose-600">Expenses ({org.baseCurrency})</th>
                                <th className="p-3.5 text-right font-black text-amber-700">Net Total ({org.baseCurrency})</th>
                              </>
                            )}
                            <th className="p-3.5">Preacher / Minister</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
                          {filteredReports.length === 0 ? (
                            <tr>
                              <td colSpan={10} className="p-8 text-center text-slate-400">
                                No service report records match your selected date range and filter criteria.
                              </td>
                            </tr>
                          ) : (
                            filteredReports.map((r) => (
                              <tr key={r.id} className="hover:bg-slate-50/80 transition">
                                <td className="p-3.5 font-bold font-mono text-slate-900">{r.serviceDate}</td>
                                <td className="p-3.5 font-semibold text-slate-800">{r.serviceTypeName}</td>
                                <td className="p-3.5">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                    r.category === 'Sunday' ? 'bg-blue-100 text-rccg-blue' : 'bg-emerald-100 text-emerald-800'
                                  }`}>
                                    {r.category}
                                  </span>
                                </td>
                                {filterReportType !== 'Financial' && (
                                  <>
                                    <td className="p-3.5 text-center">{r.menCount}</td>
                                    <td className="p-3.5 text-center">{r.womenCount}</td>
                                    <td className="p-3.5 text-center">{r.childrenCount}</td>
                                    <td className="p-3.5 text-center font-extrabold text-rccg-blue">{r.totalAttendance}</td>
                                    <td className="p-3.5 text-center font-bold text-amber-700">{r.firstTimersCount}</td>
                                    <td className="p-3.5 text-center font-bold text-rccg-red">{r.newConvertsCount}</td>
                                  </>
                                )}
                                {filterReportType !== 'Demographics' && (
                                  <>
                                    <td className="p-3.5 text-right font-bold text-emerald-700">
                                      {org.baseCurrency} {r.totalOffering.toLocaleString()}
                                    </td>
                                    <td className="p-3.5 text-right font-bold text-rose-600">
                                      - {org.baseCurrency} {(r.totalExpenses || 0).toLocaleString()}
                                    </td>
                                    <td className="p-3.5 text-right font-black text-amber-700 bg-amber-50/30">
                                      {org.baseCurrency} {(r.netOffering ?? r.totalOffering).toLocaleString()}
                                    </td>
                                  </>
                                )}
                                <td className="p-3.5 font-medium text-slate-600">
                                  {r.preacherName || <span className="text-slate-400 italic">Parish Pastorate</span>}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })()}
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
            </div>            {/* USER MANAGEMENT SUB-TAB NAVIGATION */}
            <div className="flex space-x-2 border-b border-slate-200 pb-2 overflow-x-auto">
              <button
                onClick={() => setUserSubTab('portal-users')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
                  userSubTab === 'portal-users' ? 'bg-rccg-blue text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Members ({members.length})</span>
              </button>

              <button
                onClick={() => setUserSubTab('ministers')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
                  userSubTab === 'ministers' ? 'bg-rccg-blue text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Ministers Directory ({ministers.length})</span>
              </button>

              <button
                onClick={() => setUserSubTab('role-assignment')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
                  userSubTab === 'role-assignment' ? 'bg-rccg-blue text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Role & Department Assignment ({members.length})</span>
              </button>

              <button
                onClick={() => setUserSubTab('workers-registration')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
                  userSubTab === 'workers-registration' ? 'bg-rccg-blue text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Workers Registration Applications ({workerRegistrations.length})</span>
              </button>
            </div>

            {/* SUB-PANEL 1: MEMBERS & DEPARTMENT LEADERSHIP */}
            {userSubTab === 'portal-users' && (
              <div className="space-y-6">
                {uploadSuccessBanner && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>{uploadSuccessBanner}</span>
                  </div>
                )}

                {/* SHAREABLE MEMBER REGISTRATION LINK BANNER */}
                <div className="bg-gradient-to-r from-rccg-blue via-rccg-navy to-purple-950 p-5 rounded-2xl text-white shadow-md space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h3 className="text-sm font-bold flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-emerald-300" />
                        <span>Shareable Member Registration Link</span>
                      </h3>
                      <p className="text-xs text-blue-100 mt-0.5">Share this link with members or post on WhatsApp groups for parish self-registration.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          const shareableUrl = `${window.location.origin}${window.location.pathname}?register=member`;
                          navigator.clipboard.writeText(shareableUrl);
                          setUploadSuccessBanner("Shareable registration link copied to clipboard! You can now paste it into WhatsApp groups.");
                          setTimeout(() => setUploadSuccessBanner(null), 6000);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy WhatsApp Link</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowPublicMemberForm(true)}
                        className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Preview Public Form</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* INNER SUB-TABS: Members vs Department & Leadership */}
                <div className="flex space-x-2 bg-slate-100 p-1.5 rounded-2xl w-max border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setMembersInnerTab('members-list')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
                      membersInnerTab === 'members-list'
                        ? 'bg-rccg-blue text-white shadow'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Members</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMembersInnerTab('dept-leadership')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
                      membersInnerTab === 'dept-leadership'
                        ? 'bg-rccg-blue text-white shadow'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <Sliders className="w-4 h-4" />
                    <span>Department & Leadership</span>
                  </button>
                </div>

                {/* TAB 1: MEMBERS */}
                {membersInnerTab === 'members-list' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column Forms */}
                    <div className="space-y-6">
                      {/* SINGLE MEMBER REGISTRATION FORM */}
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                        <div className="border-b border-slate-100 pb-3">
                          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <UserPlus className="w-5 h-5 text-rccg-blue" />
                            <span>Register New Parishioner</span>
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">Register individual member details into parish database.</p>
                        </div>

                        <form onSubmit={handleRegisterSingleMember} className="space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">Surname *</label>
                              <input
                                type="text"
                                required
                                value={regSurname}
                                onChange={(e) => setRegSurname(e.target.value)}
                                placeholder="e.g. Okon"
                                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">Firstname *</label>
                              <input
                                type="text"
                                required
                                value={regFirstname}
                                onChange={(e) => setRegFirstname(e.target.value)}
                                placeholder="e.g. Emmanuel"
                                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Whatsapp Number *</label>
                            <input
                              type="tel"
                              required
                              value={regWhatsapp}
                              onChange={(e) => setRegWhatsapp(e.target.value)}
                              placeholder="e.g. +2348031112233"
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                            <input
                              type="email"
                              value={regEmail}
                              onChange={(e) => setRegEmail(e.target.value)}
                              placeholder="name@example.com"
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Home Address</label>
                            <input
                              type="text"
                              value={regAddress}
                              onChange={(e) => setRegAddress(e.target.value)}
                              placeholder="12 Allen Avenue, Ikeja, Lagos"
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium"
                            />
                          </div>

                          {/* DATE OF BIRTH */}
                          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl space-y-2">
                            <label className="block text-xs font-bold text-rccg-blue flex items-center gap-1">
                              <span>🎂 Date of Birth (Day & Month)</span>
                            </label>
                            <p className="text-[11px] text-slate-500 font-medium">Used to send automated birthday greetings & announcements.</p>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Day</label>
                                <select
                                  value={regDobDay}
                                  onChange={(e) => setRegDobDay(parseInt(e.target.value) || 1)}
                                  className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-800"
                                >
                                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                    <option key={day} value={day}>Day {day}</option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Month</label>
                                <select
                                  value={regDobMonth}
                                  onChange={(e) => setRegDobMonth(e.target.value)}
                                  className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-800"
                                >
                                  {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                                    <option key={m} value={m}>{m}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* PROFILE PHOTO UPLOAD */}
                          <div className="flex items-center space-x-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                            <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center shrink-0 border border-slate-300">
                              {regProfileImageUrl ? (
                                <img src={regProfileImageUrl} alt="Preview" className="w-full h-full object-cover" />
                              ) : (
                                <User className="w-6 h-6 text-slate-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">Profile Photo (Optional)</label>
                              <label className="px-3 py-1.5 rounded-lg bg-rccg-blue text-white text-xs font-bold hover:bg-rccg-navy transition cursor-pointer inline-flex items-center space-x-1">
                                <Camera className="w-3.5 h-3.5" />
                                <span>{regProfileImageUrl ? 'Change Image' : 'Upload Image'}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        setRegProfileImageUrl(reader.result as string);
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                              <select
                                value={regGender}
                                onChange={(e) => setRegGender(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                              >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">Marital Status</label>
                              <select
                                value={regMaritalStatus}
                                onChange={(e) => setRegMaritalStatus(e.target.value as any)}
                                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                              >
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Engaged">Engaged</option>
                                <option value="Widowed">Widowed</option>
                                <option value="Divorced">Divorced</option>
                              </select>
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="w-full py-3 bg-rccg-blue hover:bg-rccg-navy text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center space-x-2 cursor-pointer"
                          >
                            <UserPlus className="w-4 h-4" />
                            <span>Save Member Profile</span>
                          </button>
                        </form>
                      </div>
                    </div>

                    {/* Right Column Directories */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* BULK MEMBER IMPORT */}
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
                          <div>
                            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                              <Upload className="w-5 h-5 text-rccg-blue" />
                              <span>Bulk Member CSV / Excel Import</span>
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">Upload member roster files with Surname, Firstname, Whatsapp & DOB.</p>
                          </div>

                          <button
                            type="button"
                            onClick={handleDownloadCSVTemplate}
                            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition flex items-center space-x-1.5 cursor-pointer w-max"
                          >
                            <Download className="w-3.5 h-3.5 text-rccg-blue" />
                            <span>CSV Template</span>
                          </button>
                        </div>

                        {/* DROPZONE */}
                        <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50/50 hover:bg-slate-50 transition relative">
                          <input
                            type="file"
                            accept=".csv,.xlsx,.xls"
                            onChange={handleFileSelectForMemberUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <FileSpreadsheet className="w-7 h-7 text-rccg-blue" />
                            <div className="text-xs font-bold text-slate-800">
                              {bulkFileName ? `Selected: ${bulkFileName}` : 'Drag & Drop Member Spreadsheet Here'}
                            </div>
                            <p className="text-[11px] text-slate-500">Or click to select CSV file from your computer</p>
                          </div>
                        </div>

                        {parsedPreviewMembers.length > 0 && (
                          <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-800">
                                Parsed Preview ({parsedPreviewMembers.length} records ready)
                              </span>
                              <button
                                type="button"
                                onClick={handleProcessMemberBatchImport}
                                className="px-4 py-2 rounded-xl bg-rccg-green hover:bg-emerald-700 text-white text-xs font-bold shadow transition cursor-pointer"
                              >
                                Confirm Batch Import
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* REGISTERED PARISH MEMBERS DIRECTORY TABLE */}
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <h3 className="text-base font-bold text-slate-900">Registered Parish Members ({members.length})</h3>
                          <div className="relative w-full sm:w-64">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                            <input
                              type="text"
                              placeholder="Search by surname or whatsapp..."
                              value={memberSearchQuery}
                              onChange={(e) => setMemberSearchQuery(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-rccg-blue"
                            />
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs text-slate-600">
                            <thead className="bg-slate-50 text-slate-700 uppercase font-bold">
                              <tr>
                                <th className="py-3 px-4">Member Name</th>
                                <th className="py-3 px-4">Whatsapp</th>
                                <th className="py-3 px-4">Home Address</th>
                                <th className="py-3 px-4">Birthday</th>
                                <th className="py-3 px-4">Role & Dept</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {members
                                .filter(m => m.fullName.toLowerCase().includes(memberSearchQuery.toLowerCase()) || m.whatsappNumber.includes(memberSearchQuery))
                                .map((m) => (
                                  <tr key={m.id} className="hover:bg-slate-50">
                                    <td className="py-3 px-4 font-bold text-slate-900">
                                      <div className="flex items-center space-x-2.5">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 overflow-hidden flex items-center justify-center shrink-0 text-rccg-blue font-bold text-xs">
                                          {m.profileImageUrl ? (
                                            <img src={m.profileImageUrl} alt={m.fullName} className="w-full h-full object-cover" />
                                          ) : (
                                            <span>{m.surname[0]}{m.firstname[0]}</span>
                                          )}
                                        </div>
                                        <div>
                                          <div>{m.surname}, {m.firstname}</div>
                                          <div className="text-[11px] text-slate-400 font-normal flex items-center gap-1.5">
                                            <span>{m.email}</span>
                                            {m.maritalStatus && (
                                              <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-semibold border border-slate-200">
                                                {m.maritalStatus}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="py-3 px-4 font-mono font-bold text-rccg-blue">{m.whatsappNumber}</td>
                                    <td className="py-3 px-4 text-slate-600">{m.homeAddress}</td>
                                    <td className="py-3 px-4">
                                      <span className="bg-blue-50 text-rccg-blue font-bold px-2 py-0.5 rounded text-[11px]">
                                        🎂 {m.dobMonth} {m.dobDay}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4">
                                      <div className="font-bold text-slate-800">{m.role}</div>
                                      <div className="text-[11px] text-slate-500">{m.assignedDepartment || 'No Dept'}</div>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Registered Portal Users List */}
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                          <h3 className="text-base font-bold text-slate-900">Parish Portal System Users ({users.length})</h3>
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
                  </div>
                )}

                {/* TAB 2: DEPARTMENT & LEADERSHIP */}
                {membersInnerTab === 'dept-leadership' && (
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <Sliders className="w-5 h-5 text-rccg-blue" />
                          <span>Department & Leadership Allocation</span>
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">Assign members to active parish departments and designate Head of Department (HOD) leaders.</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600">
                          <thead className="bg-slate-50 text-slate-700 uppercase font-bold">
                            <tr>
                              <th className="py-3 px-4">Member Name</th>
                              <th className="py-3 px-4">Whatsapp / Email</th>
                              <th className="py-3 px-4">Current Role</th>
                              <th className="py-3 px-4">Assigned Department</th>
                              <th className="py-3 px-4">Leadership / HOD</th>
                              <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {members.map((m) => (
                              <tr key={m.id} className="hover:bg-slate-50">
                                <td className="py-4 px-4 font-bold text-slate-900">
                                  <div>{m.surname}, {m.firstname}</div>
                                  <div className="text-[11px] text-slate-400 font-normal">Joined: {m.dateJoined}</div>
                                </td>
                                <td className="py-4 px-4 text-slate-600">
                                  <div className="font-mono font-bold text-rccg-blue">{m.whatsappNumber}</div>
                                  <div className="text-[11px] text-slate-500">{m.email}</div>
                                </td>
                                <td className="py-4 px-4 font-bold text-slate-800">
                                  <span className={`px-2.5 py-1 rounded-full text-[11px] ${
                                    m.role === 'Minister' ? 'bg-purple-100 text-purple-800' :
                                    m.role === 'Workforce' ? 'bg-blue-100 text-blue-800' :
                                    'bg-slate-100 text-slate-700'
                                  }`}>
                                    {m.role}
                                  </span>
                                </td>
                                <td className="py-4 px-4 font-bold text-slate-800">
                                  {m.assignedDepartment ? (
                                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg">
                                      {m.assignedDepartment}
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 italic">Unassigned</span>
                                  )}
                                </td>
                                <td className="py-4 px-4">
                                  {m.isHod ? (
                                    <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2.5 py-1 rounded-full flex items-center w-max gap-1">
                                      <span>👑 HOD</span>
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 text-xs">—</span>
                                  )}
                                </td>
                                <td className="py-4 px-4 text-right">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDeptAssignModalMember(m);
                                      setSelectedDept(m.assignedDepartment || 'Ushering & Protocol');
                                      setIsHodToggle(!!m.isHod);
                                    }}
                                    className="px-4 py-2 rounded-xl bg-rccg-blue text-white text-xs font-bold shadow hover:bg-rccg-navy transition cursor-pointer"
                                  >
                                    Assign
                                  </button>
                                </td>
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

            {/* SUB-PANEL 4: ROLE & DEPARTMENT ASSIGNMENT PAGE */}
            {userSubTab === 'role-assignment' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-rccg-blue" />
                      <span>Department Allocation & Role Elevation Portal</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Assign members to active departments, convert them to workforce workers, or elevate them to minister roles.</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-slate-50 text-slate-700 uppercase font-bold">
                        <tr>
                          <th className="py-3 px-4">Member Name</th>
                          <th className="py-3 px-4">Whatsapp / Email</th>
                          <th className="py-3 px-4">Birthday</th>
                          <th className="py-3 px-4">Current Role</th>
                          <th className="py-3 px-4">Assigned Department</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {members.map((m) => (
                          <tr key={m.id} className="hover:bg-slate-50">
                            <td className="py-4 px-4 font-bold text-slate-900">
                              <div>{m.surname} {m.firstname}</div>
                              {m.ecclesiasticalTitle && (
                                <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">
                                  {m.ecclesiasticalTitle}
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-4 font-mono">
                              <div>{m.whatsappNumber}</div>
                              <div className="text-[11px] text-slate-400 font-sans">{m.email}</div>
                            </td>
                            <td className="py-4 px-4 font-bold text-rccg-blue">
                              🎂 {m.dobMonth} {m.dobDay}
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                m.role === 'Minister' 
                                  ? 'bg-purple-100 text-purple-900' 
                                  : m.role === 'Workforce' 
                                  ? 'bg-blue-100 text-rccg-blue' 
                                  : 'bg-slate-100 text-slate-700'
                              }`}>
                                {m.role}
                              </span>
                            </td>
                            <td className="py-4 px-4 font-bold text-slate-800">
                              {m.assignedDepartment ? (
                                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg">
                                  {m.assignedDepartment}
                                </span>
                              ) : (
                                <span className="text-slate-400 italic">Unassigned</span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setRoleAssignModalMember(m);
                                  setTargetRoleForMember(m.role);
                                  setSelectedDeptForMember(m.assignedDepartment || 'Ushering & Protocol');
                                  setSelectedTitleForMinister(m.ecclesiasticalTitle || 'Pastor');
                                }}
                                className="px-3.5 py-1.5 rounded-xl bg-rccg-blue text-white text-xs font-bold shadow hover:bg-rccg-navy transition cursor-pointer"
                              >
                                Change Role & Dept
                              </button>
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
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Parish Ministers & Leadership Directory ({ministers.length})</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Ordained parish ministers, leaders, and officers assigned through role elevation.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
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
            )}



            {/* SUB-PANEL 4: WORKERS REGISTRATION APPLICATIONS */}
            {userSubTab === 'workers-registration' && (
              <div className="space-y-6">
                {/* PIPELINE STATS SUMMARY */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Workforce Submissions</div>
                    <div className="text-2xl font-black text-slate-900">{workerRegistrations.length}</div>
                    <div className="text-[11px] text-emerald-600 font-semibold">Website & Portal Forms</div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Minister Follow-up</div>
                    <div className="text-2xl font-black text-amber-600">
                      {workerRegistrations.filter(w => !w.assignedMinisterId).length}
                    </div>
                    <div className="text-[11px] text-amber-600 font-semibold">Requires Minister Assignment</div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active In Training</div>
                    <div className="text-2xl font-black text-rccg-blue">
                      {workerRegistrations.filter(w => w.currentStage !== 'Approved Worker').length}
                    </div>
                    <div className="text-[11px] text-rccg-blue font-semibold">Baptism / Believers / WIT</div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Approved Full Workers</div>
                    <div className="text-2xl font-black text-emerald-600">
                      {workerRegistrations.filter(w => w.currentStage === 'Approved Worker').length}
                    </div>
                    <div className="text-[11px] text-emerald-600 font-semibold">Graduated & Active</div>
                  </div>
                </div>

                {/* WORKER APPLICATIONS LIST */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-rccg-blue" />
                        <span>Workforce Application Pipeline & Class Progression</span>
                      </h3>
                      <p className="text-xs text-slate-500">Track website applicants, assign follow-up ministers, and manage training progression.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {workerRegistrations.map((worker) => (
                      <div key={worker.id} className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition space-y-4">
                        
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-200 pb-4">
                          <div>
                            <div className="flex items-center gap-3">
                              <h4 className="text-base font-bold text-slate-900">{worker.fullName}</h4>
                              <span className="bg-blue-100 text-rccg-blue font-bold text-[11px] px-2.5 py-0.5 rounded-full">
                                {worker.preferredDepartment}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3 mt-1 font-medium">
                              <span>📧 {worker.email}</span>
                              <span>📞 {worker.phone}</span>
                              <span>📅 Submitted: {worker.submissionDate}</span>
                            </div>
                          </div>

                          {/* ASSIGNED MINISTER BADGE & ACTION */}
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Follow-up Minister</div>
                              <div className={`text-xs font-bold ${worker.assignedMinisterName ? 'text-slate-800' : 'text-amber-600'}`}>
                                {worker.assignedMinisterName || '⚠️ Unassigned'}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setAssignModalCandidate(worker);
                                setSelectedMinisterIdToAssign(worker.assignedMinisterId || '');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition shadow-sm cursor-pointer"
                            >
                              Assign Minister
                            </button>
                          </div>
                        </div>

                        {/* CLASS PROGRESSION STEPPER */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          {/* 1. BAPTISMAL CLASS */}
                          <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                            worker.currentStage === 'Baptismal Class' 
                              ? 'bg-blue-50 border-rccg-blue text-slate-900 font-bold'
                              : 'bg-white border-slate-200 text-slate-600'
                          }`}>
                            <div className="flex justify-between items-center">
                              <span className="font-bold">1. Baptismal Class</span>
                              {worker.currentStage === 'Baptismal Class' && <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded">Active</span>}
                            </div>
                            <p className="text-[11px] text-slate-500 font-normal">Water & Spirit Baptism foundation</p>
                          </div>

                          {/* 2. BELIEVERS CLASS */}
                          <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                            worker.currentStage === 'Believers Class' 
                              ? 'bg-blue-50 border-rccg-blue text-slate-900 font-bold'
                              : 'bg-white border-slate-200 text-slate-600'
                          }`}>
                            <div className="flex justify-between items-center">
                              <span className="font-bold">2. Believer's Class</span>
                              {worker.currentStage === 'Believers Class' && <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded">Active</span>}
                            </div>
                            <p className="text-[11px] text-slate-500 font-normal">Christian doctrine & church roots</p>
                          </div>

                          {/* 3. WORKER IN TRAINING */}
                          <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                            worker.currentStage === 'Worker in Training' 
                              ? 'bg-blue-50 border-rccg-blue text-slate-900 font-bold'
                              : 'bg-white border-slate-200 text-slate-600'
                          }`}>
                            <div className="flex justify-between items-center">
                              <span className="font-bold">3. Worker in Training</span>
                              {worker.currentStage === 'Worker in Training' && <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded">Active</span>}
                            </div>
                            <p className="text-[11px] text-slate-500 font-normal">Workforce ethics & service rules</p>
                          </div>

                          {/* 4. APPROVED WORKER */}
                          <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                            worker.currentStage === 'Approved Worker' 
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                              : 'bg-white border-slate-200 text-slate-600'
                          }`}>
                            <div className="flex justify-between items-center">
                              <span className="font-bold">4. Full Worker</span>
                              {worker.currentStage === 'Approved Worker' && <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded">Graduated</span>}
                            </div>
                            <p className="text-[11px] text-slate-500 font-normal">Assigned to active department</p>
                          </div>
                        </div>

                        {/* CERTIFICATES & ADVANCE ACTION BAR */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-3.5 rounded-xl border border-slate-200">
                          
                          {/* CERTIFICATE BADGES */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">Certificates:</span>
                            
                            {/* BAPTISM CERT */}
                            <span className={`text-[11px] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 ${
                              worker.certificates.baptismCertName ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                            }`}>
                              <Paperclip className="w-3 h-3" />
                              <span>Baptism: {worker.certificates.baptismCertName ? worker.certificates.baptismCertName : 'Not Provided'}</span>
                            </span>

                            {/* BELIEVERS CERT */}
                            <span className={`text-[11px] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 ${
                              worker.certificates.believersCertName ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                            }`}>
                              <Paperclip className="w-3 h-3" />
                              <span>Believer's: {worker.certificates.believersCertName ? worker.certificates.believersCertName : 'Not Provided'}</span>
                            </span>

                            {/* WIT CERT */}
                            <span className={`text-[11px] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 ${
                              worker.certificates.witCertName ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                            }`}>
                              <Paperclip className="w-3 h-3" />
                              <span>WIT: {worker.certificates.witCertName ? worker.certificates.witCertName : 'Not Provided'}</span>
                            </span>

                            <button
                              type="button"
                              onClick={() => setCertModalCandidate(worker)}
                              className="text-[11px] text-rccg-blue font-bold hover:underline ml-1 cursor-pointer"
                            >
                              Manage Certs
                            </button>
                          </div>

                          {/* ADVANCE CLASS BUTTONS */}
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            {worker.currentStage === 'Baptismal Class' && (
                              <button
                                type="button"
                                onClick={() => handleAdvanceWorkerStage(worker.id, 'Believers Class', 'Enrolled')}
                                className="px-3.5 py-1.5 rounded-xl bg-rccg-blue text-white text-xs font-bold shadow hover:bg-rccg-navy transition cursor-pointer"
                              >
                                Advance to Believer's Class →
                              </button>
                            )}

                            {worker.currentStage === 'Believers Class' && (
                              <button
                                type="button"
                                onClick={() => handleAdvanceWorkerStage(worker.id, 'Worker in Training', 'Enrolled')}
                                className="px-3.5 py-1.5 rounded-xl bg-rccg-blue text-white text-xs font-bold shadow hover:bg-rccg-navy transition cursor-pointer"
                              >
                                Advance to Worker in Training →
                              </button>
                            )}

                            {worker.currentStage === 'Worker in Training' && (
                              <button
                                type="button"
                                onClick={() => handleAdvanceWorkerStage(worker.id, 'Approved Worker', 'Completed')}
                                className="px-3.5 py-1.5 rounded-xl bg-rccg-green text-white text-xs font-bold shadow hover:bg-emerald-700 transition cursor-pointer"
                              >
                                Approve as Full Worker ✓
                              </button>
                            )}

                            {worker.currentStage === 'Approved Worker' && (
                              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-xl">
                                Active Full Worker
                              </span>
                            )}
                          </div>
                        </div>

                        {worker.notes && (
                          <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200 italic">
                            <span className="font-bold not-italic text-slate-800">Applicant Notes:</span> "{worker.notes}"
                          </div>
                        )}
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
                {/* SHAREABLE HOUSE FELLOWSHIP REPORT LINK BANNER */}
                <div className="bg-gradient-to-r from-rccg-blue via-rccg-navy to-purple-950 p-5 rounded-2xl text-white shadow-md space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h3 className="text-sm font-bold flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-emerald-300" />
                        <span>Shareable House Fellowship Report Link</span>
                      </h3>
                      <p className="text-xs text-blue-100 mt-0.5">Share this link on WhatsApp groups for House Fellowship Center Leaders to log weekly reports directly.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          const shareableUrl = `${window.location.origin}${window.location.pathname}?report=fellowship`;
                          navigator.clipboard.writeText(shareableUrl);
                          showNotification("House Fellowship report link copied to clipboard! Share on WhatsApp.");
                        }}
                        className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy WhatsApp Link</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowPublicFellowshipForm(true)}
                        className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Preview Form</span>
                      </button>
                    </div>
                  </div>
                </div>

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
                {/* SHAREABLE OUTREACH REPORT LINK BANNER */}
                <div className="bg-gradient-to-r from-rccg-red via-red-900 to-purple-950 p-5 rounded-2xl text-white shadow-md space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h3 className="text-sm font-bold flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-amber-300" />
                        <span>Shareable Church on the Street Outreach Link</span>
                      </h3>
                      <p className="text-xs text-red-100 mt-0.5">Share this link on WhatsApp groups for Evangelism Street Leaders to log outreach reports & souls won directly.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          const shareableUrl = `${window.location.origin}${window.location.pathname}?report=outreach`;
                          navigator.clipboard.writeText(shareableUrl);
                          showNotification("Outreach report link copied to clipboard! Share on WhatsApp.");
                        }}
                        className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy WhatsApp Link</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowPublicOutreachForm(true)}
                        className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Preview Form</span>
                      </button>
                    </div>
                  </div>
                </div>

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
                      <div key={cat.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition flex flex-col justify-between group">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-xs font-bold text-slate-900">{cat.name}</h4>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => handleStartEditServiceCategory(cat)}
                                className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                                title="Edit Category"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteServiceCategory(cat.id, cat.name)}
                                className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                                title="Delete Category"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2">{cat.description}</p>
                        </div>
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
                          <button
                            onClick={() => handleStartEditServiceType(st)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition border border-transparent hover:border-blue-200 cursor-pointer ml-1"
                            title="Edit Service Type"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteServiceType(st.id, st.name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition border border-transparent hover:border-red-200 cursor-pointer"
                            title="Delete Service Type"
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
      {/* EDIT SERVICE CATEGORY MODAL */}
      {isEditServiceCategoryModalOpen && editingServiceCategory && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => { setIsEditServiceCategoryModalOpen(false); setEditingServiceCategory(null); }}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Pencil className="w-5 h-5 text-blue-600" />
                <span>Edit Service Category</span>
              </h3>
              <p className="text-xs text-slate-500">Update category title and description.</p>
            </div>

            <form onSubmit={handleUpdateServiceCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                  placeholder="e.g. Sunday Service"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category Description</label>
                <textarea
                  rows={2}
                  value={editCategoryDescription}
                  onChange={(e) => setEditCategoryDescription(e.target.value)}
                  placeholder="Brief description..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => { setIsEditServiceCategoryModalOpen(false); setEditingServiceCategory(null); }}
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

      {/* EDIT SERVICE TYPE MODAL */}
      {isEditServiceTypeModalOpen && editingServiceType && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => { setIsEditServiceTypeModalOpen(false); setEditingServiceType(null); }}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Pencil className="w-5 h-5 text-blue-600" />
                <span>Edit Service Type Setup</span>
              </h3>
              <p className="text-xs text-slate-500">Configure parameters, default day, time, and tracking options.</p>
            </div>

            <form onSubmit={handleUpdateServiceType} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Service Name *</label>
                  <input
                    type="text"
                    required
                    value={editServiceName}
                    onChange={(e) => setEditServiceName(e.target.value)}
                    placeholder="e.g. Sunday 1st Service"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={editServiceCategory}
                    onChange={(e) => setEditServiceCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm font-medium text-slate-800"
                  >
                    {serviceCategories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Code</label>
                  <input
                    type="text"
                    value={editServiceCode}
                    onChange={(e) => setEditServiceCode(e.target.value)}
                    placeholder="e.g. SUN-01"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Default Day</label>
                  <input
                    type="text"
                    value={editServiceDay}
                    onChange={(e) => setEditServiceDay(e.target.value)}
                    placeholder="e.g. Sunday"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Default Time</label>
                  <input
                    type="text"
                    value={editServiceTime}
                    onChange={(e) => setEditServiceTime(e.target.value)}
                    placeholder="e.g. 07:30 AM"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6 pt-1">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editServiceTrackAttendance}
                    onChange={(e) => setEditServiceTrackAttendance(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs font-semibold text-slate-700">Track Attendance</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editServiceTrackOfferings}
                    onChange={(e) => setEditServiceTrackOfferings(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs font-semibold text-slate-700">Track Offerings</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description / Notes</label>
                <input
                  type="text"
                  value={editServiceDescription}
                  onChange={(e) => setEditServiceDescription(e.target.value)}
                  placeholder="Main Lord's Day Worship Services"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => { setIsEditServiceTypeModalOpen(false); setEditingServiceType(null); }}
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

      {/* ---------------- MODAL: ASSIGN FOLLOW-UP MINISTER ---------------- */}
      {assignModalCandidate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="bg-rccg-blue text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-300" />
                <span>Assign Follow-up Minister</span>
              </h3>
              <button
                type="button"
                onClick={() => setAssignModalCandidate(null)}
                className="text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmAssignMinister} className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-xs text-slate-500">Applicant Name</div>
                <div className="text-sm font-bold text-slate-900">{assignModalCandidate.fullName}</div>
                <div className="text-xs text-rccg-blue font-semibold mt-0.5">{assignModalCandidate.preferredDepartment}</div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Minister for Follow-up *</label>
                <select
                  required
                  value={selectedMinisterIdToAssign}
                  onChange={(e) => setSelectedMinisterIdToAssign(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-rccg-blue focus:outline-none"
                >
                  <option value="">-- Choose Minister --</option>
                  {ministers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title} {m.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setAssignModalCandidate(null)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-rccg-blue hover:bg-rccg-navy text-white font-bold text-xs uppercase tracking-wider shadow-md transition"
                >
                  Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL: MANAGE & UPLOAD CANDIDATE CERTIFICATES ---------------- */}
      {certModalCandidate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-rccg-blue text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-emerald-300" />
                <span>Verification Certificates - {certModalCandidate.fullName}</span>
              </h3>
              <button
                type="button"
                onClick={() => setCertModalCandidate(null)}
                className="text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* CURRENT CERTIFICATES STATUS */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Uploaded Documents Status</h4>
                
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-800">Water Baptism Certificate:</span>
                    <span className="ml-2 font-mono text-slate-600">
                      {certModalCandidate.certificates.baptismCertName || 'Not Provided (Nullable)'}
                    </span>
                  </div>
                  {certModalCandidate.certificates.baptismCertName ? (
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Uploaded ✓</span>
                  ) : (
                    <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded">Pending</span>
                  )}
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-800">Believer's Class Certificate:</span>
                    <span className="ml-2 font-mono text-slate-600">
                      {certModalCandidate.certificates.believersCertName || 'Not Provided (Nullable)'}
                    </span>
                  </div>
                  {certModalCandidate.certificates.believersCertName ? (
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Uploaded ✓</span>
                  ) : (
                    <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded">Pending</span>
                  )}
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-800">Worker in Training Certificate:</span>
                    <span className="ml-2 font-mono text-slate-600">
                      {certModalCandidate.certificates.witCertName || 'Not Provided (Nullable)'}
                    </span>
                  </div>
                  {certModalCandidate.certificates.witCertName ? (
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Uploaded ✓</span>
                  ) : (
                    <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded">Pending</span>
                  )}
                </div>
              </div>

              {/* UPLOAD / UPDATE FORM FOR ADMIN */}
              <form onSubmit={handleUploadCandidateCert} className="border-t pt-4 space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Upload / Replace Certificate Document</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Certificate Type</label>
                    <select
                      value={newCertType}
                      onChange={(e) => setNewCertType(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                    >
                      <option value="baptismCertName">Water Baptism Certificate</option>
                      <option value="believersCertName">Believer's Class Certificate</option>
                      <option value="witCertName">Worker in Training Certificate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Select File</label>
                    <input
                      type="file"
                      required
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setNewCertFileName(file.name);
                      }}
                      className="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-100 file:text-rccg-blue hover:file:bg-blue-200"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCertModalCandidate(null)}
                    className="w-1/2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition"
                  >
                    Save Certificate
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL: DEPARTMENT & LEADERSHIP ASSIGNMENT ---------------- */}
      {deptAssignModalMember && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="bg-rccg-blue text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-300" />
                <span>Department & Leadership Assignment</span>
              </h3>
              <button
                type="button"
                onClick={() => setDeptAssignModalMember(null)}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDepartmentAndLeadership} className="p-6 space-y-5">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center">
                <div>
                  <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Selected Member</div>
                  <div className="text-base font-bold text-slate-900">{deptAssignModalMember.surname}, {deptAssignModalMember.firstname}</div>
                  <div className="text-xs text-slate-500 font-mono">{deptAssignModalMember.whatsappNumber}</div>
                </div>
                <div className="text-right">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    deptAssignModalMember.role === 'Minister' ? 'bg-purple-100 text-purple-800' :
                    deptAssignModalMember.role === 'Workforce' ? 'bg-blue-100 text-blue-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {deptAssignModalMember.role}
                  </span>
                </div>
              </div>

              {/* DEPARTMENT SELECTION */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Assigned Department *</label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-rccg-blue focus:outline-none"
                >
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
              </div>

              {/* MAKE HOD TOGGLE */}
              <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <span>👑</span>
                    <span>Make Head of Department (HOD)</span>
                  </div>
                  <div className="text-[11px] text-amber-700 mt-0.5">Designates member as executive HOD over {selectedDept}</div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isHodToggle}
                    onChange={(e) => setIsHodToggle(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeptAssignModalMember(null)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-rccg-blue hover:bg-rccg-navy text-white font-bold text-xs uppercase tracking-wider shadow-md transition cursor-pointer"
                >
                  Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL: ROLE ELEVATION & DEPARTMENT ASSIGNMENT ---------------- */}
      {roleAssignModalMember && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-rccg-blue text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-300" />
                <span>Assign Department & Elevate Role</span>
              </h3>
              <button
                type="button"
                onClick={() => setRoleAssignModalMember(null)}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmRoleDepartmentAssignment} className="p-6 space-y-5">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center">
                <div>
                  <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Member Identity</div>
                  <div className="text-base font-bold text-slate-900">{roleAssignModalMember.surname} {roleAssignModalMember.firstname}</div>
                  <div className="text-xs text-slate-500 font-mono">{roleAssignModalMember.whatsappNumber}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-rccg-blue font-bold">🎂 Birthday</div>
                  <div className="text-xs font-bold text-slate-800">{roleAssignModalMember.dobMonth} {roleAssignModalMember.dobDay}</div>
                </div>
              </div>

              {/* TARGET ROLE SELECTOR */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Select Elevated Role *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetRoleForMember('Member')}
                    className={`p-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      targetRoleForMember === 'Member' ? 'bg-blue-50 border-rccg-blue text-rccg-blue shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    Parishioner
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetRoleForMember('Workforce')}
                    className={`p-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      targetRoleForMember === 'Workforce' ? 'bg-blue-50 border-rccg-blue text-rccg-blue shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    Workforce
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetRoleForMember('Minister')}
                    className={`p-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      targetRoleForMember === 'Minister' ? 'bg-purple-50 border-purple-600 text-purple-900 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    Parish Minister
                  </button>
                </div>
              </div>

              {/* DEPARTMENT ASSIGNMENT SELECTOR (IF WORKFORCE OR MINISTER) */}
              {targetRoleForMember !== 'Member' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Assigned Department *</label>
                  <select
                    value={selectedDeptForMember}
                    onChange={(e) => setSelectedDeptForMember(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800"
                  >
                    <option value="Ushering & Protocol">Ushering & Protocol</option>
                    <option value="Choir & Praise Team">Choir & Praise Team</option>
                    <option value="Media & Technical Broadcast">Media & Technical Broadcast</option>
                    <option value="Sanitation & Environmental">Sanitation & Environmental</option>
                    <option value="Children & Youth Ministry">Children & Youth Ministry</option>
                    <option value="Evangelism & Follow-up">Evangelism & Follow-up</option>
                    <option value="Prayer & Intercession">Prayer & Intercession</option>
                    <option value="Mercy & Welfare Department">Mercy & Welfare Department</option>
                  </select>
                </div>
              )}

              {/* ECCLESIASTICAL TITLE SELECTOR (IF MINISTER) */}
              {targetRoleForMember === 'Minister' && (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl space-y-2">
                  <label className="block text-xs font-bold text-purple-900 uppercase tracking-wider">Ecclesiastical Minister Title *</label>
                  <select
                    value={selectedTitleForMinister}
                    onChange={(e) => setSelectedTitleForMinister(e.target.value)}
                    className="w-full bg-white border border-purple-300 rounded-xl px-4 py-2 text-xs font-bold text-purple-900"
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
                  </select>
                  <p className="text-[11px] text-purple-700 italic">Elevating to Minister automatically adds this member to the Ministers Directory.</p>
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setRoleAssignModalMember(null)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-rccg-blue hover:bg-rccg-navy text-white font-bold text-xs uppercase tracking-wider shadow-md transition cursor-pointer"
                >
                  Confirm Role Elevation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* GLOBAL FLOATING TOAST NOTIFICATION */}
      {notification && (
        <div className="fixed top-5 right-5 z-[250] max-w-md animate-slideIn">
          <div className={`py-3.5 px-5 rounded-2xl shadow-2xl text-white text-xs font-bold flex items-center space-x-3 border border-white/20 backdrop-blur-md ${
            notification.type === 'success' ? 'bg-emerald-600/95' : 'bg-red-600/95'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-200 shrink-0" />
            )}
            <span className="flex-1 leading-snug">{notification.message}</span>
            <button 
              type="button"
              onClick={() => setNotification(null)}
              className="p-1 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* REUSABLE CUSTOM CONFIRMATION ALERT MODAL */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[300] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden transform transition-all scale-100 my-auto">
            {/* Header / Accent Bar */}
            <div className={`p-6 text-center border-b flex flex-col items-center ${
              confirmModal.type === 'danger' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'
            }`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-sm ${
                confirmModal.type === 'danger' ? 'bg-red-100 text-rccg-red' : 'bg-amber-100 text-amber-700'
              }`}>
                {confirmModal.type === 'danger' ? (
                  <AlertTriangle className="w-7 h-7 text-rccg-red" />
                ) : (
                  <AlertCircle className="w-7 h-7 text-amber-700" />
                )}
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                {confirmModal.title}
              </h3>
            </div>

            {/* Content Body */}
            <div className="p-6 text-center">
              <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
                {confirmModal.message}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-100 font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-sm"
              >
                {confirmModal.cancelText || 'Cancel'}
              </button>

              <button
                type="button"
                onClick={() => {
                  const action = confirmModal.onConfirm;
                  setConfirmModal(prev => ({ ...prev, isOpen: false }));
                  if (action) action();
                }}
                className={`px-5 py-2.5 rounded-xl text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition flex items-center space-x-2 cursor-pointer ${
                  confirmModal.type === 'danger' 
                    ? 'bg-rccg-red hover:bg-red-800 focus:ring-2 focus:ring-red-500' 
                    : 'bg-rccg-blue hover:bg-rccg-navy'
                }`}
              >
                <span>{confirmModal.confirmText || 'Confirm'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}
