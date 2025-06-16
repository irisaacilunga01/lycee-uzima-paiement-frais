import { getNotificationsForParent } from "@/app/actions/notifications";
import { AuthButton } from "@/components/auth-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { hasEnvVars } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ClientNotificationItem from "./client-notification-item";

export default async function ParentsNotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const userRole = user.user_metadata?.role as string;
  const parentId = user.user_metadata?.parent_id as number;

  if (userRole !== "parent" || !parentId) {
    redirect("/dashboard");
  }

  const { data: notifications, error: notificationsError } =
    await getNotificationsForParent(parentId);

  if (notificationsError) {
    console.error(
      "Erreur lors de la récupération des notifications:",
      notificationsError
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-background text-foreground">
      <div className="w-full flex-1 flex flex-col items-center">
        {/* Navigation */}
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 shadow-sm">
          <div className="w-full max-w-5xl flex justify-between items-center px-5 text-sm">
            {/* Bouton Retour */}
            {/* <div className="flex justify-center"> */}
            <Link href="/parents" passHref>
              <Button
                variant="outline"
                className="text-base px-6 py-3 rounded-full shadow hover:shadow-md gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour à l&apos;accueil parent
              </Button>
            </Link>
            {/* </div> */}
            <div className="flex items-center gap-4">
              {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
              <ThemeSwitcher />
            </div>
          </div>
        </nav>

        {/* Contenu */}
        <div className="flex-1 flex flex-col gap-6 max-w-5xl w-full p-4 md:p-6 lg:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-primary mb-4">
            Consulter mes Notifications
          </h1>

          <section className="mb-8 w-full">
            {notifications && notifications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notifications.map((notification) => (
                  <ClientNotificationItem
                    key={notification.idnotification}
                    notification={notification}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-6 p-6 bg-card rounded-lg shadow-md text-center border border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-lg text-gray-700 dark:text-gray-300 font-medium mb-1">
                  Aucune notification pour le moment.
                </p>
                <p className="text-sm text-muted-foreground">
                  Restez informé(e) des prochaines annonces importantes.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
