// app/paiement/columns.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Eleve, Frais, Paiement } from "@/type"; // Assurez-vous d'importer tous les types
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
import { deletePaiement } from "../../actions/paiement"; // Utilisez le nouveau fichier d'actions
// Définition d'un type étendu pour les données affichées dans la table
type PaiementDisplay = Paiement & {
  eleve?: Eleve;
  frais?: Frais;
};

// Composant Client pour gérer les actions d'édition et de suppression
function PaiementActionsCell({ paiement }: { paiement: PaiementDisplay }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const handleDelete = async () => {
    setLoading(true);

    const result = await deletePaiement(paiement.idpaiement);
    if (result.success) {
      toast.success("Suppression réussie !!!", {
        description: `Paiement de ${paiement?.eleve?.nom} ${paiement?.eleve?.postnom} ${paiement?.eleve?.prenom} supprimé avec succès !`,
      });

      setOpen(false); // ✅ fermer le Dialog
      setLoading(false); // ✅ remettre à false avant de rediriger
      setTimeout(() => {
        window.location.reload(); // force le rechargement complet de la page
      }, 200);
    } else {
      toast.error("Erreur de  suppression !!!", {
        description:
          result.error || "Erreur lors de la suppression de paiement.",
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
              href={`/dashboard/paiements/${paiement.idpaiement}/edit`}
            >
              <IconPencil className="h-8 w-8 rounded-full text-white bg-green-500 hover:bg-green-600  p-2" />
            </Link>
          </TooltipTrigger>
          <TooltipContent className="flex gap-2 justify-center items-center">
            <IconPencil className="h-4 w-4 rounded-full" />
            <p>
              modifier le paiement de ({paiement?.eleve?.nom}{" "}
              {paiement?.eleve?.postnom} {paiement?.eleve?.prenom})
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
                supprimer le paiement de ({paiement?.eleve?.nom}{" "}
                {paiement?.eleve?.postnom} {paiement?.eleve?.prenom})
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DialogContent>
          <DialogHeader>
            <DialogTitle> Suppression option</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le paiement (
              {paiement?.eleve?.nom} {paiement?.eleve?.postnom}{" "}
              {paiement?.eleve?.prenom}) ?
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

export const columns: ColumnDef<PaiementDisplay>[] = [
  {
    accessorKey: "photo",
    header: "Photo",
    enableHiding: false, // pour éviter de le masquer

    cell: ({ row }) => {
      const eleve = row.original.eleve;

      return (
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={eleve?.photo || undefined}
            alt={`Photo de ${eleve?.nom}`}
            className="object-cover"
          />
          <AvatarFallback>
            {eleve?.nom
              ? eleve?.nom.charAt(0)
              : eleve?.prenom
              ? eleve?.prenom.charAt(0)
              : "EL"}
          </AvatarFallback>
        </Avatar>
      );
    },
  },

  {
    id: "fullname",
    accessorFn: (row) => {
      const eleve = row.eleve;
      return `${eleve?.nom?.toLowerCase() ?? ""} ${
        eleve?.postnom?.toLowerCase() ?? ""
      } ${eleve?.prenom?.toLowerCase() ?? ""}`;
    },
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
    cell: ({ row }) => {
      const eleve = row.original.eleve;

      return (
        capitalize(eleve?.nom || "") +
        " " +
        capitalize(eleve?.postnom || "") +
        " " +
        capitalize(eleve?.prenom || "")
      );
    },
    enableHiding: false, // pour éviter de le masquer
  },
  {
    accessorKey: "montantpayer",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Montant Payé
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },

    cell: ({ row }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const amount = parseFloat(row.original.montantpayer as any); // Cast to any to handle number type from DB
      return `${amount} Fc`; // Formatage monétaire
    },
  },
  {
    accessorKey: "datepaiement",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Paiement
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.original.datepaiement;
      return new Date(date).toLocaleString("fr-FR");
    },
  },
  {
    id: "frais_description",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Frais Associés
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const frais = row.original.frais;
      return frais
        ? `${frais.description} (${frais.montanttotal} Fc)`
        : "Non spécifié";
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
        {row.original.status === "success" ? (
          <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
        ) : (
          <IconLoader />
        )}
        {row.original.status}
      </Badge>
    ),
  },

  {
    id: "actions",
    enableHiding: false, // pour éviter de le masquer
    header: "Actions",
    cell: ({ row }) => <PaiementActionsCell paiement={row.original} />,
  },
];
