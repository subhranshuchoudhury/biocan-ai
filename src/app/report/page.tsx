'use client';

import Navbar from "@/components/navbar";
import { useEffect, useState } from "react";
import { Radar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    RadialLinearScale,
    PointElement,
    LineElement
} from "chart.js";
import { useAuth } from "@/providers";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/configs";
import { useRouter } from "next/navigation"; // Add router for redirection

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    RadialLinearScale,
    PointElement,
    LineElement
);

// Define interfaces
interface MBTITraits {
    Energy: string;
    Information: string;
    Decisions: string;
    Structure: string;
}

interface MBTI {
    type: string;
    traits: MBTITraits;
    description: string;
}

interface BigFiveTraits {
    Openness: string;
    Conscientiousness: string;
    Extraversion: string;
    Agreeableness: string;
    Neuroticism: string;
}

interface BigFive {
    traits: BigFiveTraits;
    description: string;
}

interface StrengthWeakness {
    point: string;
    description: string;
}

interface CareerAspect {
    heading: string;
    description: string;
}

interface ReportData {
    mbti: MBTI;
    big_five: BigFive;
    strengths: StrengthWeakness[];
    weaknesses: StrengthWeakness[];
    career_aspects: CareerAspect[];
}

// Default empty data structure
const defaultData: ReportData = {
    mbti: {
        type: "",
        traits: { Energy: "", Information: "", Decisions: "", Structure: "" },
        description: ""
    },
    big_five: {
        traits: { Openness: "0", Conscientiousness: "0", Extraversion: "0", Agreeableness: "0", Neuroticism: "0" },
        description: ""
    },
    strengths: [],
    weaknesses: [],
    career_aspects: []
};

export default function ReportPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [data, setData] = useState<ReportData>(defaultData);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkUserReport = async () => {
            if (!user?.uid) {
                return;
            }

            try {
                const reportRef = doc(db, "reports", user.uid);
                const reportSnap = await getDoc(reportRef);

                if (reportSnap.exists()) {
                    setData(reportSnap.data().apiResponse as ReportData);
                } else {
                    router.replace('/assessment');
                }
            } catch (error) {
                console.error("Error fetching report:", error);
                router.push('/assessment');
            } finally {
                setIsLoading(false);
            }
        };
        checkUserReport();
    }, [user, router]);

    // Big Five radar chart data
    const bigFiveChartData = {
        labels: Object.keys(data.big_five.traits),
        datasets: [{
            label: 'Big Five Traits',
            data: Object.values(data.big_five.traits).map(val => parseFloat(val) || 0),
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 2,
            pointBackgroundColor: 'rgb(59, 130, 246)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(59, 130, 246)'
        }]
    };

    const chartOptions = {
        scales: {
            r: {
                beginAtZero: true,
                min: 0,
                max: 100,
                ticks: {
                    stepSize: 20,
                    callback: (value: number) => `${value}%`
                },
                pointLabels: {
                    font: {
                        size: 14
                    }
                }
            }
        },
        plugins: {
            legend: {
                position: 'top' as const,
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => `${context.dataset.label}: ${context.raw}%`
                }
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading report...</p>
                </div>
            </div>
        );
    }

    const order = ["Energy", "Information", "Decisions", "Structure"];
    const colors = ["bg-green-100", "bg-sky-100", "bg-red-100", "bg-yellow-100"];

    const sortedTraits = order.map((key, index) => ({
        key,
        value: data.mbti.traits[key],
        bgColor: colors[index]
    }));






    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="sticky top-0 z-10">
                <Navbar />
            </div>

            <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">{user?.displayName?.split(" ")?.[0]}'s Report</h1>
                    <p className="text-gray-600 mt-2">A comprehensive analysis of your personality traits</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        MBTI: <span className="text-blue-600 font-medium">{data.mbti.type}</span>
                    </h2>
                    <div className="grid grid-cols-1 gap-4 mb-4">
                        {sortedTraits.map(({ key, value, bgColor }) => (
                            <div key={key} className={`${bgColor} p-3 rounded-md justify-between flex`}>
                                <span className="font-bold text-blue-800">{key}</span>
                                <span className="ml-2 text-black">{value}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-gray-600">{data.mbti.description}</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Big Five Traits</h2>
                    <div className="max-w-2xl mx-auto flex justify-center">
                        {
                            //@ts-ignore
                            <Radar data={bigFiveChartData} options={chartOptions} />
                        }

                    </div>
                    <p className="text-gray-600 mt-4">{data.big_five.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-semibold text-green-800 mb-4">Strengths</h2>
                        {data.strengths.length > 0 ? data.strengths.map((strength, index) => (
                            <div key={index} className="mb-4 last:mb-0">
                                <h3 className="text-lg font-medium text-green-700">{strength.point}</h3>
                                <p className="text-gray-600">{strength.description}</p>
                            </div>
                        )) : (
                            <p className="text-gray-600">No strengths data available</p>
                        )}
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-semibold text-red-800 mb-4">Weaknesses</h2>
                        {data.weaknesses.length > 0 ? data.weaknesses.map((weakness, index) => (
                            <div key={index} className="mb-4 last:mb-0">
                                <h3 className="text-lg font-medium text-red-700">{weakness.point}</h3>
                                <p className="text-gray-600">{weakness.description}</p>
                            </div>
                        )) : (
                            <p className="text-gray-600">No weaknesses data available</p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Career Aspects</h2>
                    <div className="space-y-4">
                        {data.career_aspects.length > 0 ? data.career_aspects.map((aspect, index) => (
                            <div key={index}>
                                <h3 className="text-lg font-medium text-gray-700">{aspect.heading}</h3>
                                <p className="text-gray-600">{aspect.description}</p>
                            </div>
                        )) : (
                            <p className="text-gray-600">No career aspects data available</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="sticky bottom-0 bg-transparent flex items-center justify-center p-4">
                <button onClick={() => router.push('/roadmap')} className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors hover:cursor-pointer shadow shadow-black">
                    Explore Suggested Jobs
                </button>
            </div>
        </div>
    );
}