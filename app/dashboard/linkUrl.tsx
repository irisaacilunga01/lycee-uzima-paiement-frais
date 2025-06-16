"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createClient } from "@/lib/supabase/client";
import { capitalize } from "@/lib/utils";
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
import { Moon, Sun, User, UserCog } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";

function LinkUrl({ email = "" }) {
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };
  return (
    <>
      <nav className="flex flex-col items-center gap-1 px-1 sm:py-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                  pathname == "/dashboard" ? "bg-muted text-primary" : null
                }`}
              >
                <IconHomeFilled className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Dashboard</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/classes"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                  pathname.includes("/dashboard/classes")
                    ? "bg-secondary-foreground text-primary"
                    : null
                }`}
              >
                <IconBuildingWarehouse className="h-5 w-5" />
                <span className="sr-only">Classes</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Classes</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/anneescolaires"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                  pathname.includes("/dashboard/anneescolaires")
                    ? "bg-secondary-foreground text-primary"
                    : null
                }`}
              >
                <IconCalendarTime className="h-5 w-5" />
                <span className="sr-only">Années Scolaires</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Années Scolaires</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/eleves"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                  pathname.includes("/dashboard/eleves")
                    ? "bg-secondary-foreground text-primary"
                    : null
                }`}
              >
                <IconManFilled className="h-5 w-5" />
                <span className="sr-only">Elèves</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Elèves</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/frais"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                  pathname.includes("/dashboard/frais")
                    ? "bg-secondary-foreground text-primary"
                    : null
                }`}
              >
                <IconCashRegister className="h-5 w-5" />

                <span className="sr-only">Frais</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Frais</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/inscriptions"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                  pathname.includes("/dashboard/inscriptions")
                    ? "bg-secondary-foreground text-primary"
                    : null
                }`}
              >
                <IconBooks className="h-5 w-5" />
                <span className="sr-only">Inscriptions</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Inscriptions</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/notifications"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                  pathname.includes("/dashboard/notifications")
                    ? "bg-secondary-foreground text-primary"
                    : null
                }`}
              >
                <IconBellFilled className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Notifications</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/options"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                  pathname.includes("/dashboard/options")
                    ? "bg-secondary-foreground text-primary"
                    : null
                }`}
              >
                <IconDotsCircleHorizontal className="h-5 w-5" />
                <span className="sr-only">Options</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Options</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/paiements"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                  pathname.includes("/dashboard/paiements")
                    ? "bg-secondary-foreground text-primary"
                    : null
                }`}
              >
                <IconBrandPaypalFilled className="h-5 w-5" />
                <span className="sr-only">Paiements</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Paiements</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/parents"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                  pathname.includes("/dashboard/parents")
                    ? "bg-secondary-foreground text-primary"
                    : null
                }`}
              >
                <IconFriends className="h-5 w-5" />
                <span className="sr-only">Parents</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Parents</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/users"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                  pathname.includes("/dashboard/users")
                    ? "bg-secondary-foreground text-primary"
                    : null
                }`}
              >
                <UserCog className="h-5 w-5" />
                <span className="sr-only">Utilisateurs</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Utilisateurs</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="w-7 h-7">
              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Changer de thème</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Clair
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Sombre
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              Système
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="w-7 h-7 bg-blue-700 cursor-pointer" asChild>
              <User className="p-1" />
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              Le (la) {capitalize(email.split("@")[0])}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-sm font-thin">
              {email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>Se déconnecter</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </>
  );
}

export default LinkUrl;
