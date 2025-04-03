// pages/signin.tsx
'use client';

import { useState } from 'react';
import { auth, provider } from '@/configs';
import { signInWithPopup } from 'firebase/auth';
import BiocanLogo from 'public/assets/biocan-logo.svg';
import { FcGoogle } from 'react-icons/fc';
import { useRouter } from 'next/navigation'; // For redirection

const SignInPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, provider);
      // If login is successful, redirect to /home
      router.replace('/home');
    } catch (error: any) {
      console.error("Signin error:", error);
      setError(error.message || "An error occurred during sign-in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen min-h-dvh w-full flex-col items-center justify-between gap-4 bg-[linear-gradient(180deg,#13234D_0%,#3A3DD4_43.5%,#142145_100%)] px-4 py-28 text-center text-[#EBE3E3]">
      <BiocanLogo />
      <div>
        <h2 className="text-5xl font-bold">Welcome</h2>
        <h3 className="mt-2 text-lg">
          Your Smart AI Guide That
          <strong> Understands and Prepares</strong> You At Every Step
        </h3>
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        {error && (
          <p className="text-red-400 text-sm w-[310px]">{error}</p>
        )}
        <button
          onClick={login}
          disabled={isLoading}
          className={`flex w-[310px] items-center justify-center gap-2 rounded bg-white px-4 py-2 font-semibold text-black hover:cursor-pointer transition-opacity ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
            }`}
        >
          <FcGoogle size={28} />
          <span>{isLoading ? 'Signing In...' : 'Continue with Google'}</span>
        </button>
        <p className="w-[350px] text-sm">
          By continuing, you agree to our{' '}
          <a href="/terms" className="underline hover:text-gray-300">Terms of Service</a> and{' '}
          <a href="/privacy" className="underline hover:text-gray-300">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;