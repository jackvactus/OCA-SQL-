"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShieldMinus, ShieldPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { UserRole } from "@/lib/auth/jwt";
import { useLanguage } from "@/components/language-provider";

export function UserRowActions({
  userId,
  role,
  isActive,
  isSelf,
}: {
  userId: string;
  role: UserRole;
  isActive: boolean;
  isSelf: boolean;
}) {
  const router = useRouter();
  const { t } = useLanguage();
  const [pending, setPending] = useState(false);

  const patch = async (body: { role?: UserRole; isActive?: boolean }) => {
    setPending(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? t.admin.updateErrorFallback);
        return;
      }
      toast.success(t.admin.updateSuccess);
      router.refresh();
    } catch {
      toast.error(t.admin.networkError);
    } finally {
      setPending(false);
    }
  };

  if (isSelf) {
    return <span className="text-xs text-muted-foreground">{t.admin.self}</span>;
  }

  return (
    <div className="flex items-center justify-end gap-3">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{t.admin.activeLabel}</span>
        <Switch
          checked={isActive}
          disabled={pending}
          onCheckedChange={(checked) => patch({ isActive: checked })}
        />
      </div>
      <Button
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={() => patch({ role: role === "admin" ? "user" : "admin" })}
        className="gap-1.5"
      >
        {role === "admin" ? (
          <>
            <ShieldMinus className="h-3.5 w-3.5" />
            {t.admin.demote}
          </>
        ) : (
          <>
            <ShieldPlus className="h-3.5 w-3.5" />
            {t.admin.promote}
          </>
        )}
      </Button>
    </div>
  );
}
