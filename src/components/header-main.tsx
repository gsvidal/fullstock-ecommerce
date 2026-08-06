import { Link } from "react-router";
import HeaderActions from "./header-actions";
import MainNav from "./main-nav";
import { Container, Separator } from "./ui";
import logo from "../assets/fullstock-logo.svg";

export default function HeaderMain() {
  return (
    <Container className="relative">
      <div className="flex h-12 items-center justify-between">
        <Link to="/">
          <img src={logo} alt="FullStock inicio" width="128" height="32" />
        </Link>
        <HeaderActions />
      </div>
      <Separator className="block sm:hidden" />
      <MainNav />
    </Container>
  );
}
