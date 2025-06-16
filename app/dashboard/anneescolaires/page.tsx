// app/anneescolaire/page.tsx
import { toast } from "sonner";
import { getAnneescolaires } from "../../actions/anneescolaire";
import { AnneescolaireListClient } from "./anneescolaire-list-client"; // Importez le nouveau composant client

export default async function AnneescolairePage() {
  // Récupération initiale des données côté serveur
  const { data: anneescolaires, error, success } = await getAnneescolaires();

  if (!success) {
    toast.error(
      error || "Erreur lors du chargement initial des années scolaires."
    );
    return (
      <div className="container mx-auto py-3">
        <h2 className="text-2xl font-bold mb-4">Liste des Années Scolaires</h2>
        <p className="text-red-500">
          Impossible de charger les données des années scolaires.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold  px-4">Liste des Années Scolaires</h2>
      </div>
      {/* Passe les données initiales au composant client pour la gestion du temps réel */}
      <AnneescolaireListClient initialAnneescolaires={anneescolaires || []} />
    </div>
  );
}
