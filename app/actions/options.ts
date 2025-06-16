// --- Fonctions pour la table 'Option' ---
"use server";
import { revalidate } from "@/lib/nextjs/revalidaPath";
import { createClient } from "@/lib/supabase/server";
import { Option } from "@/type";

/**
 * Récupère toutes les options de la base de données.
 * @returns Une liste d'options, ou une erreur.
 */
export async function getOptions(): Promise<{
  data?: Option[];
  error?: string;
  success: boolean;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("option")
      .select("*")
      .order("idoption", { ascending: true }); // Tri par ID

    if (error) {
      return {
        error: "Erreur lors de la récupération des options : " + error?.message,
        success: false,
      };
    }

    return { data: data as Option[], success: true };
  } catch (err) {
    return {
      error: "Exception lors de la récupération des options : " + err,
      success: false,
    };
  }
}

/**
 * Récupère une option spécifique par son ID.
 * @param idoption L'ID de l'option à récupérer.
 * @returns L'option trouvée, ou une erreur.
 */
export async function getOptionById(
  idoption: number
): Promise<{ data?: Option; error?: string; success: boolean }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("option")
      .select("*")
      .eq("idoption", idoption)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return {
          error: "Option non trouvée.",
          success: false,
        };
      }
      return {
        error: "Erreur lors de la récupération de l'option : " + error?.message,
        success: false,
      };
    }

    return { data: data as Option, success: true };
  } catch (err) {
    return {
      error: "Exception lors de la récupération de l'option : " + err,
      success: false,
    };
  }
}

/**
 * Ajoute une nouvelle option à la base de données.
 * @param newOption Les données de la nouvelle option à ajouter (sans l'idoption).
 * @returns L'option ajoutée avec son id, ou une erreur.
 */
export async function addOption(
  newOption: Omit<Option, "idoption">
): Promise<{ data?: Option; error?: string; success: boolean }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("option") // Nom de la table dans Supabase
      .insert(newOption)
      .select()
      .single();

    if (error) {
      return {
        error: "Erreur lors de l'ajout de l'option : " + error?.message, // Correction pour afficher le message d'erreur
        success: false,
      };
    }
    revalidate();
    return { data: data as Option, success: true };
  } catch (err) {
    return {
      error: "Exception lors de l'ajout de l'option : " + err,
      success: false,
    };
  }
}

/**
 * Met à jour une option existante dans la base de données.
 * @param idoption L'ID de l'option à mettre à jour.
 * @param updatedFields Les champs à mettre à jour pour cette option.
 * @returns L'option mise à jour, ou une erreur.
 */
export async function updateOption(
  idoption: number,
  updatedFields: Partial<Omit<Option, "idoption">>
): Promise<{ data?: Option; error?: string; success: boolean }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("option")
      .update(updatedFields)
      .eq("idoption", idoption)
      .select()
      .single();

    if (error) {
      return {
        error: "Erreur lors de la mise à jour de l'option : " + error?.message, // Correction pour afficher le message d'erreur
        success: false,
      };
    }
    revalidate();
    return { data: data as Option, success: true };
  } catch (err) {
    return {
      error: "Exception lors de la mise à jour de l'option : " + err,
      success: false,
    };
  }
}

/**
 * Supprime une option de la base de données.
 * @param idoption L'ID de l'option à supprimer.
 * @returns Un succès (pas de données retournées), ou une erreur.
 */
export async function deleteOption(
  idoption: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("option")
      .delete()
      .eq("idoption", idoption);

    if (error) {
      // console.error(); // Le console.error() ici n'était pas fonctionnel, supprimé.
      return {
        success: false,
        error: "Erreur lors de la suppression de l'option : " + error?.message,
      };
    }
    revalidate();
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: "Exception lors de la suppression de l'option : " + err,
    };
  }
}
