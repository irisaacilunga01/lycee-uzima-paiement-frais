// app/options/columns.tsx
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
import { Option } from "@/type"; // Assurez-vous que ce chemin est correct
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Loader2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
import { deleteOption } from "../../actions/options";

// Composant Client pour gérer les actions d'édition et de suppression
function OptionActionsCell({ option }: { option: Option }) {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteOption(option.idoption);
    if (result.success) {
      toast.success("Suppression réussie !!!", {
        description: `Option de ${option?.nomoption} supprimée avec succès !`,
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
              href={`/dashboard/options/${option.idoption}/edit`}
            >
              <IconPencil className="h-8 w-8 rounded-full text-white bg-green-500 hover:bg-green-600  p-2" />
            </Link>
          </TooltipTrigger>
          <TooltipContent className="flex gap-2 justify-center items-center">
            <IconPencil className="h-4 w-4 rounded-full" />
            <p>modifier l&apos;option ({option?.nomoption})</p>
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
              <p>supprimer l&apos;option ({option?.nomoption})</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DialogContent>
          <DialogHeader>
            <DialogTitle> Suppression option</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer l&apos;option (
              {option?.nomoption}) ?
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

export const columns: ColumnDef<Option>[] = [
  {
    accessorKey: "nomoption",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nom de l&apos;Option
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "abreviation",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Abréviation
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false, // pour éviter de le masquer
    header: "Actions",
    cell: ({ row }) => <OptionActionsCell option={row.original} />,
  },
];
