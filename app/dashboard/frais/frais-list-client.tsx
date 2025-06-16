// app/frais/frais-list-client.tsx
"use client";

import { createClient } from "@/lib/supabase/client";
import { Anneescolaire, Frais } from "@/type"; // Assurez-vous que les types sont corrects
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getAnneescolaireById } from "../../actions/anneescolaire";
import { columns } from "./columns";
import { DataTable } from "./data-table";

// Définition d'un type étendu pour les données affichées dans la table
type FraisDisplay = Frais & {
  anneescolaire?: Anneescolaire; // La relation anneescolaire est incluse pour l'affichage
};

interface FraisListClientProps {
  initialFrais: FraisDisplay[];
}

export function FraisListClient({ initialFrais }: FraisListClientProps) {
  const [frais, setFrais] = useState<FraisDisplay[]>(initialFrais);

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    // S'abonner aux changements en temps réel sur la table 'frais'
    const channel = supabase
      .channel("frais_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "frais" },
        async (payload) => {
          if (!isMounted) return;

          let fraisData: Frais;
          let fraisWithRelation: FraisDisplay;

          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            fraisData = payload.new as Frais;
            let anneescolaireData: Anneescolaire | undefined = undefined;

            if (fraisData.idanneescolaire) {
              const {
                data: fetchedAnneeScolaire,
                success: anneeScolaireSuccess,
              } = await getAnneescolaireById(fraisData.idanneescolaire);
              if (anneeScolaireSuccess && fetchedAnneeScolaire) {
                anneescolaireData = fetchedAnneeScolaire;
              }
            }
            fraisWithRelation = {
              ...fraisData,
              anneescolaire: anneescolaireData,
            };
          } else {
            // DELETE
            fraisWithRelation = payload.old as Frais; // Pour la suppression, on utilise les anciennes données pour le filtrage
          }

          if (payload.eventType === "INSERT") {
            setFrais((prev) => [fraisWithRelation, ...prev]);
            toast.success("Nouveau frais ajouté en temps réel !");
          } else if (payload.eventType === "UPDATE") {
            setFrais((prev) =>
              prev.map((f) =>
                f.idfrais === fraisWithRelation.idfrais ? fraisWithRelation : f
              )
            );
            toast.info("Frais mis à jour en temps réel !");
          } else if (payload.eventType === "DELETE") {
            setFrais((prev) =>
              prev.filter((f) => f.idfrais !== fraisWithRelation.idfrais)
            );
            toast.warning("Frais supprimé en temps réel !");
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Realtime subscription to frais table is active!");
        } else if (status === "CHANNEL_ERROR") {
          console.error("Realtime subscription error:", status);
          toast.error("Erreur de connexion en temps réel aux frais.");
        }
      });

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []); // Dépendances vides pour n'exécuter qu'une seule fois au montage

  return <DataTable columns={columns} data={frais} />;
}
