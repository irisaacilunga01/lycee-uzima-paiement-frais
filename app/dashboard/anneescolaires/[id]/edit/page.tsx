// app/anneescolaire/[id]/edit/page.tsx
import { getAnneescolaireById } from "@/app/actions/anneescolaire";
import { AnneescolaireForm } from "@/components/anneescolaire-form"; // Assurez-vous que ce chemin est correct
import { notFound } from "next/navigation";
type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function EditAnneescolairePage(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const params = await props.params;
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
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Éditer l&apos;Année Scolaire</h2>
      {/* Passe les données de l'année scolaire existante au formulaire */}
      <AnneescolaireForm initialData={anneescolaire} />
    </div>
  );
}
