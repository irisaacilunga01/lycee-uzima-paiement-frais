// components/inscription-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { addInscription, updateInscription } from "@/app/actions/inscriptions"; // Actions spécifiques à l'inscription
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Anneescolaire, Classe, Eleve, Inscription, Option } from "@/type"; // Importez tous les types
import { IconPencil, IconPlus } from "@tabler/icons-react";
import { Loader2Icon } from "lucide-react";
import React from "react";

// Schéma de validation pour les données de l'inscription
const inscriptionFormSchema = z.object({
  ideleve: z.coerce.number({
    required_error: "L'élève est requis.",
  }),

  idclasse: z.coerce.number({
    required_error: "La classe est requise.",
  }),

  idanneescolaire: z.coerce.number({
    required_error: "L'année scolaire est requise.",
  }),

  // dateinscription n'est pas un champ de formulaire car il est DEFAULT NOW()
});

type InscriptionFormValues = z.infer<typeof inscriptionFormSchema>;

interface InscriptionFormProps {
  initialData?: Inscription; // Pour l'édition, contient les données existantes
  eleves: Eleve[]; // Liste des élèves
  classes: (Classe & { option?: Option })[]; // Liste des classes
  anneescolaires: Anneescolaire[]; // Liste des années scolaires
}

export function InscriptionForm({
  initialData,
  eleves,
  classes,
  anneescolaires,
}: InscriptionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<InscriptionFormValues>({
    resolver: zodResolver(inscriptionFormSchema),
    defaultValues: {
      ideleve: initialData?.ideleve || undefined,
      idclasse: initialData?.idclasse || undefined,
      idanneescolaire: initialData?.idanneescolaire || undefined,
    },
  });

  async function onSubmit(values: InscriptionFormValues) {
    setLoading(true);
    try {
      let result;
      // Les IDs sont déjà des nombres grâce à preprocess

      if (initialData) {
        // Mode édition (pas de champs modifiables pour l'instant, mais la fonction d'action est là)
        // Note: Si vous ajoutez des champs non clés à Inscription plus tard, ils iront ici.
        result = await updateInscription(
          initialData.ideleve,
          initialData.idclasse,
          initialData.idanneescolaire,
          {} // Aucun champ mis à jour pour l'instant
        );
      } else {
        // Mode ajout
        result = await addInscription(
          values as Omit<Inscription, "dateinscription">
        );
      }

      if (result.success) {
        toast.success(`Succès ${initialData ? "de mise à jour" : "d'ajout"}`, {
          description: initialData
            ? "Inscription mise à jour avec succès !"
            : "Inscription ajoutée avec succès !",
        });

        router.push("/dashboard/inscriptions"); // Redirige vers la liste des inscriptions après succès
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
          name="ideleve"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Élève</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value ? String(field.value) : ""}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez un élève" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {eleves.map((eleve) => (
                    <SelectItem
                      key={eleve.ideleve}
                      value={String(eleve.ideleve)}
                    >
                      {eleve.nom} {eleve.postnom} {eleve.prenom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="idclasse"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Classe</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value ? String(field.value) : ""}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez une classe" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {classes.map((classe) => (
                    <SelectItem
                      key={classe.idclasse}
                      value={String(classe.idclasse)}
                    >
                      {classe.nomclasse}{" "}
                      {classe.niveau ? `(${classe.niveau})` : ""}{" "}
                      {classe.option?.abreviation
                        ? ` (${classe.option.abreviation})`
                        : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="idanneescolaire"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Année Scolaire</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value ? String(field.value) : ""}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez une année scolaire" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {anneescolaires.map((annee) => (
                    <SelectItem
                      key={annee.idanneescolaire}
                      value={String(annee.idanneescolaire)}
                    >
                      {annee.libelle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
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
