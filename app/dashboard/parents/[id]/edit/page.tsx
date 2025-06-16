// app/parents/[id]/edit/page.tsx
import { getParentById } from "@/app/actions/parents";
import { ParentForm } from "@/components/parent-form"; // Assurez-vous que ce chemin est correct
import { notFound } from "next/navigation"; // Import notFound pour gérer les cas où le parent n'existe pas
import { toast } from "sonner"; // Import toast si vous voulez afficher des messages ici

interface EditParentPageProps {
  params: {
    id: string; // L'ID du parent, sera une chaîne de caractères
  };
}

export default async function EditParentPage({ params }: EditParentPageProps) {
  const idparent = parseInt(params.id, 10); // Convertir l'ID de chaîne en nombre

  if (isNaN(idparent)) {
    notFound(); // Si l'ID n'est pas un nombre valide, affiche une page 404
  }

  const { data: parent, error, success } = await getParentById(idparent);

  if (!success || !parent) {
    // Si le parent n'est pas trouvé ou s'il y a une erreur, rediriger vers 404 ou afficher un message
    toast.error(
      error || "Parent non trouvé ou erreur lors de la récupération."
    );
    notFound(); // Affiche la page 404 si le parent n'existe pas
  }

  return (
    <div className="container mx-auto pt-4">
      <h2 className="text-2xl font-bold mb-6">Éditer le Parent</h2>
      {/* Passe les données du parent existant au formulaire */}
      <ParentForm initialData={parent} />
    </div>
  );
}
