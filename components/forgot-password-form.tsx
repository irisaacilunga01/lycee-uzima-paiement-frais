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
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner"; // Importez toast de sonner

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  // const [error, setError] = useState<string | null>(null); // Remplacé par les toasts
  // const [success, setSuccess] = useState(false); // Remplacé par l'affichage conditionnel après le toast de succès
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false); // Nouvel état pour l'affichage de succès

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    // setError(null); // Remplacé par les toasts

    try {
      // L'URL qui sera incluse dans l'e-mail. Cette URL doit être configurée dans vos URL de redirection
      // dans le tableau de bord Supabase à https://supabase.com/dashboard/project/_/auth/url-configuration
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) {
        throw error; // Propage l'erreur pour la capturer dans le bloc catch
      }

      // Si l'e-mail de réinitialisation est envoyé avec succès
      setResetEmailSent(true); // Active l'affichage du message de succès
      toast.success("E-mail de réinitialisation envoyé !", {
        description:
          "Veuillez vérifier votre boîte de réception pour les instructions.",
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Gère les erreurs lors de l'envoi de l'e-mail de réinitialisation
      toast.error("Erreur d'envoi de l'e-mail", {
        description:
          error.message ||
          "Une erreur est survenue lors de l'envoi de l'e-mail de réinitialisation.",
      });
      setResetEmailSent(false); // S'assurer que le message de succès ne s'affiche pas en cas d'erreur
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {resetEmailSent ? ( // Utilise le nouvel état pour afficher le message de succès
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Vérifiez votre e-mail</CardTitle>
            <CardDescription>
              Instructions de réinitialisation de mot de passe envoyées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Si vous avez enregistré votre compte avec cette adresse e-mail,
              vous recevrez un e-mail de réinitialisation de mot de passe.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Réinitialisez votre mot de passe
            </CardTitle>
            <CardDescription>
              Entrez votre adresse e-mail et nous vous enverrons un lien pour
              réinitialiser votre mot de passe.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="exemple@domaine.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {/* Le message d'erreur local est remplacé par les toasts */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading
                    ? "Envoi en cours..."
                    : "Envoyer l'e-mail de réinitialisation"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Vous avez déjà un compte ?{" "}
                <Link
                  href="/auth/login"
                  className="underline underline-offset-4"
                >
                  Se connecter
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
