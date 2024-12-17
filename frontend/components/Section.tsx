import { PropsWithChildren } from "react"
import { cn } from "@/lib/utils"

/* Ce composant permet de définir les dimansions d'une section */
export const Section = (props: PropsWithChildren<{className?: string}>) => {
    return <section className={cn("max-w-full px-4 m-auto", props.children)}> 
        {props.children}
    </section>
}