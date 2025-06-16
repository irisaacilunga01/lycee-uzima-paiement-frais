// actions/notification.ts
"use server"; // Indique que ce fichier contient des Server Actions ou des Server Components

import { revalidate } from "@/lib/nextjs/revalidaPath";
import { createClient } from "@/lib/supabase/server";
import { Notification } from "@/type"; // Assurez-vous que Notification et Parent sont importés

/**
 * Récupère toutes les notifications de la base de données.
 * Inclut les informations du parent pour l'affichage.
 * @returns Une liste de notifications avec le nom du parent, ou une erreur.
 */
export async function getNotifications(): Promise<{
  data?: (Notification & { parent_name?: string })[];
  error?: string;
  success: boolean;
}> {
  try {
    const supabase = await createClient();
    // Sélectionne toutes les colonnes de 'notification' et les noms du père et de la mère de la table 'parent'
    const { data, error } = await supabase
      .from("notification")
      .select("*, parent(nompere, nommere)")
      .order("dateenvoi", { ascending: false }); // Tri par date d'envoi descendante

    if (error) {
      return {
        error:
          "Erreur lors de la récupération des notifications : " +
          error?.message,
        success: false,
      };
    }

    // Mappe les données pour inclure un champ 'parent_name' pour l'affichage
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const notificationsWithParentName = data.map((notif: any) => ({
      ...notif,
      parent_name:
        notif.idparent && notif.parent
          ? `${notif.parent.nompere || ""} & ${
              notif.parent.nommere || ""
            }`.trim()
          : "N/A",
    }));

    return { data: notificationsWithParentName, success: true };
  } catch (err) {
    return {
      error: "Exception lors de la récupération des notifications : " + err,
      success: false,
    };
  }
}

/**
 * Récupère une notification spécifique par son ID.
 * @param idnotification L'ID de la notification à récupérer.
 * @returns La notification trouvée, ou une erreur.
 */
export async function getNotificationById(
  idnotification: number
): Promise<{ data?: Notification; error?: string; success: boolean }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notification")
      .select("*")
      .eq("idnotification", idnotification)
      .single(); // S'attend à un seul enregistrement

    if (error) {
      if (error.code === "PGRST116") {
        // Code spécifique pour "row not found" ou "no rows returned"
        return {
          error: "Notification non trouvée.",
          success: false,
        };
      }
      return {
        error:
          "Erreur lors de la récupération de la notification : " +
          error?.message,
        success: false,
      };
    }

    return { data: data as Notification, success: true };
  } catch (err) {
    return {
      error: "Exception lors de la récupération de la notification : " + err,
      success: false,
    };
  }
}

/**
 * Ajoute une nouvelle notification à la base de données.
 * dateenvoi est omis car il est géré par la base de données avec DEFAULT NOW().
 * @param newNotification Les données de la nouvelle notification à ajouter (sans l'idnotification et dateenvoi).
 * @returns La notification ajoutée avec son id, ou une erreur.
 */
export async function addNotification(
  newNotification: Omit<Notification, "idnotification" | "dateenvoi"> // Correction ici: Omettez aussi dateenvoi
): Promise<{ data?: Notification; error?: string; success: boolean }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notification") // Nom de la table dans Supabase
      .insert(newNotification)
      .select() // Retourne les données insérées, y compris l'id généré
      .single(); // S'attend à un seul enregistrement retourné

    if (error) {
      return {
        error: "Erreur lors de l'ajout de la notification : " + error?.message,
        success: false,
      };
    }
    revalidate();
    return { data: data as Notification, success: true };
  } catch (err) {
    return {
      error: "Exception lors de l'ajout de la notification : " + err,
      success: false,
    };
  }
}

/**
 * Met à jour une notification existante dans la base de données.
 * @param idnotification L'ID de la notification à mettre à jour.
 * @param updatedFields Les champs à mettre à jour pour cette notification.
 * @returns La notification mise à jour, ou une erreur.
 */
export async function updateNotification(
  idnotification: number,
  // Correction ici: updateFields peut contenir dateenvoi si on veut pouvoir le modifier,
  // mais généralement il est géré par la DB. Ici, nous le gardons comme un champ non modifiable par le formulaire.
  updatedFields: Partial<Omit<Notification, "idnotification" | "dateenvoi">>
): Promise<{ data?: Notification; error?: string; success: boolean }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notification")
      .update(updatedFields)
      .eq("idnotification", idnotification) // Condition de mise à jour basée sur l'ID
      .select()
      .single();

    if (error) {
      return {
        error:
          "Erreur lors de la mise à jour de la notification : " +
          error?.message,
        success: false,
      };
    }
    revalidate();
    return { data: data as Notification, success: true };
  } catch (err) {
    return {
      error: "Exception lors de la mise à jour de la notification : " + err,
      success: false,
    };
  }
}

/**
 * Supprime une notification de la base de données.
 * @param idnotification L'ID de la notification à supprimer.
 * @returns Un succès (pas de données retournées), ou une erreur.
 */
export async function deleteNotification(
  idnotification: number
): Promise<{ error?: string; success: boolean }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("notification")
      .delete()
      .eq("idnotification", idnotification); // Condition de suppression basée sur l'ID

    if (error) {
      return {
        success: false,
        error:
          "Erreur lors de la suppression de la notification : " +
          error?.message,
      };
    }
    revalidate();
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: "Exception lors de la suppression de la notification : " + err,
    };
  }
}
/**
 * Votre schéma de table 'notification' :
 * create table notification (
 * idnotification bigint primary key generated always as identity,
 * message text not null,
 * dateenvoi timestamp with time zone default now() not null,
 * idparent bigint references parent(idparent) on delete restrict
 * );
 */

/**
 * Récupère les notifications pour un parent donné.
 * Seules les notifications avec un 'idparent' correspondant seront récupérées.
 * @param idparent L'ID du parent pour lequel récupérer les notifications.
 * @returns Une liste de notifications.
 */
export async function getNotificationsForParent(
  idparent: number
): Promise<{ data?: Notification[]; error?: string; success: boolean }> {
  try {
    const supabase = await createClient();
    // Filtre les notifications pour un parent spécifique
    const { data, error } = await supabase
      .from("notification")
      .select("*")
      .eq("idparent", idparent) // Filtrer uniquement les notifications pour cet idparent
      .order("dateenvoi", { ascending: false }); // Trie par date d'envoi, les plus récentes d'abord

    if (error) {
      return {
        error:
          "Erreur lors de la récupération des notifications : " +
          error?.message,
        success: false,
      };
    }

    return { data: data as Notification[], success: true };
  } catch (err) {
    return {
      error: "Exception lors de la récupération des notifications : " + err,
      success: false,
    };
  }
}
