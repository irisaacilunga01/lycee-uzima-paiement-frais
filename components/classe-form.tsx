// components/classe-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { addClasse, updateClasse } from "@/app/actions/classes";
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
import { Classe, Option } from "@/type"; // Assurez-vous que Classe et Option sont importés
import { IconPencil, IconPlus } from "@tabler/icons-react";
import { Loader2Icon } from "lucide-react";
import React from "react";

// Schéma de validation pour les données de la classe
const classeFormSchema = z.object({
  nomclasse: z.string().min(2, {
    message:
      "Le nom de la classe est requis et doit contenir au moins 2 caractères.",
  }),
  niveau: z.string().optional().nullable(),
  idoption: z.preprocess(
    // Pré-processus pour convertir la chaîne vide/null_option_id en null
    (val) => {
      if (
        val === null ||
        val === undefined ||
        val === "" ||
        val === "null_option_id"
      ) {
        return null;
      }
      return Number(val);
    },
    z.number({ required_error: "L'option est requise." }) // idoption est requis ici
  ),
});

type ClasseFormValues = z.infer<typeof classeFormSchema>;

interface ClasseFormProps {
  initialData?: Classe; // Pour l'édition, contient les données existantes
  options: Option[]; // Liste des options pour le sélecteur
}

export function ClasseForm({ initialData, options }: ClasseFormProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<ClasseFormValues>({
    resolver: zodResolver(classeFormSchema),
    defaultValues: {
      nomclasse: initialData?.nomclasse || "",
      niveau: initialData?.niveau || "",
      idoption:
        initialData?.idoption !== undefined && initialData.idoption !== null
          ? String(initialData.idoption)
          : "null_option_id", // Utilisez notre marqueur pour null
    },
  });

  async function onSubmit(values: ClasseFormValues) {
    setLoading(true);

    try {
      let result;
      // Nettoyez les champs optionnels vides avant d'envoyer à Supabase
      const dataToSave = { ...values };

      // Gérer spécifiquement idoption qui vient de Zod comme number | null
      if (dataToSave.idoption === "null_option_id") {
        (dataToSave.idoption as any) = null; // Zod va déjà transformer en number | null
      }
      if (dataToSave.niveau === "") {
        (dataToSave.niveau as any) = null;
      }

      if (initialData) {
        // Mode édition
        result = await updateClasse(
          initialData.idclasse,
          dataToSave as Partial<Omit<Classe, "idclasse">>
        );
      } else {
        // Mode ajout
        result = await addClasse(dataToSave as Omit<Classe, "idclasse">);
      }

      if (result.success) {
        toast.success(`Succès ${initialData ? "de mise à jour" : "d'ajout"}`, {
          description: initialData
            ? "Classe mise à jour avec succès !"
            : "Classe ajoutée avec succès !",
        });

        router.push("/dashboard/classes"); // Redirige vers la liste des classes après succès
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
          name="nomclasse"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de la Classe</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 3ème" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="niveau"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Niveau (Optionnel)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Secondaire,Education de base"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="idoption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Option</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={
                  field.value !== null && field.value !== undefined
                    ? String(field.value)
                    : "null_option_id"
                }
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez une option" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="null_option_id" disabled>
                    Sélectionnez une option
                  </SelectItem>{" "}
                  {/* Option pour null, mais désactivée pour obliger un choix */}
                  {options.map((option) => (
                    <SelectItem
                      key={option.idoption}
                      value={String(option.idoption)}
                    >
                      {option.nomoption} ({option.abreviation})
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
