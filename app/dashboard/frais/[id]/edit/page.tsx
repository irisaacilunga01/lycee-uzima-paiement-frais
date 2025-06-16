// app/frais/[id]/edit/page.tsx
import { getAnneescolaires } from "@/app/actions/anneescolaire";
import { getFraisById } from "@/app/actions/frais";
import { FraisForm } from "@/components/frais-form"; // Assurez-vous que ce chemin est correct
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;


export default async function EditFraisPage(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const params = await props.params;
  const idfrais = parseInt(params.id, 10); // Convertir l'ID de chaîne en nombre

  if (isNaN(idfrais)) {
    notFound(); // Si l'ID n'est pas un nombre valide, affiche une page 404
  }

  // Récupérer le frais spécifique
  const { data: frais, success } = await getFraisById(idfrais);

  // Récupérer la liste des années scolaires pour le sélecteur
  const {
    data: anneescolaires,
    success: anneescolairesSuccess,
  } = await getAnneescolaires();

  if (!success || !frais) {
    notFound(); // Affiche la page 404 si le frais n'existe pas
  }

  if (!anneescolairesSuccess || !anneescolaires) {
  
    return (
      <div className="container mx-auto pt-4">
        <h2 className="text-2xl font-bold mb-6">Éditer le Frais</h2>
        <p className="text-red-500">
          Impossible de charger la liste des années scolaires pour la sélection.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-4">
      <h2 className="text-2xl font-bold mb-6">Éditer le Frais</h2>
      {/* Passe les données du frais existant et la liste des années scolaires au formulaire */}
      <FraisForm initialData={frais} anneescolaires={anneescolaires} />
    </div>
  );
}
