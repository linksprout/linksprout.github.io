import React, { useState, useEffect, useRef } from 'react';
import type { SavedSite } from '../types';
// Fix: Corrected typo in NETLIFY_AFFILIATE_LINK import.
import { NETLIFY_AFFILIATE_LINK, VERCEL_AFFILIATE_LINK } from '../credentials';

declare const QRCode: any;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50" style={{ zIndex: 100 }} onClick={onClose}></div>
      <div 
        className="fixed top-36 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md bg-white rounded-lg shadow-2xl flex flex-col max-h-[calc(100vh-10rem)]"
        style={{ zIndex: 101 }}
      >
        <div className="flex-shrink-0 flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-2xl font-bold">&times;</button>
        </div>
        <div className="p-5 flex-grow overflow-y-auto custom-scrollbar">
            {children}
        </div>
      </div>
    </>
  );
};

interface LoadModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedSites: SavedSite[];
  onLoadSite: (id: number) => void;
  onDeleteSite: (id: number) => void;
}

export const LoadModal: React.FC<LoadModalProps> = ({ isOpen, onClose, savedSites, onLoadSite, onDeleteSite }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Load a Saved Site">
    {savedSites.length === 0 ? (
      <p className="text-slate-500 text-center">No saved sites found.</p>
    ) : (
      savedSites.map(site => (
        <div key={site.id} className="flex justify-between items-center p-2 rounded-lg hover:bg-slate-100">
          <span className="font-medium text-slate-900">{site.name}</span>
          <div className="space-x-2">
            <button
              onClick={() => onLoadSite(site.id)}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Load
            </button>
            <button
              onClick={() => onDeleteSite(site.id)}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))
    )}
  </Modal>
);

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

export const SaveModal: React.FC<SaveModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');

  const handleSaveClick = () => {
    if (name.trim()) {
      onSave(name.trim());
      onClose();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        handleSaveClick();
    }
  }

  useEffect(() => {
    if (isOpen) {
        setName('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Save Site">
      <div className="space-y-4">
        <label htmlFor="site-name" className="block text-sm font-medium text-slate-700">
          Site Name
        </label>
        <input
          type="text"
          id="site-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="My Awesome Page"
          className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-slate-900 placeholder:text-slate-400"
          autoFocus
        />
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-slate-100 rounded-md hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveClick}
            disabled={!name.trim()}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};


interface AddElementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (type: 'buttonarray' | 'apps' | 'qrcode' | 'calltoaction' | 'blocktext' | 'embed') => void;
}

export const AddElementModal: React.FC<AddElementModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [addType, setAddType] = useState<'buttonarray' | 'apps' | 'qrcode' | 'calltoaction' | 'blocktext' | 'embed'>('buttonarray');

    const handleAdd = () => {
        onAdd(addType);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Element">
            <div className="space-y-3">
                <label className="block text-slate-700 p-2 rounded-md hover:bg-slate-50"><input type="radio" name="add-type" value="buttonarray" checked={addType === 'buttonarray'} onChange={() => setAddType('buttonarray')} className="mr-2" /> Button Array</label>
                <label className="block text-slate-700 p-2 rounded-md hover:bg-slate-50"><input type="radio" name="add-type" value="apps" checked={addType === 'apps'} onChange={() => setAddType('apps')} className="mr-2" /> Apps Bar (up to 4 icons)</label>
                <label className="block text-slate-700 p-2 rounded-md hover:bg-slate-50"><input type="radio" name="add-type" value="qrcode" checked={addType === 'qrcode'} onChange={() => setAddType('qrcode')} className="mr-2" /> QR Code</label>
                <label className="block text-slate-700 p-2 rounded-md hover:bg-slate-50"><input type="radio" name="add-type" value="calltoaction" checked={addType === 'calltoaction'} onChange={() => setAddType('calltoaction')} className="mr-2" /> Call to Action</label>
                <label className="block text-slate-700 p-2 rounded-md hover:bg-slate-50"><input type="radio" name="add-type" value="blocktext" checked={addType === 'blocktext'} onChange={() => setAddType('blocktext')} className="mr-2" /> Block Text</label>
                <label className="block text-slate-700 p-2 rounded-md hover:bg-slate-50"><input type="radio" name="add-type" value="embed" checked={addType === 'embed'} onChange={() => setAddType('embed')} className="mr-2" /> Embed Content</label>
            </div>
            <div className="mt-4 flex justify-end gap-2 pt-4 border-t">
                <button onClick={onClose} className="px-4 py-2 text-sm bg-slate-100 rounded-md hover:bg-slate-200">Cancel</button>
                <button onClick={handleAdd} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Add Element</button>
            </div>
        </Modal>
    );
};

interface DownloadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDownloadHtml: () => void;
    onDownloadZip: () => void;
    onInstallPwa: () => void;
    isPwaInstallable: boolean;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose, onDownloadHtml, onDownloadZip, onInstallPwa, isPwaInstallable }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Download or Install">
            <div className="space-y-3">
                <button
                    onClick={onDownloadZip}
                    className="w-full flex items-center gap-4 p-4 rounded-lg border hover:bg-slate-50 hover:border-blue-500 transition-all text-left"
                >
                    <div className="text-3xl w-10 text-center flex-shrink-0">📦</div>
                    <div>
                        <h4 className="font-bold text-slate-800">Download ZIP</h4>
                        <p className="text-xs text-slate-500">Includes HTML, manifest, and icons. Best for deploying.</p>
                    </div>
                </button>
                <button
                    onClick={onDownloadHtml}
                    className="w-full flex items-center gap-4 p-4 rounded-lg border hover:bg-slate-50 hover:border-blue-500 transition-all text-left"
                >
                    <div className="text-3xl w-10 text-center flex-shrink-0">📄</div>
                    <div>
                        <h4 className="font-bold text-slate-800">HTML Only</h4>
                        <p className="text-xs text-slate-500">A single, self-contained HTML file for simple sharing.</p>
                    </div>
                </button>
                <button
                    onClick={onInstallPwa}
                    disabled={!isPwaInstallable}
                    className="w-full flex items-center gap-4 p-4 rounded-lg border hover:bg-slate-50 hover:border-blue-500 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-slate-200"
                >
                    <div className="text-3xl w-10 text-center flex-shrink-0">📱</div>
                    <div>
                        <h4 className="font-bold text-slate-800">Install as App</h4>
                        <p className="text-xs text-slate-500">{isPwaInstallable ? "Add this site to your Home Screen." : "Already installed or not supported."}</p>
                    </div>
                </button>
            </div>
            <div className="pt-4 mt-2 flex justify-end">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-slate-200 text-slate-800 text-base font-medium rounded-md shadow-sm hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-300"
                >
                    Close
                </button>
            </div>
        </Modal>
    );
};

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const deploymentServices = [
    {
        id: 'github',
        name: 'GitHub Pages',
        logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/github/github-original.svg',
        description: 'Best for simple, free hosting with a .github.io domain.',
        link: 'https://pages.github.com/',
        guide: 'https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site'
    },
    {
        id: 'netlify',
        name: 'Netlify',
        logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/netlify/netlify-original.svg',
        description: 'Powerful free tier with continuous deployment and plugins.',
        link: NETLIFY_AFFILIATE_LINK,
        guide: 'https://docs.netlify.com/site-deploys/create-deploys/#drag-and-drop'
    },
    {
        id: 'vercel',
        name: 'Vercel',
        logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/vercel/vercel-original.svg',
        description: 'Ideal for modern frontend frameworks with a generous free plan.',
        link: VERCEL_AFFILIATE_LINK,
        guide: 'https://vercel.com/docs/deployments/static-sites'
    },
    {
        id: 'selfhost',
        name: 'Self-Host / Other',
        logo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxyZWN0IHg9IjIiIHk9IjIiIHdpZHRoPSIyMCIgaGVpZHRoPSI4IiByeD0iMiIgcnk9IjIiLz48cmVjdCB4PSIyIiB5PSIxNCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjgiIHJ4PSIyIiByeT0iMiIvPjxsaW5lIHgxPSI2IiB5MT0iNiIgeDI9IjYiIHkyPSI2Ii8+PGxpbmUgeDE9IjYiIHkxPSIxOCIgeDI9IjYiIHkyPSIxOCIvPjwvc3ZnPg==',
        description: 'Upload the files to any paid host (e.g., AWS S3) or your own server.',
        link: '#',
        guide: 'https://www.google.com/search?q=how+to+host+static+html+website'
    }
];

export const DeployModal: React.FC<DeployModalProps> = ({ isOpen, onClose }) => {
    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) {
            // Reset state when modal closes
            setTimeout(() => setSelectedServiceId(null), 300);
        }
    }, [isOpen]);

    const selectedService = deploymentServices.find(s => s.id === selectedServiceId);

    const renderServiceList = () => (
        <div className="space-y-4">
            <p className="text-sm text-slate-600">Choose a provider to see deployment instructions. Most offer a generous free tier for static sites like this.</p>
            {deploymentServices.map(service => (
                <button
                    key={service.id}
                    onClick={() => setSelectedServiceId(service.id)}
                    className="w-full flex items-center gap-4 p-4 rounded-lg border hover:bg-slate-50 hover:border-blue-500 transition-all text-left"
                >
                    <img src={service.logo} alt={service.name} className="h-10 w-10 flex-shrink-0 object-contain" />
                    <div>
                        <h4 className="font-bold text-slate-800">{service.name}</h4>
                        <p className="text-xs text-slate-500">{service.description}</p>
                    </div>
                </button>
            ))}
            <div className="pt-4 flex justify-end">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-slate-200 text-slate-800 text-base font-medium rounded-md shadow-sm hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-300"
                >
                    Close
                </button>
            </div>
        </div>
    );

    const renderInstructions = () => {
        if (!selectedService) return null;
        return (
            <div className="space-y-6 text-sm text-slate-600">
                <button onClick={() => setSelectedServiceId(null)} className="flex items-center gap-2 text-blue-600 font-semibold mb-2 hover:underline">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                    Back to Services
                </button>
                <div className="space-y-2">
                    <h4 className="font-bold text-base text-slate-800">Step 1: Download Your Site Files</h4>
                    <p>First, close this window and click the <i className="fa-solid fa-download mx-1"></i> <strong>Download</strong> button. This will give you a <code className="bg-slate-100 p-1 rounded text-xs">.zip</code> file. Unzip it.</p>
                </div>
                <div className="space-y-2">
                    <h4 className="font-bold text-base text-slate-800">Step 2: Follow the Guide</h4>
                    <p>
                        Each hosting provider has a simple process for uploading static files. Follow the official guide from <strong>{selectedService.name}</strong> to get your site live.
                    </p>
                    <a
                        href={selectedService.guide}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center mt-2 px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        View {selectedService.name} Guide
                        <i className="fa-solid fa-arrow-up-right-from-square ml-2 text-xs"></i>
                    </a>
                </div>
            </div>
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Deploy Your Site">
            {selectedServiceId ? renderInstructions() : renderServiceList()}
        </Modal>
    );
};

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
    onDownloadHtml: () => void;
    onInstallPwa: () => void;
    isPwaInstallable: boolean;
    appName: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, url, onDownloadHtml, onInstallPwa, isPwaInstallable, appName }) => {
    const qrRef = useRef<HTMLDivElement>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (isOpen && qrRef.current && url && typeof QRCode !== 'undefined') {
            qrRef.current.innerHTML = '';
            new QRCode(qrRef.current, {
                text: url,
                width: 160,
                height: 160,
                colorDark: '#000000',
                colorLight: '#ffffff',
            });
        }
    }, [isOpen, url]);
    
    const handleCopy = () => {
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Share "${appName}"`}>
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 rounded-lg">
                    <div ref={qrRef} className="p-2 bg-white rounded-md shadow-sm flex-shrink-0"></div>
                    <div className="flex-grow text-center sm:text-left">
                        <p className="text-sm text-slate-600 mb-2">Share this QR code or copy the link below.</p>
                        <div className="flex">
                            <input type="text" readOnly value={url} className="w-full p-2 border border-slate-300 rounded-l-md text-sm bg-white" />
                            <button onClick={handleCopy} className="px-3 bg-blue-500 text-white rounded-r-md text-sm font-semibold w-24">
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                </div>

                <h4 className="text-sm font-semibold text-slate-500 pt-2 border-t mt-4">Other Sharing Options</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                        onClick={() => { onDownloadHtml(); onClose(); }}
                        className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-slate-50 transition-all text-left"
                    >
                        <div className="text-2xl w-8 text-center flex-shrink-0">📄</div>
                        <div>
                            <h5 className="font-bold text-slate-800 text-sm">Download HTML</h5>
                            <p className="text-xs text-slate-500">Share the file directly.</p>
                        </div>
                    </button>
                    <button
                        onClick={() => { onInstallPwa(); onClose(); }}
                        disabled={!isPwaInstallable}
                        className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-slate-50 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="text-2xl w-8 text-center flex-shrink-0">📱</div>
                        <div>
                            <h5 className="font-bold text-slate-800 text-sm">Install App</h5>
                            <p className="text-xs text-slate-500">Add to Home Screen.</p>
                        </div>
                    </button>
                </div>

                <div className="pt-4 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-slate-200 rounded-md hover:bg-slate-300">Close</button>
                </div>
            </div>
        </Modal>
    );
};