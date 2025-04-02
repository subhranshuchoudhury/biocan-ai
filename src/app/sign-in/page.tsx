'use client';

import { auth, provider } from '@/configs';
import { signInWithPopup } from 'firebase/auth';
import BiocanLogo from 'public/assets/biocan-logo.svg';
import { FcGoogle } from 'react-icons/fc';

const SignInPage = () => {
  return (
    <div className="flex h-screen min-h-dvh w-full flex-col items-center justify-between gap-4 bg-[linear-gradient(180deg,#13234D_0%,#3A3DD4_43.5%,#142145_100%)] px-4 py-28 text-center text-[#EBE3E3]">
      <BiocanLogo />
      <div>
        <h2 className="text-5xl font-bold">Welcome</h2>
        <h3 className="">
          Your Smart AI Guide That
          <strong> Understands and Prepares</strong> You At Every Step
        </h3>
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <button
          onClick={() => {
            signInWithPopup(auth, provider);
          }}
          className="flex w-[310px] items-center justify-center gap-2 rounded bg-white px-4 py-2 font-semibold text-black">
          <FcGoogle size={28} />
          <span>Continue with Google</span>
        </button>
        <p className="w-[350px]">By continuing, you agree to our Terms of Service and Privacy Policy</p>
      </div>
    </div>
  );
};

export default SignInPage;
