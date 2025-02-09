"use client";

import { Home, List, Package, User, ShoppingBag } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { useAuth } from "@/hooks/useAuth";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const isAdminOrManager = user?.role === "admin" || user?.role === "manager";

  const navMain = [
    { title: "Accueil", url: "/dashboard", icon: Home },
    {
      title: "Gestion des motos",
      url: "#",
      icon: List,
      items: [
        { title: "Motos", url: "/dashboard/motos" },
        { title: "Locations", url: "/dashboard/rental" },
        ...(isAdminOrManager ? [{ title: "Essais", url: "/dashboard/trials" }] : []),
        { title: "Entretiens", url: "/dashboard/maintenance" },
        { title: "Incidents", url: "/dashboard/incidents" },
      ],
    },
    ...(isAdminOrManager ? [{ title: "Pièces détachées", url: "/dashboard/parts", icon: Package }] : []),
    ...(isAdminOrManager ? [{ title: "Commandes", url: "/dashboard/orders", icon: ShoppingBag }] : []),
    ...(isAdminOrManager ? [{ title: "Clients", url: "/dashboard/clients", icon: User }] : []),
  ];

  if (isAdminOrManager) {
    navMain.push({ title: "Utilisateurs", url: "/dashboard/users", icon: User });
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <User className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-base leading-tight">
                  <span className="truncate font-semibold">Triumph Motorcycle</span>
                  <span className="truncate text-xs">Gestion de flotte</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
