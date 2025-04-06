export interface Question {
    id: string;
    question: string;
    inputType: string;
    options?: string[];
    fields?: Question[];
}

export interface Section {
    id: string;
    section: string;
    questions: Question[];
    showOnlyWhen?: { [key: string]: string };
}

export interface DataEntry {
    answer: any;
    question: string;
}
