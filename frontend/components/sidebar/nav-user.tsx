"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
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

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-muted transition duration-200">
          <Avatar className="h-10 w-10 border-2 border-primary shadow-md">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-primary text-white">
              {user.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="text-left">
            <p className="text-base font-semibold text-primary">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
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
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
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
            onClick={() => alert("Déconnexion")}
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
