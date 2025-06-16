// app/notifications/columns.tsx
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
import { Notification } from "@/type"; // Assurez-vous que ce chemin est correct
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Loader2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
import { deleteNotification } from "../../actions/notifications";

// Définition d'un type étendu pour les données affichées dans la table
type NotificationDisplay = Notification & {
  parent_name?: string; // Nom du parent pour l'affichage
};

// Composant Client pour gérer les actions d'édition et de suppression
function NotificationActionsCell({
  notification,
}: {
  notification: NotificationDisplay;
}) {
  const [open, setOpen] = React.useState(false); // 👉 contrôle manuel du Dialog
  const [loading, setLoading] = React.useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteNotification(notification.idnotification);
    if (result.success) {
      toast.success("Suppression réussie !!!", {
        description: `Notification de ${notification?.parent_name} supprimée avec succès !`,
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
              href={`/dashboard/notifications/${notification.idnotification}/edit`}
            >
              <IconPencil className="h-8 w-8 rounded-full text-white bg-green-500 hover:bg-green-600  p-2" />
            </Link>
          </TooltipTrigger>
          <TooltipContent className="flex gap-2 justify-center items-center">
            <IconPencil className="h-4 w-4 rounded-full" />
            <p>
              modifier la notification de
              {notification?.parent_name}
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
                supprimer la notification de
                {notification?.parent_name}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DialogContent>
          <DialogHeader>
            <DialogTitle> Suppression notification</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer la notification
              {notification?.parent_name} ?
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

export const columns: ColumnDef<NotificationDisplay>[] = [
  {
    accessorKey: "parent_name",

    accessorFn: (row) => `${row.parent_name?.toLowerCase()}`,

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Parent Cible
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },

    cell: ({ row }) => row.original.parent_name || "Tous les parents", // Afficher le nom du parent ou "Tous les parents"
  },
  {
    accessorKey: "message",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Message
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },

    cell: ({ row }) => {
      return row.original.message.slice(0, 80) + "...";
    },
  },
  {
    accessorKey: "date envoi",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date d&apos;Envoi
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },

    cell: ({ row }) => {
      // Formatter la date pour un affichage plus lisible
      const date = new Date(row.original.dateenvoi);
      return date.toLocaleString(); // Ex: "10/26/2023, 10:00:00 AM"
    },
  },

  {
    id: "actions",
    header: "Actions",
    enableHiding: false, // pour éviter de le masquer
    cell: ({ row }) => <NotificationActionsCell notification={row.original} />,
  },
];
