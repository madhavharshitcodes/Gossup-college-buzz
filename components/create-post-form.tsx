"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { SendIcon } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function CreatePostForm() {
  const router = useRouter()
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("gossupUser")
    if (userData) {
      setIsLoggedIn(true)
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !isLoggedIn) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      // In a real app, this would send the post to your backend
      console.log("Submitting post:", content)

      // Add points for creating a post
      if (user) {
        const updatedUser = { ...user }
        updatedUser.points = (updatedUser.points || 0) + 10
        localStorage.setItem("gossupUser", JSON.stringify(updatedUser))

        // Show toast notification
        toast({
          title: "Post created!",
          description: "You earned 10 points for creating a post.",
        })
      }

      setContent("")
      setIsSubmitting(false)

      // Refresh the page to show the new post
      window.location.reload()
    }, 1000)
  }

  if (!isLoggedIn) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">Sign in to create a post</p>
          <Button className="mt-4" onClick={() => router.push("/login")}>
            Sign In
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg">{user?.avatar || "😎"}</div>
            <span className="text-sm font-medium">{user?.anonymousName || "Anonymous"}</span>
          </div>
          <Textarea
            placeholder="What's the latest gossip? Share anonymously..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none border-none focus-visible:ring-0 p-0 shadow-none"
          />
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="text-xs text-muted-foreground">Posting earns you 10 points!</div>
          <Button type="submit" size="sm" disabled={!content.trim() || isSubmitting}>
            <SendIcon className="h-4 w-4 mr-2" />
            {isSubmitting ? "Posting..." : "Post Anonymously"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

