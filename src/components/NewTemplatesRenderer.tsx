import React from 'react';
import { CoverPageData, CoverPageDesign } from '../types';
import { LOGO_PRESETS } from '../presets';
import { DraggableBlock } from './CoverDocument';

interface NewTemplatesRendererProps {
  id: string;
  data: CoverPageData;
  design: CoverPageDesign;
  zoom: number;
  onChangeDesign?: (design: CoverPageDesign) => void;
  formatDate: (dateStr: string) => string;
  fontFamily?: string;
  fontColor?: string;
  baseFontSize?: number;
}

export const NewTemplateLogo: React.FC<{ logoUrl: string; logoHeight: number; primaryColor?: string }> = ({ logoUrl, logoHeight, primaryColor }) => {
  const logoPreset = LOGO_PRESETS.find(p => p.id === logoUrl);
  if (!logoPreset) {
    return (
      <img 
        src={logoUrl} 
        style={{ width: `${logoHeight}px`, height: 'auto' }} 
        className="object-contain max-w-[240px]" 
        alt="University Logo" 
        referrerPolicy="no-referrer" 
      />
    );
  }
  return (
    <div 
      style={{ 
        height: `${logoHeight}px`, 
        width: `${logoHeight}px`,
        color: primaryColor || '#1e3a8a'
      }} 
      className="flex items-center justify-center"
    >
      <svg 
        className="w-full h-full fill-current" 
        viewBox={logoPreset.viewBox} 
        dangerouslySetInnerHTML={{ __html: logoPreset.svgPath }} 
      />
    </div>
  );
};

export const NewTemplatesRenderer: React.FC<NewTemplatesRendererProps> = ({
  id,
  data,
  design,
  zoom,
  onChangeDesign,
  formatDate,
  fontFamily,
  fontColor,
  baseFontSize
}) => {
  const accentColor = design.accentColor || '#1e3a8a';
  const logoHeight = design.logoHeight || 80;

  if (id === 'ku-law-table') {
    return (
      <div className="flex flex-col flex-1 justify-between items-center w-full relative z-10 py-4">
        {/* Top Logo and University Header */}
        <div className="flex flex-col items-center justify-center text-center mt-4 w-full">
          {design.logoUrl && (
            <div className="mb-4">
              <NewTemplateLogo 
                logoUrl={design.logoUrl} 
                logoHeight={logoHeight}
                primaryColor={accentColor}
              />
            </div>
          )}
          <DraggableBlock elementId="universityHeader" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
            <div className="flex flex-col items-center">
              <span 
                className="pb-1 px-4 text-center block"
                style={{
                  fontFamily: design.fontUniversity?.fontFamily || design.fontTitle?.fontFamily || fontFamily || 'Georgia, serif',
                  fontSize: `${(design.fontUniversity?.fontSize || design.fontTitle?.fontSize || 22) / 14}em`,
                  color: design.fontUniversity?.color || design.fontTitle?.color || fontColor || '#1e3a8a',
                  fontWeight: design.fontUniversity?.bold !== undefined ? (design.fontUniversity.bold ? 'bold' : 'normal') : (design.fontTitle?.bold !== false ? 'bold' : 'normal'),
                  fontStyle: design.fontUniversity?.italic ? 'italic' : (design.fontTitle?.italic ? 'italic' : 'normal'),
                  textTransform: (design.fontUniversity?.uppercase !== undefined ? design.fontUniversity.uppercase : (design.fontTitle?.uppercase !== undefined ? design.fontTitle.uppercase : true)) ? 'uppercase' : 'none',
                  borderBottom: `2px solid ${design.fontUniversity?.color || design.fontTitle?.color || '#f59e0b'}`
                }}
              >
                {data.universityName || data.teacherUniversity || 'KHULNA UNIVERSITY'}
              </span>
              {data.departmentName && (
                <span 
                  className="mt-2 tracking-wide font-medium italic block text-center opacity-80"
                  style={{
                    fontFamily: design.fontSubSection?.fontFamily || fontFamily || 'Georgia, serif',
                    fontSize: `${(design.fontSubSection?.fontSize || 11) / 14}em`,
                    color: design.fontSubSection?.color || fontColor || undefined
                  }}
                >
                  {data.departmentName}
                </span>
              )}
            </div>
          </DraggableBlock>
        </div>

        {/* Course Title and Code in strong serif typography */}
        <div className="flex flex-col items-center my-6 w-full px-8">
          <DraggableBlock elementId="courseCode" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
            <div 
              className="font-bold uppercase tracking-wider mb-2 text-center"
              style={{
                fontFamily: design.fontCourseNoHeading?.fontFamily || fontFamily || 'Georgia, serif',
                fontSize: `${(design.fontCourseNoHeading?.fontSize || 13) / 14}em`,
                color: design.fontCourseNoHeading?.color || fontColor || '#1e3a8a'
              }}
            >
              Course Code: <span style={{ color: design.fontCourseNoContent?.color || fontColor || undefined }}>{data.courseNo}</span>
            </div>
          </DraggableBlock>
          
          <DraggableBlock elementId="courseTitle" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
            <div 
              className="font-bold tracking-wide text-center"
              style={{
                fontFamily: design.fontCourseTitleHeading?.fontFamily || fontFamily || 'Georgia, serif',
                fontSize: `${(design.fontCourseTitleHeading?.fontSize || 15) / 14}em`,
                color: design.fontCourseTitleHeading?.color || fontColor || '#1e3a8a'
              }}
            >
              Course Title: <span style={{ color: design.fontCourseTitleContent?.color || fontColor || undefined, fontWeight: 'bold' }}>{data.courseName}</span>
            </div>
          </DraggableBlock>
        </div>

        {/* An Argumentative Essay on [Topic Title] inside double quotes */}
        <div className="flex flex-col items-center justify-center my-4 w-full px-10">
          <DraggableBlock elementId="documentType" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 text-center">
            <div 
              className="italic mb-2 text-center opacity-70"
              style={{
                fontFamily: design.fontAssignmentTopic?.fontFamily || fontFamily || 'Georgia, serif',
                fontSize: `${(design.fontAssignmentTopic?.fontSize || 12) / 14}em`,
                color: design.fontAssignmentTopic?.color || fontColor || '#2563eb'
              }}
            >
              {data.documentType || 'An Argumentative Essay on'}
            </div>
          </DraggableBlock>

          <DraggableBlock elementId="topicTitle" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 text-center">
            <h1 
              className="text-center px-6 leading-relaxed select-none py-2 font-semibold block"
              style={{
                fontFamily: design.fontTopicTitle?.fontFamily || fontFamily || 'Georgia, serif',
                color: design.fontTopicTitle?.color || fontColor || undefined,
                fontSize: `${(design.fontTopicTitle?.fontSize || 18) / 14}em`,
                lineHeight: '1.4'
              }}
            >
              "{data.topicName || 'Is Kelsen\'s model of Law more efficient than Austin\'s?'}"
            </h1>
          </DraggableBlock>
        </div>

        {/* The signature split tables block with a solid header bar */}
        <div className="w-full px-10 my-6">
          <DraggableBlock elementId="submissionsBlock" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
            <div className="grid grid-cols-2 gap-8 w-full text-left">
              {/* Left Column: Submitted To */}
              <div className="border border-slate-300 rounded-lg overflow-hidden bg-slate-50/20 shadow-sm flex flex-col text-left">
                <div 
                  className="px-4 py-2.5 font-bold uppercase tracking-wider text-white"
                  style={{ 
                    backgroundColor: accentColor,
                    fontFamily: design.fontSubmittedToHeading?.fontFamily || fontFamily || 'Georgia, serif',
                    fontSize: `${(design.fontSubmittedToHeading?.fontSize || 12) / 14}em`
                  }}
                >
                  {data.submittedToLabel || 'SUBMITTED TO'}
                </div>
                <div 
                  className="p-4 space-y-2 leading-relaxed text-left"
                  style={{
                    fontFamily: design.fontSubmittedToContent?.fontFamily || fontFamily || 'Georgia, serif',
                    fontSize: `${(design.fontSubmittedToContent?.fontSize || 11.5) / 14}em`,
                    color: design.fontSubmittedToContent?.color || fontColor || undefined
                  }}
                >
                  <div className="font-bold text-left">{data.teacherName}</div>
                  <div className="text-left text-[0.9em] opacity-80">{data.teacherDesignation}</div>
                  <div className="text-left text-[0.9em] opacity-80">{data.teacherDepartment || data.departmentName}</div>
                  <div className="font-semibold text-left text-[0.85em] opacity-80">{data.universityName || 'Khulna University'}</div>
                </div>
              </div>

              {/* Right Column: Submitted By */}
              <div className="border border-slate-300 rounded-lg overflow-hidden bg-slate-50/20 shadow-sm flex flex-col text-left">
                <div 
                  className="px-4 py-2.5 font-bold uppercase tracking-wider text-white"
                  style={{ 
                    backgroundColor: accentColor,
                    fontFamily: design.fontSubmittedByHeading?.fontFamily || fontFamily || 'Georgia, serif',
                    fontSize: `${(design.fontSubmittedByHeading?.fontSize || 12) / 14}em`
                  }}
                >
                  {data.submittedByLabel || 'SUBMITTED BY'}
                </div>
                <div 
                  className="p-4 space-y-2 leading-relaxed text-left"
                  style={{
                    fontFamily: design.fontSubmittedByContent?.fontFamily || fontFamily || 'Georgia, serif',
                    fontSize: `${(design.fontSubmittedByContent?.fontSize || 11.5) / 14}em`,
                    color: design.fontSubmittedByContent?.color || fontColor || undefined
                  }}
                >
                  <div className="font-bold text-left">{data.studentName}</div>
                  <div className="text-left text-[0.9em] opacity-80">ID: {data.studentId}</div>
                  {data.studentRoll && <div className="text-left text-[0.9em] opacity-80">Roll: {data.studentRoll}</div>}
                  {data.studentRegNo && <div className="text-left text-[0.9em] opacity-80">Reg: {data.studentRegNo}</div>}
                  <div className="font-semibold text-left text-[0.85em] opacity-80">{data.studentDepartment || data.departmentName}</div>
                </div>
              </div>
            </div>
          </DraggableBlock>
        </div>

        {/* Submit Date */}
        <div className="mt-4 mb-4 text-center">
          <DraggableBlock elementId="submissionDate" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 text-center">
            <div 
              className="font-bold tracking-wider text-center"
              style={{
                fontFamily: design.fontSubmissionDateHeading?.fontFamily || fontFamily || 'Georgia, serif',
                fontSize: `${(design.fontSubmissionDateHeading?.fontSize || 12) / 14}em`,
                color: design.fontSubmissionDateHeading?.color || fontColor || '#1e3a8a'
              }}
            >
              Date of Submission: <span style={{ color: design.fontSubmissionDateContent?.color || fontColor || undefined, fontWeight: 'bold' }}>{formatDate(data.submissionDate)}</span>
            </div>
          </DraggableBlock>
        </div>
      </div>
    );
  }

  if (id === 'cu-boxed-code') {
    return (
      <div className="flex flex-col flex-1 justify-between items-center w-full relative z-10 py-6">
        {/* Logo and Institution Title */}
        <div className="flex flex-col items-center justify-center text-center mt-4 w-full">
          {design.logoUrl && (
            <div className="mb-4">
              <NewTemplateLogo 
                logoUrl={design.logoUrl} 
                logoHeight={logoHeight}
                primaryColor={accentColor}
              />
            </div>
          )}
          <DraggableBlock elementId="universityHeader" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
            <div className="flex flex-col items-center text-center">
              <span 
                className="text-center block"
                style={{
                  fontFamily: design.fontUniversity?.fontFamily || design.fontTitle?.fontFamily || fontFamily || '"Times New Roman", Times, serif',
                  fontSize: `${(design.fontUniversity?.fontSize || design.fontTitle?.fontSize || 24) / 14}em`,
                  color: design.fontUniversity?.color || design.fontTitle?.color || fontColor || '#1e3a8a',
                  fontWeight: design.fontUniversity?.bold !== undefined ? (design.fontUniversity.bold ? 'bold' : 'normal') : (design.fontTitle?.bold !== false ? 'bold' : 'normal'),
                  fontStyle: design.fontUniversity?.italic ? 'italic' : (design.fontTitle?.italic ? 'italic' : 'normal'),
                  textTransform: (design.fontUniversity?.uppercase !== undefined ? design.fontUniversity.uppercase : true) ? 'uppercase' : 'none'
                }}
              >
                {data.universityName || data.teacherUniversity || 'UNIVERSITY OF CHITTAGONG'}
              </span>
              {data.departmentName && (
                <span 
                  className="mt-1 tracking-wider uppercase font-semibold text-center block opacity-80"
                  style={{
                    fontFamily: design.fontSubSection?.fontFamily || fontFamily || '"Times New Roman", Times, serif',
                    fontSize: `${(design.fontSubSection?.fontSize || 11) / 14}em`,
                    color: design.fontSubSection?.color || fontColor || undefined
                  }}
                >
                  {data.departmentName}
                </span>
              )}
            </div>
          </DraggableBlock>
        </div>

        {/* Nested boxed code structures */}
        <div className="w-full px-12 my-5 flex flex-col items-center space-y-3.5">
          <DraggableBlock elementId="courseCode" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="w-4/5 z-10">
            <div className="border-[2px] border-black p-2.5 text-center font-bold tracking-wide uppercase bg-slate-50/50 shadow-sm rounded-md">
              <span 
                style={{
                  fontFamily: design.fontCourseNoHeading?.fontFamily || fontFamily || '"Times New Roman", Times, serif',
                  fontSize: `${(design.fontCourseNoHeading?.fontSize || 13) / 14}em`,
                  color: design.fontCourseNoHeading?.color || fontColor || '#1e3a8a'
                }}
              >
                Course Code : <span style={{ color: fontColor || undefined }}>{data.courseNo}</span>
              </span>
            </div>
          </DraggableBlock>

          <DraggableBlock elementId="courseTitle" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="w-4/5 z-10">
            <div className="border-[2px] border-black p-2.5 text-center font-bold tracking-wide uppercase bg-slate-50/50 shadow-sm rounded-md">
              <span 
                style={{
                  fontFamily: design.fontCourseTitleHeading?.fontFamily || fontFamily || '"Times New Roman", Times, serif',
                  fontSize: `${(design.fontCourseTitleHeading?.fontSize || 13) / 14}em`,
                  color: design.fontCourseTitleHeading?.color || fontColor || '#1e3a8a'
                }}
              >
                Course Name : <span style={{ color: fontColor || undefined }}>{data.courseName}</span>
              </span>
            </div>
          </DraggableBlock>
        </div>

        {/* Mid Section Assignment Topic Title */}
        <div className="flex flex-col items-center justify-center my-2 w-full px-12">
          <DraggableBlock elementId="documentType" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 text-center">
            <span 
              className="font-bold underline uppercase tracking-widest mb-2 text-center block"
              style={{
                fontFamily: design.fontAssignmentTopic?.fontFamily || fontFamily || '"Times New Roman", Times, serif',
                fontSize: `${(design.fontAssignmentTopic?.fontSize || 11) / 14}em`,
                color: design.fontAssignmentTopic?.color || fontColor || '#1e3a8a'
              }}
            >
              {data.documentType || 'ASSIGNMENT ON'}
            </span>
          </DraggableBlock>

          <DraggableBlock elementId="topicTitle" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 text-center">
            <p 
              className="text-center font-bold px-4 leading-relaxed block text-center"
              style={{
                fontFamily: design.fontTopicTitle?.fontFamily || fontFamily || '"Times New Roman", Times, serif',
                fontSize: `${(design.fontTopicTitle?.fontSize || 19) / 14}em`,
                color: design.fontTopicTitle?.color || fontColor || undefined,
                lineHeight: '1.4'
              }}
            >
              {data.topicName}
            </p>
          </DraggableBlock>
        </div>

        {/* Left and right tables aligned beautifully with colons as per CU guides */}
        <div className="w-full px-12 my-4">
          <DraggableBlock elementId="submissionsBlock" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
            <div className="grid grid-cols-2 gap-10 w-full text-left">
              {/* Submitted To column */}
              <div className="space-y-3 text-left">
                <h4 
                  className="font-bold uppercase tracking-wider underline pb-1 text-left"
                  style={{
                    fontFamily: design.fontSubmittedToHeading?.fontFamily || fontFamily || '"Times New Roman", Times, serif',
                    fontSize: `${(design.fontSubmittedToHeading?.fontSize || 12.5) / 14}em`,
                    color: design.fontSubmittedToHeading?.color || fontColor || '#1e3a8a'
                  }}
                >
                  {data.submittedToLabel || 'SUBMITTED TO:'}
                </h4>
                <table 
                  className="w-full text-left"
                  style={{
                    fontFamily: design.fontSubmittedToContent?.fontFamily || fontFamily || '"Times New Roman", Times, serif',
                    fontSize: `${(design.fontSubmittedToContent?.fontSize || 11.5) / 14}em`,
                    color: design.fontSubmittedToContent?.color || fontColor || undefined
                  }}
                >
                  <tbody>
                    <tr className="text-left">
                      <td className="font-semibold pr-2 py-1 w-1/3 text-left">Name</td>
                      <td className="py-1 w-[5%] px-1 text-left">:</td>
                      <td className="py-1 text-left">{data.teacherName}</td>
                    </tr>
                    <tr className="text-left">
                      <td className="font-semibold pr-2 py-1 text-left">Designation</td>
                      <td className="py-1 px-1 text-left">:</td>
                      <td className="py-1 text-left">{data.teacherDesignation}</td>
                    </tr>
                    <tr className="text-left">
                      <td className="font-semibold pr-2 py-1 text-left">Department</td>
                      <td className="py-1 px-1 text-left">:</td>
                      <td className="py-1 text-left">{data.teacherDepartment || data.departmentName}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Submitted By column */}
              <div className="space-y-3 text-left">
                <h4 
                  className="font-bold uppercase tracking-wider underline pb-1 text-left"
                  style={{
                    fontFamily: design.fontSubmittedByHeading?.fontFamily || fontFamily || '"Times New Roman", Times, serif',
                    fontSize: `${(design.fontSubmittedByHeading?.fontSize || 12.5) / 14}em`,
                    color: design.fontSubmittedByHeading?.color || fontColor || '#1e3a8a'
                  }}
                >
                  {data.submittedByLabel || 'SUBMITTED BY:'}
                </h4>
                <table 
                  className="w-full text-left"
                  style={{
                    fontFamily: design.fontSubmittedByContent?.fontFamily || fontFamily || '"Times New Roman", Times, serif',
                    fontSize: `${(design.fontSubmittedByContent?.fontSize || 11.5) / 14}em`,
                    color: design.fontSubmittedByContent?.color || fontColor || undefined
                  }}
                >
                  <tbody>
                    <tr className="text-left">
                      <td className="font-semibold pr-2 py-1 w-2/5 text-left">Name</td>
                      <td className="py-1 w-[5%] px-1 text-left">:</td>
                      <td className="py-1 text-left">{data.studentName}</td>
                    </tr>
                    <tr className="text-left">
                      <td className="font-semibold pr-2 py-1 text-left">Student ID</td>
                      <td className="py-1 px-1 text-left">:</td>
                      <td className="py-1 text-left">{data.studentId}</td>
                    </tr>
                    {data.studentRoll && (
                      <tr className="text-left">
                        <td className="font-semibold pr-2 py-1 text-left">Roll No</td>
                        <td className="py-1 px-1 text-left">:</td>
                        <td className="py-1 text-left">{data.studentRoll}</td>
                      </tr>
                    )}
                    <tr className="text-left">
                      <td className="font-semibold pr-2 py-1 text-left">Department</td>
                      <td className="py-1 px-1 text-left">:</td>
                      <td className="py-1 text-left">{data.studentDepartment || data.departmentName}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </DraggableBlock>
        </div>

        {/* Bottom fine line divider and date submission splits in tiny boxes */}
        <div className="w-full px-12 flex flex-col items-center mt-4">
          <div className="w-full h-[1px] bg-slate-200 my-3 opacity-60" />
          <DraggableBlock elementId="submissionDate" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
            <div className="flex items-center space-x-3 select-none text-left justify-center w-full">
              <span 
                className="font-bold uppercase tracking-wider"
                style={{
                  fontFamily: design.fontSubmissionDateHeading?.fontFamily || fontFamily || '"Times New Roman", Times, serif',
                  fontSize: `${(design.fontSubmissionDateHeading?.fontSize || 11) / 14}em`,
                  color: design.fontSubmissionDateHeading?.color || fontColor || '#475569'
                }}
              >
                Date of Submission :
              </span>
              
              <div className="flex items-center space-x-1.5 font-sans font-extrabold text-[12px]">
                {(() => {
                  const dateObj = new Date(data.submissionDate);
                  const day = String(dateObj.getDate() || 27).padStart(2, '0');
                  const month = String(dateObj.getMonth() + 1 || 5).padStart(2, '0');
                  const year = String(dateObj.getFullYear() || 2026);
                  return (
                    <>
                      <span className="border border-black px-2 py-0.5 rounded-[1px] bg-white text-black shadow-sm">{day}</span>
                      <span className="text-slate-500 font-bold">-</span>
                      <span className="border border-black px-2 py-0.5 rounded-[1px] bg-white text-black shadow-sm">{month}</span>
                      <span className="text-slate-500 font-bold">-</span>
                      <span className="border border-black px-2 py-0.5 rounded-[1px] bg-white text-black shadow-sm">{year}</span>
                    </>
                  );
                })()}
              </div>
            </div>
          </DraggableBlock>
        </div>
      </div>
    );
  }

  if (id === 'asymmetrical-research') {
    return (
      <div className="flex flex-col flex-1 justify-between items-center w-full relative z-10 py-6">
        {/* Top Logo Section: Centered University Logo */}
        <div className="flex flex-col items-center justify-center text-center mt-3 w-full">
          {design.logoUrl && (
            <div className="mb-4">
              <NewTemplateLogo 
                logoUrl={design.logoUrl} 
                logoHeight={logoHeight}
                primaryColor={accentColor}
              />
            </div>
          )}
          
          <DraggableBlock elementId="universityHeader" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
            <div className="flex flex-col items-center space-y-1 text-center">
              <span 
                className="text-center block"
                style={{
                  fontFamily: design.fontUniversity?.fontFamily || design.fontTitle?.fontFamily || fontFamily || 'Georgia, serif',
                  fontSize: `${(design.fontUniversity?.fontSize || design.fontTitle?.fontSize || 16) / 14}em`,
                  color: design.fontUniversity?.color || design.fontTitle?.color || fontColor || '#000000',
                  fontWeight: design.fontUniversity?.bold !== undefined ? (design.fontUniversity.bold ? 'bold' : 'normal') : (design.fontTitle?.bold !== false ? 'bold' : 'normal'),
                  fontStyle: design.fontUniversity?.italic ? 'italic' : (design.fontTitle?.italic ? 'italic' : 'normal'),
                  textTransform: (design.fontUniversity?.uppercase !== undefined ? design.fontUniversity.uppercase : true) ? 'uppercase' : 'none'
                }}
              >
                {data.universityName || data.teacherUniversity || 'UNIVERSITY OF DHAKA'}
              </span>
              {data.departmentName && (
                <span 
                  className="tracking-wider uppercase text-center block font-semibold opacity-80"
                  style={{
                    fontFamily: design.fontSubSection?.fontFamily || fontFamily || 'Georgia, serif',
                    fontSize: `${(design.fontSubSection?.fontSize || 10.5) / 14}em`,
                    color: design.fontSubSection?.color || fontColor || undefined
                  }}
                >
                  {data.departmentName}
                </span>
              )}
            </div>
          </DraggableBlock>
        </div>

        {/* Upper Middle Section: Centered text block */}
        <div className="flex flex-col items-center justify-center text-center my-4 w-full px-10">
          <DraggableBlock elementId="documentType" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 text-center">
            <div 
              className="mb-1 text-center font-medium"
              style={{
                fontFamily: design.fontAssignmentTopic?.fontFamily || fontFamily || 'Georgia, serif',
                fontSize: `${(design.fontAssignmentTopic?.fontSize || 13) / 14}em`,
                color: design.fontAssignmentTopic?.color || fontColor || '#000000'
              }}
            >
              Assignment Topic: <span className="font-semibold">{data.documentType || 'Writing a Research Proposal'}</span>
            </div>
          </DraggableBlock>

          <DraggableBlock elementId="topicTitle" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 text-center w-full">
            <div className="flex flex-col items-center justify-center w-full mt-2">
              <div 
                className="font-bold mb-1 uppercase tracking-wide text-center block"
                style={{
                  fontFamily: design.fontTopicTitle?.fontFamily || fontFamily || 'Georgia, serif',
                  fontSize: `${((design.fontTopicTitle?.fontSize || 18) * 0.75) / 14}em`,
                  color: design.fontTopicTitle?.color || fontColor || '#000000'
                }}
              >
                Title of the Research Proposal:
              </div>
              <h1 
                className="text-center max-w-[90%] font-semibold leading-relaxed py-1.5 whitespace-pre-line block mx-auto"
                style={{
                  fontFamily: design.fontTopicTitle?.fontFamily || fontFamily || 'Georgia, serif',
                  color: design.fontTopicTitle?.color || fontColor || undefined,
                  fontSize: `${(design.fontTopicTitle?.fontSize || 18) / 14}em`
                }}
              >
                {data.topicTitle || 'Social Discrimination against religious minorities:\nA cross-sectional survey on the Hindus in Uzirpur, Barisal'}
              </h1>
            </div>
          </DraggableBlock>

          <DraggableBlock elementId="courseTitle" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 mt-2 text-center">
            <div 
              className="text-center"
              style={{
                fontFamily: design.fontCourse?.fontFamily || fontFamily || 'Georgia, serif',
                fontSize: `${(design.fontCourse?.fontSize || 13) / 14}em`,
                color: design.fontCourse?.color || fontColor || '#000000'
              }}
            >
              Course Name: <span className="font-semibold">{data.courseName || 'Research Methodology'}</span> Course No: <span className="font-semibold">{data.courseNo || '351'}</span>
            </div>
          </DraggableBlock>
        </div>

        {/* The Asymmetrical Staggered Section (CRITICAL FIX) */}
        <div className="w-full px-12 md:px-14 my-4">
          <DraggableBlock elementId="submissionsBlock" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 w-full">
            <div className="flex flex-col w-full relative">
              {/* Submitted to (Teacher block) - left-aligned, higher up */}
              <div className="w-[58%] text-left self-start flex flex-col space-y-[3px]">
                <div 
                  className="font-bold underline mb-1"
                  style={{
                    fontFamily: design.fontSubmittedToHeading?.fontFamily || fontFamily || 'Georgia, serif',
                    color: design.fontSubmittedToHeading?.color || fontColor || '#000000',
                    fontSize: `${(design.fontSubmittedToHeading?.fontSize || 12.5) / 14}em`,
                    textTransform: design.fontSubmittedToHeading?.uppercase ? 'uppercase' : 'none'
                  }}
                >
                  Submitted to:
                </div>
                {data.teacherDetails ? (
                  <div 
                    className="whitespace-pre-line leading-relaxed text-left"
                    style={{
                      fontFamily: design.fontSubmittedToContent?.fontFamily || fontFamily || 'Georgia, serif',
                      color: design.fontSubmittedToContent?.color || fontColor || undefined,
                      fontSize: `${(design.fontSubmittedToContent?.fontSize || 11) / 14}em`
                    }}
                  >
                    {data.teacherDetails}
                  </div>
                ) : (
                  <div 
                    className="leading-relaxed flex flex-col space-y-[2px] text-left"
                    style={{
                      fontFamily: design.fontSubmittedToContent?.fontFamily || fontFamily || 'Georgia, serif',
                      color: design.fontSubmittedToContent?.color || fontColor || undefined,
                      fontSize: `${(design.fontSubmittedToContent?.fontSize || 11) / 14}em`,
                      fontWeight: design.fontSubmittedToContent?.bold ? 'bold' : 'normal',
                      fontStyle: design.fontSubmittedToContent?.italic ? 'italic' : 'normal'
                    }}
                  >
                    <div className="font-semibold">{data.teacherName || 'Dr. Abul Kashem Mohammad Jamal Uddin'}</div>
                    <div className="opacity-80">{data.teacherDesignation || 'Professor'}</div>
                    <div className="opacity-80">{data.teacherDiscipline || 'Department of Sociology'}</div>
                    {data.studentUniversity && <div className="opacity-80">{data.studentUniversity || 'University of Dhaka'}</div>}
                  </div>
                )}
              </div>

              {/* Submitted by (Student block) - right-aligned, pushed downwards with significant margin */}
              <div className="w-[58%] text-right self-end flex flex-col space-y-[3px] mt-16 md:mt-20">
                <div 
                  className="font-bold underline mb-1"
                  style={{
                    fontFamily: design.fontSubmittedByHeading?.fontFamily || fontFamily || 'Georgia, serif',
                    color: design.fontSubmittedByHeading?.color || fontColor || '#000000',
                    fontSize: `${(design.fontSubmittedByHeading?.fontSize || 12.5) / 14}em`,
                    textTransform: design.fontSubmittedByHeading?.uppercase ? 'uppercase' : 'none'
                  }}
                >
                  Submitted by:
                </div>
                {data.studentDetails ? (
                  <div 
                    className="whitespace-pre-line leading-relaxed text-right"
                    style={{
                      fontFamily: design.fontSubmittedByContent?.fontFamily || fontFamily || 'Georgia, serif',
                      color: design.fontSubmittedByContent?.color || fontColor || undefined,
                      fontSize: `${(design.fontSubmittedByContent?.fontSize || 11) / 14}em`
                    }}
                  >
                    {data.studentDetails}
                  </div>
                ) : (
                  <div 
                    className="leading-relaxed flex flex-col space-y-[2px] text-right items-end"
                    style={{
                      fontFamily: design.fontSubmittedByContent?.fontFamily || fontFamily || 'Georgia, serif',
                      color: design.fontSubmittedByContent?.color || fontColor || undefined,
                      fontSize: `${(design.fontSubmittedByContent?.fontSize || 11) / 14}em`,
                      fontWeight: design.fontSubmittedByContent?.bold ? 'bold' : 'normal',
                      fontStyle: design.fontSubmittedByContent?.italic ? 'italic' : 'normal'
                    }}
                  >
                    <div className="font-semibold">{data.studentName || 'Tahmid Ul Islam'}</div>
                    {data.studentYearTerm && <div className="opacity-80">{data.studentYearTerm || 'Session: 2017-18'}</div>}
                    {data.studentId && <div className="opacity-80">Class Roll: {data.studentId || '155'}</div>}
                    <div className="opacity-80">{data.studentDiscipline || 'Department of Sociology'}</div>
                    {data.studentUniversity && <div className="opacity-80">{data.studentUniversity || 'University of Dhaka'}</div>}
                  </div>
                )}
              </div>
            </div>
          </DraggableBlock>
        </div>

        {/* Bottom Section: Centered, Italicized Submission Date */}
        <div className="mt-6 mb-2 select-none">
          <DraggableBlock elementId="submissionDate" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
            <div 
              className="text-center italic"
              style={{
                fontFamily: design.fontSubmissionDateHeading?.fontFamily || fontFamily || 'Georgia, serif',
                fontSize: `${(design.fontSubmissionDateHeading?.fontSize || 11.5) / 14}em`,
                color: design.fontSubmissionDateHeading?.color || fontColor || '#111827',
                fontStyle: 'italic'
              }}
            >
              Date of Submission: <span className="font-semibold">{formatDate(data.submissionDate)}</span>
            </div>
          </DraggableBlock>
        </div>
      </div>
    );
  }

  if (id === 'top-header-asymmetric') {
    return (
      <div 
        className="flex flex-col flex-1 justify-between items-center w-full relative z-10 py-6"
        style={{ fontSize: baseFontSize ? `${baseFontSize}px` : undefined }}
      >
        {/* Item 1: Absolute Top Section (Above Logo) */}
        <div className="flex flex-col items-center justify-center text-center mt-3 w-full">
          <DraggableBlock elementId="universityHeader" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 w-full px-4">
            <div className="flex flex-col items-center space-y-1 text-center w-full">
              <span 
                className="text-center block leading-snug w-full"
                style={{
                  fontFamily: design.fontUniversity?.fontFamily || design.fontTitle?.fontFamily || fontFamily || '"Times New Roman", Times, serif',
                  fontSize: `${(design.fontUniversity?.fontSize || 19) / 14}em`,
                  color: design.fontUniversity?.color || design.fontTitle?.color || fontColor || '#8b0000',
                  fontWeight: design.fontUniversity?.bold !== undefined ? (design.fontUniversity.bold ? 'bold' : 'normal') : 'bold',
                  fontStyle: design.fontUniversity?.italic ? 'italic' : 'normal',
                  textTransform: (design.fontUniversity?.uppercase !== undefined ? design.fontUniversity.uppercase : false) ? 'uppercase' : 'none'
                }}
              >
                {data.universityName || data.teacherUniversity || 'Jagannath University'}
              </span>
              <span 
                className="text-center block leading-normal w-full"
                style={{
                  fontFamily: design.fontDiscipline?.fontFamily || design.fontSubSection?.fontFamily || fontFamily || '"Times New Roman", Times, serif',
                  fontSize: `${(design.fontDiscipline?.fontSize || 12) / 14}em`,
                  color: design.fontDiscipline?.color || design.fontSubSection?.color || fontColor || '#1e3a8a',
                  fontWeight: design.fontDiscipline?.bold !== undefined ? (design.fontDiscipline.bold ? 'bold' : 'normal') : (design.fontSubSection?.bold !== undefined ? (design.fontSubSection.bold ? 'bold' : 'normal') : 'bold'),
                  fontStyle: design.fontDiscipline?.italic !== undefined ? (design.fontDiscipline.italic ? 'italic' : 'normal') : (design.fontSubSection?.italic ? 'italic' : 'normal'),
                  textTransform: (design.fontDiscipline?.uppercase !== undefined ? design.fontDiscipline.uppercase : false) ? 'uppercase' : 'none'
                }}
              >
                {data.teacherDiscipline || data.studentDiscipline || 'Department of Physics'}
              </span>
            </div>
          </DraggableBlock>
        </div>

        {/* Item 2: Logo Section: Centered University Logo below the top text */}
        {design.logoUrl && (
          <div className="flex justify-center my-3 w-full">
            <NewTemplateLogo 
              logoUrl={design.logoUrl} 
              logoHeight={logoHeight}
              primaryColor={accentColor}
            />
          </div>
        )}

        {/* Item 3: Topic Section: Centered Assignment On, Topic, Course Code/Title */}
        <div className="flex flex-col items-center justify-center text-center my-2 w-full px-10">
          <DraggableBlock elementId="documentType" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 text-center w-full">
            <div 
              className="mb-1 text-center font-bold"
              style={{
                fontFamily: design.fontAssignmentTopic?.fontFamily || fontFamily || '"Times New Roman", Times, serif',
                fontSize: `${(design.fontAssignmentTopic?.fontSize || 12.5) / 14}em`,
                color: design.fontAssignmentTopic?.color || fontColor || '#2563eb'
              }}
            >
              {data.documentType || 'Assignment On'}
            </div>
          </DraggableBlock>

          <DraggableBlock elementId="topicTitle" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 text-center w-full my-2">
            <div className="flex flex-col items-center justify-center w-full">
              <h1 
                className="text-center max-w-[95%] font-bold leading-relaxed whitespace-pre-line block mx-auto py-0.5"
                style={{
                  fontFamily: design.fontTopicTitle?.fontFamily || fontFamily || '"Times New Roman", Times, serif',
                  color: design.fontTopicTitle?.color || fontColor || '#070b19',
                  fontSize: `${(design.fontTopicTitle?.fontSize || 18) / 14}em`
                }}
              >
                {data.topicTitle || 'Software Development'}
              </h1>
            </div>
          </DraggableBlock>

          <DraggableBlock elementId="courseTitle" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 mt-1 text-center flex flex-col space-y-1.5 w-full">
            <div 
              className="text-center font-semibold w-full block"
              style={{
                fontFamily: design.fontCourse?.fontFamily || fontFamily || '"Times New Roman", Times, serif',
                fontSize: `${(design.fontCourse?.fontSize || 13) / 14}em`,
                color: design.fontCourse?.color || fontColor || '#111827'
              }}
            >
              <span className="opacity-80">{data.courseNameHeading || 'Course Title:'}</span> <span className="font-bold">{data.courseName || 'Energy Sources'}</span>
            </div>
            {data.courseNo && (
              <div 
                className="text-center font-semibold w-full block"
                style={{
                  fontFamily: design.fontCourse?.fontFamily || fontFamily || '"Times New Roman", Times, serif',
                  fontSize: `${(design.fontCourse?.fontSize || 13) / 14}em`,
                  color: design.fontCourse?.color || fontColor || '#111827'
                }}
              >
                <span className="opacity-80">{data.courseNoHeading || 'Course Code:'}</span> <span className="font-bold">{data.courseNo || 'PHY403'}</span>
              </div>
            )}
          </DraggableBlock>
        </div>

        {/* Item 4: The Asymmetrical Staggered Section (CRITICAL) */}
        <div className="w-full px-12 md:px-14 my-3">
          <DraggableBlock elementId="submissionsBlock" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 w-full">
            <div className="flex flex-col w-full relative">
              
              {/* "Submitted To" Block (Left): Aligned text-left */}
              <div className="w-[52%] text-left self-start flex flex-col space-y-1">
                <div 
                  className="font-bold underline mb-1 block"
                  style={{
                    fontFamily: design.fontSubmittedToHeading?.fontFamily || fontFamily || '"Times New Roman", Times, serif',
                    color: design.fontSubmittedToHeading?.color || fontColor || '#8b0000',
                    fontSize: `${(design.fontSubmittedToHeading?.fontSize || 12.5) / 14}em`,
                    textTransform: design.fontSubmittedToHeading?.uppercase ? 'uppercase' : 'none'
                  }}
                >
                  Submitted To:
                </div>
                {data.teacherDetails ? (
                  <div 
                    className="whitespace-pre-line leading-relaxed text-left"
                    style={{
                      fontFamily: design.fontSubmittedToContent?.fontFamily || fontFamily || '"Times New Roman", Times, serif',
                      color: design.fontSubmittedToContent?.color || fontColor || undefined,
                      fontSize: `${(design.fontSubmittedToContent?.fontSize || 11.5) / 14}em`
                    }}
                  >
                    {data.teacherDetails}
                  </div>
                ) : (
                  <div 
                    className="leading-relaxed flex flex-col space-y-[2px] text-left"
                    style={{
                      fontFamily: design.fontSubmittedToContent?.fontFamily || fontFamily || '"Times New Roman", Times, serif',
                      color: design.fontSubmittedToContent?.color || fontColor || undefined,
                      fontSize: `${(design.fontSubmittedToContent?.fontSize || 11.5) / 14}em`,
                      fontWeight: design.fontSubmittedToContent?.bold ? 'bold' : 'normal',
                      fontStyle: design.fontSubmittedToContent?.italic ? 'italic' : 'normal'
                    }}
                  >
                    <div className="font-bold">{data.teacherName || 'Arpon Chakraborty'}</div>
                    <div className="opacity-90">{data.teacherDesignation || 'Assistant Professor'}</div>
                    <div className="opacity-90">{data.teacherDiscipline || 'Department of Physics'}</div>
                    <div className="opacity-90">{data.teacherUniversity || 'Jagannath University, Dhaka'}</div>
                  </div>
                )}
              </div>

              {/* "Submitted By" Block (Right): Pushed right ml-auto, mt-16, text-left internally */}
              <div className="w-[52%] ml-auto text-left self-end flex flex-col items-start space-y-1 mt-14 md:mt-16">
                <div 
                  className="font-bold underline mb-1 block text-left"
                  style={{
                    fontFamily: design.fontSubmittedByHeading?.fontFamily || fontFamily || '"Times New Roman", Times, serif',
                    color: design.fontSubmittedByHeading?.color || fontColor || '#8b0000',
                    fontSize: `${(design.fontSubmittedByHeading?.fontSize || 12.5) / 14}em`,
                    textTransform: design.fontSubmittedByHeading?.uppercase ? 'uppercase' : 'none'
                  }}
                >
                  Submitted By:
                </div>
                {data.studentDetails ? (
                  <div 
                    className="whitespace-pre-line leading-relaxed text-left w-full"
                    style={{
                      fontFamily: design.fontSubmittedByContent?.fontFamily || fontFamily || '"Times New Roman", Times, serif',
                      color: design.fontSubmittedByContent?.color || fontColor || undefined,
                      fontSize: `${(design.fontSubmittedByContent?.fontSize || 11.5) / 14}em`
                    }}
                  >
                    {data.studentDetails}
                  </div>
                ) : (
                  <div 
                    className="leading-relaxed flex flex-col space-y-[2px] text-left items-start w-full"
                    style={{
                      fontFamily: design.fontSubmittedByContent?.fontFamily || fontFamily || '"Times New Roman", Times, serif',
                      color: design.fontSubmittedByContent?.color || fontColor || undefined,
                      fontSize: `${(design.fontSubmittedByContent?.fontSize || 11.5) / 14}em`,
                      fontWeight: design.fontSubmittedByContent?.bold ? 'bold' : 'normal',
                      fontStyle: design.fontSubmittedByContent?.italic ? 'italic' : 'normal'
                    }}
                  >
                    <div className="font-bold">{data.studentName || 'Md Abdul Basir'}</div>
                    {data.studentId && <div className="opacity-90">ID: {data.studentId || '18PHY040'}</div>}
                    {data.studentYearTerm && <div className="opacity-90">{data.studentYearTerm || '31th Batch'}</div>}
                    <div className="opacity-90">{data.studentDiscipline || 'Department of Physics'}</div>
                    <div className="opacity-90">{data.studentUniversity || 'Jagannath University, Dhaka'}</div>
                  </div>
                )}
              </div>

            </div>
          </DraggableBlock>
        </div>

        {/* Item 5: Bottom Section: Date of Submission centered */}
        <div className="mt-6 mb-2 select-none w-full">
          <DraggableBlock elementId="submissionDate" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
            <div 
              className="text-center font-semibold"
              style={{
                fontFamily: design.fontSubmissionDateHeading?.fontFamily || fontFamily || '"Times New Roman", Times, serif',
                fontSize: `${(design.fontSubmissionDateHeading?.fontSize || 12) / 14}em`,
                color: design.fontSubmissionDateHeading?.color || fontColor || '#0f172a'
              }}
            >
              Date of Submission: <span className="font-bold">{formatDate(data.submissionDate)}</span>
            </div>
          </DraggableBlock>
        </div>
      </div>
    );
  }

  return null;
};
