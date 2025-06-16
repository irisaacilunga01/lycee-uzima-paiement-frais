// actions/auth.ts
"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Vérifie si un e-mail est associé à un parent existant et récupère son ID.
 * Cette fonction est utilisée pour l'inscription des parents.
 * @param email L'e-mail à vérifier.
 * @returns {idparent: number | null, success: boolean, error?: string} L'ID du parent si trouvé, ou null avec succès/erreur.
 */
export async function checkParentEmailAndGetId(
  email: string
): Promise<{ idparent?: number | null; success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // Recherche de l'e-mail dans les champs emailpere ou emailmere de la table 'parent'
    const { data, error } = await supabase
      .from("parent")
      .select("idparent")
      .or(`emailpere.eq.${email},emailmere.eq.${email}`)
      .single(); // Utilise .single() car on s'attend à un seul parent pour un email donné

    if (error) {
      // Si aucune ligne n'est trouvée, Supabase renvoie une erreur avec code 'PGRST116'
      if (error.code === "PGRST116") {
        return {
          success: false,
          error: "Cet e-mail n'est pas associé à un parent enregistré.",
        };
      }
      return {
        success: false,
        error:
          "Erreur lors de la vérification de l'e-mail du parent : " +
          error.message,
      };
    }

    // Si des données sont retournées, l'e-mail existe pour un parent
    return { idparent: data.idparent, success: true };
  } catch (err) {
    console.error(
      "Exception lors de la vérification de l'e-mail du parent :",
      err
    );
    return {
      success: false,
      error:
        "Une erreur inattendue est survenue lors de la vérification de l'e-mail.",
    };
  }
}

// Note: Vous devrez peut-être ajouter d'autres fonctions liées à l'authentification ici à l'avenir.
