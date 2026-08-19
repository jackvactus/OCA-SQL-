"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { loginSchema, type LoginInput } from "@/lib/validation/auth";
import { sanitizeRedirectPath } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";
import { AuthShell } from "../auth-shell";

export default function LoginPage() {
  return (
    <Suspense>
      <AuthShell>
        <LoginForm />
      </AuthShell>
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  const onSubmit = async (values: LoginInput) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? t.auth.toastLoginErrorFallback);
        return;
      }
      toast.success(t.auth.toastLoginSuccess);
      const next = sanitizeRedirectPath(searchParams.get("next"));
      router.push(next);
      router.refresh();
    } catch {
      toast.error(t.auth.toastNetworkError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm animate-scale-in">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          {t.auth.loginWelcome} <span aria-hidden>👋</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.auth.loginSubtitle}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.auth.emailLabel}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder={t.auth.emailPlaceholder}
                      className="pl-9"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.auth.passwordLabel}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className="pl-9 pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="remember"
              render={({ field }) => (
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  {t.auth.rememberMe}
                </label>
              )}
            />
            <button
              type="button"
              onClick={() => toast.info(t.auth.forgotPasswordToast)}
              className="text-sm font-medium text-primary hover:underline"
            >
              {t.auth.forgotPassword}
            </button>
          </div>

          <Button type="submit" className="w-full gap-2" disabled={submitting}>
            <LogIn className="h-4 w-4" />
            {submitting ? t.auth.loginButtonLoading : t.auth.loginButton}
          </Button>
        </form>
      </Form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t.auth.noAccount}{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          {t.auth.createAccount}
        </Link>
      </p>
    </div>
  );
}
