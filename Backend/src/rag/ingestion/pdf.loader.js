import {
    PDFLoader
} from "@langchain/community/document_loaders/fs/pdf";

export const loadPdf =
    async (buffer) => {
        const blob =
            new Blob(
                [buffer],
                {
                    type:
                        "application/pdf"
                }
            );

        const loader =
            new PDFLoader(blob);

        const documents =
            await loader.load();

        return documents;
    };