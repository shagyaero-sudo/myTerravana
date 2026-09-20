import React from 'react';
import { motion } from 'motion/react';
import { Home, CheckSquare, Award, Users } from 'lucide-react';
import { TabType } from '../types';

interface NavbarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  unmasteredQuizCount?: number;
}

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'terraquiz', label: 'Quiz', icon: Award },
  { id: 'terrafinder', label: 'Finder', icon: Users },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  unmasteredQuizCount,
}) => {
  return (
    <nav
      id="floating-bottom-nav"
      aria-label="Bottom Navigation"
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
    >
      {/* ULTRA GLASSMORPHISM CONTAINER (iOS Style) */}
      <div className="w-[92vw] max-w-lg sm:w-auto flex items-center justify-between sm:justify-center gap-1 sm:gap-2 p-1.5 rounded-full bg-white/65 backdrop-blur-3xl backdrop-saturate-200 border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.9)] px-2.5 sm:px-3">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`relative flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 select-none outline-none ${
                isActive
                  ? 'text-slate-900 shadow-2xs'
                  : 'text-slate-600/80 hover:text-slate-900'
              }`}
            >
              {/* ACTIVE PILL INDICATOR ALA iOS */}
              {isActive && (
                <motion.div
                  layoutId="active-nav-indicator"
                  className="absolute inset-0 bg-white/90 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)] border border-black/[0.04]"
                  transition={{
                    type: 'spring',
                    stiffness: 450,
                    damping: 32,
                  }}
                />
              )}

              {/* ICON CONTAINER & BADGE UNMASTERED */}
              <span className="relative z-10 flex items-center justify-center">
                <Icon
                  size={20}
                  className={
                    isActive
                      ? 'stroke-[2.3] text-slate-900 scale-105 transition-transform'
                      : 'stroke-[1.8] text-slate-600'
                  }
                />

                {item.id === 'terraquiz' &&
                  unmasteredQuizCount !== undefined &&
                  unmasteredQuizCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 z-20 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-black text-white ring-2 ring-white/90 shadow-2xs">
                      {unmasteredQuizCount}
                    </span>
                  )}
              </span>

              {/* LABEL TEKS (Tampil di Desktop / Layar Sedang ke Atas) */}
              <span className="relative z-10 whitespace-nowrap tracking-tight font-bold hidden sm:inline-block">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};