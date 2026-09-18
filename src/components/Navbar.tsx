import React from 'react';
import { motion } from 'motion/react';
import { Home, MessageSquare, Award, Users } from 'lucide-react';
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
  { id: 'tweeterra', label: 'Feed', icon: MessageSquare },
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
      <div className="flex items-center gap-1 sm:gap-1.5 p-1.5 rounded-full bg-white/90 backdrop-blur-2xl border border-black/[0.08] shadow-[0_12px_36px_-6px_rgba(15,23,42,0.15)] px-2 sm:px-2.5">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`relative flex items-center justify-center gap-2 p-3 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-200 select-none outline-none ${
                isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav-indicator"
                  className="absolute inset-0 bg-slate-900/[0.08] rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]"
                  transition={{
                    type: 'spring',
                    stiffness: 450,
                    damping: 32,
                  }}
                />
              )}

              {/* ICON CONTAINER & INDIKATOR ANGKA QUIZ */}
              <span className="relative z-10 flex items-center justify-center">
                <Icon size={20} className={isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'} />

                {item.id === 'terraquiz' &&
                  unmasteredQuizCount !== undefined &&
                  unmasteredQuizCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 z-20 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-extrabold text-white ring-2 ring-white">
                      {unmasteredQuizCount}
                    </span>
                  )}
              </span>

              {/* LABEL TEKS: SEMBUNYI DI HP (hidden), MUNCUL DI DESKTOP (sm:inline-block) */}
              <span className="relative z-10 whitespace-nowrap tracking-tight font-medium hidden sm:inline-block">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};