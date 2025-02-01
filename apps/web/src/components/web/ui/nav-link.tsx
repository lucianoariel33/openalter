"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ComponentProps } from "react"
import { cva, cx } from "~/utils/cva"

const navLinkVariants = cva({
  base: "group flex items-center gap-2 p-0.5 -m-0.5 text-sm cursor-pointer disabled:opacity-50",

  variants: {
    isActive: {
      true: "font-medium text-foreground",
      false: "text-muted hover:text-foreground",
    },
  },

  defaultVariants: {
    isActive: false,
  },
})

const isItemActive = (href: string | undefined, pathname: string, exact = false) => {
  if (href && href !== "/") {
    return exact ? pathname === href : pathname.includes(href)
  }

  return false
}

type NavLinkProps = ComponentProps<"a"> &
  ComponentProps<typeof Link> & {
    exact?: boolean
  }

const NavLink = ({ className, exact, ...props }: NavLinkProps) => {
  const pathname = usePathname()
  const isActive = isItemActive(props.href, pathname, exact)

  return (
    <Link prefetch={false} className={cx(navLinkVariants({ isActive, className }))} {...props} />
  )
}

export { NavLink, navLinkVariants }
