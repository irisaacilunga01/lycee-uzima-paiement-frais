"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // Pour le champ status
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eleve, Parent } from "@/type"; // Importez Eleve et Parent
import { IconPencil, IconPlus } from "@tabler/icons-react";
import { Loader2Icon } from "lucide-react";
import { addEleve, updateEleve } from "../app/actions/eleves"; // Utilisez le nouveau fichier d'actions

// Schéma de validation pour les données de l'élève
const eleveFormSchema = z.object({
  nom: z.string().min(2, {
    message: "Le nom est requis et doit contenir au moins 2 caractères.",
  }),
  postnom: z.string().min(2, {
    message: "Le postnom est requis et doit contenir au moins 2 caractères.",
  }),
  prenom: z.string().optional().nullable(),
  datenaissance: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "La date de naissance doit être au format YYYY-MM-DD."
    )
    .optional()
    .or(z.literal("")),
  lieunaissance: z.string().optional().nullable(),
  adresse: z.string().optional().nullable(),
  moyentransport: z.string().optional().nullable(),
  status: z.enum(["en cours", "terminé", "suspendu", "renvoyé"], {
    required_error: "Le statut est requis.",
  }),
  idparent: z.preprocess(
    // Pré-processus pour convertir la chaîne vide/null_parent_id en null
    (val) => {
      if (
        val === null ||
        val === undefined ||
        val === "" ||
        val === "null_parent_id"
      ) {
        return null;
      }
      return Number(val);
    },
    z.number().nullable().optional() // idparent peut être un nombre ou null
  ),
  photoFile: z.instanceof(File).optional(), // Pour le nouvel upload de fichier
  deleteExistingPhoto: z.boolean().optional(), // Pour indiquer si la photo existante doit être supprimée
});

type EleveFormValues = z.infer<typeof eleveFormSchema>;

interface EleveFormProps {
  initialData?: Eleve; // Pour l'édition, contient les données existantes
  parents: Parent[]; // Liste des parents pour le sélecteur
}

export function EleveForm({ initialData, parents }: EleveFormProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    initialData?.photo || null
  );

  const form = useForm<EleveFormValues>({
    resolver: zodResolver(eleveFormSchema),
    defaultValues: {
      nom: initialData?.nom || "",
      postnom: initialData?.postnom || "",
      prenom: initialData?.prenom || "",
      datenaissance: initialData?.datenaissance || "",
      lieunaissance: initialData?.lieunaissance || "",
      adresse: initialData?.adresse || "",
      moyentransport: initialData?.moyentransport || "",
      status: initialData?.status || "en cours",
      idparent:
        initialData?.idparent !== undefined && initialData.idparent !== null
          ? String(initialData.idparent)
          : "null_parent_id", // Utilisez notre marqueur pour null
      photoFile: undefined, // Initialisé à undefined
      deleteExistingPhoto: false, // Par défaut, ne pas supprimer la photo
    },
  });

  // Gérer la prévisualisation de l'image
  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("photoFile", file); // Mettre à jour le champ photoFile dans le formulaire
      setPhotoPreview(URL.createObjectURL(file));
      form.setValue("deleteExistingPhoto", false); // Désélectionner si un nouveau fichier est sélectionné
    } else {
      form.setValue("photoFile", undefined);
      // Ne pas effacer la prévisualisation si l'utilisateur annule, car il peut y avoir une photo existante
      // Si l'utilisateur clique sur "supprimer", la prévisualisation sera gérée par ce champ
    }
  };

  const handleDeletePhotoCheckboxChange = (checked: boolean) => {
    form.setValue("deleteExistingPhoto", checked);
    if (checked) {
      setPhotoPreview(null); // Effacer la prévisualisation si l'utilisateur veut supprimer
      form.setValue("photoFile", undefined); // Assurez-vous qu'aucun nouveau fichier n'est en attente
    } else {
      // Si la case est décochée, restaurer la prévisualisation si initialData a une photo
      setPhotoPreview(initialData?.photo || null);
    }
  };

  async function onSubmit(values: EleveFormValues) {
    setLoading(true);
    try {
      let result;
      const { photoFile, deleteExistingPhoto, ...dataToSave } = values; // Sépare photoFile et deleteExistingPhoto

      // Supprime les champs optionnels vides avant d'envoyer à Supabase
      Object.keys(dataToSave).forEach((key) => {
        if (dataToSave[key as keyof typeof dataToSave] === "") {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (dataToSave as any)[key] = null;
        }
      });
      // Spécifiquement pour idparent qui vient de Zod comme number | null
      if (dataToSave.idparent === "null_parent_id") {
        dataToSave.idparent = null;
      }
      if (dataToSave.datenaissance === "") {
        dataToSave.datenaissance = null;
      }

      if (initialData) {
        // Mode édition
        result = await updateEleve(
          initialData.ideleve,
          dataToSave as Partial<Omit<Eleve, "ideleve" | "photo">>,
          photoFile,
          deleteExistingPhoto
        );
      } else {
        // Mode ajout
        result = await addEleve(
          dataToSave as Omit<Eleve, "ideleve" | "photo">,
          photoFile
        );
      }

      if (result.success) {
        toast.success(`Succès ${initialData ? "de mise à jour" : "d'ajout"}`, {
          description: initialData
            ? "Élève mis à jour avec succès !"
            : "Élève ajouté avec succès !",
        });

        router.push("/dashboard/eleves"); // Redirige vers la liste des élèves après succès
        router.refresh(); // Rafraîchit les données
      } else {
        setLoading(false);
        toast.error(`Erreur ${initialData ? "de mise à jour" : "d'ajout"}`, {
          description: result.error || "Une erreur est survenue.",
        });
      }
    } catch (error) {
      toast.error("Erreur opération !!!", {
        description: "Erreur inattendue lors de l'opération. & " + error,
      });
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4 grid-cols-1 md:grid-cols-2"
      >
        <FormField
          control={form.control}
          name="nom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Nom de l'élève" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="postnom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postnom</FormLabel>
              <FormControl>
                <Input placeholder="Postnom de l'élève" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="prenom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom (Optionnel)</FormLabel>
              <FormControl>
                <Input placeholder="Prénom de l'élève" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="datenaissance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de Naissance (Optionnel)</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lieunaissance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lieu de Naissance (Optionnel)</FormLabel>
              <FormControl>
                <Input placeholder="Lieu de naissance" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="adresse"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse (Optionnel)</FormLabel>
              <FormControl>
                <Input placeholder="Adresse de l'élève" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="moyentransport"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Moyen de Transport (Optionnel)</FormLabel>
              <FormControl>
                <Input placeholder="Moyen de transport" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Statut</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez un statut" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="en cours">En cours</SelectItem>
                  <SelectItem value="terminé">Terminé</SelectItem>
                  <SelectItem value="suspendu">Suspendu</SelectItem>
                  <SelectItem value="renvoyé">Renvoyé</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="idparent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent (Optionnel)</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={
                  field.value !== null && field.value !== undefined
                    ? String(field.value)
                    : "null_parent_id"
                }
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez un parent" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="null_parent_id">
                    Aucun parent spécifique
                  </SelectItem>
                  {parents.map((parent) => (
                    <SelectItem
                      key={parent.idparent}
                      value={String(parent.idparent)}
                    >
                      {parent.nompere} {parent.nommere}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Champ d'upload de photo */}
        <FormItem>
          <FormLabel>Photo (Optionnel)</FormLabel>
          <FormControl>
            <Input type="file" accept="image/*" onChange={handlePhotoChange} />
          </FormControl>
          <FormMessage />
        </FormItem>

        {photoPreview && (
          <div className="relative w-32 h-32 rounded-md overflow-hidden">
            <Image
              src={photoPreview}
              alt="Prévisualisation de la photo"
              fill
              style={{ objectFit: "cover" }}
              className="rounded-md"
              priority // Pour optimiser le chargement de l'image de prévisualisation
            />
          </div>
        )}

        {/* Option pour supprimer la photo existante (uniquement en mode édition) */}
        {initialData?.photo && !form.getValues("photoFile") && (
          <FormField
            control={form.control}
            name="deleteExistingPhoto"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={handleDeletePhotoCheckboxChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Supprimer la photo existante</FormLabel>
                  <FormDescription>
                    Cochez cette case pour supprimer la photo actuelle.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        )}

        <div className="md:col-span-2 flex justify-end">
          {loading ? (
            <Button size="sm" className="w-40 " disabled>
              <Loader2Icon className="animate-spin mr-2" />
              {!initialData ? "Ajout..." : "Modification..."}
            </Button>
          ) : (
            <Button type="submit" className="w-40 ">
              {initialData ? "Mettre à jour" : "Ajouter"}
              {initialData ? <IconPencil /> : <IconPlus />}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
