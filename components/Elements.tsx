import React, { useRef, useEffect, useState } from 'react';
import type { Profile, ButtonArray, Apps, QRCode, CallToAction, BlockText, Embed } from '../types';

declare const QRCode: any;

interface ElementProps<T> {
  element: T;
  onEdit: (element: T) => void;
  isDragging: boolean;
  isEditable?: boolean;
}

export const ProfileElement: React.FC<ElementProps<Profile> & { buttonWidth: number; profilePicSize: number; profileNameFontSize: number; profileDescriptionFontSize: number; profileNameColor: string; profileDescriptionColor: string; }> = ({ element, onEdit, isEditable, buttonWidth, profilePicSize, profileNameFontSize, profileDescriptionFontSize, profileNameColor, profileDescriptionColor }) => (
  <div
    className="relative text-center"
    style={{ width: `${buttonWidth}%`, marginLeft: 'auto', marginRight: 'auto' }}
  >
    {isEditable && (
        <div className="absolute right-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-500 z-20">
          <button
            className="w-[22px] h-[22px] inline-flex items-center justify-center"
            aria-label="Edit profile"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(element); }}
          >
            <i className="fa-solid fa-pencil text-sm"></i>
          </button>
        </div>
    )}
    <div
      className="editable profile-container"
    >
      <img
        src={element.picUrl}
        alt="Profile"
        className={`rounded-full mx-auto mb-2 object-cover pointer-events-none ${element.picShadow}`}
        style={{ width: `${profilePicSize}px`, height: `${profilePicSize}px` }}
      />
      <h2 className="text-xl font-semibold pointer-events-none" style={{ fontSize: `${profileNameFontSize}px`, color: profileNameColor, fontWeight: element.nameFontWeight, fontStyle: element.nameFontStyle, textDecoration: element.nameTextDecoration, textShadow: element.nameTextShadow }}>{element.name}</h2>
      <p className="text-sm mt-1 pointer-events-none" style={{ fontSize: `${profileDescriptionFontSize}px`, color: profileDescriptionColor, fontWeight: element.descriptionFontWeight, fontStyle: element.descriptionFontStyle, textDecoration: element.descriptionTextDecoration, textShadow: element.descriptionTextShadow }}>{element.description}</p>
    </div>
  </div>
);

export const ButtonArrayElement: React.FC<ElementProps<ButtonArray> & { buttonWidth: number; buttonFontSize: number; buttonAnimation: string; buttonTextColor: string; buttonBgColor: string; buttonFontWeight: 'normal' | 'bold'; buttonFontStyle: 'normal' | 'italic'; buttonTextDecoration: 'none' | 'underline'; }> = ({ element, onEdit, isDragging, isEditable, buttonWidth, buttonFontSize, buttonAnimation, buttonTextColor, buttonBgColor, buttonFontWeight, buttonFontStyle, buttonTextDecoration }) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if(isDragging) {
            e.preventDefault();
        }
    }
    return (
     <div
        className="relative"
        style={{ width: `${buttonWidth}%`, marginLeft: 'auto', marginRight: 'auto' }}
     >
        {isEditable && (
            <div className="absolute right-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-500 z-20">
              <span
                className="cursor-grab p-1"
                data-drag-handle="true"
                title="Drag to reorder"
                onClick={(e) => e.stopPropagation()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 6h10M10 12h10M10 18h10M4 6h.01M4 12h.01M4 18h.01"/></svg>
              </span>
              <button
                className="w-[22px] h-[22px] inline-flex items-center justify-center"
                aria-label="Edit buttons"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(element); }}
              >
                <i className="fa-solid fa-pencil text-sm"></i>
              </button>
            </div>
        )}
        <div className="space-y-4">
            {element.buttons.map(button => (
                 <a
                    key={button.id}
                    href={button.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block p-3 transition-all duration-300 relative flex items-center justify-center ${button.style} ${button.shadow} ${isEditable ? 'editable hover:shadow-[0_0_0_2px_rgba(59,130,246,0.5)]' : ''} ${buttonAnimation !== 'none' ? buttonAnimation : ''}`}
                    style={{ backgroundColor: buttonBgColor, color: buttonTextColor, fontSize: `${buttonFontSize}pt` }}
                    onClick={handleClick}
                    onDoubleClick={isEditable ? () => onEdit(element) : undefined}
                  >
                    <div className="flex items-center justify-center gap-2 pointer-events-none">
                      <i className={button.icon || 'fa-solid fa-link'} aria-hidden="true"></i>
                      <span style={{ fontWeight: buttonFontWeight, fontStyle: buttonFontStyle, textDecoration: buttonTextDecoration }}>{button.text}</span>
                    </div>
                  </a>
            ))}
        </div>
      </div>
    )
};

export const AppsElement: React.FC<ElementProps<Apps> & { appIconSize: number; buttonWidth: number; appAnimation: string; }> = ({ element, onEdit, isEditable, appIconSize, buttonWidth, appAnimation }) => (
  <div
    className="relative flex justify-center items-center"
    style={{ width: `${buttonWidth}%`, marginLeft: 'auto', marginRight: 'auto' }}
  >
    {isEditable && (
        <div className="absolute right-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-500 z-20">
          <span
            className="cursor-grab p-1"
            data-drag-handle="true"
            title="Drag to reorder"
            onClick={(e) => e.stopPropagation()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 6h10M10 12h10M10 18h10M4 6h.01M4 12h.01M4 18h.01"/></svg>
          </span>
          <button
            className="w-[22px] h-[22px] inline-flex items-center justify-center"
            aria-label="Edit apps"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(element); }}
          >
            <i className="fa-solid fa-pencil text-sm"></i>
          </button>
        </div>
    )}
    <div
      className={`p-1 rounded-lg ${isEditable ? 'hover:shadow-[0_0_0_2px_rgba(59,130,246,0.5)] cursor-pointer' : ''}`}
      onClick={isEditable ? () => onEdit(element) : undefined}
    >
      <div className="flex gap-1.5 flex-nowrap justify-center">
          {element.apps.map(app => (
              <a
                  key={app.id}
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-[52px] h-[52px] ${app.shape} inline-flex items-center justify-center text-base no-underline m-0.5 ${appAnimation !== 'none' ? appAnimation : ''}`}
                  style={{ backgroundColor: app.bg }}
                  onClick={(e) => e.stopPropagation()}
              >
                  <i className={app.icon} style={{ fontSize: `${appIconSize}pt`, color: app.color || 'rgba(255,255,255,1)' }}></i>
              </a>
          ))}
      </div>
    </div>
  </div>
);

export const QrCodeElement: React.FC<ElementProps<QRCode> & {qrCodeColorDark: string; qrCodeColorLight: string; buttonWidth: number; qrCodeSize: number;}> = ({ element, onEdit, isEditable, qrCodeColorDark, qrCodeColorLight, buttonWidth, qrCodeSize }) => {
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (qrRef.current && typeof QRCode !== 'undefined') {
      qrRef.current.innerHTML = '';
      if(element.url){
          new QRCode(qrRef.current, {
            text: element.url,
            width: qrCodeSize,
            height: qrCodeSize,
            colorDark: qrCodeColorDark,
          });
      }
    }
  }, [element.url, qrCodeColorDark, qrCodeSize]);

  return (
    <div
        className="relative text-center"
        style={{ width: `${buttonWidth}%`, marginLeft: 'auto', marginRight: 'auto' }}
    >
      {isEditable && (
          <div className="absolute right-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-500 z-20">
            <span
              className="cursor-grab p-1"
              data-drag-handle="true"
              title="Drag to reorder"
              onClick={(e) => e.stopPropagation()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 6h10M10 12h10M10 18h10M4 6h.01M4 12h.01M4 18h.01"/></svg>
            </span>
            <button
              className="w-[22px] h-[22px] inline-flex items-center justify-center"
              aria-label="Edit QR Code"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(element); }}
            >
              <i className="fa-solid fa-pencil text-sm"></i>
            </button>
          </div>
      )}
      <div
        className={`inline-block p-2 rounded-lg ${isEditable ? 'hover:shadow-[0_0_0_2px_rgba(59,130,246,0.5)] cursor-pointer' : ''}`}
        onClick={isEditable ? () => onEdit(element) : undefined}
        style={{ backgroundColor: qrCodeColorLight }}
      >
        <div ref={qrRef} className="flex justify-center"></div>
      </div>
    </div>
  );
};

export const CallToActionElement: React.FC<ElementProps<CallToAction> & { buttonWidth: number; }> = ({ element, onEdit, isEditable, buttonWidth }) => (
    <div className="relative" style={{ width: `${buttonWidth}%`, margin: '0 auto' }}>
        {isEditable && (
            <div className="absolute right-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-500 z-20">
              <span
                className="cursor-grab p-1"
                data-drag-handle="true"
                title="Drag to reorder"
                onClick={(e) => e.stopPropagation()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 6h10M10 12h10M10 18h10M4 6h.01M4 12h.01M4 18h.01"/></svg>
              </span>
              <button
                className="w-[22px] h-[22px] inline-flex items-center justify-center"
                aria-label={`Edit ${element.type}`}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(element); }}
              >
                <i className="fa-solid fa-pencil text-sm"></i>
              </button>
            </div>
        )}
        <div style={{ textAlign: element.alignment }}>
          <a
            href={element.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block transition-all duration-300 ${element.style} ${element.shadow} ${element.animation !== 'none' ? element.animation : ''}`}
            style={{
              backgroundColor: element.bgColor,
              color: element.textColor,
              padding: `${element.paddingY}px 24px`,
              fontWeight: element.fontWeight,
              fontStyle: element.fontStyle,
              textDecoration: element.textDecoration,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {element.text}
          </a>
        </div>
    </div>
);

export const BlockTextElement: React.FC<ElementProps<BlockText> & { buttonWidth: number; }> = ({ element, onEdit, isEditable, buttonWidth }) => (
  <div className="relative" style={{ width: `${buttonWidth}%`, margin: '0 auto' }}>
    {isEditable && (
        <div className="absolute right-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-500 z-20">
          <span
            className="cursor-grab p-1"
            data-drag-handle="true"
            title="Drag to reorder"
            onClick={(e) => e.stopPropagation()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 6h10M10 12h10M10 18h10M4 6h.01M4 12h.01M4 18h.01"/></svg>
          </span>
          <button
            className="w-[22px] h-[22px] inline-flex items-center justify-center"
            aria-label={`Edit ${element.type}`}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(element); }}
          >
            <i className="fa-solid fa-pencil text-sm"></i>
          </button>
        </div>
    )}
    <div
      style={{
        backgroundColor: element.bgColor,
        color: element.textColor,
        fontSize: `${element.fontSize}px`,
        textAlign: element.textAlign,
        padding: `${element.paddingY}px ${element.paddingX}px`,
        borderRadius: '8px',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
        fontWeight: element.fontWeight,
        fontStyle: element.fontStyle,
        textDecoration: element.textDecoration,
      }}
      onClick={isEditable ? () => onEdit(element) : undefined}
      className={isEditable ? 'cursor-pointer hover:shadow-[0_0_0_2px_rgba(59,130,246,0.5)]' : ''}
    >
        {element.content}
    </div>
  </div>
);

export const EmbedElement: React.FC<ElementProps<Embed> & { buttonWidth: number; }> = ({ element, onEdit, isEditable, buttonWidth }) => (
  <div className="relative" style={{ width: `${buttonWidth}%`, margin: '0 auto' }}>
    {isEditable && (
        <div className="absolute right-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-500 z-20">
          <span className="cursor-grab p-1" data-drag-handle="true" title="Drag to reorder" onClick={(e) => e.stopPropagation()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 6h10M10 12h10M10 18h10M4 6h.01M4 12h.01M4 18h.01"/></svg>
          </span>
          <button className="w-[22px] h-[22px] inline-flex items-center justify-center" aria-label={`Edit ${element.type}`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(element); }}>
            <i className="fa-solid fa-pencil text-sm"></i>
          </button>
        </div>
    )}
    <div
      style={{
        padding: `${element.paddingY}px ${element.paddingX}px`,
        border: `${element.borderWidth}px solid ${element.borderColor}`,
        borderRadius: `${element.borderRadius}px`,
      }}
      className={`${element.shadow} ${isEditable ? 'hover:shadow-[0_0_0_2px_rgba(59,130,246,0.5)] cursor-pointer' : ''}`}
      onClick={isEditable ? () => onEdit(element) : undefined}
    >
        <div dangerouslySetInnerHTML={{ __html: element.content }} className="[&_iframe]:max-w-full [&_iframe]:mx-auto [&_iframe]:block"></div>
    </div>
  </div>
);