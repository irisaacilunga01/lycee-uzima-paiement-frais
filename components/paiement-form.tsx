// components/paiement-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { addPaiement, updatePaiement } from "@/app/actions/paiement"; // Actions spécifiques au paiement
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
import { Eleve, Frais, Paiement } from "@/type"; // Importez tous les types
import { IconPencil, IconPlus } from "@tabler/icons-react";
import { Loader2Icon } from "lucide-react";
import React from "react";
// Schéma de validation pour les données du paiement
const paiementFormSchema = z.object({
  montantpayer: z.preprocess(
    (val) => Number(val),
    z
      .number({ invalid_type_error: "Le montant à payer doit être un nombre." })
      .min(0.01, { message: "Le montant à payer doit être positif." })
      .transform((num) => parseFloat(num.toFixed(2))) // S'assure que le nombre a deux décimales
  ),
  status: z
    .enum(["pending", "processing", "success", "failed"], {
      required_error: "Le statut est requis.",
    })
    .default("pending"), // Définit un statut par défaut pour le formulaire

  ideleve: z.preprocess(
    // Pré-processus pour convertir la chaîne vide/null_eleve_id en null
    (val) => {
      if (
        val === null ||
        val === undefined ||
        val === "" ||
        val === "null_eleve_id"
      ) {
        return null;
      }
      return Number(val);
    },
    z.number().nullable().optional() // ideleve peut être un nombre ou null
  ),
  idfrais: z.preprocess(
    // Pré-processus pour convertir la chaîne vide/null_frais_id en null
    (val) => {
      if (
        val === null ||
        val === undefined ||
        val === "" ||
        val === "null_frais_id"
      ) {
        return null;
      }
      return Number(val);
    },
    z.number().nullable().optional() // idfrais peut être un nombre ou null
  ),
  // datepaiement n'est pas un champ de formulaire car il est DEFAULT NOW()
});

type PaiementFormValues = z.infer<typeof paiementFormSchema>;

interface PaiementFormProps {
  initialData?: Paiement; // Pour l'édition, contient les données existantes
  eleves: Eleve[]; // Liste des élèves
  frais: Frais[]; // Liste des frais
}

export function PaiementForm({
  initialData,
  eleves,
  frais,
}: PaiementFormProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<PaiementFormValues>({
    resolver: zodResolver(paiementFormSchema),
    defaultValues: {
      montantpayer: initialData?.montantpayer || 0,
      status: initialData?.status || "pending",
      ideleve:
        initialData?.ideleve !== undefined && initialData.ideleve !== null
          ? String(initialData.ideleve)
          : "null_eleve_id", // Utilisez notre marqueur pour null
      idfrais:
        initialData?.idfrais !== undefined && initialData.idfrais !== null
          ? String(initialData.idfrais)
          : "null_frais_id", // Utilisez notre marqueur pour null
    },
  });

  async function onSubmit(values: PaiementFormValues) {
    setLoading(true);
    try {
      let result;
      const dataToSave = { ...values };

      // Nettoyez les champs "null" des marqueurs avant d'envoyer à Supabase
      if (dataToSave.ideleve === "null_eleve_id") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (dataToSave.ideleve as any) = null;
      }
      if (dataToSave.idfrais === "null_frais_id") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (dataToSave.idfrais as any) = null;
      }

      // 'datepaiement' est omis car géré par la DB. 'status' peut être envoyé si modifié.

      if (initialData) {
        // Mode édition
        result = await updatePaiement(
          initialData.idpaiement,
          dataToSave as Partial<Omit<Paiement, "idpaiement" | "datepaiement">>
        );
      } else {
        // Mode ajout
        result = await addPaiement(
          dataToSave as Omit<Paiement, "idpaiement" | "datepaiement">
        );
      }

      if (result.success) {
        toast.success(`Succès ${initialData ? "de mise à jour" : "d'ajout"}`, {
          description: initialData
            ? "Paiement mis à jour avec succès !"
            : "Paiement ajouté avec succès !",
        });

        router.push("/dashboard/paiements"); // Redirige vers la liste des paiements après succès
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
          name="montantpayer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Montant à Payer</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01" // Permet les décimales
                  placeholder="Ex: 150.00"
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
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Statut</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez un statut" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="processing">
                    En cours de traitement
                  </SelectItem>
                  <SelectItem value="success">Réussi</SelectItem>
                  <SelectItem value="failed">Échec</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ideleve"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Élève (Optionnel)</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={
                  field.value !== null && field.value !== undefined
                    ? String(field.value)
                    : "null_eleve_id"
                }
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez un élève" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="null_eleve_id">Non spécifié</SelectItem>
                  {eleves.map((eleve) => (
                    <SelectItem
                      key={eleve.ideleve}
                      value={String(eleve.ideleve)}
                    >
                      {eleve.nom} {eleve.postnom} {eleve.prenom || ""}
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
          name="idfrais"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frais Associés (Optionnel)</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={
                  field.value !== null && field.value !== undefined
                    ? String(field.value)
                    : "null_frais_id"
                }
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez des frais" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="null_frais_id">Non spécifié</SelectItem>
                  {frais.map((f) => (
                    <SelectItem key={f.idfrais} value={String(f.idfrais)}>
                      {f.description} ({f.montanttotal} Fc)
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
