// app/notifications/[id]/edit/page.tsx
import { getNotificationById } from "@/app/actions/notifications";
import { getParents } from "@/app/actions/parents";
import { NotificationForm } from "@/components/notification-form"; // Assurez-vous que ce chemin est correct
import { notFound } from "next/navigation";
import { toast } from "sonner";

interface EditNotificationPageProps {
  params: {
    id: string; // L'ID de la notification, sera une chaîne de caractères
  };
}

export default async function EditNotificationPage({
  params,
}: EditNotificationPageProps) {
  const idnotification = parseInt(params.id, 10); // Convertir l'ID de chaîne en nombre

  if (isNaN(idnotification)) {
    notFound(); // Si l'ID n'est pas un nombre valide, affiche une page 404
  }

  // Récupérer la notification spécifique
  const {
    data: notification,
    error,
    success,
  } = await getNotificationById(idnotification);

  // Récupérer la liste des parents pour le sélecteur
  const {
    data: parents,
    error: parentsError,
    success: parentsSuccess,
  } = await getParents();

  if (!success || !notification) {
    toast.error(
      error || "Notification non trouvée ou erreur lors de la récupération."
    );
    notFound(); // Affiche la page 404 si la notification n'existe pas
  }

  if (!parentsSuccess || !parents) {
    toast.error(
      parentsError ||
        "Impossible de charger la liste des parents pour la sélection."
    );
    // Vous pouvez choisir de rediriger ou d'afficher un message d'erreur plus robuste ici
    return (
      <div className="container mx-auto pt-4">
        <h2 className="text-2xl font-bold mb-6">Éditer la Notification</h2>
        <p className="text-red-500">
          Impossible de charger la liste des parents pour la sélection.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-4">
      <h2 className="text-2xl font-bold mb-6">Éditer la Notification</h2>
      {/* Passe les données de la notification existante et la liste des parents au formulaire */}
      <NotificationForm initialData={notification} parents={parents} />
    </div>
  );
}
