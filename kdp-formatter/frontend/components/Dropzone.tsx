"use client";

import { useCallback, useRef, useState } from "react";

interface DropzoneProps {
  file: File | null;
  onFileSelected: (file: File) => void;
}

const ACCEPTED_EXTENSIONS = [".txt", ".md", ".markdown"];

function isAcceptedFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
}

export default function Dropzone({ file, onFileSelected }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const candidate = files[0];
      if (!isAcceptedFile(candidate)) {
        setError("Solo se aceptan archivos .txt o .md");
        return;
      }
      setError(null);
      onFileSelected(candidate);
    },
    [onFileSelected]
  );

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-sm border border-dashed px-8 py-16 text-center transition-colors duration-300 ${
          isDragging
            ? "border-gold-200 bg-burgundy-900/20"
            : "border-gold-200/25 hover:border-gold-200/50 hover:bg-matte-900/40"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".txt,.md,.markdown"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <svg
          className="mb-5 h-10 w-10 text-gold-200/70 transition-transform duration-300 group-hover:-translate-y-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16.5V18a2 2 0 002 2h12a2 2 0 002-2v-1.5M7 10l5-5m0 0l5 5m-5-5v12"
          />
        </svg>

        {file ? (
          <div>
            <p className="font-display text-xl text-gold-100">{file.name}</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-cream/40">
              {(file.size / 1024).toFixed(0)} KB · haz clic para cambiar
            </p>
          </div>
        ) : (
          <div>
            <p className="font-display text-xl text-cream/90">
              Arrastra tu manuscrito aquí
            </p>
            <p className="mt-2 text-xs uppercase tracking-widest text-cream/40">
              .txt o .md · o haz clic para seleccionar
            </p>
          </div>
        )}
      </div>
      {error && <p className="mt-3 text-sm text-burgundy-600">{error}</p>}
    </div>
  );
}
