// app/anneescolaire/columns.tsx
"use client";

import { Badge } from "@/components/ui/badge";
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
import { Anneescolaire } from "@/type"; // Assurez-vous que ce chemin est correct
import {
  IconCircleCheckFilled,
  IconLoader,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Loader2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
import { deleteAnneescolaire } from "../../actions/anneescolaire";

// Composant Client pour gérer les actions d'édition et de suppression
function AnneescolaireActionsCell({
  anneescolaire,
}: {
  anneescolaire: Anneescolaire;
}) {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteAnneescolaire(anneescolaire.idanneescolaire);
    if (result.success) {
      toast.success("Suppression réussie !!!", {
        description: `Année scolaire ${anneescolaire?.libelle} supprimée avec succès !`,
      });
      setOpen(false); // ✅ fermer le Dialog
      setLoading(false); // ✅ remettre à false avant de rediriger
      setTimeout(() => {
        window.location.reload(); // force le rechargement complet de la page
      }, 200);
    } else {
      toast.error("Erreur de  suppression !!!", {
        description:
          result.error || "Erreur lors de la suppression de l'année scolaire.",
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
              href={`/dashboard/anneescolaires/${anneescolaire.idanneescolaire}/edit`}
            >
              <IconPencil className="h-8 w-8 rounded-full text-white bg-green-500 hover:bg-green-600  p-2" />
            </Link>
          </TooltipTrigger>
          <TooltipContent className="flex gap-2 justify-center items-center">
            <IconPencil className="h-4 w-4 rounded-full" />
            <p>modifier l&apos;année scolaire {anneescolaire?.libelle}</p>
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
              <p>supprimer l&apos;année scolaire {anneescolaire?.libelle}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DialogContent>
          <DialogHeader>
            <DialogTitle> Suppression année scolaire</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer l&apos;année scolaire{" "}
              {anneescolaire?.libelle} ?
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

export const columns: ColumnDef<Anneescolaire>[] = [
  {
    accessorKey: "libelle",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Libellé
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Statut
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.original.status === "terminé" ? (
          <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
        ) : (
          <IconLoader />
        )}
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "datedebut",
    header: "Date de Début",
  },
  {
    accessorKey: "datefin",
    header: "Date de Fin",
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false, // pour éviter de le masquer

    cell: ({ row }) => (
      <AnneescolaireActionsCell anneescolaire={row.original} />
    ),
  },
];
