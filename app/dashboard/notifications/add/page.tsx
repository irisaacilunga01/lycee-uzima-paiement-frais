// app/notifications/add/page.tsx
import { getParents } from "@/app/actions/parents";
import { NotificationForm } from "@/components/notification-form"; // Assurez-vous que ce chemin est correct

export default async function AddNotificationPage() {
  // Récupérer la liste des parents pour le sélecteur dans le formulaire
  const {
    data: parents,
    success: parentsSuccess,
  } = await getParents();

  if (!parentsSuccess || !parents) {
    // Gérer l'erreur si les parents ne peuvent pas être chargés (par exemple, afficher un message)
    // En production, vous pourriez vouloir une page d'erreur dédiée ou un fallback UI
    return (
      <div className="container mx-auto pt-4">
        <h2 className="text-2xl font-bold mb-6">
          Ajouter une nouvelle Notification
        </h2>
        <p className="text-red-500">
          Impossible de charger la liste des parents pour la sélection.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-4">
      <h2 className="text-2xl font-bold mb-6">
        Ajouter une nouvelle Notification
      </h2>
      <NotificationForm parents={parents} />
      {/* Passe la liste des parents au formulaire */}
    </div>
  );
}
