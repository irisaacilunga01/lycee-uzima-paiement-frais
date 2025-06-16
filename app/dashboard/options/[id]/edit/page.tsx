// app/options/[id]/edit/page.tsx
import { getOptionById } from "@/app/actions/options";
import { OptionForm } from "@/components/option-form"; // Assurez-vous que ce chemin est correct
import { notFound } from "next/navigation";
type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function EditOptionPage(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const params = await props.params;
  const idoption = parseInt(params.id, 10); // Convertir l'ID de chaîne en nombre

  if (isNaN(idoption)) {
    notFound(); // Si l'ID n'est pas un nombre valide, affiche une page 404
  }

  const { data: option, success } = await getOptionById(idoption);

  if (!success || !option) {
    notFound(); // Affiche la page 404 si l'option n'existe pas
  }

  return (
    <div className="container mx-auto pt-4">
      <h2 className="text-2xl font-bold mb-6">Éditer l&apos;Option</h2>
      {/* Passe les données de l'option existante au formulaire */}
      <OptionForm initialData={option} />
    </div>
  );
}
