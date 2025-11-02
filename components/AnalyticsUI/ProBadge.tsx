import { Lock } from "lucide-react";

interface ProBadgeProps {
  isPro: boolean;
}

export const ProBadge = ({ isPro }: ProBadgeProps) => {
  if (isPro) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold">
        <span className="w-2 h-2 bg-purple-500 rounded-full" />
        Plan Pro Activo
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-xs font-semibold">
      <Lock className="w-3 h-3" />
      Plan Básico
    </div>
  );
};
