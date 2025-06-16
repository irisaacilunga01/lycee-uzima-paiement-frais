// app/classe/[id]/edit/page.tsx
import { getClasseById } from "@/app/actions/classes";
import { getOptions } from "@/app/actions/options";
import { ClasseForm } from "@/components/classe-form"; // Assurez-vous que ce chemin est correct
import { notFound } from "next/navigation";
type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function EditClassePage(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const params = await props.params;
  const idclasse = parseInt(params.id, 10); // Convertir l'ID de chaîne en nombre

  if (isNaN(idclasse)) {
    notFound(); // Si l'ID n'est pas un nombre valide, affiche une page 404
  }

  // Récupérer la classe spécifique
  const { data: classe, success } = await getClasseById(idclasse);

  // Récupérer la liste des options pour le sélecteur
  const { data: options, success: optionsSuccess } = await getOptions();

  if (!success || !classe) {
    notFound(); // Affiche la page 404 si la classe n'existe pas
  }

  if (!optionsSuccess || !options) {
    return (
      <div className="container mx-auto pt-4">
        <h2 className="text-2xl font-bold mb-6">Éditer la Classe</h2>
        <p className="text-red-500">
          Impossible de charger la liste des options pour la sélection.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-4">
      <h2 className="text-2xl font-bold mb-6">Éditer la Classe</h2>
      {/* Passe les données de la classe existante et la liste des options au formulaire */}
      <ClasseForm initialData={classe} options={options} />
    </div>
  );
}
