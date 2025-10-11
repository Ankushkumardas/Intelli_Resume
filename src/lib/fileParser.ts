import "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.5.136/build/pdf.min.mjs";

/**
 * Parses the content of a file (PDF, DOCX, or TXT) and returns the text content.
 * @param file The file to parse.
 * @returns A promise that resolves with the text content of the file.
 */
export async function parseFile(file: File): Promise<string> {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  // Handle PDF files
  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    try {
      const pdfjsLib = window.pdfjsLib;
      if (!pdfjsLib) throw new Error('pdf.js library is not loaded.');

      // Configure the worker source for pdf.js
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.5.136/build/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n\n'; // Add newline between pages
      }
      return fullText.trim();
    } catch (error) {
      console.error('Error parsing PDF:', error);
      throw new Error('Could not read text from the PDF file. It may be corrupted or an image-only PDF.');
    }
  }

  // Handle DOCX files
  if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileName.endsWith('.docx')
  ) {
    try {
      const mammoth = window.mammoth;
      if (!mammoth) throw new Error('Mammoth.js library is not loaded.');

      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } catch (error) {
      console.error('Error parsing DOCX:', error);
      throw new Error('Could not read text from the DOCX file.');
    }
  }

  // Handle TXT files
  if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
    return file.text();
  }

  // If file type is not supported
  throw new Error('Unsupported file type. Please upload a PDF, DOCX, or TXT file.');
}
