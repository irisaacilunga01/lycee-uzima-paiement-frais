// app/eleve/eleve-list-client.tsx
"use client";

import { getParentById } from "@/app/actions/parents";
import { createClient } from "@/lib/supabase/client";
import { Eleve } from "@/type"; // Assurez-vous que le type est correct
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { columns } from "./columns";
import { DataTable } from "./data-table"; // Réutilisation du composant DataTable générique

// Définition d'un type étendu pour les données affichées dans la table
type EleveDisplay = Eleve & {
  parent_name?: string; // Nom du parent pour l'affichage
};

interface EleveListClientProps {
  initialEleves: EleveDisplay[];
}

export function EleveListClient({ initialEleves }: EleveListClientProps) {
  const [eleves, setEleves] = useState<EleveDisplay[]>(initialEleves);

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    // S'abonner aux changements en temps réel sur la table 'eleve'
    const channel = supabase
      .channel("eleve_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "eleve" },
        async (payload) => {
          if (!isMounted) return;

          let eleveWithParentName: EleveDisplay;

          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            const currentEleve = payload.new as Eleve;
            let parentName = "N/A";
            if (currentEleve.idparent) {
              const { data: parentData, success } = await getParentById(
                currentEleve.idparent
              );
              if (success && parentData) {
                parentName = `${parentData.nompere || ""} ${
                  parentData.nommere || ""
                }`.trim();
              }
            }
            eleveWithParentName = { ...currentEleve, parent_name: parentName };
          } else {
            // DELETE
            eleveWithParentName = payload.old as Eleve; // Pour la suppression, on utilise les anciennes données pour le filtrage
          }

          if (payload.eventType === "INSERT") {
            setEleves((prev) => [eleveWithParentName, ...prev]);
            toast.success("Nouvel élève ajouté en temps réel !");
          } else if (payload.eventType === "UPDATE") {
            setEleves((prev) =>
              prev.map((e) =>
                e.ideleve === eleveWithParentName.ideleve
                  ? eleveWithParentName
                  : e
              )
            );
            toast.info("Élève mis à jour en temps réel !");
          } else if (payload.eventType === "DELETE") {
            setEleves((prev) =>
              prev.filter((e) => e.ideleve !== eleveWithParentName.ideleve)
            );
            toast.warning("Élève supprimé en temps réel !");
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Realtime subscription to eleve table is active!");
        } else if (status === "CHANNEL_ERROR") {
          console.error("Realtime subscription error:", status);
          toast.error("Erreur de connexion en temps réel aux élèves.");
        }
      });

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []); // Dépendances vides pour n'exécuter qu'une seule fois au montage

  return <DataTable columns={columns} data={eleves} />;
}
