import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <FileQuestion className="h-6 w-6 text-muted-foreground" />
        </div>
        <h1 className="mt-4 text-xl font-bold">Page introuvable</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Cette adresse ne correspond à aucune page de la plateforme.
        </p>
        <Link href="/dashboard" className="mt-5 inline-block">
          <Button className="gap-2">
            <Home className="h-4 w-4" />
            Tableau de bord
          </Button>
        </Link>
      </div>
    </div>
  );
}
