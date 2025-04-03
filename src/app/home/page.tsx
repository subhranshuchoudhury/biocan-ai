// pages/index.tsx
'use client';

import { useState, useEffect, FormEvent, useRef } from 'react';
import Select, { SingleValue } from 'react-select';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { IoSend } from 'react-icons/io5';
import { useAuth } from '@/providers';
import { db } from '@/configs';
import Navbar from '@/components/navbar';

// Types
interface ChatMessage {
  text: string;
  isBot: boolean;
  cards?: Card[];
}

interface Card {
  id: number;
  title: string;
  description: string;
}

interface User {
  uid: string;
  displayName?: string;
}

interface SelectOption {
  value: string;
  label: string;
}

const Home = () => {
  const { user } = useAuth();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [chatCompleted, setChatCompleted] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const predefinedQuestions: string[] = [
    "Hello! How would you describe your personality?",
    "What are your strongest skills?",
    "What type of work environment do you prefer?",
    "What are your career goals?"
  ];

  const demoCards: Card[] = [
    { id: 1, title: "Team Player", description: "Works well in groups" },
    { id: 2, title: "Creative", description: "Innovative thinker" },
    { id: 3, title: "Analytical", description: "Problem solver" },
  ];

  useEffect(() => {
    const checkPreviousChat = async () => {
      if (user) {
        const docRef = doc(db, "chats", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setHasSubmitted(true);
        } else {
          setChatMessages([{ text: `Hello ${user.displayName || 'User'}, How can I help you today?`, isBot: true }]);
        }
      }
    };
    checkPreviousChat();
  }, [user]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleChatSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setChatMessages(prev => [...prev, { text: userInput, isBot: false }]);

    const currentIndex = Math.floor(chatMessages.length / 2);
    if (currentIndex === 2) {
      setChatMessages(prev => [...prev, {
        text: "Here are some traits you might identify with:",
        isBot: true,
        cards: demoCards
      }]);
    } else if (currentIndex < predefinedQuestions.length) {
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          text: predefinedQuestions[currentIndex],
          isBot: true
        }]);
      }, 1000);
    } else {
      setChatCompleted(true);
    }
    setUserInput('');
  };

  const handleFinalSubmit = async () => {
    if (user) {
      // await setDoc(doc(db, "chats", user.uid), {
      //   messages: chatMessages,
      //   timestamp: new Date().toISOString(),
      //   userId: user.uid
      // });
      setHasSubmitted(true);
    }
  };

  if (hasSubmitted) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex justify-center items-center mt-20 px-4">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">{user?.displayName || "User"}'s Assessment Report</h2>
            <div className="space-y-4">
              <a href="#" className="block text-blue-600 hover:underline">View my Personality Report</a>
              <a href="#" className="block text-blue-600 hover:underline">Proceed to Suggested Jobs</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2EFE7] flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-2">
        <div className="my-4 flex justify-center">
          <Select
            instanceId={1}
            options={[{ value: 'assessment', label: 'Assessments' } as SelectOption]}
            defaultValue={{ value: 'assessment', label: 'Assessments' } as SelectOption}
            className="w-full max-w-xs"
            // isDisabled={true}
            onChange={(option: SingleValue<SelectOption>) => { }}
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: '#D9D9D9',
                border: 'none',
                boxShadow: 'none',
                fontSize: '16px',
                padding: '2px 0',
              }),
              singleValue: (base) => ({
                ...base,
                color: '#000',
                fontWeight: '500',
              }),
              dropdownIndicator: (base) => ({
                ...base,
                color: '#000',
              }),
            }}
          />
        </div>

        <div
          className="flex-1 bg-[#f5f5f5] rounded-lg shadow-md p-4 overflow-y-auto mb-2"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e0e0e0' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '20px 20px',
          }}
          ref={chatContainerRef}
        >
          {chatMessages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.isBot ? 'text-left' : 'text-right'}`}>
              <div className={`inline-block p-3 rounded-lg ${message.isBot
                ? 'bg-[#2973B2] text-white rounded-bl-none'
                : 'bg-[#48A6A7] text-white rounded-br-none'
                } max-w-[80%] sm:max-w-[60%]`}>
                {message.text}
              </div>
              {message.cards && (
                <div className="flex overflow-x-auto mt-2 gap-2">
                  {message.cards.map((card: Card) => (
                    <div key={card.id} className="min-w-[200px] bg-white p-3 rounded-lg">
                      <h3 className="font-bold text-black">{card.title}</h3>
                      <p className='text-black'>{card.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {!chatCompleted ? (
          <form onSubmit={handleChatSubmit} className="sticky bottom-0 bg-transparent flex items-center gap-2">
            <div
              className="flex w-full justify-between shadow-md border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800 bg-white" // Added text color and background
            >
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your message"
                className="flex-1 p-2 border-0 rounded-full focus:outline-none focus:ring-0 focus:ring-blue-300 text-gray-800 bg-white" // Added text color and background
              />
              <button
                type="submit"
                className="text-white p-2 rounded-full hover:cursor-pointer transition-colors"
              >
                <IoSend color='#155dfc' size={20} />
              </button>
            </div>
          </form>
        ) : (
          <div className="sticky bottom-0 bg-white p-4 rounded-lg shadow-md flex justify-between">
            <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors">
              Preview
            </button>
            <button
              onClick={handleFinalSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div >
  );
};



export default Home;