'use client';

import { useState, useEffect, useRef } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { reach } from 'yup';
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
  workExperience?: {
    experienceRecords: Array<{
      organization: string;
      designation: string;
      description: string;
      skills: string;
      fromYearMonth: string;
      tillYearMonth: string;
    }>;
  };
}

interface ChatMessageBase {
  text: string;
  isBot: boolean;
  field?: string;
  options?: string[];
  inputType?: 'text' | 'select' | 'radio' | 'textarea' | 'date';
  subQuestionIndex?: number; // Track sub-question index within academicRecords
  isFollowUp?: boolean; // Flag for follow-up questions
}

interface ChatMessageArray extends ChatMessageBase {
  isArrayField: true;
  arrayFieldName: string; // Required when isArrayField is true
}

interface ChatMessageNonArray extends ChatMessageBase {
  isArrayField?: false;
  arrayFieldName?: never; // Not allowed when isArrayField is false or undefined
}

type ChatMessage = ChatMessageArray | ChatMessageNonArray;

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
  },
  workExperience: { experienceRecords: [] }
};

const validationSchema = Yup.object({
  basicInfo: Yup.object({
    name: Yup.string().matches(/^[a-zA-Z\s]+$/, 'Name should only contain letters and spaces').required('Required'),
    gender: Yup.string().required('Required'),
    address: Yup.string().required('Required'),
    pincode: Yup.string().matches(/^\d{6}$/, 'Must be 6 digits').required('Required'),
    mobile: Yup.string().matches(/^\d{10}$/, 'Must be 10 digits').required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    status: Yup.string().required('Required')
  }),
  education: Yup.object({
    highSchoolStream: Yup.string().required('Required'),
    highSchoolPercentage: Yup.number().min(0, 'Must be at least 0').max(100, 'Must be at most 100').required('Required'),
    academicRecords: Yup.array().of(
      Yup.object({
        college: Yup.string().required('Required'),
        degree: Yup.string().required('Required'),
        fieldOfStudy: Yup.string().required('Required'),
        yearOfCompletion: Yup.string().required('Required')
      })
    ),
    extraCourses: Yup.array().of(Yup.string()),
    extracurriculars: Yup.array().of(Yup.string()),
    hasInternships: Yup.string().required('Required'),
    internships: Yup.array().when('hasInternships', {
      is: 'yes',
      then: () => Yup.array().of(Yup.string().min(10, 'Please provide more details').required('Required')).min(1, 'Add at least one internship').required()
    })
  }),
  workExperience: Yup.object().when('basicInfo.status', {
    is: 'Working Professional',
    then: () => Yup.object({
      experienceRecords: Yup.array().of(
        Yup.object({
          organization: Yup.string().required('Required'),
          designation: Yup.string().required('Required'),
          description: Yup.string().required('Required'),
          skills: Yup.string().required('Required'),
          fromYearMonth: Yup.string().required('Required'),
          tillYearMonth: Yup.string().required('Required')
        })
      ).min(1, 'Add at least one experience record')
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
  const [isLoading, setIsLoading] = useState(false);

  const years = Array.from({ length: 21 }, (_, i) => (2010 + i).toString());

  const questions: ChatMessage[] = [
    // Part 1 - Basic Information
    { text: "What's your name?", isBot: true, field: "basicInfo.name", inputType: "text" },
    { text: "What's your gender?", isBot: true, field: "basicInfo.gender", inputType: "select", options: ["Male", "Female", "Other"] },
    { text: "What's your address?", isBot: true, field: "basicInfo.address", inputType: "text" },
    { text: "What's your pincode?", isBot: true, field: "basicInfo.pincode", inputType: "text" },
    { text: "What's your mobile number?", isBot: true, field: "basicInfo.mobile", inputType: "text" },
    { text: "What's your email?", isBot: true, field: "basicInfo.email", inputType: "text" },
    { text: "What defines you best?", isBot: true, field: "basicInfo.status", inputType: "radio", options: ["Currently Studying", "Recently Graduated", "Working Professional"] },
    // Part 2 - Educational Background
    { text: "What was your high school stream?", isBot: true, field: "education.highSchoolStream", inputType: "select", options: ["Science with Biology", "Science without Biology", "Commerce", "Arts"] },
    { text: "What's your high school percentage?", isBot: true, field: "education.highSchoolPercentage", inputType: "text" },
    { text: "Tell me about your college education (College name)", isBot: true, field: "education.academicRecords.0.college", inputType: "text", isArrayField: true, arrayFieldName: "education.academicRecords", subQuestionIndex: 0 },
    { text: "What's your degree?", isBot: true, field: "education.academicRecords.0.degree", inputType: "text", isArrayField: true, arrayFieldName: "education.academicRecords", subQuestionIndex: 1 },
    { text: "What's your field of study?", isBot: true, field: "education.academicRecords.0.fieldOfStudy", inputType: "text", isArrayField: true, arrayFieldName: "education.academicRecords", subQuestionIndex: 2 },
    { text: "Which year did you complete it?", isBot: true, field: "education.academicRecords.0.yearOfCompletion", inputType: "select", options: years, isArrayField: true, arrayFieldName: "education.academicRecords", subQuestionIndex: 3 },
    { text: "Any extra courses you've done?", isBot: true, field: "education.extraCourses.0", inputType: "text", isArrayField: true, arrayFieldName: "education.extraCourses" },
    { text: "Any extracurricular activities?", isBot: true, field: "education.extracurriculars.0", inputType: "text", isArrayField: true, arrayFieldName: "education.extracurriculars" },
    { text: "Have you done any internships/part-time jobs?", isBot: true, field: "education.hasInternships", inputType: "radio", options: ["Yes", "No"] }
  ];

  const workExperienceQuestions: ChatMessage[] = [
    { text: "Which organization did you work for?", isBot: true, field: "workExperience.experienceRecords.0.organization", inputType: "text", isArrayField: true, arrayFieldName: "workExperience.experienceRecords" },
    { text: "What was your designation?", isBot: true, field: "workExperience.experienceRecords.0.designation", inputType: "text", isArrayField: true, arrayFieldName: "workExperience.experienceRecords" },
    { text: "Describe your role", isBot: true, field: "workExperience.experienceRecords.0.description", inputType: "textarea", isArrayField: true, arrayFieldName: "workExperience.experienceRecords" },
    { text: "What skills did you use/learn?", isBot: true, field: "workExperience.experienceRecords.0.skills", inputType: "text", isArrayField: true, arrayFieldName: "workExperience.experienceRecords" },
    { text: "When did you start? (YYYY-MM)", isBot: true, field: "workExperience.experienceRecords.0.fromYearMonth", inputType: "text", isArrayField: true, arrayFieldName: "workExperience.experienceRecords" },
    { text: "When did you end? (YYYY-MM)", isBot: true, field: "workExperience.experienceRecords.0.tillYearMonth", inputType: "text", isArrayField: true, arrayFieldName: "workExperience.experienceRecords" }
  ];

  useEffect(() => {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData({
        ...initialValues,
        ...parsedData,
        education: {
          ...initialValues.education,
          ...parsedData.education,
          academicRecords: Array.isArray(parsedData.education?.academicRecords) ? parsedData.education.academicRecords : initialValues.education.academicRecords
        },
        workExperience: {
          experienceRecords: Array.isArray(parsedData.workExperience?.experienceRecords) ? parsedData.workExperience.experienceRecords : []
        }
      });
    }
    // Set initial messages synchronously to avoid duplication
    setChatMessages([{ text: `Hello ${user?.displayName || 'User'}, let's start with some basic information!`, isBot: true }, questions[0]]);
  }, [user]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleResponse = async (values: FormValues, setFieldValue: any, response: string) => {
    if (!response.trim() || isLoading) return;
    setIsLoading(true);

    const currentQuestion = chatMessages[chatMessages.length - 1];
    const fieldPath = currentQuestion.field!;

    // Handle follow-up question response
    if (currentQuestion.isFollowUp) {
      if (response.toLowerCase() === 'yes') {
        const arrayFieldName = (currentQuestion as ChatMessageArray).arrayFieldName;
        const newIndex = values.education.academicRecords.length;

        // Add new empty record
        setFieldValue(arrayFieldName, [...values.education.academicRecords, { college: '', degree: '', fieldOfStudy: '', yearOfCompletion: '' }]);

        // Start with the first question of the new record
        const nextQuestion: ChatMessageArray = {
          text: "Tell me about your college education (College name)",
          isBot: true,
          field: `${arrayFieldName}.${newIndex}.college`,
          inputType: "text",
          isArrayField: true,
          arrayFieldName,
          subQuestionIndex: 0
        };
        setChatMessages(prev => [...prev, { text: response, isBot: false }, nextQuestion]);
      } else {
        setChatMessages(prev => [...prev, { text: response, isBot: false }]);
        // Move to the next question after the current section
        let nextQuestionIndex = currentStep + 1;
        if ((currentQuestion as ChatMessageArray).arrayFieldName === 'education.academicRecords') {
          nextQuestionIndex = 13; // Jump to "Any extra courses you've done?"
        } else if ((currentQuestion as ChatMessageArray).arrayFieldName === 'education.extraCourses') {
          nextQuestionIndex = 14; // Jump to "Any extracurricular activities?"
        }
        if (nextQuestionIndex < questions.length) {
          setCurrentStep(nextQuestionIndex);
          setTimeout(() => setChatMessages(prev => [...prev, questions[nextQuestionIndex]]), 1000);
        } else if (values.education.hasInternships === 'yes' && values.education.internships.length === 0) {
          setChatMessages(prev => [...prev, { text: "Please tell me about your internship details", isBot: true, field: "education.internships.0", inputType: "textarea", isArrayField: true, arrayFieldName: "education.internships" }]);
        } else if (values.basicInfo.status === 'Working Professional' && (!values.workExperience?.experienceRecords.length)) {
          setChatMessages(prev => [...prev, workExperienceQuestions[0]]);
        } else {
          setChatMessages(prev => [...prev, { text: "Great! All done. Ready to submit?", isBot: true }]);
        }
      }
      setUserInput('');
      setIsLoading(false);
      return;
    }

    // Validate response
    try {
      const schemaPart = reach(validationSchema, fieldPath) as Yup.Schema<any>;
      await schemaPart.validate(response);
    } catch (error) {
      setChatMessages(prev => [...prev, { text: `Sorry, please enter valid details (${(error as Yup.ValidationError).message})`, isBot: true }]);
      setTimeout(() => setChatMessages(prev => [...prev, currentQuestion]), 1000);
      setUserInput('');
      setIsLoading(false);
      return;
    }

    let updatedValues = { ...values };
    const fieldParts = fieldPath.split('.');
    if (currentQuestion.isArrayField && fieldParts.length > 2) {
      const index = parseInt(fieldParts[2], 10);
      const fieldName = fieldParts[3];
      const arrayFieldName = (currentQuestion as ChatMessageArray).arrayFieldName;
      const parentField = fieldParts[0] as keyof FormValues;

      if (parentField === 'education') {
        const arrayData = Array.isArray(updatedValues[parentField][arrayFieldName as keyof FormValues['education']])
          ? [...updatedValues[parentField][arrayFieldName as keyof FormValues['education']] as any[]]
          : [];
        arrayData[index] = arrayFieldName === 'academicRecords'
          ? { ...arrayData[index], [fieldName]: response }
          : response;
        updatedValues = {
          ...updatedValues,
          education: { ...updatedValues.education, [arrayFieldName]: arrayData }
        };
      } else if (parentField === 'workExperience') {
        const arrayData = Array.isArray(updatedValues.workExperience?.experienceRecords)
          ? [...updatedValues.workExperience.experienceRecords]
          : [];
        arrayData[index] = { ...arrayData[index], [fieldName]: response };
        updatedValues = {
          ...updatedValues,
          workExperience: { experienceRecords: arrayData }
        };
      }
    } else {
      updatedValues = {
        ...updatedValues,
        [fieldParts[0]]: { ...updatedValues[fieldParts[0] as keyof FormValues], [fieldParts[1]]: response }
      };
    }

    setFieldValue(fieldPath, response);
    setFormData(updatedValues);
    setChatMessages(prev => [...prev, { text: response, isBot: false }]);
    localStorage.setItem('formData', JSON.stringify(updatedValues));

    // Handle next step or follow-up for repeatable fields
    if (currentQuestion.isArrayField && (currentQuestion as ChatMessageArray).arrayFieldName === 'education.academicRecords' && currentQuestion.subQuestionIndex === 3) {
      // After yearOfCompletion (subQuestionIndex 3), ask follow-up
      const followUpQuestion: ChatMessageArray = {
        text: "Would you like to add another academic record?",
        isBot: true,
        field: (currentQuestion as ChatMessageArray).arrayFieldName,
        inputType: "radio",
        options: ["Yes", "No"],
        isArrayField: true,
        arrayFieldName: (currentQuestion as ChatMessageArray).arrayFieldName,
        isFollowUp: true
      };
      setChatMessages(prev => [...prev, followUpQuestion]);
    } else if (currentQuestion.isArrayField && (currentQuestion as ChatMessageArray).arrayFieldName === 'education.academicRecords') {
      // Move to next sub-question within academicRecords
      const nextSubQuestionIndex = (currentQuestion.subQuestionIndex || 0) + 1;
      if (nextSubQuestionIndex < 4) { // 4 questions in academicRecords sequence
        const arrayFieldName = (currentQuestion as ChatMessageArray).arrayFieldName;
        const nextQuestion: ChatMessageArray = {
          text: [
            "Tell me about your college education (College name)",
            "What's your degree?",
            "What's your field of study?",
            "Which year did you complete it?"
          ][nextSubQuestionIndex],
          isBot: true,
          field: `${arrayFieldName}.${fieldParts[2]}.${['college', 'degree', 'fieldOfStudy', 'yearOfCompletion'][nextSubQuestionIndex]}`,
          inputType: nextSubQuestionIndex === 3 ? "select" : "text",
          options: nextSubQuestionIndex === 3 ? years : undefined,
          isArrayField: true,
          arrayFieldName,
          subQuestionIndex: nextSubQuestionIndex
        };
        setChatMessages(prev => [...prev, nextQuestion]);
      }
    } else if (currentQuestion.isArrayField) {
      const arrayFieldName = (currentQuestion as ChatMessageArray).arrayFieldName;
      if (arrayFieldName === 'education.extraCourses' && fieldParts[3] === undefined) {
        setChatMessages(prev => [...prev, { text: "Would you like to add another extra course?", isBot: true, field: arrayFieldName, inputType: "radio", options: ["Yes", "No"], isArrayField: true, arrayFieldName, isFollowUp: true }]);
      } else if (arrayFieldName === 'education.extracurriculars' && fieldParts[3] === undefined) {
        setChatMessages(prev => [...prev, { text: "Would you like to add another extracurricular activity?", isBot: true, field: arrayFieldName, inputType: "radio", options: ["Yes", "No"], isArrayField: true, arrayFieldName, isFollowUp: true }]);
      } else if (arrayFieldName === 'education.internships' && fieldParts[3] === undefined) {
        setChatMessages(prev => [...prev, { text: "Would you like to add another internship?", isBot: true, field: arrayFieldName, inputType: "radio", options: ["Yes", "No"], isArrayField: true, arrayFieldName, isFollowUp: true }]);
      } else if (arrayFieldName === 'workExperience.experienceRecords' && fieldParts[3] === 'tillYearMonth') {
        setChatMessages(prev => [...prev, { text: "Would you like to add another work experience?", isBot: true, field: arrayFieldName, inputType: "radio", options: ["Yes", "No"], isArrayField: true, arrayFieldName, isFollowUp: true }]);
      }
    } else {
      const nextStep = currentStep + 1;
      if (nextStep < questions.length) {
        setCurrentStep(nextStep);
        setTimeout(() => setChatMessages(prev => [...prev, questions[nextStep]]), 1000);
      } else if (values.education.hasInternships === 'yes' && values.education.internships.length === 0) {
        setChatMessages(prev => [...prev, { text: "Please tell me about your internship details", isBot: true, field: "education.internships.0", inputType: "textarea", isArrayField: true, arrayFieldName: "education.internships" }]);
      } else if (values.basicInfo.status === 'Working Professional' && (!values.workExperience?.experienceRecords.length)) {
        setChatMessages(prev => [...prev, workExperienceQuestions[0]]);
      } else {
        setChatMessages(prev => [...prev, { text: "Great! All done. Ready to submit?", isBot: true }]);
      }
    }

    setUserInput('');
    setIsLoading(false);
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
                  onKeyDown={(e) => e.key === 'Enter' && handleResponse(values, () => { }, userInput)}
                  disabled={isLoading || chatMessages[chatMessages.length - 1]?.inputType === 'select' || chatMessages[chatMessages.length - 1]?.inputType === 'radio'}
                />
                <button
                  onClick={() => handleResponse(values, () => { }, userInput)}
                  type="submit"
                  className="p-2 rounded-full hover:cursor-pointer transition-colors"
                  disabled={isLoading || chatMessages[chatMessages.length - 1]?.inputType === 'select' || chatMessages[chatMessages.length - 1]?.inputType === 'radio'}
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