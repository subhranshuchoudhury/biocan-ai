// components/ContactUsPage.tsx
'use client';

import Navbar from '@/components/navbar';
import { FaPhone, FaEnvelope, FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

const ContactUsPage: React.FC = () => {


    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Sticky Navbar */}
            <div className="sticky top-0 z-50 bg-white shadow-md">
                <Navbar
                    title='Contact Us'
                    showDropdown={false}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
                    {/* Get in Touch Section */}
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Get in Touch</h1>
                        <p className="text-gray-600 mb-6">
                            If you have any inquiries get in touch with us. We'll be happy to help you.
                        </p>

                        {/* Contact Information */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-center gap-2 bg-gray-100 p-3 rounded-lg">
                                <FaPhone className="text-blue-800" size={20} />
                                <span className="text-gray-800 font-medium">+1 (917) 555-6789</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 bg-gray-100 p-3 rounded-lg">
                                <FaEnvelope className="text-blue-800" size={20} />
                                <span className="text-gray-800 font-medium">companyname.info@gmail.com</span>
                            </div>
                        </div>
                    </div>

                    {/* Social Media Section */}
                    <div className="mt-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Social Media</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-center gap-4">
                                <div className="flex-shrink-0">
                                    <FaFacebookF className="text-blue-800 bg-gray-100 p-2 rounded-full" size={40} />
                                </div>
                                <span className="text-gray-600 text-sm flex-1 text-left">
                                    Stay updated, connect with us on Facebook.
                                </span>
                            </div>
                            <div className="flex items-center justify-center gap-4">
                                <div className="flex-shrink-0">
                                    <FaInstagram className="text-blue-800 bg-gray-100 p-2 rounded-full" size={40} />
                                </div>
                                <span className="text-gray-600 text-sm flex-1 text-left">
                                    Explore and discover beauty of our brand.
                                </span>
                            </div>
                            <div className="flex items-center justify-center gap-4">
                                <div className="flex-shrink-0">
                                    <FaTwitter className="text-blue-800 bg-gray-100 p-2 rounded-full" size={40} />
                                </div>
                                <span className="text-gray-600 text-sm flex-1 text-left">
                                    Follow us for real-time updates and lively discussions.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default ContactUsPage;