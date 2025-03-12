"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, ChevronLeft } from "lucide-react"
import PostCard from "@/components/post-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

interface UserProfileProps {
  params: {
    id: string
  }
}

export default function UserProfilePage({ params }: UserProfileProps) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [postFilter, setPostFilter] = useState("popular")

  // Mock data for user posts
  const userPosts = [
    {
      id: "user-post-1",
      content: "Just found out our professor secretly plays in a rock band on weekends! 🎸",
      timestamp: "2 days ago",
      likes: 47,
      dislikes: 3,
      comments: 12,
      shares: 5,
      verifications: 8,
    },
    {
      id: "user-post-2",
      content: "The cafeteria is going to start serving sushi on Fridays. Anyone else heard this?",
      timestamp: "5 days ago",
      likes: 32,
      dislikes: 7,
      comments: 8,
      shares: 2,
      verifications: 3,
    },
    {
      id: "user-post-3",
      content: "Library is extending hours during finals week. Finally!",
      timestamp: "1 week ago",
      likes: 78,
      dislikes: 2,
      comments: 15,
      shares: 8,
      verifications: 20,
    },
  ]

  useEffect(() => {
    // In a real app, this would fetch the user data from an API
    // For now, we'll use mock data
    setTimeout(() => {
      setUser({
        id: params.id,
        anonymousName: "CampusHero",
        avatar: "😎",
        verifiedGossiper: true,
        points: 980,
        joinDate: "2023-06-15",
      })
      setIsLoading(false)
    }, 500)
  }, [params.id])

  const sortedPosts = () => {
    switch (postFilter) {
      case "popular":
        return [...userPosts].sort((a, b) => b.likes - a.likes)
      case "newest":
        return [...userPosts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      case "oldest":
        return [...userPosts].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      default:
        return userPosts
    }
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return <div className="container py-6">User not found</div>
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" className="flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to feed
          </Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">User Profile</CardTitle>
          <CardDescription>View this user's posts and activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-400 to-pink-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {user.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">{user.anonymousName}</h3>
                {user.verifiedGossiper && (
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                    <Award className="h-3 w-3 mr-1" /> Verified Gossiper
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Member since {new Date(user.joinDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Posts</h2>
          <Select value={postFilter} onValueChange={setPostFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter posts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {sortedPosts().map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              content={post.content}
              timestamp={post.timestamp}
              likes={post.likes}
              dislikes={post.dislikes}
              comments={post.comments}
              shares={post.shares}
              verifications={post.verifications}
              showVerified={true}
              avatar={user.avatar}
              username={user.anonymousName}
              userId={user.id}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

