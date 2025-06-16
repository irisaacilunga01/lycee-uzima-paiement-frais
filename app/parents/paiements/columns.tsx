import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { capitalize } from "@/lib/utils";
import { Eleve, Frais, Paiement } from "@/type";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
export type PaiementDisplay = Paiement & { eleve: Eleve; frais: Frais };
// // Ces définitions sont maintenant dans un composant client
export const paiementsColumns: ColumnDef<PaiementDisplay>[] = [
  {
    accessorKey: "photo",
    header: "Photo",
    enableHiding: false, // pour éviter de le masquer

    cell: ({ row }) => {
      const eleve = row.original.eleve;
      console.log({ eleve });

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
    accessorKey: "eleve.nom",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nom de l&apos;enfant
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
  },
  {
    accessorKey: "frais.description", // Utilise 'description'
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type de frais
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.frais?.description || "N/A",
  },
  {
    accessorKey: "montantpayer",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Montant payé
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },

    cell: ({ row }) => row.original.montantpayer + " Fc",
  },
  {
    accessorKey: "datepaiement",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date du paiement
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return new Date(row.original.datepaiement).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
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
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${
          row.original?.status === "completed"
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
            : row.original.status === "pending"
            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
        }`}
      >
        {row.original?.status === "success"
          ? "Terminé"
          : row.original.status === "pending"
          ? "En attente"
          : "Échec"}
      </span>
    ),
  },
];
