"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner"; // Importez toast de sonner

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [password, setPassword] = useState("");
  // const [error, setError] = useState<string | null>(null); // Remplacé par les toasts
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    // setError(null); // Remplacé par les toasts

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        throw error; // Propage l'erreur pour la capturer dans le bloc catch
      }

      // Si la mise à jour réussit
      toast.success("Mot de passe mis à jour !", {
        description: "Votre mot de passe a été modifié avec succès.",
      });
      // Redirection après succès, pour tous les rôles vers le tableau de bord principal
      router.push("/dashboard");
      router.refresh(); // Rafraîchit la session
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Gère les erreurs de mise à jour
      toast.error("Erreur de mise à jour du mot de passe", {
        description: error.message || "Une erreur inattendue est survenue.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Réinitialisez votre mot de passe
          </CardTitle>
          <CardDescription>
            Veuillez entrer votre nouveau mot de passe ci-dessous.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password">Nouveau mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Nouveau mot de passe"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {/* Le message d'erreur local est remplacé par les toasts */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? "Enregistrement..."
                  : "Enregistrer le nouveau mot de passe"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
