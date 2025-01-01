"use client";
import Link from "next/link";
import classes from "./nav-link.module.css";

import { usePathname } from "next/navigation";

export default function NavLink({ href, children }) {
  const path = usePathname();
  const isActive = path.startsWith(href);

  return (
    <Link
      href={href}
      className={`${classes.link} ${isActive ? classes.active : ""}`}
    >
      {children}
    </Link>
  );
}
