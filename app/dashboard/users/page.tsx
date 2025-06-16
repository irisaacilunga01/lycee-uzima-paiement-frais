// app/dashboard/users/page.tsx
import { Button } from "@/components/ui/button";
import { ConstructionIcon } from "lucide-react";
import Link from "next/link";

export default function UsersUnderConstruction() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center gap-4 max-w-md">
        <ConstructionIcon className="w-16 h-16 text-yellow-500 animate-bounce" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Fonctionnalité en cours de développement
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          La page de gestion des utilisateurs sera bientôt disponible. Nous y
          travaillons activement pour vous offrir la meilleure expérience
          possible.
        </p>
        <Link href="/dashboard">
          <Button variant="outline" className="mt-4">
            Retour au tableau de bord
          </Button>
        </Link>
      </div>
    </div>
  );
}
