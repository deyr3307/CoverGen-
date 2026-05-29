import React from 'react';
import { CoverPageData, CoverPageDesign, FontConfig } from '../types';
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
      className="flex items-center justify-center animate-pulse-slow"
    >
      <svg 
        className="w-full h-full fill-current" 
        viewBox={logoPreset.viewBox} 
        dangerouslySetInnerHTML={{ __html: logoPreset.svgPath }} 
      />
    </div>
  );
};

// Reusable Helper to resolve dynamic style from fontConfig with highest specificity
const resolveStyle = (
  fontConfig: FontConfig | undefined,
  fallbackBase: {
    fontFamily: string;
    fontSize: number;
    color: string;
    bold: boolean;
    italic: boolean;
    uppercase: boolean;
    align?: 'left' | 'center' | 'right';
  },
  extraStyles: React.CSSProperties = {},
  parentConfig?: FontConfig | undefined
): React.CSSProperties => {
  const family = fontConfig?.fontFamily || parentConfig?.fontFamily || fallbackBase.fontFamily;
  const size = fontConfig?.fontSize !== undefined ? fontConfig.fontSize : (parentConfig?.fontSize !== undefined ? parentConfig.fontSize : fallbackBase.fontSize);
  const color = fontConfig?.color || parentConfig?.color || fallbackBase.color;
  const bold = fontConfig?.bold !== undefined ? fontConfig.bold : (parentConfig?.bold !== undefined ? parentConfig.bold : fallbackBase.bold);
  const italic = fontConfig?.italic !== undefined ? fontConfig.italic : (parentConfig?.italic !== undefined ? parentConfig.italic : fallbackBase.italic);
  const uppercase = fontConfig?.uppercase !== undefined ? fontConfig.uppercase : (parentConfig?.uppercase !== undefined ? parentConfig.uppercase : fallbackBase.uppercase);
  const align = fontConfig?.align || parentConfig?.align || fallbackBase.align || 'center';

  return {
    fontFamily: family,
    fontSize: `${size}pt`,
    color: color,
    fontWeight: bold ? 'bold' : 'normal',
    fontStyle: italic ? 'italic' : 'normal',
    textTransform: uppercase ? 'uppercase' : 'none',
    textAlign: align as any,
    ...extraStyles
  };
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
          <DraggableBlock elementId="universityHeader" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 w-full">
            <div className="flex flex-col items-center">
              <span 
                className="pb-1 px-4 text-center block"
                style={resolveStyle(design.fontUniversity, {
                  fontFamily: fontFamily || 'Georgia, serif',
                  fontSize: 22,
                  color: fontColor || '#1e3a8a',
                  bold: true,
                  italic: false,
                  uppercase: true,
                  align: 'center'
                }, {
                  borderBottom: `2px solid ${design.fontUniversity?.color || design.fontTitle?.color || '#f59e0b'}`
                })}
              >
                {data.universityName || data.teacherUniversity || 'KHULNA UNIVERSITY'}
              </span>
              {data.departmentName && (
                <span 
                  className="mt-2 text-center block"
                  style={resolveStyle(design.fontDiscipline || design.fontSubSection, {
                    fontFamily: fontFamily || 'Georgia, serif',
                    fontSize: 11,
                    color: fontColor || '#1e3a8a',
                    bold: false,
                    italic: true,
                    uppercase: false,
                    align: 'center'
                  }, { opacity: 0.85 })}
                >
                  {data.departmentName}
                </span>
              )}
            </div>
          </DraggableBlock>
        </div>

        {/* Course Title and Code */}
        <div className="flex flex-col items-center my-6 w-full px-8">
          <DraggableBlock elementId="courseCode" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 w-full text-center">
            <div 
              className="mb-2 block w-full text-center"
              style={resolveStyle(design.fontCourseNoHeading, {
                fontFamily: fontFamily || 'Georgia, serif',
                fontSize: 13,
                color: fontColor || '#1e3a8a',
                bold: true,
                italic: false,
                uppercase: true,
                align: 'center'
              })}
            >
              Course Code: <span style={resolveStyle(design.fontCourseNoContent, {
                fontFamily: fontFamily || 'Georgia, serif',
                fontSize: 13,
                color: fontColor || '#1e3a8a',
                bold: true,
                italic: false,
                uppercase: false,
                align: 'center'
              }, { display: 'inline' })}>{data.courseNo}</span>
            </div>
          </DraggableBlock>
          
          <DraggableBlock elementId="courseTitle" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 w-full text-center">
            <div 
              className="block w-full text-center"
              style={resolveStyle(design.fontCourseTitleHeading, {
                fontFamily: fontFamily || 'Georgia, serif',
                fontSize: 15,
                color: fontColor || '#1e3a8a',
                bold: true,
                italic: false,
                uppercase: true,
                align: 'center'
              })}
            >
              Course Title: <span style={resolveStyle(design.fontCourseTitleContent, {
                fontFamily: fontFamily || 'Georgia, serif',
                fontSize: 15,
                color: fontColor || '#1e3a8a',
                bold: true,
                italic: false,
                uppercase: false,
                align: 'center'
              }, { display: 'inline' })}>{data.courseName}</span>
            </div>
          </DraggableBlock>
        </div>

        {/* Assignment Topic Title inside double quotes */}
        <div className="flex flex-col items-center justify-center my-4 w-full px-10">
          <DraggableBlock elementId="documentType" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 text-center w-full">
            <div 
              className="mb-2 block w-full text-center"
              style={resolveStyle(design.fontAssignmentTopic, {
                fontFamily: fontFamily || 'Georgia, serif',
                fontSize: 12,
                color: fontColor || '#2563eb',
                bold: false,
                italic: true,
                uppercase: false,
                align: 'center'
              }, { opacity: 0.7 })}
            >
              {data.documentType || 'An Argumentative Essay on'}
            </div>
          </DraggableBlock>

          <DraggableBlock elementId="topicTitle" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 text-center w-full">
            <h1 
              className="px-6 leading-relaxed select-none py-2 block w-full text-center font-semibold"
              style={resolveStyle(design.fontTopicTitle, {
                fontFamily: fontFamily || 'Georgia, serif',
                fontSize: 18,
                color: fontColor || '#000000',
                bold: true,
                italic: false,
                uppercase: false,
                align: 'center'
              }, { lineHeight: '1.4' })}
            >
              "{data.topicName || 'Is Kelsen\'s model of Law more efficient than Austin\'s?'}"
            </h1>
          </DraggableBlock>
        </div>

        {/* The signature split tables block with a solid header bar */}
        <div className="w-full px-10 my-6">
          <DraggableBlock elementId="submissionsBlock" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 w-full">
            <div className="grid grid-cols-2 gap-8 w-full text-left">
              {/* Left Column: Submitted To */}
              <div className="border border-slate-300 rounded-lg overflow-hidden bg-slate-50/20 shadow-sm flex flex-col text-left">
                <div 
                  className="px-4 py-2.5 tracking-wider text-white w-full text-left"
                  style={resolveStyle(design.fontSubmittedToHeading, { 
                    fontFamily: fontFamily || 'Georgia, serif',
                    fontSize: 12,
                    color: '#ffffff',
                    bold: true,
                    italic: false,
                    uppercase: true,
                    align: 'left'
                  }, { backgroundColor: accentColor }, design.fontSubSection)}
                >
                  {data.submittedToLabel || 'SUBMITTED TO'}
                </div>
                <div 
                  className="p-4 space-y-2 leading-relaxed text-left w-full"
                  style={resolveStyle(design.fontSubmittedToContent, {
                    fontFamily: fontFamily || 'Georgia, serif',
                    fontSize: 11.5,
                    color: fontColor || '#000000',
                    bold: false,
                    italic: false,
                    uppercase: false,
                    align: 'left'
                  }, {}, design.fontSubSection)}
                >
                  <div className="text-left" style={{ fontWeight: (design.fontSubmittedToContent?.bold !== undefined ? design.fontSubmittedToContent.bold : true) ? 'bold' : 'normal' }}>{data.teacherName}</div>
                  <div className="text-left text-[0.9em] opacity-80">{data.teacherDesignation}</div>
                  <div className="text-left text-[0.9em] opacity-80">{data.teacherDepartment || data.departmentName}</div>
                  <div className="text-left text-[0.85em] opacity-80" style={{ fontWeight: (design.fontSubmittedToContent?.bold !== undefined ? design.fontSubmittedToContent.bold : true) ? 'semibold' : 'normal' }}>{data.universityName || 'Khulna University'}</div>
                </div>
              </div>

              {/* Right Column: Submitted By */}
              <div className="border border-slate-300 rounded-lg overflow-hidden bg-slate-50/20 shadow-sm flex flex-col text-left">
                <div 
                  className="px-4 py-2.5 tracking-wider text-white w-full text-left"
                  style={resolveStyle(design.fontSubmittedByHeading, { 
                    fontFamily: fontFamily || 'Georgia, serif',
                    fontSize: 12,
                    color: '#ffffff',
                    bold: true,
                    italic: false,
                    uppercase: true,
                    align: 'left'
                  }, { backgroundColor: accentColor }, design.fontSubSection)}
                >
                  {data.submittedByLabel || 'SUBMITTED BY'}
                </div>
                <div 
                  className="p-4 space-y-2 leading-relaxed text-left w-full"
                  style={resolveStyle(design.fontSubmittedByContent, {
                    fontFamily: fontFamily || 'Georgia, serif',
                    fontSize: 11.5,
                    color: fontColor || '#000000',
                    bold: false,
                    italic: false,
                    uppercase: false,
                    align: 'left'
                  }, {}, design.fontSubSection)}
                >
                  <div className="text-left" style={{ fontWeight: (design.fontSubmittedByContent?.bold !== undefined ? design.fontSubmittedByContent.bold : true) ? 'bold' : 'normal' }}>{data.studentName}</div>
                  <div className="text-left text-[0.9em] opacity-80">ID: {data.studentId}</div>
                  {data.studentRoll && <div className="text-left text-[0.9em] opacity-80">Roll: {data.studentRoll}</div>}
                  {data.studentRegNo && <div className="text-left text-[0.9em] opacity-80">Reg: {data.studentRegNo}</div>}
                  <div className="text-left text-[0.85em] opacity-80" style={{ fontWeight: (design.fontSubmittedByContent?.bold !== undefined ? design.fontSubmittedByContent.bold : true) ? 'semibold' : 'normal' }}>{data.studentDepartment || data.departmentName}</div>
                </div>
              </div>
            </div>
          </DraggableBlock>
        </div>

        {/* Submit Date */}
        <div className="mt-4 mb-4 text-center">
          <DraggableBlock elementId="submissionDate" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 text-center w-full">
            <div 
              className="tracking-wider text-center block w-full"
              style={resolveStyle(design.fontSubmissionDateHeading, {
                fontFamily: fontFamily || 'Georgia, serif',
                fontSize: 12,
                color: fontColor || '#1e3a8a',
                bold: true,
                italic: false,
                uppercase: true,
                align: 'center'
              })}
            >
              Date of Submission: <span style={resolveStyle(design.fontSubmissionDateContent, {
                fontFamily: fontFamily || 'Georgia, serif',
                fontSize: 12,
                color: fontColor || '#000000',
                bold: true,
                italic: false,
                uppercase: false,
                align: 'center'
              }, { display: 'inline' })}>{formatDate(data.submissionDate)}</span>
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
          <DraggableBlock elementId="universityHeader" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 w-full text-center animate-pulse-slow">
            <div className="flex flex-col items-center text-center">
              <span 
                className="text-center block w-full font-bold"
                style={resolveStyle(design.fontUniversity, {
                  fontFamily: fontFamily || '"Times New Roman", Times, serif',
                  fontSize: 24,
                  color: fontColor || '#1e3a8a',
                  bold: true,
                  italic: false,
                  uppercase: true,
                  align: 'center'
                })}
              >
                {data.universityName || data.teacherUniversity || 'UNIVERSITY OF CHITTAGONG'}
              </span>
              {data.departmentName && (
                <span 
                  className="mt-1 tracking-wider uppercase text-center block font-semibold opacity-80"
                  style={resolveStyle(design.fontDiscipline || design.fontSubSection, {
                    fontFamily: fontFamily || '"Times New Roman", Times, serif',
                    fontSize: 11,
                    color: fontColor || '#1e3a8a',
                    bold: true,
                    italic: false,
                    uppercase: true,
                    align: 'center'
                  })}
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
                style={resolveStyle(design.fontCourseNoHeading, {
                  fontFamily: fontFamily || '"Times New Roman", Times, serif',
                  fontSize: 13,
                  color: fontColor || '#1e3a8a',
                  bold: true,
                  italic: false,
                  uppercase: true,
                  align: 'center'
                })}
              >
                Course Code : <span style={resolveStyle(design.fontCourseNoContent, {
                  fontFamily: fontFamily || '"Times New Roman", Times, serif',
                  fontSize: 13,
                  color: fontColor || '#000000',
                  bold: true,
                  italic: false,
                  uppercase: false,
                  align: 'center'
                }, { display: 'inline' })}>{data.courseNo}</span>
              </span>
            </div>
          </DraggableBlock>

          <DraggableBlock elementId="courseTitle" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="w-4/5 z-10">
            <div className="border-[2px] border-black p-2.5 text-center font-bold tracking-wide uppercase bg-slate-50/50 shadow-sm rounded-md">
              <span 
                style={resolveStyle(design.fontCourseTitleHeading, {
                  fontFamily: fontFamily || '"Times New Roman", Times, serif',
                  fontSize: 13,
                  color: fontColor || '#1e3a8a',
                  bold: true,
                  italic: false,
                  uppercase: true,
                  align: 'center'
                })}
              >
                Course Name : <span style={resolveStyle(design.fontCourseTitleContent, {
                  fontFamily: fontFamily || '"Times New Roman", Times, serif',
                  fontSize: 13,
                  color: fontColor || '#000000',
                  bold: true,
                  italic: false,
                  uppercase: false,
                  align: 'center'
                }, { display: 'inline' })}>{data.courseName}</span>
              </span>
            </div>
          </DraggableBlock>
        </div>

        {/* Mid Section Assignment Topic Title */}
        <div className="flex flex-col items-center justify-center my-2 w-full px-12">
          <DraggableBlock elementId="documentType" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 text-center w-full">
            <span 
              className="tracking-widest mb-2 text-center block font-bold underline"
              style={resolveStyle(design.fontAssignmentTopic, {
                fontFamily: fontFamily || '"Times New Roman", Times, serif',
                fontSize: 11,
                color: fontColor || '#1e3a8a',
                bold: true,
                italic: false,
                uppercase: true,
                align: 'center'
              })}
            >
              {data.documentType || 'ASSIGNMENT ON'}
            </span>
          </DraggableBlock>

          <DraggableBlock elementId="topicTitle" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 text-center w-full">
            <p 
              className="text-center font-bold px-4 leading-relaxed block w-full"
              style={resolveStyle(design.fontTopicTitle, {
                fontFamily: fontFamily || '"Times New Roman", Times, serif',
                fontSize: 19,
                color: fontColor || '#000000',
                bold: true,
                italic: false,
                uppercase: false,
                align: 'center'
              }, { lineHeight: '1.4' })}
            >
              {data.topicName}
            </p>
          </DraggableBlock>
        </div>

        {/* Left and right tables aligned beautifully with colons as per CU guides */}
        <div className="w-full px-12 my-4">
          <DraggableBlock elementId="submissionsBlock" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 w-full">
            <div className="grid grid-cols-2 gap-10 w-full text-left">
              {/* Submitted To column */}
              <div className="space-y-3 text-left w-full">
                <h4 
                  className="font-bold uppercase tracking-wider underline pb-1 text-left block w-full"
                  style={resolveStyle(design.fontSubmittedToHeading, {
                    fontFamily: fontFamily || '"Times New Roman", Times, serif',
                    fontSize: 12.5,
                    color: fontColor || '#1e3a8a',
                    bold: true,
                    italic: false,
                    uppercase: true,
                    align: 'left'
                  }, {}, design.fontSubSection)}
                >
                  {data.submittedToLabel || 'SUBMITTED TO:'}
                </h4>
                <table 
                  className="w-full text-left"
                  style={resolveStyle(design.fontSubmittedToContent, {
                    fontFamily: fontFamily || '"Times New Roman", Times, serif',
                    fontSize: 11.5,
                    color: fontColor || '#000000',
                    bold: false,
                    italic: false,
                    uppercase: false,
                    align: 'left'
                  }, {}, design.fontSubSection)}
                >
                  <tbody>
                    <tr className="text-left">
                      <td className="pr-2 py-1 w-1/3 text-left" style={{ fontWeight: (design.fontSubmittedToContent?.bold !== undefined ? design.fontSubmittedToContent.bold : false) ? 'bold' : 'normal' }}>Name</td>
                      <td className="py-1 w-[5%] px-1 text-left">:</td>
                      <td className="py-1 text-left inline-block" style={{ fontWeight: (design.fontSubmittedToContent?.bold !== undefined ? design.fontSubmittedToContent.bold : false) ? 'bold' : 'normal' }}>{data.teacherName}</td>
                    </tr>
                    <tr className="text-left">
                      <td className="pr-2 py-1 text-left" style={{ fontWeight: (design.fontSubmittedToContent?.bold !== undefined ? design.fontSubmittedToContent.bold : false) ? 'bold' : 'normal' }}>Designation</td>
                      <td className="py-1 px-1 text-left">:</td>
                      <td className="py-1 text-left">{data.teacherDesignation}</td>
                    </tr>
                    <tr className="text-left">
                      <td className="pr-2 py-1 text-left" style={{ fontWeight: (design.fontSubmittedToContent?.bold !== undefined ? design.fontSubmittedToContent.bold : false) ? 'bold' : 'normal' }}>Department</td>
                      <td className="py-1 px-1 text-left">:</td>
                      <td className="py-1 text-left">{data.teacherDepartment || data.departmentName}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Submitted By column */}
              <div className="space-y-3 text-left w-full">
                <h4 
                  className="font-bold uppercase tracking-wider underline pb-1 text-left block w-full"
                  style={resolveStyle(design.fontSubmittedByHeading, {
                    fontFamily: fontFamily || '"Times New Roman", Times, serif',
                    fontSize: 12.5,
                    color: fontColor || '#1e3a8a',
                    bold: true,
                    italic: false,
                    uppercase: true,
                    align: 'left'
                  }, {}, design.fontSubSection)}
                >
                  {data.submittedByLabel || 'SUBMITTED BY:'}
                </h4>
                <table 
                  className="w-full text-left"
                  style={resolveStyle(design.fontSubmittedByContent, {
                    fontFamily: fontFamily || '"Times New Roman", Times, serif',
                    fontSize: 11.5,
                    color: fontColor || '#000000',
                    bold: false,
                    italic: false,
                    uppercase: false,
                    align: 'left'
                  }, {}, design.fontSubSection)}
                >
                  <tbody>
                    <tr className="text-left">
                      <td className="pr-2 py-1 w-2/5 text-left" style={{ fontWeight: (design.fontSubmittedByContent?.bold !== undefined ? design.fontSubmittedByContent.bold : false) ? 'bold' : 'normal' }}>Name</td>
                      <td className="py-1 w-[5%] px-1 text-left">:</td>
                      <td className="py-1 text-left inline-block" style={{ fontWeight: (design.fontSubmittedByContent?.bold !== undefined ? design.fontSubmittedByContent.bold : false) ? 'bold' : 'normal' }}>{data.studentName}</td>
                    </tr>
                    <tr className="text-left">
                      <td className="pr-2 py-1 text-left" style={{ fontWeight: (design.fontSubmittedByContent?.bold !== undefined ? design.fontSubmittedByContent.bold : false) ? 'bold' : 'normal' }}>Student ID</td>
                      <td className="py-1 px-1 text-left">:</td>
                      <td className="py-1 text-left">{data.studentId}</td>
                    </tr>
                    {data.studentRoll && (
                      <tr className="text-left">
                        <td className="pr-2 py-1 text-left" style={{ fontWeight: (design.fontSubmittedByContent?.bold !== undefined ? design.fontSubmittedByContent.bold : false) ? 'bold' : 'normal' }}>Roll No</td>
                        <td className="py-1 px-1 text-left">:</td>
                        <td className="py-1 text-left">{data.studentRoll}</td>
                      </tr>
                    )}
                    <tr className="text-left">
                      <td className="pr-2 py-1 text-left" style={{ fontWeight: (design.fontSubmittedByContent?.bold !== undefined ? design.fontSubmittedByContent.bold : false) ? 'bold' : 'normal' }}>Department</td>
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
          <DraggableBlock elementId="submissionDate" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 w-full text-center">
            <div className="flex items-center space-x-3 select-none text-left justify-center w-full">
              <span 
                className="font-bold uppercase tracking-wider block"
                style={resolveStyle(design.fontSubmissionDateHeading, {
                  fontFamily: fontFamily || '"Times New Roman", Times, serif',
                  fontSize: 11,
                  color: fontColor || '#475569',
                  bold: true,
                  italic: false,
                  uppercase: true,
                  align: 'right'
                })}
              >
                Date of Submission :
              </span>
              
              <div 
                className="flex items-center space-x-1.5 font-sans font-extrabold text-[12px]"
                style={resolveStyle(design.fontSubmissionDateContent, {
                  fontFamily: '"Times New Roman", Times, serif',
                  fontSize: 12,
                  color: '#000000',
                  bold: true,
                  italic: false,
                  uppercase: false,
                  align: 'left'
                }, { display: 'flex', alignItems: 'center' })}
              >
                {(() => {
                  const dateObj = new Date(data.submissionDate);
                  const day = String(dateObj.getDate() || 27).padStart(2, '0');
                  const month = String(dateObj.getMonth() + 1 || 5).padStart(2, '0');
                  const year = String(dateObj.getFullYear() || 2026);
                  return (
                    <>
                      <span className="border border-black px-2 py-0.5 rounded-[1px] bg-white text-black shadow-sm" style={{ fontWeight: 'bold' }}>{day}</span>
                      <span className="text-slate-500 font-bold">-</span>
                      <span className="border border-black px-2 py-0.5 rounded-[1px] bg-white text-black shadow-sm" style={{ fontWeight: 'bold' }}>{month}</span>
                      <span className="text-slate-500 font-bold">-</span>
                      <span className="border border-black px-2 py-0.5 rounded-[1px] bg-white text-black shadow-sm" style={{ fontWeight: 'bold' }}>{year}</span>
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
          
          <DraggableBlock elementId="universityHeader" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 w-full text-center">
            <div className="flex flex-col items-center space-y-1 text-center w-full">
              <span 
                className="text-center block w-full font-bold"
                style={resolveStyle(design.fontUniversity, {
                  fontFamily: fontFamily || 'Georgia, serif',
                  fontSize: 16,
                  color: fontColor || '#000000',
                  bold: true,
                  italic: false,
                  uppercase: true,
                  align: 'center'
                })}
              >
                {data.universityName || data.teacherUniversity || 'UNIVERSITY OF DHAKA'}
              </span>
              {data.departmentName && (
                <span 
                  className="tracking-wider uppercase text-center block font-semibold"
                  style={resolveStyle(design.fontDiscipline || design.fontSubSection, {
                    fontFamily: fontFamily || 'Georgia, serif',
                    fontSize: 10.5,
                    color: fontColor || '#000000',
                    bold: true,
                    italic: false,
                    uppercase: true,
                    align: 'center'
                  }, { opacity: 0.85 })}
                >
                  {data.departmentName}
                </span>
              )}
            </div>
          </DraggableBlock>
        </div>

        {/* Upper Middle Section: Centered text block */}
        <div className="flex flex-col items-center justify-center text-center my-4 w-full px-10">
          <DraggableBlock elementId="documentType" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 text-center w-full">
            <div 
              className="mb-1 text-center font-medium block w-full"
              style={resolveStyle(design.fontAssignmentTopic, {
                fontFamily: fontFamily || 'Georgia, serif',
                fontSize: 13,
                color: fontColor || '#000000',
                bold: false,
                italic: false,
                uppercase: false,
                align: 'center'
              })}
            >
              Assignment Topic: <span style={{ fontWeight: 'semibold' }}>{data.documentType || 'Writing a Research Proposal'}</span>
            </div>
          </DraggableBlock>

          <DraggableBlock elementId="topicTitle" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 text-center w-full">
            <div className="flex flex-col items-center justify-center w-full mt-2">
              <div 
                className="font-bold mb-1 uppercase tracking-wide text-center block w-full"
                style={resolveStyle(design.fontTopicTitle, {
                  fontFamily: fontFamily || 'Georgia, serif',
                  fontSize: 12,
                  color: fontColor || '#000000',
                  bold: true,
                  italic: false,
                  uppercase: true,
                  align: 'center'
                })}
              >
                Title of the Research Proposal:
              </div>
              <h1 
                className="text-center max-w-[90%] font-semibold leading-relaxed py-1.5 whitespace-pre-line block mx-auto w-full"
                style={resolveStyle(design.fontTopicTitle, {
                  fontFamily: fontFamily || 'Georgia, serif',
                  fontSize: 18,
                  color: fontColor || '#000000',
                  bold: true,
                  italic: false,
                  uppercase: false,
                  align: 'center'
                })}
              >
                {data.topicTitle || 'Social Discrimination against religious minorities:\nA cross-sectional survey on the Hindus in Uzirpur, Barisal'}
              </h1>
            </div>
          </DraggableBlock>

          <DraggableBlock elementId="courseTitle" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 mt-2 text-center w-full">
            <div 
              className="text-center block w-full"
              style={resolveStyle(design.fontCourse, {
                fontFamily: fontFamily || 'Georgia, serif',
                fontSize: 13,
                color: fontColor || '#000000',
                bold: false,
                italic: false,
                uppercase: false,
                align: 'center'
              })}
            >
              Course Name: <span style={{ fontWeight: 'semibold' }}>{data.courseName || 'Research Methodology'}</span> Course No: <span style={{ fontWeight: 'semibold' }}>{data.courseNo || '351'}</span>
            </div>
          </DraggableBlock>
        </div>

        {/* The Asymmetrical Staggered Section */}
        <div className="w-full px-12 md:px-14 my-4">
          <DraggableBlock elementId="submissionsBlock" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 w-full">
            <div className="flex flex-col w-full relative">
              {/* Submitted to (Teacher block) - left-aligned, higher up */}
              <div className="w-[58%] text-left self-start flex flex-col space-y-[3px]">
                <div 
                  className="font-bold underline mb-1 block text-left"
                  style={resolveStyle(design.fontSubmittedToHeading, {
                    fontFamily: fontFamily || 'Georgia, serif',
                    fontSize: 12.5,
                    color: fontColor || '#000000',
                    bold: true,
                    italic: false,
                    uppercase: false,
                    align: 'left'
                  }, {}, design.fontSubSection)}
                >
                  Submitted to:
                </div>
                {data.teacherDetails ? (
                  <div 
                    className="whitespace-pre-line leading-relaxed text-left"
                    style={resolveStyle(design.fontSubmittedToContent, {
                      fontFamily: fontFamily || 'Georgia, serif',
                      fontSize: 11,
                      color: fontColor || '#000000',
                      bold: false,
                      italic: false,
                      uppercase: false,
                      align: 'left'
                    }, {}, design.fontSubSection)}
                  >
                    {data.teacherDetails}
                  </div>
                ) : (
                  <div 
                    className="leading-relaxed flex flex-col space-y-[2px] text-left"
                    style={resolveStyle(design.fontSubmittedToContent, {
                      fontFamily: fontFamily || 'Georgia, serif',
                      fontSize: 11,
                      color: fontColor || '#000000',
                      bold: false,
                      italic: false,
                      uppercase: false,
                      align: 'left'
                    }, {}, design.fontSubSection)}
                  >
                    <div style={{ fontWeight: (design.fontSubmittedToContent?.bold !== undefined ? design.fontSubmittedToContent.bold : true) ? 'semibold' : 'normal' }}>{data.teacherName || 'Dr. Abul Kashem Mohammad Jamal Uddin'}</div>
                    <div className="opacity-80">{data.teacherDesignation || 'Professor'}</div>
                    <div className="opacity-80">{data.teacherDiscipline || 'Department of Sociology'}</div>
                    {data.studentUniversity && <div className="opacity-80">{data.studentUniversity || 'University of Dhaka'}</div>}
                  </div>
                )}
              </div>

              {/* Submitted by (Student block) - right-aligned, pushed downwards with significant margin */}
              <div className="w-[58%] text-right self-end flex flex-col space-y-[3px] mt-16 md:mt-20">
                <div 
                  className="font-bold underline mb-1 block text-right w-full"
                  style={resolveStyle(design.fontSubmittedByHeading, {
                    fontFamily: fontFamily || 'Georgia, serif',
                    fontSize: 12.5,
                    color: fontColor || '#000000',
                    bold: true,
                    italic: false,
                    uppercase: false,
                    align: 'right'
                  }, {}, design.fontSubSection)}
                >
                  Submitted by:
                </div>
                {data.studentDetails ? (
                  <div 
                    className="whitespace-pre-line leading-relaxed text-right w-full"
                    style={resolveStyle(design.fontSubmittedByContent, {
                      fontFamily: fontFamily || 'Georgia, serif',
                      fontSize: 11,
                      color: fontColor || '#000000',
                      bold: false,
                      italic: false,
                      uppercase: false,
                      align: 'right'
                    }, {}, design.fontSubSection)}
                  >
                    {data.studentDetails}
                  </div>
                ) : (
                  <div 
                    className="leading-relaxed flex flex-col space-y-[2px] text-right items-end w-full"
                    style={resolveStyle(design.fontSubmittedByContent, {
                      fontFamily: fontFamily || 'Georgia, serif',
                      fontSize: 11,
                      color: fontColor || '#000000',
                      bold: false,
                      italic: false,
                      uppercase: false,
                      align: 'right'
                    }, {}, design.fontSubSection)}
                  >
                    <div style={{ fontWeight: (design.fontSubmittedByContent?.bold !== undefined ? design.fontSubmittedByContent.bold : true) ? 'semibold' : 'normal' }}>{data.studentName || 'Tahmid Ul Islam'}</div>
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
        <div className="mt-6 mb-2 select-none w-full text-center">
          <DraggableBlock elementId="submissionDate" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 w-full text-center">
            <div 
              className="text-center block w-full"
              style={resolveStyle(design.fontSubmissionDateHeading, {
                fontFamily: fontFamily || 'Georgia, serif',
                fontSize: 11.5,
                color: fontColor || '#111827',
                bold: false,
                italic: true,
                uppercase: false,
                align: 'center'
              })}
            >
              Date of Submission: <span style={resolveStyle(design.fontSubmissionDateContent, {
                fontFamily: fontFamily || 'Georgia, serif',
                fontSize: 11.5,
                color: fontColor || '#111827',
                bold: true,
                italic: false,
                uppercase: false,
                align: 'center'
              }, { display: 'inline' })}>{formatDate(data.submissionDate)}</span>
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
          <DraggableBlock elementId="universityHeader" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 w-full px-4 text-center">
            <div className="flex flex-col items-center space-y-1 text-center w-full">
              <span 
                className="text-center block w-full font-bold"
                style={resolveStyle(design.fontUniversity, {
                  fontFamily: fontFamily || '"Times New Roman", Times, serif',
                  fontSize: 19,
                  color: fontColor || '#8b0000',
                  bold: true,
                  italic: false,
                  uppercase: false,
                  align: 'center'
                })}
              >
                {data.universityName || data.teacherUniversity || 'Jagannath University'}
              </span>
              <span 
                className="text-center block w-full font-bold"
                style={resolveStyle(design.fontDiscipline || design.fontSubSection, {
                  fontFamily: fontFamily || '"Times New Roman", Times, serif',
                  fontSize: 12,
                  color: fontColor || '#1e3a8a',
                  bold: true,
                  italic: false,
                  uppercase: false,
                  align: 'center'
                })}
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
              className="mb-1 text-center block w-full font-bold"
              style={resolveStyle(design.fontAssignmentTopic, {
                fontFamily: fontFamily || '"Times New Roman", Times, serif',
                fontSize: 12.5,
                color: fontColor || '#2563eb',
                bold: true,
                italic: false,
                uppercase: false,
                align: 'center'
              })}
            >
              {data.documentType || 'Assignment On'}
            </div>
          </DraggableBlock>

          <DraggableBlock elementId="topicTitle" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 text-center w-full my-2">
            <div className="flex flex-col items-center justify-center w-full">
              <h1 
                className="text-center max-w-[95%] font-bold leading-relaxed whitespace-pre-line block mx-auto py-0.5 w-full"
                style={resolveStyle(design.fontTopicTitle, {
                  fontFamily: fontFamily || '"Times New Roman", Times, serif',
                  fontSize: 18,
                  color: fontColor || '#070b19',
                  bold: true,
                  italic: false,
                  uppercase: false,
                  align: 'center'
                })}
              >
                {data.topicTitle || 'Software Development'}
              </h1>
            </div>
          </DraggableBlock>

          <DraggableBlock elementId="courseTitle" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 mt-1 text-center flex flex-col space-y-1.5 w-full">
            <div 
              className="text-center w-full block font-semibold"
              style={resolveStyle(design.fontCourse, {
                fontFamily: fontFamily || '"Times New Roman", Times, serif',
                fontSize: 13,
                color: fontColor || '#111827',
                bold: true,
                italic: false,
                uppercase: false,
                align: 'center'
              })}
            >
              <span className="opacity-80" style={{ fontWeight: 'normal' }}>{data.courseNameHeading || 'Course Title:'}</span> <span style={{ fontWeight: 'bold' }}>{data.courseName || 'Energy Sources'}</span>
            </div>
            {data.courseNo && (
              <div 
                className="text-center w-full block font-semibold"
                style={resolveStyle(design.fontCourse, {
                  fontFamily: fontFamily || '"Times New Roman", Times, serif',
                  fontSize: 13,
                  color: fontColor || '#111827',
                  bold: true,
                  italic: false,
                  uppercase: false,
                  align: 'center'
                })}
              >
                <span className="opacity-80" style={{ fontWeight: 'normal' }}>{data.courseNoHeading || 'Course Code:'}</span> <span style={{ fontWeight: 'bold' }}>{data.courseNo || 'PHY403'}</span>
              </div>
            )}
          </DraggableBlock>
        </div>

        {/* Item 4: The Asymmetrical Staggered Section */}
        <div className="w-full px-12 md:px-14 my-3">
          <DraggableBlock elementId="submissionsBlock" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 w-full">
            <div className="flex flex-col w-full relative">
              
              {/* "Submitted To" Block (Left): Aligned text-left */}
              <div className="w-[52%] text-left self-start flex flex-col space-y-1">
                <div 
                  className="font-bold underline mb-1 block text-left"
                  style={resolveStyle(design.fontSubmittedToHeading, {
                    fontFamily: fontFamily || '"Times New Roman", Times, serif',
                    fontSize: 12.5,
                    color: fontColor || '#8b0000',
                    bold: true,
                    italic: false,
                    uppercase: false,
                    align: 'left'
                  }, {}, design.fontSubSection)}
                >
                  Submitted To:
                </div>
                {data.teacherDetails ? (
                  <div 
                    className="whitespace-pre-line leading-relaxed text-left"
                    style={resolveStyle(design.fontSubmittedToContent, {
                      fontFamily: fontFamily || '"Times New Roman", Times, serif',
                      fontSize: 11.5,
                      color: fontColor || '#000000',
                      bold: false,
                      italic: false,
                      uppercase: false,
                      align: 'left'
                    }, {}, design.fontSubSection)}
                  >
                    {data.teacherDetails}
                  </div>
                ) : (
                  <div 
                    className="leading-relaxed flex flex-col space-y-[2px] text-left w-full"
                    style={resolveStyle(design.fontSubmittedToContent, {
                      fontFamily: fontFamily || '"Times New Roman", Times, serif',
                      fontSize: 11.5,
                      color: fontColor || '#000000',
                      bold: false,
                      italic: false,
                      uppercase: false,
                      align: 'left'
                    }, {}, design.fontSubSection)}
                  >
                    <div style={{ fontWeight: (design.fontSubmittedToContent?.bold !== undefined ? design.fontSubmittedToContent.bold : true) ? 'bold' : 'normal' }}>{data.teacherName || 'Arpon Chakraborty'}</div>
                    <div className="opacity-90">{data.teacherDesignation || 'Assistant Professor'}</div>
                    <div className="opacity-90">{data.teacherDiscipline || 'Department of Physics'}</div>
                    <div className="opacity-90">{data.teacherUniversity || 'Jagannath University, Dhaka'}</div>
                  </div>
                )}
              </div>

              {/* "Submitted By" Block (Right): Pushed right ml-auto, mt-14, text-left internally */}
              <div className="w-[52%] ml-auto text-left self-end flex flex-col items-start space-y-1 mt-14 md:mt-16">
                <div 
                  className="font-bold underline mb-1 block text-left w-full"
                  style={resolveStyle(design.fontSubmittedByHeading, {
                    fontFamily: fontFamily || '"Times New Roman", Times, serif',
                    fontSize: 12.5,
                    color: fontColor || '#8b0000',
                    bold: true,
                    italic: false,
                    uppercase: false,
                    align: 'left'
                  }, {}, design.fontSubSection)}
                >
                  Submitted By:
                </div>
                {data.studentDetails ? (
                  <div 
                    className="whitespace-pre-line leading-relaxed text-left w-full"
                    style={resolveStyle(design.fontSubmittedByContent, {
                      fontFamily: fontFamily || '"Times New Roman", Times, serif',
                      fontSize: 11.5,
                      color: fontColor || '#000000',
                      bold: false,
                      italic: false,
                      uppercase: false,
                      align: 'left'
                    }, {}, design.fontSubSection)}
                  >
                    {data.studentDetails}
                  </div>
                ) : (
                  <div 
                    className="leading-relaxed flex flex-col space-y-[2px] text-left items-start w-full"
                    style={resolveStyle(design.fontSubmittedByContent, {
                      fontFamily: fontFamily || '"Times New Roman", Times, serif',
                      fontSize: 11.5,
                      color: fontColor || '#000000',
                      bold: false,
                      italic: false,
                      uppercase: false,
                      align: 'left'
                    }, {}, design.fontSubSection)}
                  >
                    <div style={{ fontWeight: (design.fontSubmittedByContent?.bold !== undefined ? design.fontSubmittedByContent.bold : true) ? 'bold' : 'normal' }}>{data.studentName || 'Md Abdul Basir'}</div>
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
        <div className="mt-6 mb-2 select-none w-full text-center">
          <DraggableBlock elementId="submissionDate" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 w-full text-center">
            <div 
              className="text-center block w-full font-semibold"
              style={resolveStyle(design.fontSubmissionDateHeading, {
                fontFamily: fontFamily || '"Times New Roman", Times, serif',
                fontSize: 12,
                color: fontColor || '#0f172a',
                bold: true,
                italic: false,
                uppercase: false,
                align: 'center'
              })}
            >
              Date of Submission: <span style={resolveStyle(design.fontSubmissionDateContent, {
                fontFamily: fontFamily || '"Times New Roman", Times, serif',
                fontSize: 12,
                color: fontColor || '#0f172a',
                bold: true,
                italic: false,
                uppercase: false,
                align: 'center'
              }, { display: 'inline' })}>{formatDate(data.submissionDate)}</span>
            </div>
          </DraggableBlock>
        </div>
      </div>
    );
  }

  return null;
};
