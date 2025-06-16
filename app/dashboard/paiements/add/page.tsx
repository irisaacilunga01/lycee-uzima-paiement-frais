// app/paiement/add/page.tsx
import { getEleves } from "@/app/actions/eleves"; // Importez les actions pour les élèves
import { getFrais } from "@/app/actions/frais"; // Importez les actions pour les frais
import { PaiementForm } from "@/components/paiement-form"; // Assurez-vous que ce chemin est correct
import { toast } from "sonner";

export default async function AddPaiementPage() {
  // Récupérer les listes nécessaires pour les sélecteurs du formulaire
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

  if (!elevesSuccess || !eleves) {
    toast.error(
      elevesError ||
        "Impossible de charger la liste des élèves pour le paiement."
    );
    return (
      <div className="container mx-auto pt-4">
        <h2 className="text-2xl font-bold mb-6">Ajouter un nouveau Paiement</h2>
        <p className="text-red-500">Impossible de charger les élèves.</p>
      </div>
    );
  }

  if (!fraisSuccess || !frais) {
    toast.error(
      fraisError || "Impossible de charger la liste des frais pour le paiement."
    );
    return (
      <div className="container mx-auto pt-4">
        <h2 className="text-2xl font-bold mb-6">Ajouter un nouveau Paiement</h2>
        <p className="text-red-500">Impossible de charger les frais.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-4">
      <h2 className="text-2xl font-bold mb-6">Ajouter un nouveau Paiement</h2>
      <PaiementForm eleves={eleves} frais={frais} />
    </div>
  );
}
