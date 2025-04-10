'use client';

import Navbar from "@/components/navbar";
import { useAuth } from "@/providers";
import { IoSend } from "react-icons/io5";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-fox-toast";

export default function ChatPage() {
    const { user, loading } = useAuth();
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: `Please wait...`,
        },
    ]);

    useEffect(() => {
        if (!loading && user?.uid) {
            setMessages([
                {
                    role: "assistant",
                    content: `Hello ${user?.displayName?.split(" ")[0]},<br>How can I help you today?`,
                },
            ])
        }
    }, [user, loading])

    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const chatContainerRef = useRef(null);

    // Real API call with demo fallback
    const fetchResponse = async (question) => {
        try {
            const options = {
                method: "GET",
                headers: { "User-Agent": "insomnia/11.0.2" },
            };
            const response = await fetch(
                `https://biocan-backend.onrender.com/ask?question=${encodeURIComponent(question)}`,
                options
            );
            if (!response.ok) {
                throw new Error("Failed to fetch response from the server.");
            }
            const data = await response.json();
            return data;
        } catch (err) {
            console.error("API error:", err);
            // Fallback demo response
            // const demoResponse = {
            //     response:
            //         "<p>To become a clinical data manager, follow these key steps:</p>\n<ol>\n<li><strong>Earn a Bachelor's Degree</strong>: Get a degree in life sciences, computer science, or a related field.</li>\n<li><strong>Gain Practical Experience</strong>: Seek internships or entry-level roles in clinical research or data management.</li>\n<li><strong>Develop Technical Skills</strong>: Learn software like SAS, SQL, or EDC systems.</li>\n<li><strong>Pursue Certifications</strong>: Consider certifications like CCDM from SCDM.</li>\n<li><strong>Stay Updated</strong>: Keep up with industry trends and regulations like GDPR or HIPAA.</li>\n</ol>",
            //     total_tokens: 1162,
            // };
            // return demoResponse;
            // Use this when API is down; remove when API is stable
            // throw err; // Uncomment when API is working to propagate real errors
            return ""
        }
    };

    // Handle sending a message
    const handleSendMessage = async () => {
        if (!input.trim()) return;

        // Add user message to state
        const userMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        try {
            // Fetch response
            const data = await fetchResponse(input);

            // Add assistant message
            const assistantMessage = {
                role: "assistant",
                content: data.response,
            };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (err) {
            console.error("Error fetching response:", err);
            toast.error("Failed to get a response. Please try again later.");
            const errorMessage = {
                role: "assistant",
                content: "Sorry, something went wrong. Please try again.",
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    // Auto-scroll to the latest message
    useEffect(() => {
        if (chatContainerRef.current) {
            //@ts-ignore
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    return (
        <div className="min-h-screen bg-[#fff] flex flex-col">
            <div className="sticky top-0">
                <Navbar />
            </div>
            <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-2">
                <div
                    ref={chatContainerRef}
                    className="flex-1 bg-[url(/assets/chat-bg.svg)] bg-cover bg-no-repeat shrink-0 bg-center rounded-lg shadow-md p-4 overflow-y-auto mb-2 max-h-[calc(100vh-200px)]"
                >
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"
                                }`}
                        >
                            <div
                                className={`inline-block p-3 rounded-lg max-w-[80%] sm:max-w-[60%] ${message.role === "user"
                                    ? "bg-[#F3F3F3] text-black rounded-br-none"
                                    : "text-black rounded-bl-none"
                                    }`}
                                dangerouslySetInnerHTML={{ __html: message.content }}
                            />
                        </div>
                    ))}
                    {isTyping && (
                        <div className="mb-4 text-left">
                            <div className="inline-block animate-pulse p-3 rounded-lg text-black rounded-bl-none max-w-[80%] sm:max-w-[60%]">
                                Thinking...
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex w-full justify-between shadow-md border-0 rounded-full bg-white">
                    <input
                        placeholder="Type your message"
                        className="flex-1 py-3 px-4 border-0 rounded-full focus:outline-none text-black bg-white"
                        value={input}
                        disabled={loading || isTyping}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSendMessage();
                        }}
                    />
                    <button
                        type="button"
                        className="p-2 rounded-full hover:cursor-pointer transition-colors"
                        onClick={handleSendMessage}
                    >
                        <IoSend color="#155dfc" size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}