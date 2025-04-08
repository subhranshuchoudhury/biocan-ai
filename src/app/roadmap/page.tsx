'use client';

import Navbar from "@/components/navbar";
import { useAuth } from "@/providers";
import { IoSend } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { useRouter } from "next/navigation";

export default function RoadMap() {
    const router = useRouter()
    const { user } = useAuth();

    const JobsData = [
        {
            title: "Clinical Data Management Associate"
        },
        {
            title: "Clinical Data Management Associate"
        },
        {
            title: "Clinical Data Management Associate"
        },
        {
            title: "Clinical Data Management Associate"
        }
    ];

    const handleOnClickJob = (jobid: string) => {
        router.push(`/roadmap/job/1`)
    }

    return (
        <div className="min-h-screen bg-[#fff] flex flex-col">
            <div className="sticky top-0">
                <Navbar />
            </div>
            <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-2">
                {
                    <div className="flex-1 bg-[url(/assets/chat-bg.svg)] bg-cover bg-no-repeat shrink-0 bg-center rounded-lg shadow-md p-4 overflow-y-auto mb-2 max-h-[calc(100vh-200px)]">
                        <div>
                            <div className="mb-4 text-left">
                                <div className="inline-block p-3 rounded-lg bg-[#F3F3F3] text-black rounded-bl-none max-w-[80%] sm:max-w-[60%]">
                                    Hello {user?.displayName?.split(" ")?.[0]},<br></br>Based on your assessment, You can choose to be
                                </div>
                            </div>
                            <div className="mt-4 text-left">
                                {
                                    JobsData.map((job, index) => {
                                        return (
                                            <div key={index} onClick={() => handleOnClickJob(job.title)} className="my-2 p-3 rounded-lg hover:cursor-pointer bg-[#F3F3F3] text-black rounded-bl-none max-w-[80%] sm:max-w-[60%] flex items-center justify-between">
                                                <span>{job.title}</span>
                                                <IoIosArrowForward color="#155dfc" size={20} />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                }

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