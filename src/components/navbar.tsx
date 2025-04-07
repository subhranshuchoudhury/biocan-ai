// components/Navbar.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaEnvelope, FaFileAlt, FaLock, FaSignOutAlt } from 'react-icons/fa';
import BiocanLogoBlue from 'public/assets/biocan-logo-blue.png';
import HamBurgerMenu from 'public/assets/hamburger.svg';
import BioCanLogoBlackWhite from 'public/assets/biocan-black-white-logo.svg';
import { signOut } from 'firebase/auth';
import { auth } from '@/configs'; // Assuming you have Firebase auth configured
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers';
import Select from 'react-select';
import { IoChevronBackCircleOutline } from "react-icons/io5";
const Navbar: React.FC<{
    assessmentOptions?: { value: string; label: string }[];
    onAssessmentChange?: (selectedOption: { value: string; label: string } | null) => void;
    defaultAssessmentValue?: { value: string; label: string };
    onChangeDrawer?: (value: boolean) => void;
    showDropdown?: boolean; // Optional prop to toggle dropdown visibility
    title?: string; // Optional prop to set the title
}> = ({
    assessmentOptions = [{ label: 'Assessment', value: 'assessment' }],
    onAssessmentChange,
    defaultAssessmentValue,
    onChangeDrawer,
    showDropdown = true, // Default to true
    title = 'Contact Us', // Default title
}) => {
        const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
        const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
        const { user } = useAuth();
        const router = useRouter();

        const handleTogglePopup = () => {
            setIsPopupOpen((prev) => !prev);
        };

        const handleLogout = async () => {
            try {
                await signOut(auth);
                setIsPopupOpen(false);
                router.push('/login');
            } catch (error) {
                console.error('Logout failed:', error);
            }
        };

        const handleToggleDrawer = () => {
            onChangeDrawer?.(!isDrawerOpen);
            setIsDrawerOpen((prev) => !prev);
        };

        const handleAssessmentSelect = (selectedOption: { value: string; label: string } | null) => {
            if (onAssessmentChange) {
                onAssessmentChange(selectedOption);
            }
        };

        // Blank function for back button (to be customized)
        const handleBackClick = () => {
            // Add your custom logic here
            router.back()
        };

        return (
            <nav className="bg-white p-4 flex items-center justify-between border-b shadow-sm relative">
                {/* Left Section - Hamburger or Back Button with Title */}
                <div className="flex items-center gap-2">
                    {showDropdown ? (
                        <div className="cursor-pointer" onClick={handleToggleDrawer}>
                            <HamBurgerMenu color="#000" width={40} height={40} />
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 cursor-pointer" onClick={handleBackClick}>
                            <IoChevronBackCircleOutline size={40} className="text-gray-600" />
                            <span className="text-gray-600 font-medium text-lg">{title}</span>
                        </div>
                    )}
                </div>

                {/* Centered Dropdown */}
                <div className="flex-1 flex justify-center">
                    {showDropdown && (
                        <div className="relative w-48">
                            <Select
                                instanceId="navbar_dropdown"
                                options={assessmentOptions}
                                onChange={handleAssessmentSelect}
                                defaultValue={defaultAssessmentValue}
                                placeholder="Assessments"
                                className="text-sm"
                                isSearchable={false}
                                styles={{
                                    placeholder: (provided) => ({
                                        ...provided,
                                        border: 'none',
                                        boxShadow: 'none',
                                        cursor: 'pointer',
                                        color: '#000000',
                                    }),
                                    control: (provided) => ({
                                        ...provided,
                                        border: 'none',
                                        boxShadow: 'none',
                                        cursor: 'pointer',
                                        color: '#000000',
                                    }),
                                    menu: (provided) => ({
                                        ...provided,
                                        zIndex: 50,
                                    }),
                                    option: (provided, state) => ({
                                        ...provided,
                                        color: '#000000',
                                        backgroundColor: state.isSelected ? '#e0e0e0' : 'white',
                                        ':hover': {
                                            backgroundColor: '#e0e0e0',
                                        },
                                    }),
                                    singleValue: (provided) => ({
                                        ...provided,
                                        color: '#000000',
                                    }),
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Right User Icon - Triggers Popup */}
                <div className="relative">
                    <button
                        onClick={handleTogglePopup}
                        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 focus:outline-none hover:cursor-pointer"
                    >
                        <BioCanLogoBlackWhite width={40} height={40} />
                    </button>

                    {isPopupOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <div className="py-1">
                                <a
                                    href="/profile"
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Profile
                                </a>
                                <a
                                    href="/contact-us"
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Contact Us
                                </a>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:cursor-pointer"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Drawer Component */}
                <div
                    className={`fixed top-0 left-0 h-full bg-gray-100 shadow-lg transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
                        } w-64 z-50 flex flex-col`}
                >
                    {/* Drawer Header with Logo */}
                    <div className="p-4 bg-white border-b">
                        <Image
                            src={BiocanLogoBlue}
                            width={120}
                            height={40}
                            alt="biocan-logo"
                            className="object-contain"
                        />
                    </div>

                    {/* Drawer Menu Items */}
                    <div className="flex-1 p-4 space-y-2">
                        <a
                            href="/contact-us"
                            className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-200 rounded"
                            onClick={handleToggleDrawer}
                        >
                            <FaEnvelope size={16} />
                            Contact Us
                        </a>
                        <a
                            href="/terms"
                            className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-200 rounded"
                            onClick={handleToggleDrawer}
                        >
                            <FaFileAlt size={16} />
                            Terms & Conditions
                        </a>
                        <a
                            href="/privacy"
                            className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-200 rounded"
                            onClick={handleToggleDrawer}
                        >
                            <FaLock size={16} />
                            Privacy Policy
                        </a>
                        <button
                            onClick={() => {
                                handleLogout();
                                handleToggleDrawer();
                            }}
                            className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-200 rounded w-full text-left hover:cursor-pointer"
                        >
                            <FaSignOutAlt size={16} />
                            LogOut
                        </button>
                    </div>
                </div>

                {/* Overlay to close drawer when clicking outside */}
                {isDrawerOpen && (
                    <div
                        className="fixed inset-0 bg-black opacity-50 z-40"
                        onClick={handleToggleDrawer}
                    ></div>
                )}
            </nav>
        );
    };

export default Navbar;