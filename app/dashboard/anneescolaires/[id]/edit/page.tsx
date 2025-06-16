import { getAnneescolaireById } from "@/app/actions/anneescolaire"; // Assurez-vous que ce chemin est correct
import { AnneescolaireForm } from "@/components/anneescolaire-form"; // Assurez-vous que ce chemin est correct
import { notFound } from "next/navigation";

// Mise à jour de l'interface pour inclure searchParams afin de satisfaire la contrainte PageProps
// C'est le typage standard pour les pages Next.js dans le routeur App.
interface EditAnneescolairePageProps {
  params: {
    id: string; // L'ID de l'année scolaire, sera une chaîne de caractères
  };
  searchParams?: { [key: string]: string | string[] | undefined }; // Ajouté pour satisfaire la contrainte PageProps
}

export default async function EditAnneescolairePage({
  params,
}: EditAnneescolairePageProps) {
  const idanneescolaire = parseInt(params.id, 10); // Convertir l'ID de chaîne en nombre

  if (isNaN(idanneescolaire)) {
    notFound(); // Si l'ID n'est pas un nombre valide, affiche une page 404
  }

  const { data: anneescolaire, success } = await getAnneescolaireById(
    idanneescolaire
  );

  if (!success || !anneescolaire) {
    notFound(); // Affiche la page 404 si l'année scolaire n'existe pas
  }

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6">Éditer l&apos;Année Scolaire</h2>
      {/* Passe les données de l'année scolaire existante au formulaire */}
      <AnneescolaireForm initialData={anneescolaire} />
    </div>
  );
}
