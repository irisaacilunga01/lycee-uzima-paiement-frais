// app/paiement/[id]/edit/page.tsx
import { getEleves } from "@/app/actions/eleves";
import { getFrais } from "@/app/actions/frais";
import { getPaiementById } from "@/app/actions/paiement"; // Utilisez le fichier d'actions spécifique
import { PaiementForm } from "@/components/paiement-form"; // Assurez-vous que ce chemin est correct
import { notFound } from "next/navigation";
import { toast } from "sonner";

interface EditPaiementPageProps {
  params: {
    id: string; // L'ID du paiement
  };
}

export default async function EditPaiementPage({
  params,
}: EditPaiementPageProps) {
  const idpaiement = parseInt(params.id, 10);

  if (isNaN(idpaiement)) {
    notFound(); // Si l'ID n'est pas valide, affiche une page 404
  }

  // Récupérer le paiement spécifique
  const { data: paiement, error, success } = await getPaiementById(idpaiement);

  // Récupérer les listes pour les sélecteurs
  const {
    data: eleves,
    error: elevesError,
    success: elevesSuccess,
  } = await getEleves();
  const {
    data: frais,
    error: fraisError,
    success: fraisSuccess,
  } = await getFrais();

  if (!success || !paiement) {
    toast.error(
      error || "Paiement non trouvé ou erreur lors de la récupération."
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
        <h2 className="text-2xl font-bold mb-6">Éditer le Paiement</h2>
        <p className="text-red-500">Impossible de charger les élèves.</p>
      </div>
    );
  }

  if (!fraisSuccess || !frais) {
    toast.error(
      fraisError || "Impossible de charger la liste des frais pour l'édition."
    );
    return (
      <div className="container mx-auto pt-4">
        <h2 className="text-2xl font-bold mb-6">Éditer le Paiement</h2>
        <p className="text-red-500">Impossible de charger les frais.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-4">
      <h2 className="text-2xl font-bold mb-6">Éditer le Paiement</h2>
      {/* Passe les données du paiement existant et les listes aux sélecteurs */}
      <PaiementForm initialData={paiement} eleves={eleves} frais={frais} />
    </div>
  );
}
