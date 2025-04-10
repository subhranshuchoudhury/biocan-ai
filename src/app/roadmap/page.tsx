'use client';

import Navbar from "@/components/navbar";
import { useAuth } from "@/providers";
import { IoSend } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/configs";

export default function RoadMap() {
    const router = useRouter();
    const { user } = useAuth();
    const [mbtiType, setMbtiType] = useState("");
    const [loading, setLoading] = useState(true);
    const [jobsData, setJobsData] = useState<{ job_roles: string[] }>({ job_roles: [] });

    // Fetch suggested jobs from Firestore first, then API if needed
    const getSuggestedJobs = async (mbtiType: string) => {
        if (!user?.uid || !mbtiType) return;

        try {
            setLoading(true);

            // Check Firestore for existing suggested jobs
            const jobsRef = doc(db, "suggested_jobs", user.uid);
            const jobsSnap = await getDoc(jobsRef);

            if (jobsSnap.exists()) {
                // Load data from Firestore
                setJobsData(jobsSnap.data() as { job_roles: string[] });
                setLoading(false);
            }

            // Fetch new data from API
            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            };
            const response = await fetch(`https://biocan-backend.onrender.com/get_recommended_jobs?mbti=${mbtiType}`, options);
            const data = await response.json();
            setLoading(false);

            // Update state with new API data
            setJobsData(data);

            // Save API response to Firestore
            await setDoc(jobsRef, data, { merge: true });
        } catch (error) {
            console.error("Error fetching suggested jobs:", error);
        } finally {
            setLoading(false);
        }
    };

    // Check user report for MBTI type
    useEffect(() => {
        const checkUserReport = async () => {
            if (!user?.uid) {
                return;
            }

            try {
                setLoading(true);
                const reportRef = doc(db, "reports", user.uid);
                const reportSnap = await getDoc(reportRef);

                if (reportSnap.exists()) {
                    setMbtiType(reportSnap.data().apiResponse.mbti.type);
                } else {
                    router.replace('/assessment');
                }
            } catch (error) {
                console.error("Error fetching report:", error);
                router.push('/assessment');
            } finally {
                setLoading(false);
            }
        };
        checkUserReport();
    }, [user, router]);

    // Fetch suggested jobs when MBTI type is available
    useEffect(() => {
        if (user?.uid && mbtiType) {
            getSuggestedJobs(mbtiType);
        }
    }, [user, mbtiType]);

    const handleOnClickJob = (jobName: string) => {
        router.push(`/roadmap/job?name=${jobName}`);
    };

    return (
        <div className="min-h-screen bg-[#fff] flex flex-col">
            <div className="sticky top-0">
                <Navbar />
            </div>
            <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-2">
                <div className="flex-1 bg-[url(/assets/chat-bg.svg)] bg-cover bg-no-repeat shrink-0 bg-center rounded-lg shadow-md p-4 overflow-y-auto mb-2 max-h-[calc(100vh-200px)]">
                    <div>
                        <div className="mb-4 text-left">
                            <div className="inline-block p-3 rounded-lg bg-[#F3F3F3] text-black rounded-bl-none w-fit max-w-full">
                                Hello {user?.displayName?.split(" ")?.[0]},
                                <br />
                                Based on your assessment, You can choose to be
                            </div>
                        </div>

                        {loading && (
                            <div className="mt-4 text-left">
                                <div className="my-2 p-3 rounded-lg hover:cursor-pointer bg-[#F3F3F3] text-black rounded-bl-none w-fit max-w-full flex items-center justify-between">
                                    <span className="animate-spin">
                                        <AiOutlineLoading3Quarters color="#000" size={20} />
                                    </span>
                                    <span className="ml-3">Please wait...</span>
                                </div>
                            </div>
                        )}

                        <div className="mt-4 text-left">
                            {jobsData.job_roles.map((job, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleOnClickJob(job)}
                                    className="my-2 p-3 rounded-lg hover:cursor-pointer bg-[#F3F3F3] text-black rounded-bl-none w-fit max-w-full flex items-center justify-between"
                                >
                                    <span>{job}</span>
                                    <IoIosArrowForward color="#155dfc" size={20} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex w-full justify-between shadow-md border-0 rounded-full bg-white">
                    <input
                        placeholder="Type your message"
                        className="flex-1 py-3 px-4 border-0 rounded-full focus:outline-none text-black bg-white"
                    />
                    <button type="button" className="p-2 rounded-full hover:cursor-pointer transition-colors">
                        <IoSend color="#155dfc" size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}