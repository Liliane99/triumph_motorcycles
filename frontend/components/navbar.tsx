"use client"
import React, { useState } from "react"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "./ui/navigation-menu"
import { ChevronDown, Menu, X } from "lucide-react"

const navigationMenuItemStyle =
  "inline-flex h-9 w-max items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black focus:bg-white focus:text-black focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-white data-[state=open]:bg-white"

const loginButtonStyle = "text-sm font-medium text-white no-underline cursor-pointer"

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="flex items-center justify-between bg-black px-4 py-2 text-white">
      <div className="flex items-center space-x-4">
        <span className="text-lg font-bold">Triumph</span>
        <img src="/images/logo-triumph.jpeg" alt="Logo Triumph" className="h-8" />
      </div>

      <NavigationMenu className="flex-1 mx-4">
        <NavigationMenuList className="flex items-center justify-center space-x-4 hidden md:flex">
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/"
              className={`${navigationMenuItemStyle}`}
            >
              Accueil
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink href="/moto" className={navigationMenuItemStyle}>
              Moto
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink className={navigationMenuItemStyle}>
              Essai moto
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              href="/apropos"
              className={`${navigationMenuItemStyle}`}
            >
              À propos
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Bouton Connexion à gauche */}
      <div className="flex items-center justify-start">
        <a
          href="/login"
          className={loginButtonStyle}
        >
          Connexion
        </a>
      </div>

      <div className="md:hidden">
        <button onClick={toggleMenu} className="text-white">
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="absolute top-0 left-0 w-full bg-black text-white z-10 md:hidden">
          <NavigationMenu className="flex flex-col items-center space-y-4 py-4">
            <NavigationMenuList className="flex flex-col items-center space-y-4 py-4">
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/"
                  className={`${navigationMenuItemStyle}`}
                >
                  Accueil
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuItemStyle}>
                  Moto
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuItemStyle}>
                  Essai moto
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/about"
                  className={`${navigationMenuItemStyle}`}
                >
                  À propos
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Ajout du lien "Connexion" dans le menu mobile */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/login"
                  className={`${navigationMenuItemStyle}`}
                >
                  Connexion
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      )}
    </div>
  )
}

export default Nav
