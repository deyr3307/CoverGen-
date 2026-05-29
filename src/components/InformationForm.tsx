import React from 'react';
import { CoverPageData } from '../types';
import { BookOpen, GraduationCap, FileText, Sliders, Calendar, Sparkles, ArrowRight } from 'lucide-react';

interface InformationFormProps {
  coverData: CoverPageData;
  setCoverData: React.Dispatch<React.SetStateAction<CoverPageData>>;
  applyPresetDataset: (type: 'physics' | 'env' | 'cse') => void;
  theme?: 'dark' | 'light';
  onNext?: () => void;
}

export function InformationForm({ coverData, setCoverData, applyPresetDataset, theme = 'dark', onNext }: InformationFormProps) {
  const isDark = theme === "dark";

  // Dynamic values
  const cardClass = isDark
    ? "bg-[#0b0f19]/90 border border-[#161e33] text-slate-100 shadow-xl"
    : "bg-white border border-slate-200 text-slate-800 shadow-sm";
  const labelClass = isDark
    ? "text-slate-400"
    : "text-slate-500 font-semibold";
  const inputClass = isDark
    ? "bg-[#070b13] border border-[#1a233d] focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 text-slate-200 placeholder-slate-700"
    : "bg-slate-50 border border-slate-200 focus:border-indigo-500 text-slate-800 placeholder-slate-400";

  return (
    <div className={`flex flex-col h-full overflow-hidden relative transition-colors duration-300 ${
      isDark 
        ? 'bg-[#060813] bg-[linear-gradient(to_right,#111625_1px,transparent_1px),linear-gradient(to_bottom,#111625_1px,transparent_1px)] bg-[size:3rem_3rem]' 
        : 'bg-[#fafafc] bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem]'
    }`}>
      
      {/* Glow Orbs Backdrop decoration */}
      <div className={`absolute top-10 left-4 w-32 h-32 rounded-full blur-2xl pointer-events-none transition-all ${
        isDark ? "bg-indigo-500/5" : "bg-indigo-300/[0.04]"
      }`} />
      <div className={`absolute bottom-10 right-4 w-32 h-32 rounded-full blur-2xl pointer-events-none transition-all ${
        isDark ? "bg-purple-500/5" : "bg-purple-300/[0.02]"
      }`} />

      {/* Styled Top Bar Header */}
      <div className={`shrink-0 p-5 border-b backdrop-blur-md flex items-center justify-between relative z-10 transition-colors duration-300 ${
        isDark ? 'border-[#161e33] bg-[#0a0d1a]/80 text-white' : 'border-slate-200 bg-white/80 text-slate-800'
      }`}>
        <div>
          <h2 className={`text-sm font-extrabold tracking-widest uppercase flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            1. Cover Page Details
          </h2>
          <p className={`text-[10px] mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-505'}`}>Verify & update all fields. Watch real-time A4 updates.</p>
        </div>
        
        {/* Preset dropdown */}
        <div className="dropdown relative group">
          <button className={`px-2.5 py-1.5 rounded-lg text-[9px] font-mono font-bold flex items-center cursor-pointer transition-colors ${
            isDark 
              ? 'bg-[#121932] hover:bg-[#192244] text-indigo-400 border border-[#2b3975] hover:text-white' 
              : 'bg-white hover:bg-slate-50 text-indigo-600 border border-slate-250 shadow-sm'
          }`}>
            <Sliders className="w-3 h-3 mr-1" />
            Presets
          </button>
          <div className={`absolute right-0 top-full mt-2 w-48 rounded-xl shadow-2xl py-1 opacity-0 pointer-events-none group-focus-within:opacity-100 group-focus-within:pointer-events-auto group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-20 ${
            isDark ? 'bg-[#090b11] border border-[#161e33]' : 'bg-white border border-slate-200'
          }`}>
            <button 
              onClick={() => applyPresetDataset('env')} 
              className={`w-full text-left px-3 py-2 text-xs border-b block transition-all font-sans ${
                isDark ? 'hover:bg-[#121623] text-slate-200 hover:text-white border-slate-900/60' : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-100'
              }`}
            >
              🌲 Environmental Eco
            </button>
            <button 
              onClick={() => applyPresetDataset('physics')} 
              className={`w-full text-left px-3 py-2 text-xs border-b block transition-all font-sans ${
                isDark ? 'hover:bg-[#121623] text-slate-200 hover:text-white border-slate-900/60' : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-100'
              }`}
            >
              ⚛️ Physics Lab Report
            </button>
            <button 
              onClick={() => applyPresetDataset('cse')} 
              className={`w-full text-left px-3 py-2 text-xs block transition-all font-sans ${
                isDark ? 'hover:bg-[#121623] text-slate-200 hover:text-white border-none' : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-none'
              }`}
            >
              💻 Neural Nets Project
            </button>
          </div>
        </div>
      </div>

      {/* Unified Scrollable Single Pane Form with complete details */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 relative z-10">
        
        {/* SECTION 1: DOCUMENT METADATA */}
        <div className={`p-5 rounded-2xl space-y-4 ${cardClass}`}>
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)] animate-pulse" />
            <span className="text-[10px] font-mono font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
              Assignment Type & Topic
            </span>
          </div>

          <div className="space-y-2">
            <label className={`block text-[10px] font-mono font-extrabold uppercase tracking-wider ${labelClass}`}>
              Document Prefix Header (e.g. AN ASSIGNMENT ON, LAB JOURNAL)
            </label>
            <input 
              type="text"
              value={coverData.documentType}
              onChange={(e) => setCoverData(prev => ({ ...prev, documentType: e.target.value }))}
              placeholder="e.g. AN ASSIGNMENT ON"
              className={`w-full text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all font-mono border ${inputClass}`}
            />
            {/* Suggestion Chips */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {[
                "AN ASSIGNMENT ON",
                "LAB REPORT ON",
                "A PROJECT REPORT ON",
                "TERM PAPER ON",
                "THESIS ON",
                "CASE STUDY REPORT ON",
                "INTERNSHIP REPORT ON"
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setCoverData(prev => ({ ...prev, documentType: suggestion }))}
                  className={`text-[9px] px-2 py-0.5 rounded-lg border transition-all cursor-pointer font-medium ${
                    coverData.documentType === suggestion
                      ? 'bg-indigo-600/15 text-indigo-400 border-indigo-500/45 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30'
                      : isDark
                        ? 'bg-[#121932]/40 border-[#1a233d] text-slate-400 hover:text-slate-200 hover:bg-[#121932]'
                        : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={`block text-[10px] font-mono font-extrabold uppercase tracking-wider ${labelClass}`}>
                Cover Page Topic Title
              </label>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-mono bg-blue-500/10 text-blue-400 font-extrabold uppercase border border-blue-500/20 select-none">
                ✍️ Spellcheck Active
              </span>
            </div>
            <textarea 
              value={coverData.topicTitle}
              onChange={(e) => setCoverData(prev => ({ ...prev, topicTitle: e.target.value }))}
              placeholder="ENTER ASSIGNMENT TOPIC OR RESEARCH FILE..."
              rows={4}
              spellCheck={true}
              className={`w-full border text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all resize-none leading-relaxed font-mono ${inputClass}`}
            />
          </div>

          <div>
            <label className={`block text-[10px] font-mono font-extrabold uppercase tracking-wider mb-2 ${labelClass}`}>
              Assignment / Reference No. (Optional)
            </label>
            <input 
              type="text"
              value={coverData.assignmentNoText || ''}
              onChange={(e) => setCoverData(prev => ({ ...prev, assignmentNoText: e.target.value }))}
              placeholder="e.g., Assignment No: 2 or Lab No: 01"
              className={`w-full border text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all font-mono ${inputClass}`}
            />
          </div>
        </div>

        {/* SECTION 2: COURSE DETAILS */}
        <div className={`p-5 rounded-2xl space-y-4 ${cardClass}`}>
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" />
            <span className="text-[10px] font-mono font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
              Course Details & Deadline
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className={`block text-[10px] font-mono font-extrabold mb-1.5 uppercase ${labelClass}`}>No. Label</label>
              <input 
                type="text" 
                value={coverData.courseNoHeading || 'Course No:'}
                onChange={(e) => setCoverData(prev => ({ ...prev, courseNoHeading: e.target.value }))}
                placeholder="Course No:"
                spellCheck="true"
                className={`w-full border text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all font-cursive font-bold ${inputClass}`}
              />
            </div>
            <div>
              <label className={`block text-[10px] font-mono font-extrabold mb-1.5 uppercase ${labelClass}`}>Course code</label>
              <input 
                type="text" 
                value={coverData.courseNo}
                onChange={(e) => setCoverData(prev => ({ ...prev, courseNo: e.target.value }))}
                placeholder="ES-1205"
                spellCheck="true"
                className={`w-full border text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all font-mono ${inputClass}`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-[10px] font-mono font-extrabold mb-1.5 uppercase ${labelClass}`}>Title Label</label>
            <input 
              type="text" 
              value={coverData.courseNameHeading || 'Course Title:'}
              onChange={(e) => setCoverData(prev => ({ ...prev, courseNameHeading: e.target.value }))}
              placeholder="Course Title:"
              spellCheck="true"
              className={`w-full border text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all font-cursive font-bold ${inputClass}`}
            />
          </div>

          <div>
            <label className={`block text-[10px] font-mono font-extrabold mb-1.5 uppercase ${labelClass}`}>Course Name Title</label>
            <input 
              type="text" 
              value={coverData.courseName}
              onChange={(e) => setCoverData(prev => ({ ...prev, courseName: e.target.value }))}
              placeholder="Environmental Chemistry Analysis"
              spellCheck="true"
              className={`w-full border text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all font-sans ${inputClass}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className={`block text-[10px] font-mono font-extrabold mb-1.5 uppercase ${labelClass}`}>Date Label</label>
              <input 
                type="text" 
                value={coverData.submissionDateHeading || 'DATE OF SUBMISSION:'}
                onChange={(e) => setCoverData(prev => ({ ...prev, submissionDateHeading: e.target.value }))}
                placeholder="DATE OF SUBMISSION:"
                className={`w-full border text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all font-cursive font-bold ${inputClass}`}
              />
            </div>
            <div>
              <label className={`block text-[10px] font-mono font-extrabold mb-1.5 uppercase ${labelClass}`}>Submission Date</label>
              <input 
                type="date" 
                value={coverData.submissionDate}
                onChange={(e) => setCoverData(prev => ({ ...prev, submissionDate: e.target.value }))}
                className={`w-full border text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all font-mono ${inputClass}`}
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: TEACHER / EVALUATOR DETAILS */}
        <div className={`p-5 rounded-2xl space-y-4 ${cardClass}`}>
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2.5 h-2.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-pulse" />
            <span className="text-[10px] font-mono font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
              Teacher / Supervisor details
            </span>
          </div>

          <div>
            <label className={`block text-[10px] font-mono font-extrabold uppercase tracking-widest mb-1.5 ${labelClass}`}>Evaluator Section Header</label>
            <input 
              type="text" 
              value={coverData.teacherHeading || 'SUBMITTED TO,'}
              onChange={(e) => setCoverData(prev => ({ ...prev, teacherHeading: e.target.value }))}
              placeholder="SUBMITTED TO,"
              className={`w-full border text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all font-cursive font-bold ${inputClass}`}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={`block text-[10px] font-mono font-extrabold uppercase tracking-widest ${labelClass}`}>Instructor Details (Multiline)</label>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-mono bg-amber-500/10 text-amber-400 font-extrabold uppercase border border-amber-500/20 select-none">
                ✍️ Spellcheck Active
              </span>
            </div>
            <textarea 
              rows={4}
              value={coverData.teacherDetails !== undefined ? coverData.teacherDetails : [
                coverData.teacherName,
                coverData.teacherDesignation,
                coverData.teacherDiscipline,
                coverData.teacherUniversity,
                coverData.teacherLocation
              ].filter(Boolean).join("\n")}
              onChange={(e) => setCoverData(prev => ({ ...prev, teacherDetails: e.target.value }))}
              placeholder="Dr. Quazi Jahangir Hossain&#10;Professor&#15;Environmental Science Discipline"
              spellCheck={true}
              className={`w-full border text-xs rounded-xl px-3.5 py-2 outline-none transition-all resize-none leading-relaxed font-sans ${inputClass}`}
            />
          </div>

          <div className={`text-[9px] font-medium leading-normal pt-1 border-t border-dashed ${
            isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'
          }`}>
            * Note: You can also specify individual baseline teacher fields below if desired:
          </div>

          <div>
            <label className={`block text-[10px] font-mono font-extrabold mb-1.5 ${labelClass}`}>Teacher Full Name</label>
            <input 
              type="text" 
              value={coverData.teacherName}
              onChange={(e) => setCoverData(prev => ({ ...prev, teacherName: e.target.value }))}
              placeholder="Dr. S. M. Tariqul Islam"
              className={`w-full border text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all font-sans ${inputClass}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className={`block text-[10px] font-mono font-extrabold mb-1.5 ${labelClass}`}>Designation</label>
              <input 
                type="text" 
                value={coverData.teacherDesignation}
                onChange={(e) => setCoverData(prev => ({ ...prev, teacherDesignation: e.target.value }))}
                placeholder="Professor"
                className={`w-full border text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all font-sans ${inputClass}`}
              />
            </div>
            <div>
              <label className={`block text-[10px] font-mono font-extrabold mb-1.5 ${labelClass}`}>Discipline / Dept.</label>
              <input 
                type="text" 
                value={coverData.teacherDiscipline}
                onChange={(e) => setCoverData(prev => ({ ...prev, teacherDiscipline: e.target.value }))}
                placeholder="Environmental Science"
                className={`w-full border text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all font-sans ${inputClass}`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-[10px] font-mono font-extrabold mb-1.5 ${labelClass}`}>University / Institution</label>
            <input 
              type="text" 
              value={coverData.teacherUniversity}
              onChange={(e) => setCoverData(prev => ({ ...prev, teacherUniversity: e.target.value }))}
              placeholder="Khulna University"
              className={`w-full border text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all font-sans ${inputClass}`}
            />
          </div>

          <div>
            <label className={`block text-[10px] font-mono font-extrabold mb-1.5 uppercase ${labelClass}`}>Location Info</label>
            <input 
              type="text" 
              value={coverData.teacherLocation}
              onChange={(e) => setCoverData(prev => ({ ...prev, teacherLocation: e.target.value }))}
              placeholder="Khulna-9208, Bangladesh"
              className={`w-full border text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all font-sans ${inputClass}`}
            />
          </div>

          {/* Joint Evaluator Trigger Code */}
          <div className={`pt-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <label className="flex items-center space-x-2.5 cursor-pointer group select-none">
              <input 
                type="checkbox" 
                checked={coverData.teacher2Name !== undefined}
                onChange={(e) => {
                  if (e.target.checked) {
                    setCoverData(prev => ({
                      ...prev,
                      teacher2Name: 'Sadia Islam Mou',
                      teacher2Designation: 'Assistant Professor',
                      teacher2Discipline: 'Environmental Science Discipline',
                      teacher2University: 'Khulna University',
                      teacher2Location: 'Khulna'
                    }));
                  } else {
                    setCoverData(prev => {
                      const copy = { ...prev };
                      delete copy.teacher2Name;
                      delete copy.teacher2Designation;
                      delete copy.teacher2Discipline;
                      delete copy.teacher2University;
                      delete copy.teacher2Location;
                      return copy;
                    });
                  }
                }}
                className={`w-4 h-4 rounded focus:outline-none focus:ring-0 transition-all cursor-pointer ${
                  isDark ? 'border-slate-800 bg-[#070b13] text-indigo-505' : 'border-slate-300 bg-white text-indigo-600'
                }`}
              />
              <span className={`text-[10px] font-mono font-extrabold uppercase tracking-wider transition-all select-none ${
                isDark ? 'text-slate-300 group-hover:text-indigo-400' : 'text-slate-600 group-hover:text-indigo-600'
              }`}>Add Joint Evaluator / Second Teacher</span>
            </label>
          </div>

          {coverData.teacher2Name !== undefined && (
            <div className={`space-y-4 pt-3 border-t border-dashed animate-fadeIn ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <div>
                <label className={`block text-[10px] font-mono font-extrabold mb-1.5 uppercase ${labelClass}`}>Second Teacher Name</label>
                <input 
                  type="text" 
                  value={coverData.teacher2Name}
                  onChange={(e) => setCoverData(prev => ({ ...prev, teacher2Name: e.target.value }))}
                  placeholder="Sadia Islam Mou"
                  className={`w-full border text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all font-sans ${inputClass}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className={`block text-[10px] font-mono font-extrabold mb-1.5 uppercase ${labelClass}`}>Teacher 2 Designation</label>
                  <input 
                    type="text" 
                    value={coverData.teacher2Designation || ''}
                    onChange={(e) => setCoverData(prev => ({ ...prev, teacher2Designation: e.target.value }))}
                    placeholder="Assistant Professor"
                    className={`w-full border text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all font-sans ${inputClass}`}
                  />
                </div>
                <div>
                  <label className={`block text-[10px] font-mono font-extrabold mb-1.5 uppercase ${labelClass}`}>Teacher 2 Dept.</label>
                  <input 
                    type="text" 
                    value={coverData.teacher2Discipline || ''}
                    onChange={(e) => setCoverData(prev => ({ ...prev, teacher2Discipline: e.target.value }))}
                    placeholder="Environmental Science"
                    className={`w-full border text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all font-sans ${inputClass}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-[10px] font-mono font-extrabold mb-1.5 uppercase ${labelClass}`}>Teacher 2 University</label>
                <input 
                  type="text" 
                  value={coverData.teacher2University || ''}
                  onChange={(e) => setCoverData(prev => ({ ...prev, teacher2University: e.target.value }))}
                  placeholder="Khulna University"
                  className={`w-full border text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all font-sans ${inputClass}`}
                />
              </div>
            </div>
          )}
        </div>

        {/* SECTION 4: STUDENT DETAILS */}
        <div className={`p-5 rounded-2xl space-y-4 ${cardClass}`}>
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2.5 h-2.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.6)] animate-pulse" />
            <span className="text-[10px] font-mono font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
              Student Details
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={`block text-[10px] font-mono font-extrabold uppercase tracking-widest ${labelClass}`}>Student Details (Multiline)</label>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-mono bg-purple-500/10 text-purple-400 font-extrabold uppercase border border-purple-500/20 select-none">
                ✍️ Spellcheck Active
              </span>
            </div>
            <textarea 
              rows={4}
              value={coverData.studentDetails !== undefined ? coverData.studentDetails : [
                coverData.studentName,
                coverData.studentId ? `STUDENT ID: ${coverData.studentId}` : '',
                coverData.studentYearTerm,
                coverData.studentDiscipline,
                coverData.studentUniversity,
                coverData.studentLocation
              ].filter(Boolean).join("\n")}
              onChange={(e) => setCoverData(prev => ({ ...prev, studentDetails: e.target.value }))}
              placeholder="Anirudha Dey&#10;STUDENT ID: 251009&#10;1st Year..."
              spellCheck={true}
              className={`w-full border text-xs rounded-xl px-3.5 py-2 outline-none transition-all resize-none leading-relaxed font-sans ${inputClass}`}
            />
          </div>

          <div className={`text-[9px] font-medium leading-normal pt-1 border-t border-dashed ${
            isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'
          }`}>
            * Note: You can also specify individual student fields below for fallback support:
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className={`block text-[10px] font-mono font-extrabold ${labelClass}`}>Submission tag / Header</label>
              <input 
                type="text"
                value={coverData.submittedByLabel}
                onChange={(e) => setCoverData(prev => ({ ...prev, submittedByLabel: e.target.value }))}
                placeholder="e.g. SUBMITTED BY"
                className={`w-full border text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all font-mono ${inputClass}`}
              />
              {/* Suggestion Chips */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  "SUBMITTED BY,",
                  "PREPARED BY,",
                  "PRESENTED BY,",
                  "COMPILED BY,",
                  "BY THE STUDENT:"
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setCoverData(prev => ({ ...prev, submittedByLabel: suggestion }))}
                    className={`text-[8px] px-2 py-0.5 rounded border transition-all cursor-pointer font-medium ${
                      coverData.submittedByLabel === suggestion
                        ? 'bg-indigo-600/15 text-indigo-400 border-indigo-500/45 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30'
                        : isDark
                          ? 'bg-[#121932]/40 border-[#1a233d] text-slate-400 hover:text-slate-205'
                          : 'bg-slate-100 border-slate-200 text-slate-650 hover:bg-slate-200'
                    }`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={`block text-[10px] font-mono font-extrabold mb-1.5 ${labelClass}`}>Student ID</label>
              <input 
                type="text" 
                value={coverData.studentId}
                onChange={(e) => setCoverData(prev => ({ ...prev, studentId: e.target.value }))}
                placeholder="251009"
                className={`w-full border text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all font-mono ${inputClass}`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-[10px] font-mono font-extrabold mb-1.5 ${labelClass}`}>Student Name</label>
            <input 
              type="text" 
              value={coverData.studentName}
              onChange={(e) => setCoverData(prev => ({ ...prev, studentName: e.target.value }))}
              placeholder="Anirudha Dey"
              className={`w-full border text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all font-sans ${inputClass}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className={`block text-[10px] font-mono font-extrabold mb-1.5 uppercase ${labelClass}`}>Year & Term</label>
              <input 
                type="text" 
                value={coverData.studentYearTerm}
                onChange={(e) => setCoverData(prev => ({ ...prev, studentYearTerm: e.target.value }))}
                placeholder="1st Year, 2nd Term"
                className={`w-full border text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all font-sans ${inputClass}`}
              />
            </div>
            <div>
              <label className={`block text-[10px] font-mono font-extrabold mb-1.5 uppercase ${labelClass}`}>Dept. / Discipline</label>
              <input 
                type="text" 
                value={coverData.studentDiscipline}
                onChange={(e) => setCoverData(prev => ({ ...prev, studentDiscipline: e.target.value }))}
                placeholder="Environmental Science"
                className={`w-full border text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all font-sans ${inputClass}`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-[10px] font-mono font-extrabold mb-1.5 ${labelClass}`}>Institution / University</label>
            <input 
              type="text" 
              value={coverData.studentUniversity}
              onChange={(e) => setCoverData(prev => ({ ...prev, studentUniversity: e.target.value }))}
              placeholder="Khulna University"
              className={`w-full border text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all font-sans ${inputClass}`}
            />
          </div>

          <div>
            <label className={`block text-[10px] font-mono font-extrabold mb-1.5 uppercase ${labelClass}`}>Location Info</label>
            <input 
              type="text" 
              value={coverData.studentLocation}
              onChange={(e) => setCoverData(prev => ({ ...prev, studentLocation: e.target.value }))}
              placeholder="Khulna"
              className={`w-full border text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all font-sans ${inputClass}`}
            />
          </div>
        </div>

        {/* Next Step CTA Action Button at bottom of the inputs section */}
        {onNext && (
          <div className="pt-2 pb-6">
            <button
              onClick={onNext}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-xs font-bold font-sans tracking-wider hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer border border-indigo-400/20"
            >
              <span>Next: Customize Template Theme</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
