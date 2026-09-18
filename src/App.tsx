import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { TweeterraView } from './components/TweeterraView';
import { TerraquizView } from './components/TerraquizView';
import { TerrafinderView } from './components/TerrafinderView';
import { StudentDetailModal } from './components/StudentDetailModal';
import { AddAgendaModal } from './components/AddAgendaModal';

import {
  CURRENT_USER,
  MOCK_STUDENTS,
  MOCK_ANNOUNCEMENT,
  MOCK_AGENDAS,
  MOCK_LEADERBOARD,
  MOCK_POSTS,
} from './data/mockData';

import { TabType, StudentUser, AgendaItem, Post, PostComment } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [currentUser, setCurrentUser] = useState<StudentUser>(CURRENT_USER);
  const [students, setStudents] = useState<StudentUser[]>(MOCK_STUDENTS);
  const [agendas, setAgendas] = useState<AgendaItem[]>(MOCK_AGENDAS);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);

  // Modals state
  const [selectedStudent, setSelectedStudent] = useState<StudentUser | null>(null);
  const [isAddAgendaOpen, setIsAddAgendaOpen] = useState(false);

  // Total students count representation (170 university students in Terravana cohort)
  const TOTAL_COHORT_SIZE = 170;

  // Mastered count: calculate from actual mastered students + base cohort progress
  const masteredBaseCount = 85; // Baseline cohort mastery count
  const locallyMasteredCount = students.filter((s) => s.mastered).length;
  const initialMasteredMockCount = MOCK_STUDENTS.filter((s) => s.mastered).length;
  const currentMasteredCount = Math.min(
    TOTAL_COHORT_SIZE,
    masteredBaseCount + (locallyMasteredCount - initialMasteredMockCount)
  );

  // Agenda actions
  const handleToggleAgenda = (id: string) => {
    setAgendas((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_completed: !item.is_completed } : item
      )
    );
  };

  const handleAddAgenda = (newAgenda: AgendaItem) => {
    setAgendas((prev) => [newAgenda, ...prev]);
  };

  // Tweeterra actions
  const handleAddPost = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.is_liked;
          return {
            ...post,
            is_liked: isLiked,
            likes_count: isLiked ? post.likes_count + 1 : Math.max(0, post.likes_count - 1),
          };
        }
        return post;
      })
    );
  };

  const handleAddComment = (postId: string, comment: PostComment) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, comment],
          };
        }
        return post;
      })
    );
  };

  // Student profile & mastery actions
  const handleSelectStudentByName = (studentName: string) => {
    const found = students.find(
      (s) =>
        s.name.toLowerCase() === studentName.toLowerCase() ||
        s.nickname.toLowerCase() === studentName.toLowerCase()
    );
    if (found) {
      setSelectedStudent(found);
    }
  };

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
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        onOpenProfile={() => setSelectedStudent(currentUser)}
        onQuickFinder={() => setActiveTab('terrafinder')}
      />

      {/* Main Content Area with Spring Fade Transition */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-5">
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
                onToggleAgenda={handleToggleAgenda}
                onOpenAddAgenda={() => setIsAddAgendaOpen(true)}
                students={students}
                leaderboard={MOCK_LEADERBOARD}
                masteredCount={currentMasteredCount}
                totalStudents={TOTAL_COHORT_SIZE}
                onNavigateTab={setActiveTab}
                onSelectStudent={setSelectedStudent}
              />
            </motion.div>
          )}

          {activeTab === 'tweeterra' && (
            <motion.div
              key="tab-tweeterra"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <TweeterraView
                currentUser={currentUser}
                posts={posts}
                onAddPost={handleAddPost}
                onToggleLike={handleToggleLike}
                onAddComment={handleAddComment}
                onSelectStudent={handleSelectStudentByName}
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

      {/* Floating Bottom Pill Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        unmasteredQuizCount={TOTAL_COHORT_SIZE - currentMasteredCount}
      />

      {/* Add Agenda Modal */}
      <AddAgendaModal
        isOpen={isAddAgendaOpen}
        onClose={() => setIsAddAgendaOpen(false)}
        onAdd={handleAddAgenda}
      />

      {/* Student Detail Modal */}
      <StudentDetailModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onToggleMastered={handleToggleMastered}
      />
    </div>
  );
}
