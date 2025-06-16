"use client";

import { DataTable } from "@/components/data-table";
import { PaiementDisplay, paiementsColumns } from "./columns";

interface PaiementListClientProps {
  initialPaiements: PaiementDisplay[];
}

export function PaiementListClient({
  initialPaiements,
}: PaiementListClientProps) {
  return (
    <>
      {initialPaiements && initialPaiements.length > 0 ? (
        <DataTable columns={paiementsColumns} data={initialPaiements} />
      ) : (
        <div className="mt-8 p-6 bg-card rounded-lg shadow-md text-center">
          <p className="text-xl text-gray-700 dark:text-gray-300">
            Aucun paiement trouvé pour vos enfants.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            L&apos;historique des transactions apparaîtra ici.
          </p>
        </div>
      )}
    </>
  );
}
