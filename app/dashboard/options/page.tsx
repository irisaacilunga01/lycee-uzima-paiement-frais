// app/options/page.tsx
import { toast } from "sonner";
import { getOptions } from "../../actions/options";
import { OptionListClient } from "./option-list-client"; // Importez le nouveau composant client

export default async function OptionsPage() {
  // Récupération initiale des données côté serveur
  const { data: options, error, success } = await getOptions();

  if (!success) {
    toast.error(error || "Erreur lors du chargement initial des options.");
    return (
      <div className="container mx-auto pt-4">
        <h2 className="text-2xl font-bold mb-6">Liste des Options</h2>
        <p className="text-red-500">
          Impossible de charger les données des options.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold  px-4">Liste des Options</h2>
      </div>
      {/* Passe les données initiales au composant client pour la gestion du temps réel */}
      <OptionListClient initialOptions={options || []} />
    </div>
  );
}
