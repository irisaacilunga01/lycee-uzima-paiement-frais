// actions/anneescolaire.ts
"use server"; // Indique que ce fichier contient des Server Actions ou des Server Components

import { revalidate } from "@/lib/nextjs/revalidaPath";
import { createClient } from "@/lib/supabase/server";
import { Anneescolaire } from "@/type"; // Assurez-vous que Anneescolaire est importé

/**
 * Récupère toutes les années scolaires de la base de données.
 * @returns Une liste d'années scolaires, ou une erreur.
 */
export async function getAnneescolaires(): Promise<{
  data?: Anneescolaire[];
  error?: string;
  success: boolean;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("anneescolaire")
      .select("*")
      .order("datedebut", { ascending: false }); // Tri par date de début descendante pour les plus récentes

    if (error) {
      return {
        error:
          "Erreur lors de la récupération des années scolaires : " +
          error?.message,
        success: false,
      };
    }

    return { data: data as Anneescolaire[], success: true };
  } catch (err) {
    return {
      error: "Exception lors de la récupération des années scolaires : " + err,
      success: false,
    };
  }
}

/**
 * Récupère une année scolaire spécifique par son ID.
 * @param idanneescolaire L'ID de l'année scolaire à récupérer.
 * @returns L'année scolaire trouvée, ou une erreur.
 */
export async function getAnneescolaireById(
  idanneescolaire: number
): Promise<{ data?: Anneescolaire; error?: string; success: boolean }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("anneescolaire")
      .select("*")
      .eq("idanneescolaire", idanneescolaire)
      .single(); // S'attend à un seul enregistrement

    if (error) {
      if (error.code === "PGRST116") {
        // Code spécifique pour "row not found" ou "no rows returned"
        return {
          error: "Année scolaire non trouvée.",
          success: false,
        };
      }
      return {
        error:
          "Erreur lors de la récupération de l'année scolaire : " +
          error?.message,
        success: false,
      };
    }

    return { data: data as Anneescolaire, success: true };
  } catch (err) {
    return {
      error: "Exception lors de la récupération de l'année scolaire : " + err,
      success: false,
    };
  }
}

/**
 * Ajoute une nouvelle année scolaire à la base de données.
 * @param newAnneeScolaire Les données de la nouvelle année scolaire à ajouter (sans l'idanneescolaire).
 * @returns L'année scolaire ajoutée avec son id, ou une erreur.
 */
export async function addAnneescolaire(
  newAnneeScolaire: Omit<Anneescolaire, "idanneescolaire">
): Promise<{ data?: Anneescolaire; error?: string; success: boolean }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("anneescolaire") // Nom de la table dans Supabase
      .insert(newAnneeScolaire)
      .select() // Retourne les données insérées, y compris l'id généré
      .single(); // S'attend à un seul enregistrement retourné

    if (error) {
      return {
        error: "Erreur lors de l'ajout de l'année scolaire : " + error?.message,
        success: false,
      };
    }
    revalidate();
    // Le cast est nécessaire car Supabase retourne l'objet inséré, qui est conforme à Anneescolaire.
    return { data: data as Anneescolaire, success: true };
  } catch (err) {
    return {
      error: "Exception lors de l'ajout de l'année scolaire : " + err,
      success: false,
    };
  }
}

/**
 * Met à jour une année scolaire existante dans la base de données.
 * @param idanneescolaire L'ID de l'année scolaire à mettre à jour.
 * @param updatedFields Les champs à mettre à jour pour cette année scolaire.
 * @returns L'année scolaire mise à jour, ou une erreur.
 */
export async function updateAnneescolaire(
  idanneescolaire: number,
  updatedFields: Partial<Omit<Anneescolaire, "idanneescolaire">>
): Promise<{ data?: Anneescolaire; error?: string; success: boolean }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("anneescolaire")
      .update(updatedFields)
      .eq("idanneescolaire", idanneescolaire) // Condition de mise à jour basée sur l'ID
      .select()
      .single();

    if (error) {
      return {
        error:
          "Erreur lors de la mise à jour de l'année scolaire : " +
          error?.message,
        success: false,
      };
    }
    revalidate();
    return { data: data as Anneescolaire, success: true };
  } catch (err) {
    // console.error(); // Le console.error() ici n'était pas fonctionnel, supprimé.
    return {
      error: "Exception lors de la mise à jour de l'année scolaire : " + err,
      success: false,
    };
  }
}

/**
 * Supprime une année scolaire de la base de données.
 * @param idanneescolaire L'ID de l'année scolaire à supprimer.
 * @returns Un succès (pas de données retournées), ou une erreur.
 */
export async function deleteAnneescolaire(
  idanneescolaire: number
): Promise<{ error?: string; success: boolean }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("anneescolaire")
      .delete()
      .eq("idanneescolaire", idanneescolaire); // Condition de suppression basée sur l'ID

    if (error) {
      return {
        success: false,
        error:
          "Erreur lors de la suppression de l'année scolaire : " +
          error?.message,
      };
    }
    revalidate();
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: "Exception lors de la suppression de l'année scolaire : " + err,
    };
  }
}
