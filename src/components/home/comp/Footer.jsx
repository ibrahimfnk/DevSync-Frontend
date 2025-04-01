import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-gray-100 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="space-y-8 xl:col-span-1">
                        <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            DevSync
                        </Link>
                        <p className="text-gray-500 dark:text-gray-400 text-base">
                            The ultimate collaboration platform for developers. Fork, commit, and push with ease.
                        </p>
                        <div className="flex space-x-6">
                            <a href="#" className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">GitHub</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.49.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.155-1.109-1.463-1.109-1.463-.907-.62.069-.608.069-.608 1.003.07 1.532 1.031 1.532 1.031.892 1.528 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.34-2.221-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.682-.103-.253-.446-1.273.097-2.656 0 0 .84-.269 2.75 1.025A9.563 9.563 0 0112 6.844c.852.004 1.71.115 2.51.338 1.91-1.294 2.75-1.025 2.75-1.025.543 1.383.2 2.403.098 2.656.64.698 1.028 1.591 1.028 2.682 0 3.844-2.337 4.687-4.564 4.935.36.31.68.919.68 1.855 0 1.34-.012 2.42-.012 2.748 0 .268.18.579.688.481C19.138 20.162 22 16.416 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Features</h3>
                                <ul className="mt-4 space-y-4">
                                    <li>
                                        <a href="#" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                                            Repository Management
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                                            Code Collaboration
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                                            Pull Requests & Issues
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                                            CI/CD Integration
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-12 md:mt-0">
                                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Resources</h3>
                                <ul className="mt-4 space-y-4">
                                    <li>
                                        <a href="#" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                                            API Documentation
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                                            Open Source Projects
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                                            Security & Compliance
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                                            Terms of Service
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t border-gray-200 pt-8">
                    <p className="text-base text-gray-400 xl:text-center">
                        &copy; 2025 DevSync. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
