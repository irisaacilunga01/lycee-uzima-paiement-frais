// app/parents/parent-list-client.tsx
"use client";

import { createClient } from "@/lib/supabase/client"; // Importez le client Supabase côté client
import { Parent } from "@/type";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { columns } from "./columns";
import { DataTable } from "./data-table";

interface ParentListClientProps {
  initialParents: Parent[];
}

export function ParentListClient({ initialParents }: ParentListClientProps) {
  const [parents, setParents] = useState<Parent[]>(initialParents);

  useEffect(() => {
    const supabase = createClient(); // Créez le client Supabase

    let isMounted = true; // Pour gérer le démontage du composant

    // S'abonner aux changements en temps réel sur la table 'parent'
    const channel = supabase
      .channel("parent_changes") // Nom du canal
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "parent" },
        (payload) => {
          if (!isMounted) return;

          // Gérer les différents types d'événements
          if (payload.eventType === "INSERT") {
            setParents((prev) => [...prev, payload.new as Parent]);
            toast.success("Nouveau parent ajouté en temps réel !");
          } else if (payload.eventType === "UPDATE") {
            setParents((prev) =>
              prev.map((p) =>
                p.idparent === (payload.new as Parent).idparent
                  ? (payload.new as Parent)
                  : p
              )
            );
            toast.info("Parent mis à jour en temps réel !");
          } else if (payload.eventType === "DELETE") {
            setParents((prev) =>
              prev.filter(
                (p) => p.idparent !== (payload.old as Parent).idparent
              )
            );
            toast.warning("Parent supprimé en temps réel !");
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Realtime subscription to parents table is active!");
        } else if (status === "CHANNEL_ERROR") {
          console.error("Realtime subscription error:", status);
          toast.error("Erreur de connexion en temps réel aux parents.");
        }
      });

    // Nettoyer l'abonnement lors du démontage du composant
    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []); // Dépendances vides pour n'exécuter qu'une seule fois au montage

  return <DataTable columns={columns} data={parents} />;
}
