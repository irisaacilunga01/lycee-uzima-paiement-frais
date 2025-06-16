// components/parent-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation"; // Import useRouter
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { addParent, updateParent } from "@/app/actions/parents";
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
import { Parent } from "@/type"; // Assurez-vous que ce chemin est correct
import { IconPencil, IconPlus } from "@tabler/icons-react";
import { Loader2Icon } from "lucide-react";
import React from "react";

// Schéma de validation pour les données du parent
const parentFormSchema = z.object({
  nompere: z.string().min(2, {
    message:
      "Le nom du père est requis et doit contenir au moins 2 caractères.",
  }),
  nommere: z.string().min(2, {
    message:
      "Le nom de la mère est requis et doit contenir au moins 2 caractères.",
  }),
  adresse: z.string().optional(),
  emailpere: z
    .string()
    .email({ message: "Email du père invalide." })
    .optional()
    .or(z.literal("")),
  emailmere: z
    .string()
    .email({ message: "Email de la mère invalide." })
    .optional()
    .or(z.literal("")),
  professionpere: z.string().optional(),
  professionmere: z.string().optional(),
  telephonepere: z.string().optional(),
  telephonemere: z.string().optional(),
});

type ParentFormValues = z.infer<typeof parentFormSchema>;

interface ParentFormProps {
  initialData?: Parent; // Pour l'édition, contient les données existantes
}

export function ParentForm({ initialData }: ParentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<ParentFormValues>({
    resolver: zodResolver(parentFormSchema),
    defaultValues: initialData || {
      nompere: "",
      nommere: "",
      adresse: "",
      emailpere: "",
      emailmere: "",
      professionpere: "",
      professionmere: "",
      telephonepere: "",
      telephonemere: "",
    },
  });

  async function onSubmit(data: ParentFormValues) {
    setLoading(true);

    try {
      let result;
      if (initialData) {
        // Mode édition
        result = await updateParent(initialData.idparent, data);
      } else {
        // Mode ajout
        result = await addParent(data);
      }

      if (result.success) {
        toast.success(`Succès ${initialData ? "de mise à jour" : "d'ajout"}`, {
          description: initialData
            ? "Parent mis à jour avec succès !"
            : "Parent ajouté avec succès !",
        });

        router.push("/dashboard/parents"); // Redirige vers la liste des parents après succès
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
          name="nompere"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du Père</FormLabel>
              <FormControl>
                <Input placeholder="Nom du père" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nommere"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de la Mère</FormLabel>
              <FormControl>
                <Input placeholder="Nom de la mère" {...field} />
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
              <FormLabel>Adresse</FormLabel>
              <FormControl>
                <Input placeholder="Adresse" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="emailpere"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email du Père</FormLabel>
              <FormControl>
                <Input
                  placeholder="emailpere@example.com"
                  {...field}
                  type="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="emailmere"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email de la Mère</FormLabel>
              <FormControl>
                <Input
                  placeholder="emailmere@example.com"
                  {...field}
                  type="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="professionpere"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profession du Père</FormLabel>
              <FormControl>
                <Input placeholder="Profession du père" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="professionmere"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profession de la Mère</FormLabel>
              <FormControl>
                <Input placeholder="Profession de la mère" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="telephonepere"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone du Père</FormLabel>
              <FormControl>
                <Input placeholder="Téléphone du père" {...field} type="tel" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="telephonemere"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone de la Mère</FormLabel>
              <FormControl>
                <Input
                  placeholder="Téléphone de la mère"
                  {...field}
                  type="tel"
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
