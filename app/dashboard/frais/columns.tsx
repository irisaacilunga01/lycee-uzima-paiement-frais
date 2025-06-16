// app/frais/columns.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Anneescolaire, Frais } from "@/type"; // Assurez-vous d'importer Frais et Anneescolaire
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { deleteFrais } from "../../actions/frais";

// Définition d'un type étendu pour les données affichées dans la table
type FraisDisplay = Frais & {
  anneescolaire?: Anneescolaire; // La relation anneescolaire est incluse pour l'affichage
};

// Composant Client pour gérer les actions d'édition et de suppression
function FraisActionsCell({ frais }: { frais: FraisDisplay }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteFrais(frais.idfrais);
    if (result.success) {
      toast.success("Suppression réussie !!!", {
        description: `Frais de (${frais?.description}) supprimé avec succès !`,
      });
      setOpen(false); // ✅ fermer le Dialog
      setLoading(false); // ✅ remettre à false avant de rediriger
      setTimeout(() => {
        window.location.reload(); // force le rechargement complet de la page
      }, 200);
    } else {
      toast.error("Erreur de  suppression !!!", {
        description: result.error || "Erreur lors de la suppression du frais.",
      });
      setLoading(false); // ✅ dans tous les cas
    }
  };

  return (
    <div className="flex gap-3">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              className="flex gap-3"
              href={`/dashboard/frais/${frais.idfrais}/edit`}
            >
              <IconPencil className="h-8 w-8 rounded-full text-white bg-green-500 hover:bg-green-600  p-2" />
            </Link>
          </TooltipTrigger>
          <TooltipContent className="flex gap-2 justify-center items-center">
            <IconPencil className="h-4 w-4 rounded-full" />
            <p>modifier le frais de ({frais?.description})</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={open} onOpenChange={setOpen}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <IconTrash className="h-8 w-8 rounded-full text-white bg-destructive hover:bg-destructive/70 p-2 cursor-pointer" />
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent className="flex gap-2 justify-center items-center ">
              <IconTrash className="h-4 w-4 rounded-full" />
              <p>supprimer le frais de ({frais?.description})</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DialogContent>
          <DialogHeader>
            <DialogTitle> Suppression année scolaire</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer l&apos;année scolaire{" "}
              {frais?.description} ?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="justify-end">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Fermer
              </Button>
            </DialogClose>

            {loading ? (
              <Button size="sm" variant="destructive" disabled>
                <Loader2Icon className="animate-spin mr-2" />
                Supression...
              </Button>
            ) : (
              <Button variant="destructive" onClick={handleDelete}>
                Confirmer
                <IconTrash />
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const columns: ColumnDef<FraisDisplay>[] = [
  {
    accessorKey: "description",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Description
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "montanttotal",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Montant Total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },

    cell: ({ row }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const amount = parseFloat(row.original.montanttotal as any); // Cast to any to handle number type from DB
      // return new Intl.NumberFormat("fr-FR", {
      //   style: "currency",
      //   currency: "CDF",
      // }).format(amount); // Exemple de formatage
      return `${amount} Fc`;
    },
  },
  {
    accessorKey: "dateecheance",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date d&apos;Échéance
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },

    cell: ({ row }) => {
      const date = row.original.dateecheance;
      return date ? new Date(date).toLocaleDateString("fr-FR") : "N/A";
    },
  },
  {
    // Colonne pour l'année scolaire
    accessorKey: "anneescolaire",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Année Scolaire
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },

    cell: ({ row }) => {
      const anneescolaire = row.original.anneescolaire;
      return anneescolaire ? anneescolaire.libelle : "Non spécifiée";
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false, // pour éviter de le masquer

    cell: ({ row }) => <FraisActionsCell frais={row.original} />,
  },
];
