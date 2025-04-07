'use client';

import Navbar from "@/components/navbar";
import { enrichDataWithQuestions } from "@/helper/enrich";
import { getMBTIScore } from "@/helper/mbti-score";
import { sections } from "@/questions/question";
import { useState, useEffect, useRef } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoSend } from "react-icons/io5";
import Select from 'react-select';
import { Question, Section } from "types/chat";


interface ChatMessage {
  type: string;
  content: string;
  sectionId?: string;
  isArrayField?: boolean;
  entryNumber?: number;
}

interface ArrayEntry {
  [key: string]: string;
  sectionId: string;
}

export default function ChatPage() {
  const [responses, setResponses] = useState<{ [key: string]: any }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [textInput, setTextInput] = useState<string>('');
  const [textareaInput, setTextareaInput] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [dateInput, setDateInput] = useState<string>('');
  const [checkboxSelections, setCheckboxSelections] = useState<string[]>([]);
  const [arrayEntries, setArrayEntries] = useState<{ [sectionId: string]: ArrayEntry[] }>({});
  const [currentArrayEntry, setCurrentArrayEntry] = useState<ArrayEntry>({ sectionId: '' });
  const [currentFieldIndex, setCurrentFieldIndex] = useState<number>(0);
  const [showAddMorePrompt, setShowAddMorePrompt] = useState<boolean>(false);
  const [inArrayInput, setInArrayInput] = useState<boolean>(false);
  const [currentArraySectionId, setCurrentArraySectionId] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [entryCount, setEntryCount] = useState<{ [sectionId: string]: number }>({});
  const [IsReportAvailable, setIsReportAvailable] = useState(false);
  const [ReadyToSubmit, setReadyToSubmit] = useState(false);
  const [SubmittingData, setSubmittingData] = useState(false)

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

  const getCurrentSection = (): Section | undefined => {
    return getVisibleSections().find(section =>
      section.questions.some(q => q.id === currentQuestion?.id)
    );
  };

  const handleInputChange = (value: any) => {
    if (inArrayInput) {
      setCurrentArrayEntry(prev => ({
        ...prev,
        [getCurrentSection()!.questions[0].fields![currentFieldIndex].id]: value
      }));
    } else if (currentQuestion?.inputType === 'checkbox') {
      setCheckboxSelections(value);
    } else {
      setResponses({ ...responses, [currentQuestion!.id]: value });
    }
  };

  const handleCheckboxChange = (option: string) => {
    setCheckboxSelections(prev => {
      if (prev.includes(option)) {
        return prev.filter(item => item !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  const handleNext = () => {
    let value: any;
    const currentSection = getCurrentSection();

    if (inArrayInput) {
      const currentField = currentSection!.questions[0].fields![currentFieldIndex];

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
        ...currentArrayEntry,
        [currentField.id]: value,
        sectionId: currentSection!.id
      };
      setCurrentArrayEntry(updatedEntry);



      setChatMessages(prev => [
        ...prev,
        {
          type: "question",
          content: currentField.question,
          sectionId: currentSection!.id,
          isArrayField: true,
          entryNumber: entryCount[currentSection!.id] || 1
        },
        {
          type: "answer",
          content: value,
          sectionId: currentSection!.id
        }
      ]);


      setTextInput('');
      setTextareaInput('');
      setDateInput('');

      if (currentFieldIndex < currentSection!.questions[0].fields!.length - 1) {
        setTimeout(() => {

          setCurrentFieldIndex(currentFieldIndex + 1);
        }, 500)
      } else {
        setTimeout(() => {
          const sectionEntries = arrayEntries[currentSection!.id] || [];
          const updatedEntries = [...sectionEntries, updatedEntry];
          setArrayEntries(prev => ({
            ...prev,
            [currentSection!.id]: updatedEntries
          }));
          setResponses(prev => ({
            ...prev,
            [currentSection!.questions[0].id]: updatedEntries
          }));
          setCurrentArrayEntry({ sectionId: '' });
          setCurrentFieldIndex(0);
          setShowAddMorePrompt(true);
        }, 500)
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
        case 'checkbox':
          value = checkboxSelections;
          break;
        case 'array':
          setInArrayInput(true);
          setCurrentArraySectionId(currentSection!.id);
          setEntryCount(prev => ({
            ...prev,
            [currentSection!.id]: (prev[currentSection!.id] || 0) + 1
          }));
          setChatMessages(prev => [
            ...prev,
            {
              type: "question",
              content: currentQuestion!.question,
              sectionId: currentSection!.id
            },
            {
              type: "system",
              content: `Let's fill in details for ${currentSection!.section} Entry #1`
            }
          ]);
          return;
        default:
          value = '';
      }

      if (!value || (Array.isArray(value) && value.length === 0)) {
        alert('Please answer the question.');
        return;
      }

      // ! This is for preventing displaying the initial message two times.

      if (chatMessages.length === 1) {
        setChatMessages([
          { type: "question", content: currentQuestion!.question },
          {
            type: "answer",
            content: Array.isArray(value) ? value.join(', ') : value
          }
        ]);
      } else {
        setChatMessages(prev => [
          ...prev,
          { type: "question", content: currentQuestion!.question },
          {
            type: "answer",
            content: Array.isArray(value) ? value.join(', ') : value
          }
        ]);
      }



      setResponses(prev => ({
        ...prev,
        [currentQuestion!.id]: value
      }));

      setTextInput('');
      setSelectedOption(null);
      setDateInput('');
      setCheckboxSelections([]);

      if (currentQuestionIndex < allQuestions.length - 1) {
        setTimeout(() => {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }, 500);

      } else {
        // All the questions has been finished ask the user to submit the data.
        setReadyToSubmit(true);
      }
    }

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 500);
  };

  const handleAddMore = (addMore: boolean) => {
    const currentSection = getCurrentSection()!;
    setShowAddMorePrompt(false);

    if (addMore) {
      setInArrayInput(true);
      setEntryCount(prev => ({
        ...prev,
        [currentSection.id]: (prev[currentSection.id] || 0) + 1
      }));
      setChatMessages(prev => [
        ...prev,
        { type: "question", content: `Would you like to add another ${currentSection.section.toLowerCase()} entry?` },
        { type: "answer", content: "Yes" },
        { type: "system", content: `Let's fill in details for ${currentSection.section}` }
      ]);
    } else {
      setChatMessages(prev => [
        ...prev,
        { type: "question", content: `Would you like to add another ${currentSection.section.toLowerCase()} entry?` },
        { type: "answer", content: "No" }
      ]);
      setInArrayInput(false);
      setCurrentArraySectionId('');
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
    }, 500);
  };

  useEffect(() => {
    if (chatMessages.length > 1)
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // if (inputRef.current) {
    //   inputRef.current.focus();
    // }
  }, [responses, currentQuestionIndex, currentFieldIndex, inArrayInput, showAddMorePrompt]);

  useEffect(() => {
    try {

      const result = enrichDataWithQuestions(responses, sections);
      // console.log("Result of Response: ", result);
      console.log("Response", responses);

      const mbtiScore = getMBTIScore(responses);

      console.log("MBTI Score:", JSON.stringify(mbtiScore, null, 2))

    } catch (error) {
      console.log(error);
    }
  }, [responses])


  useEffect(() => {
    if (chatMessages.length === 0 && currentQuestionIndex >= 0) {
      const initialMessages: ChatMessage[] = [];
      for (let i = 0; i < currentQuestionIndex; i++) {
        const q = allQuestions[i];
        initialMessages.push({ type: "question", content: q.question });
        if (responses[q.id]) {
          initialMessages.push({
            type: "answer",
            content: Array.isArray(responses[q.id]) ? responses[q.id].join(', ') : responses[q.id]
          });
        }
      }
      if (!inArrayInput && currentQuestionIndex < allQuestions.length) {
        initialMessages.push({ type: "question", content: allQuestions[currentQuestionIndex].question });
      }
      setChatMessages(initialMessages);
    }
  }, [responses]);

  const handleTextKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && textInput) {
      handleInputChange(textInput);
      handleNext();
    }
  };

  const handleSubmitData = async () => {
    try {

      setSubmittingData(true);
      await new Promise(resolve => setTimeout(resolve, 3000));
      setSubmittingData(false);


    } catch (error) {

    }
  }

  const renderCurrentQuestion = (): string => {
    if (showAddMorePrompt) {
      const currentSection = getCurrentSection();
      return `Would you like to add another ${currentSection!.section.toLowerCase()} entry?`;
    }
    if (inArrayInput) {
      const currentSection = sections.find(s => s.id === currentArraySectionId);
      return currentSection!.questions[0].fields![currentFieldIndex].question;
    }
    return currentQuestion?.question || '';
  };

  // Input multiple record 
  const renderArrayInputField = () => {
    const currentSection = sections.find(s => s.id === currentArraySectionId);
    const currentField = currentSection!.questions[0].fields![currentFieldIndex];

    switch (currentField.inputType) {
      case 'text':
        return (
          <div className="flex w-full justify-between shadow-md border-0 rounded-full bg-white">
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              value={textInput}
              placeholder="Type your message"
              className="flex-1 py-3 px-4 border-0 rounded-full focus:outline-none text-black bg-white"
              onChange={(e) => {
                setTextInput(e.target.value);
                handleInputChange(e.target.value);
              }}
              onKeyDown={handleTextKeyPress}
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
              placeholder="Type your message"
              className="w-full p-2 border rounded text-black mb-4 min-h-[100px] focus:outline-none focus:border-blue-500"
              onChange={(e) => {
                setTextareaInput(e.target.value);
                handleInputChange(e.target.value);
              }}
            />
            <div className="flex justify-end">
              <button type="button" className="py-2 px-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors hover:cursor-pointer" onClick={handleNext}>
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
              className="w-full p-2 border rounded text-black mb-4 focus:outline-none focus:border-blue-500"
              onChange={(e) => {
                setDateInput(e.target.value);
                handleInputChange(e.target.value);
              }}
            />
            <div className="flex justify-end">
              <button type="button" className="py-2 px-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors hover:cursor-pointer" onClick={handleNext}>
                Next
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderSubmitButton = () => {
    return <div className="flex flex-col items-center border-t pt-4 w-full">
      <p className="text-lg font-medium mb-2 text-black">{SubmittingData ? "Please wait while we submitting your data..." : "Do you want to submit the chat? "}</p>
      <div className="flex justify-center gap-4">

        {
          SubmittingData ? <span className="flex justify-center items-center animate-spin mb-5">
            <AiOutlineLoading3Quarters color="#0B7DBF" size={30} />
          </span> : <button
            disabled={SubmittingData}
            type="button"
            className="py-2 px-6 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors hover:cursor-pointer"
            onClick={async () => {
              await handleSubmitData();
            }}
          >
            Submit
          </button>
        }


        {/* <button
          type="button"
          className="py-2 px-6 bg-gray-400 text-white rounded-full hover:bg-gray-500 transition-colors hover:cursor-pointer"
          onClick={() => { }}
        >
          Cancel
        </button> */}
      </div>
    </div>
  }

  const renderAddMorePrompt = () => (
    <div className="flex w-full flex-col bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-center gap-4 mb-4">
        <button type="button" className="py-2 px-6 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors hover:cursor-pointer" onClick={() => handleAddMore(true)}>
          Yes
        </button>
        <button type="button" className="py-2 px-6 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors hover:cursor-pointer" onClick={() => handleAddMore(false)}>
          No
        </button>
      </div>
    </div>
  );

  const renderInputField = () => {
    if (ReadyToSubmit) return renderSubmitButton();
    if (showAddMorePrompt) return renderAddMorePrompt();
    if (inArrayInput) return renderArrayInputField();
    if (!currentQuestion) return null;

    const isSingleOption = currentQuestion.options?.length === 1;
    switch (currentQuestion.inputType) {

      case 'text':
        return (
          <div className="flex w-full justify-between shadow-md border-0 rounded-full bg-white">
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              value={textInput}
              placeholder="Type your message"
              className="flex-1 py-3 px-4 border-0 rounded-full focus:outline-none text-black bg-white"
              onChange={(e) => {
                setTextInput(e.target.value);
                handleInputChange(e.target.value);
              }}
              onKeyDown={handleTextKeyPress}
            />
            <button type="button" className="p-2 rounded-full hover:cursor-pointer transition-colors" onClick={handleNext}>
              <IoSend color="#155dfc" size={20} />
            </button>
          </div>
        );
      case 'radio':
        return (
          <div className="flex flex-col w-full bg-[#F3F3F3] p-4 rounded-lg shadow-md">
            <div className="flex flex-wrap gap-4 mb-4">
              {currentQuestion.options?.map((option) => (
                <label key={option} className="flex items-center space-x-2 cursor-pointer">
                  <div className="relative w-5 h-5">
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      value={option}
                      className="appearance-none w-full h-full rounded-full border-2 border-blue-500 checked:border-blue-500 checked:bg-white focus:outline-none cursor-pointer leading-none"
                      onChange={(e) => handleInputChange(e.target.value)}
                      checked={responses[currentQuestion.id] === option}
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
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
              <button type="button" className="py-2 px-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors hover:cursor-pointer" onClick={handleNext}>
                {
                  isSingleOption ? "Next" : "Send"
                }
              </button>
            </div>
          </div>
        );
      case 'checkbox':
        return (
          <div className="flex flex-col w-full bg-[#F3F3F3] p-4 rounded-lg shadow-md">
            <div className="flex flex-wrap gap-4 mb-4">
              {currentQuestion.options?.map((option) => (
                <label key={option} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    value={option}
                    className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                    onChange={() => handleCheckboxChange(option)}
                    checked={checkboxSelections.includes(option)}
                  />
                  <span className="text-black">{option}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end">
              <button type="button" className="py-2 px-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors hover:cursor-pointer" onClick={handleNext}>
                Send
              </button>
            </div>
          </div>
        );
      case 'date':
        return (
          <div className="flex w-full flex-col bg-[#F3F3F3] p-4 rounded-lg shadow-md">
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="date"
              value={dateInput}
              className="w-full p-2 border rounded text-black mb-4 focus:outline-none focus:border-blue-500"
              onChange={(e) => {
                setDateInput(e.target.value);
                handleInputChange(e.target.value);
              }}
            />
            <div className="flex justify-end">
              <button type="button" className="py-2 px-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors hover:cursor-pointer" onClick={handleNext}>
                Send
              </button>
            </div>
          </div>
        );
      case 'dropdown':
        return (
          <div className="flex w-full flex-col bg-[#F3F3F3] p-4 rounded-lg shadow-md">
            <Select
              ref={inputRef as any}
              defaultMenuIsOpen={true}
              options={currentQuestion.options?.map(option => ({ value: option, label: option }))}
              onChange={(option) => {
                setSelectedOption(option?.value || null);
                handleInputChange(option?.value || null);
              }}
              value={selectedOption ? { value: selectedOption, label: selectedOption } : null}
              className="mb-4"
              placeholder="Select an option"
              menuPlacement="top" // 👈 Forces dropdown to open upward
              styles={{
                control: (provided) => ({
                  ...provided,
                  color: "black",
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: "black",
                }),
                option: (provided) => ({
                  ...provided,
                  color: "black",
                }),
              }}
            />

            <div className="flex justify-end">
              <button type="button" className="py-2 px-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors hover:cursor-pointer" onClick={handleNext}>
                Send
              </button>
            </div>
          </div>
        );
      case 'array':
        return (
          <div className="flex w-full justify-between shadow-md border-0 rounded-full bg-white">
            <div className="flex-1 py-3 px-4 text-gray-500">{`Let's start with your ${getCurrentSection()!.section.toLowerCase()}`}</div>
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
    <div className="min-h-screen bg-[#fff] flex flex-col">
      <div className="sticky top-0">
        <Navbar />
      </div>
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-2">
        {
          !IsReportAvailable ? <div className="flex-1 bg-[url(/assets/chat-bg.svg)] bg-cover bg-no-repeat shrink-0 bg-center rounded-lg shadow-md p-4 overflow-y-auto mb-2 max-h-[calc(100vh-200px)]">


            {chatMessages.map((message, idx) => (
              <div key={idx}>
                {message.type === "question" && (
                  <div className="mb-4 text-left">
                    <div dangerouslySetInnerHTML={{ __html: message.content }} className="inline-block p-3 rounded-lg bg-[#F3F3F3] text-black rounded-bl-none max-w-[80%] sm:max-w-[60%]">


                    </div>
                  </div>
                )}
                {message.type === "answer" && (
                  <div className="mb-4 text-right">
                    <div className="inline-block p-3 rounded-lg bg-[#F3F3F3] text-black rounded-br-none max-w-[80%] sm:max-w-[60%]">
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
                <div dangerouslySetInnerHTML={{ __html: sections.find(s => s.id === currentArraySectionId)!.questions[0].fields![currentFieldIndex].question }} className="inline-block p-3 rounded-lg bg-[#F3F3F3] text-black rounded-bl-none max-w-[80%] sm:max-w-[60%]">

                </div>
              </div>
            )}

            {!inArrayInput && currentQuestionIndex < allQuestions.length &&
              !chatMessages.some(msg => msg.type === "question" && msg.content === currentQuestion?.question) && (
                <div className="mb-4 text-left">
                  <div dangerouslySetInnerHTML={{ __html: currentQuestion?.question }} className="inline-block p-3 rounded-lg bg-[#F3F3F3] text-black rounded-bl-none max-w-[80%] sm:max-w-[60%]">
                  </div>
                </div>
              )}

            {showAddMorePrompt && (
              <div className="mb-4 text-left">
                <div className="inline-block p-3 rounded-lg bg-[#F3F3F3] text-black rounded-bl-none max-w-[80%] sm:max-w-[60%]">
                  {renderCurrentQuestion()}
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div> : <div className="flex-1 bg-[#F3F3F3] bg-cover bg-no-repeat shrink-0 bg-center rounded-lg shadow-md p-4 overflow-y-auto mb-2 max-h-[calc(100vh-200px)]">
            <p className="text-black font-bold text-xl">Assessment Report</p>
          </div>
        }


      </div>
      <div className="sticky bottom-0 bg-transparent flex items-center gap-2 m-2">
        {
          IsReportAvailable ? <div className="flex justify-center items-center w-full">
            <button className="text-black">
              Show Jobs button
            </button>
          </div> : renderInputField()
        }

      </div>
    </div>
  );
}