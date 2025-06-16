// actions/classe.ts
"use server";
import { revalidate } from "@/lib/nextjs/revalidaPath";
import { createClient } from "@/lib/supabase/server";
import { Classe, Option } from "@/type"; // Assurez-vous d'importer Option également


/**
 * Récupère toutes les classes de la base de données.
 * Inclut les informations de l'option associée.
 * @returns Une liste de classes avec les détails de l'option, ou une erreur.
 */
export async function getClasses(): Promise<{
  data?: (Classe & { option?: Option })[];
  error?: string;
  success: boolean;
}> {
  try {
    const supabase = await createClient();
    // Sélectionne toutes les colonnes de 'classe' et toutes les colonnes de 'option' associée
    const { data, error } = await supabase
      .from("classe")
      .select("*, option(*)") // Jointure avec la table 'option'
      .order("nomclasse", { ascending: true });

    if (error) {
      return {
        error: "Erreur lors de la récupération des classes : " + error?.message,
        success: false,
      };
    }

    // Le cast est nécessaire car Supabase retourne l'objet avec la relation
    return { data: data as (Classe & { option?: Option })[], success: true };
  } catch (err) {
    return {
      error: "Exception lors de la récupération des classes : " + err,
      success: false,
    };
  }
}

/**
 * Récupère une classe spécifique par son ID.
 * Inclut les informations de l'option associée.
 * @param idclasse L'ID de la classe à récupérer.
 * @returns La classe trouvée avec les détails de l'option, ou une erreur.
 */
export async function getClasseById(idclasse: number): Promise<{
  data?: Classe & { option?: Option };
  error?: string;
  success: boolean;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("classe")
      .select("*, option(*)") // Jointure avec la table 'option'
      .eq("idclasse", idclasse)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return {
          error: "Classe non trouvée.",
          success: false,
        };
      }
      return {
        error:
          "Erreur lors de la récupération de la classe : " + error?.message,
        success: false,
      };
    }

    return { data: data as Classe & { option?: Option }, success: true };
  } catch (err) {
    return {
      error: "Exception lors de la récupération de la classe : " + err,
      success: false,
    };
  }
}

/**
 * Ajoute une nouvelle classe à la base de données.
 * @param newClasse Les données de la nouvelle classe à ajouter (sans l'idclasse).
 * @returns La classe ajoutée avec son id, ou une erreur.
 */
export async function addClasse(
  newClasse: Omit<Classe, "idclasse">
): Promise<{ data?: Classe; error?: string; success: boolean }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("classe") // Nom de la table dans Supabase
      .insert(newClasse)
      .select() // Retourne les données insérées, y compris l'id généré
      .single(); // S'attend à un seul enregistrement retourné

    if (error) {
      return {
        error: "Erreur lors de l'ajout de la classe : " + error?.message, // Accès au message d'erreur
        success: false,
      };
    }
    revalidate();
    return { data: data as Classe, success: true };
  } catch (err) {
    return {
      error: "Exception lors de l'ajout de la classe : " + err,
      success: false,
    };
  }
}

/**
 * Met à jour une classe existante dans la base de données.
 * @param idclasse L'ID de la classe à mettre à jour.
 * @param updatedFields Les champs à mettre à jour pour cette classe.
 * @returns La classe mise à jour, ou une erreur.
 */
export async function updateClasse(
  idclasse: number,
  updatedFields: Partial<Omit<Classe, "idclasse">>
): Promise<{ data?: Classe; error?: string; success: boolean }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("classe")
      .update(updatedFields)
      .eq("idclasse", idclasse) // Condition de mise à jour basée sur l'ID
      .select()
      .single();

    if (error) {
      return {
        error: "Erreur lors de la mise à jour de la classe : " + error?.message, // Accès au message d'erreur
        success: false,
      };
    }
  revalidate();
    return { data: data as Classe, success: true };
  } catch (err) {
    return {
      error: "Exception lors de la mise à jour de la classe : " + err,
      success: false,
    };
  }
}

/**
 * Supprime une classe de la base de données.
 * @param idclasse L'ID de la classe à supprimer.
 * @returns Un succès (pas de données retournées), ou une erreur.
 */
export async function deleteClasse(
  idclasse: number
): Promise<{ error?: string; success: boolean }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("classe")
      .delete()
      .eq("idclasse", idclasse); // Condition de suppression basée sur l'ID

    if (error) {
      return {
        success: false,
        error: "Erreur lors de la suppression de la classe : " + error?.message, // Accès au message d'erreur
      };
    }
  revalidate();

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: "Exception lors de la suppression de la classe : " + err,
    };
  }
}

/**
 * Récupère le nombre total de classes.
 * @returns Le nombre total de classes.
 */
export async function getTotalClasses(): Promise<{
  count?: number;
  error?: string;
  success: boolean;
}> {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("classe")
      .select("*", { count: "exact", head: true });

    if (error) {
      return {
        error: "Erreur lors du comptage des classes : " + error?.message,
        success: false,
      };
    }

    return { count: count || 0, success: true };
  } catch (err) {
    return {
      error: "Exception lors du comptage des classes : " + err,
      success: false,
    };
  }
}
