import React from "react"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "./ui/navigation-menu"
import { cn } from "@/lib/utils" // Assurez-vous que cette fonction est disponible pour la gestion des classes
import Logo from "@/public/logo.png"; // Chemin vers ton logo

// Style commun pour les liens de la navigation
const navigationMenuItemStyle =
  "inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"

const Nav = () => {
  return (
    <NavigationMenu>

      {/* Conteneur pour le logo */}
      <div className="flex items-center space-x-4">
        <Image src={Logo} alt="Logo" width={50} height={50} /> 
        <span className="text-lg font-bold">MonSite</span> 
      </div>

      <NavigationMenuList>
        {/* Premier élément de navigation */}
        <NavigationMenuItem>
          <NavigationMenuLink href="/" className={navigationMenuItemStyle}>
            Accueil
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Deuxième élément de navigation */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Moto</NavigationMenuTrigger>
          <NavigationMenuContent>
          <div className="p-4">
              <ul className="space-y-2">
                    <li>
                        <NavigationMenuLink href="/about">
                        Nos motos
                        </NavigationMenuLink>
                    </li>
                    <li>
                        <NavigationMenuLink href="/about">
                        Nos pièce détachées
                        </NavigationMenuLink>
                    </li>
                </ul>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Troisième élément avec sous-menu */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Services</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="p-4">
              <ul className="space-y-2">
                <li>
                  <NavigationMenuLink href="/service1">
                    Réserver un essai moto
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink href="/service2">
                    Signaler un problème/incident
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink href="/service2">
                    Renseigner mon kilométrage
                  </NavigationMenuLink>
                </li>
              </ul>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Quatrième élément de navigation */}
        <NavigationMenuItem>
          <NavigationMenuLink href="/about" className={navigationMenuItemStyle}>
            À propos
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Ajouter d'autres éléments si nécessaire */}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export { Nav }
