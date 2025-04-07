interface DataEntry {
    [key: string]: string; // Question ID mapped to response (e.g., "A" or "B")
}

export function calculateBigFiveScores(responses: DataEntry) {
    // Map response strings to numeric values
    const scoreMap = {
        "Strongly Disagree": 1,
        "Disagree": 2,
        "Neutral": 3,
        "Agree": 4,
        "Strongly Agree": 5
    };

    // Define trait ranges
    const traits = {
        Openness: { range: [1, 12], scores: [] },
        Conscientiousness: { range: [13, 24], scores: [] },
        Extraversion: { range: [25, 36], scores: [] },
        Agreeableness: { range: [37, 48], scores: [] },
        Neuroticism: { range: [49, 60], scores: [] }
    };

    // Process responses
    for (let i = 1; i <= 60; i++) {
        const questionId = `S7BFQ${i}`;
        const response = responses[questionId];
        const score = scoreMap[response] !== undefined ? scoreMap[response] : 1; // Default to 1 if unanswered/invalid

        // Assign score to the correct trait
        for (const trait in traits) {
            const [start, end] = traits[trait].range;
            if (i >= start && i <= end) {
                traits[trait].scores.push(score);
                break;
            }
        }
    }

    // Calculate percentages and format as strings
    const traitScores = {};
    for (const trait in traits) {
        const rawScore = traits[trait].scores.reduce((sum, score) => sum + score, 0);
        const percentage = rawScore * 1.65;
        traitScores[trait] = `${(Math.round(percentage * 10) / 10).toFixed(1)}%`; // e.g., "19.2%"
    }

    // Return JSON in the specified format
    return {
        "big_five": {
            "traits": traitScores
        }
    };
}

// Example usage
// const sampleResponses = {
//     "S7BFQ1": "Strongly Disagree",  // Openness: 1
//     "S7BFQ13": "Disagree",          // Conscientiousness: 2
//     "S7BFQ25": "Strongly Agree",    // Extraversion: 5
//     "S7BFQ37": " Agree",            // Agreeableness: 4
//     "S7BFQ49": "Neutral"            // Neuroticism: 3
// };

// const result = calculateBigFiveScores(sampleResponses);
// console.log(JSON.stringify(result, null, 2));

// Example output:
// {
//   "big_five": {
//     "traits": {
//       "Openness": "19.8%",
//       "Conscientiousness": "21.5%",
//       "Extraversion": "26.4%",
//       " Agreeableness": "24.8%",
//       "Neuroticism": "23.1%"
//     }
//   }
// }