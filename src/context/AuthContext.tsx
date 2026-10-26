import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, signInWithGoogle, logOut, handleFirestoreError, OperationType } from '../firebase';
import { UserProfile, UserRole } from '../types';
import { ADMIN_EMAILS, INITIAL_USERS } from '../data/seedData';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile;
  isAdmin: boolean;
  isProjectManager: boolean;
  role: UserRole;
  accessToken: string | null;
  setSimulatedRole: (role: UserRole) => void;
  loginWithGoogle: () => Promise<string | null>;
  logoutUser: () => Promise<void>;
  switchActiveAdminAccount: (email: string) => void;
  loading: boolean;
}

const DEFAULT_ADMIN: UserProfile = {
  id: 'admin-kgosi',
  email: 'servicewebsites6@gmail.com',
  displayName: 'Kgosi (Admin)',
  role: 'admin',
  department: 'Executive Operations & Engineering',
  phone: '+27 62 358 7797',
  createdAt: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_ADMIN);
  const [loading, setLoading] = useState<boolean>(true);
  const [simulatedRole, setSimulatedRoleState] = useState<UserRole | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (!user) {
        setAccessToken(null);
      }
      if (user && user.email) {
        const userEmailLower = user.email.toLowerCase();
        const isHardcodedAdmin = ADMIN_EMAILS.some((e) => e.toLowerCase() === userEmailLower);

        const profileRef = doc(db, 'users', user.uid);
        try {
          const snapshot = await getDoc(profileRef);
          if (snapshot.exists()) {
            const data = snapshot.data() as UserProfile;
            // Ensure hardcoded admins always maintain admin role
            const resolvedRole: UserRole = isHardcodedAdmin ? 'admin' : (data.role || 'collaborator');
            setUserProfile({
              ...data,
              id: user.uid,
              email: user.email,
              displayName: user.displayName || data.displayName || user.email.split('@')[0],
              photoURL: user.photoURL || undefined,
              role: resolvedRole,
            });
          } else {
            const newProfile: UserProfile = {
              id: user.uid,
              email: user.email,
              displayName: user.displayName || user.email.split('@')[0],
              photoURL: user.photoURL || undefined,
              role: isHardcodedAdmin ? 'admin' : 'collaborator',
              department: isHardcodedAdmin ? 'Executive Direction' : 'Project Operations',
              phone: '+27 62 358 7797',
              createdAt: new Date().toISOString(),
            };
            await setDoc(profileRef, newProfile);
            setUserProfile(newProfile);
          }
        } catch (error) {
          console.warn('Profile sync fallback:', error);
          setUserProfile({
            id: user.uid,
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0],
            photoURL: user.photoURL || undefined,
            role: isHardcodedAdmin ? 'admin' : 'collaborator',
            department: 'Operations',
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        // Default to active admin account in local session
        setUserProfile(DEFAULT_ADMIN);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const res = await signInWithGoogle();
      if (res?.accessToken) {
        setAccessToken(res.accessToken);
        return res.accessToken;
      }
      return null;
    } catch (error) {
      console.error('Google Sign-In failed', error);
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      await logOut();
      setAccessToken(null);
      setUserProfile(DEFAULT_ADMIN);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const switchActiveAdminAccount = (email: string) => {
    const targetUser = INITIAL_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (targetUser) {
      setUserProfile(targetUser);
    } else {
      const isHardcodedAdmin = ADMIN_EMAILS.some((e) => e.toLowerCase() === email.toLowerCase());
      setUserProfile({
        id: `user-${Date.now()}`,
        email,
        displayName: email.split('@')[0],
        role: isHardcodedAdmin ? 'admin' : 'collaborator',
        department: 'Engineering Lab',
        createdAt: new Date().toISOString(),
      });
    }
    setSimulatedRoleState(null);
  };

  const setSimulatedRole = (role: UserRole) => {
    setSimulatedRoleState(role);
  };

  const effectiveRole = useMemo(() => {
    if (simulatedRole) return simulatedRole;
    if (userProfile.email) {
      const emailLower = userProfile.email.toLowerCase();
      if (ADMIN_EMAILS.some((adminEmail) => adminEmail.toLowerCase() === emailLower)) {
        return 'admin';
      }
    }
    return userProfile.role;
  }, [simulatedRole, userProfile]);

  const isAdmin = effectiveRole === 'admin';
  const isProjectManager = effectiveRole === 'admin' || effectiveRole === 'project_manager';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile: { ...userProfile, role: effectiveRole },
        isAdmin,
        isProjectManager,
        role: effectiveRole,
        accessToken,
        setSimulatedRole,
        loginWithGoogle,
        logoutUser,
        switchActiveAdminAccount,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
