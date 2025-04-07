// Define interface for question set details
interface QuestionSetDetail {
    id: number
    name: string;
    q_start_id: string;
    q_end_id: string;
    typeA: "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P",
    typeB: "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P"
}

// Define interface for the response data
interface DataEntry {
    [key: string]: string; // Question ID mapped to response (e.g., "A" or "B")
}

// Define interface for MBTI result
interface MBTIResult {
    type: string;
    traits: {
        Energy: string;
        Information: string;
        Decisions: string;
        Structure: string;
    };
    // scores: { [key: string]: number }
}

// Define the question set details with type
const questionSetDetails: QuestionSetDetail[] = [
    {
        id: 1,
        name: "Extraversion (E) vs. Introversion (I)",
        q_start_id: "S6PTQ1",
        q_end_id: "S6PTQ20",
        typeA: "E",
        typeB: "I"
    },
    {
        id: 2,
        name: "Sensing (S) vs. Intuition (N)",
        q_start_id: "S6PTQ21",
        q_end_id: "S6PTQ40",
        typeA: "S",
        typeB: "N"
    },
    {
        id: 3,
        name: "Thinking (T) vs. Feeling (F)",
        q_start_id: "S6PTQ41",
        q_end_id: "S6PTQ60",
        typeA: "T",
        typeB: "F"
    },
    {
        id: 4,
        name: "Judging (J) vs. Perceiving (P)",
        q_start_id: "S6PTQ61",
        q_end_id: "S6PTQ80",
        typeA: "J",
        typeB: "P"
    },
];

// Define the function with type annotations
export const getMBTIScore = (finalResponse: DataEntry): { mbti: MBTIResult } => {
    // Initialize counters with explicit type
    const scores: { [key: string]: number } = {
        E: 0, I: 0,
        S: 0, N: 0,
        T: 0, F: 0,
        J: 0, P: 0
    };

    // Helper function to count responses
    const countResponses = (startId: string, endId: string, typeA: string, typeB: string): void => {
        let startNum: number = parseInt(startId.replace('S6PTQ', ''));
        const endNum: number = parseInt(endId.replace('S6PTQ', ''));

        while (startNum <= endNum) {
            const qId: string = `S6PTQ${startNum}`;
            const response: string | undefined = finalResponse[qId];
            if (response === 'A') scores[typeA]++;
            if (response === 'B') scores[typeB]++;
            startNum++;
        }
    };

    // console.log("MBTI Score Table", scores)

    // Count responses for each dichotomy
    questionSetDetails.forEach((section: QuestionSetDetail) => {
        const typeA = section.typeA;
        const typeB = section.typeB;
        countResponses(section.q_start_id, section.q_end_id, typeA, typeB);
    });

    // Determine MBTI type
    let mbtiType: string = '';
    const traits: MBTIResult['traits'] = {
        Energy: '',
        Information: '',
        Decisions: '',
        Structure: ''
    };

    // E vs I
    if (scores.E > scores.I) {
        mbtiType += 'E';
        traits.Energy = 'Extraversion (E)';
    } else if (scores.I > scores.E) {
        mbtiType += 'I';
        traits.Energy = 'Introversion (I)';
    } else {
        mbtiType += 'E';
        traits.Energy = 'Extraversion (E) / Introversion (I)';
    }

    // S vs N
    if (scores.S > scores.N) {
        mbtiType += 'S';
        traits.Information = 'Sensing (S)';
    } else if (scores.N > scores.S) {
        mbtiType += 'N';
        traits.Information = 'Intuition (N)';
    } else {
        mbtiType += 'S';
        traits.Information = 'Sensing (S) / Intuition (N)';
    }

    // T vs F
    if (scores.T > scores.F) {
        mbtiType += 'T';
        traits.Decisions = 'Thinking (T)';
    } else if (scores.F > scores.T) {
        mbtiType += 'F';
        traits.Decisions = 'Feeling (F)';
    } else {
        mbtiType += 'T';
        traits.Decisions = 'Thinking (T) / Feeling (F)';
    }

    // J vs P
    if (scores.J > scores.P) {
        mbtiType += 'J';
        traits.Structure = 'Judging (J)';
    } else if (scores.P > scores.J) {
        mbtiType += 'P';
        traits.Structure = 'Perceiving (P)';
    } else {
        mbtiType += 'J';
        traits.Structure = 'Judging (J) / Perceiving (P)';
    }

    // Return result object with type
    return {
        mbti: {
            type: mbtiType,
            traits: traits,
            // scores: scores
        }
    };
};

