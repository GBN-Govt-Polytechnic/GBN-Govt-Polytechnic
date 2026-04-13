/**
 * @file page.tsx
 * @description Admin login page — email and password authentication with show/hide toggle
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, error: authError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    const success = await login(email, password);
    setLoading(false);

    if (success) {
      router.push("/");
    } else {
      setError(authError ?? "Invalid email or password.");
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 flex items-center justify-center">
          <Image
            src="/college-logo.svg"
            alt="GBN Govt. Polytechnic"
            width={78}
            height={78}
            className="object-contain drop-shadow-[0_6px_12px_rgba(0,0,0,0.16)]"
            priority
          />
        </div>
        <CardTitle className="text-xl">GBN Admin Panel</CardTitle>
        <CardDescription>
          Sign in to manage GBN Govt. Polytechnic, Nilokheri
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@gpnilokheri.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm">
            <p className="mb-1 font-semibold text-emerald-800">Developer Support Email</p>
            <p className="flex items-center gap-2 text-emerald-900">
              <Mail className="h-3.5 w-3.5" />
              <a className="hover:underline" href="mailto:contact.here.gurkirat.singh@gmail.com">
                contact.here.gurkirat.singh@gmail.com
              </a>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
