import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Heart, GitBranch, Edit3, Save, Trash2, 
  ZoomIn, ZoomOut, RefreshCw, Download, Upload, Share2, 
  ShieldAlert, Check, X, ChevronRight,
  Calendar, MapPin, Phone, Mail, FileText, Camera, User, Printer,
  Sun, Moon, Palette
} from 'lucide-react';

// ข้อมูลเริ่มต้นสำหรับตระกูลม้งลี (Initial Seed Data)
const INITIAL_FAMILY_DATA = [
  {
    id: "lee-001",
    firstName: "เล่าปอ",
    lastName: "ลี",
    nickname: "ปู่เล่า",
    gender: "male",
    isAlive: true,
    birthDate: "1950-03-15",
    deathDate: "",
    phone: "081-234-5678",
    email: "laopo.lee@example.com",
    address: "อ.เมืองเชียงใหม่ จ.เชียงใหม่",
    bio: "ผู้นำตระกูลม้งลีรุ่นที่ 1 ผู้เริ่มต้นถิ่นฐานในเชียงใหม่",
    photo: null,
    fatherId: null,
    motherId: null,
    spouseId: "lee-002",
    childrenIds: ["lee-003", "lee-004"]
  },
  {
    id: "lee-002",
    firstName: "ไมซ้ง",
    lastName: "แซ่ย่าง",
    nickname: "ย่าไม",
    gender: "female",
    isAlive: true,
    birthDate: "1954-07-20",
    deathDate: "",
    phone: "081-234-5679",
    email: "maisong@example.com",
    address: "อ.เมืองเชียงใหม่ จ.เชียงใหม่",
    bio: "คู่ชีวิตของปู่เล่าปอ",
    photo: null,
    fatherId: null,
    motherId: null,
    spouseId: "lee-001",
    childrenIds: ["lee-003", "lee-004"]
  },
  {
    id: "lee-003",
    firstName: "ไชยยุทธ",
    lastName: "ลี",
    nickname: "ชัย",
    gender: "male",
    isAlive: true,
    birthDate: "1978-11-05",
    deathDate: "",
    phone: "089-876-5432",
    email: "chai.lee@example.com",
    address: "อ.หางดง จ.เชียงใหม่",
    bio: "บุตรชายคนโตของตระกูล",
    photo: null,
    fatherId: "lee-001",
    motherId: "lee-002",
    spouseId: "lee-005",
    childrenIds: ["lee-006", "lee-007"]
  },
  {
    id: "lee-004",
    firstName: "มาลี",
    lastName: "ลี",
    nickname: "ลี",
    gender: "female",
    isAlive: true,
    birthDate: "1982-04-12",
    deathDate: "",
    phone: "086-111-2233",
    email: "malee.lee@example.com",
    address: "อ.เมือง จ.เชียงราย",
    bio: "บุตรสาวคนที่สอง",
    photo: null,
    fatherId: "lee-001",
    motherId: "lee-002",
    spouseId: null,
    childrenIds: []
  },
  {
    id: "lee-005",
    firstName: "ปาหนัน",
    lastName: "แซ่หวัง",
    nickname: "หนัน",
    gender: "female",
    isAlive: true,
    birthDate: "1980-09-18",
    deathDate: "",
    phone: "089-876-9999",
    email: "panan@example.com",
    address: "อ.หางดง จ.เชียงใหม่",
    bio: "ภรรยาของไชยยุทธ",
    photo: null,
    fatherId: null,
    motherId: null,
    spouseId: "lee-003",
    childrenIds: ["lee-006", "lee-007"]
  },
  {
    id: "lee-006",
    firstName: "ก้องภพ",
    lastName: "ลี",
    nickname: "ก้อง",
    gender: "male",
    isAlive: true,
    birthDate: "2005-01-10",
    deathDate: "",
    phone: "095-555-4444",
    email: "kong.lee@example.com",
    address: "อ.หางดง จ.เชียงใหม่",
    bio: "ทายาทรุ่นที่ 3",
    photo: null,
    fatherId: "lee-003",
    motherId: "lee-005",
    spouseId: null,
    childrenIds: []
  },
  {
    id: "lee-007",
    firstName: "พิมพ์นารา",
    lastName: "ลี",
    nickname: "พิมพ์",
    gender: "female",
    isAlive: true,
    birthDate: "2009-08-25",
    deathDate: "",
    phone: "",
    email: "",
    address: "อ.หางดง จ.เชียงใหม่",
    bio: "หลานสาวคนเล็ก",
    photo: null,
    fatherId: "lee-003",
    motherId: "lee-005",
    spouseId: null,
    childrenIds: []
  }
];

export default function App() {
  // --- States ---
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('hmong_lee_family_data');
    return saved ? JSON.parse(saved) : INITIAL_FAMILY_DATA;
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('hmong_lee_theme') || 'dark'; // 'dark', 'light', 'pastel'
  });

  const [focusMemberId, setFocusMemberId] = useState('lee-003');
  const [selectedMemberId, setSelectedMemberId] = useState('lee-003');
  const [userRole, setUserRole] = useState('admin'); // 'admin', 'invited', 'guest'
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);

  // Canvas View Controls (Pan & Zoom)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Notifications & Modals
  const [notification, setNotification] = useState(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [invitePin, setInvitePin] = useState('888888');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addRelationType, setAddRelationType] = useState('father');

  // Save Members Data to LocalStorage
  useEffect(() => {
    localStorage.setItem('hmong_lee_family_data', JSON.stringify(members));
  }, [members]);

  // Save Theme to LocalStorage
  useEffect(() => {
    localStorage.setItem('hmong_lee_theme', theme);
  }, [theme]);

  // Toast Notification Helper
  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Sync edit form with selected member
  useEffect(() => {
    const member = members.find(m => m.id === selectedMemberId);
    if (member) {
      setEditForm({ ...member });
    } else if (members.length > 0) {
      setSelectedMemberId(members[0].id);
      setEditForm({ ...members[0] });
    }
  }, [selectedMemberId, members]);

  // Compute Tree Hierarchy around the Focused Member
  const focusMember = members.find(m => m.id === focusMemberId) || members[0];

  const getHierarchy = () => {
    if (!focusMember) return { focus: null, parents: [], spouse: null, children: [], siblings: [] };

    // Parents
    const parents = members.filter(m => m.id === focusMember.fatherId || m.id === focusMember.motherId);
    
    // Spouse
    const spouse = members.find(m => m.id === focusMember.spouseId);
    
    // Children
    const children = members.filter(m => 
      (focusMember.childrenIds && focusMember.childrenIds.includes(m.id)) ||
      m.fatherId === focusMember.id || 
      m.motherId === focusMember.id
    );

    // Siblings
    const siblings = members.filter(m => 
      m.id !== focusMember.id &&
      ((focusMember.fatherId && m.fatherId === focusMember.fatherId) || 
       (focusMember.motherId && m.motherId === focusMember.motherId))
    );

    return { focus: focusMember, parents, spouse, children, siblings };
  };

  const hierarchy = getHierarchy();

  // Canvas Drag / Pan Handlers
  const handleMouseDown = (e) => {
    if (e.target.closest('.no-pan')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Focus and Selection Actions
  const handleSelectMember = (id) => {
    setSelectedMemberId(id);
    setIsEditing(false);
  };

  const handleSetFocus = (id) => {
    setFocusMemberId(id);
    setSelectedMemberId(id);
    setIsEditing(false);
  };

  // Save Member Info Modifications
  const handleSaveMember = () => {
    if (!editForm) return;
    setMembers(prev => prev.map(m => m.id === editForm.id ? editForm : m));
    setIsEditing(false);
    showToast('บันทึกข้อมูลสมาชิกสำเร็จแล้ว');
  };

  // Profile Image Upload Handler
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Add Relation Handler
  const handleAddRelation = (type) => {
    if (userRole === 'guest') {
      showToast('คุณอยู่ในสิทธิ์ทั่วไป ไม่สามารถเพิ่มข้อมูลได้');
      return;
    }
    setAddRelationType(type);
    setIsAddModalOpen(true);
  };

  const executeAddRelation = (newMemberData) => {
    const newId = `lee-${Date.now()}`;
    const targetMember = members.find(m => m.id === selectedMemberId);

    const newMember = {
      id: newId,
      firstName: newMemberData.firstName,
      lastName: newMemberData.lastName || 'ลี',
      nickname: newMemberData.nickname || '',
      gender: newMemberData.gender,
      isAlive: true,
      birthDate: '',
      deathDate: '',
      phone: '',
      email: '',
      address: '',
      bio: '',
      photo: null,
      fatherId: null,
      motherId: null,
      spouseId: null,
      childrenIds: []
    };

    let updatedMembers = [...members];

    if (addRelationType === 'father') {
      newMember.gender = 'male';
      newMember.childrenIds = [targetMember.id];
      updatedMembers = updatedMembers.map(m => 
        m.id === targetMember.id ? { ...m, fatherId: newId } : m
      );
    } else if (addRelationType === 'mother') {
      newMember.gender = 'female';
      newMember.childrenIds = [targetMember.id];
      updatedMembers = updatedMembers.map(m => 
        m.id === targetMember.id ? { ...m, motherId: newId } : m
      );
    } else if (addRelationType === 'spouse') {
      newMember.spouseId = targetMember.id;
      updatedMembers = updatedMembers.map(m => 
        m.id === targetMember.id ? { ...m, spouseId: newId } : m
      );
    } else if (addRelationType === 'child') {
      if (targetMember.gender === 'male') {
        newMember.fatherId = targetMember.id;
        newMember.motherId = targetMember.spouseId || null;
      } else {
        newMember.motherId = targetMember.id;
        newMember.fatherId = targetMember.spouseId || null;
      }
      updatedMembers = updatedMembers.map(m => 
        m.id === targetMember.id ? { ...m, childrenIds: [...(m.childrenIds || []), newId] } : m
      );
    } else if (addRelationType === 'sibling') {
      newMember.fatherId = targetMember.fatherId;
      newMember.motherId = targetMember.motherId;
    }

    updatedMembers.push(newMember);
    setMembers(updatedMembers);
    setIsAddModalOpen(false);
    setSelectedMemberId(newId);
    showToast(`เพิ่ม ${newMember.firstName} เข้าในแผนผังตระกูลแล้ว`);
  };

  // Delete Member Handler
  const handleDeleteMember = (id) => {
    if (members.length <= 1) {
      showToast('ไม่สามารถลบสมาชิกคนสุดท้ายของตระกูลได้');
      return;
    }
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบสมาชิกท่านนี้ออกจากแผนผัง?')) {
      const filtered = members.filter(m => m.id !== id);
      setMembers(filtered);
      if (focusMemberId === id) setFocusMemberId(filtered[0].id);
      setSelectedMemberId(filtered[0].id);
      showToast('ลบสมาชิกเรียบร้อยแล้ว');
    }
  };

  // Export Data to JSON File
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(members, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `hmong_lee_family_tree_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('ส่งออกไฟล์ข้อมูล JSON สำเร็จแล้ว');
  };

  // Import Data from JSON File
  const handleImportJSON = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (Array.isArray(parsed)) {
            setMembers(parsed);
            setFocusMemberId(parsed[0].id);
            setSelectedMemberId(parsed[0].id);
            showToast('นำเข้าข้อมูลแผนผังสำเร็จแล้ว');
          }
        } catch (err) {
          showToast('รูปแบบไฟล์ JSON ไม่ถูกต้อง');
        }
      };
    }
  };

  // Function for printing / saving to PDF
  const handlePrintPDF = () => {
    window.print();
  };

  const selectedMember = members.find(m => m.id === selectedMemberId);

  // Helper styles based on theme
  const getThemeStyles = () => {
    switch (theme) {
      case 'light':
        return {
          container: 'bg-slate-100 text-slate-800',
          header: 'bg-white border-slate-200 shadow-sm text-slate-800',
          canvasBg: 'bg-slate-50',
          gridDot: '#cbd5e1',
          sidebar: 'bg-white border-slate-200 text-slate-800',
          sidebarHeader: 'bg-slate-50 border-slate-200',
          cardBorder: 'border-slate-300',
          modalBg: 'bg-white text-slate-800 border-slate-200',
          inputBg: 'bg-slate-100 border-slate-300 text-slate-800 focus:border-emerald-500',
          badgeText: 'text-slate-600',
          focusBoxBg: 'bg-white/80 border-slate-300 shadow-md',
          subText: 'text-slate-500'
        };
      case 'pastel':
        return {
          container: 'bg-emerald-950/20 text-teal-950',
          header: 'bg-teal-900/90 border-teal-800/80 text-teal-50 shadow-sm backdrop-blur',
          canvasBg: 'bg-gradient-to-br from-teal-50/70 via-rose-50/50 to-sky-50/70',
          gridDot: '#cbd5e1',
          sidebar: 'bg-rose-50/90 border-rose-200/60 text-slate-800 backdrop-blur',
          sidebarHeader: 'bg-rose-100/60 border-rose-200',
          cardBorder: 'border-rose-200/80 shadow-md',
          modalBg: 'bg-teal-50 text-slate-800 border-teal-200',
          inputBg: 'bg-white border-teal-200 text-slate-800 focus:border-teal-500',
          badgeText: 'text-teal-700',
          focusBoxBg: 'bg-white/70 border-rose-200 shadow-sm backdrop-blur',
          subText: 'text-teal-700'
        };
      case 'dark':
      default:
        return {
          container: 'bg-slate-900 text-slate-100',
          header: 'bg-slate-800 border-slate-700 text-slate-100',
          canvasBg: 'bg-slate-950',
          gridDot: '#94a3b8',
          sidebar: 'bg-slate-800 border-slate-700 text-slate-100',
          sidebarHeader: 'bg-slate-850 border-slate-700',
          cardBorder: 'border-slate-700',
          modalBg: 'bg-slate-800 text-slate-100 border-slate-700',
          inputBg: 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500',
          badgeText: 'text-slate-300',
          focusBoxBg: 'bg-slate-900/60 border-slate-800 shadow-2xl',
          subText: 'text-slate-400'
        };
    }
  };

  const t = getThemeStyles();

  return (
    <div className={`flex flex-col h-screen w-screen ${t.container} font-sans overflow-hidden select-none transition-colors duration-300`}>
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-xl text-sm font-medium flex items-center space-x-2 animate-bounce print:hidden">
          <Check className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* 1. Header Toolbar */}
      <header className={`h-16 ${t.header} border-b px-4 flex items-center justify-between shrink-0 z-10 print:hidden transition-colors duration-300`}>
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-600 p-2 rounded-lg text-white shadow-lg shadow-emerald-900/40">
            <GitBranch className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              แผนผังตระกูลม้งลี
            </h1>
            <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : theme === 'pastel' ? 'text-teal-200' : 'text-slate-500'}`}>ระบบจัดการลำดับเครือญาติและข้อมูลตระกูล</p>
          </div>
        </div>

        {/* Action Controls, Theme Selector & Role Switcher */}
        <div className="flex items-center space-x-2">
          
          {/* Theme Selector */}
          <div className={`flex items-center p-1 rounded-lg border text-xs ${theme === 'dark' ? 'bg-slate-900/80 border-slate-700' : theme === 'pastel' ? 'bg-teal-950/40 border-teal-700/50' : 'bg-slate-200/80 border-slate-300'}`}>
            <span className={`px-1.5 flex items-center space-x-1 ${theme === 'dark' ? 'text-slate-400' : theme === 'pastel' ? 'text-teal-200' : 'text-slate-500'}`}>
              <Palette className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ธีม:</span>
            </span>
            <button 
              onClick={() => setTheme('dark')}
              className={`px-2 py-1 rounded transition-all flex items-center space-x-1 ${theme === 'dark' ? 'bg-slate-700 text-emerald-400 font-bold shadow' : 'text-slate-400 hover:text-white'}`}
              title="ธีมมืด (Dark)"
            >
              <Moon className="w-3 h-3" />
              <span className="text-[11px]">มืด</span>
            </button>
            <button 
              onClick={() => setTheme('light')}
              className={`px-2 py-1 rounded transition-all flex items-center space-x-1 ${theme === 'light' ? 'bg-white text-slate-900 font-bold shadow' : theme === 'pastel' ? 'text-teal-100 hover:text-white' : 'text-slate-400 hover:text-white'}`}
              title="ธีมสว่าง (Light)"
            >
              <Sun className="w-3 h-3" />
              <span className="text-[11px]">สว่าง</span>
            </button>
            <button 
              onClick={() => setTheme('pastel')}
              className={`px-2 py-1 rounded transition-all flex items-center space-x-1 ${theme === 'pastel' ? 'bg-rose-400 text-white font-bold shadow' : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
              title="ธีมพาสเทล (Pastel)"
            >
              <Palette className="w-3 h-3" />
              <span className="text-[11px]">พาสเทล</span>
            </button>
          </div>

          <div className={`h-6 w-[1px] mx-1 ${theme === 'dark' ? 'bg-slate-700' : theme === 'pastel' ? 'bg-teal-700' : 'bg-slate-300'}`}></div>

          {/* Role Status Indicator */}
          <div className={`flex items-center p-1 rounded-lg border text-xs ${theme === 'dark' ? 'bg-slate-900/80 border-slate-700' : theme === 'pastel' ? 'bg-teal-950/40 border-teal-700/50' : 'bg-slate-200/80 border-slate-300'}`}>
            <span className={`px-2 ${theme === 'dark' ? 'text-slate-400' : theme === 'pastel' ? 'text-teal-200' : 'text-slate-500'}`}>สิทธิ์:</span>
            <button 
              onClick={() => setUserRole('admin')}
              className={`px-2 py-1 rounded transition-colors ${userRole === 'admin' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              Admin
            </button>
            <button 
              onClick={() => setUserRole('invited')}
              className={`px-2 py-1 rounded transition-colors ${userRole === 'invited' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              สมาชิก
            </button>
            <button 
              onClick={() => setUserRole('guest')}
              className={`px-2 py-1 rounded transition-colors ${userRole === 'guest' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              ทั่วไป
            </button>
          </div>

          <div className={`h-6 w-[1px] mx-1 ${theme === 'dark' ? 'bg-slate-700' : theme === 'pastel' ? 'bg-teal-700' : 'bg-slate-300'}`}></div>

          {/* PDF / Print Action */}
          <button 
            onClick={handlePrintPDF}
            className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md transition-all"
            title="พิมพ์หรือบันทึกเป็น PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>พิมพ์ / PDF</span>
          </button>

          {/* Import / Export */}
          <label className={`flex items-center space-x-1 px-3 py-1.5 ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-white' : theme === 'pastel' ? 'bg-teal-800 hover:bg-teal-700 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'} rounded-lg text-xs font-medium cursor-pointer transition-all`}>
            <Upload className="w-3.5 h-3.5" />
            <span>นำเข้า</span>
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>

          <button 
            onClick={handleExportJSON}
            className={`flex items-center space-x-1 px-3 py-1.5 ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-white' : theme === 'pastel' ? 'bg-teal-800 hover:bg-teal-700 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'} rounded-lg text-xs font-medium transition-all`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>ส่งออก</span>
          </button>

          {/* Share / Invite */}
          <button 
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>เชิญสมาชิก</span>
          </button>
        </div>
      </header>

      {/* Printable Document Header (Appears only on print/PDF) */}
      <div className="hidden print:block p-6 bg-white text-slate-900 border-b-2 border-slate-900 mb-4">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">แผนผังตระกูลม้งลี</h1>
            <p className="text-sm text-slate-600 mt-1">เอกสารสรุปเครือญาติและข้อมูลสมาชิกตระกูล</p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <p>วันที่ออกเอกสาร: {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p>จำนวนสมาชิกทั้งหมด: {members.length} คน</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 relative overflow-hidden print:overflow-visible print:block">
        
        {/* 2. Left/Center: Interactive Family Tree Canvas */}
        <div 
          className={`flex-1 ${t.canvasBg} relative cursor-grab active:cursor-grabbing overflow-hidden transition-colors duration-300 print:bg-white print:w-full print:h-auto print:overflow-visible`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Canvas Background Grid */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none print:hidden"
            style={{
              backgroundImage: `radial-gradient(circle, ${t.gridDot} 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
              transformOrigin: '0 0'
            }}
          />

          {/* Canvas Zoom & Pan Floating Controls */}
          <div className={`absolute top-4 left-4 z-20 flex flex-col space-y-1 ${theme === 'dark' ? 'bg-slate-800/90 border-slate-700 text-slate-300' : theme === 'pastel' ? 'bg-white/80 border-rose-200 text-slate-700' : 'bg-white/90 border-slate-300 text-slate-700'} backdrop-blur border p-1.5 rounded-xl shadow-xl print:hidden`}>
            <button 
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.8))}
              className="p-2 hover:bg-slate-500/20 rounded-lg transition-colors"
              title="ซูมเข้า"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.5))}
              className="p-2 hover:bg-slate-500/20 rounded-lg transition-colors"
              title="ซูมออก"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button 
              onClick={() => { setZoomLevel(1); setPanOffset({ x: 0, y: 0 }); }}
              className="p-2 hover:bg-slate-500/20 rounded-lg transition-colors"
              title="รีเซ็ตมุมมอง"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Tree Focus Indicator Badge */}
          <div className={`absolute top-4 right-4 z-20 ${theme === 'dark' ? 'bg-slate-800/90 border-slate-700 text-slate-300' : theme === 'pastel' ? 'bg-white/80 border-rose-200 text-teal-900' : 'bg-white/90 border-slate-300 text-slate-700'} border px-3 py-1.5 rounded-lg text-xs backdrop-blur shadow-lg flex items-center space-x-2 print:hidden`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>ศูนย์กลางการแสดงผล: <strong className="text-emerald-600 dark:text-emerald-400">{hierarchy.focus?.firstName} {hierarchy.focus?.lastName}</strong></span>
          </div>

          {/* TREE GRAPH RENDERER */}
          <div 
            className="absolute inset-0 flex items-center justify-center transition-transform duration-75 ease-out pointer-events-none print:static print:transform-none print:pointer-events-auto print:my-6"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`
            }}
          >
            <div className="pointer-events-auto flex flex-col items-center space-y-16 p-20 min-w-max print:p-0 print:space-y-8">
              
              {/* LEVEL 1: PARENTS (พ่อ มารดา) */}
              <div className="flex items-center space-x-12 relative">
                {hierarchy.parents.length > 0 ? (
                  hierarchy.parents.map(parent => (
                    <MemberNode 
                      key={parent.id} 
                      member={parent}
                      theme={theme}
                      isSelected={selectedMemberId === parent.id}
                      isFocus={focusMemberId === parent.id}
                      onSelect={() => handleSelectMember(parent.id)}
                      onFocus={() => handleSetFocus(parent.id)}
                      relationLabel={parent.gender === 'male' ? 'บิดา' : 'มารดา'}
                    />
                  ))
                ) : (
                  <div className={`border border-dashed rounded-xl p-3 text-center text-xs ${theme === 'dark' ? 'border-slate-700 text-slate-500' : theme === 'pastel' ? 'border-rose-300 text-teal-700' : 'border-slate-300 text-slate-400'} print:text-slate-700 print:border-slate-400`}>
                    ไม่พบข้อมูลบิดา-มารดา
                  </div>
                )}
              </div>

              {/* Connection Line from Parents to Focus */}
              <div className={`w-0.5 h-12 ${theme === 'dark' ? 'bg-slate-600' : theme === 'pastel' ? 'bg-teal-400' : 'bg-slate-400'} print:bg-slate-400 -my-8 relative`}>
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 ${theme === 'dark' ? 'bg-slate-500' : theme === 'pastel' ? 'bg-teal-500' : 'bg-slate-400'} rounded-full`}></div>
              </div>

              {/* LEVEL 2: MAIN FOCUS & SPOUSE & SIBLINGS */}
              <div className="flex items-center space-x-16">
                
                {/* Siblings Section (พี่น้อง) */}
                {hierarchy.siblings.length > 0 && (
                  <div className={`flex items-center space-x-4 border-r-2 border-dashed ${theme === 'dark' ? 'border-slate-800' : theme === 'pastel' ? 'border-rose-200' : 'border-slate-300'} print:border-slate-300 pr-8`}>
                    <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-500' : theme === 'pastel' ? 'text-teal-700' : 'text-slate-400'}`}>พี่น้อง</span>
                    {hierarchy.siblings.map(sib => (
                      <MemberNode 
                        key={sib.id} 
                        member={sib}
                        theme={theme}
                        isSelected={selectedMemberId === sib.id}
                        isFocus={focusMemberId === sib.id}
                        onSelect={() => handleSelectMember(sib.id)}
                        onFocus={() => handleSetFocus(sib.id)}
                        relationLabel="พี่/น้อง"
                      />
                    ))}
                  </div>
                )}

                {/* Focus Member & Spouse Pair */}
                <div className={`flex items-center space-x-6 ${t.focusBoxBg} p-4 rounded-2xl border print:border-slate-300 print:bg-slate-100 transition-colors duration-300`}>
                  {hierarchy.focus && (
                    <MemberNode 
                      member={hierarchy.focus}
                      theme={theme}
                      isSelected={selectedMemberId === hierarchy.focus.id}
                      isFocus={true}
                      onSelect={() => handleSelectMember(hierarchy.focus.id)}
                      onFocus={() => handleSetFocus(hierarchy.focus.id)}
                      relationLabel="ศูนย์กลาง"
                    />
                  )}

                  {/* Marriage Connection */}
                  <div className="flex flex-col items-center text-pink-500">
                    <Heart className="w-5 h-5 fill-pink-500/20 stroke-pink-500 animate-pulse print:animate-none" />
                    <div className="w-8 h-0.5 bg-pink-500/50 my-1"></div>
                  </div>

                  {hierarchy.spouse ? (
                    <MemberNode 
                      member={hierarchy.spouse}
                      theme={theme}
                      isSelected={selectedMemberId === hierarchy.spouse.id}
                      isFocus={focusMemberId === hierarchy.spouse.id}
                      onSelect={() => handleSelectMember(hierarchy.spouse.id)}
                      onFocus={() => handleSetFocus(hierarchy.spouse.id)}
                      relationLabel="คู่ครอง"
                    />
                  ) : (
                    <button 
                      onClick={() => handleAddRelation('spouse')}
                      className={`w-32 h-24 rounded-xl border-2 border-dashed ${theme === 'dark' ? 'border-slate-700 bg-slate-900/30 text-slate-500' : theme === 'pastel' ? 'border-rose-300 bg-white/40 text-rose-500' : 'border-slate-300 bg-slate-50 text-slate-400'} hover:border-emerald-500 hover:text-emerald-500 flex flex-col items-center justify-center transition-all print:hidden`}
                    >
                      <UserPlus className="w-5 h-5 mb-1" />
                      <span className="text-xs">เพิ่มคู่ครอง</span>
                    </button>
                  )}
                </div>

              </div>

              {/* Connection Line from Focus to Children */}
              <div className={`w-0.5 h-12 ${theme === 'dark' ? 'bg-slate-600' : theme === 'pastel' ? 'bg-teal-400' : 'bg-slate-400'} print:bg-slate-400 -my-8 relative`}>
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 ${theme === 'dark' ? 'bg-slate-500' : theme === 'pastel' ? 'bg-teal-500' : 'bg-slate-400'} rounded-full`}></div>
              </div>

              {/* LEVEL 3: CHILDREN (บุตร / ธิดา) */}
              <div className="flex items-center space-x-8">
                {hierarchy.children.length > 0 ? (
                  hierarchy.children.map(child => (
                    <MemberNode 
                      key={child.id} 
                      member={child}
                      theme={theme}
                      isSelected={selectedMemberId === child.id}
                      isFocus={focusMemberId === child.id}
                      onSelect={() => handleSelectMember(child.id)}
                      onFocus={() => handleSetFocus(child.id)}
                      relationLabel={child.gender === 'male' ? 'บุตรชาย' : 'บุตรสาว'}
                    />
                  ))
                ) : (
                  <div className={`border border-dashed rounded-xl p-3 text-center text-xs ${theme === 'dark' ? 'border-slate-700 text-slate-500' : theme === 'pastel' ? 'border-rose-300 text-teal-700' : 'border-slate-300 text-slate-400'} print:text-slate-700 print:border-slate-400`}>
                    ยังไม่มีข้อมูลบุตร/ธิดา
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* 3. Right Panel: Sidebar Details & Edit Member */}
        <div className={`w-96 ${t.sidebar} border-l flex flex-col h-full shadow-2xl z-10 shrink-0 print:hidden transition-colors duration-300`}>
          {selectedMember && editForm ? (
            <>
              {/* Sidebar Header */}
              <div className={`p-4 ${t.sidebarHeader} border-b flex items-center justify-between`}>
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-emerald-500" />
                  <h2 className="font-bold text-lg">รายละเอียดสมาชิก</h2>
                </div>
                
                {userRole !== 'guest' && (
                  !isEditing ? (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-3 py-1 bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-600/40 rounded-lg text-xs font-semibold hover:bg-emerald-600 hover:text-white transition-all flex items-center space-x-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>แก้ไขข้อมูล</span>
                    </button>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={handleSaveMember}
                        className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-500 transition-all flex items-center space-x-1"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>บันทึก</span>
                      </button>
                      <button 
                        onClick={() => { setEditForm({ ...selectedMember }); setIsEditing(false); }}
                        className={`px-2.5 py-1 ${theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'} rounded-lg text-xs hover:opacity-80 transition-all`}
                      >
                        ยกเลิก
                      </button>
                    </div>
                  )
                )}
              </div>

              {/* Sidebar Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                
                {/* Member Profile Avatar Header */}
                <div className={`flex flex-col items-center ${theme === 'dark' ? 'bg-slate-900/60 border-slate-700/60' : theme === 'pastel' ? 'bg-white/60 border-rose-200' : 'bg-slate-50 border-slate-200'} p-4 rounded-xl border relative`}>
                  <div className="relative group">
                    <div className={`w-24 h-24 rounded-full overflow-hidden border-4 ${editForm.gender === 'male' ? 'border-blue-500' : 'border-pink-500'} ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'} flex items-center justify-center shadow-lg`}>
                      {editForm.photo ? (
                        <img src={editForm.photo} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-12 h-12 text-slate-400" />
                      )}
                    </div>
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-full cursor-pointer shadow-lg transition-transform hover:scale-110">
                        <Camera className="w-4 h-4" />
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                      </label>
                    )}
                  </div>

                  <h3 className="mt-3 text-lg font-bold text-center">
                    {editForm.firstName} {editForm.lastName}
                  </h3>
                  {editForm.nickname && (
                    <span className={`text-xs ${t.subText}`}>({editForm.nickname})</span>
                  )}

                  <div className="mt-2 flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${editForm.gender === 'male' ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30' : 'bg-pink-500/20 text-pink-500 border border-pink-500/30'}`}>
                      {editForm.gender === 'male' ? 'ชาย' : 'หญิง'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${editForm.isAlive ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30' : 'bg-slate-200 text-slate-500'}`}>
                      {editForm.isAlive ? 'ยังมีชีวิตอยู่' : 'เสียชีวิตแล้ว'}
                    </span>
                  </div>
                </div>

                {/* Quick Relationship Actions */}
                <div className="space-y-2">
                  <span className={`text-xs font-semibold ${t.subText} uppercase tracking-wider block`}>เพิ่มความสัมพันธ์</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => handleAddRelation('father')}
                      disabled={userRole === 'guest'}
                      className={`px-3 py-2 ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : theme === 'pastel' ? 'bg-white hover:bg-rose-100 text-slate-700 border border-rose-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'} text-xs font-medium rounded-lg flex items-center space-x-1.5 transition-all disabled:opacity-50`}
                    >
                      <UserPlus className="w-3.5 h-3.5 text-blue-500" />
                      <span>เพิ่ม บิดา</span>
                    </button>
                    <button 
                      onClick={() => handleAddRelation('mother')}
                      disabled={userRole === 'guest'}
                      className={`px-3 py-2 ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : theme === 'pastel' ? 'bg-white hover:bg-rose-100 text-slate-700 border border-rose-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'} text-xs font-medium rounded-lg flex items-center space-x-1.5 transition-all disabled:opacity-50`}
                    >
                      <UserPlus className="w-3.5 h-3.5 text-pink-500" />
                      <span>เพิ่ม มารดา</span>
                    </button>
                    <button 
                      onClick={() => handleAddRelation('spouse')}
                      disabled={userRole === 'guest'}
                      className={`px-3 py-2 ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : theme === 'pastel' ? 'bg-white hover:bg-rose-100 text-slate-700 border border-rose-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'} text-xs font-medium rounded-lg flex items-center space-x-1.5 transition-all disabled:opacity-50`}
                    >
                      <Heart className="w-3.5 h-3.5 text-red-500" />
                      <span>เพิ่ม คู่ครอง</span>
                    </button>
                    <button 
                      onClick={() => handleAddRelation('child')}
                      disabled={userRole === 'guest'}
                      className={`px-3 py-2 ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : theme === 'pastel' ? 'bg-white hover:bg-rose-100 text-slate-700 border border-rose-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'} text-xs font-medium rounded-lg flex items-center space-x-1.5 transition-all disabled:opacity-50`}
                    >
                      <UserPlus className="w-3.5 h-3.5 text-emerald-500" />
                      <span>เพิ่ม บุตร/ธิดา</span>
                    </button>
                    <button 
                      onClick={() => handleAddRelation('sibling')}
                      disabled={userRole === 'guest'}
                      className={`px-3 py-2 ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : theme === 'pastel' ? 'bg-white hover:bg-rose-100 text-slate-700 border border-rose-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'} text-xs font-medium rounded-lg flex items-center space-x-1.5 transition-all col-span-2 disabled:opacity-50`}
                    >
                      <Users className="w-3.5 h-3.5 text-amber-500" />
                      <span>เพิ่ม พี่/น้อง</span>
                    </button>
                  </div>
                </div>

                {/* Detailed Information Form */}
                <div className="space-y-4 text-xs">
                  <span className={`text-xs font-semibold ${t.subText} uppercase tracking-wider block border-b pb-1 ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>ข้อมูลส่วนตัว</span>
                  
                  {/* Name Input */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={`${t.subText} block mb-1`}>ชื่อ</label>
                      {isEditing ? (
                        <input 
                          type="text"
                          value={editForm.firstName}
                          onChange={e => setEditForm({ ...editForm, firstName: e.target.value })}
                          className={`w-full ${t.inputBg} rounded-lg p-2 outline-none`}
                        />
                      ) : (
                        <p className="font-semibold py-1.5">{editForm.firstName || '-'}</p>
                      )}
                    </div>
                    <div>
                      <label className={`${t.subText} block mb-1`}>นามสกุล</label>
                      {isEditing ? (
                        <input 
                          type="text"
                          value={editForm.lastName}
                          onChange={e => setEditForm({ ...editForm, lastName: e.target.value })}
                          className={`w-full ${t.inputBg} rounded-lg p-2 outline-none`}
                        />
                      ) : (
                        <p className="font-semibold py-1.5">{editForm.lastName || '-'}</p>
                      )}
                    </div>
                  </div>

                  {/* Nickname & Gender */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={`${t.subText} block mb-1`}>ชื่อเล่น</label>
                      {isEditing ? (
                        <input 
                          type="text"
                          value={editForm.nickname}
                          onChange={e => setEditForm({ ...editForm, nickname: e.target.value })}
                          className={`w-full ${t.inputBg} rounded-lg p-2 outline-none`}
                        />
                      ) : (
                        <p className="py-1.5">{editForm.nickname || '-'}</p>
                      )}
                    </div>
                    <div>
                      <label className={`${t.subText} block mb-1`}>เพศ</label>
                      {isEditing ? (
                        <select 
                          value={editForm.gender}
                          onChange={e => setEditForm({ ...editForm, gender: e.target.value })}
                          className={`w-full ${t.inputBg} rounded-lg p-2 outline-none`}
                        >
                          <option value="male">ชาย</option>
                          <option value="female">หญิง</option>
                        </select>
                      ) : (
                        <p className="py-1.5">{editForm.gender === 'male' ? 'ชาย' : 'หญิง'}</p>
                      )}
                    </div>
                  </div>

                  {/* Birth / Death Dates */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={`${t.subText} flex items-center space-x-1 mb-1`}>
                        <Calendar className="w-3 h-3" />
                        <span>วันเกิด</span>
                      </label>
                      {isEditing ? (
                        <input 
                          type="date"
                          value={editForm.birthDate}
                          onChange={e => setEditForm({ ...editForm, birthDate: e.target.value })}
                          className={`w-full ${t.inputBg} rounded-lg p-2 outline-none`}
                        />
                      ) : (
                        <p className="py-1.5">{editForm.birthDate || '-'}</p>
                      )}
                    </div>
                    <div>
                      <label className={`${t.subText} flex items-center space-x-1 mb-1`}>
                        <Calendar className="w-3 h-3" />
                        <span>สถานะชีวิต</span>
                      </label>
                      {isEditing ? (
                        <select 
                          value={editForm.isAlive ? "alive" : "deceased"}
                          onChange={e => setEditForm({ ...editForm, isAlive: e.target.value === "alive" })}
                          className={`w-full ${t.inputBg} rounded-lg p-2 outline-none`}
                        >
                          <option value="alive">ยังมีชีวิตอยู่</option>
                          <option value="deceased">เสียชีวิตแล้ว</option>
                        </select>
                      ) : (
                        <p className="py-1.5">{editForm.isAlive ? 'ยังมีชีวิตอยู่' : `เสียชีวิต (${editForm.deathDate || 'ไม่ระบุวัน'})`}</p>
                      )}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div>
                    <label className={`${t.subText} flex items-center space-x-1 mb-1`}>
                      <Phone className="w-3 h-3" />
                      <span>เบอร์โทรศัพท์</span>
                    </label>
                    {isEditing ? (
                      <input 
                        type="text"
                        value={editForm.phone}
                        onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                        className={`w-full ${t.inputBg} rounded-lg p-2 outline-none`}
                      />
                    ) : (
                      <p className="py-1">{editForm.phone || '-'}</p>
                    )}
                  </div>

                  <div>
                    <label className={`${t.subText} flex items-center space-x-1 mb-1`}>
                      <Mail className="w-3 h-3" />
                      <span>อีเมล</span>
                    </label>
                    {isEditing ? (
                      <input 
                        type="email"
                        value={editForm.email}
                        onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                        className={`w-full ${t.inputBg} rounded-lg p-2 outline-none`}
                      />
                    ) : (
                      <p className="py-1">{editForm.email || '-'}</p>
                    )}
                  </div>

                  <div>
                    <label className={`${t.subText} flex items-center space-x-1 mb-1`}>
                      <MapPin className="w-3 h-3" />
                      <span>ที่อยู่</span>
                    </label>
                    {isEditing ? (
                      <input 
                        type="text"
                        value={editForm.address}
                        onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                        className={`w-full ${t.inputBg} rounded-lg p-2 outline-none`}
                      />
                    ) : (
                      <p className="py-1">{editForm.address || '-'}</p>
                    )}
                  </div>

                  <div>
                    <label className={`${t.subText} flex items-center space-x-1 mb-1`}>
                      <FileText className="w-3 h-3" />
                      <span>ประวัติ / หมายเหตุ</span>
                    </label>
                    {isEditing ? (
                      <textarea 
                        rows={3}
                        value={editForm.bio}
                        onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                        className={`w-full ${t.inputBg} rounded-lg p-2 outline-none resize-none`}
                      />
                    ) : (
                      <p className={`p-2 rounded-lg border leading-relaxed ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800 text-slate-300' : theme === 'pastel' ? 'bg-white/60 border-rose-200 text-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>{editForm.bio || 'ไม่มีข้อมูลประวัติ'}</p>
                    )}
                  </div>

                </div>

              </div>

              {/* Sidebar Footer: Delete Action */}
              {userRole === 'admin' && (
                <div className={`p-4 ${t.sidebarHeader} border-t`}>
                  <button 
                    onClick={() => handleDeleteMember(selectedMember.id)}
                    className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>ลบสมาชิกนี้ออกจากแผนผัง</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className={`flex-1 flex flex-col items-center justify-center p-6 text-center ${t.subText}`}>
              <Users className="w-12 h-12 mb-2 stroke-1" />
              <p>กรุณาคลิกเลือกสมาชิกในแผนผังเพื่อดูรายละเอียด</p>
            </div>
          )}
        </div>

      </div>

      {/* Printable Member Summary Table (Appears on print/PDF) */}
      <div className="hidden print:block p-6 bg-white text-slate-900 break-before-page">
        <h2 className="text-xl font-bold mb-4 pb-2 border-b border-slate-300">ตารางสรุปสมาชิกทั้งหมดในตระกูล</h2>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-semibold">
              <th className="py-2 px-3 border-r border-slate-200">#</th>
              <th className="py-2 px-3 border-r border-slate-200">ชื่อ - นามสกุล</th>
              <th className="py-2 px-3 border-r border-slate-200">ชื่อเล่น</th>
              <th className="py-2 px-3 border-r border-slate-200">เพศ</th>
              <th className="py-2 px-3 border-r border-slate-200">วันเกิด</th>
              <th className="py-2 px-3 border-r border-slate-200">เบอร์โทรศัพท์</th>
              <th className="py-2 px-3">สถานะชีวิต</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m, idx) => (
              <tr key={m.id} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="py-2 px-3 border-r border-slate-200">{idx + 1}</td>
                <td className="py-2 px-3 border-r border-slate-200 font-medium">{m.firstName} {m.lastName}</td>
                <td className="py-2 px-3 border-r border-slate-200">{m.nickname || '-'}</td>
                <td className="py-2 px-3 border-r border-slate-200">{m.gender === 'male' ? 'ชาย' : 'หญิง'}</td>
                <td className="py-2 px-3 border-r border-slate-200">{m.birthDate || '-'}</td>
                <td className="py-2 px-3 border-r border-slate-200">{m.phone || '-'}</td>
                <td className="py-2 px-3">{m.isAlive ? 'ยังมีชีวิตอยู่' : 'เสียชีวิต'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODAL 1: Invite & Access Control --- */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${t.modalBg} border w-full max-w-md rounded-2xl p-6 shadow-2xl relative`}>
            <button 
              onClick={() => setIsInviteModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-emerald-600/20 p-2.5 rounded-xl border border-emerald-500/30 text-emerald-500">
                <Share2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">เชิญสมาชิกตระกูลม้งลี</h3>
                <p className={`text-xs ${t.subText}`}>แชร์แผนผังตระกูลเพื่อให้สมาชิกเข้ามาร่วมดูหรือแก้ไข</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block mb-1.5 font-medium">รหัสผ่านสำหรับสมาชิก (PIN Access)</label>
                <div className="flex items-center space-x-2">
                  <input 
                    type="text" 
                    value={invitePin}
                    onChange={(e) => setInvitePin(e.target.value)}
                    className={`flex-1 ${t.inputBg} rounded-lg px-3 py-2 font-mono font-bold text-center tracking-widest text-sm outline-none`}
                  />
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(invitePin);
                      showToast('คัดลอก PIN แล้ว');
                    }}
                    className={`px-3 py-2 ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'} rounded-lg font-medium`}
                  >
                    คัดลอก PIN
                  </button>
                </div>
              </div>

              <div>
                <label className="block mb-1.5 font-medium">ลิงก์สำหรับเข้าชมแผนผังตระกูล</label>
                <div className="flex items-center space-x-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={`${window.location.origin}?family=hmong-lee&pin=${invitePin}`}
                    className={`flex-1 ${t.inputBg} rounded-lg px-3 py-2 text-xs outline-none truncate`}
                  />
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}?family=hmong-lee&pin=${invitePin}`);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                      showToast('คัดลอกลิงก์เรียบร้อยแล้ว');
                    }}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium shrink-0 flex items-center space-x-1"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'คัดลอกแล้ว' : 'คัดลอกลิงก์'}</span>
                  </button>
                </div>
              </div>

              <div className={`p-3 rounded-xl border space-y-2 ${theme === 'dark' ? 'bg-slate-900/60 border-slate-700/60 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                <span className="font-semibold flex items-center space-x-1">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  <span>สิทธิ์การใช้งานแต่ละระดับ:</span>
                </span>
                <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed">
                  <li><strong className="text-emerald-500">Admin:</strong> สิทธิ์เต็ม เพิ่ม แก้ไข ลบสมาชิก และส่งออก/นำเข้าข้อมูล</li>
                  <li><strong className="text-indigo-500">Invited Member:</strong> สิทธิ์แก้ไขข้อมูล และเพิ่มความสัมพันธ์</li>
                  <li><strong className="text-amber-500">Guest:</strong> สามารถรับชมแผนผังได้อย่างเดียว</li>
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <button 
                onClick={() => setIsInviteModalOpen(false)}
                className={`w-full py-2 ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'} rounded-lg font-semibold text-xs`}
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: Add New Relation Member --- */}
      {isAddModalOpen && (
        <AddRelationModal 
          relationType={addRelationType}
          theme={theme}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={executeAddRelation}
        />
      )}

    </div>
  );
}

// Sub-component: Individual Member Node Card on Canvas
function MemberNode({ member, theme, isSelected, isFocus, onSelect, onFocus, relationLabel }) {
  const getNodeThemeStyle = () => {
    switch (theme) {
      case 'light':
        return {
          cardBg: isFocus ? 'bg-slate-100' : 'bg-white',
          border: isSelected ? 'border-emerald-500 ring-4 ring-emerald-500/20' : 'border-slate-300 hover:border-slate-400',
          badgeBg: 'bg-slate-200 border-slate-300 text-slate-700',
          textName: 'text-slate-800',
          textSub: 'text-slate-500',
          avatarBg: 'bg-slate-100',
          btnBg: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
        };
      case 'pastel':
        return {
          cardBg: isFocus ? 'bg-rose-100/70' : 'bg-white/90',
          border: isSelected ? 'border-emerald-500 ring-4 ring-emerald-500/20 shadow-emerald-200' : 'border-rose-200 hover:border-rose-300',
          badgeBg: 'bg-rose-100 border-rose-200 text-teal-800',
          textName: 'text-teal-950',
          textSub: 'text-teal-700',
          avatarBg: 'bg-teal-50',
          btnBg: 'bg-teal-50 hover:bg-teal-100 text-teal-800 border-teal-200'
        };
      case 'dark':
      default:
        return {
          cardBg: isFocus ? 'bg-slate-800' : 'bg-slate-850',
          border: isSelected ? 'border-emerald-500 shadow-emerald-500/20 ring-4 ring-emerald-500/20' : 'border-slate-700 hover:border-slate-500',
          badgeBg: 'bg-slate-700 border-slate-600 text-slate-300',
          textName: 'text-slate-100',
          textSub: 'text-slate-400',
          avatarBg: 'bg-slate-900',
          btnBg: 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
        };
    }
  };

  const ns = getNodeThemeStyle();

  return (
    <div 
      onClick={onSelect}
      className={`relative w-44 ${ns.cardBg} print:bg-white rounded-2xl p-3 border-2 transition-all cursor-pointer shadow-xl hover:scale-105 no-pan ${ns.border} print:ring-0 print:border-slate-300`}
    >
      {/* Relation Badge Header */}
      {relationLabel && (
        <span className={`absolute -top-2.5 left-1/2 -translate-x-1/2 ${ns.badgeBg} print:bg-slate-200 border print:border-slate-300 print:text-slate-800 text-[10px] px-2 py-0.5 rounded-full font-semibold shadow-sm`}>
          {relationLabel}
        </span>
      )}

      <div className="flex flex-col items-center pt-1">
        {/* Avatar */}
        <div className={`w-14 h-14 rounded-full overflow-hidden border-2 mb-2 ${member.gender === 'male' ? 'border-blue-400' : 'border-pink-400'} ${ns.avatarBg} print:bg-slate-100 flex items-center justify-center`}>
          {member.photo ? (
            <img src={member.photo} alt={member.firstName} className="w-full h-full object-cover" />
          ) : (
            <User className={`w-7 h-7 ${member.gender === 'male' ? 'text-blue-500' : 'text-pink-500'}`} />
          )}
        </div>

        {/* Name */}
        <h4 className={`font-bold ${ns.textName} print:text-slate-900 text-xs text-center truncate w-full`}>
          {member.firstName} {member.lastName}
        </h4>
        {member.nickname && (
          <span className={`text-[10px] ${ns.textSub} print:text-slate-600`}>({member.nickname})</span>
        )}

        {/* Life Status Badge */}
        <div className="mt-2 flex items-center space-x-1">
          <span className={`w-1.5 h-1.5 rounded-full ${member.isAlive ? 'bg-emerald-500 print:bg-emerald-600' : 'bg-slate-400'}`}></span>
          <span className={`text-[10px] ${ns.textSub} print:text-slate-600`}>
            {member.birthDate ? new Date(member.birthDate).getFullYear() : 'ไม่ระบุ'}
          </span>
        </div>

        {/* Focus Center Tree Button */}
        {!isFocus && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onFocus();
            }}
            className={`mt-2 w-full py-1 ${ns.btnBg} rounded-lg text-[10px] font-medium flex items-center justify-center space-x-1 border transition-colors print:hidden`}
            title="ตั้งสมาชิกนี้เป็นศูนย์กลางแผนผัง"
          >
            <span>ขยายผัง</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}

// Sub-component: Add Relation Modal Dialog
function AddRelationModal({ relationType, theme, onClose, onSubmit }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('ลี');
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState('male');

  const getRelationTitle = () => {
    switch (relationType) {
      case 'father': return 'เพิ่มข้อมูล บิดา';
      case 'mother': return 'เพิ่มข้อมูล มารดา';
      case 'spouse': return 'เพิ่มข้อมูล คู่ครอง / สามี / ภรรยา';
      case 'child': return 'เพิ่มข้อมูล บุตร / ธิดา';
      case 'sibling': return 'เพิ่มข้อมูล พี่ / น้อง';
      default: return 'เพิ่มสมาชิกใหม่';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ firstName, lastName, nickname, gender });
  };

  const inputClass = theme === 'dark' 
    ? 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500' 
    : theme === 'pastel'
    ? 'bg-white border-teal-200 text-slate-800 focus:border-teal-500'
    : 'bg-slate-100 border-slate-300 text-slate-800 focus:border-emerald-500';

  const modalBgClass = theme === 'dark'
    ? 'bg-slate-800 border-slate-700 text-white'
    : theme === 'pastel'
    ? 'bg-teal-50 border-teal-200 text-slate-800'
    : 'bg-white border-slate-200 text-slate-800';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`${modalBgClass} border w-full max-w-sm rounded-2xl p-6 shadow-2xl relative`}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
          <UserPlus className="w-5 h-5 text-emerald-500" />
          <span>{getRelationTitle()}</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block mb-1 font-medium">ชื่อต้น *</label>
            <input 
              type="text" 
              required
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="เช่น เล่าปอ"
              className={`w-full border rounded-lg p-2.5 outline-none ${inputClass}`}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">นามสกุล</label>
            <input 
              type="text" 
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              className={`w-full border rounded-lg p-2.5 outline-none ${inputClass}`}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">ชื่อเล่น</label>
            <input 
              type="text" 
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              placeholder="เช่น ปู่เล่า"
              className={`w-full border rounded-lg p-2.5 outline-none ${inputClass}`}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">เพศ</label>
            <select 
              value={gender}
              onChange={e => setGender(e.target.value)}
              className={`w-full border rounded-lg p-2.5 outline-none ${inputClass}`}
            >
              <option value="male">ชาย</option>
              <option value="female">หญิง</option>
            </select>
          </div>

          <div className="pt-2 flex items-center space-x-2">
            <button 
              type="submit"
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs shadow-lg transition-all"
            >
              บันทึกสมาชิก
            </button>
            <button 
              type="button"
              onClick={onClose}
              className={`px-4 py-2.5 ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'} rounded-lg font-medium text-xs`}
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}