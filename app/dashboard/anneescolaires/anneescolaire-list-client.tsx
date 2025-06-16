// app/anneescolaire/anneescolaire-list-client.tsx
"use client";

import { createClient } from "@/lib/supabase/client"; // Importez le client Supabase côté client
import { Anneescolaire } from "@/type"; // Assurez-vous que ce chemin est correct
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { columns } from "./columns";
import { DataTable } from "./data-table";

interface AnneescolaireListClientProps {
  initialAnneescolaires: Anneescolaire[];
}

export function AnneescolaireListClient({
  initialAnneescolaires,
}: AnneescolaireListClientProps) {
  const [anneescolaires, setAnneescolaires] = useState<Anneescolaire[]>(
    initialAnneescolaires
  );

  useEffect(() => {
    const supabase = createClient(); // Créez le client Supabase
    let isMounted = true; // Pour gérer le démontage du composant

    // S'abonner aux changements en temps réel sur la table 'anneescolaire'
    const channel = supabase
      .channel("anneescolaire_changes") // Nom du canal
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "anneescolaire" },
        (payload) => {
          if (!isMounted) return;

          // Gérer les différents types d'événements
          if (payload.eventType === "INSERT") {
            setAnneescolaires((prev) => [
              ...prev,
              payload.new as Anneescolaire,
            ]);
            toast.success("Nouvelle année scolaire ajoutée en temps réel !");
          } else if (payload.eventType === "UPDATE") {
            setAnneescolaires((prev) =>
              prev.map((a) =>
                a.idanneescolaire ===
                (payload.new as Anneescolaire).idanneescolaire
                  ? (payload.new as Anneescolaire)
                  : a
              )
            );
            toast.info("Année scolaire mise à jour en temps réel !");
          } else if (payload.eventType === "DELETE") {
            setAnneescolaires((prev) =>
              prev.filter(
                (a) =>
                  a.idanneescolaire !==
                  (payload.old as Anneescolaire).idanneescolaire
              )
            );
            toast.warning("Année scolaire supprimée en temps réel !");
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log(
            "Realtime subscription to anneescolaire table is active!"
          );
        } else if (status === "CHANNEL_ERROR") {
          console.error("Realtime subscription error:", status);
          toast.error(
            "Erreur de connexion en temps réel aux années scolaires."
          );
        }
      });

    // Nettoyer l'abonnement lors du démontage du composant
    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []); // Dépendances vides pour n'exécuter qu'une seule fois au montage

  return <DataTable columns={columns} data={anneescolaires} />;
}
