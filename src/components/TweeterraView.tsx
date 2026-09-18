import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  MessageCircle,
  Image as ImageIcon,
  Send,
  X,
  MoreHorizontal,
  Trash2,
  Edit2,
  Flag,
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
  const [imageUrl, setImageUrl] = useState('');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [activeMenuPostId, setActiveMenuPostId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      author_id: currentUser.id,
      author_name: currentUser.name,
      author_nickname: currentUser.nickname.toLowerCase(),
      author_avatar: currentUser.avatar,
      author_kelompok: currentUser.kelompok,
      content: content.trim(),
      image_url: imageUrl.trim() || undefined,
      created_at: 'Baru saja',
      likes_count: 0,
      is_liked: false,
      comments: [],
      category: 'Keseruan',
    };

    onAddPost(newPost);
    setContent('');
    setImageUrl('');
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
    <div id="tweeterra-view-root" className="max-w-2xl mx-auto space-y-4 pb-32">
      {/* HEADER & TRIGGER MODAL COMPOSE */}
      <div className="pt-2 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Tweeterra
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ada cerita apa? 
          </p>
        </div>
      </div>

      {/* TRIGGER INPUT BAR (CLICK TO OPEN MODAL) */}
      <div
        onClick={() => setIsComposeOpen(true)}
        className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.03)] cursor-pointer hover:border-slate-300 transition-all flex items-center gap-3"
      >
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-100 shrink-0"
        />
        <span className="text-sm text-slate-400 font-medium flex-1">
          Tulis ceritamu...
        </span>
        <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold">
          Post
        </span>
      </div>

      {/* UNIFIED TWITTER-STYLE FEED CONTAINER */}
      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-[0_2px_12px_-3px_rgba(0,0,0,0.03)] overflow-hidden divide-y divide-slate-100">
        {posts.length === 0 ? (
          <div className="text-center py-12 p-6">
            <p className="text-sm font-semibold text-slate-700">Belum ada postingan cerita.</p>
            <p className="text-xs text-slate-400 mt-1">
              Tulis postingan pertama untuk menyapa teman seangkatan!
            </p>
          </div>
        ) : (
          posts.map((post) => {
            const isCommentsOpen = activeCommentPostId === post.id;
            const isMenuOpen = activeMenuPostId === post.id;
            const isOwner = post.author_id === currentUser.id;

            return (
              <article key={post.id} className="p-4 sm:p-5 hover:bg-slate-50/50 transition-colors relative">
                <div className="flex items-start gap-3">
                  <img
                    src={post.author_avatar}
                    alt={post.author_name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-black/5 shrink-0 cursor-pointer"
                    onClick={() => onSelectStudent(post.author_name)}
                  />

                  <div className="flex-1 min-w-0">
                    {/* META ROW & TRIPLE DOT MENU */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          onClick={() => onSelectStudent(post.author_name)}
                          className="text-xs sm:text-sm font-bold text-slate-900 hover:underline cursor-pointer"
                        >
                          {post.author_name}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          @{post.author_nickname}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[11px] text-slate-400">{post.created_at}</span>
                      </div>

                      {/* TRIPLE DOT BUTTON */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setActiveMenuPostId(isMenuOpen ? null : post.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <MoreHorizontal size={16} />
                        </button>

                        {/* POPUP MENU */}
                        <AnimatePresence>
                          {isMenuOpen && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute right-0 top-7 z-20 w-36 bg-white rounded-xl shadow-lg border border-black/[0.08] py-1 text-xs font-semibold text-slate-700"
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
                                    alert('Postingan telah dilaporkan ke pengurus.');
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-rose-50 text-rose-600"
                                >
                                  <Flag size={13} />
                                  <span>Report</span>
                                </button>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* CONTENT EDIT MODE / READ MODE */}
                    {editingPostId === post.id ? (
                      <div className="mt-2 space-y-2">
                        <textarea
                          rows={2}
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full text-xs sm:text-sm p-2 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900"
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
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-900 text-white"
                          >
                            Simpan
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-1.5 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                        {post.content}
                      </p>
                    )}

                    {/* OPTIONAL IMAGE */}
                    {post.image_url && (
                      <div className="mt-3 rounded-xl overflow-hidden border border-slate-200/80">
                        <img
                          src={post.image_url}
                          alt="Post media"
                          className="w-full max-h-80 object-cover"
                        />
                      </div>
                    )}

                    {/* ACTIONS: LIKE & REPLIES */}
                    <div className="mt-3 flex items-center gap-6 text-slate-500 text-xs">
                      <button
                        type="button"
                        onClick={() => onToggleLike(post.id)}
                        className={`inline-flex items-center gap-1.5 transition-colors ${
                          post.is_liked ? 'text-rose-600 font-bold' : 'hover:text-rose-600'
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
                        className={`inline-flex items-center gap-1.5 transition-colors ${
                          isCommentsOpen ? 'text-slate-900 font-bold' : 'hover:text-slate-900'
                        }`}
                      >
                        <MessageCircle size={15} />
                        <span>{post.comments.length} Balasan</span>
                      </button>
                    </div>

                    {/* EXPANDABLE COMMENTS */}
                    <AnimatePresence>
                      {isCommentsOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t border-slate-100 space-y-3 overflow-hidden"
                        >
                          {post.comments.length > 0 && (
                            <div className="space-y-2 pl-2 border-l-2 border-slate-100">
                              {post.comments.map((comm) => (
                                <div key={comm.id} className="flex items-start gap-2 text-xs">
                                  <img
                                    src={comm.author_avatar}
                                    alt={comm.author_name}
                                    className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                                  />
                                  <div className="bg-slate-50 rounded-xl px-3 py-2 flex-1">
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="font-bold text-slate-900 text-[11px]">
                                        {comm.author_name}
                                      </span>
                                      <span className="text-[10px] text-slate-400">
                                        {comm.created_at}
                                      </span>
                                    </div>
                                    <p className="text-slate-700 mt-0.5 text-xs">{comm.content}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

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
                              className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
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

      {/* MODAL COMPOSE (INTIMATE CREATOR MODE) */}
      <AnimatePresence>
        {isComposeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl p-5 shadow-2xl border border-black/[0.08]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-sm font-bold text-slate-900">Buat Postingan Baru</span>
                <button
                  type="button"
                  onClick={() => setIsComposeOpen(false)}
                  className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="mt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <textarea
                    rows={4}
                    autoFocus
                    placeholder="Apa yang ingin kamu bagikan dengan angkatan Terravana?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none bg-transparent"
                  />
                </div>

                {imageUrl && (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200">
                    <img src={imageUrl} alt="Preview" className="max-h-48 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute top-2 right-2 p-1 rounded-full bg-slate-900/70 text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <input
                    type="url"
                    placeholder="URL foto (opsional)..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 w-3/5 focus:outline-none"
                  />

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-medium">
                      {content.length}/280
                    </span>
                    <button
                      type="submit"
                      disabled={!content.trim()}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      Kirim Post
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};