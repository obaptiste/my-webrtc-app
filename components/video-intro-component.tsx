/**
* This code was generated by v0 by Vercel.
* @see https://v0.dev/t/iQVN9hE0pux
* Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
*/

/** Add fonts into your Next.js project:

import { Libre_Franklin } from 'next/font/google'

libre_franklin({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
export function videoIntroComponent() {
  return (
    <main className="w-full max-w-6xl mx-auto px-4 py-12 md:px-6 md:py-16 lg:py-20">
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Job Application Board</h1>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              Discover your next career opportunity. Upload a video introduction to stand out.
            </p>
          </div>
          <div className="grid gap-6" />
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 lg:p-8">
          <h2 className="text-2xl font-bold mb-4">Video Introduction</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Record a 5-minute video introducing yourself and stand out from the crowd.
          </p>
          <div className="relative rounded-xl overflow-hidden aspect-video">
            <span className="w-full h-full object-cover rounded-md bg-gray-100 dark:bg-gray-800" />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/50 to-transparent p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5" />
                <span className="text-sm">3:00</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5" />
                <span className="text-sm">2:00</span>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/50 to-transparent p-4 text-white flex items-center justify-center">
              <div className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5" />
                <span className="text-sm">0:30</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function ClockIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
