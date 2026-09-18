import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  MessageCircle,
  Send,
  X,
  MoreHorizontal,
  Trash2,
  Edit2,
  Flag,
  BarChart2,
  Sparkles,
  Lock,
  Plus,
} from 'lucide-react';
import { Post, StudentUser, PostComment } from '../types';

interface TweeterraViewProps {
  currentUser: StudentUser;
  posts: Post[];
  onAddPost: (newPost: Post) => void;
  onToggleLike: (postId: string) => void;
  onAddComment: (postId: string, comment: PostComment) => void;
  onSelectStudent: (studentName: string) => void;
  onDeletePost?: (postId: string) => void;
  onEditPost?: (postId: string, newContent: string) => void;
  onReportPost?: (postId: string) => void;
}

export const TweeterraView: React.FC<TweeterraViewProps> = ({
  currentUser,
  posts,
  onAddPost,
  onToggleLike,
  onAddComment,
  onSelectStudent,
  onDeletePost,
  onEditPost,
  onReportPost,
}) => {
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [activeMenuPostId, setActiveMenuPostId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  // Mock State untuk Daily Polls
  const [pollVotes, setPollVotes] = useState<{ [key: number]: number }>({ 0: 42, 1: 28, 2: 15 });
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedPollOption, setSelectedPollOption] = useState<number | null>(null);

  const pollOptions = ['Tim Keputih (Kuliner)', 'Tim Gebang (Praktis)', 'Laju / Lulusan Rumah'];
  const totalPollVotes = Object.values(pollVotes).reduce((a, b) => a + b, 0);

  const handleVote = (index: number) => {
    if (hasVoted) return;
    setPollVotes((prev) => ({ ...prev, [index]: prev[index] + 1 }));
    setHasVoted(true);
    setSelectedPollOption(index);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      author_id: isAnonymous ? 'anon' : currentUser.id,
      author_name: isAnonymous ? 'Secret Phoenix 🪶' : currentUser.name,
      author_nickname: isAnonymous ? 'anonim' : currentUser.nickname.toLowerCase(),
      author_avatar: isAnonymous
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
        : currentUser.avatar,
      author_kelompok: isAnonymous ? 0 : currentUser.kelompok,
      content: content.trim(),
      created_at: 'Baru saja',
      likes_count: 0,
      is_liked: false,
      comments: [],
      category: isAnonymous ? 'Menfess' : 'Keseruan',
    };

    onAddPost(newPost);
    setContent('');
    setIsAnonymous(false);
    setIsComposeOpen(false);
  };

  const handleSendComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const newComment: PostComment = {
      id: `comment-${Date.now()}`,
      author_name: currentUser.name,
      author_avatar: currentUser.avatar,
      content: text,
      created_at: 'Baru saja',
    };

    onAddComment(postId, newComment);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const handleSaveEdit = (postId: string) => {
    if (onEditPost && editContent.trim()) {
      onEditPost(postId, editContent.trim());
    }
    setEditingPostId(null);
    setActiveMenuPostId(null);
  };

  return (
    <div id="tweeterra-view-root" className="max-w-2xl mx-auto space-y-5 pb-36 font-sans">
      {/* HEADER TWEETERRA / TERRA-ZONE */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Tweeterra & Zone
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Polling harian, menfess & tempat cerita santai angkatan
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsComposeOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-xs"
        >
          <Plus size={15} />
          <span>Post Cerita</span>
        </button>
      </div>

      {/* 1. GAMIFIKASI: DAILY POLL OF THE DAY (STYLE VISILY MINT/PURPLE) */}
      <section className="bg-gradient-to-br from-indigo-50/90 via-purple-50/50 to-slate-50 rounded-3xl p-5 border border-indigo-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-600 text-white flex items-center gap-1">
              <Sparkles size={10} />
              VOTE HARI INI
            </span>
            <span className="text-xs font-bold text-slate-400">Total {totalPollVotes} Suara</span>
          </div>
          <BarChart2 size={18} className="text-indigo-500" />
        </div>

        <div>
          <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
            Kosan paling strategis & favorit anak Terravana 2026?
          </h3>
        </div>

        {/* OPTIONS & RESULTS BAR */}
        <div className="space-y-2 pt-1">
          {pollOptions.map((opt, idx) => {
            const count = pollVotes[idx] || 0;
            const percent = totalPollVotes > 0 ? Math.round((count / totalPollVotes) * 100) : 0;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleVote(idx)}
                className={`relative w-full p-3 rounded-2xl border text-left transition-all overflow-hidden ${
                  selectedPollOption === idx
                    ? 'border-indigo-500 bg-indigo-100/50'
                    : 'border-slate-200/80 bg-white/80 hover:bg-white'
                }`}
              >
                {/* PROGRESS BAR BACKGROUND */}
                {hasVoted && (
                  <div
                    className="absolute top-0 left-0 bottom-0 bg-indigo-200/50 transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                )}

                <div className="relative flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>{opt}</span>
                  {hasVoted && <span className="text-indigo-700 font-extrabold">{percent}%</span>}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. UNIFIED FEED CONTAINER (VISILY CARD STYLE) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900">Linimasa & Menfess</h3>
          <span className="text-xs font-bold text-slate-400">{posts.length} Postingan</span>
        </div>

        <div className="space-y-3">
          {posts.length === 0 ? (
            <div className="text-center py-12 p-6 bg-white rounded-3xl border border-slate-100">
              <p className="text-xs font-bold text-slate-500">Belum ada postingan cerita.</p>
            </div>
          ) : (
            posts.map((post) => {
              const isCommentsOpen = activeCommentPostId === post.id;
              const isMenuOpen = activeMenuPostId === post.id;
              const isOwner = post.author_id === currentUser.id;
              const isMenfess = post.category === 'Menfess';

              return (
                <article
                  key={post.id}
                  className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-xs space-y-3 relative"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={post.author_avatar}
                      alt={post.author_name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 shrink-0 cursor-pointer"
                      onClick={() => !isMenfess && onSelectStudent(post.author_name)}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            onClick={() => !isMenfess && onSelectStudent(post.author_name)}
                            className="text-xs sm:text-sm font-bold text-slate-900 hover:underline cursor-pointer"
                          >
                            {post.author_name}
                          </span>
                          {isMenfess && (
                            <span className="px-2 py-0.2 rounded-full text-[9px] font-black bg-purple-100 text-purple-700 flex items-center gap-0.5">
                              <Lock size={8} /> Anonim
                            </span>
                          )}
                          <span className="text-slate-300">•</span>
                          <span className="text-[11px] text-slate-400 font-medium">{post.created_at}</span>
                        </div>

                        {/* MENU ACTION */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setActiveMenuPostId(isMenuOpen ? null : post.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
                          >
                            <MoreHorizontal size={16} />
                          </button>

                          <AnimatePresence>
                            {isMenuOpen && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute right-0 top-7 z-20 w-36 bg-white rounded-2xl shadow-xl border border-slate-100 py-1 text-xs font-bold text-slate-700"
                              >
                                {isOwner ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingPostId(post.id);
                                        setEditContent(post.content);
                                        setActiveMenuPostId(null);
                                      }}
                                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-slate-700"
                                    >
                                      <Edit2 size={13} />
                                      <span>Edit Post</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (onDeletePost) onDeletePost(post.id);
                                        setActiveMenuPostId(null);
                                      }}
                                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-rose-50 text-rose-600"
                                    >
                                      <Trash2 size={13} />
                                      <span>Hapus</span>
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (onReportPost) onReportPost(post.id);
                                      setActiveMenuPostId(null);
                                      alert('Postingan telah dilaporkan.');
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-rose-50 text-rose-600"
                                  >
                                    <Flag size={13} />
                                    <span>Laporkan</span>
                                  </button>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* CONTENT BODY */}
                      {editingPostId === post.id ? (
                        <div className="mt-2 space-y-2">
                          <textarea
                            rows={2}
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingPostId(null)}
                              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-600"
                            >
                              Batal
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(post.id)}
                              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-600 text-white"
                            >
                              Simpan
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-1.5 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                          {post.content}
                        </p>
                      )}

                      {/* ACTIONS BAR */}
                      <div className="mt-3 flex items-center gap-5 text-slate-400 text-xs">
                        <button
                          type="button"
                          onClick={() => onToggleLike(post.id)}
                          className={`inline-flex items-center gap-1 transition-colors ${
                            post.is_liked ? 'text-rose-600 font-extrabold' : 'hover:text-rose-600'
                          }`}
                        >
                          <Heart
                            size={15}
                            className={post.is_liked ? 'fill-rose-600 stroke-rose-600' : ''}
                          />
                          <span>{post.likes_count}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveCommentPostId(isCommentsOpen ? null : post.id)}
                          className="inline-flex items-center gap-1 hover:text-slate-900 transition-colors"
                        >
                          <MessageCircle size={15} />
                          <span>{post.comments.length} Balasan</span>
                        </button>
                      </div>

                      {/* EXPANDABLE REPLIES */}
                      <AnimatePresence>
                        {isCommentsOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 pt-3 border-t border-slate-100 space-y-2 overflow-hidden"
                          >
                            {post.comments.map((comm) => (
                              <div key={comm.id} className="flex items-start gap-2 text-xs">
                                <img
                                  src={comm.author_avatar}
                                  alt={comm.author_name}
                                  className="w-5 h-5 rounded-full object-cover shrink-0 mt-0.5"
                                />
                                <div className="bg-slate-50 rounded-2xl px-3 py-2 flex-1 border border-slate-100">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="font-bold text-slate-900 text-[11px]">
                                      {comm.author_name}
                                    </span>
                                    <span className="text-[9px] text-slate-400">{comm.created_at}</span>
                                  </div>
                                  <p className="text-slate-700 text-xs mt-0.5">{comm.content}</p>
                                </div>
                              </div>
                            ))}

                            <div className="flex items-center gap-2 pt-1">
                              <input
                                type="text"
                                placeholder="Tulis balasan..."
                                value={commentInputs[post.id] || ''}
                                onChange={(e) =>
                                  setCommentInputs((prev) => ({
                                    ...prev,
                                    [post.id]: e.target.value,
                                  }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSendComment(post.id);
                                  }
                                }}
                                className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-900"
                              />
                              <button
                                type="button"
                                onClick={() => handleSendComment(post.id)}
                                className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
                              >
                                Kirim
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>

      {/* MODAL COMPOSE (POST & MENFESS) */}
      <AnimatePresence>
        {isComposeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-sm font-extrabold text-slate-900">Buat Postingan Baru</span>
                <button
                  type="button"
                  onClick={() => setIsComposeOpen(false)}
                  className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-4">
                <textarea
                  rows={4}
                  autoFocus
                  placeholder="Apa cerita unik atau pertanyaanmu untuk angkatan Terravana?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none bg-slate-50 p-3 rounded-2xl border border-slate-100"
                />

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                      <Lock size={12} /> Mode Menfess Anonim
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={!content.trim()}
                    className="px-4 py-2 rounded-2xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 transition-all"
                  >
                    Kirim Post
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};