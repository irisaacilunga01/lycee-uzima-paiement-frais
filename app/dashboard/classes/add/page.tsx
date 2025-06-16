// app/classe/add/page.tsx
import { getOptions } from "@/app/actions/options";
import { ClasseForm } from "@/components/classe-form"; // Assurez-vous que ce chemin est correct

export default async function AddClassePage() {
  // Récupérer la liste des options pour le sélecteur dans le formulaire
  const {
    data: options,
 
    success: optionsSuccess,
  } = await getOptions();

  if (!optionsSuccess || !options) {
    return (
      <div className="container mx-auto pt-4">
        <h2 className="text-2xl font-bold mb-6">Ajouter une nouvelle Classe</h2>
        <p className="text-red-500">
          Impossible de charger la liste des options pour la sélection.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-4">
      <h2 className="text-2xl font-bold mb-6">Ajouter une nouvelle Classe</h2>
      <ClasseForm options={options} />{" "}
      {/* Passe la liste des options au formulaire */}
    </div>
  );
}
