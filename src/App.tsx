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

  // Total students count representation (170 university students)
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
  const handleToggleOfficerMode = (isOfficer: boolean) => {
    setCurrentUser((prev) => ({ ...prev, is_officer: isOfficer }));
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

  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleEditPost = (postId: string, newContent: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, content: newContent } : p))
    );
  };

  const handleReportPost = (postId: string) => {
    console.log(`Post ${postId} dilaporkan.`);
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
                onToggleAgenda={handleToggleAgenda}
                onOpenAddAgenda={() => setIsAddAgendaOpen(true)}
                students={students}
                leaderboard={MOCK_LEADERBOARD}
                masteredCount={currentMasteredCount}
                totalStudents={TOTAL_COHORT_SIZE}
                onNavigateTab={setActiveTab}
                onOpenProfile={() => setSelectedStudent(currentUser)}
                onToggleOfficerMode={handleToggleOfficerMode}
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
                onDeletePost={handleDeletePost}
                onEditPost={handleEditPost}
                onReportPost={handleReportPost}
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