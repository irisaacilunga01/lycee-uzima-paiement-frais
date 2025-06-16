// app/parents/columns.tsx
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
import { Parent } from "@/type"; // Assurez-vous que ce chemin est correct
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Loader2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
import { deleteParent } from "../../actions/parents";
// Composant Client pour gérer les actions d'édition et de suppression
// Ce composant est nécessaire pour utiliser useRouter et d'autres hooks client.
function ParentActionsCell({ parent }: { parent: Parent }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const handleDelete = async () => {
    setLoading(true);

    const result = await deleteParent(parent.idparent);
    if (result.success) {
      toast.success("Suppression réussie !!!", {
        description: `Parent ${parent?.nompere} & ${parent?.nommere} supprimé avec succès !`,
      });

      setOpen(false); // ✅ fermer le Dialog
      setLoading(false); // ✅ remettre à false avant de rediriger
      setTimeout(() => {
        window.location.reload(); // force le rechargement complet de la page
      }, 200);
    } else {
      toast.error("Erreur de  suppression !!!", {
        description: result.error || "Erreur lors de la suppression du parent.",
      });       setLoading(false); // ✅ dans tous les cas
    }
  };

  return (
    <div className="flex gap-3">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              className="flex gap-3"
              href={`/dashboard/parents/${parent.idparent}/edit`}
            >
              <IconPencil className="h-8 w-8 rounded-full text-white bg-green-500 hover:bg-green-600  p-2" />
            </Link>
          </TooltipTrigger>
          <TooltipContent className="flex gap-2 justify-center items-center">
            <IconPencil className="h-4 w-4 rounded-full" />
            <p>
              modifier le parent ({parent?.nompere} & {parent?.nommere})
            </p>
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
              <p>
                supprimer le parent de ({parent?.nompere} & {parent?.nommere})
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DialogContent>
          <DialogHeader>
            <DialogTitle> Suppression option</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le parent ({parent?.nompere} &{" "}
              {parent?.nommere}) ?
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

export const columns: ColumnDef<Parent>[] = [
  {
    enableHiding: false, // pour éviter de le masquer
    accessorKey: "nompere",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nom du Père
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    enableHiding: false, // pour éviter de le masquer
    accessorKey: "nommere",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nom de la Mère
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  {
    accessorKey: "emailpere",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email Père
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "emailmere",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email Mère
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "professionpere",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Profession Père
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "professionmere",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Profession Mère
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "telephonepere", // Typo in SQL: telephonepere was missing. Assuming this maps to a distinct field for father's phone.
    header: "Téléphone Père",
  },
  {
    accessorKey: "telephonemere",
    header: "Téléphone Mère",
  },
  {
    accessorKey: "adresse",
    header: "Adresse",
  },
  {
    id: "actions",
    enableHiding: false, // pour éviter de le masquer
    header: "Actions",
    cell: ({ row }) => <ParentActionsCell parent={row.original} />,
  },
];
