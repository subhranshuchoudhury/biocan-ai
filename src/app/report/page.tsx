'use client';

import Navbar from "@/components/navbar";
import { useState } from "react";
import { Radar } from "react-chartjs-2"; // Replace Bar with Radar
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    RadialLinearScale, // Add for radar chart
    PointElement,      // Add for radar chart
    LineElement        // Add for radar chart
} from "chart.js";

// Register ChartJS components, including radar-specific ones
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    RadialLinearScale, // Required for radar chart
    PointElement,      // Required for radar chart
    LineElement        // Required for radar chart
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

export default function ReportPage() {
    // Default data with type assertion
    const [data] = useState<ReportData>({
        "mbti": {
            "type": "ENTP",
            "traits": {
                "Energy": "Extraversion (E)",
                "Information": "Intuition (N)",
                "Decisions": "Thinking (T)",
                "Structure": "Perceiving (P)"
            },
            "description": "ENTPs are known for their innovative and entrepreneurial spirit, often generating new ideas and exploring possibilities. They are charismatic and adaptable, with a passion for learning and discussing complex concepts."
        },
        "strengths": [
            {
                "point": "Strategic Thinking",
                "description": "ENTPs have the ability to think critically and strategically, often finding creative solutions to complex problems."
            },
            {
                "point": "Effective Communication",
                "description": "ENTPs are skilled communicators, able to articulate their ideas and thoughts in a clear and engaging manner."
            },
            {
                "point": "Adaptability",
                "description": "ENTPs are highly adaptable, able to adjust to new situations and challenges with ease."
            },
            {
                "point": "Innovative Problem-Solving",
                "description": "ENTPs are known for their innovative approach to problem-solving, often finding unique and effective solutions."
            },
            {
                "point": "Charisma",
                "description": "ENTPs have a natural charm and charisma, able to inspire and motivate others with their enthusiasm and passion."
            }
        ],
        "weaknesses": [
            {
                "point": "Disorganization",
                "description": "ENTPs often struggle with organization and planning, preferring to focus on the big picture rather than the details."
            },
            {
                "point": "Impatience",
                "description": "ENTPs can be impatient, often becoming bored or restless if they are not challenged or stimulated."
            },
            {
                "point": "Overthinking",
                "description": "ENTPs can overthink and analyze situations, sometimes leading to indecision and inaction."
            },
            {
                "point": "Insensitivity",
                "description": "ENTPs can be insensitive to the feelings and needs of others, prioritizing their own ideas and interests."
            },
            {
                "point": "Restlessness",
                "description": "ENTPs can be restless and easily distracted, often moving from one project or idea to another without completing the previous one."
            }
        ],
        "career_aspects": [
            {
                "heading": "Entrepreneurship",
                "description": "ENTPs are well-suited to careers in entrepreneurship, where they can use their innovative thinking and charisma to launch and grow their own businesses."
            },
            {
                "heading": "Consulting",
                "description": "ENTPs make excellent consultants, using their strategic thinking and communication skills to help organizations solve complex problems and improve their operations."
            },
            {
                "heading": "Research and Development",
                "description": "ENTPs are drawn to careers in research and development, where they can explore new ideas and technologies, and develop innovative solutions to real-world problems."
            }
        ],
        "big_five": {
            "traits": {
                "Openness": "19.2%",
                "Conscientiousness": "19.2%",
                "Extraversion": "38.4%",
                "Agreeableness": "57.6%",
                "Neuroticism": "19.2%"
            },
            "description": "This personality is suitable for many careers and shows balanced traits."
        }
    });

    // Big Five radar chart data with proper typing
    const bigFiveChartData = {
        labels: Object.keys(data.big_five.traits),
        datasets: [{
            label: 'Big Five Traits',
            data: Object.values(data.big_five.traits).map(val => parseFloat(val)), // Parse percentage strings to numbers
            backgroundColor: 'rgba(59, 130, 246, 0.2)', // Semi-transparent fill
            borderColor: 'rgb(59, 130, 246)',           // Solid border
            borderWidth: 2,
            pointBackgroundColor: 'rgb(59, 130, 246)',  // Point fill
            pointBorderColor: '#fff',                   // Point border
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(59, 130, 246)'
        }]
    };

    // Radar chart options
    const chartOptions = {
        scales: {
            r: {
                beginAtZero: true,
                min: 0,
                max: 100,
                ticks: {
                    stepSize: 20, // Increments of 20 (0, 20, 40, 60, 80, 100)
                    callback: (value: number) => `${value}%` // Add % to ticks
                },
                pointLabels: {
                    font: {
                        size: 14 // Larger labels for readability
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">MBTI: <span className="text-blue-600 font-medium">
                        {data.mbti.type}
                    </span></h2>
                    <div className="grid grid-cols-1 gap-4 mb-4">
                        {Object.entries(data.mbti.traits).map(([key, value]) => (
                            <div key={key} className="bg-blue-50 p-3 rounded-md justify-between flex">
                                <span className="font-bold text-blue-800">{key}</span>
                                <span className="ml-2 text-blue-600">{value}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-gray-600">{data.mbti.description}</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Big Five Traits</h2>
                    <div className="max-w-2xl mx-auto">
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