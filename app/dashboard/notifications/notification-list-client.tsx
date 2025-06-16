// app/notifications/notification-list-client.tsx
"use client";
import { createClient } from "@/lib/supabase/client";
import { Notification } from "@/type"; // Assurez-vous que les types sont corrects
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getParentById } from "../../actions/parents";
import { columns } from "./columns";
import { DataTable } from "./data-table";

interface NotificationListClientProps {
  initialNotifications: (Notification & { parent_name?: string })[];
}

export function NotificationListClient({
  initialNotifications,
}: NotificationListClientProps) {
  const [notifications, setNotifications] =
    useState<(Notification & { parent_name?: string })[]>(initialNotifications);

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    // S'abonner aux changements en temps réel sur la table 'notification'
    const channel = supabase
      .channel("notification_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notification" },
        async (payload) => {
          if (!isMounted) return;

          if (payload.eventType === "INSERT") {
            const newNotif = payload.new as Notification;
            let parentName = "N/A";
            if (newNotif.idparent) {
              const { data: parentData, success } = await getParentById(
                Number(newNotif.idparent)
              ); // Récupérer le parent
              if (success && parentData) {
                parentName = `${parentData.nompere || ""} ${
                  parentData.nommere || ""
                }`.trim();
              }
            }
            setNotifications((prev) => [
              { ...newNotif, parent_name: parentName },
              ...prev,
            ]); // Ajoute en haut
            toast.success("Nouvelle notification ajoutée en temps réel !");
          } else if (payload.eventType === "UPDATE") {
            const updatedNotif = payload.new as Notification;
            let parentName = "N/A";
            if (updatedNotif.idparent) {
              const { data: parentData, success } = await getParentById(
                Number(updatedNotif.idparent)
              ); // Récupérer le parent
              if (success && parentData) {
                parentName = `${parentData.nompere || ""} ${
                  parentData.nommere || ""
                }`.trim();
              }
            }
            setNotifications((prev) =>
              prev.map((n) =>
                n.idnotification === updatedNotif.idnotification
                  ? { ...updatedNotif, parent_name: parentName }
                  : n
              )
            );
            toast.info("Notification mise à jour en temps réel !");
          } else if (payload.eventType === "DELETE") {
            setNotifications((prev) =>
              prev.filter(
                (n) =>
                  n.idnotification !==
                  (payload.old as Notification).idnotification
              )
            );
            toast.warning("Notification supprimée en temps réel !");
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Realtime subscription to notification table is active!");
        } else if (status === "CHANNEL_ERROR") {
          console.error("Realtime subscription error:", status);
          toast.error("Erreur de connexion en temps réel aux notifications.");
        }
      });

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []); // Dépendances vides pour n'exécuter qu'une seule fois au montage

  return <DataTable columns={columns} data={notifications} />;
}
