// app/eleve/add/page.tsx
import { getParents } from "@/app/actions/parents";
import { EleveForm } from "@/components/eleve-form"; // Assurez-vous que ce chemin est correct

export default async function AddElevePage() {
  // Récupérer la liste des parents pour le sélecteur dans le formulaire
  const { data: parents, success: parentsSuccess } = await getParents();

  if (!parentsSuccess || !parents) {
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Ajouter un nouvel Élève</h2>
        <p className="text-red-500">
          Impossible de charger la liste des parents pour la sélection.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Ajouter un nouvel Élève</h2>
      <EleveForm parents={parents} />
      {/* Passe la liste des parents au formulaire */}
    </div>
  );
}
