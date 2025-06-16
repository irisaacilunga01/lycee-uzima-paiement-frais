// components/dashboard-chart.tsx
"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile"; // Assurez-vous que ce hook existe

interface MonthlyPaymentData {
  month: string; // Format YYYY-MM
  total_amount: number;
}

interface DashboardChartProps {
  initialChartData: MonthlyPaymentData[];
}

const chartConfig = {
  total_amount: {
    label: "Montant (€)",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function DashboardChart({ initialChartData }: DashboardChartProps) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d"); // 3 derniers mois par défaut
  const [filteredData, setFilteredData] =
    React.useState<MonthlyPaymentData[]>(initialChartData);

  // Mettez à jour les données filtrées lorsque timeRange ou initialChartData changent
  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d"); // Pour mobile, affichage par défaut sur les 7 derniers jours si c'est pertinent
    }
  }, [isMobile]);

  React.useEffect(() => {
    const filterChartData = (data: MonthlyPaymentData[], range: string) => {
      const now = new Date();
      let monthsToSubtract = 3; // Pour "90d" (3 mois)

      if (range === "30d") {
        monthsToSubtract = 1; // Pour "30d" (1 mois)
      } else if (range === "7d") {
        // Pour "7d", nous devons filtrer les paiements des 7 derniers jours.
        // Puisque nos données sont agrégées par mois, ce filtre sera moins précis pour 7 jours.
        // Nous allons simplement montrer le mois actuel si le range est très court.
        // Une implémentation plus fine nécessiterait des données journalières.
        // Pour cet exemple, nous allons limiter au mois le plus récent qui contient des données.
        if (data.length > 0) {
          const lastMonth = data[data.length - 1].month;
          return data.filter((item) => item.month === lastMonth);
        }
        return [];
      }

      const minDate = new Date(
        now.getFullYear(),
        now.getMonth() - monthsToSubtract,
        1
      );

      return data.filter((item) => {
        const [year, month] = item.month.split("-").map(Number);
        const itemDate = new Date(year, month - 1, 1); // Mois est 0-indexé
        return itemDate >= minDate;
      });
    };

    setFilteredData(filterChartData(initialChartData, timeRange));
  }, [initialChartData, timeRange]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Paiements Mensuels</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Montant total des paiements par mois
          </span>
          <span className="@[540px]/card:hidden">Paiements par mois</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">3 derniers mois</ToggleGroupItem>
            <ToggleGroupItem value="30d">30 derniers jours</ToggleGroupItem>
            <ToggleGroupItem value="7d">7 derniers jours</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Sélectionnez une période"
            >
              <SelectValue placeholder="3 derniers mois" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                3 derniers mois
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                30 derniers jours
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                7 derniers jours
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillTotalAmount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-total_amount)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-total_amount)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const [year, month] = value.split("-");
                const date = new Date(Number(year), Number(month) - 1, 1);
                return date.toLocaleDateString("fr-FR", {
                  month: "short",
                  year: "2-digit",
                });
              }}
            />
            <YAxis
              tickFormatter={(value) => `${value}Fc`} // Formatage de l'axe Y
              axisLine={false}
              tickLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={0}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const [year, month] = value.split("-");
                    const date = new Date(Number(year), Number(month) - 1, 1);
                    return date.toLocaleDateString("fr-FR", {
                      month: "long",
                      year: "numeric",
                    });
                  }}
                  formatter={(value, name) => {
                    if (name === "total_amount") {
                      return [
                        new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "CDF",
                        }).format(Number(value)),
                        "Montant total",
                      ];
                    }
                    return [value, name];
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="total_amount"
              type="natural"
              fill="url(#fillTotalAmount)"
              stroke="var(--color-total_amount)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
