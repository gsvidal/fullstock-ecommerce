import { NavLink } from "react-router";
import clsx from "clsx";
import styles from "./styles.module.css";

export default function MainNav() {
  return (
    <nav aria-label="Navegación principal" className={styles["main-nav"]}>
      <ul className={styles["main-nav__list"]}>
        <li className={styles["main-nav__item"]}>
          <NavLink
            to="/categories/polos"
            className={({ isActive }) =>
              clsx(
                styles["main-nav__link"],
                isActive && styles["main-nav__link--active"],
              )
            }
          >
            Polos
          </NavLink>
        </li>
        <li className={styles["main-nav__item"]}>
          <NavLink
            to="/categories/tazas"
            className={({ isActive }) =>
              clsx(
                styles["main-nav__link"],
                isActive && styles["main-nav__link--active"],
              )
            }
          >
            Tazas
          </NavLink>
        </li>
        <li className={styles["main-nav__item"]}>
          <NavLink
            to="/categories/stickers"
            className={({ isActive }) =>
              clsx(
                styles["main-nav__link"],
                isActive && styles["main-nav__link--active"],
              )
            }
          >
            Stickers
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
