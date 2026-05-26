import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import baktiLogo from "@/assets/logo-bakti.png";

interface HeaderProps {
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

const Header = ({ isLoggedIn, onLogout }: HeaderProps) => (
  <header className="bg-card/80 backdrop-blur-md border-b border-border py-3 px-4 no-print sticky top-0 z-50 shadow-sm">
    <div className="container mx-auto flex items-center justify-between">
      <div className="flex items-center gap-3 group cursor-default">
        <img src={baktiLogo} alt="Logo BAKTI Komdigi" className="h-10 w-auto" />
        <div className="hidden sm:block">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-foreground tracking-tight">Data Aset</span>
            <span className="text-lg font-extrabold text-primary">BAKTI</span>
          </div>
          <p className="text-[11px] text-muted-foreground font-medium tracking-wide">Kementerian Komunikasi dan Digital</p>
        </div>
      </div>
      {isLoggedIn && (
        <Button variant="outline" size="sm" onClick={onLogout} className="gap-2 text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors duration-200">
          <LogOut className="h-3.5 w-3.5" />
          Keluar
        </Button>
      )}
    </div>
  </header>
);

export default Header;
