// app/inscription/inscription-list-client.tsx
"use client";

import { getAnneescolaireById } from "@/app/actions/anneescolaire";
import { getClasseById } from "@/app/actions/classes";
import { getEleveById } from "@/app/actions/eleves";
import { createClient } from "@/lib/supabase/client";
import { Anneescolaire, Classe, Eleve, Inscription, Option } from "@/type"; // Importez tous les types
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { columns } from "./columns";
import { DataTable } from "./data-table"; // Réutilisation du composant DataTable générique

// Définition d'un type étendu pour les données affichées dans la table
type InscriptionDisplay = Inscription & {
  eleve?: Eleve;
  classe?: Classe & { option?: Option };
  anneescolaire?: Anneescolaire;
};

interface InscriptionListClientProps {
  initialInscriptions: InscriptionDisplay[];
}

export function InscriptionListClient({
  initialInscriptions,
}: InscriptionListClientProps) {
  const [inscriptions, setInscriptions] =
    useState<InscriptionDisplay[]>(initialInscriptions);

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    // S'abonner aux changements en temps réel sur la table 'inscription'
    const channel = supabase
      .channel("inscription_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "inscription" },
        async (payload) => {
          if (!isMounted) return;

          let inscriptionData: Inscription;
          let inscriptionWithRelations: InscriptionDisplay;

          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            inscriptionData = payload.new as Inscription;

            // Récupérer les données liées pour l'affichage
            const eleveRes = await getEleveById(inscriptionData.ideleve);
            const classeRes = await getClasseById(inscriptionData.idclasse);
            const anneescolaireRes = await getAnneescolaireById(
              inscriptionData.idanneescolaire
            );

            inscriptionWithRelations = {
              ...inscriptionData,
              eleve: eleveRes.success ? eleveRes.data : undefined,
              classe: classeRes.success ? classeRes.data : undefined,
              anneescolaire: anneescolaireRes.success
                ? anneescolaireRes.data
                : undefined,
            };
          } else {
            // DELETE
            inscriptionWithRelations = payload.old as Inscription; // Utilisez les anciennes données pour le filtrage de suppression
          }

          if (payload.eventType === "INSERT") {
            setInscriptions((prev) => [inscriptionWithRelations, ...prev]);
            toast.success("Nouvelle inscription ajoutée en temps réel !");
          } else if (payload.eventType === "UPDATE") {
            setInscriptions((prev) =>
              prev.map((i) =>
                i.ideleve === inscriptionWithRelations.ideleve &&
                i.idclasse === inscriptionWithRelations.idclasse &&
                i.idanneescolaire === inscriptionWithRelations.idanneescolaire
                  ? inscriptionWithRelations
                  : i
              )
            );
            toast.info("Inscription mise à jour en temps réel !");
          } else if (payload.eventType === "DELETE") {
            setInscriptions((prev) =>
              prev.filter(
                (i) =>
                  !(
                    i.ideleve === inscriptionWithRelations.ideleve &&
                    i.idclasse === inscriptionWithRelations.idclasse &&
                    i.idanneescolaire ===
                      inscriptionWithRelations.idanneescolaire
                  )
              )
            );
            toast.warning("Inscription supprimée en temps réel !");
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Realtime subscription to inscription table is active!");
        } else if (status === "CHANNEL_ERROR") {
          console.error("Realtime subscription error:", status);
          toast.error("Erreur de connexion en temps réel aux inscriptions.");
        }
      });

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return <DataTable columns={columns} data={inscriptions} />;
}
