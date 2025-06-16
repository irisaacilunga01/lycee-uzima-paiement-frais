// app/dashboard/page.tsx
import { DashboardCards } from "@/components/dashboard-cards";
import { DashboardChart } from "@/components/dashboard-chart";
import { DashboardRecentActivity } from "@/components/dashboard-recent-activity";
import { toast } from "sonner";
import { getTotalClasses } from "../actions/classes";
import { getTotalEleves } from "../actions/eleves";
import { getRecentInscriptions } from "../actions/inscriptions";
import {
  getMonthlyPaiements,
  getPendingPaiementsCount,
  getTotalMontantPaiements,
} from "../actions/paiement";

export default async function DashboardPage() {
  const RECENT_NUMBER_INSCRIPTIONS = 7; // nombre des derniers inscriptions à afficher !!!
  // Récupération des données pour les cartes (KPIs)
  const [
    { count: totalEleves, error: elevesError, success: elevesSuccess },
    { count: totalClasses, error: classesError, success: classesSuccess },
    {
      total: totalPaiements,
      error: totalPaiementsError,
      success: totalPaiementsSuccess,
    },
    {
      count: pendingPaiements,
      error: pendingPaiementsError,
      success: pendingPaiementsSuccess,
    },
  ] = await Promise.all([
    getTotalEleves(),
    getTotalClasses(),
    getTotalMontantPaiements(),
    getPendingPaiementsCount(),
  ]);

  if (
    !elevesSuccess ||
    !classesSuccess ||
    !totalPaiementsSuccess ||
    !pendingPaiementsSuccess
  ) {
    toast.error(
      "Erreur lors du chargement des données des cartes du tableau de bord."
    );
    console.error(
      "Dashboard Cards Errors:",
      elevesError,
      classesError,
      totalPaiementsError,
      pendingPaiementsError
    );
  }

  // Récupération des données pour le graphique (paiements mensuels sur 6 mois)
  const now = new Date();
  const endDate = now.toISOString().split("T")[0]; // Date d'aujourd'hui
  const startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1)
    .toISOString()
    .split("T")[0]; // 6 mois en arrière

  const {
    data: monthlyPaymentsData,
    error: monthlyPaymentsError,
    success: monthlyPaymentsSuccess,
  } = await getMonthlyPaiements(startDate, endDate);

  if (!monthlyPaymentsSuccess) {
    toast.error(
      "Erreur lors du chargement des données du graphique des paiements mensuels."
    );
    console.error("Dashboard Chart Error:", monthlyPaymentsError);
  }

  // Récupération des données pour le tableau d'activité récente (5 dernières inscriptions)
  const {
    data: recentInscriptionsData,
    error: recentInscriptionsError,
    success: recentInscriptionsSuccess,
  } = await getRecentInscriptions(RECENT_NUMBER_INSCRIPTIONS);

  if (!recentInscriptionsSuccess) {
    toast.error("Erreur lors du chargement des inscriptions récentes.");
    console.error(
      "Dashboard Recent Inscriptions Error:",
      recentInscriptionsError
    );
  }

  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <DashboardCards
              totalEleves={totalEleves || 0}
              totalClasses={totalClasses || 0}
              totalPaiements={totalPaiements || 0}
              pendingPaiements={pendingPaiements || 0}
            />
            <div className="px-4 lg:px-6">
              <DashboardChart initialChartData={monthlyPaymentsData || []} />
            </div>
            <DashboardRecentActivity
              initialRecentInscriptions={recentInscriptionsData || []}
              recentNumber={RECENT_NUMBER_INSCRIPTIONS.toString()}
            />
          </div>
        </div>
      </div>
    </>
  );
}
