import create from 'zustand';
import { auth, db } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  where,
  getDocs
} from 'firebase/firestore';

interface User {
  id: string;
  username: string;
  email: string;
  photoURL: string;
  followers: string[];
  following: string[];
  likedVideos: string[];
}

interface StoreState {
  user: User | null;
  isAuthenticated: boolean;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  likeVideo: (videoId: string) => Promise<void>;
  unlikeVideo: (videoId: string) => Promise<void>;
  followUser: (userId: string) => Promise<void>;
  unfollowUser: (userId: string) => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isSidebarOpen: true,
  
  toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),
  
  likeVideo: async (videoId: string) => {
    const { user } = get();
    if (!user) return;
    
    try {
      await updateDoc(doc(db, 'users', user.id), {
        likedVideos: arrayUnion(videoId)
      });
      
      await updateDoc(doc(db, 'videos', videoId), {
        likes: increment(1)
      });
      
      set(state => ({
        user: {
          ...state.user!,
          likedVideos: [...state.user!.likedVideos, videoId]
        }
      }));
    } catch (error) {
      console.error('Error liking video:', error);
    }
  },
  
  unlikeVideo: async (videoId: string) => {
    const { user } = get();
    if (!user) return;
    
    try {
      await updateDoc(doc(db, 'users', user.id), {
        likedVideos: arrayRemove(videoId)
      });
      
      await updateDoc(doc(db, 'videos', videoId), {
        likes: increment(-1)
      });
      
      set(state => ({
        user: {
          ...state.user!,
          likedVideos: state.user!.likedVideos.filter(id => id !== videoId)
        }
      }));
    } catch (error) {
      console.error('Error unliking video:', error);
    }
  },
  
  followUser: async (userId: string) => {
    const { user } = get();
    if (!user) return;
    
    try {
      await updateDoc(doc(db, 'users', user.id), {
        following: arrayUnion(userId)
      });
      
      await updateDoc(doc(db, 'users', userId), {
        followers: arrayUnion(user.id)
      });
      
      set(state => ({
        user: {
          ...state.user!,
          following: [...state.user!.following, userId]
        }
      }));
    } catch (error) {
      console.error('Error following user:', error);
    }
  },
  
  unfollowUser: async (userId: string) => {
    const { user } = get();
    if (!user) return;
    
    try {
      await updateDoc(doc(db, 'users', user.id), {
        following: arrayRemove(userId)
      });
      
      await updateDoc(doc(db, 'users', userId), {
        followers: arrayRemove(user.id)
      });
      
      set(state => ({
        user: {
          ...state.user!,
          following: state.user!.following.filter(id => id !== userId)
        }
      }));
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  }
}));