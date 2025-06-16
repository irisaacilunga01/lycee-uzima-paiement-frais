// app/frais/add/page.tsx
import { getAnneescolaires } from "@/app/actions/anneescolaire";
import { FraisForm } from "@/components/frais-form"; // Assurez-vous que ce chemin est correct

export default async function AddFraisPage() {
  // Récupérer la liste des années scolaires pour le sélecteur dans le formulaire
  const { data: anneescolaires, success: anneescolairesSuccess } =
    await getAnneescolaires();

  if (!anneescolairesSuccess || !anneescolaires) {
    return (
      <div className="container mx-auto pt-4">
        <h2 className="text-2xl font-bold mb-6">Ajouter un nouveau Frais</h2>
        <p className="text-red-500">
          Impossible de charger la liste des années scolaires pour la sélection.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-4">
      <h2 className="text-2xl font-bold mb-6">Ajouter un nouveau Frais</h2>
      <FraisForm anneescolaires={anneescolaires} />{" "}
      {/* Passe la liste des années scolaires au formulaire */}
    </div>
  );
}
