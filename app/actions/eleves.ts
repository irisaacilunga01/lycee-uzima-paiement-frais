// actions/eleve.ts
"use server"; // Indique que ce fichier contient des Server Actions ou des Server Components

import { revalidate } from "@/lib/nextjs/revalidaPath";
import { createClient } from "@/lib/supabase/server";
import { Classe, Eleve, Option } from "@/type"; // Assurez-vous que Eleve et Parent sont importés
import { Buffer } from "buffer"; // Import de Buffer pour la gestion des fichiers
import { v2 as cloudinary } from "cloudinary"; // Importe le SDK Cloudinary

// Configure Cloudinary avec vos identifiants
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Utiliser HTTPS
});

/**
 * Fonction utilitaire pour supprimer une image de Cloudinary.
 * @param publicId L'ID public de l'image sur Cloudinary.
 */
async function deleteImageFromCloudinary(publicId: string): Promise<void> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== "ok" && result.result !== "not found") {
      throw new Error(
        `Cloudinary n'a pas pu supprimer l'image: ${result.result}`
      );
    }
  } catch (err) {
    console.error("Erreur lors de la suppression d'image sur Cloudinary:", err);
    throw err; // Propage l'erreur
  }
}

/**
 * Extrait l'ID public d'une URL Cloudinary.
 * @param url L'URL complète de l'image Cloudinary.
 * @returns L'ID public de l'image.
 */
function extractPublicIdFromCloudinaryUrl(url: string): string | null {
  // Regex pour capturer l'ID public (y compris les dossiers)
  const regex = /\/v\d+\/(.+?)\.\w{3,4}$/;
  const match = url.match(regex);
  if (match && match[1]) {
    // S'assurer de ne pas inclure "image/upload/" ou "video/upload/" au début
    const parts = match[1].split("/");
    // Chercher la partie après les transformations et 'v'
    const startIndex = parts.findIndex((part) => part.match(/^v\d+$/));
    if (startIndex !== -1 && startIndex + 1 < parts.length) {
      return parts.slice(startIndex + 1).join("/");
    }
    return match[1]; // Retourne juste le match si la structure est simple
  }
  return null; // Retourne null si l'ID public n'est pas trouvé
}

/**
 * Récupère tous les élèves de la base de données.
 * Inclut les informations du parent pour l'affichage.
 * @returns Une liste d'élèves avec le nom du parent, ou une erreur.
 */
export async function getEleves(): Promise<{
  data?: (Eleve & { parent_name?: string })[];
  error?: string;
  success: boolean;
}> {
  try {
    const supabase = await createClient();
    // Sélectionne toutes les colonnes de 'eleve' et les noms du père et de la mère de la table 'parent'
    const { data, error } = await supabase
      .from("eleve")
      .select("*, parent(nompere, nommere)")
      .order("nom", { ascending: true }); // Tri par nom

    if (error) {
      return {
        error: "Erreur lors de la récupération des élèves : " + error?.message,
        success: false,
      };
    }

    // Mappe les données pour inclure un champ 'parent_name' pour l'affichage
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const elevesWithParentName = data.map((eleve: any) => ({
      ...eleve,
      parent_name:
        eleve.idparent && eleve.parent
          ? `${eleve.parent.nompere || ""} & ${
              eleve.parent.nommere || ""
            }`.trim()
          : "N/A",
    }));

    return { data: elevesWithParentName, success: true };
  } catch (err) {
    return {
      error: "Exception lors de la récupération des élèves : " + err,
      success: false,
    };
  }
}

/**
 * Récupère un élève spécifique par son ID.
 * @param ideleve L'ID de l'élève à récupérer.
 * @returns L'élève trouvé, ou une erreur.
 */
export async function getEleveById(
  ideleve: number
): Promise<{ data?: Eleve; error?: string; success: boolean }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("eleve")
      .select("*")
      .eq("ideleve", ideleve)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return {
          error: "Élève non trouvé.",
          success: false,
        };
      }
      return {
        error: "Erreur lors de la récupération de l'élève : " + error?.message,
        success: false,
      };
    }

    return { data: data as Eleve, success: true };
  } catch (err) {
    return {
      error: "Exception lors de la récupération de l'élève : " + err,
      success: false,
    };
  }
}

/**
 * Ajoute un nouvel élève à la base de données et gère l'upload de la photo vers Cloudinary.
 * @param newEleveData Les données du nouvel élève (sans l'ideleve et la photo).
 * @param photoFile Optionnel: Le fichier image à uploader.
 * @returns L'élève ajouté avec son id et l'URL de la photo, ou une erreur.
 */
export async function addEleve(
  newEleveData: Omit<Eleve, "ideleve" | "photo">,
  photoFile?: File
): Promise<{ data?: Eleve; error?: string; success: boolean }> {
  let photoUrl: string | null = null;
  let publicId: string | null = null; // Pour stocker l'ID public de Cloudinary

  if (photoFile) {
    try {
      // Convertit le fichier en buffer pour l'upload vers Cloudinary
      const arrayBuffer = await photoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload l'image vers Cloudinary
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const uploadResult = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "eleves", // Dossier dans Cloudinary où stocker les images
              resource_type: "image",
            },
            (error, result) => {
              if (error) reject(error);
              resolve(result);
            }
          )
          .end(buffer);
      });

      if (uploadResult && uploadResult.secure_url) {
        photoUrl = uploadResult.secure_url;
        publicId = uploadResult.public_id;
      } else {
        throw new Error("Cloudinary n'a pas retourné d'URL sécurisée.");
      }
    } catch (uploadError) {
      console.error(
        "Erreur lors de l'upload de la photo vers Cloudinary:",
        uploadError
      );
      return {
        error: `Échec de l'upload de la photo: ${
          uploadError instanceof Error
            ? uploadError.message
            : String(uploadError)
        }`,
        success: false,
      };
    }
  }

  try {
    // Insère les données de l'élève dans Supabase, y compris l'URL de la photo
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("eleve")
      .insert({ ...newEleveData, photo: photoUrl }) // photoUrl est maintenant l'URL Cloudinary
      .select()
      .single();

    if (error) {
      // Si l'insertion échoue après un upload réussi, tente de supprimer l'image de Cloudinary
      if (publicId) {
        await deleteImageFromCloudinary(publicId);
      }
      return {
        error:
          "Erreur lors de l'ajout de l'élève dans la BD : " + error?.message, // Ajout .message
        success: false,
      };
    }
    revalidate();
    return { data: data as Eleve, success: true };
  } catch (err) {
    return {
      error: "Exception lors de l'ajout de l'élève : " + err,
      success: false,
    };
  }
}

/**
 * Met à jour un élève existant et gère le remplacement/suppression de la photo sur Cloudinary.
 * @param ideleve L'ID de l'élève à mettre à jour.
 * @param updatedFields Les champs à mettre à jour pour cet élève (sans 'photo' si un nouveau fichier est fourni).
 * @param newPhotoFile Optionnel: Le nouveau fichier image à uploader (remplacera l'ancienne photo).
 * @param deleteExistingPhoto Indique si la photo existante doit être supprimée sans en ajouter une nouvelle.
 * @returns L'élève mis à jour, ou une erreur.
 */
export async function updateEleve(
  ideleve: number,
  updatedFields: Partial<Omit<Eleve, "ideleve" | "photo">>,
  newPhotoFile?: File,
  deleteExistingPhoto: boolean = false
): Promise<{ data?: Eleve; error?: string; success: boolean }> {
  let photoUrlUpdate: string | null | undefined = undefined; // undefined: pas de changement, null: supprimer la photo
  let newPublicId: string | null = null;
  const supabase = await createClient();

  // Récupère l'élève existant pour connaître l'ancienne URL de photo
  const { data: existingEleve, error: fetchError } = await supabase
    .from("eleve")
    .select("photo")
    .eq("ideleve", ideleve)
    .single();

  if (fetchError || !existingEleve) {
    console.error(
      "Erreur lors de la récupération de l'élève existant:",
      fetchError
    );
    return {
      error: "Élève non trouvé ou erreur de récupération.",
      success: false,
    };
  }

  const oldPhotoUrl = existingEleve.photo;
  const oldPublicId = oldPhotoUrl
    ? extractPublicIdFromCloudinaryUrl(oldPhotoUrl)
    : null;

  if (newPhotoFile) {
    // Upload de la nouvelle photo vers Cloudinary
    try {
      const arrayBuffer = await newPhotoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const uploadResult = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "eleves",
              resource_type: "image",
            },
            (error, result) => {
              if (error) reject(error);
              resolve(result);
            }
          )
          .end(buffer);
      });

      if (uploadResult && uploadResult.secure_url) {
        photoUrlUpdate = uploadResult.secure_url;
        newPublicId = uploadResult.public_id;

        // Supprime l'ancienne photo de Cloudinary si elle existe
        if (oldPublicId) {
          await deleteImageFromCloudinary(oldPublicId);
        }
      } else {
        throw new Error(
          "Cloudinary n'a pas retourné d'URL sécurisée pour la nouvelle photo."
        );
      }
    } catch (uploadError) {
      console.error(
        "Erreur lors de l'upload de la nouvelle photo:",
        uploadError
      );
      return {
        error: `Échec de l'upload de la nouvelle photo: ${
          uploadError instanceof Error
            ? uploadError.message
            : String(uploadError)
        }`,
        success: false,
      };
    }
  } else if (deleteExistingPhoto) {
    // `oldPublicId` check is implicit if `oldPhotoUrl` was used to derive it.
    // Demande de suppression de la photo existante sans remplacement
    if (oldPublicId) {
      try {
        await deleteImageFromCloudinary(oldPublicId);
        photoUrlUpdate = null; // Définir le champ photo à NULL dans la BD
      } catch (deleteError) {
        return {
          error: `Échec de la suppression de la photo existante: ${
            deleteError instanceof Error
              ? deleteError.message
              : String(deleteError)
          }`,
          success: false,
        };
      }
    } else {
      // If deleteExistingPhoto is true but no oldPublicId, simply set photoUrlUpdate to null
      // This covers cases where photo was initially null in DB but checkbox was ticked
      photoUrlUpdate = null;
    }
  }

  // Crée l'objet de mise à jour final pour Supabase
  const fieldsToUpdate: Partial<Eleve> = { ...updatedFields };
  if (photoUrlUpdate !== undefined) {
    // Seulement si la photo a été modifiée ou supprimée (null)
    fieldsToUpdate.photo = photoUrlUpdate!;
  }

  try {
    const { data, error } = await supabase
      .from("eleve")
      .update(fieldsToUpdate)
      .eq("ideleve", ideleve)
      .select()
      .single();

    if (error) {
      // Si la mise à jour échoue et une nouvelle photo a été uploadée, tente de la supprimer de Cloudinary
      if (newPhotoFile && newPublicId) {
        await deleteImageFromCloudinary(newPublicId);
      }
      return {
        error:
          "Erreur lors de la mise à jour de l'élève dans la BD : " +
          error?.message, // Ajout .message
        success: false,
      };
    }
    revalidate();
    return { data: data as Eleve, success: true };
  } catch (err) {
    return {
      error: "Exception lors de la mise à jour de l'élève : " + err,
      success: false,
    };
  }
}

/**
 * Supprime un élève de la base de données et sa photo associée sur Cloudinary.
 * @param ideleve L'ID de l'élève à supprimer.
 * @returns Un succès (pas de données retournées), ou une erreur.
 */
export async function deleteEleve(
  ideleve: number
): Promise<{ error?: string; success: boolean }> {
  let publicIdToDelete: string | null = null;

  // Récupère d'abord l'URL de la photo de l'élève
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("eleve")
      .select("photo")
      .eq("ideleve", ideleve)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error(
        "Erreur lors de la récupération de la photo de l'élève pour suppression:",
        error
      );
    } else if (data && data.photo) {
      publicIdToDelete = extractPublicIdFromCloudinaryUrl(data.photo);
    }
  } catch (err) {
    console.error(
      "Exception lors de la récupération de la photo de l'élève:",
      err
    );
  }

  try {
    // Supprime l'enregistrement de l'élève dans la base de données
    const { error } = await supabase
      .from("eleve")
      .delete()
      .eq("ideleve", ideleve);

    if (error) {
      return {
        success: false,
        error:
          "Erreur lors de la suppression de l'élève dans la BD : " +
          error?.message, // Ajout .message
      };
    }

    // Supprime la photo de Cloudinary après la suppression réussie de l'enregistrement
    if (publicIdToDelete) {
      try {
        await deleteImageFromCloudinary(publicIdToDelete);
      } catch (photoDeleteError) {
        console.warn(
          `Avertissement: La photo avec Public ID ${publicIdToDelete} n'a pas pu être supprimée de Cloudinary après la suppression de l'élève:`,
          photoDeleteError
        );
      }
    }
    revalidate();
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: "Exception lors de la suppression de l'élève : " + err,
    };
  }
}

/**
 * Récupère le nombre total d'élèves.
 * @returns Le nombre total d'élèves.
 */
export async function getTotalEleves(): Promise<{
  count?: number;
  error?: string;
  success: boolean;
}> {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("eleve")
      .select("*", { count: "exact", head: true });

    if (error) {
      return {
        error: "Erreur lors du comptage des élèves : " + error?.message,
        success: false,
      };
    }

    return { count: count || 0, success: true };
  } catch (err) {
    return {
      error: "Exception lors du comptage des élèves : " + err,
      success: false,
    };
  }
}

/**
 * Récupère les élèves d'un parent spécifique, incluant leurs informations de classe et d'option.
 * La jointure est effectuée via la table 'inscription' car 'eleve' n'a pas de lien direct 'idclasse'.
 * Pour l'instant, si un élève a plusieurs inscriptions, seule la première est utilisée pour récupérer la classe.
 * @param idparent L'ID du parent.
 * @returns Une liste des élèves associés à ce parent, avec les détails de classe et d'option "aplatis".
 */
export async function getElevesByParentId(idparent: number): Promise<{
  data?: (Eleve & { classe?: Classe & { option?: Option } })[];
  error?: string;
  success: boolean;
}> {
  try {
    const supabase = await createClient();
    // Exécute la requête pour récupérer les élèves et joindre via 'inscription'
    const { data, error } = await supabase
      .from("eleve")
      // S'assure de joindre la table 'inscription' puis 'classe' et 'option'
      .select(
        "*, inscription(idclasse, classe(nomclasse, niveau, option(nomoption, abreviation)))"
      )
      .eq("idparent", idparent) // Filtre par l'ID du parent
      .order("nom", { ascending: true }); // Trie par nom

    if (error) {
      console.error(
        "Erreur Supabase lors de la récupération des élèves du parent:",
        error
      );
      return {
        error:
          "Erreur lors de la récupération des élèves du parent : " +
          error?.message,
        success: false,
      };
    }

    // Traitement post-requête pour "aplatir" les données d'inscription/classe
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const processedData = data?.map((eleve: any) => {
      // Récupère la classe de la première inscription trouvée (ou null si aucune inscription)
      const classDetails =
        eleve.inscription && eleve.inscription.length > 0
          ? eleve.inscription[0].classe
          : null;

      return {
        ...eleve,
        datenaissance: eleve.datenaissance
          ? new Date(eleve.datenaissance).toISOString()
          : null,
        // Remplace l'array 'inscription' par l'objet 'classe' directement
        classe: classDetails,
        // Supprime la propriété 'inscription' de l'objet racine si elle n'est plus nécessaire
        inscription: undefined,
      };
    });
    return {
      data: processedData as (Eleve & {
        classe?: Classe & { option?: Option };
      })[],
      success: true,
    };
  } catch (err) {
    console.error(
      "Exception lors de la récupération des élèves du parent:",
      err
    );
    return {
      error:
        "Exception lors de la récupération des élèves du parent : " +
        String(err),
      success: false,
    };
  }
}
