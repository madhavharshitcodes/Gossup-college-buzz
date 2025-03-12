"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

const AVATARS = ["😎", "🦉", "👑", "🔍", "🦊", "🐱", "🐼", "🦁", "🐯", "🦄", "🐲", "🐺", "🦅", "🦋", "🐢", "🐬"]

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

export default function EditProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const section = searchParams.get("section")

  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    anonymousName: "",
    college: "",
    avatar: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("gossupUser")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setFormData({
        anonymousName: parsedUser.anonymousName || "",
        college: parsedUser.college || "",
        avatar: parsedUser.avatar || "😎",
      })
    } else {
      router.push("/login")
    }
    setIsLoading(false)
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const selectAvatar = (avatar: string) => {
    setFormData({
      ...formData,
      avatar,
    })
  }

  const canChangeUsername = () => {
    if (!user?.lastUsernameChange) return true

    const lastChange = new Date(user.lastUsernameChange)
    const now = new Date()
    const monthDiff = (now.getFullYear() - lastChange.getFullYear()) * 12 + now.getMonth() - lastChange.getMonth()
    return monthDiff >= 1
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate username change
    if (formData.anonymousName !== user?.anonymousName && !canChangeUsername()) {
      setError("You can only change your username once per month")
      return
    }

    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      if (user) {
        const updatedUser = {
          ...user,
          anonymousName: formData.anonymousName,
          college: formData.college,
          avatar: formData.avatar,
        }

        // If username was changed, update the last change date
        if (formData.anonymousName !== user.anonymousName) {
          updatedUser.lastUsernameChange = new Date().toISOString()
        }

        localStorage.setItem("gossupUser", JSON.stringify(updatedUser))
        setIsSaving(false)
        router.push("/profile")
      }
    }, 1000)
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null // Router will redirect to login
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/profile" className="flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to profile
          </Link>
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue={section === "username" ? "account" : "appearance"}>
            <CardContent>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
              </TabsList>
            </CardContent>

            <TabsContent value="account" className="px-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="anonymousName">Anonymous Username</Label>
                  <Input
                    id="anonymousName"
                    name="anonymousName"
                    value={formData.anonymousName}
                    onChange={handleChange}
                    disabled={!canChangeUsername()}
                  />
                  {!canChangeUsername() && (
                    <p className="text-xs text-muted-foreground">You can only change your username once per month</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="college">College</Label>
                  <Input id="college" name="college" value={formData.college} onChange={handleChange} />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="px-6">
              <div className="space-y-4">
                <Label>Choose Avatar</Label>
                <div className="grid grid-cols-4 gap-4">
                  {AVATARS.map((avatar) => (
                    <Button
                      key={avatar}
                      type="button"
                      variant={formData.avatar === avatar ? "default" : "outline"}
                      className="h-12 w-12 text-2xl"
                      onClick={() => selectAvatar(avatar)}
                    >
                      {avatar}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <CardFooter className="flex justify-between border-t mt-6 py-4">
            <Button variant="outline" type="button" onClick={() => router.push("/profile")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

