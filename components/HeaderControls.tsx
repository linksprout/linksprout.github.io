import React from 'react';

interface HeaderControlsProps {
    onLoad: () => void;
    onSave: () => void;
    onDownload: () => void;
    onDeploy: () => void;
    onPreview: () => void;
    onAdd: () => void;
    onSettings: () => void;
    onRandomize: () => void;
}

export const HeaderControls: React.FC<HeaderControlsProps> = ({ onLoad, onSave, onDownload, onDeploy, onPreview, onAdd, onSettings, onRandomize }) => {
    return (
        <header className="fixed top-16 left-0 right-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center p-2">
                {/* Left Controls */}
                <div className="flex items-center gap-2">
                    <button onClick={onLoad} title="Load Saved Sites" className="w-9 h-9 rounded-full bg-purple-500 text-white shadow flex items-center justify-center transition-transform hover:scale-105 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path></svg>
                    </button>
                    <button onClick={onSave} title="Save Current Site" className="w-9 h-9 rounded-full bg-indigo-500 text-white shadow flex items-center justify-center transition-transform hover:scale-105 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                    </button>
                    <button onClick={onDownload} title="Download or Install" className="w-9 h-9 rounded-full bg-green-500 text-white shadow flex items-center justify-center transition-transform hover:scale-105 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    </button>
                    <button onClick={onDeploy} title="Deploy Site" className="w-9 h-9 rounded-full bg-sky-500 text-white shadow flex items-center justify-center transition-transform hover:scale-105 text-sm">
                        <i className="fa-solid fa-cloud-arrow-up" aria-hidden="true"></i>
                    </button>
                    <button onClick={onPreview} title="Preview in new tab" className="w-9 h-9 rounded-full bg-teal-500 text-white shadow flex items-center justify-center transition-transform hover:scale-105 text-sm">
                        <i className="fa-solid fa-eye" aria-hidden="true"></i>
                    </button>
                </div>
                {/* Right Controls */}
                <div className="flex items-center gap-2">
                    <button onClick={onAdd} title="Add Element" className="w-9 h-9 rounded-full bg-blue-700 text-white shadow flex items-center justify-center transition-transform hover:scale-105 text-sm">
                        <i className="fa-solid fa-plus" aria-hidden="true"></i>
                    </button>
                    <button onClick={onSettings} title="Page & Background Settings" className="w-9 h-9 rounded-full bg-slate-700 text-white shadow flex items-center justify-center transition-transform hover:scale-105 text-sm">
                        <i className="fa-solid fa-gear" aria-hidden="true"></i>
                    </button>
                    <button onClick={onRandomize} title="Randomize Colors" className="w-9 h-9 rounded-full bg-amber-500 text-white shadow flex items-center justify-center transition-transform hover:scale-105 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M23 10a10 10 0 0 0-16.9-6.5L7 8"/><path d="M1 14a10 10 0 0 0 16.9 6.5L17 16"/></svg>
                    </button>
                </div>
            </div>
        </header>
    );
};