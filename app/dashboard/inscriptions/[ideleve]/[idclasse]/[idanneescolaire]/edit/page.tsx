// app/inscription/[ideleve]/[idclasse]/[idanneescolaire]/edit/page.tsx

import { getAnneescolaires } from "@/app/actions/anneescolaire";
import { getClasses } from "@/app/actions/classes";
import { getEleves } from "@/app/actions/eleves";
import { getInscriptionById } from "@/app/actions/inscriptions";
import { InscriptionForm } from "@/components/inscription-form";
import { notFound } from "next/navigation";

type Params = Promise<{
  ideleve: string;
  idclasse: string;
  idanneescolaire: string;
}>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function EditInscriptionPage(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const params = await props.params;
  const ideleve = parseInt(params.ideleve, 10);
  const idclasse = parseInt(params.idclasse, 10);
  const idanneescolaire = parseInt(params.idanneescolaire, 10);

  if (isNaN(ideleve) || isNaN(idclasse) || isNaN(idanneescolaire)) {
    notFound(); // Si les IDs ne sont pas valides, affiche une page 404
  }

  // Récupérer l'inscription spécifique par sa clé composite
  const { data: inscription, success } = await getInscriptionById(
    ideleve,
    idclasse,
    idanneescolaire
  );

  // Récupérer les listes pour les sélecteurs
  const { data: eleves, success: elevesSuccess } = await getEleves();
  const { data: classes, success: classesSuccess } = await getClasses();
  const { data: anneescolaires, success: anneescolairesSuccess } =
    await getAnneescolaires();

  if (!success || !inscription) {
    notFound();
  }

  // Gérer les erreurs de chargement des listes
  if (!elevesSuccess || !eleves) {
    return (
      <div className="container mx-auto pt-4">
        <h2 className="text-2xl font-bold mb-6">Éditer l&apos;Inscription</h2>
        <p className="text-red-500">Impossible de charger les élèves.</p>
      </div>
    );
  }

  if (!classesSuccess || !classes) {
    return (
      <div className="container mx-auto pt-4">
        <h2 className="text-2xl font-bold mb-6">Éditer l&apos;Inscription</h2>
        <p className="text-red-500">Impossible de charger les classes.</p>
      </div>
    );
  }

  if (!anneescolairesSuccess || !anneescolaires) {
    return (
      <div className="container mx-auto pt-4">
        <h2 className="text-2xl font-bold mb-6">Éditer l&apos;Inscription</h2>
        <p className="text-red-500">
          Impossible de charger les années scolaires.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-4">
      <h2 className="text-2xl font-bold mb-6">Éditer l&apos;Inscription</h2>
      {/* Passe les données de l'inscription existante et les listes aux sélecteurs */}
      <InscriptionForm
        initialData={inscription}
        eleves={eleves}
        classes={classes}
        anneescolaires={anneescolaires}
      />
    </div>
  );
}
