import AuthNav from "../auth-nav";
import HeaderMain from "../header-main";

type HeaderProps = {
  className?: string;
};

export default function Header({ className }: HeaderProps) {
  return (
    <header className={className}>
      <AuthNav />
      <HeaderMain />
    </header>
  );
}
