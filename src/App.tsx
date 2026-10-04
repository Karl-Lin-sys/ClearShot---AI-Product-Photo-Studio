/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "./components/Navbar";
import { ImageDropzone } from "./components/ImageDropzone";
import { InstructionEditor } from "./components/InstructionEditor";
import { StudioWorkspace } from "./components/StudioWorkspace";
import { VersionHistory } from "./components/VersionHistory";
import { ExportModal } from "./components/ExportModal";
import {
  StudioSettings,
  HistoryItem,
  ProcessingState,
  AspectRatio,
  BackgroundPreset,
} from "./types";
import { clientSmartCutout } from "./utils/imageProcessing";
import { AlertCircle, Key, ExternalLink, Sparkles, RefreshCcw } from "lucide-react";

export default function App() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentVersionId, setCurrentVersionId] = useState<string>("");
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);

  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    stage: "",
    progressPercent: 0,
    error: null,
    requiresKeySelection: false,
  });

  const [settings, setSettings] = useState<StudioSettings>({
    aspectRatio: "1:1",
    backgroundPreset: "pure-white",
    customBgColor: "#F3F4F6",
    addContactShadow: true,
    shadowBlur: 18,
    shadowOpacity: 0.35,
    brightness: 100,
    contrast: 100,
    saturation: 100,
    viewMode: "split",
    checkerboardTheme: "light",
  });

  // Check health on mount
  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then((data) => {
        setHasApiKey(Boolean(data.hasApiKey));
      })
      .catch(() => {});
  }, []);

  // Fetch smart suggestions when a new original image is loaded
  const fetchSuggestions = useCallback(async (imageSrc: string) => {
    setIsSuggesting(true);
    try {
      const res = await fetch("/api/suggest-instructions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageSrc }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.suggestions)) {
        setSuggestedPrompts(data.suggestions);
      }
    } catch (err) {
      console.warn("Could not fetch suggestions:", err);
    } finally {
      setIsSuggesting(false);
    }
  }, []);

  // Handler when user uploads or clicks a sample image
  const handleSelectImage = (imageDataUrl: string, samplePrompt?: string) => {
    setOriginalImage(imageDataUrl);
    setResultImage(null);
    const initialPrompt =
      samplePrompt ||
      "Remove background completely, place on clean pure white studio background with soft contact shadow.";
    setPrompt(initialPrompt);

    const initialHistoryItem: HistoryItem = {
      id: "orig-" + Date.now(),
      url: imageDataUrl,
      prompt: "Original Raw Photo",
      timestamp: Date.now(),
    };
    setHistory([initialHistoryItem]);
    setCurrentVersionId(initialHistoryItem.id);

    setProcessingState({
      isProcessing: false,
      stage: "",
      progressPercent: 0,
      error: null,
      requiresKeySelection: false,
    });

    fetchSuggestions(imageDataUrl);
  };

  // Submit typed instruction to Gemini backend
  const handleSubmitInstruction = async (overridePrompt?: string) => {
    const activePrompt = (overridePrompt || prompt).trim();
    if (!originalImage || !activePrompt) return;

    setProcessingState({
      isProcessing: true,
      stage: "Analyzing product boundaries...",
      progressPercent: 15,
      error: null,
      requiresKeySelection: false,
    });

    // Progressive stage simulation while awaiting API response
    const timer1 = setTimeout(() => {
      setProcessingState((prev) =>
        prev.isProcessing
          ? { ...prev, stage: "Isolating product subject...", progressPercent: 42 }
          : prev
      );
    }, 1500);

    const timer2 = setTimeout(() => {
      setProcessingState((prev) =>
        prev.isProcessing
          ? {
              ...prev,
              stage: "Synthesizing clean backdrop & realistic lighting...",
              progressPercent: 70,
            }
          : prev
      );
    }, 3200);

    const timer3 = setTimeout(() => {
      setProcessingState((prev) =>
        prev.isProcessing
          ? { ...prev, stage: "Refining edges & contact shadows...", progressPercent: 88 }
          : prev
      );
    }, 5000);

    try {
      const response = await fetch("/api/edit-product-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: originalImage,
          prompt: activePrompt,
          options: {
            aspectRatio: settings.aspectRatio,
            imageSize: "1K",
            backgroundType: settings.backgroundPreset,
          },
        }),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorMsg = data.error || "Failed to process photo";
        const isKeyReq = Boolean(data.requiresKeySelection || response.status === 403);
        setProcessingState({
          isProcessing: false,
          stage: "",
          progressPercent: 0,
          error: errorMsg,
          requiresKeySelection: isKeyReq,
        });
        return;
      }

      const newImageUrl = data.image;
      setResultImage(newImageUrl);

      const newHistoryItem: HistoryItem = {
        id: "rev-" + Date.now(),
        url: newImageUrl,
        prompt: activePrompt,
        timestamp: Date.now(),
        modelUsed: data.modelUsed,
        backgroundPreset: settings.backgroundPreset,
      };

      setHistory((prev) => [...prev, newHistoryItem]);
      setCurrentVersionId(newHistoryItem.id);

      // Default view mode to Split slider so user can inspect the before/after immediately
      setSettings((s) => ({ ...s, viewMode: "split" }));

      setProcessingState({
        isProcessing: false,
        stage: "Complete!",
        progressPercent: 100,
        error: null,
        requiresKeySelection: false,
      });
    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setProcessingState({
        isProcessing: false,
        stage: "",
        progressPercent: 0,
        error: err?.message || "Network error while connecting to server.",
        requiresKeySelection: false,
      });
    }
  };

  // Local instant client-side edge cutout fallback
  const handleInstantCutout = async () => {
    if (!originalImage) return;
    setProcessingState({
      isProcessing: true,
      stage: "Running instant edge matte...",
      progressPercent: 50,
      error: null,
      requiresKeySelection: false,
    });

    try {
      const cutUrl = await clientSmartCutout(originalImage, 32);
      setResultImage(cutUrl);

      const newHistoryItem: HistoryItem = {
        id: "cut-" + Date.now(),
        url: cutUrl,
        prompt: "Instant Smart Cutout (Client-Side)",
        timestamp: Date.now(),
        modelUsed: "Client Canvas Matte",
      };

      setHistory((prev) => [...prev, newHistoryItem]);
      setCurrentVersionId(newHistoryItem.id);
      setSettings((s) => ({ ...s, viewMode: "split" }));

      setProcessingState({
        isProcessing: false,
        stage: "",
        progressPercent: 100,
        error: null,
        requiresKeySelection: false,
      });
    } catch (err: any) {
      setProcessingState({
        isProcessing: false,
        stage: "",
        progressPercent: 0,
        error: "Instant cutout failed: " + err.message,
        requiresKeySelection: false,
      });
    }
  };

  const handleSelectVersion = (item: HistoryItem) => {
    setCurrentVersionId(item.id);
    if (item.id.startsWith("orig-")) {
      setResultImage(null);
      setSettings((s) => ({ ...s, viewMode: "original-only" }));
    } else {
      setResultImage(item.url);
      setPrompt(item.prompt);
      setSettings((s) => ({ ...s, viewMode: "split" }));
    }
  };

  const handleReset = () => {
    setResultImage(null);
    setSettings((s) => ({ ...s, viewMode: "original-only" }));
  };

  const handleNewImage = () => {
    setOriginalImage(null);
    setResultImage(null);
    setHistory([]);
    setPrompt("");
    setSuggestedPrompts([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navigation */}
      <Navbar
        hasImage={Boolean(originalImage)}
        hasResult={Boolean(resultImage)}
        onReset={handleReset}
        onOpenExport={() => setIsExportOpen(true)}
        onNewImage={handleNewImage}
        hasApiKey={hasApiKey}
      />

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {!originalImage ? (
          /* Empty State: Upload / Select Sample Product */
          <ImageDropzone onSelectImage={handleSelectImage} />
        ) : (
          /* Active Product Studio */
          <div className="flex flex-col gap-6">
            {/* Error or API Key Notice Banner */}
            {processingState.error && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-amber-900 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">
                      {processingState.requiresKeySelection
                        ? "API Key Configuration Required"
                        : "Processing Error"}
                    </h4>
                    <p className="text-xs text-amber-800/90 mt-0.5">
                      {processingState.error}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleInstantCutout}
                    className="rounded-lg bg-amber-700 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-amber-800"
                  >
                    Try Instant Cutout
                  </button>
                  <button
                    onClick={() => handleSubmitInstruction()}
                    className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {/* Main Studio Grid: Left Controls, Right Workspace */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
              {/* Left Column: Instruction & Controls (5 cols) */}
              <div className="flex flex-col gap-4 lg:col-span-5">
                <InstructionEditor
                  prompt={prompt}
                  onChangePrompt={setPrompt}
                  onSubmit={handleSubmitInstruction}
                  onInstantCutout={handleInstantCutout}
                  processingState={processingState}
                  aspectRatio={settings.aspectRatio}
                  onChangeAspectRatio={(r: AspectRatio) =>
                    setSettings((s) => ({ ...s, aspectRatio: r }))
                  }
                  backgroundPreset={settings.backgroundPreset}
                  onChangeBackgroundPreset={(preset: BackgroundPreset) =>
                    setSettings((s) => ({ ...s, backgroundPreset: preset }))
                  }
                  customBgColor={settings.customBgColor}
                  onChangeCustomBgColor={(c: string) =>
                    setSettings((s) => ({ ...s, customBgColor: c }))
                  }
                  suggestedPrompts={suggestedPrompts}
                  isSuggesting={isSuggesting}
                  onRefreshSuggestions={() => originalImage && fetchSuggestions(originalImage)}
                />

                {/* History Drawer */}
                <VersionHistory
                  history={history}
                  currentVersionId={currentVersionId}
                  onSelectVersion={handleSelectVersion}
                />
              </div>

              {/* Right Column: Studio Workspace & Visualizer (7 cols) */}
              <div className="lg:col-span-7">
                <StudioWorkspace
                  originalUrl={originalImage}
                  resultUrl={resultImage}
                  settings={settings}
                  onChangeSettings={setSettings}
                  isProcessing={processingState.isProcessing}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Export Dialog */}
      {resultImage && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          resultUrl={resultImage}
          settings={settings}
        />
      )}
    </div>
  );
}
