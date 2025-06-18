import { getNotifications } from "../../actions/notifications"; // Utilisez le fichier d'actions spécifique
import { NotificationListClient } from "./notification-list-client"; // Importez le nouveau composant client

export default async function NotificationsPage() {
  // Récupération initiale des données côté serveur avec le nom du parent
  const { data: notifications, success } = await getNotifications();

  if (!success) {
    return (
      <div className="container mx-auto pt-4">
        <h2 className="text-2xl font-bold mb-6">Liste des Notifications</h2>
        <p className="text-red-500">
          Impossible de charger les données des notifications.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold  px-4">Liste des Notifications</h2>
      </div>
      {/* Passe les données initiales au composant client pour la gestion du temps réel */}
      <NotificationListClient initialNotifications={notifications || []} />
    </div>
  );
}
