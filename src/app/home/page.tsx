'use client';

import { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { IoSend } from 'react-icons/io5';
import { useAuth } from '@/providers';
import Navbar from '@/components/navbar';

// Types
interface FormValues {
  basicInfo: { [key: string]: string };
  education: {
    highSchoolStream: string;
    highSchoolPercentage: string;
    academicRecords: Array<{ college: string; degree: string; fieldOfStudy: string; yearOfCompletion: string }>;
    extraCourses: string[];
    extracurriculars: string[];
    hasInternships: string;
    internships: string[];
  };
}

interface ChatMessage {
  text: string;
  isBot: boolean;
  field?: string;
  options?: string[];
  inputType?: 'text' | 'select' | 'radio' | 'textarea';
  isArrayField?: boolean;
  arrayFieldName?: string;
}

const initialValues: FormValues = {
  basicInfo: { name: '', gender: '', address: '', pincode: '', mobile: '', email: '', status: '' },
  education: {
    highSchoolStream: '',
    highSchoolPercentage: '',
    academicRecords: [{ college: '', degree: '', fieldOfStudy: '', yearOfCompletion: '' }],
    extraCourses: [],
    extracurriculars: [],
    hasInternships: '',
    internships: []
  }
};

const validationSchema = Yup.object({
  basicInfo: Yup.object({
    name: Yup.string().required('Required'),
    gender: Yup.string().required('Required'),
    address: Yup.string().required('Required'),
    pincode: Yup.string().matches(/^\d{6}$/, 'Must be 6 digits').required('Required'),
    mobile: Yup.string().matches(/^\d{10}$/, 'Must be 10 digits').required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    status: Yup.string().required('Required')
  }),
  education: Yup.object({
    highSchoolStream: Yup.string().required('Required'),
    highSchoolPercentage: Yup.number().min(0).max(100).required('Required'),
    academicRecords: Yup.array().of(
      Yup.object({
        college: Yup.string().required('Required'),
        degree: Yup.string().required('Required'),
        fieldOfStudy: Yup.string().required('Required'),
        yearOfCompletion: Yup.string().required('Required')
      })
    ),
    hasInternships: Yup.string().required('Required'),
    internships: Yup.array().when('hasInternships', {
      is: 'yes',
      then: () => Yup.array().min(1, 'Add at least one internship').required()
    })
  })
});

const Home = () => {
  const { user } = useAuth();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<FormValues>(initialValues);
  const [userInput, setUserInput] = useState('');

  const questions: ChatMessage[] = [
    { text: "What's your name?", isBot: true, field: "basicInfo.name", inputType: "text" },
    { text: "What's your gender?", isBot: true, field: "basicInfo.gender", inputType: "select", options: ["Male", "Female", "Other"] },
    { text: "What's your address?", isBot: true, field: "basicInfo.address", inputType: "text" },
    { text: "What's your pincode?", isBot: true, field: "basicInfo.pincode", inputType: "text" },
    { text: "What's your mobile number?", isBot: true, field: "basicInfo.mobile", inputType: "text" },
    { text: "What's your email?", isBot: true, field: "basicInfo.email", inputType: "text" },
    { text: "What defines you best?", isBot: true, field: "basicInfo.status", inputType: "radio", options: ["Currently Studying", "Recently Graduated", "Working Professional"] },
    { text: "What was your high school stream?", isBot: true, field: "education.highSchoolStream", inputType: "select", options: ["Science with Biology", "Science without Biology", "Commerce", "Arts"] },
    { text: "What's your high school percentage?", isBot: true, field: "education.highSchoolPercentage", inputType: "text" },
    { text: "Tell me about your college education (College name)", isBot: true, field: "education.academicRecords.0.college", inputType: "text", isArrayField: true, arrayFieldName: "education.academicRecords" },
    { text: "What's your degree?", isBot: true, field: "education.academicRecords.0.degree", inputType: "text", isArrayField: true, arrayFieldName: "education.academicRecords" },
    { text: "What's your field of study?", isBot: true, field: "education.academicRecords.0.fieldOfStudy", inputType: "text", isArrayField: true, arrayFieldName: "education.academicRecords" },
    { text: "Which year did you complete it?", isBot: true, field: "education.academicRecords.0.yearOfCompletion", inputType: "select", options: Array.from({ length: 21 }, (_, i) => (2010 + i).toString()) },
    { text: "Have you done any internships/part-time jobs?", isBot: true, field: "education.hasInternships", inputType: "radio", options: ["Yes", "No"] }
  ];

  useEffect(() => {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
    setChatMessages([{ text: `Hello ${user?.displayName || 'User'}, let's start with some basic information!`, isBot: true }]);
    setTimeout(() => setChatMessages(prev => [...prev, questions[0]]), 1000);
  }, [user]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleResponse = (values: FormValues, setFieldValue: any, response: string) => {
    if (!response.trim()) return;

    const currentQuestion = chatMessages[chatMessages.length - 1];
    const fieldParts = currentQuestion.field!.split('.');
    if (currentQuestion.isArrayField && fieldParts.length > 2) {
      const index = parseInt(fieldParts[2], 10);
      const fieldName = fieldParts[3];
      const updatedRecords = values.education.academicRecords.map((record, i) =>
        i === index ? { ...record, [fieldName]: response } : record
      );
      setFieldValue('education.academicRecords', updatedRecords);
      setFormData(prev => ({ ...prev, education: { ...prev.education, academicRecords: updatedRecords } }));
    } else if (fieldParts[0] === 'education' && fieldParts[1].startsWith('internships')) {
      const index = parseInt(fieldParts[2], 10);
      const updatedInternships = [...values.education.internships];
      updatedInternships[index] = response;
      setFieldValue('education.internships', updatedInternships);
      setFormData(prev => ({ ...prev, education: { ...prev.education, internships: updatedInternships } }));
    } else {
      setFieldValue(currentQuestion.field!, response);
      setFormData(prev => ({
        ...prev,
        [fieldParts[0]]: { ...prev[fieldParts[0] as keyof FormValues], [fieldParts[1]]: response }
      }));
    }

    setChatMessages(prev => [...prev, { text: response, isBot: false }]);
    localStorage.setItem('formData', JSON.stringify(formData));

    const nextStep = currentStep + 1;
    if (nextStep < questions.length) {
      setCurrentStep(nextStep);
      setTimeout(() => setChatMessages(prev => [...prev, questions[nextStep]]), 1000);
    } else if (values.education.hasInternships === 'yes' && values.education.internships.length === 0) {
      setChatMessages(prev => [...prev, { text: "Please tell me about your internship details", isBot: true, field: "education.internships.0", inputType: "textarea", isArrayField: true, arrayFieldName: "education.internships" }]);
    } else {
      setChatMessages(prev => [...prev, { text: "Great! All done. Ready to submit?", isBot: true }]);
    }
    setUserInput('');
  };

  return (
    <div className="min-h-screen bg-[#F2EFE7] flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-2">
        <div
          className="flex-1 bg-[#f5f5f5] rounded-lg shadow-md p-4 overflow-y-auto mb-2 max-h-[calc(100vh-200px)]"
          ref={chatContainerRef}
        >
          {chatMessages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.isBot ? 'text-left' : 'text-right'}`}>
              <div className={`inline-block p-3 rounded-lg ${message.isBot
                ? 'bg-[#2973B2] text-white rounded-bl-none'
                : 'bg-white text-black rounded-br-none'
                } max-w-[80%] sm:max-w-[60%]`}>
                {message.text}
              </div>
              {message.isBot && message.field && index === chatMessages.length - 1 && (
                <div className="mt-2">
                  <Formik
                    initialValues={formData}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setFieldValue }) => handleResponse(values, setFieldValue, userInput)}
                    enableReinitialize
                  >
                    {({ values, setFieldValue }) => (
                      <Form>
                        {message.inputType === 'select' && (
                          <div className="flex overflow-x-auto gap-2">
                            {message.options?.map((option, idx) => (
                              <div
                                key={idx}
                                className="min-w-[150px] bg-white p-3 rounded-lg cursor-pointer hover:bg-gray-100"
                                onClick={() => handleResponse(values, setFieldValue, option)}
                              >
                                <p className="text-black">{option}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        {message.inputType === 'radio' && (
                          <div className="flex overflow-x-auto gap-2">
                            {message.options?.map((option, idx) => (
                              <div
                                key={idx}
                                className="min-w-[150px] bg-white p-3 rounded-lg cursor-pointer hover:bg-gray-100"
                                onClick={() => handleResponse(values, setFieldValue, option)}
                              >
                                <p className="text-black">{option}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        {(message.field === "education.academicRecords.0.yearOfCompletion" || (message.isArrayField && message.arrayFieldName === "education.academicRecords" && message.field?.endsWith('.college'))) && (
                          <FieldArray name="education.academicRecords">
                            {({ push }) => (
                              <button
                                type="button"
                                onClick={() => {
                                  push({ college: '', degree: '', fieldOfStudy: '', yearOfCompletion: '' });
                                  setChatMessages(prev => [...prev, { text: "Tell me about another college education (College name)", isBot: true, field: `education.academicRecords.${values.education.academicRecords.length}.college`, inputType: "text", isArrayField: true, arrayFieldName: "education.academicRecords" }]);
                                }}
                                className="text-blue-500 mt-2"
                              >
                                Add Another Academic Record
                              </button>
                            )}
                          </FieldArray>
                        )}
                        {message.field?.startsWith("education.internships") && (
                          <FieldArray name="education.internships">
                            {({ push }) => (
                              <button
                                type="button"
                                onClick={() => {
                                  push('');
                                  setChatMessages(prev => [...prev, { text: "Tell me about another internship", isBot: true, field: `education.internships.${values.education.internships.length}`, inputType: "textarea", isArrayField: true, arrayFieldName: "education.internships" }]);
                                }}
                                className="text-blue-500 mt-2"
                              >
                                Add Another Internship
                              </button>
                            )}
                          </FieldArray>
                        )}
                      </Form>
                    )}
                  </Formik>
                </div>
              )}
            </div>
          ))}
        </div>
        <Formik
          initialValues={formData}
          validationSchema={validationSchema}
          onSubmit={(values, { setFieldValue }) => handleResponse(values, setFieldValue, userInput)}
          enableReinitialize
        >
          {({ values }) => (
            <Form className="sticky bottom-0 bg-transparent flex items-center gap-2">
              <div className="flex w-full justify-between shadow-md border-0 rounded-full bg-white">
                <input
                  placeholder="Type your response"
                  className="flex-1 py-3 px-4 border-0 rounded-full focus:outline-none text-black bg-white"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleResponse(values, () => { }, userInput)}
                  disabled={chatMessages[chatMessages.length - 1]?.inputType === 'select' || chatMessages[chatMessages.length - 1]?.inputType === 'radio'}
                />
                <button
                  type="submit"
                  className="p-2 rounded-full hover:cursor-pointer transition-colors"
                  disabled={chatMessages[chatMessages.length - 1]?.inputType === 'select' || chatMessages[chatMessages.length - 1]?.inputType === 'radio'}
                >
                  <IoSend color='#155dfc' size={20} />
                </button>
              </div>
            </Form>
          )}
        </Formik>
        {chatMessages[chatMessages.length - 1]?.text === "Great! All done. Ready to submit?" && (
          <div className="sticky bottom-0 bg-white p-4 rounded-lg shadow-md flex justify-end w-full mt-2">
            <button
              type="button"
              onClick={() => console.log('Final submission:', formData)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;