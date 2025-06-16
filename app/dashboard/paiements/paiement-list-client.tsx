// app/paiement/paiement-list-client.tsx
"use client";

import { createClient } from "@/lib/supabase/client";
import { Eleve, Frais, Paiement } from "@/type"; // Importez tous les types
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getEleveById } from "../../actions/eleves"; // Pour récupérer l'élève
import { getFraisById } from "../../actions/frais"; // Pour récupérer les frais
import { columns } from "./columns";
import { DataTable } from "./data-table";

// Définition d'un type étendu pour les données affichées dans la table
type PaiementDisplay = Paiement & {
  eleve?: Eleve;
  frais?: Frais;
};

interface PaiementListClientProps {
  initialPaiements: PaiementDisplay[];
}

export function PaiementListClient({
  initialPaiements,
}: PaiementListClientProps) {
  const [paiements, setPaiements] =
    useState<PaiementDisplay[]>(initialPaiements);

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    // S'abonner aux changements en temps réel sur la table 'paiement'
    const channel = supabase
      .channel("paiement_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "paiement" },
        async (payload) => {
          if (!isMounted) return;

          let paiementData: Paiement;
          let paiementWithRelations: PaiementDisplay;

          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            paiementData = payload.new as Paiement;

            // Récupérer les données liées pour l'affichage
            let eleveData: Eleve | undefined = undefined;
            if (paiementData.ideleve) {
              const { data: fetchedEleve, success: eleveSuccess } =
                await getEleveById(paiementData.ideleve);
              if (eleveSuccess && fetchedEleve) {
                eleveData = fetchedEleve;
              }
            }

            let fraisData: Frais | undefined = undefined;
            if (paiementData.idfrais) {
              const { data: fetchedFrais, success: fraisSuccess } =
                await getFraisById(paiementData.idfrais);
              if (fraisSuccess && fetchedFrais) {
                fraisData = fetchedFrais;
              }
            }

            paiementWithRelations = {
              ...paiementData,
              eleve: eleveData,
              frais: fraisData,
            };
          } else {
            // DELETE
            paiementWithRelations = payload.old as Paiement; // Utilisez les anciennes données pour le filtrage de suppression
          }

          if (payload.eventType === "INSERT") {
            setPaiements((prev) => [paiementWithRelations, ...prev]);
            toast.success("Nouveau paiement ajouté en temps réel !");
          } else if (payload.eventType === "UPDATE") {
            setPaiements((prev) =>
              prev.map((p) =>
                p.idpaiement === paiementWithRelations.idpaiement
                  ? paiementWithRelations
                  : p
              )
            );
            toast.info("Paiement mis à jour en temps réel !");
          } else if (payload.eventType === "DELETE") {
            setPaiements((prev) =>
              prev.filter(
                (p) => p.idpaiement !== paiementWithRelations.idpaiement
              )
            );
            toast.warning("Paiement supprimé en temps réel !");
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Realtime subscription to paiement table is active!");
        } else if (status === "CHANNEL_ERROR") {
          console.error("Realtime subscription error:", status);
          toast.error("Erreur de connexion en temps réel aux paiements.");
        }
      });

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []); // Dépendances vides pour n'exécuter qu'une seule fois au montage

  return <DataTable columns={columns} data={paiements} />;
}
