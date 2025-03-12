"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

const AVATARS = ["😎", "🦉", "👑", "🔍", "🦊", "🐱", "🐼", "🦁", "🐯", "🦄", "🐲", "🐺", "🦅", "🦋", "🐢", "🐬"]

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    college: "",
    agreeTerms: false,
    avatar: "😎",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      agreeTerms: checked,
    })
  }

  const selectAvatar = (avatar: string) => {
    setFormData({
      ...formData,
      avatar,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!formData.agreeTerms) {
      setError("You must agree to the terms and conditions")
      return
    }

    setIsLoading(true)

    // Simulate signup API call
    setTimeout(() => {
      // In a real app, this would create a new user in your backend
      localStorage.setItem(
        "gossupUser",
        JSON.stringify({
          id: "user" + Date.now(),
          anonymousName: formData.username,
          college: formData.college,
          isLoggedIn: true,
          avatar: formData.avatar,
          points: 0,
          joinDate: new Date().toISOString(),
          timeSpent: 0,
          verifiedGossiper: false,
        }),
      )
      setIsLoading(false)
      router.push("/")
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Join Gossup
            </span>
          </CardTitle>
          <CardDescription className="text-center">Create your anonymous account to start gossiping</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Anonymous Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="Choose a secret username"
                required
                value={formData.username}
                onChange={handleChange}
              />
              <p className="text-xs text-muted-foreground">This will be your anonymous identity on Gossup</p>
            </div>

            <div className="space-y-2">
              <Label>Choose Avatar</Label>
              <div className="grid grid-cols-4 gap-2">
                {AVATARS.map((avatar) => (
                  <Button
                    key={avatar}
                    type="button"
                    variant={formData.avatar === avatar ? "default" : "outline"}
                    className="h-10 w-10 p-0 text-xl"
                    onClick={() => selectAvatar(avatar)}
                  >
                    {avatar}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="college">College</Label>
              <Input
                id="college"
                name="college"
                placeholder="Enter your college name"
                required
                value={formData.college}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" checked={formData.agreeTerms} onCheckedChange={handleCheckboxChange} />
              <Label htmlFor="terms" className="text-sm">
                I agree to the terms of service and privacy policy
              </Label>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

