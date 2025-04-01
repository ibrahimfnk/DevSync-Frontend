import React from 'react';
import { Button } from "./comp/Button"
import AnimatedLogo from './comp/AnimatedLogo';
import { GitBranch, GitPullRequest, Search, Star, GitCommit, BookOpen, Code2 } from 'lucide-react';
import {Globe} from './comp/Globe';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './comp/card';
import Footer from './comp/Footer';
import {DarkModeToggle} from './comp/DarkMode';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../authContext'; // Import useAuth to get currentUser


const Home = () => {
  const navigate = useNavigate();  
  const { currentUser } = useAuth(); // Get currentUser

  const handleCreateRepo = () => {
    if (currentUser) {
      navigate("/repo/new"); // Navigate to repository creation page if user is logged in
    } else {
      navigate("/auth"); // Navigate to login page if user is not logged in
    }
  };
  return (
       
       // Add this to the root div's className in Home.jsx
<div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <AnimatedLogo /> <button 
                onClick={() => navigate("/home")} 
                className="ml-2 text-2xl font-bold text-gray-900 dark:text-white cursor-pointer"
              >
                DevSync
              </button>
              </div>
             {/* <nav className="hidden md:flex space-x-4">
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"> </a>
               
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">Docs</a>
              </nav>*/}
              <div className="flex items-center">
              <DarkModeToggle />
              <Button variant="outline" onClick={() => navigate("/auth")} className="ml-4">Sign In</Button>
<Button variant="outline" className="ml-4" onClick={() => navigate("/signup")}>Sign Up</Button>

              </div>
            </div>
          </div>
        </header>

        <div className="relative bg-white dark:bg-gray-800 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white dark:bg-gray-800 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white dark:text-gray-800 transform translate-x-1/2" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Synchronize Your</span>{' '}
                  <span className="block text-blue-600 dark:text-blue-400 xl:inline">Development Workflow</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  DevSync brings your team together, streamlining collaboration and boosting productivity in software development.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                  <Button 
        onClick={()=>navigate("/signup")} 
        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
      >
        <GitBranch className="mr-2 h-5 w-5" />
        Create Repository
      </Button>

      <Button 
        variant="outline"  
        onClick={() => navigate("/signup")} 
        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
      >
        <GitPullRequest className="mr-2 h-5 w-5" />
        Explore Projects
      </Button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <Globe/>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">Featured Repositories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">DevSync Core</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">Main repository for DevSync</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <GitCommit className="mr-1 h-4 w-4" />
                  Last commit 2h ago
                </span>
                <span className="flex items-center">
                  <Star className="mr-1 h-4 w-4" />
                  20 stars
                </span>
                <span className="flex items-center">
                  <BookOpen className="mr-1 h-4 w-4" />
                  MIT License
                </span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">DevSync Documentation</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">Official documentation for DevSync</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <GitCommit className="mr-1 h-4 w-4" />
                  Last commit 5d ago
                </span>
                <span className="flex items-center">
                  <Star className="mr-1 h-4 w-4" />
                  15 stars
                </span>
                <span className="flex items-center">
                  <BookOpen className="mr-1 h-4 w-4" />
                  CC-BY-4.0 License
                </span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">DevSync CLI</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">Command-line interface for DevSync</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <GitCommit className="mr-1 h-4 w-4" />
                  Last commit 1d ago
                </span>
                <span className="flex items-center">
                  <Star className="mr-1 h-4 w-4" />
                  10 stars
                </span>
                <span className="flex items-center">
                  <BookOpen className="mr-1 h-4 w-4" />
                  Apache-2.0 License
                </span>
              </div>
            </CardContent>
            
          </Card>
        </div>
      </div>
      <Footer></Footer>
        </div>
    );
};

export default Home;