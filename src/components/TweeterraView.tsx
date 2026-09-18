import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  MessageCircle,
  Share2,
  Image as ImageIcon,
  Send,
  Sparkles,
  Tag,
  Check,
  X,
} from 'lucide-react';
import { Post, StudentUser, PostComment } from '../types';

interface TweeterraViewProps {
  currentUser: StudentUser;
  posts: Post[];
  onAddPost: (newPost: Post) => void;
  onToggleLike: (postId: string) => void;
  onAddComment: (postId: string, comment: PostComment) => void;
  onSelectStudent: (studentName: string) => void;
}

const CATEGORIES = ['Semua', 'Kaderisasi', 'Pengumuman', 'Akademik', 'Keseruan', 'Curhat'] as const;

export const TweeterraView: React.FC<TweeterraViewProps> = ({
  currentUser,
  posts,
  onAddPost,
  onToggleLike,
  onAddComment,
  onSelectStudent,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('Semua');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Post['category']>('Keseruan');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  const filteredPosts = posts.filter((p) => {
    if (activeFilter === 'Semua') return true;
    return p.category === activeFilter;
  });

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
      category: selectedCategory,
    };

    onAddPost(newPost);
    setContent('');
    setImageUrl('');
    setShowImageInput(false);
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

  const handleShare = (postId: string, postContent: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`"${postContent}" — dibagikan dari Tweeterra (myTerravana)`);
      setCopiedPostId(postId);
      setTimeout(() => setCopiedPostId(null), 2000);
    }
  };

  return (
    <div id="tweeterra-view-root" className="max-w-2xl mx-auto space-y-5 pb-28">
      {/* 1. VIEW HEADER */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Tweeterra
          </h2>
          <p className="text-xs text-slate-500">
            Kanal aspirasi, obrolan, dan informasi santai 170 mahasiswa Terravana
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/80 text-xs font-semibold text-slate-700">
          <Sparkles size={13} className="text-amber-500" />
          <span>Cohort Feed</span>
        </div>
      </div>

      {/* 2. POST CREATOR CARD */}
      <div
        id="post-creator-card"
        className="bg-white rounded-2xl border border-black/[0.06] p-4 sm:p-5 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.03)]"
      >
        <form onSubmit={handleCreatePost} className="space-y-3">
          <div className="flex items-start gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-100 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <textarea
                id="input-post-content"
                rows={3}
                placeholder="Apa kabar hari ini, Terravana? Bagikan info tugas, tebengan, atau semangat kaderisasi..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none bg-transparent"
              />

              {/* Optional image preview */}
              {imageUrl && (
                <div className="relative mt-2 rounded-xl overflow-hidden border border-slate-200">
                  <img
                    src={imageUrl}
                    alt="Preview lampiran"
                    className="max-h-52 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-slate-900/70 text-white flex items-center justify-center hover:bg-slate-900 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Image Input field if toggled */}
              {showImageInput && !imageUrl && (
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="Tempel tautan gambar (URL)..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setImageUrl(
                        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80'
                      )
                    }
                    className="text-[10px] font-bold px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap"
                  >
                    Contoh Foto
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowImageInput(false)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            {/* Category selection */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-400 hidden xs:inline">
                Topik:
              </span>
              <select
                id="select-post-category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as Post['category'])}
                className="text-xs font-semibold px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none"
              >
                <option value="Keseruan">🎉 Keseruan</option>
                <option value="Kaderisasi">✊ Kaderisasi</option>
                <option value="Pengumuman">📢 Pengumuman</option>
                <option value="Akademik">📚 Akademik</option>
                <option value="Curhat">☕ Curhat</option>
              </select>

              <button
                type="button"
                onClick={() => setShowImageInput(!showImageInput)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                title="Sisipkan tautan foto"
              >
                <ImageIcon size={16} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-medium">
                {content.length}/280
              </span>
              <button
                id="btn-submit-post"
                type="submit"
                disabled={!content.trim()}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  content.trim()
                    ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send size={13} />
                <span>Kirim</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 3. CATEGORY FILTER CHIPS */}
      <div
        id="tweeterra-filter-chips"
        className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar"
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeFilter === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100/80 border border-slate-200/70'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 4. FEED CARDS (TWITTER / X MINIMALIST STYLE) */}
      <div id="tweeterra-posts-list" className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-black/[0.05] p-6">
            <p className="text-sm font-semibold text-slate-700">
              Belum ada postingan di kategori {activeFilter}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Jadilah yang pertama berbagi kabar dengan rekan seangkatan!
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isCommentsOpen = activeCommentPostId === post.id;

            return (
              <article
                key={post.id}
                id={`tweet-post-${post.id}`}
                className="bg-white rounded-2xl border border-black/[0.06] p-4 sm:p-5 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.03)] transition-all hover:border-slate-300/80"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={post.author_avatar}
                    alt={post.author_name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-black/5 shrink-0 cursor-pointer"
                    onClick={() => onSelectStudent(post.author_name)}
                  />

                  <div className="flex-1 min-w-0">
                    {/* Author Meta Row */}
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
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                          K-{post.author_kelompok}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[11px] text-slate-400">
                          {post.created_at}
                        </span>
                      </div>

                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100 text-slate-500 shrink-0">
                        {post.category}
                      </span>
                    </div>

                    {/* Post Content */}
                    <p className="mt-2 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-normal">
                      {post.content}
                    </p>

                    {/* Optional Post Image */}
                    {post.image_url && (
                      <div className="mt-3 rounded-xl overflow-hidden border border-slate-200/80">
                        <img
                          src={post.image_url}
                          alt="Post media"
                          className="w-full max-h-80 object-cover hover:scale-[1.01] transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Post Actions: Like, Comment, Share */}
                    <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-slate-500 text-xs">
                      {/* Like Button */}
                      <button
                        id={`btn-like-post-${post.id}`}
                        type="button"
                        onClick={() => onToggleLike(post.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                          post.is_liked
                            ? 'text-rose-600 bg-rose-50 font-bold'
                            : 'hover:text-rose-600 hover:bg-slate-50'
                        }`}
                      >
                        <Heart
                          size={15}
                          className={post.is_liked ? 'fill-rose-600 stroke-rose-600' : ''}
                        />
                        <span>{post.likes_count}</span>
                      </button>

                      {/* Comment Toggle Button */}
                      <button
                        id={`btn-comment-toggle-${post.id}`}
                        type="button"
                        onClick={() =>
                          setActiveCommentPostId(isCommentsOpen ? null : post.id)
                        }
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                          isCommentsOpen
                            ? 'text-slate-900 bg-slate-100 font-bold'
                            : 'hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <MessageCircle size={15} />
                        <span>{post.comments.length} Balasan</span>
                      </button>

                      {/* Share Button */}
                      <button
                        type="button"
                        onClick={() => handleShare(post.id, post.content)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:text-slate-900 hover:bg-slate-50 transition-colors"
                        title="Bagikan Post"
                      >
                        {copiedPostId === post.id ? (
                          <>
                            <Check size={14} className="text-emerald-600" />
                            <span className="text-emerald-600 font-semibold text-[11px]">
                              Tersalin!
                            </span>
                          </>
                        ) : (
                          <>
                            <Share2 size={14} />
                            <span className="hidden xs:inline text-[11px]">Bagikan</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Expandable Comments Drawer */}
                    <AnimatePresence>
                      {isCommentsOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t border-slate-100 space-y-3 overflow-hidden"
                        >
                          {/* List of comments */}
                          {post.comments.length > 0 ? (
                            <div className="space-y-2.5 pl-2 border-l-2 border-slate-100">
                              {post.comments.map((comm) => (
                                <div
                                  key={comm.id}
                                  className="flex items-start gap-2 text-xs"
                                >
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
                                    <p className="text-slate-700 mt-0.5 text-xs">
                                      {comm.content}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 italic py-1">
                              Belum ada komentar. Tulis balasan pertama!
                            </p>
                          )}

                          {/* Quick reply input */}
                          <div className="flex items-center gap-2 pt-1">
                            <input
                              type="text"
                              placeholder="Tulis balasan untuk teman seangkatan..."
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
    </div>
  );
};
