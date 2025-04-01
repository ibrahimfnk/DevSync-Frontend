"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Star, GitFork, Clock, Code, BookOpen, Bell, MapPin, LinkIcon, Edit2, User, Users } from "lucide-react"
import AnimatedLogo from "../home/comp/AnimatedLogo"
import { DarkModeToggle } from "../home/comp/DarkMode"
import Footer from "../home/comp/Footer"
import { useNavigate, Link } from "react-router-dom"

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    location: "",
    website: "",
    avatar: "/placeholder-user.jpg",
    repositories: 0,
    followers: 0,
    following: 0,
    stars: 0,
    contributions: 0,
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState(userData)
  const [repositories, setRepositories] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRepositories = async () => {
      setIsLoading(true)
      try {
        const userId = localStorage.getItem("userId")
        if (!userId) {
          setError("User not authenticated")
          setIsLoading(false)
          return
        }

        const response = await fetch(`http://34.227.150.165:3000/repo/user/${userId}`)
        if (!response.ok) {
          throw new Error("Failed to load your repositories")
        }

        const data = await response.json()
        setRepositories(data.repositories)

        // Update user data with repository count
        setUserData((prev) => ({
          ...prev,
          repositories: data.repositories.length,
        }))
      } catch (error) {
        setError("Failed to load your repositories")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRepositories()
  }, [])

  const [recentActivity, setRecentActivity] = useState([
    {
      type: "commit",
      repo: "project-a",
      message: "Added new feature",
      time: "2 hours ago",
    },
    {
      type: "pull_request",
      repo: "project-b",
      message: "Merged PR #123",
      time: "5 hours ago",
    },
    {
      type: "issue",
      repo: "project-c",
      message: "Fixed bug #456",
      time: "1 day ago",
    },
  ])

  const [topRepositories, setTopRepositories] = useState([
    {
      name: "project-a",
      description: "A great project",
      stars: 45,
      forks: 12,
      language: "JavaScript",
    },
    {
      name: "project-b",
      description: "Another awesome project",
      stars: 32,
      forks: 8,
      language: "TypeScript",
    },
  ])

  const [starredRepos, setStarredRepos] = useState([])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId")
        if (!userId) {
          setError("User not authenticated")
          setIsLoading(false)
          return
        }

        const response = await fetch(`http://34.227.150.165:3000/userProfile/${userId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }

        const data = await response.json()

        // Transform the data to match our frontend structure
        const transformedData = {
          name: data.username || "",
          username: data.username || "",
          email: data.email || "",
          bio: data.bio || "",
          location: data.location || "",
          website: data.website || "",
          avatar: data.avatar || "/placeholder-user.jpg",
          repositories: data.repositories?.length || 0,
          followers: data.followedUsers?.length || 0,
          following: data.followingUsers?.length || 0,
          stars: data.starredRepositories?.length || 0,
          contributions: data.contributions || 0,
        }

        setUserData(transformedData)
        setEditForm(transformedData)
        setStarredRepos(data.starredRepositories || [])
        setIsLoading(false)
      } catch (error) {
        setError(error.message)
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleSaveProfile = async () => {
    try {
      const userId = localStorage.getItem("userId")
      if (!userId) {
        setError("User not authenticated")
        return
      }

      const response = await fetch(`http://34.227.150.165:3000/user/userProfile/update/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: editForm.email,
          username: editForm.username,
          bio: editForm.bio,
          location: editForm.location,
          website: editForm.website,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const updatedData = await response.json()

      // Transform the updated data to match our frontend structure
      const transformedData = {
        name: updatedData.username || "",
        username: updatedData.username || "",
        email: updatedData.email || "",
        bio: updatedData.bio || "",
        location: updatedData.location || "",
        website: updatedData.website || "",
        avatar: updatedData.avatar || "/placeholder-user.jpg",
        repositories: updatedData.repositories?.length || 0,
        followers: updatedData.followedUsers?.length || 0,
        following: updatedData.followingUsers?.length || 0,
        stars: updatedData.starredRepositories?.length || 0,
        contributions: updatedData.contributions || 0,
      }

      setUserData(transformedData)
      setIsEditing(false)
      setError(null)
    } catch (error) {
      setError(error.message)
    }
  }

  const handleStarRepo = async (repoId) => {
    try {
      const userId = localStorage.getItem("userId")
      if (!userId) {
        setError("User not authenticated")
        return
      }

      const response = await fetch(`http://34.227.150.165:3000/repo/star/${repoId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error("Failed to star repository")
      }

      const data = await response.json()

      // Update the starred repositories list
      setStarredRepos(data.starredRepositories)
      setUserData((prev) => ({
        ...prev,
        stars: data.starredRepositories.length,
      }))
    } catch (error) {
      setError(error.message)
    }
  }

  const handleUnstarRepo = async (repoId) => {
    try {
      const userId = localStorage.getItem("userId")
      if (!userId) {
        setError("User not authenticated")
        return
      }

      const response = await fetch(`http://34.227.150.165:3000/repo/unstar/${repoId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error("Failed to unstar repository")
      }

      const data = await response.json()

      // Update the starred repositories list
      setStarredRepos(data.starredRepositories)
      setUserData((prev) => ({
        ...prev,
        stars: data.starredRepositories.length,
      }))
    } catch (error) {
      setError(error.message)
    }
  }

  const languageColors = {
    JavaScript: "bg-yellow-400",
    TypeScript: "bg-blue-400",
    Python: "bg-green-400",
    Java: "bg-orange-400",
    "C#": "bg-purple-400",
    Ruby: "bg-red-400",
    Go: "bg-cyan-400",
    PHP: "bg-indigo-400",
    HTML: "bg-pink-400",
    CSS: "bg-teal-400",
  }

  if (isLoading) {
    return (
      <>
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <AnimatedLogo />
                <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-white cursor-pointer">DevSync</span>
              </div>
              <nav className="hidden md:flex space-x-4">
                <Link
                  to="/dashboard"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Profile
                </Link>
              </nav>
              <div className="flex items-center">
                <DarkModeToggle />
                <Button variant="outline" onClick={() => navigate("/auth")} className="ml-4">
                  Sign In
                </Button>
                <Button variant="outline" className="ml-4" onClick={() => navigate("/signup")}>
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        </header>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-6">
              <Skeleton className="h-64 w-full rounded-xl" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-48 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>  <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <AnimatedLogo />
            <button 
                onClick={() => navigate("/home")} 
                className="ml-2 text-2xl font-bold text-gray-900 dark:text-white cursor-pointer"
              >
                DevSync
              </button>
          </div>
          <nav className="hidden md:flex space-x-4">
            <Link
              to="/"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Profile
            </Link>
          </nav>
          <div className="flex items-center">
            <DarkModeToggle />
            <Button variant="outline" onClick={() => navigate("/auth")} className="ml-4">
              Sign In
            </Button>
            <Button variant="outline" className="ml-4" onClick={() => navigate("/signup")}>
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </header>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-white dark:bg-gray-800 border-none shadow-lg">
            <CardContent className="py-12 text-center">
              <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-600 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Error Loading Profile</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
              <Button
                variant="default"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div></>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <AnimatedLogo />
                <button 
                onClick={() => navigate("/home")} 
                className="ml-2 text-2xl font-bold text-gray-900 dark:text-white cursor-pointer"
              >
                DevSync
              </button>
              </div>
            </div>
            <nav className="hidden md:flex space-x-4">
              <Link
                to="/"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Profile
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
              </Button>
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="relative">
            <div className="h-48 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500"></div>
            <div className="absolute -bottom-16 left-8">
              <Avatar className="h-32 w-32 border-4 border-white dark:border-gray-800 shadow-lg">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-2xl">
                  {userData.name[0]}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="mt-20 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{userData.name}</h1>
              <p className="text-gray-500 dark:text-gray-400">@{userData.username}</p>
              <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-2xl">{userData.bio}</p>

              <div className="mt-4 flex flex-wrap items-center gap-4">
                {userData.location && (
                  <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                    <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span>{userData.location}</span>
                  </div>
                )}
                {userData.website && (
                  <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                    <LinkIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <a
                      href={userData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {userData.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 md:mt-0">
              <Button
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="bg-white dark:bg-gray-800 border-none shadow-md hover:shadow-lg transition-all duration-200">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-2 mb-2">
                  <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{repositories.length}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Repositories</div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-none shadow-md hover:shadow-lg transition-all duration-200">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-2 mb-2">
                  <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{userData.followers}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Followers</div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-none shadow-md hover:shadow-lg transition-all duration-200">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-2 mb-2">
                  <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{userData.following}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Following</div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-none shadow-md hover:shadow-lg transition-all duration-200">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/20 p-2 mb-2">
                  <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{userData.stars}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Stars</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs Content */}
        <Tabs defaultValue="repositories" className="mt-8">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-8">
            <TabsTrigger
              value="repositories"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Repositories
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Activity
            </TabsTrigger>
            <TabsTrigger value="starred" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Starred
            </TabsTrigger>
          </TabsList>

          <TabsContent value="repositories" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {topRepositories.map((repo, index) => (
                <Card
                  key={index}
                  className="bg-white dark:bg-gray-800 border-none shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{repo.name}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`shrink-0 ${
                          starredRepos.includes(repo.id)
                            ? "text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-300"
                            : "text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                        }`}
                        onClick={() => {
                          if (starredRepos.includes(repo.id)) {
                            handleUnstarRepo(repo.id)
                          } else {
                            handleStarRepo(repo.id)
                          }
                        }}
                      >
                        <Star className={`h-5 w-5 ${starredRepos.includes(repo.id) ? "fill-current" : ""}`} />
                      </Button>
                    </div>
                    <CardDescription className="text-gray-500 dark:text-gray-400">{repo.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mt-2">
                      {repo.language && (
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`h-3 w-3 rounded-full ${languageColors[repo.language] || "bg-gray-400"}`}
                          ></span>
                          <span className="text-sm text-gray-600 dark:text-gray-300">{repo.language}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Star className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{repo.stars}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <GitFork className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{repo.forks}</span>
                      </div>
                    </div>
                  </CardContent>
                  <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-0">
            <Card className="bg-white dark:bg-gray-800 border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</CardTitle>
                <CardDescription>Your latest contributions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 group">
                      <div className="relative">
                        <div className="rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 p-2 text-white shadow-md">
                          {activity.type === "commit" && <Code className="h-5 w-5" />}
                          {activity.type === "pull_request" && <GitFork className="h-5 w-5" />}
                          {activity.type === "issue" && <BookOpen className="h-5 w-5" />}
                        </div>
                        {index < recentActivity.length - 1 && (
                          <div className="absolute top-10 bottom-0 left-1/2 w-0.5 -translate-x-1/2 bg-gray-200 dark:bg-gray-700 h-full"></div>
                        )}
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 w-full group-hover:bg-gray-100 dark:group-hover:bg-gray-800 transition-colors duration-200">
                        <p className="font-medium text-gray-900 dark:text-white">{activity.message}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                          <Badge
                            variant="outline"
                            className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                          >
                            {activity.repo}
                          </Badge>
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="starred" className="mt-0">
            <Card className="bg-white dark:bg-gray-800 border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Starred Repositories</CardTitle>
                <CardDescription>Projects you've starred</CardDescription>
              </CardHeader>
              <CardContent>
                {starredRepos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topRepositories
                      .filter((repo) => starredRepos.includes(repo.id))
                      .map((repo, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">{repo.name}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{repo.description}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-300"
                              onClick={() => handleUnstarRepo(repo.id)}
                            >
                              <Star className="h-5 w-5 fill-current" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-4 mt-2">
                            {repo.language && (
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`h-3 w-3 rounded-full ${languageColors[repo.language] || "bg-gray-400"}`}
                                ></span>
                                <span className="text-sm text-gray-600 dark:text-gray-300">{repo.language}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1.5">
                              <Star className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <span className="text-sm text-gray-600 dark:text-gray-300">{repo.stars}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <GitFork className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <span className="text-sm text-gray-600 dark:text-gray-300">{repo.forks}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                      <Star className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No starred repositories</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      You haven't starred any repositories yet. When you find interesting projects, star them to save
                      for later.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Profile Modal */}
      <Sheet open={isEditing} onOpenChange={setIsEditing}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold text-gray-900 dark:text-white">Edit Profile</SheetTitle>
            <SheetDescription>Make changes to your profile information.</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-6">
            <div className="flex items-center justify-center mb-4">
              <Avatar className="h-24 w-24 border-2 border-blue-500 dark:border-blue-400">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-2xl">
                  {userData.name[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                Name
              </Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bio" className="text-gray-700 dark:text-gray-300">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                className="w-full border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 min-h-[100px]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location" className="text-gray-700 dark:text-gray-300">
                Location
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  id="location"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full pl-10 border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="website" className="text-gray-700 dark:text-gray-300">
                Website
              </Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  id="website"
                  value={editForm.website}
                  onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                  className="w-full pl-10 border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>
            </div>
          </div>
          <SheetFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveProfile}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              Save Changes
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Footer />
    </div>
  )
}

export default Profile

