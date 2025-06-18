import { getClasses } from "../../actions/classes";
import { ClasseListClient } from "./classe-list-client"; // Importez le nouveau composant client

export default async function ClassePage() {
  // Récupération initiale des données côté serveur avec les infos de l'option
  const { data: classes, error, success } = await getClasses();

  if (!success) {
    return (
      <div className="container mx-auto pt-4">
        <h2 className="text-2xl font-bold mb-6">Liste des Classes</h2>
        <p className="text-red-500">
          Impossible de charger les données des classes.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold  px-4">Liste des Classes</h2>
      </div>
      {/* Passe les données initiales au composant client pour la gestion du temps réel */}
      <ClasseListClient initialClasses={classes || []} />
    </div>
  );
}
