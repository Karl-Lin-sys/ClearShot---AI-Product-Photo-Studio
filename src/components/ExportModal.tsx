import React, { useState } from "react";
import { X, Download, Copy, Check, Sparkles, Image as ImageIcon, Sliders } from "lucide-react";
import { StudioSettings } from "../types";
import {
  renderCompositedProduct,
  triggerDownload,
  copyImageToClipboard,
  ExportOptions,
} from "../utils/imageProcessing";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  resultUrl: string;
  settings: StudioSettings;
}

interface ExportPreset {
  id: string;
  name: string;
  subtitle: string;
  width: number;
  height: number;
  format: "image/png" | "image/jpeg";
  defaultBg: string | null; // null = transparent
  addShadow: boolean;
}

const PRESETS: ExportPreset[] = [
  {
    id: "amazon",
    name: "Amazon Commercial Standard",
    subtitle: "2000 × 2000 px, Pure White (#FFFFFF), Contact Shadow",
    width: 2000,
    height: 2000,
    format: "image/jpeg",
    defaultBg: "#FFFFFF",
    addShadow: true,
  },
  {
    id: "shopify-png",
    name: "Shopify / Web Alpha Cutout",
    subtitle: "2000 × 2000 px, Full Transparency PNG",
    width: 2000,
    height: 2000,
    format: "image/png",
    defaultBg: null,
    addShadow: false,
  },
  {
    id: "instagram-portrait",
    name: "Social / Lookbook (4:5)",
    subtitle: "1080 × 1350 px, Optimized for mobile displays",
    width: 1080,
    height: 1350,
    format: "image/jpeg",
    defaultBg: "#FFFFFF",
    addShadow: true,
  },
  {
    id: "banner-landscape",
    name: "Hero Banner (16:9)",
    subtitle: "1920 × 1080 px, Wide desktop storefront",
    width: 1920,
    height: 1080,
    format: "image/jpeg",
    defaultBg: "#F1F5F9",
    addShadow: true,
  },
];

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  resultUrl,
  settings,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("amazon");
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentPreset = PRESETS.find((p) => p.id === selectedPresetId) || PRESETS[0];

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      const options: ExportOptions = {
        width: currentPreset.width,
        height: currentPreset.height,
        format: currentPreset.format,
        backgroundColor: currentPreset.defaultBg,
        addContactShadow: currentPreset.addShadow,
        shadowOpacity: settings.shadowOpacity,
        brightness: settings.brightness,
        contrast: settings.contrast,
        saturation: settings.saturation,
      };

      const finalDataUrl = await renderCompositedProduct(resultUrl, options);
      const ext = currentPreset.format === "image/png" ? "png" : "jpg";
      const filename = `clearshot-product-${currentPreset.id}-${Date.now()}.${ext}`;
      triggerDownload(finalDataUrl, filename);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyClipboard = async () => {
    setIsExporting(true);
    try {
      const options: ExportOptions = {
        width: currentPreset.width,
        height: currentPreset.height,
        format: "image/png", // Clipboard standard
        backgroundColor: currentPreset.defaultBg,
        addContactShadow: currentPreset.addShadow,
        shadowOpacity: settings.shadowOpacity,
        brightness: settings.brightness,
        contrast: settings.contrast,
        saturation: settings.saturation,
      };
      const finalDataUrl = await renderCompositedProduct(resultUrl, options);
      const ok = await copyImageToClipboard(finalDataUrl);
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      console.error("Copy error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Export Cleaned Product</h3>
            <p className="text-xs text-slate-500">
              Select an e-commerce preset or download master resolution
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Preset Selection */}
        <div className="mt-4 space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Marketplace & Web Standards
          </label>
          <div className="space-y-2">
            {PRESETS.map((preset) => {
              const isSelected = preset.id === selectedPresetId;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedPresetId(preset.id)}
                  className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600/20"
                      : "border-slate-200 bg-slate-50/40 hover:border-indigo-300 hover:bg-white"
                  }`}
                >
                  <div className="min-w-0 pr-3">
                    <p className="text-xs font-bold text-slate-900">{preset.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{preset.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-white px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-600 border border-slate-200">
                      {preset.format === "image/png" ? "PNG" : "JPG"}
                    </span>
                    {isSelected && <Check className="h-4 w-4 text-indigo-600" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={handleCopyClipboard}
            disabled={isExporting}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 px-4 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.99] disabled:opacity-50"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-slate-500" />
                <span>Copy Image</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 px-4 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>Download {currentPreset.format === "image/png" ? "PNG" : "JPG"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
