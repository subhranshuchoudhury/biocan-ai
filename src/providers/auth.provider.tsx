'use client';

import { auth, db } from '@/configs';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { createContext, useContext, useEffect, PropsWithChildren } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
// 1. Create a context for auth
const AuthContext = createContext<{ user: any; loading: boolean } | undefined>(undefined);

// 2. Define the AuthProvider component
export const AuthProvider = ({ children }: PropsWithChildren) => {

  const [user, loading] = useAuthState(auth);
  console.log('User', user, loading);

  // Update Firestore when user logs in
  useEffect(() => {
    if (user) {
      (async () => {
        await setDoc(
          doc(db, 'users', user.uid),
          {
            name: user.displayName,
            email: user.email,
            imageURL: user.photoURL,
            lastSeen: serverTimestamp(),
          },
          { merge: true }
        );
      })()
    }
  }, [user]);

  // Provide the auth state to children
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Create a custom hook to access the auth state
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};