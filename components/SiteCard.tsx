import React, { useRef, useEffect, useState, useMemo } from 'react';
// Fix: Import custom Element type with an alias to avoid collision with the global DOM Element type.
import type { State, EditingTarget, MenuItem, Profile, QRCode, Element as AppElement } from '../types';
import { getBackgroundValue, rgbaToHex } from '../hooks/useEditorState'; // Assuming utils are exported from the hook file
import { ProfileElement, ButtonArrayElement, AppsElement, QrCodeElement, CallToActionElement, BlockTextElement, EmbedElement } from './Elements';


// --- REUSABLE SITE CARD COMPONENT ---
// Fix: Update prop types for drag handlers to use the aliased AppElement type.
export const SiteCard: React.FC<{ state: State; isEditable?: boolean; onEdit?: (target: EditingTarget) => void; onDragStart?: (e: React.DragEvent<HTMLDivElement>, el: AppElement) => void; onDragEnter?: (e: React.DragEvent<HTMLDivElement>, el: AppElement) => void; onDragEnd?: () => void; isDragging?: boolean; draggedItemId?: string | null; forwardedRef?: React.Ref<HTMLElement>; onClick?: () => void; hideFooter?: boolean; onShare?: (url: string) => void; onInstallPwa?: () => void; }> = ({ state, isEditable, onEdit, onDragStart, onDragEnter, onDragEnd, isDragging, draggedItemId, forwardedRef, onClick, hideFooter = false, onShare, onInstallPwa }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const cardBgValue = useMemo(() => getBackgroundValue(state.appearance.cardBackgroundConfig), [state.appearance.cardBackgroundConfig]);
    const qrCodeColorDarkHex = useMemo(() => rgbaToHex(state.appearance.qrCodeColorDark), [state.appearance.qrCodeColorDark]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const cardDynamicStyles: React.CSSProperties = {
        fontFamily: state.appearance.fontFamily,
        backgroundImage: cardBgValue,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        animation: state.appearance.cardFadeIn ? `fadeIn ${state.appearance.cardFadeInSpeed / 1000}s ease-out` : 'none',
    };

    const handleEdit = (target: EditingTarget) => { if (isEditable && onEdit) { onEdit(target); } };
    
    const handleMenuItemClick = (item: MenuItem) => {
        setIsMenuOpen(false);
        switch (item.type) {
            case 'share':
                if(onShare) onShare(item.url || window.location.href);
                break;
            case 'install':
                if(onInstallPwa) onInstallPwa();
                break;
            // Fix: Removed erroneous call to e.preventDefault() which was causing a crash,
            // as 'e' is not in scope here. The parent onClick handler already prevents default navigation.
            case 'link':
                if (item.url && isEditable) { // Only open links in editor to avoid navigation
                    window.open(item.url, '_blank');
                } else if (item.url) {
                    window.open(item.url, '_blank');
                }
                break;
        }
    };
    
    const containerClasses = `relative w-full ${isEditable ? 'md:w-[48rem] md:max-w-none md:flex-shrink-0' : 'max-w-sm'} rounded-2xl shadow-2xl transition-all duration-500 ease-in-out h-full flex flex-col`;
    const contentPadding = isEditable ? 'px-6 pt-12 pb-6' : 'px-4 pt-12 pb-4';
    const menuIconSize = state.menuSettings.iconSize || 20;

    return (
        <main ref={forwardedRef} className={containerClasses} style={cardDynamicStyles}>
            <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
                {isEditable && (
                    <button
                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-black/10 text-gray-500 hover:text-gray-700"
                        aria-label="Edit menu"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleEdit({ type: 'menu', id: 'menu' }); }}
                    >
                        <i className="fa-solid fa-pencil text-sm"></i>
                    </button>
                )}
                {state.menuSettings.enabled && (
                    <div className="relative" ref={menuRef}>
                        <button
                            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-black/10"
                            style={{ color: state.menuSettings.iconColor }}
                            onClick={() => setIsMenuOpen(o => !o)}
                            aria-label="Open menu"
                            aria-haspopup="true"
                            aria-expanded={isMenuOpen}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width={menuIconSize} height={menuIconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                        </button>
                        {isMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-56 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5" style={{ backgroundColor: state.menuSettings.bgColor, fontFamily: state.appearance.fontFamily }}>
                                {state.menuSettings.items.map(item => (
                                    <a
                                        key={item.id}
                                        href={item.url && item.type === 'link' ? item.url : '#'}
                                        onClick={(e) => { e.preventDefault(); handleMenuItemClick(item); }}
                                        className="flex items-center gap-3 px-4 py-2 transition-colors hover:bg-black/5"
                                        style={{ color: state.menuSettings.textColor, fontSize: `${state.menuSettings.itemFontSize}px` }}
                                        target={item.type === 'link' ? '_blank' : undefined}
                                        rel={item.type === 'link' ? 'noopener noreferrer' : undefined}
                                    >
                                        {item.icon && <i className={`${item.icon} w-4 text-center`} style={{ fontSize: `${state.menuSettings.itemIconSize}px` }}></i>}
                                        <span>{item.text}</span>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className={`text-center ${contentPadding} space-y-4 flex-grow hide-scrollbar overflow-y-auto ${!isEditable ? 'pointer-events-none' : ''}`}>
                {state.elements.map((element) => (
                    <div key={element.id} draggable={isEditable && element.type !== 'profile'} onDragStart={(e) => isEditable && element.type !== 'profile' && onDragStart?.(e, element)} onDragEnter={(e) => isEditable && onDragEnter?.(e, element)} onDragEnd={isEditable ? onDragEnd : undefined} onDragOver={(e) => isEditable && e.preventDefault()} className={isEditable ? `draggable ${isDragging && draggedItemId === element.id ? 'dragging' : ''}` : ''} data-id={element.id}>
                        {element.type === 'profile' && <ProfileElement element={element} onEdit={handleEdit} isDragging={false} isEditable={isEditable} {...state.appearance} />}
                        {element.type === 'buttonarray' && <ButtonArrayElement element={element} onEdit={handleEdit} isDragging={false} isEditable={isEditable} {...state.appearance} />}
                        {element.type === 'apps' && <AppsElement element={element} onEdit={handleEdit} isDragging={false} isEditable={isEditable} {...state.appearance} />}
                        {element.type === 'qrcode' && <QrCodeElement element={element} onEdit={handleEdit} isDragging={false} qrCodeColorDark={qrCodeColorDarkHex} isEditable={isEditable} {...state.appearance} />}
                        {element.type === 'calltoaction' && <CallToActionElement element={element} onEdit={handleEdit} isDragging={false} isEditable={isEditable} buttonWidth={state.appearance.buttonWidth} />}
                        {element.type === 'blocktext' && <BlockTextElement element={element} onEdit={handleEdit} isDragging={false} isEditable={isEditable} buttonWidth={state.appearance.buttonWidth} />}
                        {element.type === 'embed' && <EmbedElement element={element} onEdit={handleEdit} isDragging={false} isEditable={isEditable} buttonWidth={state.appearance.buttonWidth} />}
                    </div>
                ))}
            </div>
            {!hideFooter && state.appearance.footerEnabled && (
                <footer className="relative text-center pt-2 pb-2 px-6 flex-shrink-0" style={{ color: state.appearance.profileDescriptionColor, opacity: 0.7, fontSize: `${state.appearance.footerFontSize}px` }}>
                    {isEditable && <button className="absolute right-2 top-1/2 -translate-y-1/2 w-[22px] h-[22px] inline-flex items-center justify-center text-gray-500 z-20 hover:text-gray-800" aria-label="Edit footer" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleEdit({ type: 'footer', id: 'footer' }); }}><i className="fa-solid fa-pencil text-sm"></i></button>}
                    <p className="mt-1" dangerouslySetInnerHTML={{ __html: state.appearance.footerText }}></p>
                </footer>
            )}
        </main>
    );
};