'use client';

import Link from 'next/link';

export default function DemoIndex() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8">
      <h1 className="text-white text-4xl mb-12 font-bold">Design Options</h1>

      <div className="space-y-6">
        <Link
          href="/demo/dark"
          className="block w-80 p-6 bg-black border-4 border-white text-white text-2xl text-center hover:bg-white hover:text-black transition-colors"
        >
          Dark Theme
          <span className="block text-sm mt-2 opacity-70">True Undertale style</span>
        </Link>

        <Link
          href="/demo/light"
          className="block w-80 p-6 bg-white border-4 border-gray-300 text-gray-900 text-2xl text-center hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-colors rounded-xl"
        >
          Light Theme
          <span className="block text-sm mt-2 opacity-70">Wii + Undertale hybrid</span>
        </Link>
      </div>
    </div>
  );
}
