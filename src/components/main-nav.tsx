import { NavLink, type NavLinkRenderProps } from "react-router";
import { cn } from "../lib/cn";

const navLinkConst = ({ isActive }: NavLinkRenderProps) =>
  cn(
    "inline-flex items-center justify-center p-3 text-sm/6 font-medium text-muted-foreground transition-[background-color] duration-200 hover:bg-accent-background",
    isActive && "text-accent-foreground",
  );

export default function MainNav() {
  return (
    <nav
      aria-label="Navegación principal"
      className="static sm:absolute sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2"
    >
      <ul className="flex h-12 justify-center">
        <li className="flex justify-center">
          <NavLink to="/categories/polos" className={navLinkConst}>
            Polos
          </NavLink>
        </li>
        <li className="flex justify-center">
          <NavLink to="/categories/tazas" className={navLinkConst}>
            Tazas
          </NavLink>
        </li>
        <li className="flex justify-center">
          <NavLink to="/categories/stickers" className={navLinkConst}>
            Stickers
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
