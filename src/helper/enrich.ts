import { DataEntry, Section } from "types/chat";



export function enrichDataWithQuestions(
    data: Record<string, any>,
    sections: Section[]
): Record<string, DataEntry | DataEntry[]> {
    const questionMap: Record<string, string> = {};

    // Create a map of question IDs and their text
    sections.forEach(section => {
        section.questions.forEach(question => {
            questionMap[question.id] = question.question;
        });
    });

    const enrichedData: Record<string, DataEntry | DataEntry[]> = {};

    // Process each key-value in the data object
    Object.keys(data).forEach(key => {
        if (questionMap[key]) {
            const answer = data[key];

            // Handle arrays (nested structures)
            if (Array.isArray(answer)) {
                enrichedData[key] = answer.map(item => ({
                    answer: item,
                    question: questionMap[key]
                }));
            } else {
                enrichedData[key] = {
                    answer,
                    question: questionMap[key]
                };
            }
        }
    });

    return enrichedData;
}
