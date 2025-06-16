// app/classe/classe-list-client.tsx
"use client";

import { createClient } from "@/lib/supabase/client";
import { Classe, Option } from "@/type"; // Assurez-vous que les types sont corrects
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getOptionById } from "../../actions/options";
import { columns } from "./columns";
import { DataTable } from "./data-table"; // Réutilisation du composant DataTable générique

// Définition d'un type étendu pour les données affichées dans la table
type ClasseDisplay = Classe & {
  option?: Option; // La relation option est incluse pour l'affichage
};

interface ClasseListClientProps {
  initialClasses: ClasseDisplay[];
}

export function ClasseListClient({ initialClasses }: ClasseListClientProps) {
  const [classes, setClasses] = useState<ClasseDisplay[]>(initialClasses);

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    // S'abonner aux changements en temps réel sur la table 'classe'
    const channel = supabase
      .channel("classe_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "classe" },
        async (payload) => {
          if (!isMounted) return;

          let classeWithOption: ClasseDisplay;

          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            const currentClasse = payload.new as Classe;
            let optionData: Option | undefined = undefined;

            if (currentClasse.idoption) {
              const { data: fetchedOption, success: optionSuccess } =
                await getOptionById(currentClasse.idoption);
              if (optionSuccess && fetchedOption) {
                optionData = fetchedOption;
              }
            }
            classeWithOption = { ...currentClasse, option: optionData };
          } else {
            // DELETE
            classeWithOption = payload.old as Classe; // Pour la suppression, on utilise les anciennes données pour le filtrage
          }

          if (payload.eventType === "INSERT") {
            setClasses((prev) => [classeWithOption, ...prev]);
            toast.success("Nouvelle classe ajoutée en temps réel !");
          } else if (payload.eventType === "UPDATE") {
            setClasses((prev) =>
              prev.map((c) =>
                c.idclasse === classeWithOption.idclasse ? classeWithOption : c
              )
            );
            toast.info("Classe mise à jour en temps réel !");
          } else if (payload.eventType === "DELETE") {
            setClasses((prev) =>
              prev.filter((c) => c.idclasse !== classeWithOption.idclasse)
            );
            toast.warning("Classe supprimée en temps réel !");
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Realtime subscription to classe table is active!");
        } else if (status === "CHANNEL_ERROR") {
          console.error("Realtime subscription error:", status);
          toast.error("Erreur de connexion en temps réel aux classes.");
        }
      });

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []); // Dépendances vides pour n'exécuter qu'une seule fois au montage

  return <DataTable columns={columns} data={classes} />;
}
