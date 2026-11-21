import React from 'react';

export const metadata = {
  title: '404: This page could not be found',
};

export default function NotFoundPage() {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#000000] text-black dark:text-white flex items-center justify-center font-sans antialiased">
      <div className="flex items-center">
        <h1 className="text-2xl font-medium border-r border-black/30 dark:border-white/30 pr-6 mr-6 leading-[49px]">
          404
        </h1>
        <div className="inline-block text-left">
          <h2 className="text-sm font-normal text-neutral-800 dark:text-neutral-200 leading-[49px] m-0">
            This page could not be found.
          </h2>
        </div>
      </div>
    </div>
  );
}
