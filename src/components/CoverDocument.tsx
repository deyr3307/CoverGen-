import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CoverPageData, CoverPageDesign, STANDARD_FONTS, getDirectStyle } from '../types';
import { LOGO_PRESETS, WATERMARK_PRESETS } from '../presets';
import QRCode from 'qrcode';
import { NewTemplatesRenderer } from './NewTemplatesRenderer';

interface CoverDocumentProps {
  data: CoverPageData;
  design: CoverPageDesign;
  zoom?: number; // scale percent e.g., 70, 100
  innerRef?: React.RefObject<HTMLDivElement | null>;
  onChangeDesign?: (design: CoverPageDesign) => void;
  fontFamily?: string;
  fontColor?: string;
  baseFontSize?: number;
  pageBackgroundColor?: string;
}

export interface DraggableBlockProps {
  elementId: string;
  design: CoverPageDesign;
  onChangeDesign?: (design: CoverPageDesign) => void;
  zoom: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export const DraggableBlock: React.FC<DraggableBlockProps> = ({
  elementId,
  design,
  onChangeDesign,
  zoom,
  className = '',
  style = {},
  children
}) => {
  const positions = design.positions || {};
  const pos = positions[elementId] || { x: 0, y: 0 };
  const [isDragging, setIsDragging] = React.useState(false);
  const startRef = React.useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.tagName === 'INPUT' || target.closest('.no-drag')) {
      return;
    }
    e.preventDefault();
    setIsDragging(true);
    startRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: pos.x,
      posY: pos.y
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const zoomFactor = zoom / 100 || 1.0;
      const dx = Math.round((moveEvent.clientX - startRef.current.mouseX) / zoomFactor);
      const dy = Math.round((moveEvent.clientY - startRef.current.mouseY) / zoomFactor);
      
      if (onChangeDesign) {
        onChangeDesign({
          ...design,
          positions: {
            ...(design.positions || {}),
            [elementId]: {
              x: startRef.current.posX + dx,
              y: startRef.current.posY + dy
            }
          }
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.tagName === 'INPUT' || target.closest('.no-drag')) {
      return;
    }
    const touch = e.touches[0];
    setIsDragging(true);
    startRef.current = {
      mouseX: touch.clientX,
      mouseY: touch.clientY,
      posX: pos.x,
      posY: pos.y
    };

    const handleTouchMove = (moveEvent: TouchEvent) => {
      if (moveEvent.touches.length === 0) return;
      const touchMove = moveEvent.touches[0];
      const zoomFactor = zoom / 100 || 1.0;
      const dx = Math.round((touchMove.clientX - startRef.current.mouseX) / zoomFactor);
      const dy = Math.round((touchMove.clientY - startRef.current.mouseY) / zoomFactor);

      if (onChangeDesign) {
        onChangeDesign({
          ...design,
          positions: {
            ...(design.positions || {}),
            [elementId]: {
              x: startRef.current.posX + dx,
              y: startRef.current.posY + dy
            }
          }
        });
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChangeDesign) {
      onChangeDesign({
        ...design,
        positions: {
          ...(design.positions || {}),
          [elementId]: { x: 0, y: 0 }
        }
      });
    }
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onDoubleClick={handleDoubleClick}
      className={`group/drag relative transition-shadow duration-150 select-none ${
        isDragging ? 'cursor-grabbing select-none shadow-md ring-1 ring-indigo-500/20' : 'cursor-grab hover:shadow-xs'
      } ${className}`}
      style={{
        ...style,
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: isDragging ? 'none' : 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.15s ease',
      }}
      title="Drag to reposition | Double click to reset"
    >
      <div className={`absolute -inset-1.5 rounded-lg border-2 border-dashed border-indigo-500/0 group-hover/drag:border-indigo-500/30 pointer-events-none transition-colors duration-200 ${
        isDragging ? '!border-indigo-500/60 z-20' : ''
      }`}>
        <span className="absolute -top-4.5 left-1 bg-indigo-600 text-white rounded text-[8px] font-mono font-bold px-1 py-0.5 opacity-0 group-hover/drag:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-sm">
          ↕ Move Block ({pos.x}, {pos.y})
        </span>
      </div>
      {children}
    </div>
  );
};

export const CoverDocument: React.FC<CoverDocumentProps> = ({
  data,
  design,
  zoom = 100,
  innerRef,
  onChangeDesign,
  fontFamily,
  fontColor,
  baseFontSize,
  pageBackgroundColor
}) => {
  // Find current presets if any
  const logoPreset = LOGO_PRESETS.find(p => p.id === design.logoUrl);
  const watermarkPreset = WATERMARK_PRESETS.find(p => p.id === design.watermarkUrl) || LOGO_PRESETS.find(p => p.id === design.watermarkUrl);

  // Parse custom colors or fallback
  const accentColor = design.accentColor || '#1e3a8a';
  const borderColor = design.borderColor || '#334155';

  // QR Code generator state and side effect
  const [qrCodeDataUrl, setQrCodeDataUrl] = React.useState<string>('');

  // Animation track for QR code update highlight
  const [isQrUpdated, setIsQrUpdated] = React.useState<boolean>(false);
  const prevQrUrlRef = React.useRef<string>(design.qrCodeUrl || '');

  React.useEffect(() => {
    if (design.qrCodeUrl && design.qrCodeUrl !== prevQrUrlRef.current) {
      setIsQrUpdated(true);
      const timer = setTimeout(() => {
        setIsQrUpdated(false);
      }, 1000); // 1s highlight pulse & ripple expansion
      prevQrUrlRef.current = design.qrCodeUrl;
      return () => clearTimeout(timer);
    }
    prevQrUrlRef.current = design.qrCodeUrl || '';
  }, [design.qrCodeUrl]);

  React.useEffect(() => {
    if (design.showQrCode && design.qrCodeUrl) {
      QRCode.toDataURL(
        design.qrCodeUrl,
        {
          margin: 1,
          width: 256,
          color: {
            dark: design.accentColor || '#0284c7', // Match the custom cover accent color!
            light: '#ffffff'
          }
        },
        (err, url) => {
          if (!err && url) {
            setQrCodeDataUrl(url);
          } else if (err) {
            console.error('QR code generation error:', err);
          }
        }
      );
    }
  }, [design.showQrCode, design.qrCodeUrl, design.accentColor]);

  // QR coordinate positioning calculations inside standard academic layouts
  const getQrPositionStyles = (pos: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left'): React.CSSProperties => {
    const margin = '38px'; // safe margins to keep the tag perfectly positioned inside printable zones
    switch (pos) {
      case 'top-left':
        return { top: margin, left: margin };
      case 'top-right':
        return { top: margin, right: margin };
      case 'bottom-left':
        return { bottom: margin, left: margin };
      case 'bottom-right':
      default:
        return { bottom: margin, right: margin };
    }
  };

  // Format date nicely
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // helper for text alignment classes
  const getAlignClasses = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'left':
        return {
          container: 'items-start text-left',
          text: 'text-left'
        };
      case 'right':
        return {
          container: 'items-end text-right',
          text: 'text-right'
        };
      case 'center':
      default:
        return {
          container: 'items-center text-center',
          text: 'text-center'
        };
    }
  };

  // Border helper style
  const getBorderStyles = (): React.CSSProperties => {
    const width = design.borderWidth !== undefined ? design.borderWidth : 6;
    switch (design.borderStyle) {
      case 'none':
        return { borderStyle: 'none' };
      case 'single':
        return { 
          borderStyle: 'solid', 
          borderWidth: `${width}px`,
          borderColor: borderColor
        };
      case 'double':
        return { 
          borderStyle: 'double', 
          borderWidth: `${width}px`,
          borderColor: borderColor
        };
      case 'classic':
        return { 
          borderStyle: 'solid', 
          borderWidth: `${width}px`,
          borderColor: borderColor,
          outline: `1px solid ${borderColor}`,
          outlineOffset: `-${Math.max(4, width + 4)}px`
        };
      case 'modern':
        return { 
          borderStyle: 'solid', 
          borderTopWidth: `${width}px`, 
          borderBottomWidth: `${width}px`, 
          borderLeftWidth: `${Math.max(1, Math.round(width * 0.25))}px`, 
          borderRightWidth: `${Math.max(1, Math.round(width * 0.25))}px`,
          borderColor: borderColor
        };
      default:
        return {};
    }
  };

  // Standard paper structure: A4 aspect ratio 1:1.414 (e.g. 794px width by 1123px height)
  // To allow crisp PDF exports, we render the original canvas at 794px x 1123px.
  // We use CSS scale to fit it inside the preview interface smoothly.
  return (
    <motion.div 
      className="relative mx-auto"
      animate={{
        width: `${794 * (zoom / 100)}px`,
        height: `${1123 * (zoom / 100)}px`,
      }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <AnimatePresence mode="popLayout">
        <motion.div 
          key={`${design.templateId}`}
          className="relative overflow-hidden shadow-2xl bg-white"
          initial={{ opacity: 0, x: 24, scale: 0.98 }}
          animate={{ 
            opacity: 1, 
            x: 0,
            backgroundColor: pageBackgroundColor || design.paperColor || '#ffffff',
            scale: zoom / 100,
          }}
          exit={{ opacity: 0, x: -24, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
          width: '794px',
          height: '1123px',
          transformOrigin: 'top left',
          fontFeatureSettings: '"kern" 1, "liga" 1',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
      <motion.div 
        ref={innerRef}
        id="academic-cover-page"
        className="w-full h-full relative p-[50px] flex flex-col justify-between select-none"
        animate={{
          backgroundColor: pageBackgroundColor || design.paperColor || '#ffffff',
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          boxSizing: 'border-box',
          fontFamily: fontFamily || undefined,
          color: fontColor || undefined,
          fontSize: baseFontSize ? `${baseFontSize}px` : undefined,
        }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          #academic-cover-page h1, 
          #academic-cover-page h2, 
          #academic-cover-page h3, 
          #academic-cover-page h4, 
          #academic-cover-page span, 
          #academic-cover-page p,
          #academic-cover-page div:not(.watermark-animate) {
            transition: color 0.4s ease-in-out, font-size 0.3s ease-out, font-family 0.4s ease-in-out, background-color 0.4s ease-in-out, border-color 0.4s ease-in-out, opacity 0.4s ease-in-out, margin 0.4s ease-in-out, padding 0.4s ease-in-out;
          }
          @keyframes watermark-smooth-pan {
            0% { transform: translate(0px, 0px) rotate(0deg) scale(${design.watermarkScale / 100}); }
            33% { transform: translate(15px, -10px) rotate(1.5deg) scale(${design.watermarkScale / 100}); }
            66% { transform: translate(-12px, 14px) rotate(-1.5deg) scale(${design.watermarkScale / 100}); }
            100% { transform: translate(0px, 0px) rotate(0deg) scale(${design.watermarkScale / 100}); }
          }
          @keyframes qr-ripple {
            0% {
              transform: scale(0.9);
              opacity: 0.85;
            }
            100% {
              transform: scale(2.4);
              opacity: 0;
            }
          }
        `}} />
        {/* Border Layer */}
        {design.borderStyle !== 'none' && (
          <div 
            className="absolute inset-[24px] pointer-events-none rounded-sm transition-all duration-200"
            style={getBorderStyles()}
          />
        )}

        {/* Decorative Modern Accent Corner Marks if style is 'modern' */}
        {design.borderStyle === 'modern' && (
          <>
            <div className="absolute top-[32px] left-[32px] w-8 h-8 border-t-[3px] border-l-[3px] pointer-events-none" style={{ borderColor: accentColor }} />
            <div className="absolute top-[32px] right-[32px] w-8 h-8 border-t-[3px] border-r-[3px] pointer-events-none" style={{ borderColor: accentColor }} />
            <div className="absolute bottom-[32px] left-[32px] w-8 h-8 border-b-[3px] border-l-[3px] pointer-events-none" style={{ borderColor: accentColor }} />
            <div className="absolute bottom-[32px] right-[32px] w-8 h-8 border-b-[3px] border-r-[3px] pointer-events-none" style={{ borderColor: accentColor }} />
          </>
        )}

        {/* Header line if enabled */}
        {design.hasHeaderLine && (
          <div className="absolute top-[35px] left-[50px] right-[50px] h-[1px]" style={{ backgroundColor: borderColor }} />
        )}

        {/* Background Watermark */}
        {design.watermarkUrl && design.watermarkUrl !== 'wm-none' && (
          <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            style={{ 
              transform: `translate(${design.watermarkXOffset || 0}px, ${design.watermarkYOffset || 0}px)`
            }}
          >
            <div
              className={`flex items-center justify-center ${design.watermarkAnimate ? 'watermark-animate' : ''}`}
              style={{
                opacity: design.watermarkOpacity,
                animation: design.watermarkAnimate ? 'watermark-smooth-pan 15s ease-in-out infinite' : 'none',
                transform: design.watermarkAnimate ? undefined : `scale(${design.watermarkScale / 100})`
              }}
            >
              {watermarkPreset ? (
                <svg 
                  className="w-[450px] h-[450px]"
                  viewBox={watermarkPreset.viewBox || '0 0 100 100'}
                  dangerouslySetInnerHTML={{ __html: watermarkPreset.svgPath }}
                  style={{ color: accentColor }}
                />
              ) : (
                // Custom watermark
                <img 
                  src={design.watermarkUrl} 
                  alt="Watermark" 
                  className="max-w-[450px] max-h-[450px] object-contain"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
          </div>
        )}

        {/* ===================== LAYOUT ROUTER BASED ON TEMPLATE ID ===================== */}
        {['ku-law-table', 'cu-boxed-code', 'asymmetrical-research', 'top-header-asymmetric'].includes(design.templateId) ? (
          <NewTemplatesRenderer
            id={design.templateId}
            data={data}
            design={design}
            zoom={zoom}
            onChangeDesign={onChangeDesign}
            formatDate={formatDate}
            fontFamily={fontFamily}
            fontColor={fontColor}
            baseFontSize={baseFontSize}
          />
        ) : design.templateId === 'presidency' ? (
          /* ==================== TEMPLATE presidency-classic (Presidency University Style) ==================== */
          <div className="flex flex-col flex-1 justify-between items-center w-full relative z-10 py-2">
            
            {/* Header: University Name inside rounded border banner */}
            <div className="flex flex-col items-center justify-center text-center mt-3 w-full">
              <DraggableBlock elementId="universityHeader" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
                <div 
                  className="border-[2px] rounded-xl px-12 py-2 text-center select-none"
                  style={{
                    fontFamily: design.fontUniversity?.fontFamily || design.fontTitle?.fontFamily || fontFamily || 'Georgia, serif',
                    fontSize: `${(design.fontUniversity?.fontSize || design.fontTitle?.fontSize || 16) / 14}em`,
                    color: design.fontUniversity?.color || design.fontTitle?.color || fontColor || '#1e3a8a',
                    borderColor: design.fontUniversity?.color || design.fontTitle?.color || fontColor || '#1e3a8a',
                    fontWeight: design.fontUniversity?.bold !== undefined ? (design.fontUniversity.bold ? 'bold' : 'normal') : (design.fontTitle?.bold !== false ? 'bold' : 'normal'),
                    fontStyle: design.fontUniversity?.italic ? 'italic' : (design.fontTitle?.italic ? 'italic' : 'normal'),
                    textTransform: (design.fontUniversity?.uppercase !== undefined ? design.fontUniversity.uppercase : true) ? 'uppercase' : 'none',
                    boxShadow: '0 2px 8px rgba(30, 58, 138, 0.05)'
                  }}
                >
                  {data.universityName || data.teacherUniversity || 'Presidency University'}
                </div>
              </DraggableBlock>
            </div>

            {/* Logo */}
            <DraggableBlock elementId="logo" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
              <div className="flex justify-center items-center my-2">
                {design.logoUrl ? (
                  logoPreset ? (
                    <div style={{ height: `${design.logoHeight}px`, width: `${design.logoHeight}px`, color: design.fontTitle?.color || fontColor || '#b91c1c' }} className="flex items-center justify-center">
                      <svg className="w-full h-full" viewBox={logoPreset.viewBox} dangerouslySetInnerHTML={{ __html: logoPreset.svgPath }} />
                    </div>
                  ) : (
                    <img src={design.logoUrl} style={{ width: `${design.logoHeight}px`, height: 'auto' }} className="object-contain max-w-[240px]" alt="University Logo" referrerPolicy="no-referrer" />
                  )
                ) : <div className="h-6" />}
              </div>
            </DraggableBlock>

            {/* Document Type Centered Label (e.g. Assignment) */}
            <DraggableBlock elementId="documentType" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
              <h3 
                style={{
                  fontFamily: design.fontAssignmentTopic?.fontFamily || fontFamily || 'Georgia, serif',
                  fontSize: `${(design.fontAssignmentTopic?.fontSize || 26) / 14}em`,
                  color: design.fontAssignmentTopic?.color || fontColor || '#1e3a8a',
                  fontWeight: design.fontAssignmentTopic?.bold !== false ? 'bold' : 'normal',
                  fontStyle: design.fontAssignmentTopic?.italic ? 'italic' : 'normal',
                  textTransform: design.fontAssignmentTopic?.uppercase !== false ? 'capitalize' : 'none',
                }}
                className="tracking-wide text-center underline decoration-2 underline-offset-8"
              >
                {data.documentType || 'Assignment'}
              </h3>
            </DraggableBlock>

            {/* Course Details Block nested with bullets */}
            <DraggableBlock elementId="courseDetails" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 w-full px-12">
              <div className="space-y-3.5 w-[90%] mx-auto bg-slate-50/50 dark:bg-slate-900/10 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
                {/* Course Title */}
                <div className="flex items-start text-left">
                  <span className="mr-2.5 mt-[2px] leading-none" style={{ color: design.accentColor || '#f97316' }}>✦</span>
                  <span 
                    className="shrink-0 w-[140px] font-bold"
                    style={{
                      fontFamily: design.fontCourseTitleHeading?.fontFamily || fontFamily || 'Georgia, serif',
                      fontSize: `${(design.fontCourseTitleHeading?.fontSize || 12) / 14}em`,
                      color: design.fontCourseTitleHeading?.color || fontColor || '#1e3a8a'
                    }}
                  >
                    {data.courseNameHeading || 'Course Title'} :
                  </span>
                  <span 
                    className="font-bold"
                    style={{
                      fontFamily: design.fontCourseTitleContent?.fontFamily || fontFamily || 'Georgia, serif',
                      fontSize: `${(design.fontCourseTitleContent?.fontSize || 12) / 14}em`,
                      color: design.fontCourseTitleContent?.color || fontColor || undefined
                    }}
                  >
                    {data.courseName || 'Bangladesh Studies'}
                  </span>
                </div>

                {/* Course Code */}
                <div className="flex items-start text-left">
                  <span className="mr-2.5 mt-[2px] leading-none" style={{ color: design.accentColor || '#3b82f6' }}>✦</span>
                  <span 
                    className="shrink-0 w-[140px] font-bold"
                    style={{
                      fontFamily: design.fontCourseNoHeading?.fontFamily || fontFamily || 'Georgia, serif',
                      fontSize: `${(design.fontCourseNoHeading?.fontSize || 12) / 14}em`,
                      color: design.fontCourseNoHeading?.color || fontColor || '#1e3a8a'
                    }}
                  >
                    {data.courseNoHeading || 'Course Code'} :
                  </span>
                  <span 
                    className="font-bold"
                    style={{
                      fontFamily: design.fontCourseNoContent?.fontFamily || fontFamily || 'Georgia, serif',
                      fontSize: `${(design.fontCourseNoContent?.fontSize || 12) / 14}em`,
                      color: design.fontCourseNoContent?.color || fontColor || undefined
                    }}
                  >
                    {data.courseNo || 'HIS 105'}
                  </span>
                </div>

                {/* Topic / Assignment no Text If Present */}
                {(data.assignmentNoText || data.topicTitle) && (
                  <div className="flex items-start text-left">
                    <span className="mr-2.5 mt-[2px] leading-none" style={{ color: design.accentColor || '#ef4444' }}>✦</span>
                    <span 
                      className="shrink-0 w-[140px] font-bold"
                      style={{
                        fontFamily: design.fontTopicTitle?.fontFamily || fontFamily || 'Georgia, serif',
                        fontSize: `${(design.fontTopicTitle?.fontSize || 12) / 14}em`,
                        color: design.fontTopicTitle?.color || fontColor || '#1e3a8a'
                      }}
                    >
                      Topic :
                    </span>
                    <span 
                      className="font-semibold italic"
                      style={{
                        fontFamily: design.fontTopicTitle?.fontFamily || fontFamily || 'Georgia, serif',
                        fontSize: `${(design.fontTopicTitle?.fontSize || 12) / 14}em`,
                        color: design.fontTopicTitle?.color || fontColor || undefined
                      }}
                    >
                      {data.topicTitle || data.assignmentNoText || ''}
                    </span>
                  </div>
                )}
              </div>
            </DraggableBlock>

            {/* Bottom side-by-side Rounded Cards */}
            <div className="grid grid-cols-2 gap-6 w-full px-12 select-none my-2">
              {/* Left Card: Prepared For / Submitted To */}
              <DraggableBlock elementId="submittedTo" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
                <div 
                  className="rounded-xl px-4 py-3 bg-white/50 dark:bg-slate-900/5 text-left border"
                  style={{ borderColor: design.fontSubmittedToHeading?.color || fontColor || '#1e3a8a' }}
                >
                  <h4 
                    style={{
                      fontFamily: design.fontSubmittedToHeading?.fontFamily || fontFamily || 'Georgia, serif',
                      fontSize: `${(design.fontSubmittedToHeading?.fontSize || 11.5) / 14}em`,
                      color: design.fontSubmittedToHeading?.color || fontColor || '#1e3a8a',
                      fontWeight: 'bold',
                    }}
                    className="border-b pb-1.5 mb-2 uppercase tracking-wide opacity-90"
                  >
                    {data.teacherHeading || 'Submitted To :'}
                  </h4>
                  <div 
                    className="space-y-0.5 leading-normal"
                    style={{ 
                      fontFamily: design.fontSubmittedToContent?.fontFamily || fontFamily || 'Georgia, serif',
                      fontSize: `${(design.fontSubmittedToContent?.fontSize || 11) / 14}em`,
                      color: design.fontSubmittedToContent?.color || fontColor || undefined
                    }}
                  >
                    {data.teacherDetails ? (
                      <div className="whitespace-pre-line leading-relaxed">{data.teacherDetails}</div>
                    ) : (
                      <>
                        <div className="font-bold">{data.teacherName || 'Sawban Ibn Farid'}</div>
                        <div className="font-semibold text-[0.9em] opacity-80">{data.teacherDesignation || 'Lecturer'}</div>
                        <div className="text-[0.9em] opacity-80">{data.teacherDiscipline || 'Department of CSE'}</div>
                        <div className="font-semibold text-[0.9em] opacity-80">{data.teacherUniversity || 'Presidency University'}</div>
                      </>
                    )}
                  </div>
                </div>
              </DraggableBlock>

              {/* Right Card: Prepared By / Submitted By */}
              <DraggableBlock elementId="submittedBy" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
                <div 
                  className="rounded-xl px-4 py-3 bg-white/50 dark:bg-slate-900/5 text-left border"
                  style={{ borderColor: design.fontSubmittedByHeading?.color || fontColor || '#1e3a8a' }}
                >
                  <h4 
                    style={{
                      fontFamily: design.fontSubmittedByHeading?.fontFamily || fontFamily || 'Georgia, serif',
                      fontSize: `${(design.fontSubmittedByHeading?.fontSize || 11.5) / 14}em`,
                      color: design.fontSubmittedByHeading?.color || fontColor || '#1e3a8a',
                      fontWeight: 'bold',
                    }}
                    className="border-b pb-1.5 mb-2 uppercase tracking-wide opacity-90"
                  >
                    {data.submittedByLabel || 'Submitted By :'}
                  </h4>
                  <div 
                    className="space-y-0.5 leading-normal"
                    style={{ 
                      fontFamily: design.fontSubmittedByContent?.fontFamily || fontFamily || 'Georgia, serif',
                      fontSize: `${(design.fontSubmittedByContent?.fontSize || 11) / 14}em`,
                      color: design.fontSubmittedByContent?.color || fontColor || undefined
                    }}
                  >
                    {data.studentDetails ? (
                      <div className="whitespace-pre-line leading-relaxed">{data.studentDetails}</div>
                    ) : (
                      <>
                        <div className="font-bold">{data.studentName || 'Mst. Urmi Akter'}</div>
                        <div className="font-bold text-[0.9em] font-mono">ID: {data.studentId || '242450038'}</div>
                        <div className="text-[0.9em] opacity-80">{data.studentYearTerm || 'Section 04'}</div>
                        <div className="text-[0.9em] opacity-80">{data.studentDiscipline || 'Department of CSE'}</div>
                      </>
                    )}
                  </div>
                </div>
              </DraggableBlock>
            </div>

            {/* Bottom Pill border wrapper for submission date */}
            <DraggableBlock elementId="submissionDate" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 mb-2">
              <div 
                className="rounded-full px-8 py-1.5 font-bold tracking-wide text-center border-2 bg-blue-50/20 dark:bg-slate-900/10"
                style={{ 
                  fontFamily: design.fontSubmissionDateHeading?.fontFamily || fontFamily || 'Georgia, serif',
                  fontSize: `${(design.fontSubmissionDateHeading?.fontSize || 11) / 14}em`,
                  borderColor: design.fontSubmissionDateHeading?.color || fontColor || '#2563eb',
                  color: design.fontSubmissionDateHeading?.color || fontColor || '#1e3a8a'
                }}
              >
                Submission Date : {formatDate(data.submissionDate)}
              </div>
            </DraggableBlock>
          </div>
        ) : design.templateId === 'jnu-traditional' ? (
          /* ==================== TEMPLATE jnu-traditional (JNU Traditional Times Style) ==================== */
          <div className="flex flex-col flex-1 justify-between items-center w-full relative z-10 py-4 px-8">
            
            {/* Top university header in large times-serif font */}
            <div className="text-center mt-3 flex flex-col items-center w-full">
              <h2
                style={{
                  fontFamily: design.fontUniversity?.fontFamily || design.fontTitle?.fontFamily || fontFamily || 'Georgia, serif',
                  fontSize: `${(design.fontUniversity?.fontSize || design.fontTitle?.fontSize || 25) / 14}em`,
                  color: design.fontUniversity?.color || design.fontTitle?.color || fontColor || '#000000',
                  fontWeight: design.fontUniversity?.bold !== undefined ? (design.fontUniversity.bold ? 'bold' : 'normal') : (design.fontTitle?.bold !== false ? 'bold' : 'normal'),
                  fontStyle: design.fontUniversity?.italic ? 'italic' : (design.fontTitle?.italic ? 'italic' : 'normal'),
                  textTransform: (design.fontUniversity?.uppercase !== undefined ? design.fontUniversity.uppercase : false) ? 'uppercase' : 'none',
                }}
                className="tracking-wide"
              >
                {data.universityName || data.teacherUniversity || 'Jagannath University, Dhaka'}
              </h2>
            </div>

            {/* Crest logo */}
            <DraggableBlock elementId="logo" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
              <div className="flex justify-center items-center my-4">
                {design.logoUrl ? (
                  logoPreset ? (
                    <div style={{ height: `${design.logoHeight}px`, width: `${design.logoHeight}px`, color: design.fontTitle?.color || fontColor || '#be123c' }} className="flex items-center justify-center">
                      <svg className="w-full h-full" viewBox={logoPreset.viewBox} dangerouslySetInnerHTML={{ __html: logoPreset.svgPath }} />
                    </div>
                  ) : (
                    <img src={design.logoUrl} style={{ width: `${design.logoHeight}px`, height: 'auto' }} className="object-contain max-w-[240px]" alt="University Logo" referrerPolicy="no-referrer" />
                  )
                ) : <div className="h-6" />}
              </div>
            </DraggableBlock>

            {/* Topic Title centering */}
            <DraggableBlock elementId="topicTitle" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
              <div className="px-6 text-center my-2 max-w-2xl">
                {data.documentType && (
                  <div 
                    style={{
                      fontFamily: design.fontAssignmentTopic?.fontFamily || fontFamily || 'Georgia, serif',
                      fontSize: `${(design.fontAssignmentTopic?.fontSize || 12.5) / 14}em`,
                      fontWeight: 'bold',
                      color: design.fontAssignmentTopic?.color || fontColor || '#000000'
                    }}
                    className="uppercase tracking-widest mb-2"
                  >
                    {data.documentType}
                  </div>
                )}
                
                <h1 
                  style={{
                    fontFamily: design.fontTopicTitle?.fontFamily || fontFamily || 'Georgia, serif',
                    color: design.fontTopicTitle?.color || fontColor || '#000000',
                    fontSize: `${(design.fontTopicTitle?.fontSize || 19) / 14}em`,
                    fontWeight: design.fontTopicTitle?.bold !== false ? 'bold' : 'normal',
                    lineHeight: '1.4'
                  }}
                  className="leading-relaxed px-4 underline underline-offset-4 decoration-1"
                >
                  "{data.topicTitle || 'TOPIC TITLE HERE'}"
                </h1>
              </div>
            </DraggableBlock>

            {/* Course Information centered banner */}
            <DraggableBlock elementId="courseDetails" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
              <div className="text-center space-y-1.5 my-3">
                <div 
                  style={{
                    fontFamily: design.fontCourseTitleContent?.fontFamily || fontFamily || 'Georgia, serif',
                    fontSize: `${(design.fontCourseTitleContent?.fontSize || 13) / 14}em`,
                    color: design.fontCourseTitleContent?.color || fontColor || '#000000'
                  }}
                >
                  <span className="font-bold">Course Name:</span> {data.courseName || 'Field Study and Research Monograph'}
                </div>
                <div 
                  style={{
                    fontFamily: design.fontCourseNoContent?.fontFamily || fontFamily || 'Georgia, serif',
                    fontSize: `${(design.fontCourseNoContent?.fontSize || 13) / 14}em`,
                    color: design.fontCourseNoContent?.color || fontColor || '#000000'
                  }}
                >
                  <span className="font-bold">Course Code:</span> {data.courseNo || '4205'}
                </div>
              </div>
            </DraggableBlock>

            {/* Side-by-side stacked column info */}
            <div className="grid grid-cols-2 gap-x-12 px-6 w-full mt-6 select-none">
              {/* LEFT: Supervised By (Submitted To) */}
              <DraggableBlock elementId="submittedTo" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
                <div className="flex flex-col items-start justify-start text-left">
                  <h4 
                    style={{
                      fontFamily: design.fontSubmittedToHeading?.fontFamily || fontFamily || 'Georgia, serif',
                      fontSize: `${(design.fontSubmittedToHeading?.fontSize || 12.5) / 14}em`,
                      color: design.fontSubmittedToHeading?.color || fontColor || '#000000',
                      fontWeight: (design.fontSubmittedToHeading?.bold !== undefined ? design.fontSubmittedToHeading.bold : true) ? 'bold' : 'normal',
                      textTransform: (design.fontSubmittedToHeading?.uppercase !== undefined ? design.fontSubmittedToHeading.uppercase : true) ? 'uppercase' : 'none',
                      fontStyle: (design.fontSubmittedToHeading?.italic !== undefined ? design.fontSubmittedToHeading.italic : false) ? 'italic' : 'normal',
                    }}
                    className="mb-2 tracking-wide border-b pb-0.5 w-[160px]"
                  >
                    Supervised By
                  </h4>
                  <div 
                    className="space-y-0.5 leading-normal"
                    style={{ 
                      fontFamily: design.fontSubmittedToContent?.fontFamily || fontFamily || 'Georgia, serif',
                      fontSize: `${(design.fontSubmittedToContent?.fontSize || 11) / 14}em`,
                      color: design.fontSubmittedToContent?.color || fontColor || '#000000'
                    }}
                  >
                    {data.teacherDetails ? (
                      <div className="whitespace-pre-line leading-normal">{data.teacherDetails}</div>
                    ) : (
                      <>
                        <div className="font-bold">{data.teacherName || 'Mezbah-Ul-Azam Sowdagor'}</div>
                        <div>{data.teacherDesignation || 'Assistant Professor'}</div>
                        <div>{data.teacherDiscipline || 'Department of Political Science'}</div>
                        <div className="font-semibold">{data.teacherUniversity || 'Jagannath University, Dhaka'}</div>
                      </>
                    )}
                  </div>
                </div>
              </DraggableBlock>

              {/* RIGHT: Prepared By */}
              <DraggableBlock elementId="submittedBy" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
                <div className="flex flex-col items-end justify-start text-right">
                  <div className="flex flex-col items-start justify-start text-left">
                    <h4 
                      style={{
                        fontFamily: design.fontSubmittedByHeading?.fontFamily || fontFamily || 'Georgia, serif',
                        fontSize: `${(design.fontSubmittedByHeading?.fontSize || 12.5) / 14}em`,
                        color: design.fontSubmittedByHeading?.color || fontColor || '#000000',
                        fontWeight: (design.fontSubmittedByHeading?.bold !== undefined ? design.fontSubmittedByHeading.bold : true) ? 'bold' : 'normal',
                        textTransform: (design.fontSubmittedByHeading?.uppercase !== undefined ? design.fontSubmittedByHeading.uppercase : true) ? 'uppercase' : 'none',
                        fontStyle: (design.fontSubmittedByHeading?.italic !== undefined ? design.fontSubmittedByHeading.italic : false) ? 'italic' : 'normal',
                      }}
                      className="mb-2 tracking-wide border-b pb-0.5 w-[160px]"
                    >
                      Prepared By
                    </h4>
                    <div 
                      className="space-y-0.5 leading-normal"
                      style={{ 
                        fontFamily: design.fontSubmittedByContent?.fontFamily || fontFamily || 'Georgia, serif',
                        fontSize: `${(design.fontSubmittedByContent?.fontSize || 11) / 14}em`,
                        color: design.fontSubmittedByContent?.color || fontColor || '#000000'
                      }}
                    >
                      {data.studentDetails ? (
                        <div className="whitespace-pre-line leading-normal">{data.studentDetails}</div>
                      ) : (
                        <>
                          <div className="font-bold">{data.studentName || 'Sabiha Akter'}</div>
                          <div>ID: {data.studentId || 'B-150402028'}</div>
                          {data.studentYearTerm && <div>Session: {data.studentYearTerm}</div>}
                          <div>{data.studentDiscipline || 'Department of Political Science'}</div>
                          <div className="font-semibold">{data.studentUniversity || 'Jagannath University, Dhaka'}</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </DraggableBlock>
            </div>

            {/* Submission Date bottom */}
            <DraggableBlock elementId="submissionDate" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 mb-2">
              <div 
                className="text-center font-bold tracking-wider mt-8 select-none" 
                style={{ 
                  fontFamily: design.fontSubmissionDateHeading?.fontFamily || fontFamily || 'Georgia, serif', 
                  fontSize: `${((design.fontSubmissionDateHeading?.fontSize || 12)) / 14}em`,
                  color: design.fontSubmissionDateHeading?.color || fontColor || '#000000'
                }}
              >
                Date of Submission: {formatDate(data.submissionDate)}
              </div>
            </DraggableBlock>

          </div>
        ) : design.templateId === 'teal-bars' ? (
          /* ==================== TEMPLATE teal-bars (Teal Accent Bars Pubali Style) ==================== */
          <div className="flex flex-col flex-1 justify-between items-center w-full relative z-10 pb-6">
            
            {/* Absolute Full Bleed Header Bar */}
            <div className="absolute top-[-50px] left-[-50px] right-[-50px] h-[34px] pointer-events-none flex flex-col justify-between" style={{ backgroundColor: design.fontTitle?.color || fontColor || '#0891b2' }}>
              <div className="w-full h-[3px] opacity-80" style={{ backgroundColor: design.fontTitle?.color || fontColor || '#06b6d4' }} />
              <div className="w-full h-[3px] opacity-90" style={{ backgroundColor: design.fontTitle?.color || fontColor || '#0e7490' }} />
            </div>

            <div className="absolute bottom-[-50px] left-[-50px] right-[-50px] h-[34px] pointer-events-none flex flex-col justify-between" style={{ backgroundColor: design.fontTitle?.color || fontColor || '#0891b2' }}>
              <div className="w-full h-[3px] opacity-90" style={{ backgroundColor: design.fontTitle?.color || fontColor || '#0e7490' }} />
              <div className="w-full h-[3px] opacity-80" style={{ backgroundColor: design.fontTitle?.color || fontColor || '#06b6d4' }} />
            </div>

            {/* Tiny neat inline bounding border (Inner layout lines similar to Image 3) */}
            <div className="absolute top-1 bottom-1 left-1 right-1 border pointer-events-none rounded-xs" style={{ borderColor: `${design.fontTitle?.color || fontColor || '#0891b2'}4d` }} />

            {/* Crest Logo centered */}
            <DraggableBlock elementId="logo" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 mt-6">
              <div className="flex justify-center items-center my-3">
                {design.logoUrl ? (
                  logoPreset ? (
                    <div style={{ height: `${design.logoHeight}px`, width: `${design.logoHeight}px`, color: design.fontTitle?.color || fontColor || '#0891b2' }} className="flex items-center justify-center">
                      <svg className="w-full h-full" viewBox={logoPreset.viewBox} dangerouslySetInnerHTML={{ __html: logoPreset.svgPath }} />
                    </div>
                  ) : (
                    <img src={design.logoUrl} style={{ width: `${design.logoHeight}px`, height: 'auto' }} className="object-contain max-w-[240px]" alt="University Logo" referrerPolicy="no-referrer" />
                  )
                ) : <div className="h-6" />}
              </div>
            </DraggableBlock>

            {/* Main Assignment Banner Layout Area */}
            <div className="flex flex-col items-center justify-center space-y-1 my-2 text-center w-full relative z-10 px-8">
              <DraggableBlock elementId="documentType" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
                <div 
                  style={{
                    fontFamily: design.fontAssignmentTopic?.fontFamily || fontFamily || '"Inter", sans-serif',
                    fontSize: `${(design.fontAssignmentTopic?.fontSize || 14) / 14}em`,
                    color: design.fontAssignmentTopic?.color || fontColor || '#000000'
                  }}
                  className="font-bold tracking-wider uppercase"
                >
                  {data.documentType || 'Internship Report'}
                </div>
              </DraggableBlock>
              
              <div className="font-semibold text-[0.75em] uppercase tracking-widest my-0.5 opacity-60">On</div>

              <DraggableBlock elementId="topicTitle" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 max-w-2xl px-6">
                <h1 
                  style={{
                    fontFamily: design.fontTopicTitle?.fontFamily || fontFamily || '"Inter", sans-serif',
                    color: design.fontTopicTitle?.color || fontColor || '#000000',
                    fontSize: `${(design.fontTopicTitle?.fontSize || 19) / 14}em`,
                    fontWeight: design.fontTopicTitle?.bold !== false ? 'bold' : 'normal',
                    lineHeight: '1.45',
                  }}
                  className="leading-relaxed px-4 underline underline-offset-6 decoration-2"
                >
                  {data.topicTitle || 'General Banking Activities of Pubali Bank Ltd.'}
                </h1>
              </DraggableBlock>
            </div>

            {/* Central detail cards or labels structured */}
            <div className="w-full px-12 flex flex-col space-y-6 select-none my-4">
              
              {/* Submitted To Section (Centered with bold underlined headers matching Image 3) */}
              <DraggableBlock elementId="submittedTo" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 w-full text-center">
                <div className="flex flex-col items-center justify-center text-center">
                  <h4 
                    style={{
                      fontFamily: design.fontSubmittedToHeading?.fontFamily || fontFamily || '"Inter", sans-serif',
                      fontSize: `${(design.fontSubmittedToHeading?.fontSize || 13) / 14}em`,
                      color: design.fontSubmittedToHeading?.color || fontColor || '#0891b2',
                      borderColor: design.fontSubmittedToHeading?.color || fontColor || '#0891b2',
                      fontWeight: 'bold',
                    }}
                    className="mb-1.5 uppercase tracking-widest border-b-2 pb-1 px-4"
                  >
                    {data.teacherHeading || 'Submitted To'}
                  </h4>
                  <div 
                    className="space-y-0.5 leading-normal"
                    style={{ 
                      fontFamily: design.fontSubmittedToContent?.fontFamily || fontFamily || '"Inter", sans-serif',
                      fontSize: `${(design.fontSubmittedToContent?.fontSize || 11.5) / 14}em`,
                      color: design.fontSubmittedToContent?.color || fontColor || undefined
                    }}
                  >
                    {data.teacherDetails ? (
                      <div className="whitespace-pre-line text-center">{data.teacherDetails}</div>
                    ) : (
                      <>
                        <div className="font-bold">{data.teacherName || 'Teacher Name'}</div>
                        <div className="font-semibold text-[0.85em] opacity-80">{data.teacherDesignation || 'Professor'}</div>
                        <div className="text-[0.85em] opacity-80">{data.teacherDiscipline || 'Department of Finance'}</div>
                        <div className="font-semibold text-[0.85em] opacity-80">{data.teacherUniversity || 'Jagannath University'}</div>
                      </>
                    )}
                  </div>
                </div>
              </DraggableBlock>

              {/* Prepared By Section */}
              <DraggableBlock elementId="submittedBy" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 w-full text-center">
                <div className="flex flex-col items-center justify-center text-center">
                  <h4 
                    style={{
                      fontFamily: design.fontSubmittedByHeading?.fontFamily || fontFamily || '"Inter", sans-serif',
                      fontSize: `${(design.fontSubmittedByHeading?.fontSize || 13) / 14}em`,
                      color: design.fontSubmittedByHeading?.color || fontColor || '#0891b2',
                      borderColor: design.fontSubmittedByHeading?.color || fontColor || '#0891b2',
                      fontWeight: 'bold',
                    }}
                    className="mb-1.5 uppercase tracking-widest border-b-2 pb-1 px-4"
                  >
                    {data.submittedByLabel || 'Prepared By'}
                  </h4>
                  <div 
                    className="space-y-0.5 leading-normal"
                    style={{ 
                      fontFamily: design.fontSubmittedByContent?.fontFamily || fontFamily || '"Inter", sans-serif',
                      fontSize: `${(design.fontSubmittedByContent?.fontSize || 11.5) / 14}em`,
                      color: design.fontSubmittedByContent?.color || fontColor || undefined
                    }}
                  >
                    {data.studentDetails ? (
                      <div className="whitespace-pre-line text-center">{data.studentDetails}</div>
                    ) : (
                      <>
                        <div className="font-bold">{data.studentName || 'Student Name'}</div>
                        <div className="font-bold text-[0.9em] shadow-xs px-2.5 py-0.5 rounded-sm bg-cyan-50/20 max-w-max mx-auto select-all font-mono">ID: {data.studentId || '151000'}</div>
                        {data.studentYearTerm && <div className="text-[0.85em] opacity-80">{data.studentYearTerm}</div>}
                        <div className="text-[0.85em] opacity-80">{data.studentDiscipline || 'Department of Finance'}</div>
                      </>
                    )}
                  </div>
                </div>
              </DraggableBlock>
            </div>

            {/* Submission Date bottom centered bar style */}
            <DraggableBlock elementId="submissionDate" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 mb-4">
              <div 
                className="text-center font-bold tracking-wider select-none cyan-accent-banner px-6 py-1 bg-cyan-50/40 dark:bg-slate-905/10 border border-cyan-600/20 rounded-md" 
                style={{ 
                  fontFamily: design.fontSubmissionDateHeading?.fontFamily || fontFamily || '"Inter", sans-serif', 
                  fontSize: `${(design.fontSubmissionDateHeading?.fontSize || 12) / 14}em`,
                  color: design.fontSubmissionDateHeading?.color || fontColor || '#0891b2'
                }}
              >
                Date of Submission: {formatDate(data.submissionDate)}
              </div>
            </DraggableBlock>
          </div>
        ) : design.templateId === 'du-classic' ? (
          /* ==================== TEMPLATE 4: DU CLASSIC GOTHIC STYLE (Image 4-like) ==================== */
          <div className="flex flex-col flex-1 justify-between items-center w-full relative z-10 py-2">
            
            {/* Header: University Name in big Gothic Font */}
            <div className="flex flex-col items-center justify-center text-center mt-3 w-full">
              <h2
                style={{
                  fontFamily: design.fontUniversity?.fontFamily || design.fontTitle?.fontFamily || fontFamily || 'UnifrakturMaguntia, "Times New Roman", serif',
                  fontSize: `${(design.fontUniversity?.fontSize || design.fontTitle?.fontSize || 32) / 14}em`,
                  color: design.fontUniversity?.color || design.fontTitle?.color || fontColor || accentColor,
                  fontWeight: design.fontUniversity?.bold !== undefined ? (design.fontUniversity.bold ? 'bold' : 'normal') : (design.fontTitle?.bold !== false ? 'bold' : 'normal'),
                  fontStyle: design.fontUniversity?.italic ? 'italic' : (design.fontTitle?.italic ? 'italic' : 'normal'),
                  textTransform: (design.fontUniversity?.uppercase !== undefined ? design.fontUniversity.uppercase : false) ? 'uppercase' : 'none',
                }}
                className="tracking-wide leading-none"
              >
                {data.universityName || data.teacherUniversity || 'University of Dhaka'}
              </h2>
            </div>

            {/* Logo under the Gothic title */}
            <DraggableBlock elementId="logo" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
              <div className="flex justify-center items-center my-3">
                {design.logoUrl ? (
                  logoPreset ? (
                    <div style={{ height: `${design.logoHeight}px`, width: `${design.logoHeight}px`, color: design.fontTitle?.color || fontColor || accentColor }} className="flex items-center justify-center">
                      <svg className="w-full h-full" viewBox={logoPreset.viewBox} dangerouslySetInnerHTML={{ __html: logoPreset.svgPath }} />
                    </div>
                  ) : (
                    <img src={design.logoUrl} style={{ width: `${design.logoHeight}px`, height: 'auto' }} className="object-contain max-w-[240px]" alt="University Logo" referrerPolicy="no-referrer" />
                  )
                ) : <div className="h-6" />}
              </div>
            </DraggableBlock>

            {/* Horizontal Line Divider */}
            <div className="w-full px-6 my-1">
              <div className="h-[2px] w-full" style={{ backgroundColor: design.fontTitle?.color || fontColor || accentColor }} />
            </div>

            {/* Document Type (Assignment on) */}
            <DraggableBlock elementId="documentType" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
              <div className="text-center my-1 select-none">
                <span
                  style={{
                    fontFamily: design.fontAssignmentTopic?.fontFamily || design.fontTitle?.fontFamily || fontFamily,
                    color: design.fontAssignmentTopic?.color || fontColor || '#334155',
                    fontSize: `${(design.fontAssignmentTopic?.fontSize || 12) / 14}em`,
                    fontWeight: design.fontAssignmentTopic?.bold !== false ? 'bold' : 'normal',
                    fontStyle: design.fontAssignmentTopic?.italic ? 'italic' : 'normal',
                    textTransform: design.fontAssignmentTopic?.uppercase !== false ? 'uppercase' : 'none',
                  }}
                  className="tracking-[0.15em]"
                >
                  {data.documentType || 'ASSIGNMENT ON'}
                </span>
              </div>
            </DraggableBlock>

            {/* Target Topic Block / Banner Title */}
            <DraggableBlock elementId="topicTitle" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
              <div className="my-1 py-1 px-6 w-full text-center flex flex-col items-center">
                <h1 
                  style={{
                    fontFamily: design.fontTopicTitle?.fontFamily || design.fontTitle?.fontFamily || fontFamily,
                    color: design.fontTopicTitle?.color || fontColor || accentColor,
                    fontSize: `${(design.fontTopicTitle?.fontSize || 20) / 14}em`,
                    fontWeight: design.fontTopicTitle?.bold !== false ? 'bold' : 'normal',
                    fontStyle: design.fontTopicTitle?.italic ? 'italic' : 'normal',
                    textTransform: design.fontTopicTitle?.uppercase !== false ? 'uppercase' : 'none',
                    lineHeight: '1.4',
                  }}
                  className="max-w-2xl text-center leading-snug tracking-wide px-4"
                >
                  {data.topicTitle || 'TOPIC TITLE HERE'}
                </h1>
              </div>
            </DraggableBlock>

            {data.assignmentNoText && (
              <DraggableBlock elementId="assignmentNo" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 -mt-1 mb-2">
                <div 
                  className="text-center tracking-wide select-none"
                  style={{ 
                    fontFamily: design.fontAssignmentTopic?.fontFamily || design.fontTitle?.fontFamily || fontFamily,
                    color: design.fontAssignmentTopic?.color || fontColor || '#334155',
                    fontSize: `${((design.fontAssignmentTopic?.fontSize || 12) - 1.5) / 14}em`,
                    fontWeight: (design.fontAssignmentTopic?.bold !== undefined ? design.fontAssignmentTopic.bold : true) ? 'bold' : 'normal',
                    fontStyle: (design.fontAssignmentTopic?.italic !== undefined ? design.fontAssignmentTopic.italic : false) ? 'italic' : 'normal',
                    textTransform: (design.fontAssignmentTopic?.uppercase !== undefined ? design.fontAssignmentTopic.uppercase : true) ? 'uppercase' : 'none'
                  }}
                >
                  <span className="opacity-75">Assignment No:</span> {data.assignmentNoText}
                </div>
              </DraggableBlock>
            )}

            {/* Course Code & Name Block inside */}
            <DraggableBlock elementId="courseDetails" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
              <div className="text-center space-y-1 my-1">
                <div 
                  style={{ 
                    fontFamily: design.fontCourseTitleContent?.fontFamily || design.fontCourse?.fontFamily || fontFamily, 
                    fontSize: `${(design.fontCourseTitleContent?.fontSize || 12) / 14}em`,
                    color: design.fontCourseTitleContent?.color || fontColor || '#1e293b'
                  }} 
                >
                  <span 
                    className="tracking-wider" 
                    style={{ 
                      fontFamily: design.fontCourseTitleHeading?.fontFamily || design.fontCourse?.fontFamily || fontFamily,
                      fontSize: `${(design.fontCourseTitleHeading?.fontSize || 12) / 14}em`,
                      color: design.fontCourseTitleHeading?.color || fontColor || accentColor,
                      fontWeight: design.fontCourseTitleHeading?.bold !== false ? 'bold' : 'normal'
                    }}
                  >
                    Course Title:
                  </span>{' '}
                  <span 
                    style={{
                      fontWeight: design.fontCourseTitleContent?.bold !== false ? 'bold' : 'normal',
                      fontStyle: design.fontCourseTitleContent?.italic ? 'italic' : 'normal',
                    }}
                  >
                    {data.courseName || 'Course Name'}
                  </span>
                </div>
                <div 
                  style={{ 
                    fontFamily: design.fontCourseNoContent?.fontFamily || design.fontCourse?.fontFamily || fontFamily, 
                    fontSize: `${(design.fontCourseNoContent?.fontSize || 12) / 14}em`,
                    color: design.fontCourseNoContent?.color || fontColor || '#1e293b'
                  }} 
                >
                  <span 
                    className="tracking-wider" 
                    style={{ 
                      fontFamily: design.fontCourseNoHeading?.fontFamily || design.fontCourse?.fontFamily || fontFamily,
                      fontSize: `${(design.fontCourseNoHeading?.fontSize || 12) / 14}em`,
                      color: design.fontCourseNoHeading?.color || fontColor || accentColor,
                      fontWeight: design.fontCourseNoHeading?.bold !== false ? 'bold' : 'normal'
                    }}
                  >
                    Course Code:
                  </span>{' '}
                  <span 
                    style={{
                      fontWeight: design.fontCourseNoContent?.bold !== false ? 'bold' : 'normal',
                      fontStyle: design.fontCourseNoContent?.italic ? 'italic' : 'normal',
                    }}
                  >
                    {data.courseNo || 'Course Code'}
                  </span>
                </div>
              </div>
            </DraggableBlock>

            {/* Stacked Details Pane (Prepared For & Prepared By Centered Vertically) */}
            <div className="flex flex-col items-center justify-center space-y-4 w-full my-2 select-none">
              
              {/* Prepared For (Submitted To) */}
              <DraggableBlock elementId="submittedTo" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
                <div className="flex flex-col items-center text-center max-w-lg">
                  <span 
                    style={{ 
                      fontFamily: design.fontSubmittedToHeading?.fontFamily || design.fontSubSection?.fontFamily || fontFamily,
                      fontSize: `${(design.fontSubmittedToHeading?.fontSize || 9) / 14}em`,
                      color: design.fontSubmittedToHeading?.color || fontColor || accentColor,
                      fontWeight: design.fontSubmittedToHeading?.bold !== false ? 'bold' : 'normal',
                      fontStyle: design.fontSubmittedToHeading?.italic ? 'italic' : 'normal',
                      textTransform: design.fontSubmittedToHeading?.uppercase !== false ? 'uppercase' : 'none',
                    }}
                    className="tracking-[0.12em] mb-1"
                  >
                    {data.teacherHeading || 'PREPARED FOR'}
                  </span>
                  <div 
                    style={{ 
                      fontFamily: design.fontSubmittedToContent?.fontFamily || design.fontSubSection?.fontFamily || fontFamily, 
                      fontSize: `${(design.fontSubmittedToContent?.fontSize || 10.5) / 14}em`,
                      color: design.fontSubmittedToContent?.color || fontColor || '#1e293b'
                    }} 
                    className="flex flex-col items-center leading-normal"
                  >
                    {data.teacherDetails ? (
                      <span className="whitespace-pre-line text-center">{data.teacherDetails}</span>
                    ) : (
                      <>
                        <span className="font-bold text-[1.15em]">{data.teacherName || 'Teacher Name'}</span>
                        <span className="text-[0.95em] opacity-80">{data.teacherDesignation || 'Professor'}</span>
                        <span className="text-[0.9em] opacity-70">{data.teacherDiscipline || 'Department'}</span>
                        <span className="font-semibold text-[0.95em] opacity-85">{data.teacherUniversity || 'University'}</span>
                      </>
                    )}
                  </div>
                </div>
              </DraggableBlock>

              {/* Prepared By (Submitted By) */}
              <DraggableBlock elementId="submittedBy" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
                <div className="flex flex-col items-center text-center max-w-lg">
                  <span 
                    style={{ 
                      fontFamily: design.fontSubmittedByHeading?.fontFamily || design.fontSubSection?.fontFamily || fontFamily,
                      fontSize: `${(design.fontSubmittedByHeading?.fontSize || 9) / 14}em`,
                      color: design.fontSubmittedByHeading?.color || fontColor || accentColor,
                      fontWeight: design.fontSubmittedByHeading?.bold !== false ? 'bold' : 'normal',
                      fontStyle: design.fontSubmittedByHeading?.italic ? 'italic' : 'normal',
                      textTransform: design.fontSubmittedByHeading?.uppercase !== false ? 'uppercase' : 'none',
                    }}
                    className="tracking-[0.12em] mb-1"
                  >
                    {data.submittedByLabel ? data.submittedByLabel.trim().toUpperCase() : 'PREPARED BY'}
                  </span>
                  <div 
                    style={{ 
                      fontFamily: design.fontSubmittedByContent?.fontFamily || design.fontSubSection?.fontFamily || fontFamily, 
                      fontSize: `${(design.fontSubmittedByContent?.fontSize || 10.5) / 14}em`,
                      color: design.fontSubmittedByContent?.color || fontColor || '#1e293b'
                    }} 
                    className="flex flex-col items-center leading-normal"
                  >
                    {data.studentDetails ? (
                      <span className="whitespace-pre-line text-center">{data.studentDetails}</span>
                    ) : (
                      <>
                        <span className="font-bold text-[1.15em]">{data.studentName || 'Student Name'}</span>
                        <span className="font-bold text-[0.95em] font-mono">ID NO: {data.studentId || 'Student ID'}</span>
                        {data.studentYearTerm && <span className="text-[0.9em] opacity-80">{data.studentYearTerm}</span>}
                        <span className="text-[0.9em] opacity-80">{data.studentDiscipline || 'Discipline'}</span>
                      </>
                    )}
                  </div>
                </div>
              </DraggableBlock>

            </div>

            {/* Date block */}
            <DraggableBlock elementId="submissionDate" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
              <div 
                className="text-center font-bold tracking-wider my-1" 
                style={{ 
                  fontFamily: design.fontSubmissionDateHeading?.fontFamily || design.fontDate?.fontFamily || fontFamily,
                  fontSize: `${(design.fontSubmissionDateHeading?.fontSize || 11) / 14}em`, 
                  color: design.fontSubmissionDateHeading?.color || fontColor || accentColor 
                }}
              >
                <span>DATE:</span>{' '}
                <span 
                  style={{
                    fontFamily: design.fontSubmissionDateContent?.fontFamily || design.fontDate?.fontFamily || fontFamily,
                    fontSize: `${(design.fontSubmissionDateContent?.fontSize || 11) / 14}em`,
                    color: design.fontSubmissionDateContent?.color || fontColor || '#1e293b',
                    fontWeight: design.fontSubmissionDateContent?.bold !== false ? 'bold' : 'normal',
                    fontStyle: design.fontSubmissionDateContent?.italic ? 'italic' : 'normal',
                  }}
                  className="ml-1"
                >
                  {formatDate(data.submissionDate)}
                </span>
              </div>
            </DraggableBlock>

            {/* Double solid border ending and Department info at footer */}
            <div className="w-full px-6 my-1">
              <div className="h-[1.5px] w-full" style={{ backgroundColor: design.fontTitle?.color || fontColor || accentColor }} />
            </div>

            <div 
              className="text-center font-bold uppercase tracking-wider space-y-0.5 opacity-75"
              style={{
                fontFamily: fontFamily || 'inherit',
                fontSize: '0.75em',
                color: fontColor || '#64748b'
              }}
            >
              <div>{data.teacherDiscipline || 'Department of Management'}</div>
              <div>{data.teacherUniversity || 'University of Dhaka'}</div>
            </div>

          </div>
        ) : design.templateId === 'du-minimal' ? (
          /* ==================== TEMPLATE 2: DU MINIMAL WITH REVERSED COLS (Image 2-like) ==================== */
          <div className="flex flex-col flex-1 justify-between items-center w-full relative z-10 py-3">
            
            {/* Top aligned large University Text */}
            <div className="text-center mt-2 w-full">
              <h2 
                style={{ 
                  fontFamily: design.fontUniversity?.fontFamily || design.fontTitle?.fontFamily || fontFamily || '"Times New Roman", Times, serif',
                  fontSize: `${(design.fontUniversity?.fontSize || design.fontTitle?.fontSize || 26) / 14}em`, 
                  color: design.fontUniversity?.color || design.fontTitle?.color || fontColor || accentColor, 
                  fontWeight: design.fontUniversity?.bold !== undefined ? (design.fontUniversity.bold ? 'bold' : 'normal') : (design.fontTitle?.bold !== false ? 'bold' : 'normal'),
                  textTransform: (design.fontUniversity?.uppercase !== undefined ? design.fontUniversity.uppercase : (design.fontTitle?.uppercase !== false)) ? 'uppercase' : 'none',
                  fontStyle: design.fontUniversity?.italic ? 'italic' : (design.fontTitle?.italic ? 'italic' : 'normal'),
                }} 
                className="tracking-[0.1em] leading-tight"
              >
                {data.universityName || data.teacherUniversity || 'UNIVERSITY OF DHAKA'}
              </h2>
            </div>

            {/* Logo immediately below University Header */}
            <DraggableBlock elementId="logo" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
              <div className="flex justify-center items-center my-3">
                {design.logoUrl ? (
                  logoPreset ? (
                    <div style={{ height: `${design.logoHeight}px`, width: `${design.logoHeight}px`, color: design.fontTitle?.color || fontColor || accentColor }} className="flex items-center justify-center">
                      <svg className="w-full h-full" viewBox={logoPreset.viewBox} dangerouslySetInnerHTML={{ __html: logoPreset.svgPath }} />
                    </div>
                  ) : (
                    <img src={design.logoUrl} style={{ width: `${design.logoHeight}px`, height: 'auto' }} className="object-contain max-w-[240px]" alt="University Logo" referrerPolicy="no-referrer" />
                  )
                ) : <div className="h-6" />}
              </div>
            </DraggableBlock>

            {/* Document label */}
            <DraggableBlock elementId="documentType" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
              <div className="text-center my-1 select-none">
                <h3 
                  style={{ 
                    fontFamily: design.fontAssignmentTopic?.fontFamily || fontFamily || '"Times New Roman", Times, serif',
                    fontSize: `${(design.fontAssignmentTopic?.fontSize || 15) / 14}em`,
                    color: design.fontAssignmentTopic?.color || fontColor || '#334155',
                    fontWeight: design.fontAssignmentTopic?.bold !== false ? 'bold' : 'normal',
                    fontStyle: design.fontAssignmentTopic?.italic ? 'italic' : 'normal',
                    textTransform: design.fontAssignmentTopic?.uppercase !== false ? 'uppercase' : 'none',
                  }}
                  className="tracking-wider"
                >
                  {data.documentType || 'Assignment On'}
                </h3>
              </div>
            </DraggableBlock>

            {/* Target Title (Identical to Image 2 with beautiful times formatting) */}
            <DraggableBlock elementId="topicTitle" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
              <div className="px-8 text-center my-2">
                <h1 
                  style={{
                    fontFamily: design.fontTopicTitle?.fontFamily || fontFamily || '"Times New Roman", Times, serif',
                    color: design.fontTopicTitle?.color || fontColor || '#0f172a',
                    fontSize: `${(design.fontTopicTitle?.fontSize || 22) / 14}em`,
                    fontWeight: design.fontTopicTitle?.bold !== false ? 'bold' : 'normal',
                    fontStyle: design.fontTopicTitle?.italic ? 'italic' : 'normal',
                    lineHeight: '1.4',
                  }}
                  className="max-w-2xl px-2 leading-relaxed"
                >
                  "{data.topicTitle || 'TOPIC TITLE HERE'}"
                </h1>
              </div>
            </DraggableBlock>

            {data.assignmentNoText && (
              <DraggableBlock elementId="assignmentNo" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 mt-1">
                <div 
                  style={{
                    fontFamily: design.fontAssignmentTopic?.fontFamily || fontFamily || '"Times New Roman", Times, serif',
                    fontSize: `${((design.fontAssignmentTopic?.fontSize || 15) * 0.8) / 14}em`,
                    color: design.fontAssignmentTopic?.color || fontColor || '#334155',
                    fontWeight: design.fontAssignmentTopic?.bold !== false ? 'bold' : 'normal',
                    fontStyle: design.fontAssignmentTopic?.italic ? 'italic' : 'normal',
                    textTransform: design.fontAssignmentTopic?.uppercase !== false ? 'uppercase' : 'none',
                  }}
                  className="text-center tracking-wide select-none"
                >
                  <span className="opacity-75">Assignment No:</span> {data.assignmentNoText}
                </div>
              </DraggableBlock>
            )}

            {/* Bottom area: Left Side Student (Submitted By) and Right Side Teacher (Submitted To) */}
            {/* Note the explicit inversion to map precisely with Dhaka University minimal Image 2 layout! */}
            <div className="grid grid-cols-2 gap-x-12 px-8 w-full mt-6 select-none">
              
              {/* LEFT Column: Submitted By */}
              <DraggableBlock elementId="submittedBy" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
                <div className="flex flex-col items-start justify-start text-left">
                  <h4 
                    style={{
                      fontFamily: design.fontSubmittedByHeading?.fontFamily || fontFamily || '"Times New Roman", Times, serif',
                      color: design.fontSubmittedByHeading?.color || fontColor || accentColor,
                      borderColor: design.fontSubmittedByHeading?.color || fontColor || accentColor,
                      fontSize: `${(design.fontSubmittedByHeading?.fontSize || 13) / 14}em`,
                      fontWeight: design.fontSubmittedByHeading?.bold !== false ? 'bold' : 'normal',
                      fontStyle: design.fontSubmittedByHeading?.italic ? 'italic' : 'normal',
                      textTransform: design.fontSubmittedByHeading?.uppercase !== false ? 'uppercase' : 'none',
                    }}
                    className="mb-3 tracking-wider border-b pb-1 pr-6"
                  >
                    {data.submittedByLabel || 'Submitted by,'}
                  </h4>
                  <div 
                    className="space-y-1"
                    style={{ 
                      fontFamily: design.fontSubmittedByContent?.fontFamily || fontFamily || '"Times New Roman", Times, serif', 
                      fontSize: `${(design.fontSubmittedByContent?.fontSize || 11) / 14}em`,
                      color: design.fontSubmittedByContent?.color || fontColor || undefined
                    }}
                  >
                    {data.studentDetails ? (
                      <div className="whitespace-pre-line text-left leading-normal">{data.studentDetails}</div>
                    ) : (
                      <>
                        <div className="font-bold text-[1.1em]">{data.studentName || 'Student Name'}</div>
                        <div>Roll No: {data.studentId || '251009'}</div>
                        {data.studentYearTerm && <div>{data.studentYearTerm}</div>}
                        <div>{data.studentDiscipline || 'Department'}</div>
                        <div className="font-bold">{data.studentUniversity || 'University'}</div>
                      </>
                    )}
                  </div>
                </div>
              </DraggableBlock>

              {/* RIGHT Column: Submitted To */}
              <DraggableBlock elementId="submittedTo" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
                <div className="flex flex-col items-start justify-start text-left">
                  <h4 
                    style={{
                      fontFamily: design.fontSubmittedToHeading?.fontFamily || fontFamily || '"Times New Roman", Times, serif',
                      color: design.fontSubmittedToHeading?.color || fontColor || accentColor,
                      borderColor: design.fontSubmittedToHeading?.color || fontColor || accentColor,
                      fontSize: `${(design.fontSubmittedToHeading?.fontSize || 13) / 14}em`,
                      fontWeight: design.fontSubmittedToHeading?.bold !== false ? 'bold' : 'normal',
                      fontStyle: design.fontSubmittedToHeading?.italic ? 'italic' : 'normal',
                      textTransform: design.fontSubmittedToHeading?.uppercase !== false ? 'uppercase' : 'none',
                    }}
                    className="mb-3 tracking-wider border-b pb-1 pr-6"
                  >
                    {data.teacherHeading || 'Submitted to,'}
                  </h4>
                  <div 
                    className="space-y-1"
                    style={{ 
                      fontFamily: design.fontSubmittedToContent?.fontFamily || fontFamily || '"Times New Roman", Times, serif', 
                      fontSize: `${(design.fontSubmittedToContent?.fontSize || 11) / 14}em`,
                      color: design.fontSubmittedToContent?.color || fontColor || undefined
                    }}
                  >
                    {data.teacherDetails ? (
                      <div className="whitespace-pre-line text-left leading-normal">{data.teacherDetails}</div>
                    ) : (
                      <>
                        <div className="font-bold text-[1.1em]">{data.teacherName || 'Teacher Name'}</div>
                        <div className="font-medium opacity-80">{data.teacherDesignation || 'Professor'}</div>
                        <div className="opacity-80">{data.teacherDiscipline || 'Department'}</div>
                        <div className="font-bold">{data.teacherUniversity || 'University'}</div>
                      </>
                    )}
                  </div>
                </div>
              </DraggableBlock>

            </div>

            {/* Submission Date center base */}
            <DraggableBlock elementId="submissionDate" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
              <div 
                className="text-center font-bold tracking-wider mt-10 mb-2" 
                style={{ 
                  fontFamily: design.fontSubmissionDateHeading?.fontFamily || fontFamily || '"Times New Roman", Times, serif', 
                  fontSize: `${(design.fontSubmissionDateHeading?.fontSize || 11.5) / 14}em`,
                  color: design.fontSubmissionDateHeading?.color || fontColor || accentColor
                }}
              >
                <span>DATE OF SUBMISSION:</span>{' '}
                <span 
                  style={{
                    fontFamily: design.fontSubmissionDateContent?.fontFamily || fontFamily || '"Times New Roman", Times, serif',
                    fontSize: `${(design.fontSubmissionDateContent?.fontSize || 11.5) / 14}em`,
                    color: design.fontSubmissionDateContent?.color || fontColor || undefined,
                    fontWeight: design.fontSubmissionDateContent?.bold !== false ? 'bold' : 'normal',
                  }}
                  className="ml-1 font-semibold"
                >
                  {formatDate(data.submissionDate)}
                </span>
              </div>
            </DraggableBlock>

          </div>
        ) : design.templateId === 'jnu' ? (
          /* ==================== TEMPLATE 3: JAGANNATH UNIVERSITY BANNER STYLE (Image 3-like) ==================== */
          <div className="flex flex-col flex-1 justify-between items-center w-full relative z-10 py-3">
            
            {/* JNU Top aligned Bold text header */}
            <div className="text-center mt-2 flex flex-col items-center w-full">
              <h2 
                style={{ 
                  fontFamily: design.fontUniversity?.fontFamily || design.fontTitle?.fontFamily || fontFamily || 'Georgia, serif',
                  fontSize: `${(design.fontUniversity?.fontSize || design.fontTitle?.fontSize || 24) / 14}em`, 
                  color: design.fontUniversity?.color || design.fontTitle?.color || fontColor || accentColor, 
                  fontWeight: design.fontUniversity?.bold !== undefined ? (design.fontUniversity.bold ? 'bold' : 'normal') : (design.fontTitle?.bold !== false ? 'bold' : 'normal'),
                  textTransform: (design.fontUniversity?.uppercase !== undefined ? design.fontUniversity.uppercase : (design.fontTitle?.uppercase !== false)) ? 'uppercase' : 'none',
                  fontStyle: design.fontUniversity?.italic ? 'italic' : (design.fontTitle?.italic ? 'italic' : 'normal'),
                }} 
                className="tracking-wide"
              >
                {data.universityName || data.teacherUniversity || 'Jagannath University'}
              </h2>
              {data.teacherDiscipline && (
                <span 
                  style={{ 
                    fontFamily: design.fontDiscipline?.fontFamily || design.fontSubSection?.fontFamily || fontFamily || 'Georgia, serif', 
                    fontSize: `${(design.fontDiscipline?.fontSize || 12) / 14}em`,
                    color: design.fontDiscipline?.color || design.fontSubSection?.color || fontColor || '#475569',
                    fontWeight: design.fontDiscipline?.bold !== undefined ? (design.fontDiscipline.bold ? 'bold' : 'normal') : (design.fontSubSection?.bold !== false ? 'bold' : 'normal'),
                    fontStyle: design.fontDiscipline?.italic !== undefined ? (design.fontDiscipline.italic ? 'italic' : 'normal') : (design.fontSubSection?.italic ? 'italic' : 'normal'),
                    textTransform: (design.fontDiscipline?.uppercase !== undefined ? design.fontDiscipline.uppercase : true) ? 'uppercase' : 'none',
                  }} 
                  className="mt-0.5 uppercase tracking-wider block shadow-none opacity-85"
                >
                  {data.teacherDiscipline}
                </span>
              )}
            </div>

            {/* Circular Crest Logo */}
            <DraggableBlock elementId="logo" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
              <div className="flex justify-center items-center my-3">
                {design.logoUrl ? (
                  logoPreset ? (
                    <div style={{ height: `${design.logoHeight}px`, width: `${design.logoHeight}px`, color: design.fontTitle?.color || fontColor || accentColor }} className="flex items-center justify-center">
                      <svg className="w-full h-full" viewBox={logoPreset.viewBox} dangerouslySetInnerHTML={{ __html: logoPreset.svgPath }} />
                    </div>
                  ) : (
                    <img src={design.logoUrl} style={{ width: `${design.logoHeight}px`, height: 'auto' }} className="object-contain max-w-[240px]" alt="University Logo" referrerPolicy="no-referrer" />
                  )
                ) : <div className="h-6" />}
              </div>
            </DraggableBlock>

            {/* Document Banner Label */}
            <DraggableBlock elementId="documentType" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
              <div 
                style={{
                  fontFamily: design.fontAssignmentTopic?.fontFamily || fontFamily || 'Georgia, serif',
                  fontSize: `${(design.fontAssignmentTopic?.fontSize || 9.5) / 14}em`,
                  color: design.fontAssignmentTopic?.color || fontColor || '#64748b',
                  fontWeight: design.fontAssignmentTopic?.bold !== false ? 'bold' : 'normal',
                  fontStyle: design.fontAssignmentTopic?.italic ? 'italic' : 'normal',
                  textTransform: design.fontAssignmentTopic?.uppercase !== false ? 'uppercase' : 'none',
                }}
                className="text-center tracking-widest border-y py-1 px-8 border-current/20 w-auto select-none"
              >
                {data.documentType || 'Assignment On'}
              </div>
            </DraggableBlock>

            {/* Topic Title */}
            <DraggableBlock elementId="topicTitle" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
              <div className="px-6 text-center my-2">
                <h1 
                  style={{
                    fontFamily: design.fontTopicTitle?.fontFamily || fontFamily || 'Georgia, serif',
                    color: design.fontTopicTitle?.color || fontColor || '#0f172a',
                    fontSize: `${(design.fontTopicTitle?.fontSize || 22) / 14}em`,
                    fontWeight: design.fontTopicTitle?.bold !== false ? 'bold' : 'normal',
                    fontStyle: design.fontTopicTitle?.italic ? 'italic' : 'normal',
                    lineHeight: '1.4',
                  }}
                  className="max-w-2xl px-2"
                >
                  {data.topicTitle || 'TOPIC TITLE HERE'}
                </h1>
              </div>
            </DraggableBlock>

            {data.assignmentNoText && (
              <DraggableBlock elementId="assignmentNo" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 mt-1">
                <div 
                  style={{
                    fontFamily: design.fontAssignmentTopic?.fontFamily || fontFamily || 'Georgia, serif',
                    fontSize: `${(design.fontAssignmentTopic?.fontSize || 9.5) / 14}em`,
                    color: design.fontAssignmentTopic?.color || fontColor || '#334155',
                    fontWeight: design.fontAssignmentTopic?.bold !== false ? 'bold' : 'normal',
                    fontStyle: design.fontAssignmentTopic?.italic ? 'italic' : 'normal',
                    textTransform: design.fontAssignmentTopic?.uppercase !== false ? 'uppercase' : 'none',
                  }}
                  className="text-center tracking-wide select-none"
                >
                  <span className="opacity-75">Assignment No:</span> {data.assignmentNoText}
                </div>
              </DraggableBlock>
            )}

            {/* Course Information Box */}
            <DraggableBlock elementId="courseDetails" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
              <div className="rounded-xl p-3 border border-current/15 text-center space-y-1 w-[85%] select-none bg-current/2">
                <div 
                  style={{ 
                    fontFamily: design.fontCourseTitleContent?.fontFamily || fontFamily || 'Georgia, serif', 
                    fontSize: `${(design.fontCourseTitleContent?.fontSize || 11) / 14}em`,
                    color: design.fontCourseTitleContent?.color || fontColor || '#334155'
                  }} 
                >
                  <span 
                    style={{
                      fontFamily: design.fontCourseTitleHeading?.fontFamily || fontFamily || 'Georgia, serif',
                      fontSize: `${(design.fontCourseTitleHeading?.fontSize || 11) / 14}em`,
                      color: design.fontCourseTitleHeading?.color || fontColor || '#9f1239', // beautiful deep rose-red
                      fontWeight: design.fontCourseTitleHeading?.bold !== false ? 'bold' : 'normal',
                    }}
                    className="uppercase tracking-wider"
                  >
                    Course Title:
                  </span>{' '}
                  <span style={{ fontWeight: design.fontCourseTitleContent?.bold !== false ? 'bold' : 'normal' }}>
                    {data.courseName || 'Course Title'}
                  </span>
                </div>
                <div 
                  style={{ 
                    fontFamily: design.fontCourseNoContent?.fontFamily || fontFamily || 'Georgia, serif', 
                    fontSize: `${(design.fontCourseNoContent?.fontSize || 11) / 14}em`,
                    color: design.fontCourseNoContent?.color || fontColor || '#334155'
                  }}
                >
                  <span 
                    style={{
                      fontFamily: design.fontCourseNoHeading?.fontFamily || fontFamily || 'Georgia, serif',
                      fontSize: `${(design.fontCourseNoHeading?.fontSize || 11) / 14}em`,
                      color: design.fontCourseNoHeading?.color || fontColor || '#9f1239',
                      fontWeight: design.fontCourseNoHeading?.bold !== false ? 'bold' : 'normal',
                    }}
                    className="uppercase tracking-wider"
                  >
                    Course Code:
                  </span>{' '}
                  <span style={{ fontWeight: design.fontCourseNoContent?.bold !== false ? 'bold' : 'normal' }} className="font-mono">
                    {data.courseNo || 'Course Code'}
                  </span>
                </div>
              </div>
            </DraggableBlock>

            {/* Submitted To (Teacher) and Submitted By (Student) Columns */}
            <div className="grid grid-cols-2 gap-x-12 px-8 w-full mt-4 select-none">
              
              {/* LEFT Column: Submitted To */}
              <DraggableBlock elementId="submittedTo" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
                <div className="flex flex-col items-start justify-start text-left">
                  <h4 
                    style={{
                      fontFamily: design.fontSubmittedToHeading?.fontFamily || fontFamily || 'Georgia, serif',
                      color: design.fontSubmittedToHeading?.color || fontColor || '#d97706', // beautiful amber highlighting fallback
                      fontSize: `${(design.fontSubmittedToHeading?.fontSize || 11.5) / 14}em`,
                      fontWeight: design.fontSubmittedToHeading?.bold !== false ? 'bold' : 'normal',
                      fontStyle: design.fontSubmittedToHeading?.italic ? 'italic' : 'normal',
                      textTransform: design.fontSubmittedToHeading?.uppercase !== false ? 'uppercase' : 'none',
                    }}
                    className="mb-2.5 tracking-wider border-l-4 pl-2"
                  >
                    {data.teacherHeading || 'SUBMITTED TO'}
                  </h4>
                  <div 
                    className="space-y-0.5"
                    style={{ 
                      fontFamily: design.fontSubmittedToContent?.fontFamily || fontFamily || 'Georgia, serif', 
                      fontSize: `${(design.fontSubmittedToContent?.fontSize || 10.5) / 14}em`,
                      color: design.fontSubmittedToContent?.color || fontColor || '#1e293b'
                    }}
                  >
                    {data.teacherDetails ? (
                      <div className="whitespace-pre-line text-left leading-normal">{data.teacherDetails}</div>
                    ) : (
                      <>
                        <div className="font-bold text-[1.1em]">{data.teacherName || 'Teacher Name'}</div>
                        <div className="opacity-80">{data.teacherDesignation || 'Professor'}</div>
                        <div className="opacity-80">{data.teacherDiscipline || 'Department'}</div>
                        <div className="font-bold opacity-85">{data.teacherUniversity || 'Jagannath University'}</div>
                      </>
                    )}
                  </div>
                </div>
              </DraggableBlock>

              {/* RIGHT Column: Submitted By */}
              <DraggableBlock elementId="submittedBy" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
                <div className="flex flex-col items-start justify-start text-left">
                  <h4 
                    style={{
                      fontFamily: design.fontSubmittedByHeading?.fontFamily || fontFamily || 'Georgia, serif',
                      color: design.fontSubmittedByHeading?.color || fontColor || '#d97706', // beautiful amber highlighting fallback
                      fontSize: `${(design.fontSubmittedByHeading?.fontSize || 11.5) / 14}em`,
                      fontWeight: design.fontSubmittedByHeading?.bold !== false ? 'bold' : 'normal',
                      fontStyle: design.fontSubmittedByHeading?.italic ? 'italic' : 'normal',
                      textTransform: design.fontSubmittedByHeading?.uppercase !== false ? 'uppercase' : 'none',
                    }}
                    className="mb-2.5 tracking-wider border-l-4 pl-2"
                  >
                    {data.submittedByLabel || 'SUBMITTED BY'}
                  </h4>
                  <div 
                    className="space-y-0.5"
                    style={{ 
                      fontFamily: design.fontSubmittedByContent?.fontFamily || fontFamily || 'Georgia, serif', 
                      fontSize: `${(design.fontSubmittedByContent?.fontSize || 10.5) / 14}em`,
                      color: design.fontSubmittedByContent?.color || fontColor || '#1e293b'
                    }}
                  >
                    {data.studentDetails ? (
                      <div className="whitespace-pre-line text-left leading-normal">{data.studentDetails}</div>
                    ) : (
                      <>
                        <div className="font-bold text-[1.1em]">{data.studentName || 'Student Name'}</div>
                        <div>ID: {data.studentId || '18PHY040'}</div>
                        {data.studentYearTerm && <div>{data.studentYearTerm}</div>}
                        <div>{data.studentDiscipline || 'Department'}</div>
                        <div className="font-bold opacity-85">{data.studentUniversity || 'Jagannath University'}</div>
                      </>
                    )}
                  </div>
                </div>
              </DraggableBlock>

            </div>

            {/* submission date */}
            <DraggableBlock elementId="submissionDate" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
              <div 
                className="text-center font-bold tracking-wider mt-8 select-none" 
                style={{ 
                  fontFamily: design.fontSubmissionDateHeading?.fontFamily || fontFamily || 'Georgia, serif', 
                  fontSize: `${(design.fontSubmissionDateHeading?.fontSize || 11) / 14}em` 
                }}
              >
                <span style={{ color: design.fontSubmissionDateHeading?.color || fontColor || '#9f1239' }}>Date of Submission:</span>{' '}
                <span 
                  style={{
                    fontFamily: design.fontSubmissionDateContent?.fontFamily || fontFamily || 'Georgia, serif',
                    fontSize: `${(design.fontSubmissionDateContent?.fontSize || 11) / 14}em`,
                    color: design.fontSubmissionDateContent?.color || fontColor || '#1e293b',
                    fontWeight: design.fontSubmissionDateContent?.bold !== false ? 'bold' : 'normal',
                  }}
                  className="ml-1 font-semibold"
                >
                  {formatDate(data.submissionDate)}
                </span>
              </div>
            </DraggableBlock>

          </div>
        ) : design.templateId === 'jnu-finance' ? (
          /* ==================== TEMPLATE 4: JAGANNATH UNIVERSITY FINANCE PROFESSIONAL ==================== */
          <div className="flex flex-col flex-1 justify-between items-center w-full relative z-10 py-4 px-8">
            
            {/* Top aligned Bold text header */}
            <div className="text-center mt-2 flex flex-col items-center w-full">
              <h2 
                style={{ 
                  fontFamily: design.fontUniversity?.fontFamily || design.fontTitle?.fontFamily || fontFamily || 'Georgia, serif',
                  fontSize: `${(design.fontUniversity?.fontSize || design.fontTitle?.fontSize || 24) / 14}em`, 
                  color: design.fontUniversity?.color || design.fontTitle?.color || fontColor || '#1e3a8a', 
                  fontWeight: design.fontUniversity?.bold !== undefined ? (design.fontUniversity.bold ? 'bold' : 'normal') : (design.fontTitle?.bold !== false ? 'bold' : 'normal'),
                  textTransform: (design.fontUniversity?.uppercase !== undefined ? design.fontUniversity.uppercase : (design.fontTitle?.uppercase !== false)) ? 'uppercase' : 'none',
                  fontStyle: design.fontUniversity?.italic ? 'italic' : (design.fontTitle?.italic ? 'italic' : 'normal'),
                }} 
                className="tracking-wide"
              >
                {data.universityName || data.teacherUniversity || 'Jagannath University'}
              </h2>
              {data.teacherDiscipline && (
                <span 
                  style={{ 
                    fontFamily: design.fontDiscipline?.fontFamily || design.fontSubSection?.fontFamily || fontFamily || 'Georgia, serif', 
                    fontSize: `${(design.fontDiscipline?.fontSize || 12) / 14}em`,
                    color: design.fontDiscipline?.color || design.fontSubSection?.color || fontColor || '#b45309',
                    fontWeight: design.fontDiscipline?.bold !== undefined ? (design.fontDiscipline.bold ? 'bold' : 'normal') : 'bold',
                    fontStyle: design.fontDiscipline?.italic !== undefined ? (design.fontDiscipline.italic ? 'italic' : 'normal') : 'normal',
                    textTransform: (design.fontDiscipline?.uppercase !== undefined ? design.fontDiscipline.uppercase : true) ? 'uppercase' : 'none',
                  }} 
                  className="font-bold mt-1 uppercase tracking-wider block"
                >
                  {data.teacherDiscipline}
                </span>
              )}
            </div>

            {/* Circular Crest Logo */}
            <DraggableBlock elementId="logo" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
              <div className="flex justify-center items-center my-4">
                {design.logoUrl ? (
                  logoPreset ? (
                    <div style={{ height: `${design.logoHeight}px`, width: `${design.logoHeight}px`, color: design.fontTitle?.color || fontColor || '#1e3a8a' }} className="flex items-center justify-center">
                      <svg className="w-full h-full" viewBox={logoPreset.viewBox} dangerouslySetInnerHTML={{ __html: logoPreset.svgPath }} />
                    </div>
                  ) : (
                    <img src={design.logoUrl} style={{ width: `${design.logoHeight}px`, height: 'auto' }} className="object-contain max-w-[240px]" alt="University Logo" referrerPolicy="no-referrer" />
                  )
                ) : <div className="h-6" />}
              </div>
            </DraggableBlock>

            {/* Document Banner Label */}
            <DraggableBlock elementId="documentType" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
              <div 
                style={{
                  fontFamily: design.fontAssignmentTopic?.fontFamily || fontFamily || 'Georgia, serif',
                  fontSize: `${(design.fontAssignmentTopic?.fontSize || 11) / 14}em`,
                  color: design.fontAssignmentTopic?.color || fontColor || '#000000',
                  fontWeight: design.fontAssignmentTopic?.bold !== false ? 'bold' : 'normal'
                }}
                className="text-center uppercase tracking-widest py-1 px-8 w-auto select-none"
              >
                {data.documentType || 'Assignment On'}
              </div>
            </DraggableBlock>

            {/* Topic Title */}
            <DraggableBlock elementId="topicTitle" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
              <div className="px-4 text-center my-3">
                <h1 
                  style={{
                    fontFamily: design.fontTopicTitle?.fontFamily || fontFamily || 'Georgia, serif',
                    color: design.fontTopicTitle?.color || fontColor || '#000000',
                    fontSize: `${(design.fontTopicTitle?.fontSize || 24) / 14}em`,
                    fontWeight: design.fontTopicTitle?.bold !== false ? 'bold' : 'normal',
                    lineHeight: '1.4',
                  }}
                  className="max-w-2xl px-2 leading-snug"
                >
                  {data.topicTitle || 'TOPIC TITLE HERE'}
                </h1>
              </div>
            </DraggableBlock>

            {data.assignmentNoText && (
              <DraggableBlock elementId="assignmentNo" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 mt-1">
                <div 
                  style={{
                    fontFamily: design.fontAssignmentTopic?.fontFamily || fontFamily || 'Georgia, serif',
                    fontSize: `${(design.fontAssignmentTopic?.fontSize || 11) / 14}em`,
                    color: design.fontAssignmentTopic?.color || fontColor || '#000000',
                    fontWeight: design.fontAssignmentTopic?.bold !== false ? 'bold' : 'normal'
                  }}
                  className="text-center tracking-wide select-none"
                >
                  <span className="opacity-75">Assignment No:</span> {data.assignmentNoText}
                </div>
              </DraggableBlock>
            )}

            {/* Course Information with direct professional Green coloring */}
            <DraggableBlock elementId="courseDetails" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
              <div className="text-center space-y-1.5 w-full select-none">
                <div 
                  style={{ 
                    fontFamily: design.fontCourseTitleHeading?.fontFamily || fontFamily || 'Georgia, serif', 
                    fontSize: `${(design.fontCourseTitleHeading?.fontSize || 13) / 14}em`,
                    color: design.fontCourseTitleHeading?.color || fontColor || '#15803d'
                  }} 
                >
                  <span className="font-bold uppercase tracking-wider">Course Title:</span>{' '}
                  <span 
                    style={{
                      fontFamily: design.fontCourseTitleContent?.fontFamily || fontFamily || 'Georgia, serif',
                      fontSize: `${(design.fontCourseTitleContent?.fontSize || 13) / 14}em`,
                      color: design.fontCourseTitleContent?.color || fontColor || '#15803d',
                      fontWeight: design.fontCourseTitleContent?.bold !== false ? 'bold' : 'normal'
                    }}
                  >
                    {data.courseName || 'Course Title'}
                  </span>
                </div>
                <div 
                  style={{ 
                    fontFamily: design.fontCourseNoHeading?.fontFamily || fontFamily || 'Georgia, serif', 
                    fontSize: `${(design.fontCourseNoHeading?.fontSize || 13) / 14}em`,
                    color: design.fontCourseNoHeading?.color || fontColor || '#15803d'
                  }} 
                >
                  <span className="font-bold uppercase tracking-wider">Course Code:</span>{' '}
                  <span 
                    style={{
                      fontFamily: design.fontCourseNoContent?.fontFamily || fontFamily || 'Georgia, serif',
                      fontSize: `${(design.fontCourseNoContent?.fontSize || 13) / 14}em`,
                      color: design.fontCourseNoContent?.color || fontColor || '#15803d',
                      fontWeight: design.fontCourseNoContent?.bold !== false ? 'bold' : 'normal'
                    }}
                  >
                    {data.courseNo || 'Course Code'}
                  </span>
                </div>
              </div>
            </DraggableBlock>

            {/* Submitted To (Teacher) and Submitted By (Student) Columns */}
            <div className="grid grid-cols-2 gap-x-12 px-2 w-full mt-5 select-none">
              
              {/* LEFT Column: Submitted To */}
              <DraggableBlock elementId="submittedTo" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
                <div className="flex flex-col items-start justify-start text-left">
                  <h4 
                    style={{
                      fontFamily: design.fontSubmittedToHeading?.fontFamily || fontFamily || 'Georgia, serif',
                      color: design.fontSubmittedToHeading?.color || fontColor || '#ef4444', 
                      fontSize: `${(design.fontSubmittedToHeading?.fontSize || 12.5) / 14}em`,
                      fontWeight: design.fontSubmittedToHeading?.bold !== false ? 'bold' : 'normal'
                    }}
                    className="mb-2 tracking-wider uppercase"
                  >
                    {data.teacherHeading || 'SUBMITTED TO'}
                  </h4>
                  <div 
                    className="space-y-0.5"
                    style={{ 
                      fontFamily: design.fontSubmittedToContent?.fontFamily || fontFamily || 'Georgia, serif', 
                      fontSize: `${(design.fontSubmittedToContent?.fontSize || 11) / 14}em`,
                      color: design.fontSubmittedToContent?.color || fontColor || '#000000'
                    }}
                  >
                    {data.teacherDetails ? (
                      <div className="whitespace-pre-line text-left leading-normal font-semibold">{data.teacherDetails}</div>
                    ) : (
                      <>
                        <div className="font-bold text-[1.1em]">{data.teacherName || 'Teacher Name'}</div>
                        <div className="opacity-80">{data.teacherDesignation || 'Professor'}</div>
                        <div className="opacity-80">{data.teacherDiscipline || 'Department'}</div>
                        <div className="font-bold opacity-90">{data.teacherUniversity || 'Jagannath University'}</div>
                      </>
                    )}
                  </div>
                </div>
              </DraggableBlock>

              {/* RIGHT Column: Submitted By */}
              <DraggableBlock elementId="submittedBy" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
                <div className="flex flex-col items-start justify-start text-left">
                  <h4 
                    style={{
                      fontFamily: design.fontSubmittedByHeading?.fontFamily || fontFamily || 'Georgia, serif',
                      color: design.fontSubmittedByHeading?.color || fontColor || '#ef4444', 
                      fontSize: `${(design.fontSubmittedByHeading?.fontSize || 12.5) / 14}em`,
                      fontWeight: design.fontSubmittedByHeading?.bold !== false ? 'bold' : 'normal'
                    }}
                    className="mb-2 tracking-wider uppercase"
                  >
                    {data.submittedByLabel || 'SUBMITTED BY'}
                  </h4>
                  <div 
                    className="space-y-0.5"
                    style={{ 
                      fontFamily: design.fontSubmittedByContent?.fontFamily || fontFamily || 'Georgia, serif', 
                      fontSize: `${(design.fontSubmittedByContent?.fontSize || 11) / 14}em`,
                      color: design.fontSubmittedByContent?.color || fontColor || '#000000'
                    }}
                  >
                    {data.studentDetails ? (
                      <div className="whitespace-pre-line text-left leading-normal font-semibold">{data.studentDetails}</div>
                    ) : (
                      <>
                        <div className="font-bold text-[1.1em]">{data.studentName || 'Student Name'}</div>
                        <div>ID: {data.studentId || '18PHY040'}</div>
                        {data.studentYearTerm && <div>{data.studentYearTerm}</div>}
                        <div className="opacity-80">{data.studentDiscipline || 'Department'}</div>
                        <div className="font-bold opacity-90">{data.studentUniversity || 'Jagannath University'}</div>
                      </>
                    )}
                  </div>
                </div>
              </DraggableBlock>

            </div>

            {/* submission date centered at bottom */}
            <DraggableBlock elementId="submissionDate" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
              <div 
                className="text-center mt-8 select-none" 
                style={{ 
                  fontFamily: design.fontSubmissionDateHeading?.fontFamily || fontFamily || 'Georgia, serif', 
                  fontSize: `${(design.fontSubmissionDateHeading?.fontSize || 11.5) / 14}em`,
                  color: design.fontSubmissionDateHeading?.color || fontColor || '#000000'
                }}
              >
                <span className="font-bold">Date of Submission:</span>{' '}
                <span 
                  style={{
                    fontFamily: design.fontSubmissionDateContent?.fontFamily || fontFamily || 'Georgia, serif',
                    fontSize: `${(design.fontSubmissionDateContent?.fontSize || 11.5) / 14}em`,
                    color: design.fontSubmissionDateContent?.color || fontColor || '#000000',
                    fontWeight: design.fontSubmissionDateContent?.bold !== false ? 'bold' : 'normal'
                  }}
                  className="ml-1"
                >
                  {formatDate(data.submissionDate)}
                </span>
              </div>
            </DraggableBlock>

          </div>
        ) : (
          /* ==================== TEMPLATE 1: KHULNA / SYMMETRIC SHIELD STYLE (Current default 'ku') ==================== */
          <>
            {/* ==================== 1. DOCUMENT TYPE & TOPIC (TOP) ==================== */}
            <div className={`flex flex-col mt-8 z-10 w-full px-8 ${getAlignClasses(design.fontAssignmentTopic?.align || design.fontTitle.align).container}`}>
              <DraggableBlock elementId="documentType" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
                <div className={`flex flex-col select-none mb-4 ${getAlignClasses(design.fontAssignmentTopic?.align || design.fontTitle.align).container}`}>
                  {data.documentType.toUpperCase() === 'AN ASSIGNMENT ON' ? (
                    <>
                      <span 
                        className="tracking-[0.2em]"
                        style={{ 
                          fontFamily: design.fontAssignmentTopic?.fontFamily || design.fontTitle.fontFamily || fontFamily,
                          color: design.fontAssignmentTopic?.color || fontColor || accentColor,
                          fontSize: `${(design.fontAssignmentTopic?.fontSize || 10) / 14}em`,
                          fontWeight: (design.fontAssignmentTopic?.bold !== undefined ? design.fontAssignmentTopic.bold : true) ? 'bold' : 'normal',
                          fontStyle: (design.fontAssignmentTopic?.italic !== undefined ? design.fontAssignmentTopic.italic : false) ? 'italic' : 'normal',
                          textTransform: (design.fontAssignmentTopic?.uppercase !== undefined ? design.fontAssignmentTopic.uppercase : true) ? 'uppercase' : 'none'
                        }}
                      >
                        AN ASSIGNMENT
                      </span>
                      <span 
                        className="tracking-[0.2em] mt-1"
                        style={{ 
                          fontFamily: design.fontAssignmentTopic?.fontFamily || design.fontTitle.fontFamily || fontFamily,
                          color: design.fontAssignmentTopic?.color || fontColor || accentColor,
                          fontSize: `${((design.fontAssignmentTopic?.fontSize || 10) - 1) / 14}em`,
                          fontWeight: (design.fontAssignmentTopic?.bold !== undefined ? design.fontAssignmentTopic.bold : true) ? 'bold' : 'normal',
                          fontStyle: (design.fontAssignmentTopic?.italic !== undefined ? design.fontAssignmentTopic.italic : false) ? 'italic' : 'normal',
                          textTransform: (design.fontAssignmentTopic?.uppercase !== undefined ? design.fontAssignmentTopic.uppercase : true) ? 'uppercase' : 'none'
                        }}
                      >
                        ON
                      </span>
                    </>
                  ) : data.documentType.toUpperCase() === 'LAB REPORT ON' ? (
                    <>
                      <span 
                        className="tracking-[0.2em]"
                        style={{ 
                          fontFamily: design.fontAssignmentTopic?.fontFamily || design.fontTitle.fontFamily || fontFamily,
                          color: design.fontAssignmentTopic?.color || fontColor || accentColor,
                          fontSize: `${(design.fontAssignmentTopic?.fontSize || 10) / 14}em`,
                          fontWeight: (design.fontAssignmentTopic?.bold !== undefined ? design.fontAssignmentTopic.bold : true) ? 'bold' : 'normal',
                          fontStyle: (design.fontAssignmentTopic?.italic !== undefined ? design.fontAssignmentTopic.italic : false) ? 'italic' : 'normal',
                          textTransform: (design.fontAssignmentTopic?.uppercase !== undefined ? design.fontAssignmentTopic.uppercase : true) ? 'uppercase' : 'none'
                        }}
                      >
                        LAB REPORT
                      </span>
                      <span 
                        className="tracking-[0.2em] mt-1"
                        style={{ 
                          fontFamily: design.fontAssignmentTopic?.fontFamily || design.fontTitle.fontFamily || fontFamily,
                          color: design.fontAssignmentTopic?.color || fontColor || accentColor,
                          fontSize: `${((design.fontAssignmentTopic?.fontSize || 10) - 1) / 14}em`,
                          fontWeight: (design.fontAssignmentTopic?.bold !== undefined ? design.fontAssignmentTopic.bold : true) ? 'bold' : 'normal',
                          fontStyle: (design.fontAssignmentTopic?.italic !== undefined ? design.fontAssignmentTopic.italic : false) ? 'italic' : 'normal',
                          textTransform: (design.fontAssignmentTopic?.uppercase !== undefined ? design.fontAssignmentTopic.uppercase : true) ? 'uppercase' : 'none'
                        }}
                      >
                        ON
                      </span>
                    </>
                  ) : (
                    <span 
                      className="tracking-[0.2em] inline-block"
                      style={{ 
                        fontFamily: design.fontAssignmentTopic?.fontFamily || design.fontTitle.fontFamily || fontFamily,
                        color: design.fontAssignmentTopic?.color || fontColor || accentColor,
                        fontSize: `${(design.fontAssignmentTopic?.fontSize || 10) / 14}em`,
                        fontWeight: (design.fontAssignmentTopic?.bold !== undefined ? design.fontAssignmentTopic.bold : true) ? 'bold' : 'normal',
                        fontStyle: (design.fontAssignmentTopic?.italic !== undefined ? design.fontAssignmentTopic.italic : false) ? 'italic' : 'normal',
                        textTransform: (design.fontAssignmentTopic?.uppercase !== undefined ? design.fontAssignmentTopic.uppercase : true) ? 'uppercase' : 'none'
                      }}
                    >
                      {data.documentType}
                    </span>
                  )}
                </div>
              </DraggableBlock>
              
              <DraggableBlock elementId="topicTitle" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
                <h1 
                  style={{
                    fontFamily: design.fontTopicTitle?.fontFamily || design.fontTitle.fontFamily || fontFamily,
                    color: design.fontTopicTitle?.color || fontColor || accentColor,
                    fontSize: `${(design.fontTopicTitle?.fontSize || design.fontTitle.fontSize) / 14}em`,
                    fontWeight: (design.fontTopicTitle?.bold !== undefined ? design.fontTopicTitle.bold : design.fontTitle.bold) ? 'bold' : 'normal',
                    fontStyle: (design.fontTopicTitle?.italic !== undefined ? design.fontTopicTitle.italic : design.fontTitle.italic) ? 'italic' : 'normal',
                    textTransform: (design.fontTopicTitle?.uppercase !== undefined ? design.fontTopicTitle.uppercase : design.fontTitle.uppercase) ? 'uppercase' : 'none',
                    lineHeight: '1.4',
                    textAlign: design.fontTopicTitle?.align || design.fontTitle.align || 'center'
                  }}
                  className={`max-w-2xl px-6 select-text leading-relaxed ${getAlignClasses(design.fontTopicTitle?.align || design.fontTitle.align).text}`}
                >
                  {data.topicTitle || 'TOPIC TITLE HERE'}
                </h1>
              </DraggableBlock>

              {data.assignmentNoText && (
                <DraggableBlock elementId="assignmentNo" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10 -mt-2 mb-4">
                  <div 
                    className="text-center tracking-wide select-none"
                    style={{ 
                      fontFamily: design.fontAssignmentTopic?.fontFamily || design.fontTitle.fontFamily || fontFamily,
                      color: design.fontAssignmentTopic?.color || fontColor || accentColor,
                      fontSize: `${((design.fontAssignmentTopic?.fontSize || 10) - 1) / 14}em`,
                      fontWeight: (design.fontAssignmentTopic?.bold !== undefined ? design.fontAssignmentTopic.bold : true) ? 'bold' : 'normal',
                      fontStyle: (design.fontAssignmentTopic?.italic !== undefined ? design.fontAssignmentTopic.italic : false) ? 'italic' : 'normal',
                      textTransform: (design.fontAssignmentTopic?.uppercase !== undefined ? design.fontAssignmentTopic.uppercase : true) ? 'uppercase' : 'none'
                    }}
                  >
                    <span className="opacity-75">Assignment No:</span> {data.assignmentNoText}
                  </div>
                </DraggableBlock>
              )}
            </div>

            {/* ==================== 2. BRANDING LOGO ==================== */}
            <DraggableBlock elementId="logo" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
              <div className="flex justify-center items-center my-4 z-10 w-full">
                {design.logoUrl ? (
                  logoPreset ? (
                    <div 
                      style={{ 
                        height: `${design.logoHeight}px`, 
                        width: `${design.logoHeight}px`,
                        color: design.fontTitle?.color || fontColor || accentColor 
                      }}
                      className="flex items-center justify-center transition-all duration-200"
                    >
                      <svg 
                        className="w-full h-full"
                        viewBox={logoPreset.viewBox}
                        dangerouslySetInnerHTML={{ __html: logoPreset.svgPath }}
                      />
                    </div>
                  ) : (
                    <img 
                      src={design.logoUrl} 
                      style={{ width: `${design.logoHeight}px`, height: 'auto' }} 
                      className="object-contain max-w-[240px] transition-all duration-200"
                      alt="University Logo"
                      referrerPolicy="no-referrer"
                    />
                  )
                ) : (
                  <div className="h-[20px]" />
                )}
              </div>
            </DraggableBlock>

            {/* ==================== 3. COURSE DETAILS ==================== */}
            <DraggableBlock elementId="courseDetails" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
              <div className={`flex flex-col z-10 px-8 w-full ${getAlignClasses(design.fontCourseNoHeading?.align || design.fontCourse.align).container}`}>
                <div className={`space-y-2 select-text flex flex-col ${getAlignClasses(design.fontCourseNoHeading?.align || design.fontCourse.align).container}`}>
                  <div 
                    style={{
                      fontFamily: design.fontCourseNoHeading?.fontFamily || design.fontCourse.fontFamily || fontFamily,
                      color: design.fontCourseNoHeading?.color || fontColor || accentColor,
                      fontSize: `${(design.fontCourseNoHeading?.fontSize || design.fontCourse.fontSize) / 14}em`,
                      fontWeight: (design.fontCourseNoHeading?.bold !== undefined ? design.fontCourseNoHeading.bold : design.fontCourse.bold) ? 'bold' : 'normal',
                      fontStyle: (design.fontCourseNoHeading?.italic !== undefined ? design.fontCourseNoHeading.italic : design.fontCourse.italic) ? 'italic' : 'normal',
                      textTransform: (design.fontCourseNoHeading?.uppercase !== undefined ? design.fontCourseNoHeading.uppercase : design.fontCourse.uppercase) ? 'uppercase' : 'none',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {data.courseNoHeading || 'Course No:'}{' '}
                    <span 
                      style={{
                        fontFamily: design.fontCourseNoContent?.fontFamily || design.fontCourseTemplate?.fontFamily || design.fontCourse.fontFamily || fontFamily,
                        color: design.fontCourseNoContent?.color || design.fontCourse.color || fontColor,
                        fontSize: `${(design.fontCourseNoContent?.fontSize || design.fontCourse.fontSize) / 14}em`,
                        fontWeight: (design.fontCourseNoContent?.bold !== undefined ? design.fontCourseNoContent.bold : design.fontCourse.bold) ? 'bold' : 'normal',
                        fontStyle: (design.fontCourseNoContent?.italic !== undefined ? design.fontCourseNoContent.italic : design.fontCourse.italic) ? 'italic' : 'normal',
                        textTransform: (design.fontCourseNoContent?.uppercase !== undefined ? design.fontCourseNoContent.uppercase : false) ? 'uppercase' : 'none',
                      }}
                    >
                      {data.courseNo || 'ES-0000'}
                    </span>
                  </div>
                  
                  <div 
                    style={{
                      fontFamily: design.fontCourseTitleHeading?.fontFamily || design.fontCourse.fontFamily || fontFamily,
                      color: design.fontCourseTitleHeading?.color || fontColor || accentColor,
                      fontSize: `${(design.fontCourseTitleHeading?.fontSize || design.fontCourse.fontSize) / 14}em`,
                      fontWeight: (design.fontCourseTitleHeading?.bold !== undefined ? design.fontCourseTitleHeading.bold : design.fontCourse.bold) ? 'bold' : 'normal',
                      fontStyle: (design.fontCourseTitleHeading?.italic !== undefined ? design.fontCourseTitleHeading.italic : design.fontCourse.italic) ? 'italic' : 'normal',
                      textTransform: (design.fontCourseTitleHeading?.uppercase !== undefined ? design.fontCourseTitleHeading.uppercase : design.fontCourse.uppercase) ? 'uppercase' : 'none',
                      letterSpacing: '0.01em',
                    }}
                    className="max-w-xl"
                  >
                    {data.courseNameHeading || 'Course Title:'}{' '}
                    <span 
                      style={{
                        fontFamily: design.fontCourseTitleContent?.fontFamily || design.fontCourseTemplate?.fontFamily || design.fontCourse.fontFamily || fontFamily,
                        color: design.fontCourseTitleContent?.color || design.fontCourse.color || fontColor,
                        fontSize: `${(design.fontCourseTitleContent?.fontSize || design.fontCourse.fontSize) / 14}em`,
                        fontWeight: (design.fontCourseTitleContent?.bold !== undefined ? design.fontCourseTitleContent.bold : design.fontCourse.bold) ? 'bold' : 'normal',
                        fontStyle: (design.fontCourseTitleContent?.italic !== undefined ? design.fontCourseTitleContent.italic : design.fontCourse.italic) ? 'italic' : 'normal',
                        textTransform: (design.fontCourseTitleContent?.uppercase !== undefined ? design.fontCourseTitleContent.uppercase : false) ? 'uppercase' : 'none',
                      }}
                    >
                      {data.courseName || 'Course Name'}
                    </span>
                  </div>
                </div>
              </div>
            </DraggableBlock>

            {/* ==================== 4. SUBMITTED TO & SUBMITTED BY ==================== */}
            <div className="grid grid-cols-2 gap-x-12 px-10 z-10 mt-10 w-full select-none">
              
              <DraggableBlock elementId="submittedTo" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
                <div className={`flex flex-col justify-start ${getAlignClasses(design.fontSubmittedToHeading?.align || design.fontSubSection.align || 'left').container}`}>
                  <h3 
                    style={{
                      fontFamily: design.fontSubmittedToHeading?.fontFamily || design.fontSubSection.fontFamily || fontFamily,
                      color: design.fontSubmittedToHeading?.color || fontColor || accentColor,
                      fontSize: `${(design.fontSubmittedToHeading?.fontSize || design.fontSubSection.fontSize + 0.5) / 14}em`,
                      fontWeight: (design.fontSubmittedToHeading?.bold !== undefined ? design.fontSubmittedToHeading.bold : true) ? 'bold' : 'normal',
                      fontStyle: (design.fontSubmittedToHeading?.italic !== undefined ? design.fontSubmittedToHeading.italic : false) ? 'italic' : 'normal',
                      textTransform: (design.fontSubmittedToHeading?.uppercase !== undefined ? design.fontSubmittedToHeading.uppercase : true) ? 'uppercase' : 'none',
                      textAlign: design.fontSubmittedToHeading?.align || design.fontSubSection.align || 'left'
                    }}
                    className="mb-3 tracking-wider"
                  >
                    {data.teacherHeading || 'SUBMITTED TO,'}
                  </h3>
                  
                  <div 
                    className={`space-y-1 select-text flex flex-col w-full ${getAlignClasses(design.fontSubmittedToContent?.align || design.fontSubSection.align || 'left').container}`} 
                    style={{
                      fontFamily: design.fontSubmittedToContent?.fontFamily || design.fontSubSection.fontFamily || fontFamily,
                      color: design.fontSubmittedToContent?.color || design.fontSubSection.color || fontColor,
                      fontSize: `${(design.fontSubmittedToContent?.fontSize || design.fontSubSection.fontSize) / 14}em`,
                      fontWeight: design.fontSubmittedToContent?.bold ? 'bold' : 'normal',
                      fontStyle: design.fontSubmittedToContent?.italic ? 'italic' : 'normal',
                      textTransform: design.fontSubmittedToContent?.uppercase ? 'uppercase' : 'none',
                      lineHeight: '1.4',
                      whiteSpace: 'pre-line',
                      textAlign: design.fontSubmittedToContent?.align || design.fontSubSection.align || 'left'
                    }}
                  >
                    {data.teacherDetails ? data.teacherDetails.trim() : (
                      <>
                        <div className="font-bold" style={{ fontSize: `${((design.fontSubmittedToContent?.fontSize || design.fontSubSection.fontSize) + 1) / 14}em`, fontWeight: (design.fontSubmittedToContent?.bold !== undefined ? design.fontSubmittedToContent.bold : true) ? 'bold' : 'normal' }}>
                          {data.teacherName || 'Teacher Name'}
                        </div>
                        <div className="font-medium opacity-80" style={{ fontWeight: (design.fontSubmittedToContent?.bold !== undefined ? design.fontSubmittedToContent.bold : false) ? 'semibold' : 'normal' }}>
                          {data.teacherDesignation || 'Professor'}
                        </div>
                        <div className="opacity-80">
                          {data.teacherDiscipline || 'Environmental Science Discipline'}
                        </div>
                        <div className="font-bold opacity-90" style={{ fontWeight: (design.fontSubmittedToContent?.bold !== undefined ? design.fontSubmittedToContent.bold : true) ? 'bold' : 'normal' }}>
                          {data.teacherUniversity || 'Khulna University'}
                        </div>
                        {data.teacherLocation && (
                          <div className="opacity-70">
                            {data.teacherLocation}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </DraggableBlock>

              <DraggableBlock elementId="submittedBy" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
                <div className={`flex flex-col justify-start ${getAlignClasses(design.fontSubmittedByHeading?.align || design.fontSubSection.align || 'right').container}`}>
                  <h3 
                    style={{
                      fontFamily: design.fontSubmittedByHeading?.fontFamily || design.fontSubSection.fontFamily || fontFamily,
                      color: design.fontSubmittedByHeading?.color || fontColor || accentColor,
                      fontSize: `${(design.fontSubmittedByHeading?.fontSize || design.fontSubSection.fontSize + 0.5) / 14}em`,
                      fontWeight: (design.fontSubmittedByHeading?.bold !== undefined ? design.fontSubmittedByHeading.bold : true) ? 'bold' : 'normal',
                      fontStyle: (design.fontSubmittedByHeading?.italic !== undefined ? design.fontSubmittedByHeading.italic : false) ? 'italic' : 'normal',
                      textTransform: (design.fontSubmittedByHeading?.uppercase !== undefined ? design.fontSubmittedByHeading.uppercase : true) ? 'uppercase' : 'none',
                      textAlign: design.fontSubmittedByHeading?.align || design.fontSubSection.align || 'right'
                    }}
                    className="mb-3 tracking-wider"
                  >
                    {data.submittedByLabel ? data.submittedByLabel.trim().toUpperCase() + ',' : 'SUBMITTED BY,'}
                  </h3>
                  
                  <div 
                    className={`space-y-1 select-text flex flex-col w-full ${getAlignClasses(design.fontSubmittedByContent?.align || design.fontSubSection.align || 'right').container}`} 
                    style={{
                      fontFamily: design.fontSubmittedByContent?.fontFamily || design.fontSubSection.fontFamily || fontFamily,
                      color: design.fontSubmittedByContent?.color || design.fontSubSection.color || fontColor,
                      fontSize: `${(design.fontSubmittedByContent?.fontSize || design.fontSubSection.fontSize) / 14}em`,
                      fontWeight: design.fontSubmittedByContent?.bold ? 'bold' : 'normal',
                      fontStyle: design.fontSubmittedByContent?.italic ? 'italic' : 'normal',
                      textTransform: design.fontSubmittedByContent?.uppercase ? 'uppercase' : 'none',
                      lineHeight: '1.4',
                      whiteSpace: 'pre-line',
                      textAlign: design.fontSubmittedByContent?.align || design.fontSubSection.align || 'right'
                    }}
                  >
                    {data.studentDetails ? data.studentDetails.trim() : (
                      <>
                        <div className="font-bold" style={{ fontSize: `${((design.fontSubmittedByContent?.fontSize || design.fontSubSection.fontSize) + 1) / 14}em`, fontWeight: (design.fontSubmittedByContent?.bold !== undefined ? design.fontSubmittedByContent.bold : true) ? 'bold' : 'normal' }}>
                          {data.studentName || 'Student Name'}
                        </div>
                        <div className="font-bold opacity-85" style={{ fontWeight: (design.fontSubmittedByContent?.bold !== undefined ? design.fontSubmittedByContent.bold : true) ? 'bold' : 'normal' }}>
                          Student ID: {data.studentId || '251009'}
                        </div>
                        <div className="opacity-80">
                          {data.studentYearTerm || '1st Year, 2nd Term'}
                        </div>
                        <div className="opacity-80">
                          {data.studentDiscipline || 'Environmental Science Discipline'}
                        </div>
                        <div className="font-bold opacity-90" style={{ fontWeight: (design.fontSubmittedByContent?.bold !== undefined ? design.fontSubmittedByContent.bold : true) ? 'bold' : 'normal' }}>
                          {data.studentUniversity || 'Khulna University'}
                        </div>
                        {data.studentLocation && (
                          <div className="opacity-70">
                            {data.studentLocation}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </DraggableBlock>

            </div>

            {/* ==================== 5. DATE OF SUBMISSION (BOTTOM) ==================== */}
            <DraggableBlock elementId="submissionDate" design={design} onChangeDesign={onChangeDesign} zoom={zoom} className="z-10">
              <div className="flex flex-col items-center justify-center text-center mt-8 mb-2 z-10 w-full select-none">
                <div className="select-text tracking-wider font-bold">
                  <span 
                    style={{ 
                      fontFamily: design.fontSubmissionDateHeading?.fontFamily || design.fontDate.fontFamily || fontFamily,
                      color: design.fontSubmissionDateHeading?.color || fontColor || accentColor,
                      fontSize: `${(design.fontSubmissionDateHeading?.fontSize || design.fontDate.fontSize) / 14}em`,
                      fontWeight: (design.fontSubmissionDateHeading?.bold !== undefined ? design.fontSubmissionDateHeading.bold : design.fontDate.bold) ? 'bold' : 'normal',
                      fontStyle: (design.fontSubmissionDateHeading?.italic !== undefined ? design.fontSubmissionDateHeading.italic : design.fontDate.italic) ? 'italic' : 'normal',
                      textTransform: (design.fontSubmissionDateHeading?.uppercase !== undefined ? design.fontSubmissionDateHeading.uppercase : true) ? 'uppercase' : 'none',
                    }}
                  >
                    {data.submissionDateHeading || 'DATE OF SUBMISSION:'}
                  </span>{' '}
                  <span 
                    style={{ 
                      fontFamily: design.fontSubmissionDateContent?.fontFamily || design.fontDate.fontFamily || fontFamily,
                      color: design.fontSubmissionDateContent?.color || design.fontDate.color || fontColor,
                      fontSize: `${(design.fontSubmissionDateContent?.fontSize || design.fontDate.fontSize) / 14}em`,
                      fontWeight: (design.fontSubmissionDateContent?.bold !== undefined ? design.fontSubmissionDateContent.bold : design.fontDate.bold) ? 'bold' : 'normal',
                      fontStyle: (design.fontSubmissionDateContent?.italic !== undefined ? design.fontSubmissionDateContent.italic : design.fontDate.italic) ? 'italic' : 'normal',
                      textTransform: (design.fontSubmissionDateContent?.uppercase !== undefined ? design.fontSubmissionDateContent.uppercase : false) ? 'uppercase' : 'none',
                    }}
                  >
                    {formatDate(data.submissionDate)}
                  </span>
                </div>
              </div>
            </DraggableBlock>
          </>
        )}

        {/* Footer line if enabled */}
        {design.hasFooterLine && (
          <div className="absolute bottom-[35px] left-[50px] right-[50px] h-[1px]" style={{ backgroundColor: borderColor }} />
        )}

        {/* Dynamic Scan QR Code Badge */}
        {design.showQrCode && qrCodeDataUrl && (
          <div 
            className="absolute z-30 p-1 bg-white border rounded-lg flex items-center justify-center pointer-events-auto select-none"
            style={{
              width: `${design.qrCodeSize || 60}px`,
              height: `${design.qrCodeSize || 60}px`,
              ...getQrPositionStyles(design.qrCodePosition || 'bottom-right'),
              transform: isQrUpdated ? 'scale(1.18)' : 'scale(1)',
              borderColor: isQrUpdated ? accentColor : 'rgba(226, 232, 240, 0.7)',
              boxShadow: isQrUpdated 
                ? `0 0 15px ${accentColor}80, 0 8px 16px -2px rgb(0 0 0 / 0.15)` 
                : '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.3s ease, box-shadow 0.3s ease',
            }}
            title={`Scan document link: ${design.qrCodeUrl}`}
          >
            {isQrUpdated && (
              <div 
                className="absolute inset-0 rounded-lg pointer-events-none z-[-1]"
                style={{
                  border: `3px solid ${accentColor}`,
                  animation: 'qr-ripple 0.9s cubic-bezier(0.1, 0.8, 0.3, 1) forwards',
                }}
              />
            )}
            <img 
              src={qrCodeDataUrl} 
              alt="Document QR Code" 
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </motion.div>
      </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
