import { MapPin, Phone, Mail } from "lucide-react";

const TopBar = () => (
  <div className="topbar-gradient text-primary-foreground py-2 px-4 text-sm no-print">
    <div className="container mx-auto flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-4 flex-wrap">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          Centennial Tower Lt.42-45, Jakarta Selatan
        </span>
        <span className="flex items-center gap-1.5">
          <Phone className="h-3.5 w-3.5" />
          (021) 31936590
        </span>
        <span className="flex items-center gap-1.5">
          <Mail className="h-3.5 w-3.5" />
          humas@baktikomdigi.id
        </span>
      </div>
      <span className="hidden md:block">Operasional: Senin - Jumat, 08.00 - 17.00 WIB</span>
    </div>
  </div>
);

export default TopBar;
