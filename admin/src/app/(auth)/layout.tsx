/**
 * @file layout.tsx
 * @description Auth layout — centered card wrapper for login and password reset pages
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0f7f1] p-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
