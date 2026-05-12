"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Calendar, ExternalLink, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface BlogPost {
  _id: string
  title: string
  summary: string
  description: string
  links: string[]
  images: string[]
  tags?: string[]
  createdAt: string
}

function renderDescription(description: string, links: string[]) {
  const parts = description.split(/(\{\d+\})/g)
  return parts.map((part, i) => {
    const match = part.match(/^\{(\d+)\}$/)
    if (match) {
      const idx = parseInt(match[1]) - 1
      const url = links[idx]
      if (url) {
        const label = url.length > 45 ? url.slice(0, 45) + "…" : url
        return (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary underline underline-offset-2 hover:text-primary/80 transition-colors font-medium"
          >
            {label}
            <ExternalLink className="inline w-3 h-3" />
          </a>
        )
      }
      return <span key={i} className="text-muted-foreground">{part}</span>
    }
    return <span key={i}>{part}</span>
  })
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

function ImageGallery({ images }: { images: string[] }) {
  const [lightbox, setLightbox] = useState<string | null>(null)

  if (images.length === 0) return null

  const getGridClass = () => {
    if (images.length === 1) return "grid-cols-1"
    if (images.length === 2) return "grid-cols-2"
    if (images.length === 3) return "grid-cols-3"
    return "grid-cols-2 md:grid-cols-3"
  }

  return (
    <>
      <div className={`grid ${getGridClass()} gap-3 mt-6`}>
        {images.map((src, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            className={`relative overflow-hidden rounded-xl border border-primary/20 cursor-pointer group ${
              images.length === 3 && i === 2 ? "col-span-3 md:col-span-1" : ""
            } ${images.length === 1 ? "max-h-96" : "aspect-video"}`}
            onClick={() => setLightbox(src)}
          >
            <img
              src={src}
              alt={`Blog image ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <ExternalLink className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 text-white/80 hover:text-white"
              onClick={() => setLightbox(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={lightbox}
              alt="Full size"
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function BlogModal({ blog, onClose }: { blog: BlogPost; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center overflow-y-auto py-8 px-4"
        onClick={onClose}
      >
        <motion.article
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="w-full max-w-3xl bg-card/95 backdrop-blur-md border border-primary/30 rounded-2xl shadow-[0_0_60px_rgba(0,255,65,0.1)] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-8 pb-6 border-b border-primary/10">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-primary/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono mb-4">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(blog.createdAt)}</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-4 pr-10">
              {blog.title}
            </h1>

            <p className="text-muted-foreground leading-relaxed text-sm">{blog.summary}</p>

            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {blog.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-[10px] border-primary/30 text-primary/80">
                    <Tag className="w-2.5 h-2.5 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Body */}
          <div className="p-8 space-y-6">
            <div className="prose prose-invert max-w-none">
              <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                {renderDescription(blog.description, blog.links)}
              </p>
            </div>

            {blog.links.length > 0 && (
              <div className="border border-primary/10 rounded-xl p-4 bg-primary/5 space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-primary font-mono mb-3">References</p>
                {blog.links.map((link, i) => (
                  <a
                    key={i}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-primary hover:text-primary/80 hover:underline transition-colors"
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    <span className="truncate">[{i + 1}] {link}</span>
                  </a>
                ))}
              </div>
            )}

            <ImageGallery images={blog.images} />
          </div>
        </motion.article>
      </motion.div>
    </AnimatePresence>
  )
}

function BlogCard({ blog, onClick }: { blog: BlogPost; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onClick={onClick}
      className="cursor-pointer group relative bg-card/20 backdrop-blur-md border border-primary/15 rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-[0_0_30px_rgba(0,255,65,0.08)] transition-all duration-300"
    >
      {blog.images.length > 0 && (
        <div className="relative h-44 overflow-hidden">
          <img
            src={blog.images[0]}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
          {blog.images.length > 1 && (
            <span className="absolute bottom-2 right-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded-full font-mono">
              +{blog.images.length - 1} more
            </span>
          )}
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono mb-3">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(blog.createdAt)}</span>
          {blog.links.length > 0 && (
            <>
              <span>·</span>
              <ExternalLink className="w-3 h-3" />
              <span>{blog.links.length} link{blog.links.length > 1 ? "s" : ""}</span>
            </>
          )}
        </div>

        <h3 className="font-bold text-foreground text-base leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {blog.title}
        </h3>

        <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">
          {blog.summary}
        </p>

        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {blog.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-[9px] h-5 border-primary/20 text-muted-foreground">
                {tag}
              </Badge>
            ))}
            {blog.tags.length > 3 && (
              <Badge variant="outline" className="text-[9px] h-5 border-primary/20 text-muted-foreground">
                +{blog.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="mt-4 flex items-center gap-1 text-primary text-[11px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
          <span>read more</span>
          <span className="animate-pulse">_</span>
        </div>
      </div>
    </motion.div>
  )
}

export function BlogSection() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/blogs")
      .then(r => r.json())
      .then(data => setBlogs(Array.isArray(data) ? data : []))
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false))
  }, [])

  if (!loading && blogs.length === 0) return null

  return (
    <section id="blog" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] w-12 bg-primary/50" />
            <span className="text-primary font-mono text-xs uppercase tracking-widest">~/blog</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Blog & <span className="text-primary">Writings</span>
          </h2>
          <p className="text-muted-foreground mt-3 text-sm max-w-xl">
            Thoughts, experiments, and notes on what I've been building and learning.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 rounded-xl bg-card/10 animate-pulse border border-primary/10" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog, i) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <BlogCard blog={blog} onClick={() => setSelectedBlog(blog)} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedBlog && (
          <BlogModal blog={selectedBlog} onClose={() => setSelectedBlog(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
