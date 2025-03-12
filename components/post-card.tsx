"use client"

import { useState, useEffect } from "react"
import { Heart, MessageCircle, Share2, MoreHorizontal, ThumbsDown, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import CommentSection from "@/components/comment-section"
import { useRouter } from "next/navigation"

interface PostCardProps {
  id: string
  content: string
  timestamp: string
  likes: number
  dislikes?: number
  comments: number
  shares: number
  verifications?: number
  showVerified?: boolean
  avatar?: string
  username?: string
  userId?: string
}

export default function PostCard({
  id,
  content,
  timestamp,
  likes: initialLikes,
  dislikes: initialDislikes = 0,
  comments: commentCount,
  shares: initialShares,
  verifications: initialVerifications = 0,
  showVerified = false,
  avatar = "😎",
  username = "Anonymous",
  userId,
}: PostCardProps) {
  const router = useRouter()
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)
  const [verified, setVerified] = useState(false)
  const [likes, setLikes] = useState(initialLikes)
  const [dislikes, setDislikes] = useState(initialDislikes)
  const [shares, setShares] = useState(initialShares)
  const [verifications, setVerifications] = useState(initialVerifications)
  const [showComments, setShowComments] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [authAction, setAuthAction] = useState("")
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("gossupUser")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setIsLoggedIn(true)
      setUser(parsedUser)

      // Check if user has already interacted with this post
      const likedPosts = JSON.parse(localStorage.getItem(`${parsedUser.id}_likes`) || "[]")
      const dislikedPosts = JSON.parse(localStorage.getItem(`${parsedUser.id}_dislikes`) || "[]")
      const verifiedPosts = JSON.parse(localStorage.getItem(`${parsedUser.id}_verifications`) || "[]")

      setLiked(likedPosts.includes(id))
      setDisliked(dislikedPosts.includes(id))
      setVerified(verifiedPosts.includes(id))
    }
  }, [id])

  const requireAuth = (action: string) => {
    if (!isLoggedIn) {
      setAuthAction(action)
      setShowAuthDialog(true)
      return true
    }
    return false
  }

  const handleLike = () => {
    if (requireAuth("like")) return

    const userData = localStorage.getItem("gossupUser")
    if (!userData) return

    const user = JSON.parse(userData)
    const likedPosts = JSON.parse(localStorage.getItem(`${user.id}_likes`) || "[]")
    const dislikedPosts = JSON.parse(localStorage.getItem(`${user.id}_dislikes`) || "[]")

    if (liked) {
      // Unlike
      setLikes(likes - 1)
      setLiked(false)
      const updatedLikedPosts = likedPosts.filter((postId: string) => postId !== id)
      localStorage.setItem(`${user.id}_likes`, JSON.stringify(updatedLikedPosts))
    } else {
      // Like
      setLikes(likes + 1)
      setLiked(true)
      likedPosts.push(id)
      localStorage.setItem(`${user.id}_likes`, JSON.stringify(likedPosts))

      // If post was disliked, remove dislike
      if (disliked) {
        setDislikes(dislikes - 1)
        setDisliked(false)
        const updatedDislikedPosts = dislikedPosts.filter((postId: string) => postId !== id)
        localStorage.setItem(`${user.id}_dislikes`, JSON.stringify(updatedDislikedPosts))
      }
    }
  }

  const handleDislike = () => {
    if (requireAuth("dislike")) return

    const userData = localStorage.getItem("gossupUser")
    if (!userData) return

    const user = JSON.parse(userData)
    const dislikedPosts = JSON.parse(localStorage.getItem(`${user.id}_dislikes`) || "[]")
    const likedPosts = JSON.parse(localStorage.getItem(`${user.id}_likes`) || "[]")

    if (disliked) {
      // Remove dislike
      setDislikes(dislikes - 1)
      setDisliked(false)
      const updatedDislikedPosts = dislikedPosts.filter((postId: string) => postId !== id)
      localStorage.setItem(`${user.id}_dislikes`, JSON.stringify(updatedDislikedPosts))
    } else {
      // Dislike
      setDislikes(dislikes + 1)
      setDisliked(true)
      dislikedPosts.push(id)
      localStorage.setItem(`${user.id}_dislikes`, JSON.stringify(dislikedPosts))

      // If post was liked, remove like
      if (liked) {
        setLikes(likes - 1)
        setLiked(false)
        const updatedLikedPosts = likedPosts.filter((postId: string) => postId !== id)
        localStorage.setItem(`${user.id}_likes`, JSON.stringify(updatedLikedPosts))
      }
    }
  }

  const handleVerify = () => {
    if (requireAuth("verify")) return

    const userData = localStorage.getItem("gossupUser")
    if (!userData) return

    const user = JSON.parse(userData)
    const verifiedPosts = JSON.parse(localStorage.getItem(`${user.id}_verifications`) || "[]")

    if (verified) {
      // Remove verification
      setVerifications(verifications - 1)
      setVerified(false)
      const updatedVerifiedPosts = verifiedPosts.filter((postId: string) => postId !== id)
      localStorage.setItem(`${user.id}_verifications`, JSON.stringify(updatedVerifiedPosts))
    } else {
      // Verify
      setVerifications(verifications + 1)
      setVerified(true)
      verifiedPosts.push(id)
      const updatedVerifiedPosts = verifiedPosts
      localStorage.setItem(`${user.id}_verifications`, JSON.stringify(updatedVerifiedPosts))

      // Add points for verification
      if (user.points) {
        user.points += 5
        localStorage.setItem("gossupUser", JSON.stringify(user))
      }
    }
  }

  const handleShare = () => {
    if (requireAuth("share")) return

    setShares(shares + 1)
    // In a real app, this would open a share dialog
  }

  const handleComment = () => {
    if (requireAuth("comment")) return

    setShowComments(!showComments)
  }

  const handleViewProfile = () => {
    if (userId) {
      router.push(`/user/${userId}`)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div
              className="bg-gradient-to-r from-purple-400 to-pink-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold cursor-pointer"
              onClick={handleViewProfile}
            >
              {avatar}
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium cursor-pointer hover:underline" onClick={handleViewProfile}>
                {username}
              </p>
              <p className="text-xs text-muted-foreground">{timestamp}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Report</DropdownMenuItem>
              <DropdownMenuItem>Copy link</DropdownMenuItem>
              <DropdownMenuItem>Hide post</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-base">{content}</p>

        {(verifications > 0 || showVerified) && (
          <div className="mt-3 flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-xs text-muted-foreground">
              Verified by {verifications} {verifications === 1 ? "person" : "people"}
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col border-t pt-4">
        <div className="flex justify-between w-full">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-1 ${liked ? "text-pink-500" : ""}`}
            onClick={handleLike}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-current text-pink-500" : ""}`} />
            <span>{likes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-1 ${disliked ? "text-red-500" : ""}`}
            onClick={handleDislike}
          >
            <ThumbsDown className={`h-4 w-4 ${disliked ? "fill-current text-red-500" : ""}`} />
            <span>{dislikes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={handleComment}>
            <MessageCircle className="h-4 w-4" />
            <span>{commentCount}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
            <span>{shares}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-1 ${verified ? "text-green-500" : ""}`}
            onClick={handleVerify}
          >
            <CheckCircle className={`h-4 w-4 ${verified ? "fill-current text-green-500" : ""}`} />
            <span>Verify</span>
          </Button>
        </div>

        {showComments && <CommentSection postId={id} commentCount={commentCount} />}
      </CardFooter>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign in required</DialogTitle>
            <DialogDescription>You need to sign in to {authAction} this post.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <Button variant="outline" onClick={() => setShowAuthDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => router.push("/login")}>Sign In</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

