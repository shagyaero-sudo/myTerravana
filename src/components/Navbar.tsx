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
  badgeLabel: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Home', badgeLabel: 'Dashboard', icon: Home },
  { id: 'tweeterra', label: 'Feed', badgeLabel: 'Tweeterra', icon: MessageSquare },
  { id: 'terraquiz', label: 'Quiz', badgeLabel: 'Terraquiz', icon: Award },
  { id: 'terrafinder', label: 'Finder', badgeLabel: 'Terrafinder', icon: Users },
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
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
    >
      <div className="flex items-center gap-1 p-1.5 rounded-full bg-white/85 backdrop-blur-2xl border border-black/[0.06] shadow-[0_12px_36px_-6px_rgba(15,23,42,0.12),0_4px_12px_rgba(15,23,42,0.04)] px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-200 select-none outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 ${
                isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav-indicator"
                  className="absolute inset-0 bg-slate-900/[0.07] rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]"
                  transition={{
                    type: 'spring',
                    stiffness: 450,
                    damping: 32,
                  }}
                />
              )}

              <span className="relative z-10 flex items-center justify-center">
                <Icon size={18} className={isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'} />
              </span>

              <span className="relative z-10 whitespace-nowrap tracking-tight font-medium hidden xs:inline-block sm:inline-block">
                {item.label}
              </span>

              {item.id === 'terraquiz' && unmasteredQuizCount !== undefined && unmasteredQuizCount > 0 && (
                <span
                  id="quiz-alert-dot"
                  className="relative z-10 ml-0.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-white bg-amber-500 rounded-full leading-none"
                >
                  {unmasteredQuizCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
