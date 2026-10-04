import React from "react";
import { History, ArrowLeft, Clock, Check } from "lucide-react";
import { HistoryItem } from "../types";

interface VersionHistoryProps {
  history: HistoryItem[];
  currentVersionId: string;
  onSelectVersion: (item: HistoryItem) => void;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({
  history,
  currentVersionId,
  onSelectVersion,
}) => {
  if (history.length <= 1) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
          <History className="h-3.5 w-3.5 text-indigo-600" />
          <span>Edit Revisions ({history.length})</span>
        </div>
        <span className="text-[11px] text-slate-400">Click to switch version</span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin">
        {history.map((item, index) => {
          const isCurrent = item.id === currentVersionId;
          const timeStr = new Date(item.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectVersion(item)}
              className={`group flex flex-col shrink-0 rounded-xl border p-2 text-left transition ${
                isCurrent
                  ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600/20"
                  : "border-slate-200 bg-slate-50/50 hover:border-indigo-300 hover:bg-white"
              }`}
              style={{ width: "140px" }}
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-slate-100 border border-slate-200/60">
                <img
                  src={item.url}
                  alt={`Version ${index + 1}`}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                {isCurrent && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-white">
                    <Check className="h-2.5 w-2.5" />
                  </span>
                )}
                <span className="absolute bottom-1 left-1 rounded bg-slate-900/70 px-1 py-0.2 text-[9px] font-bold text-white backdrop-blur-xs">
                  {index === 0 ? "Original" : `v${index}`}
                </span>
              </div>

              <div className="mt-2 min-w-0">
                <p className="line-clamp-1 text-xs font-bold text-slate-800">
                  {index === 0 ? "Raw Upload" : item.prompt || "Cleaned photo"}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                  <Clock className="h-2.5 w-2.5" />
                  <span>{timeStr}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
