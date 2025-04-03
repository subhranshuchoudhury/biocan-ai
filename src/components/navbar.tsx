// components/Navbar.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaUserCircle } from 'react-icons/fa';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5'; // For dropdown arrow
import BiocanLogoBlue from 'public/assets/biocan-logo-blue.png';
import { signOut } from 'firebase/auth';
import { auth } from '@/configs'; // Assuming you have Firebase auth configured
import { useRouter } from 'next/navigation'; // For redirecting after logout
import { useAuth } from '@/providers';

const Navbar: React.FC = () => {
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const { user } = useAuth(); // Assuming useAuth provides a logout method
    const router = useRouter();

    const handleTogglePopup = () => {
        setIsPopupOpen(prev => !prev);
    };

    const handleLogout = async () => {
        try {

            // Fallback to Firebase signOut
            await signOut(auth);
            setIsPopupOpen(false);
            router.push('/login'); // Redirect to login page after logout
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <nav className="bg-white p-4 flex justify-between items-center border-b shadow-sm">
            <div className="w-32">
                <Image src={BiocanLogoBlue} width={120} height={40} alt="biocan-logo" className="object-contain" />
            </div>
            <div className="relative">
                <button
                    onClick={handleTogglePopup}
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                >
                    <FaUserCircle size={32} />
                    {isPopupOpen ? <IoChevronUp size={16} /> : <IoChevronDown size={16} />}
                </button>

                {isPopupOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        <div className="py-1">
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:cursor-pointer"
                            >
                                Logout
                            </button>
                            <a
                                href="/profile"
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                My Profile
                            </a>
                            <a
                                href="/contact-us"
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Contact Us
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;