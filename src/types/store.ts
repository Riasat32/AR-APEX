export type AppCategory =
  | 'Games'
  | 'AI & AR'
  | 'Productivity'
  | 'Tools'
  | 'Social'
  | 'Entertainment'
  | 'Health'
  | 'Developer'
  | 'Finance'
  | 'Photography';

export type StoreTheme = 'light' | 'dark';

export interface AppItem {
  id: string;
  name: string;
  description: string;
  category: AppCategory;
  version: string;
  size: string;
  developer: string;
  iconUrl: string;
  apkUrl: string;
  screenshots: string[];
  downloads: number;
  rating: number;
  ratingCount: number;
  whatsNew: string;
  featured?: boolean;
  bannerUrl?: string;
  tags: string[];
  contentRating?: string;
  price?: string; // "Free" or "$2.99"
  containsAds?: boolean;
  inAppPurchases?: boolean;
  ratingDistribution?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  appId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  helpfulCount: number;
  createdAt: string;
}

export interface StoreSettings {
  theme: StoreTheme;
  downloadNetwork: 'any' | 'wifi' | 'ask';
  autoUpdate: boolean;
  biometricVerification: boolean;
  parentalControls: boolean;
  soundEffects: boolean;
  show120FpsIndicator: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'user';
  displayName: string;
  photoUrl?: string;
  downloadsHistory: string[];
  wishlist: string[];
  cyberPoints: number;
  pointsTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  installedApps: {
    [appId: string]: {
      installedAt: string;
      version: string;
    };
  };
}

export interface StoreNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'update' | 'points' | 'security' | 'promo';
  appId?: string;
}

export interface DownloadProgress {
  progress: number;
  status: 'idle' | 'downloading' | 'installing' | 'completed';
}
