import React, { useRef, useState, useEffect } from "react";
import { Upload, Sparkles, Wand2, ShieldCheck, ArrowRight, Layers, Camera } from "lucide-react";
import { SAMPLE_PRODUCTS } from "../utils/sampleData";
import { SampleProduct } from "../types";

interface ImageDropzoneProps {
  onSelectImage: (imageDataUrl: string, samplePrompt?: string) => void;
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({ onSelectImage }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Global paste handler (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.result) {
                onSelectImage(event.target.result as string);
              }
            };
            reader.readAsDataURL(blob);
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [onSelectImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onSelectImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onSelectImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Hero Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/70 px-3.5 py-1 text-xs font-semibold text-indigo-700 mb-4">
          <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
          <span>Next-Gen Gemini 3.1 Commercial Photo Clean</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          Clean product photos just by{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-teal-500 bg-clip-text text-transparent">
            typing what you want
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
          Effortlessly remove cluttered backgrounds, generate Amazon-compliant pure white backdrops, eliminate reflections, or stage on luxury podiums using natural language.
        </p>
      </div>

      {/* Upload Box */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-200 ${
          isDragging
            ? "border-indigo-500 bg-indigo-50/50 scale-[1.01]"
            : "border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50/60 hover:shadow-xl shadow-sm"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex flex-col items-center justify-center px-6 py-14 text-center sm:py-20">
          <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white">
            <Upload className="h-9 w-9 transition-transform" />
            <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-teal-500 text-white shadow">
              <Camera className="h-3.5 w-3.5" />
            </div>
          </div>

          <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
            Drop your product photo here, or{" "}
            <span className="text-indigo-600 underline decoration-indigo-300 underline-offset-4">
              browse files
            </span>
          </h3>
          <p className="mt-2 text-sm text-slate-500 max-w-md">
            Supports high-res PNG, JPG, or WEBP up to 25MB. Or simply press{" "}
            <kbd className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-700 shadow-sm">
              Ctrl+V
            </kbd>{" "}
            to paste from clipboard.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              100% Geometry Preservation
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-blue-600" />
              Transparent Alpha or 255 White
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Wand2 className="h-4 w-4 text-purple-600" />
              Typed Instruction Driven
            </span>
          </div>
        </div>
      </div>

      {/* Preset Product Demos */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              No photo ready? Try a sample product with messy background
            </h2>
            <p className="text-xs text-slate-400">
              Click any photo below to test background removal and studio cleanup immediately
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SAMPLE_PRODUCTS.map((prod: SampleProduct) => (
            <button
              key={prod.id}
              onClick={() => onSelectImage(prod.dataUrl, prod.defaultPrompt)}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md active:translate-y-0"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-100">
                <img
                  src={prod.dataUrl}
                  alt={prod.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute top-2 left-2 rounded-md bg-slate-900/75 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                  {prod.category}
                </span>
              </div>
              <div className="mt-3 flex flex-1 flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600">
                    {prod.name}
                  </h4>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                    {prod.description}
                  </p>
                </div>
                <div className="mt-3 flex items-center text-xs font-semibold text-indigo-600">
                  <span>Load Sample</span>
                  <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
