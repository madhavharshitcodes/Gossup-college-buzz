"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Edit, Award, Star, Calendar, Sun, Moon } from "lucide-react"
import PostCard from "@/components/post-card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "next-themes"

interface User {
  id: string
  anonymousName: string
  college?: string
  isLoggedIn: boolean
  avatar?: string
  points?: number
  lastUsernameChange?: string
  verifiedGossiper?: boolean
  joinDate?: string
  timeSpent?: number
}

export default function ProfilePage() {
  const router = useRouter()
  const { setTheme, theme } = useTheme()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [rankingPeriod, setRankingPeriod] = useState("weekly")
  const [postFilter, setPostFilter] = useState("popular")

  // Mock data for user activity
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
  ]

  const likedPosts = [
    {
      id: "liked-post-1",
      content: "Heard the CS professor is giving an open-book final exam this semester! 📚",
      timestamp: "10 hours ago",
      likes: 42,
      dislikes: 5,
      comments: 8,
      shares: 3,
      verifications: 12,
    },
  ]

  // Mock data for rankings
  const rankings = {
    daily: [
      { name: "CampusHero", points: 320, avatar: "😎" },
      { name: "TruthTeller", points: 280, avatar: "🦉" },
      { name: "LibraryOwl", points: 245, avatar: "📚" },
    ],
    weekly: [
      { name: "GossipQueen", points: 1250, avatar: "👑" },
      { name: "CampusHero", points: 980, avatar: "😎" },
      { name: "TruthTeller", points: 870, avatar: "🦉" },
    ],
    yearly: [
      { name: "GossipQueen", points: 15420, avatar: "👑" },
      { name: "CampusInsider", points: 12840, avatar: "🔍" },
      { name: "TruthTeller", points: 10750, avatar: "🦉" },
    ],
  }

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("gossupUser")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      // Add mock points and verified status if not present
      if (!parsedUser.points) {
        parsedUser.points = 325
        parsedUser.verifiedGossiper = true
        parsedUser.joinDate = "2023-09-15"
        parsedUser.timeSpent = 15 // hours
        parsedUser.lastUsernameChange = "2023-12-01"
        if (!parsedUser.avatar) {
          parsedUser.avatar = "😎"
        }
        localStorage.setItem("gossupUser", JSON.stringify(parsedUser))
      }
      setUser(parsedUser)
    } else {
      router.push("/login")
    }
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("gossupUser")
    router.push("/login")
  }

  const canChangeUsername = () => {
    if (!user?.lastUsernameChange) return true

    const lastChange = new Date(user.lastUsernameChange)
    const now = new Date()
    const monthDiff = (now.getFullYear() - lastChange.getFullYear()) * 12 + now.getMonth() - lastChange.getMonth()
    return monthDiff >= 1
  }

  const handleEditProfile = () => {
    router.push("/profile/edit")
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

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
    return null // Router will redirect to login
  }

  return (
    <div className="container py-6">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Your Profile</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={toggleTheme}>
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="outline" onClick={handleEditProfile}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
          <CardDescription>Your anonymous identity on Gossup</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-purple-400 to-pink-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {user.avatar || user.anonymousName.charAt(0).toUpperCase()}
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
                  {user.college && <p className="text-sm text-muted-foreground">{user.college}</p>}
                </div>
              </div>
              <div className="mt-4 flex gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Posts</p>
                  <p className="font-medium">{userPosts.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Likes Given</p>
                  <p className="font-medium">{likedPosts.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Verifications</p>
                  <p className="font-medium">15</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Points</p>
                  <p className="font-medium">{user.points}</p>
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full md:w-auto grid-cols-3">
              <TabsTrigger value="posts">Your Posts</TabsTrigger>
              <TabsTrigger value="likes">Liked Posts</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            <div className="flex justify-end mt-4">
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
            <TabsContent value="posts" className="mt-2 space-y-4">
              {sortedPosts().length > 0 ? (
                sortedPosts().map((post) => (
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
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="py-6 text-center">
                    <p className="text-muted-foreground">You haven&apos;t posted anything yet.</p>
                    <Button className="mt-4" onClick={() => router.push("/")}>
                      Create a Post
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="likes" className="mt-2 space-y-4">
              {likedPosts.length > 0 ? (
                likedPosts.map((post) => (
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
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="py-6 text-center">
                    <p className="text-muted-foreground">You haven&apos;t liked any posts yet.</p>
                    <Button className="mt-4" onClick={() => router.push("/")}>
                      Browse Posts
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="activity" className="mt-2">
              <Card>
                <CardContent className="py-6 space-y-4">
                  <div className="border-l-2 border-primary pl-4 py-2">
                    <p className="text-sm">
                      You verified a post:{" "}
                      <span className="font-medium">"The library is extending hours during finals week"</span>
                    </p>
                    <p className="text-xs text-muted-foreground">Today, 2:45 PM</p>
                  </div>
                  <div className="border-l-2 border-primary pl-4 py-2">
                    <p className="text-sm">
                      You commented on a post:{" "}
                      <span className="font-medium">"This is definitely true, I was there!"</span>
                    </p>
                    <p className="text-xs text-muted-foreground">Yesterday, 10:30 AM</p>
                  </div>
                  <div className="border-l-2 border-primary pl-4 py-2">
                    <p className="text-sm">You created a new post</p>
                    <p className="text-xs text-muted-foreground">3 days ago</p>
                  </div>
                  <div className="border-l-2 border-green-500 pl-4 py-2">
                    <p className="text-sm">
                      <span className="font-medium">+25 points</span> earned for post engagement
                    </p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                  <div className="border-l-2 border-blue-500 pl-4 py-2">
                    <p className="text-sm">
                      <span className="font-medium">Achievement unlocked:</span> Verified Gossiper
                    </p>
                    <p className="text-xs text-muted-foreground">1 week ago</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Gossup Rankings</CardTitle>
                <Select value={rankingPeriod} onValueChange={setRankingPeriod}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        Daily
                      </div>
                    </SelectItem>
                    <SelectItem value="weekly">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        Weekly
                      </div>
                    </SelectItem>
                    <SelectItem value="yearly">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        Yearly
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rankings[rankingPeriod as keyof typeof rankings].map((ranker, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                        {index === 0 ? (
                          <Star className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <span className="font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg mr-2">
                          {ranker.avatar}
                        </div>
                        <span className="font-medium">{ranker.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span>{ranker.points} pts</span>
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg mr-2">
                      {user.avatar}
                    </div>
                    <span className="font-medium">{user.anonymousName}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span>{user.points} pts</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Member since</p>
                <p className="font-medium">{user.joinDate ? new Date(user.joinDate).toLocaleDateString() : "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time spent on Gossup</p>
                <p className="font-medium">{user.timeSpent} hours</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Username changes</p>
                <div className="flex items-center justify-between">
                  <p className="font-medium">{canChangeUsername() ? "Available" : "Available next month"}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!canChangeUsername()}
                    onClick={() => router.push("/profile/edit?section=username")}
                  >
                    Change
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

