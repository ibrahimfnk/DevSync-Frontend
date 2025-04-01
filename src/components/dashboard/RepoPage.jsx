"use client"

import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Code,
  GitFork,
  Star,
  Clock,
  Lock,
  Globe,
  Eye,
  GitBranch,
  FileCode,
  AlertCircle,
  Download,
  Share2,
  BookOpen,
  MessageSquare,
  GitCommit,
  GitPullRequest,
} from "lucide-react"
import AnimatedLogo from "../home/comp/AnimatedLogo"
import { DarkModeToggle } from "../home/comp/DarkMode"

const Navbar = () => (
  <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center">
          <AnimatedLogo />
          <Link to="/" className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">
            DevSync
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search repositories..."
              className="pl-10 pr-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
            <div className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <DarkModeToggle />
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  </header>
)

const RepoPage = () => {
  const { repoId } = useParams()
  const navigate = useNavigate()
  const [repo, setRepo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("code")

  useEffect(() => {
    const fetchRepo = async () => {
      try {
        console.log("Fetching repo with ID:", repoId)
        const response = await fetch(`http://34.227.150.165:3000/repo/id/${repoId}`)
        if (!response.ok) throw new Error("Repository not found")
        const data = await response.json()
        setRepo(data)
      } catch (error) {
        setError(error.message)
        // Don't navigate away immediately, show error state instead
        setIsLoading(false)
      } finally {
        setIsLoading(false)
      }
    }
    fetchRepo()
  }, [repoId, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header skeleton */}
          <div className="mb-6">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-full max-w-2xl" />
          </div>

          {/* Main content skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>

              <div className="mt-6">
                <Skeleton className="h-10 w-full mb-4" />
                <Card className="bg-white dark:bg-gray-800">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-start space-x-4">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Sidebar skeleton */}
            <div>
              <Card className="bg-white dark:bg-gray-800">
                <CardContent className="space-y-4 p-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center">
          <div className="text-red-500 dark:text-red-400 mb-4">
            <AlertCircle className="h-16 w-16 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Repository Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
            We couldn't find the repository you're looking for. It may have been deleted or you might not have
            permission to view it.
          </p>
          <Button onClick={() => navigate("/")} className="bg-blue-600 hover:bg-blue-700 text-white">
            Return to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  // Assuming repo[0] contains the repository data
  const repository = repo[0] || {}

  // Format date for better display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navbar />

      {/* Repository Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center mb-2">
            <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Dashboard
            </Link>
            <span className="text-gray-500 dark:text-gray-400 mx-2">/</span>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              {repository.name}
              {repository.isPrivate ? (
                <Lock className="inline h-5 w-5 ml-2 text-gray-500" />
              ) : (
                <Globe className="inline h-5 w-5 ml-2 text-gray-500" />
              )}
            </h1>
            <Badge
              variant="outline"
              className="ml-3 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800"
            >
              {repository.isPrivate ? "Private" : "Public"}
            </Badge>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-3xl">
            {repository.description || "No description provided"}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <Code className="h-4 w-4" />
              <span>{repository.language || "No language specified"}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <Star className="h-4 w-4" />
              <span>{repository.stars || 0} stars</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <GitFork className="h-4 w-4" />
              <span>{repository.forks || 0} forks</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <Eye className="h-4 w-4" />
              <span>{repository.watchers || 0} watchers</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>Updated {formatDate(repository.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Content */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex flex-wrap gap-2">
              <Button variant="outline" className="flex items-center gap-2 bg-white dark:bg-gray-800">
                <GitBranch className="h-4 w-4" />
                <span>main</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-2 bg-white dark:bg-gray-800">
                <GitBranch className="h-4 w-4" />
                <span>{repository.branches || 1} branches</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-2 bg-white dark:bg-gray-800">
                <GitCommit className="h-4 w-4" />
                <span>{repository.commits || 0} commits</span>
              </Button>
              <div className="flex-grow"></div>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Download className="h-4 w-4 mr-2" />
                Clone
              </Button>
            </div>

            <Tabs defaultValue="code" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-none justify-start">
                <TabsTrigger
                  value="code"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
                >
                  <FileCode className="h-4 w-4 mr-2" />
                  Code
                </TabsTrigger>
                <TabsTrigger
                  value="issues"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Issues
                </TabsTrigger>
                <TabsTrigger
                  value="pull-requests"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
                >
                  <GitPullRequest className="h-4 w-4 mr-2" />
                  Pull Requests
                </TabsTrigger>
                <TabsTrigger
                  value="discussions"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Discussions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="code" className="mt-4">
                <Card className="bg-white dark:bg-gray-800">
                  <CardContent className="p-0">
                    <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">main</span> · Last commit {formatDate(repository.updatedAt)}
                      </div>
                      <div>
                        <Button variant="outline" size="sm" className="text-xs">
                          <GitCommit className="h-3 w-3 mr-1" />
                          {repository.lastCommit || "Initial commit"}
                        </Button>
                      </div>
                    </div>

                    <div className="p-4">
                      {/* File list would go here */}
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <FileCode className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="text-lg font-medium">Repository files will appear here</p>
                        <p className="text-sm">This is a preview of the repository page</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="issues" className="mt-4">
                <Card className="bg-white dark:bg-gray-800">
                  <CardContent className="p-6">
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-lg font-medium">No issues found</p>
                      <p className="text-sm mb-4">Issues help you track bugs and feature requests</p>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">New Issue</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pull-requests" className="mt-4">
                <Card className="bg-white dark:bg-gray-800">
                  <CardContent className="p-6">
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <GitPullRequest className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-lg font-medium">No pull requests found</p>
                      <p className="text-sm mb-4">Pull requests help you collaborate on code</p>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">New Pull Request</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="discussions" className="mt-4">
                <Card className="bg-white dark:bg-gray-800">
                  <CardContent className="p-6">
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-lg font-medium">No discussions found</p>
                      <p className="text-sm mb-4">Discussions are where you can ask questions and share ideas</p>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">New Discussion</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="bg-white dark:bg-gray-800 mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {repository.description || "No description provided"}
                </p>

                <div className="space-y-2">
                  {repository.homepage && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <a
                        href={repository.homepage}
                        className="text-blue-600 dark:text-blue-400 hover:underline truncate"
                      >
                        {repository.homepage}
                      </a>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">{repository.license || "No license"}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Created on {formatDate(repository.createdAt || new Date())}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {repository.topics ? (
                      repository.topics.map((topic, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                        >
                          {topic}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">No topics</span>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="w-full space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Star className="h-4 w-4 mr-2" />
                    Star
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Eye className="h-4 w-4 mr-2" />
                    Watch
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <GitFork className="h-4 w-4 mr-2" />
                    Fork
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <Card className="bg-white dark:bg-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Contributors</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3].map((i) => (
                    <Avatar
                      key={i}
                      className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all duration-200"
                    >
                      <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${i}`} alt={`Contributor ${i}`} />
                      <AvatarFallback>C{i}</AvatarFallback>
                    </Avatar>
                  ))}
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-600 dark:text-gray-400 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
                    +{repository.contributors || 0}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RepoPage

