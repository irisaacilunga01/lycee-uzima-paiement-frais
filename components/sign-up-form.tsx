"use client";

import { checkParentEmailAndGetId } from "@/app/actions/auth"; // Importez la nouvelle fonction d'action
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner"; // Importez toast de sonner

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  // const [error, setError] = useState<string | null>(null); // Remplacé par les toasts
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    // setError(null); // Remplacé par les toasts

    if (password !== repeatPassword) {
      toast.error("Erreur de mot de passe", {
        description: "Les mots de passe ne correspondent pas.",
      });
      setIsLoading(false);
      return;
    }

    try {
      // 1. Vérifier si l'e-mail existe dans la table 'parent'
      const {
        success: emailCheckSuccess,
        error: emailCheckError,
        idparent,
      } = await checkParentEmailAndGetId(email);

      if (!emailCheckSuccess) {
        toast.error("Inscription impossible", {
          description:
            emailCheckError ||
            "Cet e-mail n'est pas associé à un parent enregistré.",
        });
        setIsLoading(false);
        return;
      }

      // 2. Si l'e-mail est validé, procéder à l'inscription Supabase avec le rôle 'parent'
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/parents`, // Rediriger après confirmation
          data: { role: "parent", parent_id: idparent }, // Ajouter le rôle et l'idparent aux métadonnées
        },
      });

      if (signUpError) {
        throw signUpError; // Propage l'erreur pour la capturer dans le bloc catch
      }

      // Si l'inscription réussit (email de confirmation envoyé)
      toast.success("Inscription réussie !", {
        description:
          "Veuillez vérifier votre e-mail pour confirmer votre compte.",
      });
      router.push("/auth/sign-up-success"); // Rediriger vers une page de succès pour informer l'utilisateur de la vérification email
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Gère les erreurs d'inscription
      toast.error("Erreur d'inscription", {
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
          <CardTitle className="text-2xl">S&apos;inscrire</CardTitle>
          <CardDescription>Créez un nouveau compte parent</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
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
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Mot de passe</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="repeat-password">
                    Confirmer le mot de passe
                  </Label>
                </div>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>
              {/* Le message d'erreur local est remplacé par les toasts */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Création du compte..." : "S'inscrire"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Vous avez déjà un compte ?{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                Se connecter
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
