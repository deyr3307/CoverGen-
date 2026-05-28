import React, { useState } from "react";
import { CoverPageData } from "../types";
import { 
  Sparkles, 
  ChevronRight, 
  Plus, 
  X, 
  Loader2, 
  Flame,
  CheckCircle2,
  HelpCircle,
  Undo2,
  Redo2,
  Calendar,
  BookOpen,
  User,
  Activity
} from "lucide-react";

interface DataInputPageProps {
  coverData: CoverPageData;
  setCoverData: React.Dispatch<React.SetStateAction<CoverPageData>>;
  applyPresetDataset: (type: 'physics' | 'env' | 'cse') => void;
  onNext: () => void;
  theme?: 'dark' | 'light';
}

export function DataInputPage({ coverData, setCoverData, applyPresetDataset, onNext, theme = 'dark' }: DataInputPageProps) {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiSuccessMessage, setAiSuccessMessage] = useState("");

  const [activePreset, setActivePreset] = useState<string | null>(null);

  const isDark = theme === "dark";

  // Dynamic style variables for adaptive light & dark themes
  const cardClass = isDark 
    ? "bg-[#0b0f19]/90 border border-[#161e33] text-slate-100 shadow-xl" 
    : "bg-white border border-slate-200 text-slate-800 shadow-md";
  const labelClass = isDark
    ? "text-slate-400"
    : "text-slate-500";
  const inputClass = isDark
    ? "w-full bg-[#070b13] border border-[#1a233d] focus:border-indigo-505 text-slate-200 placeholder-slate-700 outline-none transition-all font-medium rounded-xl"
    : "w-full bg-slate-50 border border-slate-200 focus:border-indigo-505 text-slate-800 placeholder-slate-400 outline-none transition-all font-medium rounded-xl";
  const numBgClassClass = isDark
    ? "bg-[#052e16] border border-emerald-500/20 text-emerald-400"
    : "bg-emerald-50 border border-emerald-200 text-emerald-600";
  const numBgTeacherClass = isDark
    ? "bg-[#4c0519] border border-rose-955/20 text-rose-450"
    : "bg-rose-50 border border-rose-100 text-rose-600";
  const numBgStudentClass = isDark
    ? "bg-[#1e1b4b] border border-indigo-955/20 text-indigo-400"
    : "bg-indigo-50 border border-indigo-100 text-indigo-600";
  const numBgDateClass = isDark
    ? "bg-orange-950/40 border border-orange-500/30 text-orange-400"
    : "bg-orange-50 border border-orange-200 text-orange-600";

  const handlePresetTrigger = (type: 'physics' | 'env' | 'cse') => {
    setActivePreset(type);
    applyPresetDataset(type);
  };

  const updateField = (field: keyof CoverPageData, value: string) => {
    setCoverData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAiAutoFill = async () => {
    if (!aiPrompt.trim()) {
      setAiError("Please type or paste some context first so we can analyze compiling fields.");
      return;
    }

    setIsAiLoading(true);
    setAiError("");
    setAiSuccessMessage("");

    try {
      const response = await fetch("/api/auto-fill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: aiPrompt })
      });

      if (!response.ok) {
        throw new Error("API compilation communication failure. Please verify server initialization.");
      }

      const parsedJson = await response.json();

      setCoverData(prev => ({
        ...prev,
        ...parsedJson,
        studentName: parsedJson.studentDetails?.split("\n")[0] || prev.studentName,
        teacherName: parsedJson.teacherDetails?.split("\n")[0] || prev.teacherName,
      }));

      setAiSuccessMessage("Cover page credentials analyzed and imported successfully!");
      setAiPrompt("");
      setTimeout(() => {
        setIsAiModalOpen(false);
        setAiSuccessMessage("");
      }, 1500);

    } catch (err: any) {
      setAiError(err.message || "An unexpected error occurred during AI analysis.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div id="credentials-wizard-panel" className={`relative min-h-[calc(100vh-65px)] overflow-x-hidden py-10 px-4 md:px-8 flex flex-col items-center select-none transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-[#060813] bg-[linear-gradient(to_right,#111625_1px,transparent_1px),linear-gradient(to_bottom,#111625_1px,transparent_1px)] text-slate-100' 
        : 'bg-[#fafafc] bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] text-slate-800'
    } bg-[size:4rem_4rem]`}>
      
      {/* GLOWING ORBS AESTHETIC DECORATION */}
      <div className={`absolute top-20 left-12 w-96 h-96 rounded-full blur-[120px] pointer-events-none transition-colors ${
        isDark ? "bg-indigo-500/10" : "bg-indigo-300/[0.04]"
      }`} />
      <div className={`absolute bottom-40 right-12 w-96 h-96 rounded-full blur-[140px] pointer-events-none transition-colors ${
        isDark ? "bg-purple-500/5" : "bg-purple-300/[0.02]"
      }`} />

      {/* COMPACT CLEAN HERO SECTION */}
      <div className="text-center max-w-xl mb-7 relative z-10 flex flex-col items-center">
        
        <h1 
          className="text-3xl md:text-[2.6rem] font-extrabold tracking-widest uppercase mt-4 text-center font-sans bg-gradient-to-r from-[#fa8c35] via-[#f43f5e] to-[#3b82f6] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient"
          style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}
        >
          Assignment Information
        </h1>
        <p className={`text-xs md:text-sm mt-3.5 max-w-sm md:max-w-md mx-auto leading-relaxed font-sans font-medium ${
          isDark ? 'text-[#94a3b8]' : 'text-slate-505'
        }`}>
          Fill in the core details of your assignment. You'll be able to style and format the canvas in the next step.
        </p>

        {/* FLOATING ACTION AUTOFILL Sparkles BUTTON */}
        <button
          onClick={() => setIsAiModalOpen(true)}
          className={`mt-6 flex items-center justify-center gap-2 py-2.5 px-6 rounded-full font-bold text-xs tracking-wider transition-all cursor-pointer shadow-[0_4px_20px_rgba(79,70,229,0.1)] active:scale-95 duration-150 ${
            isDark
              ? 'bg-[#121932] border border-[#2b3975] text-[#818cf8] hover:bg-[#192244] hover:text-white'
              : 'bg-white border border-slate-200 text-indigo-650 hover:bg-slate-50 hover:text-indigo-750 shadow-sm'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Auto-fill with AI Assistant</span>
        </button>
      </div>

      {/* QUICK PRESETS FILL TO ASSIST TESTING */}
      <div className="w-full max-w-[21rem] mb-8 relative z-10">
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <span className={`h-[1px] w-6 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
          <span className={`text-[9px] font-bold uppercase tracking-widest font-mono ${
            isDark ? 'text-slate-500' : 'text-slate-400'
          }`}>
            Or select rapid layout standard:
          </span>
          <span className={`h-[1px] w-6 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => handlePresetTrigger('physics')}
            className={`py-2 px-1 text-[9px] font-bold border rounded-lg transition-all truncate cursor-pointer uppercase font-mono ${
              activePreset === 'physics'
                ? "bg-indigo-600 border-indigo-500 text-white"
                : isDark
                  ? "bg-[#0b0f19]/80 border-slate-900 text-slate-450 hover:text-slate-200 hover:border-slate-800"
                  : "bg-white border-slate-200 text-slate-600 hover:text-slate-800 shadow-sm"
            }`}
          >
            Physics Lab
          </button>
          <button
            onClick={() => handlePresetTrigger('env')}
            className={`py-2 px-1 text-[9px] font-bold border rounded-lg transition-all truncate cursor-pointer uppercase font-mono ${
              activePreset === 'env'
                ? "bg-emerald-600 border-emerald-500 text-white"
                : isDark
                  ? "bg-[#0b0f19]/80 border-slate-900 text-slate-455 hover:text-slate-200 hover:border-slate-800"
                  : "bg-white border-slate-200 text-slate-600 hover:text-slate-800 shadow-sm"
            }`}
          >
            SunderBans
          </button>
          <button
            onClick={() => handlePresetTrigger('cse')}
            className={`py-2 px-1 text-[9px] font-bold border rounded-lg transition-all truncate cursor-pointer uppercase font-mono ${
              activePreset === 'cse'
                ? "bg-purple-650 border-purple-500 text-white"
                : isDark
                  ? "bg-[#0b0f19]/80 border-slate-900 text-slate-455 hover:text-slate-200 hover:border-slate-800"
                  : "bg-white border-slate-200 text-slate-600 hover:text-slate-800 shadow-sm"
            }`}
          >
            CSE Code
          </button>
        </div>
      </div>

      {/* MAIN CARDS CONTAINER */}
      <div className="w-full max-w-[24.5rem] md:max-w-md space-y-5 relative z-10 font-sans pb-16">

        {/* CARD UNINDEXED: ASSIGNMENT TYPE */}
        <div className={`p-5 md:p-6 rounded-2xl space-y-4 ${cardClass}`}>
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)] animate-pulse" />
            <span className="text-[10px] font-mono font-extrabold text-[#3b82f6] dark:text-blue-400 uppercase tracking-widest">
              Assignment Type
            </span>
          </div>
          <div>
            <select
              value={coverData.documentType}
              onChange={(e) => updateField("documentType", e.target.value)}
              className={`px-4 py-3.5 text-[13px] font-semibold tracking-wide cursor-pointer ${inputClass}`}
            >
              <option value="AN ASSIGNMENT ON" className="bg-white text-slate-800 dark:bg-[#070b13] dark:text-slate-200">AN ASSIGNMENT ON</option>
              <option value="A LAB REPORT ON" className="bg-white text-slate-800 dark:bg-[#070b13] dark:text-slate-200">A LAB REPORT ON</option>
              <option value="A SESSIONAL ON" className="bg-white text-slate-800 dark:bg-[#070b13] dark:text-slate-200">A SESSIONAL ON</option>
              <option value="PROJECT REPORT ON" className="bg-white text-slate-800 dark:bg-[#070b13] dark:text-slate-200">PROJECT REPORT ON</option>
              <option value="FIELDWORK ON" className="bg-white text-slate-800 dark:bg-[#070b13] dark:text-slate-200">FIELDWORK ON</option>
              <option value="A THESIS ON" className="bg-white text-slate-800 dark:bg-[#070b13] dark:text-slate-200">A THESIS ON</option>
            </select>
          </div>
        </div>

        {/* CARD UNINDEXED 2: ASSIGNMENT TITLE / TOPIC */}
        <div className={`p-5 md:p-6 rounded-2xl space-y-4 ${cardClass}`}>
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2.5 h-2.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)] animate-pulse" />
            <span className="text-[10px] font-mono font-extrabold text-[#6366f1] dark:text-indigo-400 uppercase tracking-widest">
              Topic Title
            </span>
          </div>
          <div>
            <textarea
              rows={2}
              value={coverData.topicTitle}
              onChange={(e) => updateField("topicTitle", e.target.value)}
              placeholder="e.g. ANALYSIS OF HEAVY METAL CONCENTRATION"
              className={`px-4 py-3.5 text-[13px] font-bold uppercase resize-none leading-relaxed tracking-normal font-sans ${inputClass}`}
            />
          </div>
        </div>

        {/* STEP CARD 1: COURSE DETAILS */}
        <div className={`p-5 md:p-6 rounded-2xl space-y-5 ${cardClass}`}>
          <div className="flex items-center space-x-2.5">
            <div className={`w-8 h-8 rounded-full text-xs font-bold font-mono flex items-center justify-center ${numBgClassClass}`}>
              1
            </div>
            <span className={`text-[17px] md:text-[19px] font-bold tracking-wide font-cursive ${isDark ? "text-[#10b981]" : "text-emerald-700"}`}>
              Course Details
            </span>
          </div>

          <div className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className={`block text-[9px] font-mono font-extrabold uppercase tracking-widest leading-none ${isDark ? "text-emerald-500" : "text-emerald-600"}`}>
                Course No. (Heading)
              </label>
              <input
                type="text"
                value={coverData.courseNoHeading || "Course No:"}
                onChange={(e) => updateField("courseNoHeading", e.target.value)}
                placeholder="e.g. COURSE NO:"
                className={`px-3.5 py-3 text-[12px] font-semibold ${inputClass}`}
              />
            </div>

            <div className="space-y-1.5">
              <label className={`block text-[9px] font-mono font-extrabold uppercase tracking-widest leading-none ${isDark ? "text-emerald-500" : "text-emerald-600"}`}>
                Course No. (Content)
              </label>
              <input
                type="text"
                value={coverData.courseNo}
                onChange={(e) => updateField("courseNo", e.target.value)}
                placeholder="e.g. ES-1205"
                className={`px-3.5 py-3 text-[12px] font-bold ${inputClass}`}
              />
            </div>

            <div className="space-y-1.5">
              <label className={`block text-[9px] font-mono font-extrabold uppercase tracking-widest leading-none ${isDark ? "text-emerald-500" : "text-emerald-600"}`}>
                Course Title (Heading)
              </label>
              <input
                type="text"
                value={coverData.courseNameHeading || "COURSE TITLE:"}
                onChange={(e) => updateField("courseNameHeading", e.target.value)}
                placeholder="e.g. COURSE TITLE:"
                className={`px-3.5 py-3 text-[12px] font-semibold ${inputClass}`}
              />
            </div>

            <div className="space-y-1.5">
              <label className={`block text-[9px] font-mono font-extrabold uppercase tracking-widest leading-none ${isDark ? "text-emerald-500" : "text-emerald-600"}`}>
                Course Title (Content)
              </label>
              <input
                type="text"
                value={coverData.courseName}
                onChange={(e) => updateField("courseName", e.target.value)}
                placeholder="e.g. Environmental Chemistry Lab"
                className={`px-3.5 py-3 text-[12px] font-bold ${inputClass}`}
              />
            </div>
          </div>
        </div>

        {/* STEP CARD 2: RECIPIENT TEACHER DETAILS */}
        <div className={`p-5 md:p-6 rounded-2xl space-y-5 ${cardClass}`}>
          <div className="flex items-center space-x-2.5">
            <div className={`w-8 h-8 rounded-full text-xs font-bold font-mono flex items-center justify-center ${numBgTeacherClass}`}>
              2
            </div>
            <span className={`text-[19px] md:text-[21px] font-bold tracking-wide font-cursive text-rose-500`} style={{ color: isDark ? '#f43f5e' : '#e11d48' }}>
              Supervisor / Submitted To
            </span>
          </div>

          <div className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className={`block text-[9px] font-mono font-extrabold uppercase tracking-widest leading-none ${isDark ? "text-rose-500" : "text-rose-600"}`}>
                Supervisor Header Label
              </label>
              <input
                type="text"
                value={coverData.teacherHeading || "SUBMITTED TO,"}
                onChange={(e) => updateField("teacherHeading", e.target.value)}
                className={`px-3.5 py-3 text-[14px] font-bold font-cursive ${inputClass}`}
              />
            </div>

            <div className="space-y-1.5">
              <label className={`block text-[9px] font-mono font-extrabold uppercase tracking-widest leading-none ${isDark ? "text-rose-500" : "text-rose-600"}`}>
                Full Structural Supervisor Details (Markdown/Multi-line)
              </label>
              <textarea
                rows={4}
                value={coverData.teacherDetails}
                onChange={(e) => {
                  updateField("teacherDetails", e.target.value);
                  const firstLine = e.target.value.split("\n")[0] || "";
                  updateField("teacherName", firstLine);
                }}
                placeholder="Dr. S. M. Tariqul Islam&#13;Professor&#13;Environmental Science Discipline&#13;Khulna University"
                className={`px-3.5 py-3 text-[12px] font-mono leading-relaxed resize-none ${inputClass}`}
              />
            </div>
          </div>
        </div>

        {/* STEP CARD 3: SUBMITTEE STUDENT DETAILS */}
        <div className={`p-5 md:p-6 rounded-2xl space-y-5 ${cardClass}`}>
          <div className="flex items-center space-x-2.5">
            <div className={`w-8 h-8 rounded-full text-xs font-bold font-mono flex items-center justify-center ${numBgStudentClass}`}>
              3
            </div>
            <span className={`text-[19px] md:text-[21px] font-bold tracking-wide font-cursive ${isDark ? "text-indigo-400" : "text-indigo-700"}`}>
              Student Credentials / Submitted By
            </span>
          </div>

          <div className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className={`block text-[9px] font-mono font-extrabold uppercase tracking-widest leading-none ${isDark ? "text-indigo-500" : "text-indigo-600"}`}>
                Student Header Label
              </label>
              <input
                type="text"
                value={coverData.submittedByLabel || "SUBMITTED BY,"}
                onChange={(e) => updateField("submittedByLabel", e.target.value)}
                className={`px-3.5 py-3 text-[14px] font-bold font-cursive ${inputClass}`}
              />
            </div>

            <div className="space-y-1.5">
              <label className={`block text-[9px] font-mono font-extrabold uppercase tracking-widest leading-none ${isDark ? "text-indigo-500" : "text-indigo-600"}`}>
                Full Structural Student Details (Markdown/Multi-line)
              </label>
              <textarea
                rows={4}
                value={coverData.studentDetails}
                onChange={(e) => {
                  updateField("studentDetails", e.target.value);
                  const firstLine = e.target.value.split("\n")[0] || "";
                  updateField("studentName", firstLine);
                }}
                placeholder="Anirudha Dey&#13;Student ID: 251009&#13;1st year, 2nd Term&#13;Khulna University"
                className={`px-3.5 py-3 text-[12px] font-mono leading-relaxed resize-none ${inputClass}`}
              />
            </div>
          </div>
        </div>

        {/* STEP CARD 4: DATE OF SUBMISSION */}
        <div className={`p-5 md:p-6 rounded-2xl space-y-5 ${cardClass}`}>
          <div className="flex items-center space-x-2.5">
            <div className={`w-8 h-8 rounded-full text-xs font-bold font-mono flex items-center justify-center ${numBgDateClass}`}>
              4
            </div>
            <span className={`text-[17px] md:text-[19px] font-bold tracking-wide font-cursive ${isDark ? "text-orange-400" : "text-orange-600"}`}>
              Submission Date
            </span>
          </div>

          <div className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className={`block text-[9px] font-mono font-extrabold uppercase tracking-widest leading-none ${isDark ? "text-orange-500" : "text-orange-600"}`}>
                Date Heading Option
              </label>
              <input
                type="text"
                value={coverData.submissionDateHeading || "DATE OF SUBMISSION:"}
                onChange={(e) => updateField("submissionDateHeading", e.target.value)}
                className={`px-3.5 py-3 text-[14px] font-bold font-cursive ${inputClass}`}
              />
            </div>

            <div className="space-y-1.5">
              <label className={`block text-[9px] font-mono font-extrabold uppercase tracking-widest leading-none ${isDark ? "text-orange-500" : "text-orange-600"}`}>
                Date Value (Content Link)
              </label>
              <input
                type="date"
                value={coverData.submissionDate}
                onChange={(e) => updateField("submissionDate", e.target.value)}
                className={`px-3.5 py-3 text-[12px] font-bold ${inputClass}`}
              />
            </div>
          </div>
        </div>

        {/* NAVIGATION BOTTOM TRIGGER */}
        <div className="pt-4 pb-2 w-full">
          <button
            onClick={onNext}
            className="w-full bg-[#1b3bb6] hover:bg-[#254ce6] text-white py-4.5 px-6 rounded-2xl flex items-center justify-center gap-2.5 font-bold text-[13.5px] tracking-wider transition-all shadow-lg hover:shadow-[#1b3bb6]/25 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>Continue to Typography</span>
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>

      </div>

      {/* ULTRA GLASS AI COMPILER PROMPT MODAL */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 select-none">
          <div className={`max-w-lg w-full rounded-2xl p-6 md:p-8 relative shadow-2xl space-y-5 animate-scaleUp border ${
            isDark 
              ? "bg-[#0b0f19] border-indigo-500/20 text-slate-100" 
              : "bg-white border-slate-200 text-slate-800"
          }`}>
            
            {/* Close */}
            <button 
              onClick={() => setIsAiModalOpen(false)}
              className={`absolute top-4 right-4 p-1 rounded-lg border transition-colors cursor-pointer ${
                isDark 
                  ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800" 
                  : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/25">
                <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
              </div>
              <div>
                <h3 className={`text-medium font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                  Auto-fill with AI Assistant
                </h3>
                <p className={`text-[10.5px] ${isDark ? "text-indigo-200/60" : "text-indigo-600/60"}`}>
                  Powered by Gemini 3.5 GenAI Engine
                </p>
              </div>
            </div>

            <p className={`text-xs leading-relaxed font-sans ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Paste your raw assignment text, syllabus briefing, lecturer details, or student names below. Our model will intelligently isolate and structure them into correct cover fields.
            </p>

            <div className="space-y-4">
              <textarea
                rows={5}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. Create a Physics Lab report on 'Thermal Expansion' for course code PHY-1102. Dr. Tariqul Islam is the Professor. My name is Anirudha Dey with roll id 251009..."
                className={`w-full text-xs rounded-xl px-3.5 py-3 outline-none leading-relaxed border ${
                  isDark
                    ? "bg-[#050810] border-[#1a233d] focus:border-indigo-500 text-slate-200 placeholder-slate-700"
                    : "bg-slate-50 border border-slate-200 focus:border-indigo-500 text-slate-800 placeholder-slate-400"
                }`}
              />

              {aiError && (
                <div className="p-3.5 rounded-xl border border-red-500/10 bg-red-500/5 text-red-400 text-xs font-semibold leading-relaxed">
                  ⚠️ {aiError}
                </div>
              )}

              {aiSuccessMessage && (
                <div className="p-3.5 rounded-xl border border-emerald-500/10 bg-emerald-500/5 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{aiSuccessMessage}</span>
                </div>
              )}

              <div className="flex items-center space-x-2 pt-2.5">
                <button
                  type="button"
                  onClick={() => setIsAiModalOpen(false)}
                  className={`w-1/3 py-3 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isDark
                      ? "border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-white"
                      : "border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAiAutoFill}
                  disabled={isAiLoading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-950 text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-indigo-600/15"
                >
                  {isAiLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Parsing Details...</span>
                    </>
                  ) : (
                    <>
                      <Activity className="w-3.5 h-3.5 text-indigo-200" />
                      <span>Extract & Populate</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
