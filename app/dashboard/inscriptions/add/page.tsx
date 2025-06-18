// app/inscription/add/page.tsx
import { getAnneescolaires } from "@/app/actions/anneescolaire";
import { getClasses } from "@/app/actions/classes";
import { getEleves } from "@/app/actions/eleves";
import { InscriptionForm } from "@/components/inscription-form"; // Assurez-vous que ce chemin est correct

export default async function AddInscriptionPage() {
  // Récupérer les listes nécessaires pour les sélecteurs du formulaire
  const { data: eleves, success: elevesSuccess } = await getEleves();
  const { data: classes, success: classesSuccess } = await getClasses();
  const { data: anneescolaires, success: anneescolairesSuccess } =
    await getAnneescolaires();

  if (!elevesSuccess || !eleves) {
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
