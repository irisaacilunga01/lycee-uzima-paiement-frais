// actions/frais.ts
"use server";
import { revalidate } from "@/lib/nextjs/revalidaPath";
import { createClient } from "@/lib/supabase/server";
import { Frais, Anneescolaire } from "@/type"; // Assurez-vous d'importer Anneescolaire

/**
 * Récupère tous les frais de la base de données.
 * Inclut les informations de l'année scolaire associée.
 * @returns Une liste de frais avec les détails de l'année scolaire, ou une erreur.
 */
export async function getFrais(): Promise<{
  data?: (Frais & { anneescolaire?: Anneescolaire })[];
  error?: string;
  success: boolean;
}> {
  try {
    const supabase = await createClient();
    // Sélectionne toutes les colonnes de 'frais' et toutes les colonnes de 'anneescolaire' associée
    const { data, error } = await supabase
      .from("frais")
      .select("*, anneescolaire(*)") // Jointure avec la table 'anneescolaire'
      .order("dateecheance", { ascending: false }); // Tri par date d'échéance descendante

    if (error) {
      return {
        error: "Erreur lors de la récupération des frais : " + error?.message,
        success: false,
      };
    }

    // Le cast est nécessaire car Supabase retourne l'objet avec la relation
    return {
      data: data as (Frais & { anneescolaire?: Anneescolaire })[],
      success: true,
    };
  } catch (err) {
    return {
      error: "Exception lors de la récupération des frais : " + err,
      success: false,
    };
  }
}

/**
 * Récupère un frais spécifique par son ID.
 * Inclut les informations de l'année scolaire associée.
 * @param idfrais L'ID du frais à récupérer.
 * @returns Le frais trouvé avec les détails de l'année scolaire, ou une erreur.
 */
export async function getFraisById(
  idfrais: number
): Promise<{
  data?: Frais & { anneescolaire?: Anneescolaire };
  error?: string;
  success: boolean;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("frais")
      .select("*, anneescolaire(*)") // Jointure avec la table 'anneescolaire'
      .eq("idfrais", idfrais)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return {
          error: "Frais non trouvé.",
          success: false,
        };
      }
      return {
        error: "Erreur lors de la récupération du frais : " + error?.message,
        success: false,
      };
    }

    return {
      data: data as Frais & { anneescolaire?: Anneescolaire },
      success: true,
    };
  } catch (err) {
    return {
      error: "Exception lors de la récupération du frais : " + err,
      success: false,
    };
  }
}

/**
 * Ajoute un nouveau frais à la base de données.
 * @param newFrais Les données du nouveau frais à ajouter (sans l'idfrais).
 * @returns Le frais ajouté avec son id, ou une erreur.
 */
export async function addFrais(
  newFrais: Omit<Frais, "idfrais">
): Promise<{ data?: Frais; error?: string; success: boolean }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("frais") // Nom de la table dans Supabase
      .insert(newFrais)
      .select() // Retourne les données insérées, y compris l'id généré
      .single(); // S'attend à un seul enregistrement retourné

    if (error) {
      return {
        error: "Erreur lors de l'ajout du frais : " + error?.message,
        success: false,
      };
    }
  revalidate();
    return { data: data as Frais, success: true };
  } catch (err) {
    return {
      error: "Exception lors de l'ajout du frais : " + err,
      success: false,
    };
  }
}

/**
 * Met à jour un frais existant dans la base de données.
 * @param idfrais L'ID du frais à mettre à jour.
 * @param updatedFields Les champs à mettre à jour pour ce frais.
 * @returns Le frais mis à jour, ou une erreur.
 */
export async function updateFrais(
  idfrais: number,
  updatedFields: Partial<Omit<Frais, "idfrais">>
): Promise<{ data?: Frais; error?: string; success: boolean }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("frais")
      .update(updatedFields)
      .eq("idfrais", idfrais) // Condition de mise à jour basée sur l'ID
      .select()
      .single();

    if (error) {
      return {
        error: "Erreur lors de la mise à jour du frais : " + error?.message,
        success: false,
      };
    }
  revalidate();
    return { data: data as Frais, success: true };
  } catch (err) {
    return {
      error: "Exception lors de la mise à jour du frais : " + err,
      success: false,
    };
  }
}

/**
 * Supprime un frais de la base de données.
 * @param idfrais L'ID du frais à supprimer.
 * @returns Un succès (pas de données retournées), ou une erreur.
 */
export async function deleteFrais(
  idfrais: number
): Promise<{ error?: string; success: boolean }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("frais")
      .delete()
      .eq("idfrais", idfrais); // Condition de suppression basée sur l'ID

    if (error) {
      return {
        success: false,
        error: "Erreur lors de la suppression du frais : " + error?.message,
      };
    }
  revalidate();
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: "Exception lors de la suppression du frais : " + err,
    };
  }
}
