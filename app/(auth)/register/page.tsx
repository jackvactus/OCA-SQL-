"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Lock, Mail, User, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { registerSchema, type RegisterInput } from "@/lib/validation/auth";
import { useLanguage } from "@/components/language-provider";
import { AuthShell } from "../auth-shell";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { displayName: "", email: "", password: "" },
  });

  const onSubmit = async (values: RegisterInput) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? t.auth.toastRegisterErrorFallback);
        return;
      }
      toast.success(t.auth.toastRegisterSuccess);
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error(t.auth.toastNetworkError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell>
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm animate-scale-in">
        <div className="mb-6">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            {t.auth.registerTitle} <span aria-hidden>🚀</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{t.auth.registerSubtitle}</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.auth.nameLabel}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        autoComplete="name"
                        placeholder={t.auth.namePlaceholder}
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
                        autoComplete="new-password"
                        placeholder={t.auth.passwordHint}
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
            <Button type="submit" className="w-full gap-2" disabled={submitting}>
              <UserPlus className="h-4 w-4" />
              {submitting ? t.auth.registerButtonLoading : t.auth.registerButton}
            </Button>
          </form>
        </Form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t.auth.hasAccount}{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            {t.auth.signIn}
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
