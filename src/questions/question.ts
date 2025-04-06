import { Section } from "types/chat";



export const sections: Section[] = [
    {
        id: "SEC1",
        section: "Basic Information",
        questions: [
            { id: "S1QID1", question: "What is your name?", inputType: "text" },
            { id: "S1QID2", question: "What is your gender?", inputType: "radio", options: ["Male", "Female", "Other"] },
            { id: "S1QID3", question: "What is your address?", inputType: "text" },
            { id: "S1QID4", question: "What is your pincode?", inputType: "text" },
            { id: "S1QID5", question: "What is your mobile number?", inputType: "text" },
            { id: "S1QID6", question: "What is your email address?", inputType: "text" },
            { id: "S1QID7", question: "What defines you best?", inputType: "radio", options: ["Currently Studying", "Recently Graduated", "Working Professional"] }
        ]
    },
    {
        id: "SEC2",
        section: "Academic Information",
        questions: [
            { id: "A1QID1", question: "What was your high school stream?", inputType: "dropdown", options: ["Science with Biology", "Science without Biology", "Commerce", "Arts"] },
            { id: "A1QID2", question: "What was your high school percentage?", inputType: "text" },
            { id: "A1QID6", question: "Have you done any internships or part-time jobs?", inputType: "radio", options: ["Yes", "No"] },
        ]
    },
    {
        id: "SEC2_1",
        section: "Academic Records",
        questions: [
            {
                id: "A1QID3",
                question: "Academic Records",
                inputType: "array",
                fields: [
                    { id: "CollegeID", question: "Current / Last College", inputType: "text" },
                    { id: "DegreeID", question: "Degree", inputType: "text" },
                    { id: "FieldID", question: "Field of Study", inputType: "text" },
                    { id: "YearID", question: "Year of Completion", inputType: "date" } // ! BUG: No dropdown or radio is supported
                ]
            },
        ]
    },
    {
        id: "SEC2_2",
        section: "Extra Course Information",
        questions: [
            { id: "A1QID4", question: "Extra Courses Done", inputType: "array", fields: [{ id: "CourseID", question: "Course Name", inputType: "text" }] },
        ]
    },
    {
        id: "SEC2_2_1",
        section: "Extracurricular Information",
        questions: [
            { id: "A1QID5", question: "Extracurricular Done", inputType: "array", fields: [{ id: "ActivityID", question: "Activity Name", inputType: "text" }] },
        ]
    },
    {
        id: "SEC_2_3",
        section: "Internship Information",
        showOnlyWhen: { "A1QID6": "Yes" },
        questions: [
            {
                id: "I1Q1D1",
                question: "Internship Details",
                inputType: "array",
                fields: [{ id: "InternshipID", question: "Internship Description", inputType: "textarea" }]
            }
        ]
    },
    {
        // ? : Part - 3

        id: "SEC3",
        section: "Work Experience",
        showOnlyWhen: { "S1QID7": "Working Professional" },
        questions: [
            {
                id: "W1QID1",
                question: "Work Experience history",
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
    {
        id: "SEC4",
        section: "Career Goals",
        questions: [
            {
                id: "CGQ1",
                "question": "Choose your desired job roles in Bio Careers",
                inputType: "checkbox",
                options: ["CAREER1", "CAREER2", "CAREER3"]
            }
        ]
    },
    {
        id: "SEC5",
        section: "Existing Skills",
        questions: [
            {
                id: "ESQ1",
                "question": "Choose your Skills",
                inputType: "checkbox",
                options: ["SKILL1", "SKILL2", "SKILL3"]
            },
            {
                id: "ESQ2",
                "question": "If any other skill exist?",
                inputType: "text",
            }
        ]
    }
];