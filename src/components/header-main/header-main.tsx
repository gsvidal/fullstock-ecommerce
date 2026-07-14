import { Link } from "react-router";
import HeaderActions from "../header-actions";
import MainNav from "../main-nav";
import { Container, Separator } from "../ui";
import styles from "./styles.module.css";
import logo from "../../assets/fullstock-logo.svg";

export default function HeaderMain() {
  return (
    <Container className={styles["header-main"]}>
      <div className={styles["header-main__top"]}>
        <Link to="/">
          <img src={logo} alt="FullStock inicio" width="128" height="32" />
        </Link>
        <HeaderActions />
      </div>
      <Separator className={styles["header-main__separator"]} />
      <MainNav />
    </Container>
  );
}
