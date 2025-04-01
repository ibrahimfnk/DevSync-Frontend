"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Star, GitFork, Clock, Calendar, Code, BookOpen, Bell, Plus, ChevronDown, Menu } from "lucide-react"
import AnimatedLogo from "../home/comp/AnimatedLogo"
import { DarkModeToggle } from "../home/comp/DarkMode"
import Footer from "../home/comp/Footer"
import { Skeleton } from "@/components/ui/skeleton"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Label } from "@/components/auth/comp/label"
import {Link} from "react-router-dom"
import { useNavigate } from "react-router-dom"

const ITEMS_PER_PAGE = 5

const Dashboard = () => {
  const [repositories, setRepositories] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestedRepositories, setSuggestedRepositories] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }
    return "light"
  })
  const navigate = useNavigate();

  // Pagination states
  const [suggestedPage, setSuggestedPage] = useState(1)
  const [repoPage, setRepoPage] = useState(1)
  const [eventsPage, setEventsPage] = useState(1)

  // New repository form state
  const [isNewRepoModalOpen, setIsNewRepoModalOpen] = useState(false)
  const [newRepoForm, setNewRepoForm] = useState({
    name: "",
    description: "",
    visibility: true, // true for public, false for private
  })
  const [isCreatingRepo, setIsCreatingRepo] = useState(false)

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  useEffect(() => {
    const userId = localStorage.getItem("userId")

    const fetchRepositories = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`http://44.211.197.251:3000/repo/user/${userId}`)
        const data = await response.json()
        setRepositories(data.repositories)
        setSearchResults(data.repositories)
      } catch (error) {
        setError("Failed to load your repositories")
      } finally {
        setIsLoading(false)
      }
    }

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`http://44.211.197.251:3000/repo/all`)
        const data = await response.json()
        setSuggestedRepositories(data)
      } catch (error) {
        console.error("Error fetching suggested repositories:", error)
      }
    }

    fetchRepositories()
    fetchSuggestedRepositories()
  }, [])

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repositories)
    } else {
      const filteredRepo = repositories.filter((repo) => repo.name.toLowerCase().includes(searchQuery.toLowerCase()))
      setSearchResults(filteredRepo)
    }
  }, [searchQuery, repositories])

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString || Date.now())
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) return "just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
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

  // Pagination logic
  const paginate = (items, page) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE
    return items.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }

  const totalSuggestedPages = Math.ceil(suggestedRepositories.length / ITEMS_PER_PAGE)
  const totalRepoPages = Math.ceil(searchResults.length / ITEMS_PER_PAGE)
  const totalEventsPages = Math.ceil(4 / ITEMS_PER_PAGE) // Assuming 4 events for now

  const events = [
    { name: "Tech Conference", date: "Dec 15" },
    { name: "Developer Conference", date: "Dec 15" },
    { name: "Tester Conference", date: "Dec 15" },
    { name: "Management Conference", date: "Dec 15" },
  ]

  const handleCreateRepository = async () => {
    if (!newRepoForm.name) {
      setError("Repository name is required")
      return
    }

    setIsCreatingRepo(true)
    try {
      const userId = localStorage.getItem("userId")
      const response = await fetch("http://44.211.197.251:3000/repo/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          owner: userId,
          name: newRepoForm.name,
          description: newRepoForm.description,
          visibility: newRepoForm.visibility,
          issues: [],
          content: [],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create repository")
      }

      const data = await response.json()
      // Refresh repositories list
      const updatedRepos = await fetch(`http://44.211.197.251:3000/repo/user/${userId}`).then(res => res.json())
      setRepositories(updatedRepos.repositories)
      setSearchResults(updatedRepos.repositories)
      
      // Reset form and close modal
      setNewRepoForm({ name: "", description: "", visibility: true })
      setIsNewRepoModalOpen(false)
      setError(null)
    } catch (error) {
      setError(error.message)
    } finally {
      setIsCreatingRepo(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </SheetTrigger>
               
              </Sheet>
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

            <div className="flex-1 max-w-md mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="search"
                  type="search"
                  placeholder="Search repositories..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

           

            <div className="flex items-center ml-4 space-x-2">
              <DarkModeToggle />

             

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    <Plus className="h-5 w-5" />
                    <span className="sr-only">New</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                  <DropdownMenuItem  onClick={() => setIsNewRepoModalOpen(true)}className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    New repository
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Import repository
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    New organization
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    New project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="gap-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/placeholder-user.jpg" alt="User" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 w-56"
                >
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium">Signed in as</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">user@example.com</p>
                  </div>
                  <DropdownMenuItem 
      className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
      onClick={() => navigate("/profile")}
    >
      Your profile
    </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Your repositories
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Your projects
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Settings
                  </DropdownMenuItem>
                  <div className="px-1 py-1 border-t border-gray-200 dark:border-gray-700">
                    <DropdownMenuItem onClick={()=>navigate("/home")}className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10">
                      Sign out
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column - Suggested Repositories */}
          <div className="lg:col-span-4 space-y-6 flex flex-col">
            <Card className="bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden h-full flex flex-col">
              <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-700">
                <CardTitle className="text-gray-900 dark:text-white">Suggested Repositories</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Popular repositories you might like
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 pt-4 flex-1">
                {paginate(suggestedRepositories, suggestedPage).map((repo, index) => (
                  <div
                    key={repo.id || index}
                    className="border border-gray-200 dark:border-gray-700 rounded-md p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 group"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <h3 className="font-medium text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                        {repo.name}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {repo.description || "No description provided"}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      {repo.language && (
                        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${languageColors[repo.language] || "bg-gray-400"}`}
                          ></span>
                          <span>{repo.language}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                        <Star className="h-3.5 w-3.5" />
                        <span>{repo.stars || 0}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                        <GitFork className="h-3.5 w-3.5" />
                        <span>{repo.forks || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="pt-2 pb-4 flex justify-between">
                <Button
                  variant="outline"
                  disabled={suggestedPage === 1}
                  onClick={() => setSuggestedPage((prev) => prev - 1)}
                  className="text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Page {suggestedPage} of {Math.max(1, totalSuggestedPages)}
                </span>
                <Button
                  variant="outline"
                  disabled={suggestedPage === totalSuggestedPages || totalSuggestedPages === 0}
                  onClick={() => setSuggestedPage((prev) => prev + 1)}
                  className="text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                >
                  Next
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Middle column - Your Repositories */}
          <div className="lg:col-span-4 flex flex-col h-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Repositories</h2>
              <Button 
                className="w-full sm:w-auto flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                onClick={() => setIsNewRepoModalOpen(true)}
              >
                <Code className="mr-2 h-4 w-4" />
                New Repository
              </Button>
            </div>

            <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden h-full flex flex-col">
              <Tabs defaultValue="all" className="w-full h-full flex flex-col">
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <TabsList className="bg-transparent h-auto p-0 w-full flex justify-start overflow-x-auto">
                    <TabsTrigger
                      value="all"
                      className="py-3 px-4 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 dark:data-[state=active]:border-blue-400 dark:data-[state=active]:text-blue-400"
                    >
                      All
                    </TabsTrigger>
                    <TabsTrigger
                      value="public"
                      className="py-3 px-4 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 dark:data-[state=active]:border-blue-400 dark:data-[state=active]:text-blue-400"
                    >
                      Public
                    </TabsTrigger>
                    <TabsTrigger
                      value="private"
                      className="py-3 px-4 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 dark:data-[state=active]:border-blue-400 dark:data-[state=active]:text-blue-400"
                    >
                      Private
                    </TabsTrigger>
                    <TabsTrigger
                      value="sources"
                      className="py-3 px-4 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 dark:data-[state=active]:border-blue-400 dark:data-[state=active]:text-blue-400"
                    >
                      Sources
                    </TabsTrigger>
                    <TabsTrigger
                      value="forks"
                      className="py-3 px-4 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 dark:data-[state=active]:border-blue-400 dark:data-[state=active]:text-blue-400"
                    >
                      Forks
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="all" className="p-4 flex-1">
                  {isLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <Skeleton className="h-5 w-1/3" />
                                <Skeleton className="h-8 w-16" />
                              </div>
                              <Skeleton className="h-4 w-full" />
                              <div className="flex gap-3">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-16" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : error ? (
                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <CardContent className="py-8 text-center">
                        <p className="text-gray-500 dark:text-gray-400">{error}</p>
                        <Button
                          variant="outline"
                          className="mt-4 text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                        >
                          Retry
                        </Button>
                      </CardContent>
                    </Card>
                  ) : paginate(searchResults, repoPage).length === 0 ? (
                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <CardContent className="py-8 text-center">
                        <p className="text-gray-500 dark:text-gray-400">No repositories found</p>
                        <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200">
                          Create a new repository
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4">
                      {paginate(searchResults, repoPage).map((repo, index) => (
                        <Card
                          key={index}
                          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-200 hover:shadow-md group"
                        >
                          <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200">
                                    
                                  <Link 
    to={`/repo/id/${repo._id}`}
    className="text-lg font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200 hover:underline"
  >
    {repo.name}
  </Link>
                                  </h3>
                                  {repo.isPrivate && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                                    >
                                      Private
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                  {repo.description || "No description provided"}
                                </p>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                                  {repo.language && (
                                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                                      <span
                                        className={`h-3 w-3 rounded-full ${languageColors[repo.language] || "bg-gray-400"}`}
                                      ></span>
                                      <span>{repo.language}</span>
                                    </div>
                                  )}
                                  {repo.stars !== undefined && (
                                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                                      <Star className="h-3.5 w-3.5" />
                                      <span>{repo.stars || 0}</span>
                                    </div>
                                  )}
                                  {repo.forks !== undefined && (
                                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                                      <GitFork className="h-3.5 w-3.5" />
                                      <span>{repo.forks || 0}</span>
                                    </div>
                                  )}
                                  {repo.updatedAt && (
                                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                      <Clock className="h-3.5 w-3.5" />
                                      <span>Updated {formatRelativeTime(repo.updatedAt)}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="shrink-0 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                              >
                                <Star className="mr-1 h-3.5 w-3.5" />
                                Star
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="public" className="p-4">
                  <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <CardContent className="py-8 text-center">
                      <p className="text-gray-500 dark:text-gray-400">Filter by public repositories</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="private" className="p-4">
                  <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <CardContent className="py-8 text-center">
                      <p className="text-gray-500 dark:text-gray-400">Filter by private repositories</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="sources" className="p-4">
                  <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <CardContent className="py-8 text-center">
                      <p className="text-gray-500 dark:text-gray-400">Filter by source repositories</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="forks" className="p-4">
                  <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <CardContent className="py-8 text-center">
                      <p className="text-gray-500 dark:text-gray-400">Filter by forked repositories</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <CardFooter className="pt-2 pb-4 flex justify-between border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  disabled={repoPage === 1}
                  onClick={() => setRepoPage((prev) => prev - 1)}
                  className="text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Page {repoPage} of {Math.max(1, totalRepoPages)}
                </span>
                <Button
                  variant="outline"
                  disabled={repoPage === totalRepoPages || totalRepoPages === 0}
                  onClick={() => setRepoPage((prev) => prev + 1)}
                  className="text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                >
                  Next
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Right column - Upcoming Events */}
          <div className="lg:col-span-4 space-y-6 flex flex-col">
            <Card className="bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden h-full flex flex-col">
              <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-700">
                <CardTitle className="text-gray-900 dark:text-white">Upcoming Events</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Developer events you might be interested in
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 flex-1">
                <ul className="space-y-3">
                  {paginate(events, eventsPage).map((event, index) => (
                    <li key={index} className="flex items-start gap-3 group">
                      <div className="bg-blue-100 dark:bg-blue-900/20 rounded-md p-1.5 text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/30 transition-colors duration-200">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                          {event.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{event.date}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-2 pb-4 flex justify-between">
                <Button
                  variant="outline"
                  disabled={eventsPage === 1}
                  onClick={() => setEventsPage((prev) => prev - 1)}
                  className="text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Page {eventsPage} of {totalEventsPages}
                </span>
                <Button
                  variant="outline"
                  disabled={eventsPage === totalEventsPages}
                  onClick={() => setEventsPage((prev) => prev + 1)}
                  className="text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                >
                  Next
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* New Repository Modal */}
      <Sheet open={isNewRepoModalOpen} onOpenChange={setIsNewRepoModalOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Create New Repository</SheetTitle>
            <SheetDescription>
              Create a new repository to start collaborating with others.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Repository Name</Label>
              <Input
                id="name"
                placeholder="Enter repository name"
                value={newRepoForm.name}
                onChange={(e) => setNewRepoForm({ ...newRepoForm, name: e.target.value })}
                className="w-full"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Enter repository description"
                value={newRepoForm.description}
                onChange={(e) => setNewRepoForm({ ...newRepoForm, description: e.target.value })}
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="visibility"
                checked={newRepoForm.visibility}
                onChange={(e) => setNewRepoForm({ ...newRepoForm, visibility: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="visibility" className="text-sm">
                Make this repository public
              </Label>
            </div>
            {error && (
              <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
            )}
          </div>
          <SheetFooter>
            <Button
              variant="outline"
              onClick={() => setIsNewRepoModalOpen(false)}
              disabled={isCreatingRepo}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateRepository}
              disabled={isCreatingRepo || !newRepoForm.name}
            >
              {isCreatingRepo ? "Creating..." : "Create Repository"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Footer />
    </div>
  )
}

export default Dashboard

