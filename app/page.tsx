"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import PostCard from "@/components/post-card"
import CreatePostForm from "@/components/create-post-form"
import { Sun, Moon, TrendingUp, Clock } from "lucide-react"
import { useTheme } from "next-themes"

// Mock posts data
const allPosts = [
  {
    id: "1",
    userId: "user1",
    username: "TruthTeller",
    avatar: "🦉",
    content: "Heard the CS professor is giving an open-book final exam this semester! 📚",
    timestamp: "10 minutes ago",
    likes: 42,
    dislikes: 5,
    comments: 8,
    shares: 3,
    verifications: 12,
  },
  {
    id: "2",
    userId: "user2",
    username: "CampusInsider",
    avatar: "🔍",
    content: "Someone left their AirPods in the library study room 3. If they're yours, the librarian has them.",
    timestamp: "1 hour ago",
    likes: 17,
    dislikes: 2,
    comments: 5,
    shares: 1,
    verifications: 3,
  },
  {
    id: "3",
    userId: "user3",
    username: "FoodieStudent",
    avatar: "🍕",
    content: "The cafeteria is serving pizza today and it's actually good for once! 🍕",
    timestamp: "2 hours ago",
    likes: 89,
    dislikes: 8,
    comments: 12,
    shares: 7,
    verifications: 25,
  },
  {
    id: "4",
    userId: "user4",
    username: "LibraryOwl",
    avatar: "📚",
    content:
      "Rumor has it that the dean is planning to extend library hours during finals week. Anyone else hear this?",
    timestamp: "3 hours ago",
    likes: 65,
    dislikes: 3,
    comments: 23,
    shares: 5,
    verifications: 7,
  },
  {
    id: "5",
    userId: "user5",
    username: "GossipQueen",
    avatar: "👑",
    content: "Just saw two professors arguing in the parking lot about who deserves the last parking spot. Drama! 👀",
    timestamp: "5 hours ago",
    likes: 124,
    dislikes: 10,
    comments: 31,
    shares: 15,
    verifications: 18,
  },
  {
    id: "6",
    userId: "user6",
    username: "DormLife",
    avatar: "🏠",
    content: "The wifi in the dorms is finally getting upgraded next week! No more lag during gaming sessions.",
    timestamp: "8 hours ago",
    likes: 95,
    dislikes: 4,
    comments: 18,
    shares: 12,
    verifications: 10,
  },
  {
    id: "7",
    userId: "user7",
    username: "CampusHero",
    avatar: "😎",
    content:
      "Found a wallet with $200 cash near the student center. Turned it in to campus security. If it's yours, check there!",
    timestamp: "12 hours ago",
    likes: 156,
    dislikes: 2,
    comments: 42,
    shares: 28,
    verifications: 35,
  },
]

export default function Home() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [avatar, setAvatar] = useState("")
  const [feedMode, setFeedMode] = useState("trending")
  const [posts, setPosts] = useState(allPosts)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("gossupUser")
    if (userData) {
      const user = JSON.parse(userData)
      setIsLoggedIn(true)
      setUsername(user.anonymousName)
      setAvatar(user.avatar || "😎")
    }

    // Set initial feed
    updateFeed("trending")
  }, [])

  const updateFeed = (mode: string) => {
    setFeedMode(mode)

    const sortedPosts = [...allPosts]

    if (mode === "trending") {
      // Sort by a combination of likes, comments, and verifications
      sortedPosts.sort((a, b) => {
        const scoreA = a.likes * 1 + a.comments * 2 + a.verifications * 3
        const scoreB = b.likes * 1 + b.comments * 2 + b.verifications * 3
        return scoreB - scoreA
      })

      // Add some randomness
      if (Math.random() > 0.7) {
        // Swap two random posts in the top 5
        const idx1 = Math.floor(Math.random() * 3)
        const idx2 = Math.floor(Math.random() * 3) + 2
        const temp = sortedPosts[idx1]
        sortedPosts[idx1] = sortedPosts[idx2]
        sortedPosts[idx2] = temp
      }
    } else if (mode === "latest") {
      // Sort by timestamp (newest first)
      sortedPosts.sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime()
        const timeB = new Date(b.timestamp).getTime()
        return timeB - timeA
      })
    }

    setPosts(sortedPosts)
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Gossup
            </span>
          </Link>
          <nav className="flex items-center gap-2">
            <Button
              variant={feedMode === "trending" ? "default" : "ghost"}
              size="sm"
              onClick={() => updateFeed("trending")}
              className="flex items-center gap-1"
            >
              <TrendingUp className="h-4 w-4" />
              Trending
            </Button>
            <Button
              variant={feedMode === "latest" ? "default" : "ghost"}
              size="sm"
              onClick={() => updateFeed("latest")}
              className="flex items-center gap-1"
            >
              <Clock className="h-4 w-4" />
              Latest
            </Button>
            <Button variant="outline" size="icon" onClick={toggleTheme} className="mr-2">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            {isLoggedIn ? (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => router.push("/profile")}
              >
                <div className="w-5 h-5 flex items-center justify-center">{avatar}</div>
                {username}
              </Button>
            ) : (
              <Button variant="default" size="sm" onClick={() => router.push("/login")}>
                Sign In
              </Button>
            )}
          </nav>
        </div>
      </header>
      <main className="container py-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <h1 className="text-3xl font-bold">Campus Buzz</h1>
            <CreatePostForm />
            <div className="space-y-4">
              {posts.map((post) => (
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
                  avatar={post.avatar}
                  username={post.username}
                  userId={post.userId}
                />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Card className="p-4">
              <h2 className="font-semibold mb-2">About Gossup</h2>
              <p className="text-sm text-muted-foreground">
                Gossup is your anonymous platform to share and discover what's happening around campus. Post
                anonymously, like, comment, and share the latest gossip!
              </p>
              <div className="mt-4 text-sm">
                <h3 className="font-medium mb-1">Community Guidelines:</h3>
                <ul className="list-disc pl-5 text-muted-foreground">
                  <li>Be respectful to others</li>
                  <li>No hate speech or bullying</li>
                  <li>Don't share personal information</li>
                  <li>No explicit content</li>
                </ul>
              </div>
            </Card>
            <Card className="p-4">
              <h2 className="font-semibold mb-2">Trending Topics</h2>
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  #FinalsWeek
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  #CampusFood
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  #DormLife
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  #ProfessorFails
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  #LibrarySecrets
                </Button>
              </div>
            </Card>
            <Card className="p-4">
              <h2 className="font-semibold mb-2">Top Gossipers</h2>
              <div className="space-y-3">
                {[
                  { name: "GossipQueen", points: 1250, avatar: "👑" },
                  { name: "CampusHero", points: 980, avatar: "😎" },
                  { name: "TruthTeller", points: 870, avatar: "🦉" },
                ].map((user, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg">{user.avatar}</div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{user.points} pts</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Gossup. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              Terms
            </Button>
            <Button variant="ghost" size="sm">
              Privacy
            </Button>
            <Button variant="ghost" size="sm">
              Contact
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

