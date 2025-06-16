"use client";

import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { createClient } from "@/lib/supabase/client";
import {
  IconBellFilled,
  IconBooks,
  IconBrandPaypalFilled,
  IconBuildingWarehouse,
  IconCalendarTime,
  IconCashRegister,
  IconDotsCircleHorizontal,
  IconFriends,
  IconHomeFilled,
  IconManFilled,
} from "@tabler/icons-react";
import { Package2, PanelLeft } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function LinkUrlMobile() {
  const router = useRouter();
  const pathname = usePathname();
  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <DialogTitle className="sr-only">Toggle thème</DialogTitle>
        <nav className="grid gap-2 text-lg font-medium">
          <Link
            href="#"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
          >
            <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">Lycée Uzima</span>
          </Link>
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
              pathname == "/dashboard" ? "bg-muted text-primary" : null
            }`}
          >
            <IconHomeFilled className="h-5 w-5" />
            <span className="text-sm">Dashboard</span>
          </Link>
          <Link
            href="/dashboard/classes"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
              pathname.includes("/dashboard/classes")
                ? "bg-secondary-foreground text-primary"
                : null
            }`}
          >
            <IconBuildingWarehouse className="h-5 w-5" />
            <span className="text-sm">Classes</span>
          </Link>
          <Link
            href="/dashboard/anneescolaires"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
              pathname.includes("/dashboard/anneescolaires")
                ? "bg-secondary-foreground text-primary"
                : null
            }`}
          >
            <IconCalendarTime className="h-5 w-5" />
            <span className="text-sm">Années Scolaires</span>
          </Link>
          <Link
            href="/dashboard/eleves"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
              pathname.includes("/dashboard/eleves")
                ? "bg-secondary-foreground text-primary"
                : null
            }`}
          >
            <IconManFilled className="h-5 w-5" />
            <span className="text-sm">Elèves</span>
          </Link>
          <Link
            href="/dashboard/frais"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
              pathname.includes("/dashboard/frais")
                ? "bg-secondary-foreground text-primary"
                : null
            }`}
          >
            <IconCashRegister className="h-5 w-5" />

            <span className="text-sm">Frais</span>
          </Link>
          <Link
            href="/dashboard/inscriptions"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
              pathname.includes("/dashboard/inscriptions")
                ? "bg-secondary-foreground text-primary"
                : null
            }`}
          >
            <IconBooks className="h-5 w-5" />
            <span className="text-sm">Inscriptions</span>
          </Link>
          <Link
            href="/dashboard/notifications"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
              pathname.includes("/dashboard/notifications")
                ? "bg-secondary-foreground text-primary"
                : null
            }`}
          >
            <IconBellFilled className="h-5 w-5" />
            <span className="text-sm">Notifications</span>
          </Link>
          <Link
            href="/dashboard/options"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
              pathname.includes("/dashboard/options")
                ? "bg-secondary-foreground text-primary"
                : null
            }`}
          >
            <IconDotsCircleHorizontal className="h-5 w-5" />
            <span className="text-sm">Options</span>
          </Link>
          <Link
            href="/dashboard/paiements"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
              pathname.includes("/dashboard/paiements")
                ? "bg-secondary-foreground text-primary"
                : null
            }`}
          >
            <IconBrandPaypalFilled className="h-5 w-5" />
            <span className="text-sm">Paiements</span>
          </Link>
          <Link
            href="/dashboard/parents"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
              pathname.includes("/dashboard/parents")
                ? "bg-secondary-foreground text-primary"
                : null
            }`}
          >
            <IconFriends className="h-5 w-5" />
            <span className="text-sm">Parents</span>
          </Link>
          <Button variant="outline" onClick={logout}>
            Se déconnecter
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
