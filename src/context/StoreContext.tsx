import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppItem, Review, UserProfile, StoreNotification, AppCategory, StoreTheme, StoreSettings } from '../types/store';
import { INITIAL_APPS, INITIAL_REVIEWS, DEMO_STARTER_APPS, DEMO_STARTER_REVIEWS, CATEGORIES } from '../data/initialApps';
import { isUserAdmin } from '../services/firebaseConfig';
import confetti from 'canvas-confetti';

interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface InstallProgressState {
  progress: number;
  status: 'idle' | 'downloading' | 'installing' | 'completed';
}

interface StoreContextType {
  apps: AppItem[];
  reviews: Review[];
  categories: typeof CATEGORIES;
  currentUser: UserProfile;
  selectedApp: AppItem | null;
  setSelectedApp: (app: AppItem | null) => void;
  launchedApp: AppItem | null;
  setLaunchedApp: (app: AppItem | null) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchHistory: string[];
  addSearchHistory: (term: string) => void;
  removeSearchHistory: (term: string) => void;
  clearSearchHistory: () => void;
  currentTab: 'home' | 'games' | 'apps' | 'search' | 'my-apps' | 'admin' | 'settings';
  setCurrentTab: (tab: 'home' | 'games' | 'apps' | 'search' | 'my-apps' | 'admin' | 'settings') => void;
  theme: StoreTheme;
  setTheme: (theme: StoreTheme) => void;
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  resetToFactoryDefaults: () => void;
  installingState: { [appId: string]: InstallProgressState };
  installApp: (appId: string) => Promise<void>;
  downloadApkBinary: (app: AppItem) => void;
  uninstallApp: (appId: string) => void;
  isAppInstalled: (appId: string) => boolean;
  toggleWishlist: (appId: string) => void;
  isWishlisted: (appId: string) => boolean;
  addReview: (appId: string, rating: number, comment: string) => void;
  createApp: (appData: Omit<AppItem, 'id' | 'downloads' | 'rating' | 'ratingCount' | 'createdAt'>) => AppItem;
  updateApp: (appId: string, appData: Partial<AppItem>) => void;
  deleteApp: (appId: string) => void;
  switchUserRole: (role: 'admin' | 'user') => void;
  notifications: StoreNotification[];
  unreadNotificationCount: number;
  markNotificationsAsRead: () => void;
  isScanningProtect: boolean;
  lastScanTime: string;
  runPlayProtectScan: () => Promise<void>;
  redeemPoints: (amount: number, rewardTitle: string) => boolean;
  toasts: ToastItem[];
  removeToast: (id: string) => void;
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'error') => void;
  isInitialLoading: boolean;
  showSplash: boolean;
  setShowSplash: (show: boolean) => void;
  triggerStartupAnimation: () => void;
  loadSampleCatalog: () => void;
  clearAllCatalog: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const MOCK_APP_IDS = new Set([
  'cyberblade-2088',
  'neuralos-assistant',
  'holonet-matrix',
  'synapse-mindflow',
  'quantumpay-vault',
  'soundwave-studio',
  'void-chasm-survival',
  'hologram-fit-ar'
]);

// Clean legacy localStorage keys from prior test sessions
try {
  [
    'arstore_apps_v1',
    'arstore_apps_v2',
    'arstore_apps_v3',
    'ar_store_apps_v2',
    'arstore_reviews_v1',
    'arstore_reviews_v2',
    'arstore_reviews_v3'
  ].forEach((k) => localStorage.removeItem(k));
} catch {}

const STORAGE_KEYS = {
  THEME: 'arstore_theme_pub_v4',
  SETTINGS: 'arstore_settings_pub_v4',
  APPS: 'arstore_apps_pub_v4',
  REVIEWS: 'arstore_reviews_pub_v4',
  USER: 'arstore_current_user_pub_v4',
  HISTORY: 'arstore_search_history_pub_v4',
  NOTIFICATIONS: 'arstore_notifications_pub_v4',
  PROTECT_SCAN: 'arstore_last_scan_pub_v4'
};

const DEFAULT_SETTINGS: StoreSettings = {
  theme: 'light', // WHITE THEME IS DEFAULT AS REQUESTED
  downloadNetwork: 'any',
  autoUpdate: true,
  biometricVerification: true,
  parentalControls: false,
  soundEffects: true,
  show120FpsIndicator: true,
};

const DEFAULT_ADMIN: UserProfile = {
  uid: 'usr_admin_01',
  email: 'admin@arstore.com',
  displayName: 'Optimus Prime (Admin)',
  role: 'admin',
  photoUrl: '/assets/aistudio/file_0000000093f081f5902b6fdd29762298_938e318c.png',
  downloadsHistory: [],
  wishlist: [],
  cyberPoints: 0,
  pointsTier: 'Bronze',
  installedApps: {}
};

const DEFAULT_USER: UserProfile = {
  uid: 'usr_regular_02',
  email: 'riasatkhan032@gmail.com',
  displayName: 'CyberPilot_X',
  role: 'user',
  photoUrl: '/assets/aistudio/file_0000000093f081f5902b6fdd29762298_938e318c.png',
  downloadsHistory: [],
  wishlist: [],
  cyberPoints: 0,
  pointsTier: 'Bronze',
  installedApps: {}
};

const INITIAL_NOTIFICATIONS: StoreNotification[] = [
  {
    id: 'notif-1',
    title: 'AR-STORE Ready for Publishing',
    message: 'Welcome to AR-STORE! Clean default state active with zero pre-existing apps or files.',
    time: 'Just now',
    read: false,
    type: 'security'
  }
];

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state: WHITE THEME IS DEFAULT PER USER INSTRUCTION
  const [theme, setThemeState] = useState<StoreTheme>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      return (saved === 'dark' || saved === 'light') ? saved : 'light';
    } catch {
      return 'light'; // Default to white
    }
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [apps, setApps] = useState<AppItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((a) => a && a.id && !MOCK_APP_IDS.has(a.id));
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((r) => r && r.appId && !MOCK_APP_IDS.has(r.appId));
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : DEFAULT_ADMIN;
    } catch {
      return DEFAULT_ADMIN;
    }
  });

  const [notifications, setNotifications] = useState<StoreNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [lastScanTime, setLastScanTime] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.PROTECT_SCAN) || 'Today at 04:15 AM';
  });

  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
  const [launchedApp, setLaunchedApp] = useState<AppItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentTab, setCurrentTab] = useState<'home' | 'games' | 'apps' | 'search' | 'my-apps' | 'admin' | 'settings'>('home');
  const [installingState, setInstallingState] = useState<{ [appId: string]: InstallProgressState }>({});
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isScanningProtect, setIsScanningProtect] = useState<boolean>(false);
  const [showSplash, setShowSplash] = useState<boolean>(true);

  const triggerStartupAnimation = () => {
    setShowSplash(true);
    showToast('Replaying Startup', 'Rebooting AR-STORE loading sequence...', 'info');
  };

  // Sync theme attribute to document html root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  const setTheme = (newTheme: StoreTheme) => {
    setThemeState(newTheme);
    setSettings((prev) => ({ ...prev, theme: newTheme }));
  };

  const updateSettings = (newPartial: Partial<StoreSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newPartial };
      if (newPartial.theme) {
        setThemeState(newPartial.theme);
      }
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    showToast('Settings Saved', 'Preferences updated successfully.', 'success');
  };

  const resetToFactoryDefaults = () => {
    setApps([]);
    setReviews([]);
    setCurrentUser(DEFAULT_ADMIN);
    setTheme('light'); // White default per user request
    setSettings(DEFAULT_SETTINGS);
    setSearchHistory([]);
    try {
      localStorage.clear();
      localStorage.setItem(STORAGE_KEYS.THEME, 'light');
      localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify([]));
    } catch (e) {
      console.error(e);
    }
    showToast('Factory Defaults Restored', 'Store cleaned to pristine default. White theme enabled.', 'info');
  };

  const loadSampleCatalog = () => {
    setApps([]);
    setReviews([]);
    try {
      localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify([]));
    } catch (e) {
      console.error(e);
    }
    showToast('Clean Slate Active', 'Zero pre-seeded applications. Ready for your own apps.', 'info');
  };

  const clearAllCatalog = () => {
    setApps([]);
    setReviews([]);
    try {
      localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify([]));
    } catch (e) {
      console.error(e);
    }
    showToast('Catalog Cleared', 'All apps removed. Clean slate ready for production publishing.', 'info');
  };

  // Initial skeleton loader simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(apps));
    } catch (e) {
      console.error(e);
    }
  }, [apps]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    } catch (e) {
      console.error(e);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(searchHistory));
    } catch (e) {
      console.error(e);
    }
  }, [searchHistory]);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = 'toast_' + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const isAppInstalled = (appId: string): boolean => {
    return Boolean(currentUser.installedApps && currentUser.installedApps[appId]);
  };

  const isWishlisted = (appId: string): boolean => {
    return Boolean(currentUser.wishlist && currentUser.wishlist.includes(appId));
  };

  const toggleWishlist = (appId: string) => {
    const app = apps.find(a => a.id === appId);
    setCurrentUser(prev => {
      const currentList = prev.wishlist || [];
      const isAlreadyIn = currentList.includes(appId);
      const updated = isAlreadyIn
        ? currentList.filter(id => id !== appId)
        : [...currentList, appId];
      
      showToast(
        isAlreadyIn ? 'Removed from Wishlist' : 'Saved to Wishlist',
        `${app?.name || 'App'} ${isAlreadyIn ? 'was removed from' : 'was added to'} your wishlist.`,
        'info'
      );

      return {
        ...prev,
        wishlist: updated
      };
    });
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const runPlayProtectScan = async () => {
    setIsScanningProtect(true);
    showToast('Play Protect Initiated', 'Scanning device APKs and memory enclaves...', 'info');

    await new Promise(resolve => setTimeout(resolve, 2400));
    const nowStr = `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    setLastScanTime(nowStr);
    localStorage.setItem(STORAGE_KEYS.PROTECT_SCAN, nowStr);
    setIsScanningProtect(false);

    showToast('Scan Verified Safe', 'No malicious code or integrity violations found across all packages.', 'success');
  };

  const redeemPoints = (amount: number, rewardTitle: string): boolean => {
    if (currentUser.cyberPoints < amount) {
      showToast('Insufficient Cyber Points', `You need ${amount} points for this perk. (Current: ${currentUser.cyberPoints})`, 'error');
      return false;
    }

    setCurrentUser(prev => ({
      ...prev,
      cyberPoints: prev.cyberPoints - amount
    }));

    showToast('Perk Redeemed!', `You redeemed ${rewardTitle} for ${amount} Cyber Points.`, 'success');
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.7 }
    });
    return true;
  };

  // 3-Step Download Simulation & APK Trigger (per specification)
  const installApp = async (appId: string) => {
    const appToInstall = apps.find((a) => a.id === appId);
    if (!appToInstall) return;

    if (isAppInstalled(appId)) {
      setLaunchedApp(appToInstall);
      showToast('Launching Package', `Starting ${appToInstall.name} in Cyber Sandbox...`, 'info');
      return;
    }

    setInstallingState((prev) => ({
      ...prev,
      [appId]: { progress: 0, status: 'downloading' }
    }));

    const durationMs = 3000;
    const intervalMs = 60;
    const stepIncrement = 100 / (durationMs / intervalMs);

    let currentProgress = 0;

    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        currentProgress += stepIncrement;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
          setInstallingState((prev) => ({
            ...prev,
            [appId]: { progress: 100, status: 'installing' }
          }));

          // Trigger simulated actual APK File Download via Blob or direct linked URL
          try {
            if (appToInstall.apkUrl && appToInstall.apkUrl.startsWith('blob:')) {
              // Direct browser download of developer-uploaded APK
              const a = document.createElement('a');
              a.href = appToInstall.apkUrl;
              a.download = `${appToInstall.id}-v${appToInstall.version}.apk`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            } else {
              const fakeApkContent = `AR-STORE-BINARY-PACKAGE\nSignature: AUTHENTICATED_BY_TRANSFORMER_AR_CORE\nPackage: com.arstore.${appToInstall.id}\nVersion: ${appToInstall.version}\nSize: ${appToInstall.size}\nDeveloper: ${appToInstall.developer}\nChecksum: SHA256-${Math.random().toString(36).substring(2)}`;
              const blob = new Blob([fakeApkContent], { type: 'application/vnd.android.package-archive' });
              const downloadUrl = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = downloadUrl;
              a.download = `${appToInstall.id}-v${appToInstall.version}.apk`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);
            }
          } catch (err) {
            console.error('Download trigger error:', err);
          }

          // Small pause for install wrap-up
          setTimeout(() => {
            setInstallingState((prev) => ({
              ...prev,
              [appId]: { progress: 100, status: 'completed' }
            }));

            // Update app downloads count
            setApps((prevApps) =>
              prevApps.map((item) =>
                item.id === appId ? { ...item, downloads: item.downloads + 1 } : item
              )
            );

            // Update user downloads history and add Cyber Points (+100 Points)
            setCurrentUser((prevUser) => {
              const updatedHistory = Array.from(new Set([...prevUser.downloadsHistory, appId]));
              const updatedInstalled = {
                ...prevUser.installedApps,
                [appId]: {
                  installedAt: new Date().toISOString(),
                  version: appToInstall.version
                }
              };
              const newPoints = prevUser.cyberPoints + 100;
              let newTier = prevUser.pointsTier;
              if (newPoints >= 3000) newTier = 'Diamond';
              else if (newPoints >= 2000) newTier = 'Platinum';
              else if (newPoints >= 1000) newTier = 'Gold';
              else if (newPoints >= 500) newTier = 'Silver';

              return {
                ...prevUser,
                downloadsHistory: updatedHistory,
                installedApps: updatedInstalled,
                cyberPoints: newPoints,
                pointsTier: newTier
              };
            });

            // Add notification
            setNotifications(prev => [
              {
                id: 'notif_' + Date.now(),
                title: 'Installation Complete (+100 Cyber Points)',
                message: `${appToInstall.name} installed successfully. You earned 100 Cyber Points!`,
                time: 'Just now',
                read: false,
                type: 'update',
                appId: appToInstall.id
              },
              ...prev
            ]);

            // Fire neon celebration confetti
            confetti({
              particleCount: 60,
              spread: 70,
              origin: { y: 0.8 },
              colors: ['#00BFFF', '#C0C0C0', '#ffffff', '#0077b6']
            });

            showToast(
              'Installation Successful (+100 Points)',
              `${appToInstall.name} (${appToInstall.version}) is ready to play.`,
              'success'
            );

            resolve();
          }, 400);
        } else {
          setInstallingState((prev) => ({
            ...prev,
            [appId]: { progress: Math.min(Math.round(currentProgress), 99), status: 'downloading' }
          }));
        }
      }, intervalMs);
    });
  };

  const downloadApkBinary = (app: AppItem) => {
    try {
      showToast('Initiating APK Download', `Saving ${app.name} (${app.size}) package...`, 'info');
      if (app.apkUrl && app.apkUrl.startsWith('blob:')) {
        const a = document.createElement('a');
        a.href = app.apkUrl;
        a.download = `${app.id}-v${app.version}.apk`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast('APK Saved', `${app.name} APK package saved to device storage.`, 'success');
      } else {
        const packageContent = `AR-STORE ANDROID APPLICATION PACKAGE (APK)\n==========================================\nPackage: com.arstore.${app.id}\nApplication: ${app.name}\nDeveloper: ${app.developer}\nVersion: ${app.version}\nBinary Size: ${app.size}\nTarget Architecture: arm64-v8a / Universal\nPlay Protect Signature: SHA256-AUTHENTICATED-AUTOBOT-AR\nStatus: Certified Safe\nTimestamp: ${new Date().toISOString()}`;
        const blob = new Blob([packageContent], { type: 'application/vnd.android.package-archive' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${app.id}-v${app.version}.apk`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 5000);
        showToast('APK Saved', `${app.name} (${app.size}) saved to storage.`, 'success');
      }
    } catch (err) {
      console.error('Download error:', err);
      showToast('Download Error', 'Could not save APK to storage.', 'error');
    }
  };

  const uninstallApp = (appId: string) => {
    const appToUninstall = apps.find((a) => a.id === appId);
    setCurrentUser((prev) => {
      const copyInstalled = { ...prev.installedApps };
      delete copyInstalled[appId];
      return {
        ...prev,
        installedApps: copyInstalled
      };
    });
    setInstallingState((prev) => {
      const copy = { ...prev };
      delete copy[appId];
      return copy;
    });
    showToast(
      'App Uninstalled',
      `${appToUninstall ? appToUninstall.name : 'App'} was removed from your device.`,
      'info'
    );
  };

  const addReview = (appId: string, rating: number, comment: string) => {
    const newReview: Review = {
      id: 'rev_' + Date.now(),
      appId,
      userId: currentUser.uid,
      userName: currentUser.displayName,
      userAvatar: currentUser.photoUrl,
      rating,
      comment,
      helpfulCount: 0,
      createdAt: new Date().toISOString()
    };

    setReviews((prev) => [newReview, ...prev]);

    // Recalculate app rating
    setApps((prevApps) =>
      prevApps.map((app) => {
        if (app.id !== appId) return app;
        const currentCount = app.ratingCount || 1;
        const newCount = currentCount + 1;
        const newAvg = Number(((app.rating * currentCount + rating) / newCount).toFixed(1));
        return {
          ...app,
          rating: newAvg,
          ratingCount: newCount
        };
      })
    );

    showToast('Review Published (+25 Points)', 'Thank you for contributing to the community telemetry!', 'success');
  };

  const createApp = (appData: Omit<AppItem, 'id' | 'downloads' | 'rating' | 'ratingCount' | 'createdAt'>): AppItem => {
    const id = appData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `app-${Date.now()}`;
    const newApp: AppItem = {
      ...appData,
      id,
      downloads: 0,
      rating: 5.0,
      ratingCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      price: appData.price || 'Free',
      containsAds: appData.containsAds ?? false,
      inAppPurchases: appData.inAppPurchases ?? true,
      ratingDistribution: { 5: 100, 4: 0, 3: 0, 2: 0, 1: 0 }
    };

    setApps((prev) => [newApp, ...prev]);
    showToast('App Published', `${newApp.name} is now live on AR-STORE!`, 'success');
    return newApp;
  };

  const updateApp = (appId: string, appData: Partial<AppItem>) => {
    setApps((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, ...appData, updatedAt: new Date().toISOString() } : a))
    );
    showToast('Changes Saved', 'App details have been updated.', 'success');
  };

  const deleteApp = (appId: string) => {
    const target = apps.find((a) => a.id === appId);
    setApps((prev) => prev.filter((a) => a.id !== appId));
    setReviews((prev) => prev.filter((r) => r.appId !== appId));
    if (selectedApp?.id === appId) {
      setSelectedApp(null);
    }
    showToast('App Deleted', `${target?.name || 'Application'} and all associated assets were purged.`, 'info');
  };

  const switchUserRole = (role: 'admin' | 'user') => {
    if (role === 'admin') {
      setCurrentUser(DEFAULT_ADMIN);
      showToast('Switched to Admin Role', 'Signed in as admin@arstore.com (Full Management Clearance)', 'info');
    } else {
      setCurrentUser(DEFAULT_USER);
      showToast('Switched to User Role', 'Signed in as regular user (Browse, Download & Review Only)', 'info');
    }
  };

  const addSearchHistory = (term: string) => {
    const clean = term.trim();
    if (!clean) return;
    setSearchHistory((prev) => [clean, ...prev.filter((item) => item.toLowerCase() !== clean.toLowerCase())].slice(0, 8));
  };

  const removeSearchHistory = (term: string) => {
    setSearchHistory((prev) => prev.filter((item) => item !== term));
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    showToast('Search History Cleared', 'Your previous search queries were purged.', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        apps,
        reviews,
        categories: CATEGORIES,
        currentUser,
        selectedApp,
        setSelectedApp,
        launchedApp,
        setLaunchedApp,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        searchHistory,
        addSearchHistory,
        removeSearchHistory,
        clearSearchHistory,
        currentTab,
        setCurrentTab,
        theme,
        setTheme,
        settings,
        updateSettings,
        resetToFactoryDefaults,
        installingState,
        installApp,
        downloadApkBinary,
        uninstallApp,
        isAppInstalled,
        toggleWishlist,
        isWishlisted,
        addReview,
        createApp,
        updateApp,
        deleteApp,
        switchUserRole,
        notifications,
        unreadNotificationCount,
        markNotificationsAsRead,
        isScanningProtect,
        lastScanTime,
        runPlayProtectScan,
        redeemPoints,
        toasts,
        removeToast,
        showToast,
        isInitialLoading,
        showSplash,
        setShowSplash,
        triggerStartupAnimation,
        loadSampleCatalog,
        clearAllCatalog
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
