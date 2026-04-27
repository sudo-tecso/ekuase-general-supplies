"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Loader2, Github } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

import { Logo } from "@/components/shared/Logo";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
      } else {
        toast.success("Welcome back!");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background pt-20">
      <div className="container mx-auto px-4 flex flex-col md:flex-row max-w-5xl h-[600px] shadow-2xl rounded-2xl overflow-hidden">
        {/* Left Side - Branding */}
        <div className="hidden md:flex md:w-1/2 bg-primary relative p-12 flex-col justify-between">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
          <div className="relative z-10">
            <Link href="/" className="flex items-center gap-2 mb-12">
              <Logo size="md" />
            </Link>
            <h2 className="text-4xl font-heading font-black text-white leading-tight uppercase tracking-tighter">
              Quality Materials. <br />
              <span className="text-accent text-5xl">Expert Service.</span>
            </h2>
          </div>
          <div className="relative z-10">
            <p className="text-secondary-foreground/40 italic text-sm">
              "Building Ghana, one brick at a time."
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 bg-white p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <h1 className="text-3xl font-heading font-black uppercase tracking-tighter mb-2">Welcome Back</h1>
            <p className="text-secondary text-sm mb-8">Sign in to manage your orders and projects.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-secondary">Email</label>
                <Input
                  {...register("email")}
                  placeholder="name@example.com"
                  type="email"
                  disabled={isLoading}
                  className={errors.email ? "border-danger" : ""}
                />
                {errors.email && (
                  <p className="text-[10px] text-danger font-bold uppercase">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-secondary">Password</label>
                <Input
                  {...register("password")}
                  placeholder="••••••••"
                  type="password"
                  disabled={isLoading}
                  className={errors.password ? "border-danger" : ""}
                />
                {errors.password && (
                  <p className="text-[10px] text-danger font-bold uppercase">{errors.password.message}</p>
                )}
              </div>

              <Button className="w-full h-12 text-sm font-bold uppercase tracking-widest" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground font-bold tracking-widest">Or continue with</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full h-12 flex gap-3 text-sm font-bold uppercase tracking-widest"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>

            <p className="mt-8 text-center text-xs text-secondary">
              Don't have an account?{" "}
              <Link href="/register" className="text-accent font-bold hover:underline">
                Register now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
