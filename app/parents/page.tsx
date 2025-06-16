// app/parents/page.tsx
import { AuthButton } from "@/components/auth-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/server";
import { hasEnvVars } from "@/lib/utils";
import { Classe, Eleve, Option } from "@/type";
import { Bell, CreditCard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getElevesByParentId } from "../actions/eleves";
import { getParentById } from "../actions/parents";

// Définition d'un type étendu pour l'élève avec les informations de classe et d'option jointes
type EleveWithDetails = Eleve & {
  classe?: Classe & {
    option?: Option;
  };
};

export default async function ParentsDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const parentId = user?.user_metadata?.parent_id as number;

  // Sécurité supplémentaire : si le rôle n'est pas parent ou si parentId est manquant
  if (user?.user_metadata?.role !== "parent" || !parentId) {
    redirect("/dashboard");
  }

  // Récupération des enfants du parent avec les détails de la classe et de l'option
  const { data: children, error: childrenError } = await getElevesByParentId(
    parentId
  );
  const { data: parent, error: parentError } = await getParentById(parentId);

  if (childrenError || parentError) {
    console.error(
      "Erreur lors du chargement des données:",
      childrenError || parentError
    );
    // En production, vous pourriez vouloir afficher un message d'erreur plus convivial ici
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-background text-foreground">
      <div className="flex-1 w-full flex flex-col items-center">
        {/* Navigation */}
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 shadow-sm">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center text-lg font-bold text-primary-dark">
              Mon Espace Parent
            </div>
            <div className="flex items-center gap-4">
              {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
              <ThemeSwitcher />
            </div>
          </div>
        </nav>

        {/* Fonctionnalités rapides (Notifications, Paiements) */}
        <div className="flex gap-8 justify-center mt-6 text-muted-foreground text-sm">
          <Link
            href="/parents/notifications"
            className="flex flex-col items-center hover:text-primary transition-all p-2 rounded-lg hover:bg-muted"
          >
            <Bell className="w-6 h-6 mb-1" />
            Notifications
          </Link>
          <Link
            href="/parents/paiements"
            className="flex flex-col items-center hover:text-primary transition-all p-2 rounded-lg hover:bg-muted"
          >
            <CreditCard className="w-6 h-6 mb-1" />
            Paiements
          </Link>
        </div>

        <div className="flex-1 flex flex-col gap-10 max-w-5xl w-full p-5 md:p-10 lg:p-12">
          {/* Titre personnalisé */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-center text-primary mt-4 leading-tight">
            Bienvenue,{" "}
            {parent?.nompere
              ? `Mr. ${parent.nompere}`
              : parent?.nommere
              ? `Mme. ${parent.nommere}`
              : "Parent"}{" "}
            !
          </h1>

          {/* Section Mes Enfants */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">
              Mes Enfants
            </h2>
            {children && children.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {children.map(
                  (
                    eleve: EleveWithDetails // Utilise le type étendu
                  ) => (
                    <Dialog key={eleve.ideleve}>
                      <DialogTrigger asChild>
                        <div className="cursor-pointer bg-card rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-300">
                          {eleve.photo ? (
                            <Image
                              src={eleve.photo}
                              alt={`Photo de ${eleve.nom}`}
                              width={250}
                              height={250}
                              className="w-full h-56 object-cover"
                            />
                          ) : (
                            <div className="w-full h-56 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-4xl text-gray-500 font-bold">
                              {eleve.nom?.charAt(0).toUpperCase() || "N/A"}
                            </div>
                          )}
                          <div className="p-4">
                            <h3 className="text-lg font-semibold">
                              {eleve.nom} {eleve.postnom} {eleve.prenom}
                            </h3>
                            {/* Affichage de la classe et de l'option directement sur la carte */}
                            {eleve.classe && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Classe: {eleve.classe.nomclasse} (
                                {eleve.classe.niveau})
                                {eleve.classe.option &&
                                  ` - ${eleve.classe.option.abreviation}`}
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground mt-2">
                              Cliquer pour plus de détails
                            </p>
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-screen-md">
                        {" "}
                        {/* Augmenté la largeur max du dialogue */}
                        <DialogHeader>
                          <DialogTitle>
                            {eleve.nom} {eleve.postnom} {eleve.prenom}
                          </DialogTitle>
                          <DialogDescription>
                            Informations détaillées de l&apos;enfant
                          </DialogDescription>
                        </DialogHeader>
                        {/* Structure pour la photo à gauche et les détails à droite */}
                        <div className="flex flex-col md:flex-row gap-6 p-4">
                          {/* Section Photo (à gauche) */}
                          <div className="flex-shrink-0 w-full md:w-1/3 flex items-center justify-center">
                            {eleve.photo ? (
                              <Image
                                src={eleve.photo}
                                alt={`Photo de ${eleve.nom}`}
                                width={250} // Taille plus grande pour le dialogue
                                height={250}
                                className="rounded-lg object-cover shadow-lg border-2 border-primary-light"
                              />
                            ) : (
                              <div className="w-full h-48 md:h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-5xl text-gray-500 font-bold shadow-lg">
                                {eleve.nom?.charAt(0).toUpperCase() || "N/A"}
                              </div>
                            )}
                          </div>

                          {/* Section Détails (à droite) */}
                          <div className="flex-1 grid gap-3 text-base">
                            {" "}
                            {/* Augmenté la taille de police ici */}
                            <p>
                              <strong>Date de naissance :</strong>{" "}
                              {eleve.datenaissance
                                ? new Date(
                                    eleve.datenaissance
                                  ).toLocaleDateString("fr-FR")
                                : "N/A"}
                            </p>
                            <p>
                              <strong>Lieu de naissance :</strong>{" "}
                              <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-sm font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10 dark:bg-purple-400/10 dark:text-purple-400 dark:ring-purple-400/30">
                                {eleve.lieunaissance || "N/A"}
                              </span>
                            </p>
                            <p>
                              <strong>Adresse :</strong>{" "}
                              <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20 dark:bg-gray-400/10 dark:text-gray-400 dark:ring-gray-400/20">
                                {eleve.adresse || "N/A"}
                              </span>
                            </p>
                            <p>
                              <strong>Moyen de transport :</strong>{" "}
                              <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-sm font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20 dark:bg-yellow-400/10 dark:text-yellow-500 dark:ring-yellow-400/20">
                                {eleve.moyentransport || "N/A"}
                              </span>
                            </p>
                            <p>
                              <strong>Statut :</strong>{" "}
                              <span
                                className={`inline-flex items-center rounded-md px-2 py-1 text-sm font-medium ${
                                  eleve.status === "en cours"
                                    ? "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-400/10 dark:text-green-400 dark:ring-green-400/20"
                                    : "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20"
                                }`}
                              >
                                {eleve.status || "N/A"}
                              </span>
                            </p>
                            {/* Détails de la classe et de l'option dans le dialogue */}
                            {eleve.classe && (
                              <>
                                <p>
                                  <strong>Classe :</strong>{" "}
                                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30">
                                    {eleve.classe.nomclasse} (Niveau:{" "}
                                    {eleve.classe.niveau})
                                  </span>
                                </p>
                                {eleve.classe.option && (
                                  <p>
                                    <strong>Option :</strong>{" "}
                                    <span className="inline-flex items-center rounded-md bg-teal-50 px-2 py-1 text-sm font-medium text-teal-700 ring-1 ring-inset ring-teal-600/20 dark:bg-teal-400/10 dark:text-teal-400 dark:ring-teal-400/20">
                                      {eleve.classe.option.nomoption} (
                                      {eleve.classe.option.abreviation})
                                    </span>
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        <DialogFooter className="mt-4">
                          <DialogClose asChild>
                            <Button variant="outline">Fermer</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )
                )}
              </div>
            ) : (
              <p className="text-center text-lg text-muted-foreground mt-8">
                Aucun enfant trouvé pour votre compte. Veuillez contacter
                l&apos;administration.
              </p>
            )}
          </section>

          {/* Informations Parent dans un dialogue */}
          {parent && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="mx-auto text-sm underline text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors duration-200"
                >
                  Voir mes informations parentales
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Mes Informations Parentales</DialogTitle>
                  <DialogDescription>Détails de votre profil</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-3 text-base">
                  {" "}
                  {/* Changé en flex-col et augmenté la taille de police ici */}
                  <p>
                    <strong>Nom Père :</strong>{" "}
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-400/10 dark:text-green-400 dark:ring-green-400/20">
                      {parent.nompere || "N/A"}
                    </span>
                  </p>
                  <p>
                    <strong>Email Père :</strong>{" "}
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30">
                      {parent.emailpere || "N/A"}
                    </span>
                  </p>
                  <p>
                    <strong>Téléphone Père :</strong>{" "}
                    <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-sm font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10 dark:bg-purple-400/10 dark:text-purple-400 dark:ring-purple-400/30">
                      {parent.telephonepere || "N/A"}
                    </span>
                  </p>
                  <p>
                    <strong>Profession Père :</strong>{" "}
                    <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-sm font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20 dark:bg-yellow-400/10 dark:text-yellow-500 dark:ring-yellow-400/20">
                      {parent.professionpere || "N/A"}
                    </span>
                  </p>
                  <p>
                    <strong>Nom Mère :</strong>{" "}
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-400/10 dark:text-green-400 dark:ring-green-400/20">
                      {parent.nommere || "N/A"}
                    </span>
                  </p>
                  <p>
                    <strong>Email Mère :</strong>{" "}
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30">
                      {parent.emailmere || "N/A"}
                    </span>
                  </p>
                  <p>
                    <strong>Téléphone Mère :</strong>{" "}
                    <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-sm font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10 dark:bg-purple-400/10 dark:text-purple-400 dark:ring-purple-400/30">
                      {parent.telephonemere || "N/A"}
                    </span>
                  </p>
                  <p>
                    <strong>Profession Mère :</strong>{" "}
                    <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-sm font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20 dark:bg-yellow-400/10 dark:text-yellow-500 dark:ring-yellow-400/20">
                      {parent.professionmere || "N/A"}
                    </span>
                  </p>
                  <p>
                    <strong>Adresse :</strong>{" "}
                    <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20 dark:bg-gray-400/10 dark:text-gray-400 dark:ring-gray-400/20">
                      {parent.adresse || "N/A"}
                    </span>
                  </p>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Fermer</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </main>
  );
}
