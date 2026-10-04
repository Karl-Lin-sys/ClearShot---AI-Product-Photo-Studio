import React, { useState } from "react";
import { Sparkles, Wand2, Send, Lightbulb, Zap, Check, SlidersHorizontal, RefreshCw } from "lucide-react";
import { QUICK_RECIPES } from "../utils/sampleData";
import { AspectRatio, BackgroundPreset, ProcessingState } from "../types";

interface InstructionEditorProps {
  prompt: string;
  onChangePrompt: (newPrompt: string) => void;
  onSubmit: (promptToUse?: string) => void;
  onInstantCutout: () => void;
  processingState: ProcessingState;
  aspectRatio: AspectRatio;
  onChangeAspectRatio: (ratio: AspectRatio) => void;
  backgroundPreset: BackgroundPreset;
  onChangeBackgroundPreset: (preset: BackgroundPreset) => void;
  customBgColor: string;
  onChangeCustomBgColor: (color: string) => void;
  suggestedPrompts: string[];
  isSuggesting: boolean;
  onRefreshSuggestions: () => void;
}

export const InstructionEditor: React.FC<InstructionEditorProps> = ({
  prompt,
  onChangePrompt,
  onSubmit,
  onInstantCutout,
  processingState,
  aspectRatio,
  onChangeAspectRatio,
  backgroundPreset,
  onChangeBackgroundPreset,
  customBgColor,
  onChangeCustomBgColor,
  suggestedPrompts,
  isSuggesting,
  onRefreshSuggestions,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleRecipeClick = (recipePrompt: string, recipeId: string) => {
    onChangePrompt(recipePrompt);
    if (recipeId === "pure-white") onChangeBackgroundPreset("pure-white");
    else if (recipeId === "transparent") onChangeBackgroundPreset("transparent");
    else if (recipeId === "dark-luxury") onChangeBackgroundPreset("dark-slate");
    else if (recipeId === "minimal-podium") onChangeBackgroundPreset("podium");
  };

  const bgPresets: { id: BackgroundPreset; label: string; preview: string; isHex?: boolean }[] = [
    { id: "transparent", label: "Transparent", preview: "🏁" },
    { id: "pure-white", label: "Pure White", preview: "#FFFFFF", isHex: true },
    { id: "soft-gray", label: "Studio Gray", preview: "#F1F5F9", isHex: true },
    { id: "warm-cream", label: "Warm Cream", preview: "#FAF7F2", isHex: true },
    { id: "dark-slate", label: "Matte Dark", preview: "#0F172A", isHex: true },
    { id: "podium", label: "Stone Stage", preview: "🏛️" },
    { id: "custom", label: "Custom Hex", preview: "🎨" },
  ];

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Wand2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Type Editing Instructions</h3>
            <p className="text-xs text-slate-500">
              Instruct Gemini what to remove, clean up, or change
            </p>
          </div>
        </div>

        {/* Aspect Ratio Selector */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs font-semibold">
          {(["1:1", "4:3", "3:4", "16:9"] as AspectRatio[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onChangeAspectRatio(r)}
              className={`rounded-md px-2 py-1 transition ${
                aspectRatio === r
                  ? "bg-white text-indigo-600 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Main Instruction Textarea */}
      <div className="relative">
        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => onChangePrompt(e.target.value)}
          placeholder="e.g. Remove the background completely, make it pure white for Amazon, and add a soft grounded contact shadow..."
          disabled={processingState.isProcessing}
          className="w-full resize-none rounded-xl border border-slate-300 bg-slate-50/50 p-3.5 pr-12 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-500/20 disabled:opacity-60"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              onSubmit();
            }
          }}
        />
        <button
          type="button"
          onClick={() => onSubmit()}
          disabled={processingState.isProcessing || !prompt.trim()}
          className="absolute right-2.5 bottom-3 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600"
          title="Run instruction (Ctrl+Enter)"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      {/* Quick 1-Click Recipe Chips */}
      <div>
        <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
          <span>1-Click Commercial Recipes</span>
          <span className="text-[11px] font-normal text-slate-400">Click to fill</span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {QUICK_RECIPES.map((recipe) => {
            const isSelected = prompt === recipe.prompt;
            return (
              <button
                key={recipe.id}
                type="button"
                onClick={() => handleRecipeClick(recipe.prompt, recipe.id)}
                disabled={processingState.isProcessing}
                className={`flex items-start gap-2 rounded-xl border p-2.5 text-left transition ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-50/60 ring-2 ring-indigo-500/20"
                    : "border-slate-200 bg-slate-50/50 hover:border-indigo-300 hover:bg-white"
                }`}
              >
                <span className="text-lg leading-none">{recipe.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="truncate text-xs font-bold text-slate-800">
                      {recipe.label}
                    </span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-indigo-600" />}
                  </div>
                  <span className="block truncate text-[10px] text-slate-400">
                    {recipe.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Smart Suggested Prompts */}
      {suggestedPrompts.length > 0 && (
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
              <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
              <span>Smart Suggestions for this photo</span>
            </div>
            <button
              type="button"
              onClick={onRefreshSuggestions}
              disabled={isSuggesting}
              className="flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800"
            >
              <RefreshCw className={`h-3 w-3 ${isSuggesting ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suggestedPrompts.map((sug, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onChangePrompt(sug)}
                className="rounded-lg border border-indigo-200 bg-white px-2.5 py-1 text-xs text-indigo-950 transition hover:border-indigo-400 hover:bg-indigo-50/70"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Target Backdrop Style */}
      <div className="border-t border-slate-100 pt-3">
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
          Preferred Backdrop Style
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {bgPresets.map((bg) => {
            const isSelected = backgroundPreset === bg.id;
            return (
              <button
                key={bg.id}
                type="button"
                onClick={() => {
                  onChangeBackgroundPreset(bg.id);
                  if (bg.id === "custom") setShowColorPicker(true);
                }}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-600/20"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {bg.isHex ? (
                  <span
                    className="inline-block h-3.5 w-3.5 rounded-full border border-slate-300 shadow-2xs"
                    style={{ backgroundColor: bg.preview }}
                  />
                ) : (
                  <span>{bg.preview}</span>
                )}
                <span>{bg.label}</span>
              </button>
            );
          })}

          {backgroundPreset === "custom" && (
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1">
              <input
                type="color"
                value={customBgColor}
                onChange={(e) => onChangeCustomBgColor(e.target.value)}
                className="h-6 w-6 cursor-pointer rounded border-0 bg-transparent"
              />
              <span className="font-mono text-xs text-slate-600">{customBgColor}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons & Execution */}
      <div className="flex flex-col gap-2 pt-2 sm:flex-row">
        <button
          type="button"
          onClick={() => onSubmit()}
          disabled={processingState.isProcessing || !prompt.trim()}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 py-3 px-5 text-sm font-bold text-white shadow-md shadow-indigo-600/25 transition hover:brightness-105 active:scale-[0.99] disabled:opacity-50"
        >
          {processingState.isProcessing ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>{processingState.stage || "Processing with Gemini..."}</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>Apply Instructions with Gemini</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onInstantCutout}
          disabled={processingState.isProcessing}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-3 px-4 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-[0.99] disabled:opacity-50"
          title="Run quick local edge matte cutout directly in browser canvas"
        >
          <Zap className="h-3.5 w-3.5 text-amber-500" />
          <span>Instant Cutout</span>
        </button>
      </div>

      {/* Processing Progress Bar */}
      {processingState.isProcessing && (
        <div className="space-y-1.5 rounded-xl bg-indigo-50/70 p-3 border border-indigo-100">
          <div className="flex items-center justify-between text-xs font-medium text-indigo-900">
            <span>{processingState.stage}</span>
            <span>{processingState.progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-indigo-200/60">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-teal-400 transition-all duration-300"
              style={{ width: `${processingState.progressPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
