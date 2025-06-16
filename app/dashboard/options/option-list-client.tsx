// app/options/option-list-client.tsx
"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Option } from "@/type"; // Assurez-vous que ce chemin est correct
import { createClient } from "@/lib/supabase/client"; // Importez le client Supabase côté client
import { toast } from "sonner";

interface OptionListClientProps {
  initialOptions: Option[];
}

export function OptionListClient({ initialOptions }: OptionListClientProps) {
  const [options, setOptions] = useState<Option[]>(initialOptions);

  useEffect(() => {
    const supabase = createClient(); // Créez le client Supabase
    let isMounted = true; // Pour gérer le démontage du composant

    // S'abonner aux changements en temps réel sur la table 'option'
    const channel = supabase
      .channel("option_changes") // Nom du canal
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "option" },
        (payload) => {
          if (!isMounted) return;

          // Gérer les différents types d'événements
          if (payload.eventType === "INSERT") {
            setOptions((prev) => [...prev, payload.new as Option]);
            toast.success("Nouvelle option ajoutée en temps réel !");
          } else if (payload.eventType === "UPDATE") {
            setOptions((prev) =>
              prev.map((o) =>
                o.idoption === (payload.new as Option).idoption
                  ? (payload.new as Option)
                  : o
              )
            );
            toast.info("Option mise à jour en temps réel !");
          } else if (payload.eventType === "DELETE") {
            setOptions((prev) =>
              prev.filter(
                (o) => o.idoption !== (payload.old as Option).idoption
              )
            );
            toast.warning("Option supprimée en temps réel !");
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Realtime subscription to options table is active!");
        } else if (status === "CHANNEL_ERROR") {
          console.error("Realtime subscription error:", status);
          toast.error("Erreur de connexion en temps réel aux options.");
        }
      });

    // Nettoyer l'abonnement lors du démontage du composant
    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []); // Dépendances vides pour n'exécuter qu'une seule fois au montage

  return <DataTable columns={columns} data={options} />;
}
