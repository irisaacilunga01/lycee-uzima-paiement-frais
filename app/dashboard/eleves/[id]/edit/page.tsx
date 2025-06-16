// app/eleve/[id]/edit/page.tsx
import { getEleveById } from "@/app/actions/eleves";
import { getParents } from "@/app/actions/parents";
import { EleveForm } from "@/components/eleve-form"; // Assurez-vous que ce chemin est correct
import { notFound } from "next/navigation";
import { toast } from "sonner";

interface EditElevePageProps {
  params: {
    id: string; // L'ID de l'élève, sera une chaîne de caractères
  };
}

export default async function EditElevePage({ params }: EditElevePageProps) {
  const ideleve = parseInt(params.id, 10); // Convertir l'ID de chaîne en nombre

  if (isNaN(ideleve)) {
    notFound(); // Si l'ID n'est pas un nombre valide, affiche une page 404
  }

  // Récupérer l'élève spécifique
  const { data: eleve, error, success } = await getEleveById(ideleve);

  // Récupérer la liste des parents pour le sélecteur
  const {
    data: parents,
    error: parentsError,
    success: parentsSuccess,
  } = await getParents();

  if (!success || !eleve) {
    toast.error(error || "Élève non trouvé ou erreur lors de la récupération.");
    notFound(); // Affiche la page 404 si l'élève n'existe pas
  }

  if (!parentsSuccess || !parents) {
    toast.error(
      parentsError ||
        "Impossible de charger la liste des parents pour la sélection."
    );
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Éditer l&apos;Élève</h2>
        <p className="text-red-500">
          Impossible de charger la liste des parents pour la sélection.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Éditer l&apos;Élève</h2>
      {/* Passe les données de l'élève existant et la liste des parents au formulaire */}
      <EleveForm initialData={eleve} parents={parents} />
    </div>
  );
}
