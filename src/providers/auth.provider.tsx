'use client';

import { auth, db } from '@/configs';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { PropsWithChildren, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, loading] = useAuthState(auth);
  console.log('User', user, loading);

  useEffect(() => {
    if (user) {
      setDoc(
        doc(db, 'users', user.uid),
        {
          name: user.displayName,
          email: user.email,
          imageURL: user.photoURL,
          online: true,
          lastSeen: serverTimestamp()
        },
        { merge: true }
      );
    }
  }, [user]);

  return <>{children}</>;
};
