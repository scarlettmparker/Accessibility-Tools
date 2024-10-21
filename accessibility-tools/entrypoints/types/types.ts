// button type
export type Button = {
    id: number;
    name: string;
    color?: string;
    hover_color: string;
    click_color: string;
    class_name?: string;
}

// type for paragraph data
export type ParagraphData = {
    text: string;
    partOfSpeech: string;
}
