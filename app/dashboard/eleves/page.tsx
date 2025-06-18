// app/eleve/page.tsx
import { getEleves } from "@/app/actions/eleves";
import { EleveListClient } from "./eleve-list-client";

export default async function ElevePage() {
  // Récupération initiale des données côté serveur avec le nom du parent
  const { data: eleves, success } = await getEleves();

  if (!success) {
    return (
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-6">Liste des Élèves</h2>
        <p className="text-red-500">
          Impossible de charger les données des élèves.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-2">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-bold px-4">Liste des Élèves</h2>
      </div>
      {/* Passe les données initiales au composant client pour la gestion du temps réel */}
      <EleveListClient initialEleves={eleves || []} />
    </div>
  );
}
