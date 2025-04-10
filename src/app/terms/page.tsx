'use client';

import Navbar from "@/components/navbar";

export default function TermsPage() {

    return (
        <div className="min-h-screen bg-[#fff] flex flex-col">
            <div className="sticky top-0">
                <Navbar showDropdown={false} title="Terms & Conditions" />
            </div>
            <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-bold text-black mb-6">Terms and Conditions</h1>
                    <div className="text-black space-y-6">
                        <section>
                            <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
                            <p>
                                Welcome to our platform. These Terms and Conditions govern your use of our website and services. By accessing or using our services, you agree to be bound by these terms.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-xl font-semibold mb-2">2. User Responsibilities</h2>
                            <p>
                                You agree to use our services only for lawful purposes and in a manner that does not infringe the rights of others or restrict their use of the platform.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-xl font-semibold mb-2">3. Intellectual Property</h2>
                            <p>
                                All content on this platform, including text, graphics, and logos, is our property or the property of our licensors and is protected by intellectual property laws.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-xl font-semibold mb-2">4. Limitation of Liability</h2>
                            <p>
                                We are not liable for any damages arising from your use of our services, including direct, indirect, incidental, or consequential damages.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-xl font-semibold mb-2">5. Changes to Terms</h2>
                            <p>
                                We may update these Terms and Conditions from time to time. We will notify you of any changes by posting the new terms on this page.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-xl font-semibold mb-2">6. Contact Us</h2>
                            <p>
                                If you have any questions about these Terms and Conditions, please contact us at support@example.com.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}