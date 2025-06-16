// components/option-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { addOption, updateOption } from "@/app/actions/options";
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
import { Option } from "@/type"; // Assurez-vous que ce chemin est correct
import { IconPencil, IconPlus } from "@tabler/icons-react";
import { Loader2Icon } from "lucide-react";
import React from "react";

// Schéma de validation pour les données de l'option
const optionFormSchema = z.object({
  nomoption: z.string().min(2, {
    message:
      "Le nom de l'option est requis et doit contenir au moins 2 caractères.",
  }),
  abreviation: z.string().min(1, { message: "L'abréviation est requise." }),
});

type OptionFormValues = z.infer<typeof optionFormSchema>;

interface OptionFormProps {
  initialData?: Option; // Pour l'édition, contient les données existantes
}

export function OptionForm({ initialData }: OptionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<OptionFormValues>({
    resolver: zodResolver(optionFormSchema),
    defaultValues: initialData || {
      nomoption: "",
      abreviation: "",
    },
  });

  async function onSubmit(data: OptionFormValues) {
    setLoading(true);
    try {
      let result;
      if (initialData) {
        // Mode édition
        result = await updateOption(initialData.idoption, data);
      } else {
        // Mode ajout
        result = await addOption(data);
      }

      if (result.success) {
        toast.success(`Succès ${initialData ? "de mise à jour" : "d'ajout"}`, {
          description: initialData
            ? "Option mise à jour avec succès !"
            : "Option ajoutée avec succès !",
        });

        router.push("/dashboard/options"); // Redirige vers la liste des options après succès
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
          name="nomoption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de l&apos;Option</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Informatique de Gestion" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="abreviation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Abréviation</FormLabel>
              <FormControl>
                <Input placeholder="Ex: IG" {...field} />
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
