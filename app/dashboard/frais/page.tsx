import { getFrais } from "../../actions/frais";
import { FraisListClient } from "./frais-list-client"; // Importez le nouveau composant client

export default async function FraisPage() {
  // Récupération initiale des données côté serveur avec les infos de l'année scolaire
  const { data: frais, success } = await getFrais();

  if (!success) {
    return (
      <div className="container mx-auto pt-4">
        <h2 className="text-2xl font-bold mb-6">Liste des Frais</h2>
        <p className="text-red-500">
          Impossible de charger les données des frais.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold  px-4">Liste des Frais</h2>
      </div>
      {/* Passe les données initiales au composant client pour la gestion du temps réel */}
      <FraisListClient initialFrais={frais || []} />
    </div>
  );
}
