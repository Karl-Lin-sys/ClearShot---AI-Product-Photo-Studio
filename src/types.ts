export type AspectRatio = "1:1" | "4:3" | "3:4" | "16:9";

export type BackgroundPreset = 
  | "transparent"
  | "pure-white"
  | "soft-gray"
  | "warm-cream"
  | "dark-slate"
  | "podium"
  | "botanical"
  | "custom";

export interface HistoryItem {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  modelUsed?: string;
  backgroundPreset?: BackgroundPreset;
}

export interface SampleProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  dataUrl: string;
  defaultPrompt: string;
}

export interface ProcessingState {
  isProcessing: boolean;
  stage: string;
  progressPercent: number;
  error: string | null;
  requiresKeySelection: boolean;
}

export interface StudioSettings {
  aspectRatio: AspectRatio;
  backgroundPreset: BackgroundPreset;
  customBgColor: string;
  addContactShadow: boolean;
  shadowBlur: number;
  shadowOpacity: number;
  brightness: number;
  contrast: number;
  saturation: number;
  viewMode: "split" | "side-by-side" | "result-only" | "original-only";
  checkerboardTheme: "dark" | "light";
}
