// actions/paiement.ts
"use server"; // Indique que ce fichier contient des Server Actions ou des Server Components

import { revalidate } from "@/lib/nextjs/revalidaPath";
import { createClient } from "@/lib/supabase/server";
import { Eleve, Frais, Paiement } from "@/type"; // Importez tous les types nécessaires

/**
 * Récupère tous les paiements de la base de données.
 * Inclut les informations détaillées de l'élève et des frais associés.
 * @returns Une liste de paiements avec les détails liés, ou une erreur.
 */
export async function getPaiements(): Promise<{
  data?: (Paiement & { eleve?: Eleve; frais?: Frais })[];
  error?: string;
  success: boolean;
}> {
  try {
    const supabase = await createClient();
    // Sélectionne toutes les colonnes de 'paiement' et joint les tables 'eleve' et 'frais'
    const { data, error } = await supabase
      .from("paiement")
      .select("*, eleve(*), frais(*)")
      .order("datepaiement", { ascending: false }); // Tri par date de paiement descendante

    if (error) {
      return {
        error:
          "Erreur lors de la récupération des paiements : " + error?.message,
        success: false,
      };
    }

    return {
      data: data as (Paiement & { eleve?: Eleve; frais?: Frais })[],
      success: true,
    };
  } catch (err) {
    return {
      error: "Exception lors de la récupération des paiements : " + err,
      success: false,
    };
  }
}

/**
 * Récupère un paiement spécifique par son ID.
 * Inclut les informations de l'élève et des frais associés.
 * @param idpaiement L'ID du paiement à récupérer.
 * @returns Le paiement trouvé avec les détails liés, ou une erreur.
 */
export async function getPaiementById(idpaiement: number): Promise<{
  data?: Paiement & { eleve?: Eleve; frais?: Frais };
  error?: string;
  success: boolean;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("paiement")
      .select("*, eleve(*), frais(*)")
      .eq("idpaiement", idpaiement)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return {
          error: "Paiement non trouvé.",
          success: false,
        };
      }
      return {
        error: "Erreur lors de la récupération du paiement : " + error?.message,
        success: false,
      };
    }

    return {
      data: data as Paiement & { eleve?: Eleve; frais?: Frais },
      success: true,
    };
  } catch (err) {
    return {
      error: "Exception lors de la récupération du paiement : " + err,
      success: false,
    };
  }
}

/**
 * Ajoute un nouveau paiement à la base de données.
 * 'datepaiement' est omise car elle est gérée par la base de données avec DEFAULT NOW().
 * 'status' a une valeur par défaut 'pending' dans la DB.
 * @param newPaiement Les données du nouveau paiement à ajouter (sans l'idpaiement et datepaiement).
 * @returns Le paiement ajouté avec son id, ou une erreur.
 */
export async function addPaiement(
  newPaiement: Omit<Paiement, "idpaiement" | "datepaiement"> // Omet datepaiement car il est géré par la DB
): Promise<{ data?: Paiement; error?: string; success: boolean }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("paiement") // Nom de la table dans Supabase
      .insert(newPaiement)
      .select() // Retourne les données insérées, y compris l'id généré
      .single(); // S'attend à un seul enregistrement retourné

    if (error) {
      return {
        error: "Erreur lors de l'ajout du paiement : " + error?.message,
        success: false,
      };
    }
  revalidate();
    return { data: data as Paiement, success: true };
  } catch (err) {
    return {
      error: "Exception lors de l'ajout du paiement : " + err,
      success: false,
    };
  }
}

/**
 * Met à jour un paiement existant dans la base de données.
 * @param idpaiement L'ID du paiement à mettre à jour.
 * @param updatedFields Les champs à mettre à jour pour ce paiement (sans 'idpaiement' et 'datepaiement').
 * @returns Le paiement mis à jour, ou une erreur.
 */
export async function updatePaiement(
  idpaiement: number,
  updatedFields: Partial<Omit<Paiement, "idpaiement" | "datepaiement">> // Omet datepaiement, car il est géré par la DB
): Promise<{ data?: Paiement; error?: string; success: boolean }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("paiement")
      .update(updatedFields)
      .eq("idpaiement", idpaiement) // Condition de mise à jour basée sur l'ID
      .select()
      .single();

    if (error) {
      return {
        error: "Erreur lors de la mise à jour du paiement : " + error?.message, // Accès au message d'erreur
        success: false,
      };
    }
  revalidate();
    return { data: data as Paiement, success: true };
  } catch (err) {
    return {
      error: "Exception lors de la mise à jour du paiement : " + err,
      success: false,
    };
  }
}

/**
 * Supprime un paiement de la base de données.
 * @param idpaiement L'ID du paiement à supprimer.
 * @returns Un succès (pas de données retournées), ou une erreur.
 */
export async function deletePaiement(
  idpaiement: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("paiement")
      .delete()
      .eq("idpaiement", idpaiement); // Condition de suppression basée sur l'ID

    if (error) {
      return {
        success: false,
        error: "Erreur lors de la suppression du paiement : " + error?.message, // Accès au message d'erreur
      };
    }
  revalidate();
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: "Exception lors de la suppression du paiement : " + err,
    };
  }
}
// actions/paiement.ts (Ajoutez ceci à la fin du fichier)

/**
 * Récupère le montant total de tous les paiements.
 * @returns Le montant total des paiements.
 */
export async function getTotalMontantPaiements(): Promise<{
  total?: number;
  error?: string;
  success: boolean;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("paiement")
      .select("montantpayer");

    if (error) {
      return {
        error:
          "Erreur lors de la récupération des montants de paiement : " +
          error?.message,
        success: false,
      };
    }

    const total = data.reduce((sum, item) => sum + item.montantpayer, 0);
    return { total: total, success: true };
  } catch (err) {
    return {
      error: "Exception lors du calcul du montant total des paiements : " + err,
      success: false,
    };
  }
}

/**
 * Récupère le nombre de paiements avec le statut 'pending'.
 * @returns Le nombre de paiements en attente.
 */
export async function getPendingPaiementsCount(): Promise<{
  count?: number;
  error?: string;
  success: boolean;
}> {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("paiement")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    if (error) {
      return {
        error:
          "Erreur lors du comptage des paiements en attente : " +
          error?.message,
        success: false,
      };
    }

    return { count: count || 0, success: true };
  } catch (err) {
    return {
      error: "Exception lors du comptage des paiements en attente : " + err,
      success: false,
    };
  }
}

/**
 * Récupère le total des paiements par mois pour une période donnée.
 * @param startDate La date de début pour la période (format 'YYYY-MM-DD').
 * @param endDate La date de fin pour la période (format 'YYYY-MM-DD').
 * @returns Un tableau d'objets { month: string (YYYY-MM), total_amount: number }.
 */
export async function getMonthlyPaiements(
  startDate: string,
  endDate: string
): Promise<{
  data?: { month: string; total_amount: number }[];
  error?: string;
  success: boolean;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_monthly_payments", {
      // Appelle la fonction SQL RPC
      start_date_param: startDate,
      end_date_param: endDate,
    });

    if (error) {
      // Vérifier si la fonction RPC n'existe pas et donner une instruction
      if (error.code === "42883") {
        // Code d'erreur courant pour "fonction n'existe pas"
        return {
          error:
            "La fonction SQL 'get_monthly_payments' n'existe pas. Veuillez la créer dans Supabase: " +
            error.message,
          success: false,
        };
      }
      return {
        error:
          "Erreur lors de la récupération des paiements mensuels : " +
          error?.message,
        success: false,
      };
    }

    return {
      data: data as { month: string; total_amount: number }[],
      success: true,
    };
  } catch (err) {
    return {
      error:
        "Exception lors de la récupération des paiements mensuels : " + err,
      success: false,
    };
  }
}

/**
 * Récupère les paiements effectués pour les enfants d'un parent spécifique.
 * Cette fonction joint les tables 'eleve' et 'frais' pour obtenir des détails enrichis.
 * Elle filtre les paiements en fonction de l'ID du parent associé à l'élève.
 *
 * @param idparent L'ID du parent pour lequel récupérer les paiements de ses enfants.
 * @returns Une liste de paiements avec les détails de l'élève et des frais associés, ou une erreur.
 */
export async function getPaiementsForParentChildren(idparent: number): Promise<{
  data?: (Paiement & { eleve: Eleve; frais: Frais })[];
  error?: string;
  success: boolean;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("paiement")
      .select(
        "*, eleve(nom, prenom, postnom, idparent,photo), frais(description)"
      )
      .eq("eleve.idparent", idparent)
      .order("datepaiement", { ascending: false });

    if (error) {
      console.error(
        "Erreur Supabase lors de la récupération des paiements pour les enfants du parent:",
        error
      );
      return {
        error:
          "Erreur lors de la récupération des paiements pour les enfants du parent : " +
          error?.message,
        success: false,
      };
    }

    // Convertir les objets Date en chaînes ISO pour la sérialisation
    // C'est la correction clé pour l'erreur "Only plain objects..."
    const serializableData = data?.map((item) => ({
      ...item,
      datepaiement: item.datepaiement
        ? new Date(item.datepaiement).toISOString()
        : null,
    }));

    return {
      data: serializableData as (Paiement & { eleve: Eleve; frais: Frais })[],
      success: true,
    };
  } catch (err) {
    console.error(
      "Exception lors de la récupération des paiements pour les enfants du parent:",
      err
    );
    return {
      error:
        "Exception lors de la récupération des paiements pour les enfants du parent : " +
        String(err),
      success: false,
    };
  }
}
