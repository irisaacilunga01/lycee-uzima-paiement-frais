// app/eleve/columns.tsx
"use client";

import { deleteEleve } from "@/app/actions/eleves";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Assurez-vous que vous avez ces composants Shadcn UI
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
import { capitalize } from "@/lib/utils";
import { Eleve } from "@/type"; // Assurez-vous que ce chemin est correct
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

// Définition d'un type étendu pour les données affichées dans la table
type EleveDisplay = Eleve & {
  parent_name?: string; // Nom du parent pour l'affichage
};

// Composant Client pour gérer les actions d'édition et de suppression
function EleveActionsCell({ eleve }: { eleve: EleveDisplay }) {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteEleve(eleve.ideleve);
    if (result.success) {
      toast.success("Suppression réussie !!!", {
        description: `Elève ${
          eleve?.nom + " " + eleve?.postnom + " " + eleve?.prenom
        } supprimé avec succès !`,
      });
      setOpen(false); // ✅ fermer le Dialog
      setLoading(false); // ✅ remettre à false avant de rediriger
      setTimeout(() => {
        window.location.reload(); // force le rechargement complet de la page
      }, 200);
    } else {
      toast.error("Erreur de  suppression !!!", {
        description:
          result.error || "Erreur lors de la suppression de l'élève.",
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
              href={`/dashboard/eleves/${eleve.ideleve}/edit`}
            >
              <IconPencil className="h-8 w-8 rounded-full text-white bg-green-500 hover:bg-green-600  p-2" />
            </Link>
          </TooltipTrigger>
          <TooltipContent className="flex gap-2 justify-center items-center">
            <IconPencil className="h-4 w-4 rounded-full" />
            <p>
              modifier l&apos;élève $
              {eleve?.nom + " " + eleve?.postnom + " " + eleve?.prenom}
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
                supprimer l&apos;élève $
                {eleve?.nom + " " + eleve?.postnom + " " + eleve?.prenom}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DialogContent>
          <DialogHeader>
            <DialogTitle> Suppression élève</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer l&apos;élève $
              {eleve?.nom + " " + eleve?.postnom + " " + eleve?.prenom} ?
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

export const columns: ColumnDef<EleveDisplay>[] = [
  {
    accessorKey: "photo",
    header: "Photo",
    enableHiding: false, // pour éviter de le masquer

    cell: ({ row }) => {
      const photoUrl = row.original.photo;
      const nom = row.original.nom;
      const prenom = row.original.prenom;

      return (
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={photoUrl || undefined}
            alt={`Photo de ${nom}`}
            className="object-cover"
          />
          <AvatarFallback>
            {nom ? nom.charAt(0) : prenom ? prenom.charAt(0) : "EL"}
          </AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    id: "fullname",
    accessorFn: (row) =>
      `${row.nom?.toLowerCase() ?? ""} ${row.postnom?.toLowerCase() ?? ""} ${
        row.prenom?.toLowerCase() ?? ""
      }`,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nom Complet
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) =>
      capitalize(row.original.nom) +
      " " +
      capitalize(row.original.postnom) +
      " " +
      capitalize(row.original.prenom!),
    enableHiding: false, // pour éviter de le masquer
  },
  {
    accessorKey: "datenaissance",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Né(e) le
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "lieunaissance",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Né(e) à
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "adresse",
    header: "Adresse",
  },
  {
    accessorKey: "moyentransport",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Transport
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    enableHiding: false, // pour éviter de le masquer

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
    accessorKey: "parent_name",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Parent
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },

    cell: ({ row }) => row.original.parent_name || "Non spécifié",
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false, // pour éviter de le masquer

    cell: ({ row }) => <EleveActionsCell eleve={row.original} />,
  },
];
