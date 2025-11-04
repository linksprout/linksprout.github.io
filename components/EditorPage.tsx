import React, { useLayoutEffect, useRef, useState } from 'react';
import { useEditorState } from '../hooks/useEditorState';
import { useIsDesktop } from '../hooks/useIsDesktop';
import { HeaderControls } from './HeaderControls';
import { SiteCard } from './SiteCard';
import EditPopover from './EditPopover';
import { AdBanner } from '../App';
import { LoadModal, AddElementModal, SaveModal, DeployModal, DownloadModal, ShareModal } from './Modals';
import type { Profile } from '../types';

export const EditorPage: React.FC = () => {
    const {
        state,
        editingTarget,
        setEditingTarget,
        isLoadModalOpen,
        setIsLoadModalOpen,
        isAddModalOpen,
        setIsAddModalOpen,
        isSaveModalOpen,
        setIsSaveModalOpen,
        isDeployModalOpen,
        setIsDeployModalOpen,
        isDownloadModalOpen,
        setIsDownloadModalOpen,
        isShareModalOpen,
        setIsShareModalOpen,
        shareUrl,
        setShareUrl,
        savedSites,
        installPromptEvent,
        isDragging,
        draggedItem,
        dragOverItem,
        profileNameFirstLetter,
        loadSites,
        handleLoadSite,
        handleSaveSite,
        handleDeleteSite,
        handleUpdateAppearance,
        handleUpdateBackgroundConfig,
        handleUpdateRandomizeSetting,
        handleUpdatePwaSettings,
        handleUpdatePwaIconConfig,
        handlePwaIconUpload,
        handleUploadCustomFont,
        handleAddElement,
        handleUpdateElement,
        handleRemoveElement,
        handleUpdateApp,
        handleRemoveApp,
        handleAddApp,
        handleUpdateButtonInArray,
        handleRemoveButtonFromArray,
        handleAddButtonToArray,
        handleUpdateMenuSettings,
        handleAddMenuItem,
        handleUpdateMenuItem,
        handleRemoveMenuItem,
        handleDragStart,
        handleDragEnter,
        handleDragEnd,
        handleDownloadHtml,
        handleDownloadZip,
        handleInstallPwa,
        handlePreview,
        randomizeAll,
        generatePwaIconSVG
    } = useEditorState();

    const cardRef = useRef<HTMLElement>(null);
    const [cardHeight, setCardHeight] = useState<number | null>(null);
    const isDesktop = useIsDesktop();

    useLayoutEffect(() => {
        if (!isDesktop) return;
        const measureHeight = () => {
            if (cardRef.current) {
                setCardHeight(cardRef.current.offsetHeight);
            }
        };
        measureHeight();
        const resizeObserver = new ResizeObserver(measureHeight);
        if (cardRef.current) {
            resizeObserver.observe(cardRef.current);
        }
        return () => {
            if (cardRef.current) {
                resizeObserver.unobserve(cardRef.current);
            }
        };
    }, [isDesktop, state.elements, state.appearance]);

    const handleOpenShareModal = (url: string) => {
        setShareUrl(url);
        setIsShareModalOpen(true);
    };
    
    const isPrimaryModalOpen = isLoadModalOpen || isSaveModalOpen || isAddModalOpen || isDeployModalOpen || isDownloadModalOpen || isShareModalOpen;

    return (
        <div className="pt-16 min-h-screen">
            <HeaderControls
                onLoad={() => { loadSites(); setIsLoadModalOpen(true); }}
                onSave={() => setIsSaveModalOpen(true)}
                onDownload={() => setIsDownloadModalOpen(true)}
                onDeploy={() => setIsDeployModalOpen(true)}
                onPreview={handlePreview}
                onAdd={() => setIsAddModalOpen(true)}
                onSettings={() => setEditingTarget({ type: 'settings', id: 'settings' })}
                onRandomize={randomizeAll}
            />
            
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-center gap-8 pt-16 pb-4 px-4">
                <div className="w-full md:w-auto md:sticky md:top-36 md:self-start flex-shrink-0">
                    <SiteCard
                        state={state}
                        isEditable
                        onEdit={setEditingTarget}
                        onDragStart={handleDragStart}
                        onDragEnter={handleDragEnter}
                        onDragEnd={handleDragEnd}
                        isDragging={isDragging}
                        draggedItemId={draggedItem.current?.id || null}
                        forwardedRef={cardRef}
                        onShare={handleOpenShareModal}
                        onInstallPwa={handleInstallPwa}
                    />
                </div>

                {editingTarget && (
                    <EditPopover
                        target={editingTarget}
                        appearance={state.appearance}
                        randomizeSettings={state.randomizeSettings}
                        pwaSettings={state.pwaSettings}
                        profileNameFirstLetter={profileNameFirstLetter}
                        onClose={() => setEditingTarget(null)}
                        onUpdateElement={handleUpdateElement}
                        onUpdateAppearance={handleUpdateAppearance}
                        onUpdateBackgroundConfig={handleUpdateBackgroundConfig}
                        onUpdateRandomizeSetting={handleUpdateRandomizeSetting}
                        onRemoveElement={handleRemoveElement}
                        onUpdateApp={handleUpdateApp}
                        onRemoveApp={handleRemoveApp}
                        onAddApp={handleAddApp}
                        onUploadCustomFont={handleUploadCustomFont}
                        onUpdatePwaSettings={handleUpdatePwaSettings}
                        onUpdatePwaIconConfig={handleUpdatePwaIconConfig}
// Fix: Corrected typo. The prop expected `handlePwaIconUpload` but was passed an undefined variable `onPwaIconUpload`.
                        onPwaIconUpload={handlePwaIconUpload}
                        generatePwaIconSVG={generatePwaIconSVG}
                        isDesktop={isDesktop}
                        isPrimaryModalOpen={isPrimaryModalOpen}
                        cardHeight={cardHeight}
                        onUpdateButtonInArray={handleUpdateButtonInArray}
                        onRemoveButtonFromArray={handleRemoveButtonFromArray}
                        onAddButtonToArray={handleAddButtonToArray}
                        menuSettings={state.menuSettings}
                        onUpdateMenuSettings={handleUpdateMenuSettings}
                        onAddMenuItem={handleAddMenuItem}
                        onUpdateMenuItem={handleUpdateMenuItem}
                        onRemoveMenuItem={handleRemoveMenuItem}
                    />
                )}
            </div>
            <div className="w-full md:w-[48rem] mx-auto px-4 pb-8">
                <AdBanner />
            </div>

            <LoadModal isOpen={isLoadModalOpen} onClose={() => setIsLoadModalOpen(false)} savedSites={savedSites} onLoadSite={handleLoadSite} onDeleteSite={handleDeleteSite} />
            <SaveModal isOpen={isSaveModalOpen} onClose={() => setIsSaveModalOpen(false)} onSave={handleSaveSite} />
            <AddElementModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddElement} />
            <DeployModal isOpen={isDeployModalOpen} onClose={() => setIsDeployModalOpen(false)} />
            <DownloadModal 
                isOpen={isDownloadModalOpen} 
                onClose={() => setIsDownloadModalOpen(false)} 
                onDownloadHtml={handleDownloadHtml}
                onDownloadZip={handleDownloadZip}
                onInstallPwa={handleInstallPwa}
                isPwaInstallable={!!installPromptEvent}
            />
            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                url={shareUrl}
                onDownloadHtml={handleDownloadHtml}
                onInstallPwa={handleInstallPwa}
                isPwaInstallable={!!installPromptEvent}
                appName={(state.elements.find(e => e.type === 'profile') as Profile | undefined)?.name || 'My Page'}
            />
        </div>
    );
};