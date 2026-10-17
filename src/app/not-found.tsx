import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <span className="text-xs uppercase tracking-widest text-[#c5a059] font-medium">Error 404</span>
      <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-white mt-2 mb-3">
        Page Not Found
      </h1>
      <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mb-8">
        The architectural design or page you are looking for has been moved or does not exist.
      </p>
      <Link
        href="/"
        className="py-2.5 px-6 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-medium hover:bg-black dark:hover:bg-neutral-100 transition-colors"
      >
        Return to Homepage
      </Link>
    </div>
  );
}
