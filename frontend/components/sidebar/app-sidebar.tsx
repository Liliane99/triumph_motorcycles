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

const data = {
  user: {
    name: "Ines",
    email: "ines@example.com",
    avatar: "/avatars/user.jpg", 
  },
  navMain: [
    {
      title: "Accueil",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Gestion des motos",
      url: "#",
      icon: List,
      items: [
        { title: "Motos", url: "/dashboard/motos" },
        { title: "Locations", url: "/dashboard/rental" },
        { title: "Essais", url: "/dashboard/trials" },
        { title: "Entretiens", url: "/dashboard/maintenance" },
        { title: "Incidents", url: "/dashboard/incidents" },
      ],
    },
    {
      title: "Pièces détachées",
      url: "#",
      icon: Package,
    },
    {
      title: "Commandes",
      url: "/dashboard/orders",
      icon: ShoppingBag,
    },
    {
      title: "Clients",
      url: "/dashboard/clients",
      icon: User,
    },
    {
      title: "Utilisateurs",
      url: "/dashboard/users",
      icon: User,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#dashboard">
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
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} /> 
      </SidebarFooter>
    </Sidebar>
  );
}
