'use client';

import Navbar from "@/components/navbar";

export default function PrivacyPolicyPage() {

    return (
        <div className="min-h-screen bg-[#fff] flex flex-col">
            <div className="sticky top-0">
                <Navbar showDropdown={false} title="Privacy Policy" />
            </div>
            <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-bold text-black mb-6">Privacy Policy</h1>
                    <div className="text-black space-y-6">
                        <section>
                            <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
                            <p>
                                We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you use our website and services.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
                            <p>
                                We may collect personal information such as your name, email address, and account details when you register or interact with our services. We also collect usage data, including IP addresses and browsing behavior, to improve our platform.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
                            <p>
                                Your information is used to provide and improve our services, personalize your experience, communicate with you, and ensure the security of our platform. We may also use aggregated data for analytics purposes.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-xl font-semibold mb-2">4. Sharing Your Information</h2>
                            <p>
                                We do not sell your personal information. We may share it with trusted third-party service providers who assist us in operating our platform, provided they agree to keep it confidential. We may also disclose information to comply with legal obligations.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-xl font-semibold mb-2">5. Data Security</h2>
                            <p>
                                We implement reasonable security measures to protect your information from unauthorized access, use, or disclosure. However, no method of transmission over the internet is completely secure.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
                            <p>
                                You have the right to access, update, or delete your personal information. You may also opt out of certain communications. Contact us to exercise these rights.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-xl font-semibold mb-2">7. Cookies and Tracking</h2>
                            <p>
                                We use cookies and similar technologies to enhance your experience and analyze usage. You can manage cookie preferences through your browser settings.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-xl font-semibold mb-2">8. Changes to This Policy</h2>
                            <p>
                                We may update this Privacy Policy periodically. Changes will be posted on this page, and we will notify you of significant updates.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-xl font-semibold mb-2">9. Contact Us</h2>
                            <p>
                                If you have questions about this Privacy Policy or our data practices, please contact us at privacy@example.com.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}