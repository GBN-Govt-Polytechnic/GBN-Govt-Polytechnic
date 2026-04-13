/**
 * @file loading.tsx
 * @description Root loading screen — branded splash shown while Next.js renders server components
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white">
      {/* Logo */}
      <div className="relative mb-5">
        <div className="absolute inset-0 rounded-full bg-emerald-100 blur-xl opacity-60 scale-110" />
        <Image
          src="/college-logo.svg"
          alt="GBN Govt. Polytechnic"
          width={112}
          height={112}
          className="relative object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.18)]"
          priority
        />
      </div>

      {/* Name */}
      <h1 className="text-lg font-bold text-gray-900 mb-0.5 text-center px-6">
        GBN Govt. Polytechnic
      </h1>
      <p className="text-sm text-gray-500 mb-8 text-center">
        Nilokheri, Karnal (Haryana)
      </p>

      {/* Animated bar */}
      <div className="w-40 h-1 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500 rounded-full animate-[loading_1.4s_ease-in-out_infinite]" />
      </div>

      <style>{`
        @keyframes loading {
          0%   { width: 0%;   margin-left: 0%; }
          50%  { width: 60%;  margin-left: 20%; }
          100% { width: 0%;   margin-left: 100%; }
        }
      `}</style>
    </div>
  );
}
