// app/frais/[id]/edit/page.tsx
import { getAnneescolaires } from "@/app/actions/anneescolaire";
import { getFraisById } from "@/app/actions/frais";
import { FraisForm } from "@/components/frais-form"; // Assurez-vous que ce chemin est correct
import { notFound } from "next/navigation";
import { toast } from "sonner";

interface EditFraisPageProps {
  params: {
    id: string; // L'ID du frais, sera une chaîne de caractères
  };
}

export default async function EditFraisPage({ params }: EditFraisPageProps) {
  const idfrais = parseInt(params.id, 10); // Convertir l'ID de chaîne en nombre

  if (isNaN(idfrais)) {
    notFound(); // Si l'ID n'est pas un nombre valide, affiche une page 404
  }

  // Récupérer le frais spécifique
  const { data: frais, error, success } = await getFraisById(idfrais);

  // Récupérer la liste des années scolaires pour le sélecteur
  const {
    data: anneescolaires,
    error: anneescolairesError,
    success: anneescolairesSuccess,
  } = await getAnneescolaires();

  if (!success || !frais) {
    toast.error(error || "Frais non trouvé ou erreur lors de la récupération.");
    notFound(); // Affiche la page 404 si le frais n'existe pas
  }

  if (!anneescolairesSuccess || !anneescolaires) {
    toast.error(
      anneescolairesError ||
        "Impossible de charger la liste des années scolaires pour la sélection."
    );
    return (
      <div className="container mx-auto pt-4">
        <h2 className="text-2xl font-bold mb-6">Éditer le Frais</h2>
        <p className="text-red-500">
          Impossible de charger la liste des années scolaires pour la sélection.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-4">
      <h2 className="text-2xl font-bold mb-6">Éditer le Frais</h2>
      {/* Passe les données du frais existant et la liste des années scolaires au formulaire */}
      <FraisForm initialData={frais} anneescolaires={anneescolaires} />
    </div>
  );
}
