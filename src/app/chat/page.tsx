'use client';

import Navbar from "@/components/navbar";
import { useState, useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import Select from 'react-select';

interface Question {
    id: string;
    question: string;
    inputType: string;
    options?: string[];
    fields?: Question[];
}

interface Section {
    id: string;
    section: string;
    questions: Question[];
    showOnlyWhen?: { [key: string]: string };
}

const sections: Section[] = [
    {
        id: "SEC1",
        section: "Basic Info",
        questions: [
            { id: "S1QID1", question: "What is your name?", inputType: "text" },
            { id: "S1QID2", question: "What is your gender?", inputType: "radio", options: ["Male", "Female", "Other"] },
            { id: "S1QID3", question: "What is your dob?", inputType: "date" },
            { id: "S1QID4", question: "What is your city name?", inputType: "dropdown", options: ["City-1", "City-2"] },
        ]
    },
    {
        id: "SEC2",
        section: "Academic Info",
        questions: [
            { id: "A1QID1", question: "What is your highest level of education?", inputType: "dropdown", options: ["High School", "Diploma", "Bachelor's", "Master's", "Ph.D."] },
            { id: "A1QID2", question: "Which university or institution did you attend?", inputType: "text" },
            { id: "A1QID3", question: "What was your major or field of study?", inputType: "dropdown", options: ["Computer Science", "Engineering", "Business", "Arts", "Science", "Other"] },
            { id: "A1QID4", question: "What year did you graduate (or are expected to graduate)?", inputType: "date" },
            { id: "A1QID5", question: "Did you receive any honors or distinctions?", inputType: "radio", options: ["Yes", "No"] },
            { id: "A1QID6", question: "Have you completed any certifications or professional courses?", inputType: "text" },
            { id: "A1QID7", question: "Are you currently pursuing further education?", inputType: "radio", options: ["Yes", "No"] },
            { id: "A1QID8", question: "What was your favorite subject during your studies?", inputType: "text" },
            { id: "A1QID9", question: "What was the biggest challenge you faced during your education?", inputType: "text" },
            { id: "A1QID10", question: "Do you have any academic publications or projects you'd like to share?", inputType: "text" },
        ]
    },
    {
        id: "SEC3",
        section: "Employment History",
        showOnlyWhen: { "A1QID7": "No" },
        questions: [
            {
                id: "E1QID1",
                question: "Employment history",
                inputType: "array",
                fields: [
                    { id: "JobID", question: "Job Title", inputType: "text" },
                    { id: "CompanyID", question: "Company Name", inputType: "text" },
                    { id: "LocationID", question: "Job Location", inputType: "text" },
                    { id: "StartDateID", question: "Start Date", inputType: "date" },
                    { id: "EndDateID", question: "End Date", inputType: "date" },
                    { id: "ResponsibilitiesID", question: "Key Responsibilities", inputType: "textarea" }
                ]
            }
        ]
    },

];

interface ChatMessage {
    type: string;
    content: string;
    isEmploymentField?: boolean;
    isEmploymentSection?: boolean;
    entryNumber?: number;
}

interface EmploymentEntry {
    [key: string]: string;
}

export default function ChatPage() {
    const [responses, setResponses] = useState<{ [key: string]: any }>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [textInput, setTextInput] = useState<string>('');
    const [textareaInput, setTextareaInput] = useState<string>('');
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [dateInput, setDateInput] = useState<string>('');
    const [employmentEntries, setEmploymentEntries] = useState<EmploymentEntry[]>([]);
    const [currentEmploymentEntry, setCurrentEmploymentEntry] = useState<EmploymentEntry>({});
    const [currentFieldIndex, setCurrentFieldIndex] = useState<number>(0);
    const [showAddMorePrompt, setShowAddMorePrompt] = useState<boolean>(false);
    const [inArrayInput, setInArrayInput] = useState<boolean>(false);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [entryCount, setEntryCount] = useState<number>(0);

    // Filter sections based on conditions
    const getVisibleSections = (): Section[] => {
        return sections.filter(section => {
            if (!section.showOnlyWhen) return true;
            return Object.entries(section.showOnlyWhen).every(([questionId, requiredAnswer]) =>
                responses[questionId] === requiredAnswer
            );
        });
    };

    const allQuestions: Question[] = getVisibleSections().flatMap(section => section.questions);
    const currentQuestion: Question | undefined = allQuestions[currentQuestionIndex];
    const chatEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

    const handleInputChange = (value: any) => {
        if (inArrayInput) {
            setCurrentEmploymentEntry(prev => ({
                ...prev,
                [sections.find(s => s.id === "SEC3")!.questions[0].fields![currentFieldIndex].id]: value
            }));
        } else {
            setResponses({ ...responses, [currentQuestion!.id]: value });
        }
    };

    const handleNext = () => {
        let value: any;

        if (inArrayInput) {
            const currentField = sections.find(s => s.id === "SEC3")!.questions[0].fields![currentFieldIndex];

            switch (currentField.inputType) {
                case 'text':
                    value = textInput;
                    break;
                case 'textarea':
                    value = textareaInput;
                    break;
                case 'date':
                    value = dateInput;
                    break;
                default:
                    value = '';
            }

            if (!value) {
                alert('Please answer the question.');
                return;
            }

            const updatedEntry = {
                ...currentEmploymentEntry,
                [currentField.id]: value
            };
            setCurrentEmploymentEntry(updatedEntry);

            setChatMessages(prev => [
                ...prev,
                {
                    type: "question",
                    content: currentField.question,
                    isEmploymentField: true,
                    entryNumber: entryCount
                },
                {
                    type: "answer",
                    content: value,
                    isEmploymentField: true,
                    entryNumber: entryCount
                }
            ]);

            setTextInput('');
            setTextareaInput('');
            setDateInput('');

            if (currentFieldIndex < sections.find(s => s.id === "SEC3")!.questions[0].fields!.length - 1) {
                setCurrentFieldIndex(currentFieldIndex + 1);
            } else {
                const updatedEntries = [...employmentEntries, updatedEntry];
                setEmploymentEntries(updatedEntries);
                setResponses({
                    ...responses,
                    [sections.find(s => s.id === "SEC3")!.questions[0].id]: updatedEntries
                });
                setCurrentEmploymentEntry({});
                setCurrentFieldIndex(0);
                setShowAddMorePrompt(true);
            }
        } else {
            switch (currentQuestion!.inputType) {
                case 'text':
                    value = textInput;
                    break;
                case 'dropdown':
                    value = selectedOption;
                    break;
                case 'date':
                    value = dateInput;
                    break;
                case 'radio':
                    value = responses[currentQuestion!.id];
                    break;
                case 'array':
                    setInArrayInput(true);
                    setChatMessages(prev => [
                        ...prev,
                        {
                            type: "question",
                            content: currentQuestion!.question,
                            isEmploymentSection: true
                        },
                        {
                            type: "system",
                            content: "Let's fill in details for Employment Entry #1"
                        }
                    ]);
                    return;
                default:
                    value = '';
            }

            if (!value) {
                alert('Please answer the question.');
                return;
            }

            setChatMessages(prev => [
                ...prev,
                { type: "question", content: currentQuestion!.question },
                { type: "answer", content: value }
            ]);

            setTextInput('');
            setSelectedOption(null);
            setDateInput('');

            if (currentQuestionIndex < allQuestions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                alert('All questions completed. Submitting...');
                console.log(responses);
            }
        }

        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 0);
    };

    const handleAddMoreEmployment = (addMore: boolean) => {
        setShowAddMorePrompt(false);

        if (addMore) {
            setInArrayInput(true);
            setEntryCount(entryCount + 1);
            setChatMessages(prev => [
                ...prev,
                { type: "question", content: "Would you like to add another employment entry?" },
                { type: "answer", content: "Yes" },
                { type: "system", content: `Let's fill in details for Employment Entry #${entryCount + 1}` }
            ]);
        } else {
            setChatMessages(prev => [
                ...prev,
                { type: "question", content: "Would you like to add another employment entry?" },
                { type: "answer", content: "No" }
            ]);
            setInArrayInput(false);
            if (currentQuestionIndex < allQuestions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                alert('All questions completed. Submitting...');
                console.log(responses);
            }
        }

        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 0);
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [responses, currentQuestionIndex, currentFieldIndex, inArrayInput, showAddMorePrompt]);

    useEffect(() => {
        if (chatMessages.length === 0 && currentQuestionIndex >= 0) {
            const initialMessages: ChatMessage[] = [];
            for (let i = 0; i < currentQuestionIndex; i++) {
                const q = allQuestions[i];
                initialMessages.push({ type: "question", content: q.question });
                if (responses[q.id]) {
                    initialMessages.push({ type: "answer", content: responses[q.id] });
                }
            }
            if (!inArrayInput && currentQuestionIndex < allQuestions.length) {
                initialMessages.push({ type: "question", content: allQuestions[currentQuestionIndex].question });
            }
            setChatMessages(initialMessages);
        }
    }, [responses]); // Update when responses change to reflect section visibility

    const handleTextKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && textInput) {
            handleInputChange(textInput);
            handleNext();
        }
    };

    const renderCurrentQuestion = (): string => {
        if (showAddMorePrompt) return "Would you like to add another employment entry?";
        if (inArrayInput) return sections.find(s => s.id === "SEC3")!.questions[0].fields![currentFieldIndex].question;
        return currentQuestion?.question || '';
    };

    const renderArrayInputField = () => {
        const currentField = sections.find(s => s.id === "SEC3")!.questions[0].fields![currentFieldIndex];

        switch (currentField.inputType) {
            case 'text':
                return (
                    <div className="flex w-full justify-between shadow-md border-0 rounded-full bg-white">
                        <input
                            ref={inputRef as React.RefObject<HTMLInputElement>}
                            value={textInput}
                            placeholder="Type your response"
                            className="flex-1 py-3 px-4 border-0 rounded-full focus:outline-none text-black bg-white"
                            onChange={(e) => {
                                setTextInput(e.target.value);
                                handleInputChange(e.target.value);
                            }}
                            onKeyPress={handleTextKeyPress}
                        />
                        <button type="button" className="p-2 rounded-full hover:cursor-pointer transition-colors" onClick={handleNext}>
                            <IoSend color="#155dfc" size={20} />
                        </button>
                    </div>
                );
            case 'textarea':
                return (
                    <div className="flex w-full flex-col bg-white p-4 rounded-lg shadow-md">
                        <textarea
                            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                            value={textareaInput}
                            placeholder="Type your response"
                            className="w-full p-2 border rounded mb-4 min-h-[100px] focus:outline-none focus:border-blue-500"
                            onChange={(e) => {
                                setTextareaInput(e.target.value);
                                handleInputChange(e.target.value);
                            }}
                        />
                        <div className="flex justify-end">
                            <button type="button" className="py-2 px-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors" onClick={handleNext}>
                                Next
                            </button>
                        </div>
                    </div>
                );
            case 'date':
                return (
                    <div className="flex w-full flex-col bg-white p-4 rounded-lg shadow-md">
                        <input
                            ref={inputRef as React.RefObject<HTMLInputElement>}
                            type="date"
                            value={dateInput}
                            className="w-full p-2 border rounded mb-4 focus:outline-none focus:border-blue-500"
                            onChange={(e) => {
                                setDateInput(e.target.value);
                                handleInputChange(e.target.value);
                            }}
                        />
                        <div className="flex justify-end">
                            <button type="button" className="py-2 px-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors" onClick={handleNext}>
                                Next
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const renderAddMorePrompt = () => (
        <div className="flex w-full flex-col bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-center gap-4 mb-4">
                <button type="button" className="py-2 px-6 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors" onClick={() => handleAddMoreEmployment(true)}>
                    Yes
                </button>
                <button type="button" className="py-2 px-6 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors" onClick={() => handleAddMoreEmployment(false)}>
                    No
                </button>
            </div>
        </div>
    );

    const renderInputField = () => {
        if (showAddMorePrompt) return renderAddMorePrompt();
        if (inArrayInput) return renderArrayInputField();
        if (!currentQuestion) return null;

        switch (currentQuestion.inputType) {
            case 'text':
                return (
                    <div className="flex w-full justify-between shadow-md border-0 rounded-full bg-white">
                        <input
                            ref={inputRef as React.RefObject<HTMLInputElement>}
                            value={textInput}
                            placeholder="Type your response"
                            className="flex-1 py-3 px-4 border-0 rounded-full focus:outline-none text-black bg-white"
                            onChange={(e) => {
                                setTextInput(e.target.value);
                                handleInputChange(e.target.value);
                            }}
                            onKeyPress={handleTextKeyPress}
                        />
                        <button type="button" className="p-2 rounded-full hover:cursor-pointer transition-colors" onClick={handleNext}>
                            <IoSend color="#155dfc" size={20} />
                        </button>
                    </div>
                );
            case 'radio':
                return (
                    <div className="flex flex-col w-full bg-white p-4 rounded-lg shadow-md">
                        <div className="flex flex-wrap gap-4 mb-4">
                            {currentQuestion.options?.map((option) => (
                                <label key={option} className="flex items-center space-x-2 cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="radio"
                                            name={currentQuestion.id}
                                            value={option}
                                            className="appearance-none w-5 h-5 rounded-full border-2 border-blue-500 checked:border-blue-500 checked:bg-white focus:outline-none cursor-pointer"
                                            onChange={(e) => handleInputChange(e.target.value)}
                                            checked={responses[currentQuestion.id] === option}
                                        />
                                        <div className="absolute inset-0 pointer-events-none rounded-full flex items-center justify-center transition-all text-white">
                                            {responses[currentQuestion.id] === option && (
                                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-black">{option}</span>
                                </label>
                            ))}
                        </div>
                        <div className="flex justify-end">
                            <button type="button" className="py-2 px-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors" onClick={handleNext}>
                                Next
                            </button>
                        </div>
                    </div>
                );
            case 'date':
                return (
                    <div className="flex w-full flex-col bg-white p-4 rounded-lg shadow-md">
                        <input
                            ref={inputRef as React.RefObject<HTMLInputElement>}
                            type="date"
                            value={dateInput}
                            className="w-full p-2 border rounded mb-4 focus:outline-none focus:border-blue-500"
                            onChange={(e) => {
                                setDateInput(e.target.value);
                                handleInputChange(e.target.value);
                            }}
                        />
                        <div className="flex justify-end">
                            <button type="button" className="py-2 px-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors" onClick={handleNext}>
                                Next
                            </button>
                        </div>
                    </div>
                );
            case 'dropdown':
                return (
                    <div className="flex w-full flex-col bg-white p-4 rounded-lg shadow-md">
                        <Select
                            ref={inputRef as any}
                            options={currentQuestion.options?.map(option => ({ value: option, label: option }))}
                            onChange={(option) => {
                                setSelectedOption(option?.value || null);
                                handleInputChange(option?.value || null);
                            }}
                            value={selectedOption ? { value: selectedOption, label: selectedOption } : null}
                            className="mb-4"
                            placeholder="Select an option"
                        />
                        <div className="flex justify-end">
                            <button type="button" className="py-2 px-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors" onClick={handleNext}>
                                Next
                            </button>
                        </div>
                    </div>
                );
            case 'array':
                return (
                    <div className="flex w-full justify-between shadow-md border-0 rounded-full bg-white">
                        <div className="flex-1 py-3 px-4 text-gray-500">Let's start with your employment history</div>
                        <button type="button" className="p-2 rounded-full hover:cursor-pointer transition-colors" onClick={handleNext}>
                            <IoSend color="#155dfc" size={20} />
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#F2EFE7] flex flex-col">
            <Navbar />
            <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-2">
                <div className="flex-1 bg-[#f5f5f5] rounded-lg shadow-md p-4 overflow-y-auto mb-2 max-h-[calc(100vh-200px)]">
                    {chatMessages.map((message, idx) => (
                        <div key={idx}>
                            {message.type === "question" && (
                                <div className="mb-4 text-left">
                                    <div className="inline-block p-3 rounded-lg bg-[#2973B2] text-white rounded-bl-none max-w-[80%] sm:max-w-[60%]">
                                        {message.content}
                                    </div>
                                </div>
                            )}
                            {message.type === "answer" && (
                                <div className="mb-4 text-right">
                                    <div className="inline-block p-3 rounded-lg bg-white text-black rounded-br-none max-w-[80%] sm:max-w-[60%]">
                                        {message.content}
                                    </div>
                                </div>
                            )}
                            {message.type === "system" && (
                                <div className="mb-4 text-center">
                                    <div className="inline-block p-2 rounded-md bg-gray-200 text-gray-700 text-sm">
                                        {message.content}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {!showAddMorePrompt && inArrayInput && (
                        <div className="mb-4 text-left">
                            <div className="inline-block p-3 rounded-lg bg-[#2973B2] text-white rounded-bl-none max-w-[80%] sm:max-w-[60%]">
                                {sections.find(s => s.id === "SEC3")!.questions[0].fields![currentFieldIndex].question}
                            </div>
                        </div>
                    )}

                    {!inArrayInput && currentQuestionIndex < allQuestions.length &&
                        !chatMessages.some(msg => msg.type === "question" && msg.content === currentQuestion?.question) && (
                            <div className="mb-4 text-left">
                                <div className="inline-block p-3 rounded-lg bg-[#2973B2] text-white rounded-bl-none max-w-[80%] sm:max-w-[60%]">
                                    {currentQuestion?.question}
                                </div>
                            </div>
                        )}

                    {showAddMorePrompt && (
                        <div className="mb-4 text-left">
                            <div className="inline-block p-3 rounded-lg bg-[#2973B2] text-white rounded-bl-none max-w-[80%] sm:max-w-[60%]">
                                Would you like to add another employment entry?
                            </div>
                        </div>
                    )}

                    <div ref={chatEndRef} />
                </div>

                <div className="sticky bottom-0 bg-transparent flex items-center gap-2 mt-2">
                    {renderInputField()}
                </div>
            </div>
        </div>
    );
}