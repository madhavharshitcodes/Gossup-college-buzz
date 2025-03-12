"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, Reply, ChevronDown, ChevronUp } from "lucide-react"

interface CommentSectionProps {
  postId: string
  commentCount: number
}

interface Reply {
  id: string
  content: string
  timestamp: string
  likes: number
}

interface Comment {
  id: string
  content: string
  timestamp: string
  likes: number
  replies: Reply[]
}

export default function CommentSection({ postId, commentCount }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [newReply, setNewReply] = useState("")
  const [showReplies, setShowReplies] = useState<Record<string, boolean>>({})

  // In a real app, these would come from an API
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      content: "This is so true! Happened to me last semester too.",
      timestamp: "5 min ago",
      likes: 3,
      replies: [
        {
          id: "reply-1-1",
          content: "Same here! I thought I was the only one.",
          timestamp: "3 min ago",
          likes: 1,
        },
      ],
    },
    {
      id: "2",
      content: "Wait, is this confirmed? I need more details!",
      timestamp: "8 min ago",
      likes: 1,
      replies: [],
    },
    {
      id: "3",
      content: "Thanks for sharing this info!",
      timestamp: "15 min ago",
      likes: 5,
      replies: [],
    },
  ])

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("gossupUser")
    if (userData) {
      setIsLoggedIn(true)
    }
  }, [])

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !isLoggedIn) return

    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      timestamp: "Just now",
      likes: 0,
      replies: [],
    }

    setComments([comment, ...comments])
    setNewComment("")
  }

  const handleLikeComment = (commentId: string) => {
    setComments(
      comments.map((comment) => (comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment)),
    )
  }

  const handleLikeReply = (commentId: string, replyId: string) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply.id === replyId ? { ...reply, likes: reply.likes + 1 } : reply,
              ),
            }
          : comment,
      ),
    )
  }

  const handleAddReply = (commentId: string) => {
    if (!newReply.trim() || !isLoggedIn) return

    const reply: Reply = {
      id: `reply-${commentId}-${Date.now()}`,
      content: newReply,
      timestamp: "Just now",
      likes: 0,
    }

    setComments(
      comments.map((comment) =>
        comment.id === commentId ? { ...comment, replies: [...comment.replies, reply] } : comment,
      ),
    )

    setNewReply("")
    setReplyingTo(null)
  }

  const toggleReplies = (commentId: string) => {
    setShowReplies({
      ...showReplies,
      [commentId]: !showReplies[commentId],
    })
  }

  return (
    <div className="mt-4 w-full border-t pt-4">
      <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
        <Input
          placeholder={isLoggedIn ? "Add a comment..." : "Sign in to comment"}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1"
          disabled={!isLoggedIn}
        />
        <Button type="submit" size="sm" disabled={!isLoggedIn}>
          Post
        </Button>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-2">
            <div className="flex gap-2">
              <div className="bg-muted w-6 h-6 rounded-full flex items-center justify-center text-xs">A</div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">Anonymous</span>
                    <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleLikeComment(comment.id)}
                    >
                      <Heart className="h-3 w-3" />
                      <span className="ml-1 text-xs">{comment.likes}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    >
                      <Reply className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm mt-1">{comment.content}</p>

                {replyingTo === comment.id && (
                  <div className="mt-2 flex gap-2">
                    <Input
                      placeholder="Write a reply..."
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                      className="flex-1 text-xs h-8"
                    />
                    <Button size="sm" className="h-8 text-xs py-0" onClick={() => handleAddReply(comment.id)}>
                      Reply
                    </Button>
                  </div>
                )}

                {comment.replies.length > 0 && (
                  <div className="mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs flex items-center gap-1 text-muted-foreground"
                      onClick={() => toggleReplies(comment.id)}
                    >
                      {showReplies[comment.id] ? (
                        <>
                          <ChevronUp className="h-3 w-3" />
                          Hide replies
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-3 w-3" />
                          Show {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
                        </>
                      )}
                    </Button>

                    {showReplies[comment.id] && (
                      <div className="space-y-2 mt-2 pl-6 border-l-2 border-muted">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-2">
                            <div className="bg-muted w-5 h-5 rounded-full flex items-center justify-center text-xs">
                              A
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium">Anonymous</span>
                                  <span className="text-xs text-muted-foreground">{reply.timestamp}</span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-5 w-5"
                                  onClick={() => handleLikeReply(comment.id, reply.id)}
                                >
                                  <Heart className="h-3 w-3" />
                                  <span className="ml-1 text-xs">{reply.likes}</span>
                                </Button>
                              </div>
                              <p className="text-xs mt-1">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

