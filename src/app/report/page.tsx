'use client';

import Navbar from "@/components/navbar";
import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// Define interfaces for the data structure
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

// interface ReportPageProps {
//     reportData?: ReportData;
// }

export default function ReportPage() {
    // Default data with type assertion
    const [data] = useState<ReportData>({
        mbti: {
            type: "INFP",
            traits: {
                Energy: "Introversion (I)",
                Information: "Intuition (N)",
                Decisions: "Feeling (F)",
                Structure: "Perceiving (P)"
            },
            description: "INFPs are imaginative idealists, guided by their own core values and beliefs..."
        },
        big_five: {
            traits: {
                Openness: "75%",
                Conscientiousness: "60%",
                Extraversion: "45%",
                Agreeableness: "80%",
                Neuroticism: "35%"
            },
            description: "This individual shows high openness to experience and agreeableness..."
        },
        strengths: [
            { point: "Creativity", description: "Ability to think outside the box..." },
            { point: "Empathy", description: "Strong understanding of others' feelings..." }
        ],
        weaknesses: [
            { point: "Procrastination", description: "Tendency to delay tasks..." },
            { point: "Over-sensitivity", description: "May take things too personally..." }
        ],
        career_aspects: [
            { heading: "Creative Fields", description: "Well-suited for artistic pursuits..." },
            { heading: "Helping Professions", description: "Excels in roles that support others..." }
        ]
    });

    // Big Five chart data with proper typing
    const bigFiveChartData = {
        labels: Object.keys(data.big_five.traits),
        datasets: [{
            label: 'Personality Scores',
            data: Object.values(data.big_five.traits).map(val => parseInt(val)),
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 2,
        }]
    };

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                title: {
                    display: true,
                    text: 'Percentage'
                }
            }
        },
        plugins: {
            legend: {
                position: 'top' as const,
            },
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="sticky top-0 z-10">
                <Navbar />
            </div>

            <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Personality Report</h1>
                    <p className="text-gray-600 mt-2">A comprehensive analysis of your personality traits</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">MBTI: {data.mbti.type}</h2>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {Object.entries(data.mbti.traits).map(([key, value]) => (
                            <div key={key} className="bg-blue-50 p-3 rounded-md">
                                <span className="font-medium text-blue-800">{key}:</span>
                                <span className="ml-2 text-blue-600">{value}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-gray-600">{data.mbti.description}</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Big Five Traits</h2>
                    <div className="max-w-2xl mx-auto">
                        <Bar data={bigFiveChartData} options={chartOptions} />
                    </div>
                    <p className="text-gray-600 mt-4">{data.big_five.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-semibold text-green-800 mb-4">Strengths</h2>
                        {data.strengths.map((strength, index) => (
                            <div key={index} className="mb-4 last:mb-0">
                                <h3 className="text-lg font-medium text-green-700">{strength.point}</h3>
                                <p className="text-gray-600">{strength.description}</p>
                            </div>
                        ))}
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-semibold text-red-800 mb-4">Weaknesses</h2>
                        {data.weaknesses.map((weakness, index) => (
                            <div key={index} className="mb-4 last:mb-0">
                                <h3 className="text-lg font-medium text-red-700">{weakness.point}</h3>
                                <p className="text-gray-600">{weakness.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Career Aspects</h2>
                    <div className="space-y-4">
                        {data.career_aspects.map((aspect, index) => (
                            <div key={index}>
                                <h3 className="text-lg font-medium text-gray-700">{aspect.heading}</h3>
                                <p className="text-gray-600">{aspect.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="sticky bottom-0 bg-transparent flex items-center justify-center p-4">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors hover:cursor-pointer shadow shadow-black">
                    See Suggested Jobs
                </button>
            </div>
        </div>
    );
}