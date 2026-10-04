import React from "react";
import { Sparkles, Download, RotateCcw, Image as ImageIcon, Zap } from "lucide-react";

interface NavbarProps {
  hasImage: boolean;
  hasResult: boolean;
  onReset: () => void;
  onOpenExport: () => void;
  onNewImage: () => void;
  hasApiKey: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  hasImage,
  hasResult,
  onReset,
  onOpenExport,
  onNewImage,
  hasApiKey,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-teal-400 text-white shadow-md shadow-blue-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-slate-900 text-lg sm:text-xl">
                ClearShot
              </span>
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200/60">
                AI Studio
              </span>
            </div>
            <p className="hidden text-xs text-slate-500 sm:block">
              Remove backgrounds & clean up product photos with instructions
            </p>
          </div>
        </div>

        {/* Model info & Action buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
            <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            <span className="font-medium">gemini-3.1-flash-image</span>
          </div>

          {hasImage && (
            <button
              onClick={onNewImage}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-95"
              title="Upload another product image"
            >
              <ImageIcon className="h-3.5 w-3.5 text-slate-500" />
              <span className="hidden sm:inline">New Product</span>
            </button>
          )}

          {hasResult && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-95"
              title="Revert back to original photo"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          {hasResult && (
            <button
              onClick={onOpenExport}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm shadow-indigo-600/30 transition hover:bg-indigo-700 active:scale-95"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Photo</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
