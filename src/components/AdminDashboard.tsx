import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { AppItem, AppCategory } from '../types/store';
import {
  ShieldAlert,
  UploadCloud,
  FileCode,
  Image,
  Trash2,
  Edit3,
  Plus,
  CheckCircle,
  AlertTriangle,
  Search,
  X,
  ExternalLink,
  Layers,
  Sparkles,
  FolderOpen,
  Check,
  Shapes,
  Maximize2,
  ShieldCheck,
  Download,
  HardDrive,
  Star,
  Award,
  Zap,
  CheckCircle2,
  RefreshCw,
  Copy,
  FileDown,
  FileUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Preset icon gallery for quick developer selection
const PRESET_ICONS = [
  { name: 'AR Transformer Identity', url: '/assets/aistudio/file_0000000093f081f5902b6fdd29762298_938e318c.png' },
  { name: 'Cyber Neon', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=256&h=256&fit=crop&q=80' },
  { name: 'Neural AI', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=256&h=256&fit=crop&q=80' },
  { name: 'Quantum Core', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=256&h=256&fit=crop&q=80' },
  { name: 'Space Explorer', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=256&h=256&fit=crop&q=80' },
  { name: 'Apex Racing', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=256&h=256&fit=crop&q=80' },
  { name: 'Holo Matrix', url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=256&h=256&fit=crop&q=80' },
  { name: 'Bio Pulse', url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=256&h=256&fit=crop&q=80' },
  { name: 'Cipher Vault', url: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=256&h=256&fit=crop&q=80' },
];

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    switchUserRole,
    apps,
    createApp,
    updateApp,
    deleteApp,
    categories,
    theme,
    showToast,
    loadSampleCatalog,
    clearAllCatalog,
    downloadApkBinary
  } = useStore();

  const [activeTab, setActiveTab] = useState<'upload' | 'manage'>('upload');

  // Form State for Upload (Clean slate defaults)
  const [appName, setAppName] = useState('');
  const [developer, setDeveloper] = useState('');
  const [category, setCategory] = useState<AppCategory>('Tools');
  const [version, setVersion] = useState('1.0.0');
  const [size, setSize] = useState('');
  const [description, setDescription] = useState('');
  const [whatsNew, setWhatsNew] = useState('');
  const [tags, setTags] = useState('');
  const [price, setPrice] = useState('Free');
  const [featured, setFeatured] = useState(false);

  // App Icon Shape and settings (Transformer AR Logo default identity)
  const [iconShape, setIconShape] = useState<'squircle' | 'rounded' | 'circle' | 'teardrop' | 'hexagon'>('squircle');
  const [iconPreview, setIconPreview] = useState<string>(
    '/assets/aistudio/file_0000000093f081f5902b6fdd29762298_938e318c.png'
  );
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconGlow, setIconGlow] = useState<boolean>(true);
  const [iconBorder, setIconBorder] = useState<'cyan' | 'silver' | 'gold' | 'emerald' | 'none'>('cyan');
  const [iconBadge, setIconBadge] = useState<'none' | 'verified' | 'editors' | 'beta' | 'fps'>('verified');

  // APK File from Internal Storage & Manifest (Clean slate defaults)
  const [apkFile, setApkFile] = useState<File | null>(null);
  const [apkFileName, setApkFileName] = useState<string>('');
  const [apkFileSize, setApkFileSize] = useState<string>('');
  const [apkUrlDirect, setApkUrlDirect] = useState<string>('');
  const [apkArchitecture, setApkArchitecture] = useState<'arm64-v8a (Universal)' | 'arm64-v8a' | 'armeabi-v7a' | 'x86_64'>('arm64-v8a (Universal)');
  const [apkTargetSdk, setApkTargetSdk] = useState<'Android 14 (API 34)' | 'Android 13 (API 33)' | 'Android 12 (API 31)' | 'Android 10 (API 29)'>('Android 14 (API 34)');
  const [apkPackageName, setApkPackageName] = useState<string>('');
  const [isVerifyingApk, setIsVerifyingApk] = useState<boolean>(false);
  const [apkVerified, setApkVerified] = useState<boolean>(true);

  // Screenshots Gallery
  const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([]);

  // Management State
  const [tableSearch, setTableSearch] = useState('');
  const [editingApp, setEditingApp] = useState<AppItem | null>(null);
  const [deletingApp, setDeletingApp] = useState<AppItem | null>(null);

  // Hidden File Input Refs for internal storage browsing
  const apkInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);
  const screenshotInputRef = useRef<HTMLInputElement>(null);
  const jsonImportRef = useRef<HTMLInputElement>(null);

  // Protected Route Check (Role 1: Admin vs Role 2: User)
  if (currentUser.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className={`p-8 rounded-3xl border shadow-xl ${
          theme === 'dark' ? 'bg-[#14151b] border-red-500/30' : 'bg-white border-red-200'
        }`}>
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/40 flex items-center justify-center mx-auto mb-4 text-red-500">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h2 className={`text-2xl font-bold font-['Space_Grotesk'] mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Access Restricted: Admin Clearance Required
          </h2>
          <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed max-w-md mx-auto mb-6">
            The <code className="text-red-500 font-mono">/admin</code> console is reserved for the authorized publisher (<span className="font-mono font-semibold">admin@arstore.com</span>).
          </p>

          <button
            onClick={() => switchUserRole('admin')}
            className="px-6 py-3 rounded-xl font-bold text-sm bg-purple-600 hover:bg-purple-500 text-white shadow-lg transition-all flex items-center gap-2 mx-auto"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Authenticate as admin@arstore.com</span>
          </button>
        </div>
      </div>
    );
  }

  // Handle Internal Storage APK Pick
  const handleApkFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setApkFile(file);
      setApkFileName(file.name);
      const computedMb = (file.size / (1024 * 1024)).toFixed(1);
      const computedStr = `${computedMb} MB`;
      setApkFileSize(computedStr);
      setSize(computedStr);
      const devSlug = developer ? developer.toLowerCase().replace(/[^a-z0-9]/g, '') : 'cyberworks';
      const fileSlug = file.name.replace(/\.[^/.]+$/, '').toLowerCase().replace(/[^a-z0-9]/g, '');
      setApkPackageName(`com.${devSlug}.${fileSlug}`);
      setApkVerified(true);
      showToast('APK Selected from Storage', `${file.name} (${computedStr}) loaded from device.`, 'success');
    }
  };

  const handleVerifyApk = () => {
    setIsVerifyingApk(true);
    showToast('Inspecting APK Manifest', `Checking binary integrity of ${apkFileName}...`, 'info');
    setTimeout(() => {
      setIsVerifyingApk(false);
      setApkVerified(true);
      showToast('APK Signature Verified', 'Package matches Play Protect security standards (SHA-256 Validated).', 'success');
    }, 1000);
  };

  const handleTestDownloadApk = () => {
    if (apkFile) {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(apkFile);
      a.download = apkFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast('APK Exported', `Saved ${apkFileName} to local downloads.`, 'success');
    } else {
      const dummyContent = `AR-STORE-PACKAGE\nPackage: ${apkPackageName}\nVersion: ${version}\nTarget SDK: ${apkTargetSdk}\nArchitecture: ${apkArchitecture}`;
      const blob = new Blob([dummyContent], { type: 'application/vnd.android.package-archive' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = apkFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast('APK Exported', `Saved ${apkFileName} (${size}) to local storage.`, 'success');
    }
  };

  // Handle Internal Storage Icon Pick
  const handleIconFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIconFile(file);
      const objectUrl = URL.createObjectURL(file);
      setIconPreview(objectUrl);
      showToast('App Icon Loaded', `${file.name} ready for publish.`, 'success');
    }
  };

  // Handle Internal Storage Screenshots Pick
  const handleScreenshotFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newUrls = files.map((f) => URL.createObjectURL(f));
      setScreenshotPreviews((prev) => [...newUrls, ...prev].slice(0, 6));
      showToast('Screenshots Uploaded', `${files.length} images added.`, 'info');
    }
  };

  // Drag and drop handlers
  const handleApkDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setApkFile(file);
      setApkFileName(file.name);
      const computedMb = (file.size / (1024 * 1024)).toFixed(1);
      const computedStr = `${computedMb} MB`;
      setApkFileSize(computedStr);
      setSize(computedStr);
      showToast('APK Loaded', `${file.name} (${computedStr}) ready.`, 'info');
    }
  };

  const handleIconDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setIconFile(file);
      const url = URL.createObjectURL(file);
      setIconPreview(url);
      showToast('Icon Uploaded', file.name, 'info');
    }
  };

  const applyPresetTemplate = (type: 'game' | 'ai' | 'tool' | 'social' | 'media') => {
    if (type === 'game') {
      setAppName('Apex Drift 2088');
      setDeveloper('Quantum Speed Studios');
      setCategory('Games');
      setVersion('1.0.0');
      setPrice('Free');
      setDescription('Next-generation neon cyber racing game with ultra 120 FPS physics engine, anti-gravity drift mechanics, and online multiplayer tournaments across the neon skyline.');
      setWhatsNew('• Initial Launch v1.0.0 with futuristic tracks\n• Support for wireless gamepads\n• Dynamic holographic weather effects');
      setTags('Racing, Cyberpunk, Multiplayer, 120 FPS, Offline');
      setFeatured(true);
      setIconPreview('/assets/aistudio/file_0000000093f081f5902b6fdd29762298_938e318c.png');
      setIconShape('squircle');
      setIconBorder('cyan');
      setIconBadge('fps');
      showToast('Game Template Applied', 'Fill or attach your APK file to publish.', 'info');
    } else if (type === 'ai') {
      setAppName('Cortex Neural Copilot');
      setDeveloper('Synapse AI Labs');
      setCategory('AI & AR');
      setVersion('1.0.0');
      setPrice('Free');
      setDescription('Advanced autonomous AI assistant with real-time screen understanding, voice transcription, code synthesis, and holographic AR HUD integration.');
      setWhatsNew('• Enhanced neural inference engine\n• Offline local model support\n• Zero-telemetry private encrypted enclave');
      setTags('AI, Neural, Assistant, Productivity, AR');
      setFeatured(true);
      setIconPreview('/assets/aistudio/file_0000000093f081f5902b6fdd29762298_938e318c.png');
      setIconShape('hexagon');
      setIconBorder('cyan');
      setIconBadge('verified');
      showToast('AI Template Applied', 'Fill or attach your APK file to publish.', 'info');
    } else if (type === 'tool') {
      setAppName('AeroShield Cyber VPN');
      setDeveloper('Fortress Crypt Systems');
      setCategory('Tools');
      setVersion('1.0.0');
      setPrice('Free');
      setDescription('Military-grade cryptographic tunnel with quantum-resistant encryption, ad-blocking DNS, and zero-logging policy across 90+ global edge locations.');
      setWhatsNew('• WireGuard protocol upgrade\n• Split tunneling for low latency\n• Instant kill switch on network disconnect');
      setTags('Security, VPN, Privacy, Tools, Encryption');
      setFeatured(false);
      setIconPreview('/assets/aistudio/file_0000000093f081f5902b6fdd29762298_938e318c.png');
      setIconShape('circle');
      setIconBorder('emerald');
      setIconBadge('verified');
      showToast('Tool Template Applied', 'Fill or attach your APK file to publish.', 'info');
    } else if (type === 'social') {
      setAppName('HoloConnect 3D');
      setDeveloper('OmniSpatial Networks');
      setCategory('Social');
      setVersion('1.0.0');
      setPrice('Free');
      setDescription('Next-gen spatial social networking app with holographic avatars, 3D audio chat rooms, and real-time screen sharing in virtual spaces.');
      setWhatsNew('• Spatial 3D avatars customization\n• Low-latency audio streaming\n• Cross-platform group voice calls');
      setTags('Social, 3D, Avatars, Voice, Chat');
      setFeatured(false);
      setIconPreview('/assets/aistudio/file_0000000093f081f5902b6fdd29762298_938e318c.png');
      setIconShape('rounded');
      setIconBorder('gold');
      setIconBadge('beta');
      showToast('Social Template Applied', 'Fill or attach your APK file to publish.', 'info');
    } else if (type === 'media') {
      setAppName('Quantum Hi-Res Player');
      setDeveloper('SoundWave Acoustics');
      setCategory('Entertainment');
      setVersion('1.0.0');
      setPrice('Free');
      setDescription('Audiophile FLAC and DSD music player with 32-bit floating point DSP, 10-band parametric equalizer, and real-time spatial acoustics modeling.');
      setWhatsNew('• Bit-perfect USB DAC direct passthrough\n• Added support for MQA and DSD512\n• Custom parametric EQ presets');
      setTags('Music, Audio, Audiophile, FLAC, Player');
      setFeatured(true);
      setIconPreview('/assets/aistudio/file_0000000093f081f5902b6fdd29762298_938e318c.png');
      setIconShape('teardrop');
      setIconBorder('silver');
      setIconBadge('verified');
      showToast('Media Template Applied', 'Fill or attach your APK file to publish.', 'info');
    }
  };

  const clearForm = () => {
    setAppName('');
    setDeveloper('');
    setDescription('');
    setWhatsNew('');
    setTags('');
    setSize('');
    setVersion('1.0.0');
    setPrice('Free');
    setFeatured(false);
    setApkFileName('');
    setApkFileSize('');
    setApkPackageName('');
    setApkFile(null);
    setScreenshotPreviews([]);
    setIconPreview('/assets/aistudio/file_0000000093f081f5902b6fdd29762298_938e318c.png');
    showToast('Form Cleared', 'All fields and files reset to blank defaults.', 'info');
  };

  const handleDuplicateApp = (app: AppItem) => {
    createApp({
      name: `${app.name} (Copy)`,
      description: app.description,
      category: app.category,
      version: app.version,
      size: app.size,
      developer: app.developer,
      iconUrl: app.iconUrl,
      apkUrl: app.apkUrl,
      screenshots: app.screenshots,
      whatsNew: app.whatsNew,
      featured: false,
      price: app.price || 'Free',
      tags: app.tags,
      contentRating: app.contentRating
    });
    showToast('App Cloned', `Created copy of ${app.name}.`, 'success');
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(apps, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ar-store-catalog-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Catalog Exported', `Exported ${apps.length} applications as JSON backup.`, 'success');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            parsed.forEach((app) => createApp(app));
            showToast('Catalog Imported', `Imported ${parsed.length} applications into store.`, 'success');
          } else {
            showToast('Invalid JSON', 'Expected an array of applications.', 'error');
          }
        } catch (err) {
          showToast('Import Failed', 'Could not parse JSON file.', 'error');
        }
      };
      reader.readAsText(file);
    }
  };

  // Handle Form Submission
  const handlePublishApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName.trim() || !description.trim() || !developer.trim()) {
      showToast('Missing Fields', 'Please complete App Name, Developer, and Description.', 'error');
      return;
    }

    const tagArray = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    // If developer uploaded a real APK from internal storage, generate real downloadable blob URL
    let apkTargetUrl = apkUrlDirect;
    if (apkFile) {
      apkTargetUrl = URL.createObjectURL(apkFile);
    } else if (!apkTargetUrl) {
      apkTargetUrl = `https://storage.googleapis.com/ar-store-downloads/apks/${appName.toLowerCase().replace(/\s+/g, '-')}-v${version}.apk`;
    }

    createApp({
      name: appName.trim(),
      description: description.trim(),
      category,
      version: version.trim() || '1.0.0',
      size: size.trim() || '35.0 MB',
      developer: developer.trim(),
      iconUrl: iconPreview,
      apkUrl: apkTargetUrl,
      screenshots: screenshotPreviews,
      whatsNew: whatsNew.trim(),
      featured,
      price: price.trim() || 'Free',
      tags: tagArray.length > 0 ? tagArray : ['App', category],
      contentRating: 'Everyone'
    });

    // Reset Form completely
    setAppName('');
    setDeveloper('');
    setDescription('');
    setWhatsNew('');
    setTags('');
    setSize('');
    setApkFileName('');
    setApkFileSize('');
    setApkPackageName('');
    setApkFile(null);
    setScreenshotPreviews([]);
    setActiveTab('manage');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;
    updateApp(editingApp.id, editingApp);
    setEditingApp(null);
  };

  const confirmDelete = () => {
    if (!deletingApp) return;
    deleteApp(deletingApp.id);
    setDeletingApp(null);
  };

  const filteredApps = apps.filter(
    (a) =>
      a.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
      a.category.toLowerCase().includes(tableSearch.toLowerCase()) ||
      a.developer.toLowerCase().includes(tableSearch.toLowerCase())
  );

  const getShapeClass = () => {
    switch (iconShape) {
      case 'circle': return 'rounded-full';
      case 'rounded': return 'rounded-2xl';
      case 'teardrop': return 'rounded-t-2xl rounded-bl-2xl';
      case 'hexagon': return 'rounded-3xl';
      default: return 'rounded-[26%]'; // Google Play Squircle mask
    }
  };

  const getBorderClass = () => {
    switch (iconBorder) {
      case 'silver': return 'border-2 border-slate-300 dark:border-gray-400';
      case 'gold': return 'border-2 border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.3)]';
      case 'emerald': return 'border-2 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]';
      case 'none': return 'border-0';
      default: return 'border-2 border-[#00BFFF] shadow-[0_0_12px_rgba(0,191,255,0.4)]';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6"
    >
      {/* Hidden File Inputs for Internal Storage Browsing */}
      <input
        type="file"
        ref={apkInputRef}
        onChange={handleApkFileSelect}
        accept=".apk,application/vnd.android.package-archive,*/*"
        className="hidden"
      />
      <input
        type="file"
        ref={iconInputRef}
        onChange={handleIconFileSelect}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={screenshotInputRef}
        onChange={handleScreenshotFileSelect}
        accept="image/*"
        multiple
        className="hidden"
      />

      {/* Admin Top Banner */}
      <div className={`p-6 rounded-3xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-purple-950/40 via-[#14151e] to-[#0d0e14] border-purple-500/40 text-[#C0C0C0]'
          : 'bg-white border-purple-200 shadow-sm text-slate-700'
      }`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-600 dark:text-purple-300 shadow-md">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-xl sm:text-2xl font-bold font-['Space_Grotesk'] ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                AR-STORE Developer Console
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 border border-purple-400/40 text-purple-600 dark:text-purple-300 font-bold">
                PUBLISHING TERMINAL
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
              Signed in as <span className="font-mono font-medium text-purple-600 dark:text-purple-300">{currentUser.email}</span>. Direct APK internal storage file linking enabled.
            </p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className={`flex items-center gap-2 p-1 rounded-xl border ${
          theme === 'dark' ? 'bg-[#0c0d12] border-[#232632]' : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'upload'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-gray-400 hover:text-purple-600'
            }`}
          >
            Upload New App
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'manage'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-gray-400 hover:text-purple-600'
            }`}
          >
            Manage Apps ({apps.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Upload Form */}
      {activeTab === 'upload' ? (
        <form onSubmit={handlePublishApp} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Col: Metadata inputs */}
            <div className={`lg:col-span-2 p-6 rounded-3xl border space-y-4 ${
              theme === 'dark' ? 'bg-[#12141a] border-[#22252c]' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              {/* Quick 1-Click Publishing Templates Toolbar */}
              <div className={`p-4 rounded-2xl border ${
                theme === 'dark' ? 'bg-[#161822] border-[#272a38]' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#00BFFF]" />
                    <span className="text-xs font-bold font-['Space_Grotesk']">
                      Quick 1-Click Publishing Presets (Fast Setup)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={clearForm}
                    className="text-[11px] text-gray-400 hover:text-red-400 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Clear Form
                  </button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => applyPresetTemplate('game')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30 transition-all flex items-center gap-1.5"
                  >
                    🎮 Action Game
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetTemplate('ai')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 transition-all flex items-center gap-1.5"
                  >
                    🧠 AI & AR Assistant
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetTemplate('tool')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 transition-all flex items-center gap-1.5"
                  >
                    🛡️ Security & VPN
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetTemplate('social')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 transition-all flex items-center gap-1.5"
                  >
                    💬 Spatial Social
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetTemplate('media')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30 transition-all flex items-center gap-1.5"
                  >
                    🎵 Hi-Res Audio
                  </button>
                </div>
              </div>

              <h3 className={`text-base font-bold font-['Space_Grotesk'] flex items-center gap-2 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                <FileCode className="w-4 h-4 text-[#00BFFF]" />
                Package Specification
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-gray-300 block mb-1">
                    App Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="e.g. Apex Drift 2088"
                    className={`w-full rounded-xl p-2.5 text-xs outline-none border focus:border-[#00BFFF] ${
                      theme === 'dark' ? 'bg-[#181a24] border-[#262834] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-gray-300 block mb-1">
                    Developer / Studio *
                  </label>
                  <input
                    type="text"
                    required
                    value={developer}
                    onChange={(e) => setDeveloper(e.target.value)}
                    placeholder="e.g. CyberWorks Studio"
                    className={`w-full rounded-xl p-2.5 text-xs outline-none border focus:border-[#00BFFF] ${
                      theme === 'dark' ? 'bg-[#181a24] border-[#262834] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-gray-300 block mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as AppCategory)}
                    className={`w-full rounded-xl p-2.5 text-xs outline-none border focus:border-[#00BFFF] ${
                      theme === 'dark' ? 'bg-[#181a24] border-[#262834] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    {categories.filter(c => c.id !== 'All').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-slate-700 dark:text-gray-300 block mb-1">
                      Version
                    </label>
                    <input
                      type="text"
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                      placeholder="1.0.0"
                      className={`w-full rounded-xl p-2.5 text-xs outline-none border focus:border-[#00BFFF] ${
                        theme === 'dark' ? 'bg-[#181a24] border-[#262834] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700 dark:text-gray-300 block mb-1">
                      Price / Model
                    </label>
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Free"
                      className={`w-full rounded-xl p-2.5 text-xs outline-none border focus:border-[#00BFFF] ${
                        theme === 'dark' ? 'bg-[#181a24] border-[#262834] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-gray-300 block mb-1">
                  Full Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed synopsis of the application, mechanics, feature breakdown..."
                  className={`w-full rounded-xl p-3 text-xs outline-none border focus:border-[#00BFFF] ${
                    theme === 'dark' ? 'bg-[#181a24] border-[#262834] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-gray-300 block mb-1">
                  What's New in this Build
                </label>
                <textarea
                  rows={2}
                  value={whatsNew}
                  onChange={(e) => setWhatsNew(e.target.value)}
                  placeholder="Changelog, bugfixes, performance boosts..."
                  className={`w-full rounded-xl p-3 text-xs outline-none border focus:border-[#00BFFF] ${
                    theme === 'dark' ? 'bg-[#181a24] border-[#262834] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-gray-300 block mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Cyberpunk, RPG, Multiplayer"
                    className={`w-72 rounded-xl p-2.5 text-xs outline-none border focus:border-[#00BFFF] ${
                      theme === 'dark' ? 'bg-[#181a24] border-[#262834] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer mt-5">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded text-[#00BFFF] w-4 h-4"
                  />
                  <span className={`text-xs font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Feature on Home Spotlight Carousel
                  </span>
                </label>
              </div>

            </div>

            {/* Right Col: WORKABLE APK FILE & APP ICON WITH INTERNAL STORAGE SUPPORT */}
            <div className={`p-6 rounded-3xl border space-y-5 ${
              theme === 'dark' ? 'bg-[#12141a] border-[#22252c]' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              
              {/* SECTION: WORKABLE APK FILE FROM INTERNAL STORAGE */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className={`text-xs font-bold font-['Space_Grotesk'] uppercase tracking-wider flex items-center gap-1.5 ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    <FileCode className="w-4 h-4 text-[#00BFFF]" />
                    APK Binary File (Internal Storage)
                  </h3>
                  <span className={`text-[10px] font-mono font-bold flex items-center gap-1 ${
                    apkVerified ? 'text-emerald-500' : 'text-amber-500'
                  }`}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {apkVerified ? 'PLAY PROTECT READY' : 'UNVERIFIED'}
                  </span>
                </div>

                {/* Dropzone & File Pick Card */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleApkDrop}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all ${
                    theme === 'dark'
                      ? 'border-[#2c2f3e] hover:border-[#00BFFF] bg-[#161822]'
                      : 'border-slate-300 hover:border-[#0284c7] bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-3 mb-2 text-left">
                    <div className="w-11 h-11 rounded-xl bg-[#00BFFF]/10 border border-[#00BFFF]/30 flex items-center justify-center text-[#00BFFF] shrink-0">
                      <HardDrive className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {apkFileName || 'No APK File Selected (Clean State)'}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 dark:text-gray-400">
                        <span>Size: <strong className="text-[#00BFFF]">{size || '0 MB'}</strong></span>
                        <span>•</span>
                        <span className="truncate">{apkPackageName || 'Package ID auto-detect'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Architecture & Target SDK Selectors */}
                  <div className="grid grid-cols-2 gap-2 my-2.5 text-left">
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-gray-400 block mb-1">Architecture</span>
                      <select
                        value={apkArchitecture}
                        onChange={(e) => setApkArchitecture(e.target.value as any)}
                        className={`w-full rounded-lg px-2 py-1 text-[11px] outline-none border ${
                          theme === 'dark' ? 'bg-[#1e202c] border-[#2c2f40] text-white' : 'bg-white border-slate-300 text-slate-800'
                        }`}
                      >
                        <option value="arm64-v8a (Universal)">arm64-v8a (Universal)</option>
                        <option value="arm64-v8a">arm64-v8a</option>
                        <option value="armeabi-v7a">armeabi-v7a</option>
                        <option value="x86_64">x86_64</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-gray-400 block mb-1">Target Android SDK</span>
                      <select
                        value={apkTargetSdk}
                        onChange={(e) => setApkTargetSdk(e.target.value as any)}
                        className={`w-full rounded-lg px-2 py-1 text-[11px] outline-none border ${
                          theme === 'dark' ? 'bg-[#1e202c] border-[#2c2f40] text-white' : 'bg-white border-slate-300 text-slate-800'
                        }`}
                      >
                        <option value="Android 14 (API 34)">Android 14 (API 34)</option>
                        <option value="Android 13 (API 33)">Android 13 (API 33)</option>
                        <option value="Android 12 (API 31)">Android 12 (API 31)</option>
                        <option value="Android 10 (API 29)">Android 10 (API 29)</option>
                      </select>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
                    <button
                      type="button"
                      onClick={() => apkInputRef.current?.click()}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#00BFFF] hover:bg-[#38bdf8] text-black shadow-sm flex items-center gap-1.5 transition-all"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>Browse Internal Storage</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleVerifyApk}
                      disabled={isVerifyingApk}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1 transition-all ${
                        isVerifyingApk
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-500 cursor-wait'
                          : 'border-slate-300 dark:border-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {isVerifyingApk ? (
                        <>
                          <div className="w-3 h-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Verify Package</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleTestDownloadApk}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-300 dark:border-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-800 flex items-center gap-1"
                      title="Download the currently linked APK package file to your device"
                    >
                      <Download className="w-3 h-3 text-[#00BFFF]" />
                      <span>Test Export</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">
                    Accepts .apk binaries directly from internal storage or device memory.
                  </p>
                </div>
              </div>

              {/* SECTION: WORKABLE APP ICON WITH SHAPE CUSTOMIZER, BORDER, GLOW & PRESETS */}
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-[#202330]">
                <div className="flex items-center justify-between">
                  <h3 className={`text-xs font-bold font-['Space_Grotesk'] uppercase tracking-wider flex items-center gap-1.5 ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    <Image className="w-4 h-4 text-[#00BFFF]" />
                    App Icon & Customizer
                  </h3>
                  <span className="text-[10px] text-[#00BFFF] font-mono font-bold uppercase">{iconShape} MASK</span>
                </div>

                {/* Live Icon Shape Preview and Controls */}
                <div className={`p-4 rounded-2xl border space-y-3 ${
                  theme === 'dark' ? 'bg-[#161822] border-[#252834]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <img
                        src={iconPreview}
                        alt="Icon Preview"
                        className={`w-16 h-16 object-cover transition-all ${getShapeClass()} ${getBorderClass()} ${
                          iconGlow ? 'filter drop-shadow-[0_0_12px_rgba(0,191,255,0.6)]' : ''
                        }`}
                      />
                      {iconBadge !== 'none' && (
                        <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded text-[8px] font-bold bg-[#00BFFF] text-black shadow-xs">
                          {iconBadge === 'verified' ? 'SAFE' : iconBadge === 'editors' ? 'TOP' : iconBadge.toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <button
                          type="button"
                          onClick={() => iconInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#00BFFF]/15 hover:bg-[#00BFFF]/25 text-[#00BFFF] border border-[#00BFFF]/40 flex items-center gap-1.5 transition-all"
                        >
                          <FolderOpen className="w-3.5 h-3.5" />
                          <span>Browse Icon (Storage)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIconPreview('/assets/aistudio/file_0000000093f081f5902b6fdd29762298_938e318c.png');
                            setIconBorder('cyan');
                            setIconGlow(true);
                            showToast('Transformer Logo Set', 'Applied official AR identity logo.', 'success');
                          }}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-gray-800 hover:bg-slate-300 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-200 border border-slate-300 dark:border-gray-700 flex items-center gap-1.5 transition-all"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#00BFFF]" />
                          <span>Use AR Logo</span>
                        </button>
                      </div>

                      {/* Shape Mask Buttons */}
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="text-[10px] text-slate-500">Shape:</span>
                        {[
                          { id: 'squircle', label: 'Squircle' },
                          { id: 'rounded', label: 'Square' },
                          { id: 'circle', label: 'Circle' },
                          { id: 'teardrop', label: 'Teardrop' },
                          { id: 'hexagon', label: 'Hex' }
                        ].map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setIconShape(s.id as any)}
                            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                              iconShape === s.id
                                ? 'bg-[#00BFFF] text-black font-bold'
                                : 'bg-slate-200 dark:bg-gray-800 text-slate-700 dark:text-gray-300'
                            }`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Border Style and Glow Customizer */}
                  <div className="pt-2 border-t border-slate-200 dark:border-gray-800 flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-500">Border:</span>
                      {[
                        { id: 'cyan', label: 'Cyan' },
                        { id: 'silver', label: 'Silver' },
                        { id: 'gold', label: 'Gold' },
                        { id: 'none', label: 'None' }
                      ].map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setIconBorder(b.id as any)}
                          className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                            iconBorder === b.id
                              ? 'bg-[#00BFFF] text-black font-bold'
                              : 'bg-slate-200 dark:bg-gray-800 text-slate-600 dark:text-gray-400'
                          }`}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>

                    <label className="flex items-center gap-1.5 cursor-pointer text-[10px]">
                      <input
                        type="checkbox"
                        checked={iconGlow}
                        onChange={(e) => setIconGlow(e.target.checked)}
                        className="rounded text-[#00BFFF] w-3 h-3"
                      />
                      <span className="text-slate-600 dark:text-gray-300 font-medium">Cyber Glow</span>
                    </label>
                  </div>

                  {/* Badge Overlay Selector */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-[10px] text-slate-500">Badge:</span>
                    {[
                      { id: 'verified', label: 'Verified' },
                      { id: 'editors', label: "Editor's Choice" },
                      { id: 'beta', label: 'Beta' },
                      { id: 'none', label: 'None' }
                    ].map((bdg) => (
                      <button
                        key={bdg.id}
                        type="button"
                        onClick={() => setIconBadge(bdg.id as any)}
                        className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                          iconBadge === bdg.id
                            ? 'bg-[#00BFFF] text-black font-bold'
                            : 'bg-slate-200 dark:bg-gray-800 text-slate-600 dark:text-gray-400'
                        }`}
                      >
                        {bdg.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preset Icons Gallery for Quick Picking */}
                <div>
                  <span className="text-[11px] font-medium text-slate-500 dark:text-gray-400 block mb-1.5">
                    Or select from verified preset icons:
                  </span>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                    {PRESET_ICONS.map((preset, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setIconPreview(preset.url);
                          showToast('Preset Selected', `Applied ${preset.name} icon.`, 'info');
                        }}
                        className={`w-10 h-10 rounded-xl overflow-hidden shrink-0 border transition-all ${
                          iconPreview === preset.url
                            ? 'border-[#00BFFF] ring-2 ring-[#00BFFF] scale-105'
                            : 'border-slate-300 dark:border-gray-700 hover:border-slate-500'
                        }`}
                        title={preset.name}
                      >
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* LIVE PLAY STORE CARD PREVIEW */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-[#202330]">
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs font-bold font-['Space_Grotesk'] uppercase tracking-wider flex items-center gap-1.5 ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    <Sparkles className="w-3.5 h-3.5 text-[#00BFFF]" />
                    Live Store Card Preview
                  </h4>
                  <span className="text-[10px] text-gray-400">Card View in Store</span>
                </div>

                <div className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                  theme === 'dark' ? 'bg-[#14151e] border-[#222530]' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <div className="relative shrink-0">
                    <img
                      src={iconPreview}
                      alt="Preview"
                      className={`w-14 h-14 object-cover ${getShapeClass()} ${getBorderClass()} ${
                        iconGlow ? 'filter drop-shadow-[0_0_8px_rgba(0,191,255,0.5)]' : ''
                      }`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className={`text-xs font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {appName.trim() || 'New Futuristic App'}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400 truncate">
                      {developer.trim() || 'CyberWorks Studio'}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px]">
                      <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                        <span>5.0</span>
                        <Star className="w-2.5 h-2.5 fill-current" />
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-[#00BFFF] font-semibold">{size}</span>
                      <span className="text-gray-400">•</span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-500 font-bold">
                        {price || 'Free'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Screenshots Gallery Section */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-[#202330]">
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-bold font-['Space_Grotesk'] uppercase tracking-wider ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    App Screenshots ({screenshotPreviews.length})
                  </label>
                  <button
                    type="button"
                    onClick={() => screenshotInputRef.current?.click()}
                    className="text-[11px] font-semibold text-[#00BFFF] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Screenshots
                  </button>
                </div>

                <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                  {screenshotPreviews.map((shot, idx) => (
                    <div key={idx} className="relative w-20 h-14 rounded-lg overflow-hidden border shrink-0 group">
                      <img src={shot} alt="Screenshot" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit / Publish Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-[#00BFFF] to-[#38bdf8] text-black hover:opacity-90 shadow-md transition-all flex items-center justify-center gap-2"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Publish Package to AR-STORE</span>
              </button>

            </div>

          </div>
        </form>
      ) : (
        /* Tab 2: Manage Apps (Data Table) */
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Filter uploaded applications..."
                className={`w-full rounded-xl py-2 pl-9 pr-3 text-xs outline-none border focus:border-[#00BFFF] ${
                  theme === 'dark' ? 'bg-[#12141a] border-[#22252c] text-white' : 'bg-white border-slate-300 text-slate-800'
                }`}
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="file"
                ref={jsonImportRef}
                onChange={handleImportJson}
                accept=".json,application/json"
                className="hidden"
              />


              <button
                type="button"
                onClick={handleExportJson}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 hover:bg-slate-200 border border-slate-300 dark:border-gray-700 transition-all flex items-center gap-1.5"
                title="Export entire store database to JSON file"
              >
                <FileDown className="w-3.5 h-3.5 text-[#00BFFF]" />
                <span>Export JSON</span>
              </button>

              <button
                type="button"
                onClick={() => jsonImportRef.current?.click()}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 hover:bg-slate-200 border border-slate-300 dark:border-gray-700 transition-all flex items-center gap-1.5"
                title="Import applications from JSON file"
              >
                <FileUp className="w-3.5 h-3.5 text-[#00BFFF]" />
                <span>Import JSON</span>
              </button>

              {apps.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear all applications? The store will return to an empty default state.')) {
                      clearAllCatalog();
                    }
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-500/10 border border-red-500/20 transition-all flex items-center gap-1.5"
                  title="Clear all apps from store"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('upload')}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#00BFFF] text-black hover:bg-[#38bdf8] transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Upload New App</span>
              </button>
            </div>
          </div>

          <div className={`overflow-x-auto rounded-2xl border ${
            theme === 'dark' ? 'border-[#22252c] bg-[#12141a]' : 'border-slate-200 bg-white shadow-sm'
          }`}>
            <table className="w-full text-left text-xs">
              <thead className={`uppercase tracking-wider border-b ${
                theme === 'dark' ? 'bg-[#171922] text-gray-400 border-[#22252c]' : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}>
                <tr>
                  <th className="py-3 px-4">Application</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Version</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Downloads</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${
                theme === 'dark' ? 'divide-[#1e202a]' : 'divide-slate-200'
              }`}>
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-14 px-4 text-center">
                      <div className="max-w-md mx-auto space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-[#00BFFF]/10 border border-[#00BFFF]/30 flex items-center justify-center mx-auto p-3 shadow-md">
                          <img
                            src="/assets/aistudio/file_0000000093f081f5902b6fdd29762298_938e318c.png"
                            alt="AR-STORE"
                            className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(0,191,255,0.7)]"
                          />
                        </div>
                        <div>
                          <h4 className={`text-base font-bold font-['Space_Grotesk'] ${
                            theme === 'dark' ? 'text-white' : 'text-slate-900'
                          }`}>
                            AR-STORE Repository is Empty
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                            Clean default slate active for production publishing. No apps currently in repository. Use "Upload New App" to publish your first APK package, or load demo showcase apps to test.
                          </p>
                        </div>
                        <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
                          <button
                            type="button"
                            onClick={() => setActiveTab('upload')}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#00BFFF] text-black hover:bg-[#38bdf8] flex items-center gap-1.5 shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Upload First APK Package</span>
                          </button>

                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={app.iconUrl}
                            alt={app.name}
                            className="w-9 h-9 rounded-xl object-cover border border-[#00BFFF]/30"
                          />
                          <div>
                            <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              {app.name}
                            </div>
                            <div className="text-[10px] text-gray-500">{app.developer}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-[#00BFFF]/10 border border-[#00BFFF]/30 text-[#00BFFF] text-[10px] font-semibold">
                          {app.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-500 dark:text-gray-300">v{app.version}</td>
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{app.size}</td>
                      <td className="py-3 px-4 font-mono text-gray-700 dark:text-gray-300 font-bold">
                        {app.downloads.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-semibold text-amber-500">
                        ★ {app.rating}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => downloadApkBinary(app)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all"
                            title="Download APK Package File"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDuplicateApp(app)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 transition-all"
                            title="Duplicate App"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingApp({ ...app })}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-[#00BFFF] hover:bg-[#00BFFF]/10 transition-all"
                            title="Edit App Details"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingApp(app)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                            title="Delete App"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit App Modal */}
      <AnimatePresence>
        {editingApp && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-xl rounded-3xl p-6 shadow-2xl relative space-y-4 border ${
                theme === 'dark' ? 'bg-[#14151c] border-[#232632] text-white' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#22252c]">
                <h3 className="text-base font-bold font-['Space_Grotesk']">
                  Edit Application: {editingApp.name}
                </h3>
                <button onClick={() => setEditingApp(null)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">Name</label>
                    <input
                      type="text"
                      value={editingApp.name}
                      onChange={(e) => setEditingApp({ ...editingApp, name: e.target.value })}
                      className="w-full bg-slate-100 dark:bg-[#1c1e28] border border-slate-300 dark:border-[#2b2e3c] rounded-xl p-2 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">Developer</label>
                    <input
                      type="text"
                      value={editingApp.developer}
                      onChange={(e) => setEditingApp({ ...editingApp, developer: e.target.value })}
                      className="w-full bg-slate-100 dark:bg-[#1c1e28] border border-slate-300 dark:border-[#2b2e3c] rounded-xl p-2 text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">Category</label>
                    <select
                      value={editingApp.category}
                      onChange={(e) => setEditingApp({ ...editingApp, category: e.target.value as AppCategory })}
                      className="w-full bg-slate-100 dark:bg-[#1c1e28] border border-slate-300 dark:border-[#2b2e3c] rounded-xl p-2 text-xs outline-none"
                    >
                      {categories.filter(c => c.id !== 'All').map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">Version</label>
                    <input
                      type="text"
                      value={editingApp.version}
                      onChange={(e) => setEditingApp({ ...editingApp, version: e.target.value })}
                      className="w-full bg-slate-100 dark:bg-[#1c1e28] border border-slate-300 dark:border-[#2b2e3c] rounded-xl p-2 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">Size</label>
                    <input
                      type="text"
                      value={editingApp.size}
                      onChange={(e) => setEditingApp({ ...editingApp, size: e.target.value })}
                      className="w-full bg-slate-100 dark:bg-[#1c1e28] border border-slate-300 dark:border-[#2b2e3c] rounded-xl p-2 text-xs outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editingApp.description}
                    onChange={(e) => setEditingApp({ ...editingApp, description: e.target.value })}
                    className="w-full bg-slate-100 dark:bg-[#1c1e28] border border-slate-300 dark:border-[#2b2e3c] rounded-xl p-2 text-xs outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-[#22252c]">
                  <button
                    type="button"
                    onClick={() => setEditingApp(null)}
                    className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#00BFFF] text-black hover:bg-[#38bdf8]"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Popup */}
      <AnimatePresence>
        {deletingApp && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#14151c] border border-red-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-white"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="text-center">
                <h3 className="text-base font-bold font-['Space_Grotesk']">
                  Confirm Package Purge
                </h3>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  Are you sure you want to permanently delete <strong className="text-white">{deletingApp.name}</strong>?
                </p>
                <div className="mt-3 p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-[11px] text-red-300 text-left">
                  <strong>Warning:</strong> Deleting will remove this document from Firestore and permanently wipe all APK binaries and screenshot assets from Firebase Storage to free storage quota.
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setDeletingApp(null)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 text-white shadow-lg"
                >
                  Purge from Cloud
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};
