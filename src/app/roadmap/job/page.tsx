'use client';

import Navbar from "@/components/navbar";
import { IoSend } from "react-icons/io5";
import { FaLock } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { useSearchParams } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const sections = [
    { title: 'Skills & Tools Needed', key: 'skills_and_tools' },
    { title: 'Education & Learning Paths', key: 'education_and_learning_paths' },
    { title: 'Salary & Market Demand', key: 'salary_and_market_demand' },
    { title: 'Resources & Courses', key: 'resources_and_courses' },
];

const demoCurrentOpenings = [
    { job_name: "Junior CDMA", company: "TechCorp" },
    { job_name: "Senior CDMA", company: "InnovateX" },
];

const tabs = [
    { name: "Job Info", locked: false },
    { name: "My Suitability", locked: true },
    { name: "Roadmap", locked: true },
];

export default function RoadMap() {
    const params = useSearchParams();
    const jobName = params.get('name');
    const [openSection, setOpenSection] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedExpert, setSelectedExpert] = useState<any>(null);
    const [hideOnNavBarOpen, setHideonNavOpen] = useState(false);
    const [jobDetails, setJobDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [expertLoading, setExpertLoading] = useState(false);
    const [showCalendarEmbed, setShowCalendarEmbed] = useState(true); // Toggle iframe vs button

    const getJobDetails = async (jobName) => {
        try {
            const options = { method: 'GET' };
            setLoading(true);
            const response = await fetch(`https://biocan-backend.onrender.com/get_job_role_page?job_role=${jobName}`, options);
            const data = await response.json();
            setJobDetails(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getExpertDetails = async (expertName) => {
        try {
            setExpertLoading(true);
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({ name: expertName }),
            };
            const response = await fetch(
                `https://biocan-backend.onrender.com/get_expert_page?name=${encodeURIComponent(expertName)}`,
                options
            );
            const data = await response.json();
            return data.expert;
        } catch (error) {
            console.error(error);
            return null;
        } finally {
            setExpertLoading(false);
        }
    };

    useEffect(() => {
        if (jobName) {
            getJobDetails(jobName);
        }
    }, [jobName]);

    const toggleSection = (index) => {
        setOpenSection(openSection === index ? null : index);
    };

    const handlePopup = async (expert) => {
        setShowPopup(true);
        const expertDetails = await getExpertDetails(expert.name);
        if (expertDetails) {
            setSelectedExpert(expertDetails);
            setShowCalendarEmbed(true); // Show embed by default
        }
    };

    const closePopup = () => {
        setShowPopup(false);
        setSelectedExpert(null);
        setShowCalendarEmbed(true);
    };

    return (
        <div className="min-h-screen bg-[#fff] flex flex-col">
            <div className="sticky top-0">
                <Navbar
                    onChangeDrawer={(value) => {
                        setHideonNavOpen(value);
                    }}
                />
            </div>
            <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-2">
                <div className="flex-1 bg-[url(/assets/chat-bg.svg)] bg-cover bg-no-repeat shrink-0 bg-center rounded-lg shadow-md p-4 overflow-y-auto mb-2 max-h-[calc(100vh-200px)]">
                    <div>
                        <p className="text-black text-center font-bold underline text-xl mb-5">{jobName}</p>
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
                                {jobDetails && jobDetails?.job_role?.short_description}
                            </p>
                        </div>
                        <div className="flex justify-center max-w-xl mx-auto mt-3 p-2 flex-col">
                            {jobDetails &&
                                sections.map((section, index) => (
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
                                                <p className="text-gray-700">{jobDetails?.content[section.key]}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>
                        {loading ? (
                            <span className="flex justify-center items-center animate-spin">
                                <AiOutlineLoading3Quarters color="#000" size={30} />
                            </span>
                        ) : (
                            <p className="text-black text-center font-bold text-lg mt-5">Connect with Experts in this Role</p>
                        )}
                        <div className="flex justify-center max-w-xl mx-auto mt-3 p-2 flex-row gap-x-7">
                            {jobDetails &&
                                jobDetails.experts.map((expert, index) => (
                                    <div
                                        onClick={() => handlePopup(expert)}
                                        key={index}
                                        className="flex flex-col items-center bg-[#F3F3F3] p-3 shadow shadow-slate-400 rounded-md hover:cursor-pointer"
                                    >
                                        <img
                                            src={expert?.picture_url ?? "/assets/profile.jpeg"}
                                            alt="expert_image"
                                            width={22}
                                            height={22}
                                            className="w-22 h-22 object-cover"
                                        />
                                        <p className="mt-2 text-center text-black text-sm">{expert.name}</p>
                                    </div>
                                ))}
                        </div>
                        {!hideOnNavBarOpen && !loading && (
                            <div className="relative flex justify-center w-fit mx-auto p-2 flex-row gap-x-7 mt-8 hover:cursor-not-allowed">
                                {demoCurrentOpenings.map((openings, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col items-center bg-[#F3F3F3] p-3 shadow shadow-slate-400 rounded-md w-40"
                                    >
                                        <div className="w-22 h-22">
                                            <p className="text-black text-md">{openings.job_name}</p>
                                            <p className="text-slate-700 text-sm">{openings.company}</p>
                                        </div>
                                        <p className="mt-2 text-center text-blue-400 underline text-sm">Know More</p>
                                    </div>
                                ))}
                                {!loading && (
                                    <div className="absolute inset-0 bg-black opacity-40 flex items-center justify-center rounded-md">
                                        <FaLock size={40} />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
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
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black opacity-90"></div>
                    <div className="bg-white p-6 pt-4 rounded-lg shadow-lg w-[95%] max-h-[90vh] overflow-y-auto z-10 relative">
                        <div
                            onClick={closePopup}
                            className="flex justify-end cursor-pointer"
                        >
                            <RxCross1 color="red" size={20} />
                        </div>
                        {expertLoading ? (
                            <div className="flex justify-center items-center h-40">
                                <AiOutlineLoading3Quarters color="#000" size={30} className="animate-spin" />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <img
                                    src={selectedExpert?.photo_link ?? "/assets/profile.jpeg"}
                                    alt="expert_image"
                                    width={100}
                                    height={100}
                                    className="w-24 h-24 object-cover rounded-full mb-4"
                                />
                                <h2 className="text-lg font-bold text-black">{selectedExpert?.name}</h2>
                                <p className="text-sm text-gray-600 mb-2">Expert</p>
                                <p className="text-sm text-gray-700 mb-4 text-center">
                                    {selectedExpert?.description}
                                </p>
                                <div className="flex flex-wrap justify-center gap-2 mb-4">
                                    {selectedExpert?.can_help_in?.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                                <div className="w-full mb-4">
                                    {showCalendarEmbed && selectedExpert?.book_link ? (
                                        <>
                                            <div className="relative w-full h-[500px] bg-gray-100 rounded-md">
                                                <iframe
                                                    src={selectedExpert.book_link}
                                                    title="Book a Session with Calendly/Google"
                                                    className="w-full h-full rounded-md"
                                                    sandbox="allow-scripts allow-same-origin allow-forms allow-top-navigation"
                                                    onError={() => setShowCalendarEmbed(false)}
                                                ></iframe>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    window.open(selectedExpert?.book_link, "_blank");
                                                }}
                                                className="mt-2 text-blue-500 text-sm underline w-full text-center hover:cursor-pointer"
                                            >
                                                Open booking in new tab
                                            </button>
                                        </>
                                    ) : (
                                        <a
                                            href={selectedExpert?.book_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600 transition-colors inline-block w-full text-center"
                                        >
                                            Book a Session
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}