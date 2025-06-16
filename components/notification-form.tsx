// components/notification-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  addNotification,
  updateNotification,
} from "@/app/actions/notifications";
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
import { Textarea } from "@/components/ui/textarea"; // Pour le champ message
import { Notification, Parent } from "@/type"; // Importez Notification et Parent
import { IconPencil, IconPlus } from "@tabler/icons-react";
import { Loader2Icon } from "lucide-react";
import React from "react";

// Schéma de validation pour les données de la notification
// 'dateenvoi' n'est pas inclus ici car il est géré par la base de données (DEFAULT NOW())
const notificationFormSchema = z.object({
  message: z.string().min(5, {
    message: "Le message est requis et doit contenir au moins 5 caractères.",
  }),
  idparent: z.coerce.number({
    message: "selectionner un parent !!!",
  }),
});

type NotificationFormValues = z.infer<typeof notificationFormSchema>;

interface NotificationFormProps {
  initialData?: Notification; // Pour l'édition, contient les données existantes
  parents: Parent[]; // Liste des parents pour le sélecteur
}

export function NotificationForm({
  initialData,
  parents,
}: NotificationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      message: initialData?.message || "",
      // Assure que `idparent` est converti en chaîne ou en "null_parent_id" pour le Select
      idparent: Number(initialData?.idparent),
    },
  });

  async function onSubmit(data: NotificationFormValues) {
    setLoading(true);
    try {
      let result;
      // Le type de `data.idparent` ici est `number | null | undefined` grâce au `pipe` dans le schéma
      const payloadIdParent = data.idparent;

      if (initialData) {
        // Mode édition
        // On ne passe que les champs modifiables par le formulaire
        result = await updateNotification(initialData.idnotification, {
          message: data.message,
          idparent: payloadIdParent,
        });
      } else {
        // Mode ajout
        result = await addNotification({
          message: data.message,
          idparent: payloadIdParent,
        });
      }

      if (result.success) {
        toast.success(`Succès ${initialData ? "de mise à jour" : "d'ajout"}`, {
          description: initialData
            ? "Notification mise à jour avec succès !"
            : "Notification ajoutée avec succès !",
        });

        router.push("/dashboard/notifications"); // Redirige vers la liste des notifications après succès
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
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Écrivez votre message ici..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="idparent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent Cible (Optionnel)</FormLabel>
              {/* Le value de Select doit être une chaîne de caractères. */}
              {/* On assure que field.value est converti en chaîne ou notre marqueur pour null. */}
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
                  {/* Utilise une valeur unique non vide pour l'option "Aucun parent spécifique" */}
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
