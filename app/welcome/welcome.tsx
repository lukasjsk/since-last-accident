import logoDark from "./logo-dark.svg";
import logoLight from "./logo-light.svg";
import { useEffect, useState } from "react";

export function Welcome() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 pt-16 pb-4">
      <div className={`container mx-auto flex flex-col items-center gap-16 px-4 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <header className="flex flex-col items-center gap-9">
          <div className="w-[500px] max-w-[100vw] p-4 hover:scale-105 transition-transform duration-300">
            <img
              src={logoLight}
              alt="Since Last Accident"
              className="block w-full dark:hidden drop-shadow-md"
            />
            <img
              src={logoDark}
              alt="Since Last Accident"
              className="hidden w-full dark:block drop-shadow-md"
            />
          </div>
          <h1 className="text-5xl font-bold text-center text-gray-900 dark:text-gray-100 tracking-tight">
            Since Last Accident
          </h1>
          <p className="text-xl text-center text-gray-700 dark:text-gray-300 max-w-[800px] px-4 leading-relaxed">
            Your centralized knowledge base for tracking, documenting, and
            solving development issues across all your software projects
          </p>
        </header>

        <div className="max-w-[900px] w-full space-y-10 px-4">
          <div className="rounded-3xl border border-gray-200 bg-white dark:bg-gray-800/50 dark:border-gray-700 shadow-lg p-10 space-y-8 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 text-center">
              Never Let The Same Bug Bite Twice
            </h2>

            <p className="text-lg text-gray-700 dark:text-gray-300 text-center leading-relaxed max-w-[700px] mx-auto">
              "Since Last Accident" is your team's ultimate tool for capturing
              development challenges, sharing solutions, and reducing downtime.
              Document issues as they arise, create permanent records of fixes,
              and build a collective knowledge base that grows with your
              projects.
            </p>

            <div className="grid md:grid-cols-3 gap-8 pt-6">
              <div className="flex flex-col items-center p-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 shadow-sm">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="text-red-500"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12" y2="16" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mt-5 mb-3 text-gray-800 dark:text-gray-200">
                  Capture Issues
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  Document bugs, errors, and unexpected behaviors as they occur
                  in your development process.
                </p>
              </div>

              <div className="flex flex-col items-center p-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 shadow-sm">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="text-green-500"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <line x1="10" y1="9" x2="8" y2="9" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mt-5 mb-3 text-gray-800 dark:text-gray-200">
                  Share Solutions
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  Create reusable solutions that your entire team can access,
                  search, and apply across all your projects.
                </p>
              </div>

              <div className="flex flex-col items-center p-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 shadow-sm">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="text-blue-500"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="16 12 12 8 8 12" />
                    <line x1="12" y1="16" x2="12" y2="8" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mt-5 mb-3 text-gray-800 dark:text-gray-200">
                  Reduce Downtime
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  Minimize repeat issues with a centralized knowledge base that
                  grows smarter with every solved problem.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8 opacity-80 hover:opacity-100 transition-opacity">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Start building your team's knowledge repository today
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}