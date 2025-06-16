// components/dashboard-recent-activity.tsx
"use client";

import { Anneescolaire, Classe, Eleve, Inscription, Option } from "@/type"; // Importe les types nécessaires
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { DataTable } from "./data-table";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

// Définition du type d'affichage pour les inscriptions dans le tableau
type InscriptionDisplayForDashboard = Inscription & {
  eleve?: Eleve;
  classe?: Classe & { option?: Option };
  anneescolaire?: Anneescolaire;
};

// Définition des colonnes pour le tableau des inscriptions récentes
export const recentInscriptionsColumns: ColumnDef<InscriptionDisplayForDashboard>[] =
  [
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
      id: "eleve_name",
      header: "Élève",
      cell: ({ row }) => {
        const eleve = row.original.eleve;
        return eleve
          ? `${eleve.nom} ${eleve.postnom} ${eleve.prenom || ""}`.trim()
          : "N/A";
      },
    },
    {
      id: "classe_info",
      header: "Classe",
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
      id: "anneescolaire_libelle",
      header: "Année Scolaire",
      cell: ({ row }) => {
        const anneescolaire = row.original.anneescolaire;
        return anneescolaire ? anneescolaire.libelle : "N/A";
      },
    },
    {
      accessorKey: "dateinscription",
      header: "Date d'Inscription",
      cell: ({ row }) => {
        const date = row.original.dateinscription;
        return new Date(date).toLocaleString("fr-FR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    },
  ];

interface DashboardRecentActivityProps {
  initialRecentInscriptions: InscriptionDisplayForDashboard[];
  recentNumber: string;
}

export function DashboardRecentActivity({
  initialRecentInscriptions,
  recentNumber,
}: DashboardRecentActivityProps) {
  const [recentInscriptions, setRecentInscriptions] = useState<
    InscriptionDisplayForDashboard[]
  >(initialRecentInscriptions);

  // Note: Pour un tableau de bord, on n'a généralement pas besoin de Realtime updates complexes pour "l'activité récente".
  // On rechargera la page ou les données manuellement/périodiquement si nécessaire.
  // Cependant, si vous souhaitez des updates en temps réel pour ce tableau aussi,
  // la logique serait similaire à celle de eleve-list-client, mais simplifiée pour les 5-10 dernières entrées.

  // Pour cet exemple, nous nous basons sur les données initiales passées.
  // Si vous voulez du temps réel ici, vous devrez ajouter un useEffect avec Supabase Realtime
  // et des appels aux actions pour récupérer les données liées comme dans eleve-list-client.

  return (
    <div className="px-4 lg:px-6">
      <h3 className="text-xl font-semibold mb-4">
        Inscriptions Récentes ({recentNumber})
      </h3>
      <DataTable
        columns={recentInscriptionsColumns}
        data={recentInscriptions}
      />
    </div>
  );
}
