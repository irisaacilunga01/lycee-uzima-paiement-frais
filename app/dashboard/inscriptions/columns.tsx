// app/inscription/columns.tsx
"use client";
import { deleteInscription } from "@/app/actions/inscriptions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Anneescolaire, Classe, Eleve, Inscription, Option } from "@/type"; // Importez tous les types
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Loader2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
// Définition d'un type étendu pour les données affichées dans la table
type InscriptionDisplay = Inscription & {
  eleve?: Eleve;
  classe?: Classe & { option?: Option };
  anneescolaire?: Anneescolaire;
};

// Composant Client pour gérer les actions d'édition et de suppression
function InscriptionActionsCell({
  inscription,
}: {
  inscription: InscriptionDisplay;
}) {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteInscription(
      inscription.ideleve,
      inscription.idclasse,
      inscription.idanneescolaire
    );
    if (result.success) {
      toast.success("Suppression réussie !!!", {
        description: `Inscription de         ${
          inscription?.eleve?.nom +
          " " +
          inscription?.eleve?.postnom +
          " " +
          inscription?.eleve?.prenom
        } a été supprimé avec succès !`,
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
              href={`/dashboard/inscriptions/${inscription.ideleve}/${inscription.idclasse}/${inscription.idanneescolaire}/edit`}
            >
              <IconPencil className="h-8 w-8 rounded-full text-white bg-green-500 hover:bg-green-600  p-2" />
            </Link>
          </TooltipTrigger>
          <TooltipContent className="flex gap-2 justify-center items-center">
            <IconPencil className="h-4 w-4 rounded-full" />
            <p>
              modifier l&apos;inscription
              {inscription?.eleve?.nom +
                " " +
                inscription?.eleve?.postnom +
                " " +
                inscription?.eleve?.prenom}
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
                supprimer l&apos;élève{" "}
                {inscription?.eleve?.nom +
                  " " +
                  inscription?.eleve?.postnom +
                  " " +
                  inscription?.eleve?.prenom}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DialogContent>
          <DialogHeader>
            <DialogTitle> Suppression inscription</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer l&apos;inscription
              {inscription?.eleve?.nom +
                " " +
                inscription?.eleve?.postnom +
                " " +
                inscription?.eleve?.prenom}
              ?
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

export const columns: ColumnDef<InscriptionDisplay>[] = [
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
    accessorKey: "classe",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Classe
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const classe = row.original.classe;
      if (classe) {
        return (
          <span>
            {classe.nomclasse} {classe.niveau ? `(${classe.niveau})` : ""}{" "}
            {classe.option?.abreviation
              ? ` (${classe.option.abreviation})`
              : ""}
          </span>
        );
      }
      return "N/A";
    },
  },
  {
    accessorKey: "année scolaire",
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
      return anneescolaire ? anneescolaire.libelle : "N/A";
    },
  },
  {
    accessorKey: "date d'inscription",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date d&apos;Inscription
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.original.dateinscription;
      return new Date(date).toLocaleString("fr-FR");
    },
  },
  {
    id: "actions",
    enableHiding: false, // pour éviter de le masquer
    header: "Actions",
    cell: ({ row }) => <InscriptionActionsCell inscription={row.original} />,
  },
];
