export interface Asset {
  id: number;

  direktorat: string;

  namaKaryawan: string;

  namaAset: string;
  merkAset: string;
  spesifikasiAset: string;

  kondisi: "Baik" | "Rusak Ringan" | "Rusak Berat";

  tahunPerolehan: number;

  // ✅ default tetap aman
  labelAset?: "Ada" | "Tidak Ada";
}

// ================= LIST DIREKTORAT =================
export const DIREKTORAT_LIST: string[] = [
  "Direktorat Infrastruktur",
  "Direktorat Layanan TI untuk Masyarakat dan Pemerintah",
  "Direktorat Layanan TI untuk Badan Usaha",
  "Direktorat Keuangan",
  "Direktorat Sumber Daya dan Administrasi",
  "Satuan Pemeriksaan Intern (SPI)",
];