// components/dashboard-cards.tsx
import {
  IconCash,
  IconHourglass,
  IconSchool,
  IconUsers,
} from "@tabler/icons-react";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DashboardCardsProps {
  totalEleves: number;
  totalClasses: number;
  totalPaiements: number;
  pendingPaiements: number;
}

export function DashboardCards({
  totalEleves,
  totalClasses,
  totalPaiements,
  pendingPaiements,
}: DashboardCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 px-4 lg:px-6 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:shadow-xs">
      {/* Carte des Élèves inscrits */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Élèves</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalEleves}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <IconUsers className="size-4" /> Élèves inscrits
          </div>
          <div className="text-muted-foreground">
            Nombre total d&apos;élèves enregistrés
          </div>
        </CardFooter>
      </Card>

      {/* Carte des Classes actives */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Classes Actives</CardDescription>
          <CardTitle className="2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalClasses}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <IconSchool className="size-4" /> Classes disponibles
          </div>
          <div className="text-muted-foreground">
            Nombre de classes configurées
          </div>
        </CardFooter>
      </Card>

      {/* Carte du Montant total des paiements */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Paiements</CardDescription>
          <CardTitle className="2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "CDF",
            }).format(totalPaiements)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <IconCash className="size-4" /> Montant cumulé
          </div>
          <div className="text-muted-foreground">Total des paiements reçus</div>
        </CardFooter>
      </Card>

      {/* Carte des Paiements en attente */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Paiements en Attente</CardDescription>
          <CardTitle className="2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {pendingPaiements}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <IconHourglass className="size-4" /> Transactions en cours
          </div>
          <div className="text-muted-foreground">
            Nombre de paiements non finalisés
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
