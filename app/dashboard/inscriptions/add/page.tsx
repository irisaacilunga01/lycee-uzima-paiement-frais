// app/inscription/add/page.tsx
import { getAnneescolaires } from "@/app/actions/anneescolaire";
import { getClasses } from "@/app/actions/classes";
import { getEleves } from "@/app/actions/eleves";
import { InscriptionForm } from "@/components/inscription-form"; // Assurez-vous que ce chemin est correct

import { toast } from "sonner";

export default async function AddInscriptionPage() {
  // Récupérer les listes nécessaires pour les sélecteurs du formulaire
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

  if (!elevesSuccess || !eleves) {
    toast.error(
      elevesError ||
        "Impossible de charger la liste des élèves pour l'inscription."
    );
    return (
      <div className="container mx-auto pt-4">
        <h2 className="text-2xl font-bold mb-6">
          Ajouter une nouvelle Inscription
        </h2>
        <p className="text-red-500">Impossible de charger les élèves.</p>
      </div>
    );
  }

  if (!classesSuccess || !classes) {
    toast.error(
      classesError ||
        "Impossible de charger la liste des classes pour l'inscription."
    );
    return (
      <div className="container mx-auto pt-4">
        <h2 className="text-2xl font-bold mb-6">
          Ajouter une nouvelle Inscription
        </h2>
        <p className="text-red-500">Impossible de charger les classes.</p>
      </div>
    );
  }

  if (!anneescolairesSuccess || !anneescolaires) {
    toast.error(
      anneescolairesError ||
        "Impossible de charger la liste des années scolaires pour l'inscription."
    );
    return (
      <div className="container mx-auto pt-4">
        <h2 className="text-2xl font-bold mb-6">
          Ajouter une nouvelle Inscription
        </h2>
        <p className="text-red-500">
          Impossible de charger les années scolaires.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-4">
      <h2 className="text-2xl font-bold mb-6">
        Ajouter une nouvelle Inscription
      </h2>
      <InscriptionForm
        eleves={eleves}
        classes={classes}
        anneescolaires={anneescolaires}
      />
    </div>
  );
}
