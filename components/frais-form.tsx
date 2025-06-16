// components/frais-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { addFrais, updateFrais } from "@/app/actions/frais";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { Textarea } from "@/components/ui/textarea";
import { Anneescolaire, Frais } from "@/type"; // Importez Frais et Anneescolaire
import { IconPencil, IconPlus } from "@tabler/icons-react";
import { Loader2Icon } from "lucide-react";
import React from "react";

// Schéma de validation pour les données des frais
const fraisFormSchema = z.object({
  description: z.string().min(5, {
    message:
      "La description est requise et doit contenir au moins 5 caractères.",
  }),
  montanttotal: z.coerce
    .number({
      invalid_type_error: "Le montant total doit être un nombre.",
      message: "Le montant total doit être positif.",
    })
    .min(0.01, { message: "Le montant total doit être positif." })
    .transform((num) => parseFloat(num.toFixed(2))),
  dateecheance: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "La date d'échéance doit être au format YYYY-MM-DD."
    )
    .optional()
    .or(z.literal("")),
  idanneescolaire: z.coerce
    .number({
      required_error: "selectionner une année scolaire !!",
    })
    .optional(),
});

type FraisFormValues = z.infer<typeof fraisFormSchema>;

interface FraisFormProps {
  initialData?: Frais; // Pour l'édition, contient les données existantes
  anneescolaires: Anneescolaire[]; // Liste des années scolaires pour le sélecteur
}

export function FraisForm({ initialData, anneescolaires }: FraisFormProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const form = useForm<FraisFormValues>({
    resolver: zodResolver(fraisFormSchema),
    defaultValues: {
      description: initialData?.description || "",
      montanttotal: initialData?.montanttotal || 0,
      dateecheance: initialData?.dateecheance || "",
      idanneescolaire: Number(initialData?.idanneescolaire),
    },
  });

  async function onSubmit(values: FraisFormValues) {
    setLoading(true);
    try {
      let result;
      const dataToSave = { ...values };
      if (initialData) {
        // Mode édition
        result = await updateFrais(
          initialData.idfrais,
          dataToSave as Partial<Omit<Frais, "idfrais">>
        );
      } else {
        // Mode ajout
        result = await addFrais(dataToSave as Omit<Frais, "idfrais">);
      }

      if (result.success) {
        toast.success(`Succès ${initialData ? "de mise à jour" : "d'ajout"}`, {
          description: initialData
            ? "Frais mis à jour avec succès !"
            : "Frais ajouté avec succès !",
        });

        router.push("/dashboard/frais"); // Redirige vers la liste des frais après succès
        router.refresh(); // Rafraîchit les données
      } else {
        setLoading(false);
        toast.error(`Erreur ${initialData ? "de mise à jour" : "d'ajout"}`, {
          description: result.error || "Une erreur est survenue.",
        });
      }
    } catch (error) {
      toast.error("Erreur opération !!!", {
        description: "Erreur formulaire frais : " + error,
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
          name="montanttotal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Montant Total</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01" // Permet les décimales
                  placeholder="Ex: 250.00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))} // Convertit en nombre
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateecheance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date d&apos;Échéance (Optionnel)</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="idanneescolaire"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Année Scolaire (Optionnel)</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={
                  field.value !== null && field.value !== undefined
                    ? String(field.value)
                    : "null_anneescolaire_id"
                }
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez une année scolaire" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="null_anneescolaire_id">
                    Non spécifié
                  </SelectItem>
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
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description des frais (ex: Frais d'inscription)"
                  {...field}
                />
              </FormControl>
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
