import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { TasksView } from './components/TasksView';
import { TerraquizView } from './components/TerraquizView';
import { TerrafinderView } from './components/TerrafinderView';
import { StudentDetailModal } from './components/StudentDetailModal';
import { AddAgendaModal } from './components/AddAgendaModal';

import {
  CURRENT_USER,
  MOCK_STUDENTS,
  MOCK_ANNOUNCEMENT,
  MOCK_AGENDAS,
} from './data/mockData';

import { TabType, StudentUser, AgendaItem } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [currentUser, setCurrentUser] = useState<StudentUser>(CURRENT_USER);
  const [students, setStudents] = useState<StudentUser[]>(MOCK_STUDENTS);
  const [agendas, setAgendas] = useState<AgendaItem[]>(MOCK_AGENDAS);

  // Modals state
  const [selectedStudent, setSelectedStudent] = useState<StudentUser | null>(null);
  const [isAddAgendaOpen, setIsAddAgendaOpen] = useState(false);

  // Total students count representation
  const TOTAL_COHORT_SIZE = 170;

  // Mastered count calculation
  const masteredBaseCount = 85;
  const locallyMasteredCount = students.filter((s) => s.mastered).length;
  const initialMasteredMockCount = MOCK_STUDENTS.filter((s) => s.mastered).length;
  const currentMasteredCount = Math.min(
    TOTAL_COHORT_SIZE,
    masteredBaseCount + (locallyMasteredCount - initialMasteredMockCount)
  );

  // Toggle mode isOfficer
  const handleToggleOfficerMode = () => {
    setCurrentUser((prev) => ({ ...prev, is_officer: !prev.is_officer }));
  };

  // Handler Update Profil Mandiri
  const handleSaveProfile = (updatedUser: Partial<StudentUser>) => {
    const newCurrentUser = { ...currentUser, ...updatedUser };
    setCurrentUser(newCurrentUser);

    setStudents((prev) =>
      prev.map((s) => (s.id === currentUser.id ? { ...s, ...updatedUser } : s))
    );

    if (selectedStudent && selectedStudent.id === currentUser.id) {
      setSelectedStudent(newCurrentUser);
    }
  };

  // Agenda actions
  const handleAddAgenda = (newAgenda: AgendaItem) => {
    setAgendas((prev) => [newAgenda, ...prev]);
  };

  // Student profile & mastery actions
  const handleToggleMastered = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, mastered: !s.mastered } : s))
    );
    if (selectedStudent && selectedStudent.id === studentId) {
      setSelectedStudent((prev) => (prev ? { ...prev, mastered: !prev.mastered } : null));
    }
  };

  const handleUpdateMastered = (studentId: string, mastered: boolean) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, mastered } : s))
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFD] text-[#0F172A]">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-2">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="tab-dashboard"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <DashboardView
                currentUser={currentUser}
                announcement={MOCK_ANNOUNCEMENT}
                agendas={agendas}
                students={students}
                masteredCount={currentMasteredCount}
                totalStudents={TOTAL_COHORT_SIZE}
                onNavigateTab={setActiveTab}
                onSelectStudent={setSelectedStudent}
                onToggleOfficerMode={handleToggleOfficerMode}
              />
            </motion.div>
          )}

          {activeTab === 'tasks' && (
            <motion.div
              key="tab-tasks"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <TasksView
                currentUser={currentUser}
                students={students}
              />
            </motion.div>
          )}

          {activeTab === 'terraquiz' && (
            <motion.div
              key="tab-terraquiz"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <TerraquizView
                students={students}
                onUpdateMastered={handleUpdateMastered}
                onSelectStudent={setSelectedStudent}
                masteredCount={currentMasteredCount}
                totalStudents={TOTAL_COHORT_SIZE}
              />
            </motion.div>
          )}

          {activeTab === 'terrafinder' && (
            <motion.div
              key="tab-terrafinder"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <TerrafinderView
                students={students}
                onSelectStudent={setSelectedStudent}
                onToggleMastered={handleToggleMastered}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        unmasteredQuizCount={TOTAL_COHORT_SIZE - currentMasteredCount}
      />

      <AddAgendaModal
        isOpen={isAddAgendaOpen}
        onClose={() => setIsAddAgendaOpen(false)}
        onAdd={handleAddAgenda}
      />

      <StudentDetailModal
        student={selectedStudent}
        currentUser={currentUser}
        onClose={() => setSelectedStudent(null)}
        onSaveProfile={handleSaveProfile}
      />
    </div>
  );
}