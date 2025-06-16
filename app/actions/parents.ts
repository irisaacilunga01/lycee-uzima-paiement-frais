"use server";

import { revalidate } from "@/lib/nextjs/revalidaPath";
import { createClient } from "@/lib/supabase/server";
import { Parent } from "@/type";
/**
 * Récupère tous les parents de la base de données.
 * @returns Une liste de parents, ou une erreur.
 */
export async function getParents(): Promise<{
  data?: Parent[];
  error?: string;
  success: boolean;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("parent")
      .select("*")
      .order("idparent", { ascending: true }); // Tri par ID pour un affichage cohérent

    if (error) {
      return {
        error: "Erreur lors de la récupération des parents : " + error?.message,
        success: false,
      };
    }

    return { data: data as Parent[], success: true };
  } catch (err) {
    return {
      error: "Exception lors de la récupération des parents : " + err,
      success: false,
    };
  }
}

/**
 * Récupère un parent spécifique par son ID.
 * @param idparent L'ID du parent à récupérer.
 * @returns Le parent trouvé, ou une erreur.
 */
export async function getParentById(
  idparent: number
): Promise<{ data?: Parent; error?: string; success: boolean }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("parent")
      .select("*")
      .eq("idparent", idparent)
      .single(); // S'attend à un seul enregistrement

    if (error) {
      // Si aucune ligne n'est trouvée, Supabase renvoie une erreur "null value in column".
      // Il faut la gérer spécifiquement si l'absence de données n'est pas une erreur.
      // Ici, on considère que si `data` est null, c'est que le parent n'existe pas.
      if (error.code === "PGRST116") {
        // Code spécifique pour "row not found" ou "no rows returned"
        return {
          error: "Parent non trouvé.",
          success: false,
        };
      }
      return {
        error: "Erreur lors de la récupération du parent : " + error?.message,
        success: false,
      };
    }

    return { data: data as Parent, success: true };
  } catch (err) {
    return {
      error: "Exception lors de la récupération du parent : " + err,
      success: false,
    };
  }
}

/**
 * Ajoute un nouveau parent à la base de données.
 * @param newParent Les données du nouveau parent à ajouter (sans l'idparent).
 * @returns Le parent ajouté avec son id, ou une erreur.
 */
export async function addParent(
  newParent: Omit<Parent, "idparent">
): Promise<{ data?: Parent; error?: string; success: boolean }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("parent") // Nom de la table dans Supabase
      .insert(newParent)
      .select() // Retourne les données insérées, y compris l'id généré
      .single(); // S'attend à un seul enregistrement retourné

    if (error) {
      console.log({ error });

      return {
        error: "Erreur lors de l'ajout du parent : " + error?.message,
        success: false,
      };
    }
    revalidate();

    // Le cast est nécessaire car Supabase retourne l'objet inséré, qui est conforme à Parent.
    return { data: data as Parent, success: true };
  } catch (err) {
    return {
      error: "Exception lors de l'ajout du parent : " + err,
      success: false,
    };
  }
}

/**
 * Met à jour un parent existant dans la base de données.
 * @param idparent L'ID du parent à mettre à jour.
 * @param updatedFields Les champs à mettre à jour pour ce parent.
 * @returns Le parent mis à jour, ou une erreur.
 */
export async function updateParent(
  idparent: number,
  updatedFields: Partial<Omit<Parent, "idparent">>
): Promise<{ data?: Parent; error?: string; success: boolean }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("parent")
      .update(updatedFields)
      .eq("idparent", idparent) // Condition de mise à jour basée sur l'ID
      .select()
      .single();

    if (error) {
      return {
        error: "Erreur lors de la mise à jour du parent : " + error?.message,
        success: false,
      };
    }
    revalidate();
    return { data: data as Parent, success: true };
  } catch (err) {
    return {
      error: "Exception lors de la mise à jour du parent : " + err,
      success: false,
    };
  }
}

/**
 * Supprime un parent de la base de données.
 * @param idparent L'ID du parent à supprimer.
 * @returns Un succès (pas de données retournées), ou une erreur.
 */
export async function deleteParent(
  idparent: number
): Promise<{ error?: string; success: boolean }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("parent")
      .delete()
      .eq("idparent", idparent); // Condition de suppression basée sur l'ID

    if (error) {
      return {
        success: false,
        error: "Erreur lors de la suppression du parent : " + error?.message, // Ajout de .message
      };
    }
    revalidate();
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: "Exception lors de la suppression du parent : " + err,
    };
  }
}
