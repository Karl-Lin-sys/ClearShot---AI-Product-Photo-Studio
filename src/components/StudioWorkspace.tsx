import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  SplitSquareVertical,
  Columns2,
  Eye,
  Sliders,
  Sun,
  Contrast,
  Palette,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { StudioSettings, BackgroundPreset } from "../types";

interface StudioWorkspaceProps {
  originalUrl: string;
  resultUrl: string | null;
  settings: StudioSettings;
  onChangeSettings: (updater: (prev: StudioSettings) => StudioSettings) => void;
  isProcessing: boolean;
}

export const StudioWorkspace: React.FC<StudioWorkspaceProps> = ({
  originalUrl,
  resultUrl,
  settings,
  onChangeSettings,
  isProcessing,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showAdjustments, setShowAdjustments] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Compute backdrop CSS
  const getBackdropStyle = useCallback(
    (preset: BackgroundPreset, customColor: string) => {
      switch (preset) {
        case "pure-white":
          return { backgroundColor: "#FFFFFF" };
        case "soft-gray":
          return { backgroundColor: "#F1F5F9" };
        case "warm-cream":
          return { backgroundColor: "#FAF7F2" };
        case "dark-slate":
          return { backgroundColor: "#0F172A" };
        case "custom":
          return { backgroundColor: customColor };
        case "transparent":
        default:
          return {};
      }
    },
    []
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDraggingSlider(true);
    updateSlider(e.clientX);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDraggingSlider) {
      updateSlider(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDraggingSlider(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const updateSlider = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const checkerboardClass =
    settings.checkerboardTheme === "dark"
      ? "bg-[linear-gradient(45deg,#1e293b_25%,transparent_25%),linear-gradient(-45deg,#1e293b_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#1e293b_75%),linear-gradient(-45deg,transparent_75%,#1e293b_75%)] bg-[size:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px] bg-slate-900"
      : "bg-[linear-gradient(45deg,#f1f5f9_25%,transparent_25%),linear-gradient(-45deg,#f1f5f9_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f1f5f9_75%),linear-gradient(-45deg,transparent_75%,#f1f5f9_75%)] bg-[size:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px] bg-white";

  const effectiveResult = resultUrl || originalUrl;

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Top Workspace Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        {/* View Mode Tabs */}
        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs font-semibold text-slate-700">
          <button
            type="button"
            onClick={() => onChangeSettings((s) => ({ ...s, viewMode: "split" }))}
            disabled={!resultUrl}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition ${
              settings.viewMode === "split" && resultUrl
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-500 hover:text-slate-900 disabled:opacity-40"
            }`}
          >
            <SplitSquareVertical className="h-3.5 w-3.5" />
            <span>Split Slider</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeSettings((s) => ({ ...s, viewMode: "side-by-side" }))}
            disabled={!resultUrl}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition ${
              settings.viewMode === "side-by-side" && resultUrl
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-500 hover:text-slate-900 disabled:opacity-40"
            }`}
          >
            <Columns2 className="h-3.5 w-3.5" />
            <span>Side-by-Side</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeSettings((s) => ({ ...s, viewMode: "result-only" }))}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition ${
              settings.viewMode === "result-only"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Clean Photo</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeSettings((s) => ({ ...s, viewMode: "original-only" }))}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition ${
              settings.viewMode === "original-only"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <span>Original Raw</span>
          </button>
        </div>

        {/* Right Tools: Adjustments toggle, Zoom, Checkerboard */}
        <div className="flex items-center gap-2">
          {settings.backgroundPreset === "transparent" && (
            <button
              type="button"
              onClick={() =>
                onChangeSettings((s) => ({
                  ...s,
                  checkerboardTheme: s.checkerboardTheme === "dark" ? "light" : "dark",
                }))
              }
              className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
              title="Toggle transparency checkerboard contrast"
            >
              {settings.checkerboardTheme === "dark" ? "☀️ Light Grid" : "🌙 Dark Grid"}
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowAdjustments(!showAdjustments)}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
              showAdjustments
                ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Retouch & Shadow</span>
          </button>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.2))}
              className="rounded p-1 text-slate-500 hover:bg-white hover:text-slate-800"
              title="Zoom out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="px-1 text-[11px] font-mono text-slate-600">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
              className="rounded p-1 text-slate-500 hover:bg-white hover:text-slate-800"
              title="Zoom in"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            {zoomLevel !== 1 && (
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className="rounded p-1 text-slate-500 hover:bg-white hover:text-slate-800"
                title="Reset zoom"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Retouch & Contact Shadow Drawer */}
      {showAdjustments && (
        <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:grid-cols-4">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-500" />
                Contact Shadow
              </span>
              <input
                type="checkbox"
                checked={settings.addContactShadow}
                onChange={(e) =>
                  onChangeSettings((s) => ({ ...s, addContactShadow: e.target.checked }))
                }
                className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </div>
            {settings.addContactShadow && (
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.05"
                value={settings.shadowOpacity}
                onChange={(e) =>
                  onChangeSettings((s) => ({ ...s, shadowOpacity: parseFloat(e.target.value) }))
                }
                className="mt-2 w-full accent-indigo-600"
              />
            )}
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1">
                <Sun className="h-3 w-3 text-amber-500" />
                Brightness
              </span>
              <span className="font-mono text-[11px] text-slate-500">{settings.brightness}%</span>
            </div>
            <input
              type="range"
              min="80"
              max="130"
              value={settings.brightness}
              onChange={(e) =>
                onChangeSettings((s) => ({ ...s, brightness: parseInt(e.target.value, 10) }))
              }
              className="mt-2 w-full accent-indigo-600"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1">
                <Contrast className="h-3 w-3 text-blue-500" />
                Contrast
              </span>
              <span className="font-mono text-[11px] text-slate-500">{settings.contrast}%</span>
            </div>
            <input
              type="range"
              min="80"
              max="130"
              value={settings.contrast}
              onChange={(e) =>
                onChangeSettings((s) => ({ ...s, contrast: parseInt(e.target.value, 10) }))
              }
              className="mt-2 w-full accent-indigo-600"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1">
                <Palette className="h-3 w-3 text-purple-500" />
                Saturation
              </span>
              <span className="font-mono text-[11px] text-slate-500">{settings.saturation}%</span>
            </div>
            <input
              type="range"
              min="70"
              max="140"
              value={settings.saturation}
              onChange={(e) =>
                onChangeSettings((s) => ({ ...s, saturation: parseInt(e.target.value, 10) }))
              }
              className="mt-2 w-full accent-indigo-600"
            />
          </div>
        </div>
      )}

      {/* Main Viewport Container */}
      <div
        ref={containerRef}
        className={`relative flex min-h-[460px] w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 select-none ${
          settings.backgroundPreset === "transparent" ? checkerboardClass : ""
        }`}
        style={getBackdropStyle(settings.backgroundPreset, settings.customBgColor)}
      >
        {/* Contact Shadow Layer (when applied to cleaned result) */}
        {settings.addContactShadow &&
          settings.backgroundPreset !== "transparent" &&
          resultUrl &&
          settings.viewMode !== "original-only" && (
            <div
              className="pointer-events-none absolute bottom-[18%] left-1/2 -translate-x-1/2 rounded-[100%] bg-slate-950 blur-xl transition-all"
              style={{
                width: "48%",
                height: "5%",
                opacity: settings.shadowOpacity,
              }}
            />
          )}

        {/* View mode 1: Split Slider */}
        {settings.viewMode === "split" && resultUrl ? (
          <div
            className="relative h-full w-full flex items-center justify-center p-4 cursor-ew-resize"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {/* Background image: Original Photo */}
            <div
              className="relative max-h-[580px] max-w-full overflow-hidden transition-transform"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <img
                src={originalUrl}
                alt="Original product with background"
                referrerPolicy="no-referrer"
                className="max-h-[560px] w-auto object-contain pointer-events-none"
              />

              {/* Foreground Image: Cleaned Photo clipped by slider position */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                }}
              >
                <img
                  src={resultUrl}
                  alt="Cleaned product"
                  referrerPolicy="no-referrer"
                  className="max-h-[560px] w-auto object-contain pointer-events-none"
                  style={{
                    filter: `brightness(${settings.brightness}%) contrast(${settings.contrast}%) saturate(${settings.saturation}%)`,
                  }}
                />
              </div>

              {/* Slider Line Divider */}
              <div
                className="absolute top-0 bottom-0 z-10 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-indigo-600 shadow-lg border border-slate-200">
                  <SplitSquareVertical className="h-4 w-4" />
                </div>
              </div>

              {/* Badges */}
              <span className="absolute bottom-3 left-3 rounded-md bg-indigo-600/90 px-2 py-1 text-[11px] font-bold text-white backdrop-blur-xs">
                Cleaned AI ({Math.round(sliderPosition)}%)
              </span>
              <span className="absolute bottom-3 right-3 rounded-md bg-slate-900/80 px-2 py-1 text-[11px] font-bold text-white backdrop-blur-xs">
                Original Photo
              </span>
            </div>
          </div>
        ) : settings.viewMode === "side-by-side" && resultUrl ? (
          /* View mode 2: Side-by-side */
          <div className="grid w-full h-full grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <div className="relative flex flex-col items-center justify-center rounded-xl bg-slate-50 p-2 border border-slate-200">
              <span className="absolute top-3 left-3 rounded-md bg-slate-900/80 px-2 py-1 text-[10px] font-bold text-white">
                Before: Original
              </span>
              <img
                src={originalUrl}
                alt="Before"
                referrerPolicy="no-referrer"
                className="max-h-[440px] w-auto object-contain"
              />
            </div>
            <div className="relative flex flex-col items-center justify-center rounded-xl bg-slate-50/50 p-2 border border-slate-200">
              <span className="absolute top-3 left-3 rounded-md bg-indigo-600 px-2 py-1 text-[10px] font-bold text-white">
                After: Cleaned Studio
              </span>
              <img
                src={resultUrl}
                alt="After"
                referrerPolicy="no-referrer"
                className="max-h-[440px] w-auto object-contain"
                style={{
                  filter: `brightness(${settings.brightness}%) contrast(${settings.contrast}%) saturate(${settings.saturation}%)`,
                }}
              />
            </div>
          </div>
        ) : settings.viewMode === "original-only" ? (
          /* View mode 3: Original only */
          <div
            className="p-4 transition-transform"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <img
              src={originalUrl}
              alt="Original raw product"
              referrerPolicy="no-referrer"
              className="max-h-[540px] w-auto object-contain"
            />
          </div>
        ) : (
          /* View mode 4: Result only (Default when result is ready) */
          <div
            className="p-4 transition-transform"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <img
              src={effectiveResult}
              alt="Product result"
              referrerPolicy="no-referrer"
              className="max-h-[540px] w-auto object-contain"
              style={{
                filter: `brightness(${settings.brightness}%) contrast(${settings.contrast}%) saturate(${settings.saturation}%)`,
              }}
            />
          </div>
        )}
      </div>

      {/* Bottom Information Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
          <span className="font-medium text-slate-700">
            {resultUrl ? "Photo cleaned & isolated" : "Ready for typed instructions"}
          </span>
          {settings.backgroundPreset !== "transparent" && (
            <span className="text-slate-400">
              • Backdrop: {settings.backgroundPreset}
            </span>
          )}
        </div>
        <div className="text-slate-400">
          Tip: Drag the slider handle or switch to Side-by-Side to inspect edges
        </div>
      </div>
    </div>
  );
};
