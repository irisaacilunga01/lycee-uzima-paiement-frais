// components/anneescolaire-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  addAnneescolaire,
  updateAnneescolaire,
} from "@/app/actions/anneescolaire";
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
import { Anneescolaire } from "@/type"; // Assurez-vous que ce chemin est correct
import { IconPencil, IconPlus } from "@tabler/icons-react";
import { Loader2Icon } from "lucide-react";
import React from "react";

// Schéma de validation pour les données de l'année scolaire
const anneescolaireFormSchema = z
  .object({
    status: z.enum(["en cours", "terminé"], {
      required_error: "Le statut est requis.",
    }),
    libelle: z.string().min(2, {
      message: "Le libellé est requis et doit contenir au moins 2 caractères.",
    }),
    datedebut: z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "La date de début doit être au format YYYY-MM-DD."
      ),
    datefin: z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "La date de fin doit être au format YYYY-MM-DD."
      ),
  })
  .refine((data) => new Date(data.datefin) >= new Date(data.datedebut), {
    message: "La date de fin ne peut pas être antérieure à la date de début.",
    path: ["datefin"], // Affiche l'erreur sur le champ datefin
  });

type AnneescolaireFormValues = z.infer<typeof anneescolaireFormSchema>;

interface AnneescolaireFormProps {
  initialData?: Anneescolaire; // Pour l'édition, contient les données existantes
}

export function AnneescolaireForm({ initialData }: AnneescolaireFormProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const form = useForm<AnneescolaireFormValues>({
    resolver: zodResolver(anneescolaireFormSchema),
    defaultValues: initialData || {
      status: "en cours",
      libelle: "",
      datedebut: "",
      datefin: "",
    },
  });

  async function onSubmit(data: AnneescolaireFormValues) {
    setLoading(true);
    try {
      let result;
      if (initialData) {
        // Mode édition
        result = await updateAnneescolaire(initialData.idanneescolaire, data);
      } else {
        // Mode ajout
        result = await addAnneescolaire(data);
      }

      if (result.success) {
        toast.success(`Succès ${initialData ? "de mise à jour" : "d'ajout"}`, {
          description: initialData
            ? "Année scolaire mise à jour avec succès !"
            : "Année scolaire ajoutée avec succès !",
        });
        router.push("/dashboard/anneescolaires"); // Redirige vers la liste des années scolaires après succès
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
          name="libelle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Libellé</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Année 2024-2025" {...field} />
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
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="datedebut"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de Début</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="datefin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de Fin</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
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
