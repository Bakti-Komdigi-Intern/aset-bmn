import { useRef } from "react";
import { FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Asset } from "@/types/asset";
import { toast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

interface ImportExcelButtonProps {
  onImport: (assets: Omit<Asset, "id">[]) => void;
}

const COLUMN_MAP: Record<string, keyof Omit<Asset, "id">> = {
  direktorat: "direktorat",
  "nama karyawan": "namaKaryawan",
  "nama aset": "namaAset",
  "merk aset": "merkAset",
  "spesifikasi aset": "spesifikasiAset",
  spesifikasi: "spesifikasiAset",
  "tahun perolehan": "tahunPerolehan",
  tahun: "tahunPerolehan",
};

const mapHeader = (raw: string): keyof Omit<Asset, "id"> | null => {
  const key = raw.trim().toLowerCase();
  return COLUMN_MAP[key] ?? null;
};

const ImportExcelButton = ({ onImport }: ImportExcelButtonProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

        if (json.length === 0) {
          toast({ title: "File kosong", description: "Tidak ada data di file Excel.", variant: "destructive" });
          return;
        }

        // Map columns
        const headers = Object.keys(json[0]);
        const mapping: Record<string, keyof Omit<Asset, "id">> = {};
        headers.forEach((h) => {
          const mapped = mapHeader(h);
          if (mapped) mapping[h] = mapped;
        });

        const assets: Omit<Asset, "id">[] = json.map((row) => {
          const asset: Omit<Asset, "id"> = {
            direktorat: "",
            namaKaryawan: "",
            namaAset: "",
            merkAset: "",
            spesifikasiAset: "",
            tahunPerolehan: "",
          };
          Object.entries(mapping).forEach(([excelCol, assetKey]) => {
            asset[assetKey] = String(row[excelCol] ?? "");
          });
          return asset;
        }).filter((a) => a.namaKaryawan || a.namaAset);

        if (assets.length === 0) {
          toast({ title: "Gagal import", description: "Kolom tidak dikenali. Gunakan header: Direktorat, Nama Karyawan, Nama Aset, Merk Aset, Spesifikasi Aset, Tahun Perolehan.", variant: "destructive" });
          return;
        }

        onImport(assets);
        toast({ title: "Import berhasil", description: `${assets.length} data aset berhasil diimport.` });
      } catch {
        toast({ title: "Error", description: "Gagal membaca file Excel.", variant: "destructive" });
      }
    };
    reader.readAsArrayBuffer(file);

    // Reset input
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <>
      <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFile} />
      <Button variant="outline" className="gap-2" onClick={() => inputRef.current?.click()}>
        <FileSpreadsheet className="h-4 w-4" /> Import Excel
      </Button>
    </>
  );
};

export default ImportExcelButton;
