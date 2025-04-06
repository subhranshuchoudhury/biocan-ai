import { Section } from "types/chat";

export const sections: Section[] = [
    {
        // ? part 1
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
        // ? part 2
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
        section: `Academic Records`,
        questions: [
            {
                id: "A1QID3",
                question: `Academic Records</br><i style="color: white; font-size: 12px">Press Enter/Send button to start the chat.</i>`,
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
            {
                id: "A1QID4", question: `Lets fill your extra course information. </br><i style="color: white; font-size: 12px">Press Enter/Send button to start the chat.</i>`, inputType: "array", fields: [{ id: "CourseID", question: `<b>What was your course name?</b> </br> <i style="color:white;font-size:12px">Type N/A if not applied to you.</i>`, inputType: "text" }]
            },
        ]
    },
    {
        id: "SEC2_2_1",
        section: "Extracurricular Information",
        questions: [
            { id: "A1QID5", question: `Lets fill your extracurricular activities.</br><i style="color:white;font-size:12px">Press Enter/Send button to start the chat.</i>`, inputType: "array", fields: [{ id: "ActivityID", question: "Activity Name", inputType: "text" }] },
        ]
    },
    {
        id: "SEC_2_2",
        section: "internship details",
        showOnlyWhen: { "A1QID6": "Yes" },
        questions: [
            {
                id: "I1Q1D1",
                question: `<b>Internship information</b> </br><i style="color:white;font-size:12px">Press Enter/Send button to start the chat.</i>`,
                inputType: "array",
                fields: [{ id: "InternshipID", question: "Internship Description", inputType: "textarea" }]
            }
        ]
    },
    {
        // ? : part 3

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
    },
    {
        id: "SEC6",
        section: " Personality Test (MBTI Based)",
        questions: [
            {
                "id": "S6PTQ1",
                inputType: "radio",
                question: "(A): Prefer group activities and social gatherings.</br>(B) I enjoy spending time alone or with a close friend.",
                options: ["A", "B"],
            },
            {
                "id": "S6PTQ2",
                "inputType": "radio",
                "question": "(A) I am energized by talking to people.</br>(B) I feel drained after prolonged social interactions.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ3",
                "inputType": "radio",
                "question": "(A) I easily start conversations with strangers.</br>(B) I find it hard to start conversations with people I don’t know.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ4",
                "inputType": "radio",
                "question": "(A) I enjoy being the center of attention.</br>(B) I prefer to observe rather than be in the spotlight.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ5",
                "inputType": "radio",
                "question": "(A) I talk more than I listen.</br>(B) I listen more than I talk.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ6",
                "inputType": "radio",
                "question": "(A) I process my thoughts by speaking aloud.</br>(B) I process my thoughts internally before speaking.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ7",
                "inputType": "radio",
                "question": "(A) I prefer brainstorming sessions with others.</br>(B) I prefer thinking alone before sharing my ideas.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ8",
                "inputType": "radio",
                "question": "(A) I often speak before I think.</br>(B) I carefully think before I speak.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ9",
                "inputType": "radio",
                "question": "(A) I express my emotions outwardly.</br>(B) I keep my emotions private.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ10",
                "inputType": "radio",
                "question": "(A) I prefer working in a team.</br>(B) I prefer working alone.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ11",
                "inputType": "radio",
                "question": "(A) I find networking events exciting and engaging.</br>(B) I find networking events exhausting.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ12",
                "inputType": "radio",
                "question": "(A) I enjoy casual small talk with new people.</br>(B) I find small talk pointless and tiring.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ13",
                "inputType": "radio",
                "question": "(A) I would rather spend a weekend at a party or event.</br>(B) I would rather spend a weekend at home reading or relaxing.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ14",
                "inputType": "radio",
                "question": "(A) I tend to be expressive with my emotions.</br>(B) I tend to keep my emotions to myself.",
                "options": ["A", "B"]
            },

            {
                "id": "S6PTQ15",
                "inputType": "radio",
                "question": "(A) I often seek external stimulation and new experiences.</br>(B) I prefer familiar and comfortable environments.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ16",
                "inputType": "radio",
                "question": "(A) I prefer to talk things out when I have a problem.</br>(B) I prefer to think things through on my own when I have a problem.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ17",
                "inputType": "radio",
                "question": "(A) I enjoy fast-paced, energetic environments.</br>(B) I enjoy quiet, calm environments.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ18",
                "inputType": "radio",
                "question": "(A) I tend to be outgoing and make friends easily.</br>(B) I take my time warming up to new people.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ19",
                "inputType": "radio",
                "question": "(A) I would rather work in an open, collaborative space.</br>(B) I would rather work in a private, quiet space.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ20",
                "inputType": "radio",
                "question": "(A) I tend to jump into social interactions without hesitation.</br>(B) I prefer to observe first before engaging in social interactions.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ21",
                "inputType": "radio",
                "question": "(A) I trust facts and concrete details.</br>(B) I trust intuition and gut feelings.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ22",
                "inputType": "radio",
                "question": "(A) I prefer practical solutions.</br>(B) I enjoy exploring new ideas and theories.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ23",
                "inputType": "radio",
                "question": "(A) I notice and remember specific details easily.</br>(B) I focus on the big picture and overall meaning.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ24",
                "inputType": "radio",
                "question": "(A) I enjoy using tried-and-true methods.</br>(B) I like experimenting with new approaches.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ25",
                "inputType": "radio",
                "question": "(A) I prefer clear, factual information.</br>(B) I enjoy interpreting meanings and possibilities.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ26",
                "inputType": "radio",
                "question": "(A) I value real-world applications over abstract concepts.</br>(B) I am drawn to abstract and theoretical ideas.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ27",
                "inputType": "radio",
                "question": "(A) I prefer step-by-step instructions.</br>(B) I like figuring things out on my own.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ28",
                "inputType": "radio",
                "question": "(A) I focus on what is practical.</br>(B) I focus on what is possible.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ29",
                "inputType": "radio",
                "question": "(A) I prefer a straightforward and direct communication style.</br>(B) I enjoy symbolic and metaphorical language.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ30",
                "inputType": "radio",
                "question": "(A) I trust experiences over hunches.</br>(B) I trust insights and inspirations.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ31",
                "inputType": "radio",
                "question": "(A) I prefer predictable outcomes.</br>(B) I enjoy unpredictability and potential surprises.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ32",
                "inputType": "radio",
                "question": "(A) I focus on what is happening now.</br>(B) I think about what could happen in the future.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ33",
                "inputType": "radio",
                "question": "(A) I rely on what I can observe.</br>(B) I rely on my imagination.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ34",
                "inputType": "radio",
                "question": "(A) I prefer concrete facts over speculation.</br>(B) I enjoy pondering possibilities.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ35",
                "inputType": "radio",
                "question": "(A) I believe 'seeing is believing.'</br>(B) I believe in trusting one's instincts.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ36",
                "inputType": "radio",
                "question": "(A) I enjoy hands-on activities.</br>(B) I enjoy abstract discussions.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ37",
                "inputType": "radio",
                "question": "(A) I like to deal with real, tangible problems.</br>(B) I enjoy thinking about concepts and theories.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ38",
                "inputType": "radio",
                "question": "(A) I prefer learning from past experiences.</br>(B) I enjoy exploring new and untested ideas.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ39",
                "inputType": "radio",
                "question": "(A) I enjoy routine and structure.</br>(B) I enjoy change and variety.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ40",
                "inputType": "radio",
                "question": "(A) I take things literally.</br>(B) I look for deeper meanings.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ41",
                "inputType": "radio",
                "question": "(A) I make decisions based on logic and objectivity.</br>(B) I make decisions based on emotions and values.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ42",
                "inputType": "radio",
                "question": "(A) I believe justice is more important than mercy.</br>(B) I believe mercy is more important than justice.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ43",
                "inputType": "radio",
                "question": "(A) I analyze situations rationally.</br>(B) I consider how situations affect people emotionally.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ44",
                "inputType": "radio",
                "question": "(A) I find it easy to point out flaws in arguments.</br>(B) I try to avoid hurting people's feelings in arguments.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ45",
                "inputType": "radio",
                "question": "(A) I focus on being fair and unbiased.</br>(B) I focus on being empathetic and considerate.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ46",
                "inputType": "radio",
                "question": "(A) I believe feelings should not interfere with decision-making.</br>(B) I believe emotions play a key role in making the right decision.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ47",
                "inputType": "radio",
                "question": "(A) I value efficiency and competence in others.</br>(B) I value kindness and understanding in others.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ48",
                "inputType": "radio",
                "question": "(A) I can remain emotionally detached in difficult situations.</br>(B) I get emotionally involved in difficult situations.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ49",
                "inputType": "radio",
                "question": "(A) I prioritize achieving goals over maintaining harmony.</br>(B) I prioritize maintaining harmony over achieving goals.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ50",
                "inputType": "radio",
                "question": "(A) I appreciate constructive criticism.</br>(B) I feel hurt by criticism, even if it's constructive.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ51",
                "inputType": "radio",
                "question": "(A) I believe rules should be followed strictly.</br>(B) I believe rules should be adjusted based on circumstances.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ52",
                "inputType": "radio",
                "question": "(A) I prefer direct and blunt communication.</br>(B) I prefer diplomatic and sensitive communication.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ53",
                "inputType": "radio",
                "question": "(A) I focus on getting things done efficiently.</br>(B) I focus on making sure people feel good while getting things done.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ54",
                "inputType": "radio",
                "question": "(A) I tend to debate and argue for fun.</br>(B) I avoid debates and prefer agreement.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ55",
                "inputType": "radio",
                "question": "(A) I see mistakes as learning opportunities.</br>(B) I see mistakes as failures and feel bad about them.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ56",
                "inputType": "radio",
                "question": "(A) I put logic first when solving a problem.</br>(B) I consider people's emotions when solving a problem.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ57",
                "inputType": "radio",
                "question": "(A) I am more focused on facts and accuracy.</br>(B) I am more focused on people's feelings and relationships.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ58",
                "inputType": "radio",
                "question": "(A) I think that truth is more important than tact.</br>(B) I think that tact is more important than truth.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ59",
                "inputType": "radio",
                "question": "(A) I would rather be respected than liked.</br>(B) I would rather be liked than respected.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ60",
                "inputType": "radio",
                "question": "(A) I view fairness as treating everyone equally.</br>(B) I view fairness as treating people based on their needs.",
                "options": ["A", "B"]
            },

            {
                "id": "S6PTQ61",
                "inputType": "radio",
                "question": "(A) I like having a planned and organized schedule.</br>(B) I prefer to go with the flow and be spontaneous.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ62",
                "inputType": "radio",
                "question": "(A) I like making detailed to-do lists.</br>(B) I keep things flexible and don't like rigid plans.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ63",
                "inputType": "radio",
                "question": "(A) I like to finish projects as soon as possible.</br>(B) I tend to procrastinate and work better under pressure.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ64",
                "inputType": "radio",
                "question": "(A) I feel uncomfortable when things are unstructured or uncertain.</br>(B) I enjoy unpredictability and spontaneity.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ65",
                "inputType": "radio",
                "question": "(A) I prefer to make decisions quickly and stick to them.</br>(B) I like to keep my options open as long as possible.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ66",
                "inputType": "radio",
                "question": "(A) I feel more at ease when I have closure on a decision.</br>(B) I feel more at ease when I have multiple possibilities.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ67",
                "inputType": "radio",
                "question": "(A) I like following a fixed plan.</br>(B) I enjoy adapting to changes and unexpected opportunities.",
                "options": ["A", "B"]
            },

            {
                "id": "S6PTQ68",
                "inputType": "radio",
                "question": "(A) I like structured environments.</br>(B) I prefer flexible and dynamic environments.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ69",
                "inputType": "radio",
                "question": "(A) I prefer to have a well-defined schedule.</br>(B) I prefer to take things as they come.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ70",
                "inputType": "radio",
                "question": "(A) I am disciplined about meeting deadlines.</br>(B) I tend to miss deadlines or complete tasks last-minute.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ71",
                "inputType": "radio",
                "question": "(A) I prefer sticking to the rules.</br>(B) I often challenge or bend the rules.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ72",
                "inputType": "radio",
                "question": "(A) I get frustrated when people are indecisive.</br>(B) I like exploring different possibilities before deciding.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ73",
                "inputType": "radio",
                "question": "(A) I enjoy creating order in my surroundings.</br>(B) I don't mind a little mess or disorganization.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ74",
                "inputType": "radio",
                "question": "(A) I prefer predictable routines.</br>(B) I enjoy changing things up frequently.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ75",
                "inputType": "radio",
                "question": "(A) I like sticking to my commitments.</br>(B) I like keeping my options open in case something better comes up.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ76",
                "inputType": "radio",
                "question": "(A) I prefer completing one task before starting another.</br>(B) I prefer multitasking and switching between tasks.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ77",
                "inputType": "radio",
                "question": "(A) I get frustrated when plans change last minute.</br>(B) I adapt easily when plans change.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ78",
                "inputType": "radio",
                "question": "(A) I prefer knowing what's going to happen next.</br>(B) I enjoy surprises and the unknown.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ79",
                "inputType": "radio",
                "question": "(A) I work best when I have a clear timeline.</br>(B) I work best when I can be flexible with time.",
                "options": ["A", "B"]
            },
            {
                "id": "S6PTQ80",
                "inputType": "radio",
                "question": "(A) I prefer structure and organization.</br>(B) I prefer freedom and adaptability.",
                "options": ["A", "B"]
            }


        ]
    },
    {
        id: "SEC7",
        section: "Big FIVE (Myers-Briggs Type Indicator) - 60 Questions ",
        questions: [
            {
                "id": "S7BFQ0",
                "inputType": "radio",
                "question": "You will be asked 60 Question and you have to choose one from four options.",
                "options": ["Start"]
            },
            {
                "id": "S7BFQ1",
                "inputType": "radio",
                "question": "I enjoy trying new experiences and ideas.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ2",
                "inputType": "radio",
                "question": "I appreciate art, music, and literature deeply.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ3",
                "inputType": "radio",
                "question": "I like solving complex problems and puzzles.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ4",
                "inputType": "radio",
                "question": "I prefer new and unconventional ways of doing things.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ5",
                "inputType": "radio",
                "question": "I am curious about different cultures and philosophies.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ6",
                "inputType": "radio",
                "question": "I get bored with routine tasks easily.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ7",
                "inputType": "radio",
                "question": "I tend to think about abstract or theoretical ideas.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ8",
                "inputType": "radio",
                "question": "I am interested in scientific and technological advancements.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ9",
                "inputType": "radio",
                "question": "I often come up with creative solutions to problems.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ10",
                "inputType": "radio",
                "question": "I enjoy discussing deep, intellectual topics.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ11",
                "inputType": "radio",
                "question": "I am open to re-evaluating my beliefs when presented with new evidence.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ12",
                "inputType": "radio",
                "question": "I prefer spontaneous adventures over structured plans.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },

            {
                "id": "S7BFQ13",
                "inputType": "radio",
                "question": "I keep my workspace organized and tidy.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ14",
                "inputType": "radio",
                "question": "I set long-term goals and stick to them.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ15",
                "inputType": "radio",
                "question": "I always complete tasks before the deadline.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ16",
                "inputType": "radio",
                "question": "I prefer having a structured schedule for my day.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ17",
                "inputType": "radio",
                "question": "I am highly disciplined in my work or studies.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ18",
                "inputType": "radio",
                "question": "I rarely procrastinate on important tasks.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ19",
                "inputType": "radio",
                "question": "I follow through on commitments, even when difficult.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ20",
                "inputType": "radio",
                "question": "I carefully plan before making important decisions.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ21",
                "inputType": "radio",
                "question": "I stick to my routines and habits.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ22",
                "inputType": "radio",
                "question": "I hold myself accountable for my actions.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ23",
                "inputType": "radio",
                "question": "I find it easy to resist temptations and distractions.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ24",
                "inputType": "radio",
                "question": "I prefer working methodically over improvising.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },

            {
                "id": "S7BFQ25",
                "inputType": "radio",
                "question": "I enjoy socializing with large groups of people.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ26",
                "inputType": "radio",
                "question": "I feel energized after spending time with others.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ27",
                "inputType": "radio",
                "question": "I often take the lead in group discussions.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ28",
                "inputType": "radio",
                "question": "I seek out exciting and stimulating experiences.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ29",
                "inputType": "radio",
                "question": "I express my emotions openly and enthusiastically.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ30",
                "inputType": "radio",
                "question": "I enjoy being the center of attention.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ31",
                "inputType": "radio",
                "question": "I frequently initiate conversations with new people.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ32",
                "inputType": "radio",
                "question": "I prefer working in teams rather than alone.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ33",
                "inputType": "radio",
                "question": "I get bored when I have to spend too much time alone.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ34",
                "inputType": "radio",
                "question": "I talk more than I listen in conversations.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ35",
                "inputType": "radio",
                "question": "I often take risks in social situations.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ36",
                "inputType": "radio",
                "question": "I easily make new friends wherever I go.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },

            {
                "id": "S7BFQ37",
                "inputType": "radio",
                "question": "I sympathize with others' problems and emotions.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ38",
                "inputType": "radio",
                "question": "I enjoy helping people even if there's no reward.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ39",
                "inputType": "radio",
                "question": "I trust people easily and give them the benefit of the doubt.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ40",
                "inputType": "radio",
                "question": "I avoid conflicts and try to keep peace.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ41",
                "inputType": "radio",
                "question": "I go out of my way to make others feel comfortable.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ42",
                "inputType": "radio",
                "question": "I often put others' needs before my own.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ43",
                "inputType": "radio",
                "question": "I feel guilty if I accidentally hurt someone's feelings.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ44",
                "inputType": "radio",
                "question": "I am forgiving even when someone has wronged me.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ45",
                "inputType": "radio",
                "question": "I rarely criticize or insult others.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ46",
                "inputType": "radio",
                "question": "I believe cooperation is more important than competition.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ47",
                "inputType": "radio",
                "question": "I tend to agree with others to avoid arguments.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ48",
                "inputType": "radio",
                "question": "I dislike confrontations and arguments.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },

            {
                "id": "S7BFQ49",
                "inputType": "radio",
                "question": "I frequently feel stressed or anxious.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ50",
                "inputType": "radio",
                "question": "I get upset easily over small things.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ51",
                "inputType": "radio",
                "question": "I worry a lot about future events.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ52",
                "inputType": "radio",
                "question": "I am often self-conscious in social situations.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ53",
                "inputType": "radio",
                "question": "I struggle with mood swings.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ54",
                "inputType": "radio",
                "question": "I take criticism very personally.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ55",
                "inputType": "radio",
                "question": "I have trouble controlling my emotions.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ56",
                "inputType": "radio",
                "question": "I feel overwhelmed when I have too much to do.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ57",
                "inputType": "radio",
                "question": "I often doubt my abilities and decisions.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ58",
                "inputType": "radio",
                "question": "I get irritated easily when things don't go my way.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ59",
                "inputType": "radio",
                "question": "I fear failure more than I should.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                "id": "S7BFQ60",
                "inputType": "radio",
                "question": "I feel nervous in unfamiliar situations.",
                "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            }




        ]

    }
];