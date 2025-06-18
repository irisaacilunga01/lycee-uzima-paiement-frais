import { getParents } from "../../actions/parents";
import { ParentListClient } from "./parent-list-client";

export default async function ParentsPage() {
  // Récupération initiale des données côté serveur
  const { data: parents, success } = await getParents();

  if (!success) {
    return (
      <div className="container mx-auto pt-4">
        <h2 className="text-2xl font-bold mb-6">Liste des Parents</h2>
        <p className="text-red-500">
          Impossible de charger les données des parents.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold  px-4">Liste des Parents</h2>
      </div>
      {/* Passe les données initiales au composant client pour la gestion du temps réel */}
      <ParentListClient initialParents={parents || []} />
    </div>
  );
}
