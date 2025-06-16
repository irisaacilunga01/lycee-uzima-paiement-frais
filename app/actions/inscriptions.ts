// actions/inscription.ts
"use server"; // Indique que ce fichier contient des Server Actions ou des Server Components

import { revalidate } from "@/lib/nextjs/revalidaPath";
import { createClient } from "@/lib/supabase/server";
import { Anneescolaire, Classe, Eleve, Inscription, Option } from "@/type"; // Importez tous les types nécessaires

/**
 * Récupère toutes les inscriptions de la base de données.
 * Inclut les informations détaillées de l'élève, de la classe (avec option) et de l'année scolaire.
 * @returns Une liste d'inscriptions avec les détails liés, ou une erreur.
 */
export async function getInscriptions(): Promise<{
  data?: (Inscription & {
    eleve?: Eleve;
    classe?: Classe & { option?: Option };
    anneescolaire?: Anneescolaire;
  })[];
  error?: string;
  success: boolean;
}> {
  try {
    const supabase = await createClient();
    // Sélectionne toutes les colonnes de 'inscription' et joint les tables liées
    const { data, error } = await supabase
      .from("inscription")
      .select("*, eleve(*), classe(*, option(*)), anneescolaire(*)")
      .order("dateinscription", { ascending: false }); // Tri par date d'inscription descendante

    if (error) {
      return {
        error:
          "Erreur lors de la récupération des inscriptions : " + error?.message,
        success: false,
      };
    }

    return {
      data: data as (Inscription & {
        eleve?: Eleve;
        classe?: Classe & { option?: Option };
        anneescolaire?: Anneescolaire;
      })[],
      success: true,
    };
  } catch (err) {
    return {
      error: "Exception lors de la récupération des inscriptions : " + err,
      success: false,
    };
  }
}

/**
 * Récupère une inscription spécifique par sa clé primaire composite.
 * @param ideleve L'ID de l'élève.
 * @param idclasse L'ID de la classe.
 * @param idanneescolaire L'ID de l'année scolaire.
 * @returns L'inscription trouvée avec les détails liés, ou une erreur.
 */
export async function getInscriptionById(
  ideleve: number,
  idclasse: number,
  idanneescolaire: number
): Promise<{
  data?: Inscription & {
    eleve?: Eleve;
    classe?: Classe & { option?: Option };
    anneescolaire?: Anneescolaire;
  };
  error?: string;
  success: boolean;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("inscription")
      .select("*, eleve(*), classe(*, option(*)), anneescolaire(*)")
      .eq("ideleve", ideleve)
      .eq("idclasse", idclasse)
      .eq("idanneescolaire", idanneescolaire)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return {
          error: "Inscription non trouvée.",
          success: false,
        };
      }
      return {
        error:
          "Erreur lors de la récupération de l'inscription : " + error?.message,
        success: false,
      };
    }

    return {
      data: data as Inscription & {
        eleve?: Eleve;
        classe?: Classe & { option?: Option };
        anneescolaire?: Anneescolaire;
      },
      success: true,
    };
  } catch (err) {
    return {
      error: "Exception lors de la récupération de l'inscription : " + err,
      success: false,
    };
  }
}

/**
 * Ajoute une nouvelle inscription à la base de données.
 * Étant donné une clé primaire composite, toutes les parties de la clé doivent être fournies.
 * 'dateinscription' est omise car elle est gérée par la base de données avec DEFAULT NOW().
 * @param newInscription Les données de la nouvelle inscription à ajouter (sans dateinscription).
 * @returns L'inscription ajoutée, ou une erreur.
 */
export async function addInscription(
  newInscription: Omit<Inscription, "dateinscription">
): Promise<{ data?: Inscription; error?: string; success: boolean }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("inscription") // Nom de la table dans Supabase
      .insert(newInscription)
      .select() // Retourne les données insérées
      .single(); // S'attend à un seul enregistrement retourné

    if (error) {
      return {
        error: "Erreur lors de l'ajout de l'inscription : " + error?.message,
        success: false,
      };
    }
    revalidate();
    return { data: data as Inscription, success: true };
  } catch (err) {
    return {
      error: "Exception lors de l'ajout de l'inscription : " + err,
      success: false,
    };
  }
}

/**
 * Met à jour une inscription existante dans la base de données.
 * Les champs de la clé primaire composite ne sont pas modifiables.
 * @param ideleve L'ID de l'élève (partie de la clé primaire composite).
 * @param idclasse L'ID de la classe (partie de la clé primaire composite).
 * @param idanneescolaire L'ID de l'année scolaire (partie de la clé primaire composite).
 * @param updatedFields Les champs à mettre à jour pour cette inscription.
 * @returns L'inscription mise à jour, ou une erreur.
 */
export async function updateInscription(
  ideleve: number,
  idclasse: number,
  idanneescolaire: number,
  updatedFields: Partial<
    Omit<
      Inscription,
      "ideleve" | "idclasse" | "idanneescolaire" | "dateinscription"
    >
  > // dateinscription n'est pas modifiable non plus
): Promise<{ data?: Inscription; error?: string; success: boolean }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("inscription")
      .update(updatedFields)
      .eq("ideleve", ideleve)
      .eq("idclasse", idclasse)
      .eq("idanneescolaire", idanneescolaire)
      .select()
      .single();

    if (error) {
      return {
        error:
          "Erreur lors de la mise à jour de l'inscription : " + error?.message,
        success: false,
      };
    }
    revalidate();
    return { data: data as Inscription, success: true };
  } catch (err) {
    return {
      error: "Exception lors de la mise à jour de l'inscription : " + err,
      success: false,
    };
  }
}

/**
 * Supprime une inscription de la base de données.
 * @param ideleve L'ID de l'élève (partie de la clé primaire composite).
 * @param idclasse L'ID de la classe (partie de la clé primaire composite).
 * @param idanneescolaire L'ID de l'année scolaire (partie de la clé primaire composite).
 * @returns Un succès (pas de données retournées), ou une erreur.
 */
export async function deleteInscription(
  ideleve: number,
  idclasse: number,
  idanneescolaire: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("inscription")
      .delete()
      .eq("ideleve", ideleve)
      .eq("idclasse", idclasse)
      .eq("idanneescolaire", idanneescolaire);

    if (error) {
      return {
        success: false,
        error:
          "Erreur lors de la suppression de l'inscription : " + error?.message,
      };
    }
    revalidate();
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: "Exception lors de la suppression de l'inscription : " + err,
    };
  }
}
// actions/inscription.ts (Ajoutez ceci à la fin du fichier)

/**
 * Récupère les inscriptions récentes.
 * @param limit Le nombre maximum d'inscriptions à récupérer.
 * @returns Une liste d'inscriptions récentes avec les détails liés.
 */
export async function getRecentInscriptions(limit: number = 5): Promise<{
  data?: (Inscription & {
    eleve?: Eleve;
    classe?: Classe & { option?: Option };
    anneescolaire?: Anneescolaire;
  })[];
  error?: string;
  success: boolean;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("inscription")
      .select(
        "*, eleve(nom, prenom, postnom, photo), classe(nomclasse, niveau, option(abreviation)), anneescolaire(libelle)"
      )
      .order("dateinscription", { ascending: false })
      .limit(limit);

    if (error) {
      return {
        error:
          "Erreur lors de la récupération des inscriptions récentes : " +
          error?.message,
        success: false,
      };
    }

    return {
      data: data as (Inscription & {
        eleve?: Eleve;
        classe?: Classe & { option?: Option };
        anneescolaire?: Anneescolaire;
      })[],
      success: true,
    };
  } catch (err) {
    return {
      error:
        "Exception lors de la récupération des inscriptions récentes : " + err,
      success: false,
    };
  }
}
