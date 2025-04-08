'use client';

import Navbar from "@/components/navbar";
import { useAuth } from "@/providers";
import { IoSend } from "react-icons/io5";
import { FaLock } from "react-icons/fa6";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
const sections = [
    { title: 'Skills & Tools Needed', key: 'skills_and_tools' },
    { title: 'Education & Learning Paths', key: 'education_and_learning_paths' },
    { title: 'Salary & Market Demand', key: 'salary_and_market_demand' },
    { title: 'Resources & Courses', key: 'resources_and_courses' },
];

const JobData = {
    job_role: {
        title: "Clinical Data Management Associate",
        short_description: "Data Scientists analyze complex data to help organizations make informed decisions and predict future trends."
    },
    content: {
        skills_and_tools: "Proficiency in programming languages such as Python and R; experience with data visualization tools; knowledge of machine learning algorithms.",
        education_and_learning_paths: "Bachelor's or Master's degree in Computer Science, Statistics, or related fields; specialized courses in data analysis and machine learning.",
        salary_and_market_demand: "Competitive salary with high demand across various industries.",
        resources_and_courses: "Online platforms like Coursera and edX offer courses such as 'Data Science Specialization'; books like 'The Elements of Statistical Learning'."
    },
    experts: [
        {
            name: "John Doe",
            picture_url: "/assets/profile.jpeg"
        },
        {
            name: "Jane Smith",
            picture_url: "/assets/profile.jpeg"
        }
    ],
    current_openings: [
        {
            job_name: "Junior CDMA",
            company: "TechCorp"
        },
        {
            job_name: "Senior CDMA",
            company: "InnovateX"
        }
    ]
}

const tabs = [
    { name: "Job Info", locked: false },
    { name: "My Suitability", locked: true },
    { name: "Roadmap", locked: true }
];
export default function RoadMap() {
    const { user } = useAuth();
    const [openSection, setOpenSection] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedExpert, setSelectedExpert] = useState(null);
    const [hideOnNavBarOpen, setHideonNavOpen] = useState(false);


    const toggleSection = (index) => {
        setOpenSection(openSection === index ? null : index);
    };

    const handlePopup = (expert) => {
        setSelectedExpert(expert);
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        setSelectedExpert(null);
    };


    return (
        <div className="min-h-screen bg-[#fff] flex flex-col">
            <div className="sticky top-0">
                <Navbar onChangeDrawer={(value) => {
                    setHideonNavOpen(value)
                }} />
            </div>
            <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-2">
                {
                    <div className="flex-1 bg-[url(/assets/chat-bg.svg)] bg-cover bg-no-repeat shrink-0 bg-center rounded-lg shadow-md p-4 overflow-y-auto mb-2 max-h-[calc(100vh-200px)]">
                        <div>
                            <p className="text-black text-center font-bold underline text-lg mb-5">{JobData.job_role.title}</p>

                            <div className="flex justify-evenly max-w-xl mx-auto mt-8 bg-[#F3F3F3] p-2 rounded-md shadow shadow-slate-400">
                                <div className="flex flex-row items-center gap-x-4 w-full justify-evenly">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.name}
                                            className={`flex items-center px-4 py-2 rounded-md transition-colors ${tab.name === tabs[0].name
                                                ? "bg-white text-black font-medium hover:cursor-pointer shadow-xs shadow-black hover:bg-slate-200"
                                                : "text-gray-500 hover:text-gray-700 hover:cursor-not-allowed"
                                                }`}
                                        >
                                            <span className="md:text-base text-sm">{tab.name}</span>
                                            {tab.locked && <FaLock className="ml-1" color="#000" size={10} />}
                                        </button>
                                    ))}

                                </div>
                            </div>
                            <div className="flex justify-center max-w-xl mx-auto mt-3 p-2">
                                <p className="text-black text-sm font-medium">
                                    {JobData.job_role.short_description}
                                </p>

                            </div>

                            <div className="flex justify-center max-w-xl mx-auto mt-3 p-2 flex-col">
                                {sections.map((section, index) => (
                                    <div key={index} className="mb-2 shadow shadow-slate-400 rounded-md">
                                        <button
                                            onClick={() => toggleSection(index)}
                                            className="w-full text-left p-2 bg-gray-100 rounded-lg flex justify-between hover:cursor-pointer items-center focus:outline-none hover:bg-gray-200 transition duration-300"
                                        >
                                            <span className="font-medium text-black text-sm">{section.title}</span>
                                            <FaChevronDown
                                                color="#000"
                                                className={`transition-transform duration-300 ${openSection === index ? 'rotate-180' : ''}`}
                                            />
                                        </button>
                                        {openSection === index && (
                                            <div className="p-4 bg-white rounded-lg shadow mt-2">
                                                <p className="text-gray-700">{JobData.content[section.key]}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <p className="text-black text-center font-bold text-lg mt-5">Connect with Experts in this Role</p>

                            <div className="flex justify-center max-w-xl mx-auto mt-3 p-2 flex-row gap-x-7">
                                {
                                    JobData.experts.map((expert, index) => {
                                        return <div onClick={() => handlePopup(expert)} key={index} className="flex flex-col items-center bg-[#F3F3F3] p-3 shadow shadow-slate-400 rounded-md hover:cursor-pointer">
                                            <img src="/assets/profile.jpeg" alt="expert_image" width={22} height={22} className="w-22 h-22 object-cover" />
                                            <p className="mt-2 text-center text-black text-sm">{expert.name}</p>
                                        </div>
                                    })
                                }
                            </div>
                            {
                                !hideOnNavBarOpen && <div className="relative flex justify-center w-fit mx-auto p-2 flex-row gap-x-7 mt-8 hover:cursor-not-allowed">
                                    {/* Mapped Job Openings */}
                                    {
                                        JobData.current_openings.map((openings, index) => {
                                            return (
                                                <div key={index} className="flex flex-col items-center bg-[#F3F3F3] p-3 shadow shadow-slate-400 rounded-md w-40">
                                                    <div className="w-22 h-22">
                                                        <p className="text-black text-md">{openings.job_name}</p>
                                                        <p className="text-slate-700 text-sm">{openings.company}</p>
                                                    </div>
                                                    <p className="mt-2 text-center text-blue-400 underline text-sm">Know More</p>
                                                </div>
                                            );
                                        })
                                    }
                                    {/* Gray Overlay with Lock Icon */}
                                    <div className="absolute inset-0 bg-black opacity-40 flex items-center justify-center rounded-md">
                                        <FaLock size={40} />
                                    </div>
                                </div>
                            }

                        </div>
                    </div>
                }

                <div className="flex w-full justify-between shadow-md border border-[#bebebe] rounded-full bg-white">
                    <input
                        placeholder="Type your message"
                        className="flex-1 py-3 px-4 border-none rounded-full focus:outline-none text-black bg-white"
                    />
                    <button type="button" className="p-2 rounded-full hover:cursor-pointer transition-colors">
                        <IoSend color="#155dfc" size={20} />
                    </button>
                </div>
            </div>
            {showPopup && selectedExpert && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Semi-transparent overlay */}
                    <div className="absolute inset-0 bg-black opacity-90"></div>

                    {/* Popup content - separate from the opacity of the overlay */}
                    <div className="bg-white p-6 pt-4 rounded-lg shadow-lg w-[300px] z-10 relative">
                        <div
                            onClick={closePopup}
                            className="flex justify-end cursor-pointer"
                        >
                            <RxCross1 color="red" size={20} />
                        </div>
                        <div className="flex flex-col items-center">
                            <img
                                src={"/assets/profile.jpeg"}
                                alt="expert_image"
                                width={100}
                                height={100}
                                className="w-24 h-24 object-cover rounded-full mb-4"
                            />
                            <h2 className="text-lg font-bold text-black">John Doe</h2>
                            <p className="text-sm text-gray-600 mb-4">{"Expert"}</p>
                            <p className="text-sm text-gray-700 mb-4 text-center">
                                John Doe life has been a journey of courage, compassion and constant hardwork. At a very young age he had decided to devote his life in service of the people. He displayed his skills as a grass root level worker, an organiser and an administrator during his 13 year long stint as the Chief Minister.
                            </p>
                            <div className="flex justify-around w-full mb-4 text-sm">
                                <button className="text-black">Career Paths</button>
                                <button className="text-black">Jobs</button>
                                <button className="text-black">Topics</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}