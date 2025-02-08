"use client";

import { useEffect, useState } from "react";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { User, Lock, LogOut } from "lucide-react"; 
import { useAuth } from "@/hooks/useAuth";
import { getUserById, User as UserType } from "@/lib/api";
import { toast } from "react-toastify";

export function NavUser() {
  const { user: authUser, logout } = useAuth();
  const [userData, setUserData] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchUserProfile() {
      if (!authUser) return;

      try {
        const fetchedUser = await getUserById(authUser.userId);
        if (!fetchedUser) {
          toast.error("Impossible de charger le profil.");
          return;
        }

        const formattedUser: UserType = {
          id: fetchedUser.id,
          username: fetchedUser.username.value,
          email: fetchedUser.email.value,
          role: fetchedUser.role.value,
          createdByName: "N/A",
          updatedByName: "N/A",
          createdAt: fetchedUser.createdAt,
          updatedAt: fetchedUser.updatedAt,
        };

        setUserData(formattedUser);
      } catch {
        toast.error("Erreur lors du chargement du profil.");
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, [authUser]);

  if (loading) return null;
  if (!userData) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0]?.toUpperCase() || "")
      .join("")
      .slice(0, 2); 
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-muted transition duration-200">
          <Avatar className="h-10 w-10 border-2 border-primary shadow-md">
            <AvatarFallback className="bg-primary text-white">
              {getInitials(userData.username)}
            </AvatarFallback>
          </Avatar>
          <div className="text-left">
            <p className="text-base font-semibold text-primary">
              {userData.username}
            </p>
            <p className="text-sm text-muted-foreground">
              {userData.email}
            </p>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-56 rounded-md shadow-lg border border-border bg-background"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">{userData.username}</p>
            <p className="text-xs text-muted-foreground">{userData.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/user/profile" className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span>Profil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/users/change-password" className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <span>Mot de passe</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={logout}
            className="flex items-center gap-2 text-base cursor-pointer hover:text-red-600"
          >
            <LogOut className="w-4 h-4 text-muted-foreground" />
            <span>Se déconnecter</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
