// app/inscription/[ideleve]/[idclasse]/[idanneescolaire]/edit/page.tsx

import { getAnneescolaires } from "@/app/actions/anneescolaire";
import { getClasses } from "@/app/actions/classes";
import { getEleves } from "@/app/actions/eleves";
import { getInscriptionById } from "@/app/actions/inscriptions";
import { InscriptionForm } from "@/components/inscription-form";
import { notFound } from "next/navigation";
import { toast } from "sonner";

interface EditInscriptionPageProps {
  params: {
    ideleve: string;
    idclasse: string;
    idanneescolaire: string;
  };
}

export default async function EditInscriptionPage({
  params,
}: EditInscriptionPageProps) {
  const ideleve = parseInt(params.ideleve, 10);
  const idclasse = parseInt(params.idclasse, 10);
  const idanneescolaire = parseInt(params.idanneescolaire, 10);

  if (isNaN(ideleve) || isNaN(idclasse) || isNaN(idanneescolaire)) {
    notFound(); // Si les IDs ne sont pas valides, affiche une page 404
  }

  // Récupérer l'inscription spécifique par sa clé composite
  const {
    data: inscription,
    error,
    success,
  } = await getInscriptionById(ideleve, idclasse, idanneescolaire);

  // Récupérer les listes pour les sélecteurs
  const {
    data: eleves,
    error: elevesError,
    success: elevesSuccess,
  } = await getEleves();
  const {
    data: classes,
    error: classesError,
    success: classesSuccess,
  } = await getClasses();
  const {
    data: anneescolaires,
    error: anneescolairesError,
    success: anneescolairesSuccess,
  } = await getAnneescolaires();

  if (!success || !inscription) {
    toast.error(
      error || "Inscription non trouvée ou erreur lors de la récupération."
    );
    notFound();
  }

  // Gérer les erreurs de chargement des listes
  if (!elevesSuccess || !eleves) {
    toast.error(
      elevesError || "Impossible de charger la liste des élèves pour l'édition."
    );
    return (
      <div className="container mx-auto pt-4">
        <h2 className="text-2xl font-bold mb-6">Éditer l&apos;Inscription</h2>
        <p className="text-red-500">Impossible de charger les élèves.</p>
      </div>
    );
  }

  if (!classesSuccess || !classes) {
    toast.error(
      classesError ||
        "Impossible de charger la liste des classes pour l'édition."
    );
    return (
      <div className="container mx-auto pt-4">
        <h2 className="text-2xl font-bold mb-6">Éditer l&apos;Inscription</h2>
        <p className="text-red-500">Impossible de charger les classes.</p>
      </div>
    );
  }

  if (!anneescolairesSuccess || !anneescolaires) {
    toast.error(
      anneescolairesError ||
        "Impossible de charger la liste des années scolaires pour l'édition."
    );
    return (
      <div className="container mx-auto pt-4">
        <h2 className="text-2xl font-bold mb-6">Éditer l&apos;Inscription</h2>
        <p className="text-red-500">
          Impossible de charger les années scolaires.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-4">
      <h2 className="text-2xl font-bold mb-6">Éditer l&apos;Inscription</h2>
      {/* Passe les données de l'inscription existante et les listes aux sélecteurs */}
      <InscriptionForm
        initialData={inscription}
        eleves={eleves}
        classes={classes}
        anneescolaires={anneescolaires}
      />
    </div>
  );
}
