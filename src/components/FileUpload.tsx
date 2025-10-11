import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { FileIcon } from './icons/FileIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { LoaderIcon } from './icons/LoaderIcon';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  fileName: string;
  hasFile: boolean;
  isParsing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, fileName, hasFile, isParsing }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement | HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };
  
  const handleClearFile = () => {
      onFileSelect(null);
  }

  if (isParsing) {
      return (
        <div className="flex items-center justify-center p-3 h-[76px] bg-slate-100 border-2 border-slate-200 rounded-lg">
            <LoaderIcon className="h-6 w-6 text-indigo-600 animate-spin" />
            <span className="text-sm font-medium text-slate-600 ml-3">Parsing file...</span>
        </div>
    );
  }

  if (hasFile) {
    return (
        <div className="flex items-center justify-between p-3 h-[76px] bg-indigo-50 border-2 border-indigo-200 rounded-lg">
            <div className="flex items-center space-x-3 overflow-hidden">
                <FileIcon className="h-6 w-6 text-indigo-600 flex-shrink-0" />
                <span className="text-sm font-medium text-slate-700 truncate" title={fileName}>{fileName}</span>
            </div>
            <button onClick={handleClearFile} className="text-slate-500 hover:text-red-600 transition-colors flex-shrink-0">
                <XCircleIcon className="h-6 w-6" />
            </button>
        </div>
    );
  }

  return (
    <form onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()} className="relative">
      <label
        htmlFor="dropzone-file"
        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
        }`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadIcon className="w-8 h-8 mb-4 text-slate-500" />
          <p className="mb-2 text-sm text-slate-500">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-slate-500">TXT, DOCX, or PDF</p>
        </div>
        <input id="dropzone-file" type="file" className="hidden" onChange={handleChange} accept=".txt,.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
      </label>
      {dragActive && (
        <div
          className="absolute inset-0 w-full h-full rounded-lg"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        ></div>
      )}
    </form>
  );
};