import { getPaiementsForParentChildren } from "@/app/actions/paiement";
import { AuthButton } from "@/components/auth-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { hasEnvVars } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PaiementListClient } from "./paiement-list-client";
export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const userRole = user.user_metadata.role;
    if (userRole != "parent") {
      return redirect("/dashboard");
    }
  } else {
    return redirect("/auth/login");
  }
  const currentParentId = user.user_metadata?.parent_id as number;
  // Appel de la Server Action pour récupérer les paiements
  const { data: fetchedPaiements } = await getPaiementsForParentChildren(
    currentParentId
  );

  // return <PaiementListClient initialPaiements={fetchedPaiements || []} />;
  return (
    <main className="min-h-screen flex flex-col items-center bg-background text-foreground">
      <div className="flex-1 w-full flex flex-col items-center">
        {/* Barre de navigation */}
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 shadow-sm">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href="/parents" passHref>
                <Button
                  variant="outline"
                  className="text-base px-6 py-3 rounded-full shadow hover:shadow-md gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {/* Retour à l&apos;accueil parent */}
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
              <ThemeSwitcher />
            </div>
          </div>
        </nav>

        {/* Contenu */}
        <div className="flex-1 flex flex-col gap-6 max-w-5xl w-full p-4 md:p-6 lg:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-primary mb-4">
            Consulter mes Paiements
          </h1>

          <section className="mb-12">
            <PaiementListClient initialPaiements={fetchedPaiements || []} />
          </section>
        </div>
      </div>
    </main>
  );
}
