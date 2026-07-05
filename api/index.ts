import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const app = express();
app.use(express.json());

// API Route for AI Cover page metadata extraction
app.post("/api/gemini/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: "Missing required parameter 'prompt' in request body." });
      return;
    }

    const systemInstruction = 
      `You are an expert academic cover page coordinator. Your job is to extract or intelligently generate cover page details in structured JSON format based on the user's prompt (contains syllabus, syllabus notes, draft information, or instructions).
      Ensure everything is capitalized professionally. Clean and format student and instructor details into multiline blocks separated by newline(\\n).
      For instructor details: line 1 is Name, line 2 is Designation, line 3 is Department, line 4 is University, line 5 is Location/Country.
      For student details: line 1 is Name, line 2 is ID details (e.g. STUDENT ID: 251009), line 3 is Year/Term (e.g. 1st Year, 2nd Term), line 4 is Department, line 5 is University, line 6 is Location.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            documentType: { type: Type.STRING, description: "Category of assignment, e.g., 'AN ASSIGNMENT ON', 'LAB REPORT ON', 'TERM PAPER ON'" },
            topicTitle: { type: Type.STRING, description: "Uppercase title/topic of the assignment or report" },
            courseNo: { type: Type.STRING, description: "Course code or number, e.g., 'ES-1205'" },
            courseNoHeading: { type: Type.STRING, description: "Prefix header for course number, e.g., 'COURSE NO:'" },
            courseName: { type: Type.STRING, description: "Title or name of the course" },
            courseNameHeading: { type: Type.STRING, description: "Prefix header for course name, e.g., 'COURSE TITLE:'" },
            teacherHeading: { type: Type.STRING, description: "Teacher submitted to section heading, e.g., 'SUBMITTED TO,'" },
            teacherDetails: { type: Type.STRING, description: "Lines of teacher details separated strictly by '\\n'" },
            submittedByLabel: { type: Type.STRING, description: "Student submitted by section heading, e.g., 'SUBMITTED BY,'" },
            studentDetails: { type: Type.STRING, description: "Lines of student details separated strictly by '\\n'" },
            submissionDate: { type: Type.STRING, description: "Submission date in YYYY-MM-DD or readable format" },
            submissionDateHeading: { type: Type.STRING, description: "Date header label, e.g., 'DATE OF SUBMISSION:'" }
          },
          required: [
            "documentType", "topicTitle", "courseNo", "courseNoHeading", 
            "courseName", "courseNameHeading", "teacherHeading", "teacherDetails", 
            "submittedByLabel", "studentDetails", "submissionDate", "submissionDateHeading"
          ]
        }
      }
    });

    const extractedText = response.text;
    if (!extractedText) {
      throw new Error("No extracted details returned from Gemini.");
    }

    res.json(JSON.parse(extractedText));
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ error: err.message || "Failed to process AI auto-fill request." });
  }
});

export default app;
