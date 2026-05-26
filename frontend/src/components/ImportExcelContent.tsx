import { useRef } from "react";
import { FileSpreadsheet, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Asset } from "@/types/asset";
import { toast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

interface ImportExcelContentProps {
  onImport: (assets: Omit<Asset, "id">[]) => void;
}

const ImportExcelContent = ({ onImport }: ImportExcelContentProps) => {
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

        // ===============================
        // BACA EXCEL (ARRAY MODE)
        // ===============================
        const rows: any[][] = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          defval: "",
        });

        if (rows.length < 2) {
          toast({
            title: "File kosong",
            description: "Tidak ada data di file Excel.",
            variant: "destructive",
          });
          return;
        }

        let currentNama = "";
        const assets: Omit<Asset, "id">[] = [];

        // ===============================
        // LOOP DATA (SKIP HEADER)
        // ===============================
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];

          const nama = row[1];
          const namaAset = row[2];
          const merk = row[3];
          const spesifikasi = row[4];
          const kondisi = row[5]; // ✅ KOLOM BARU
          const tahunRaw = row[6]; // ✅ PINDAH KE SINI

          // simpan nama karyawan (untuk baris kosong)
          if (nama) {
            currentNama = String(nama);
          }

          // skip kalau tidak ada aset / header nyasar
          if (!namaAset || namaAset === "NAMA ASET") continue;

          // ===============================
          // FORMAT TAHUN
          // ===============================
          let tahun = "";

          if (tahunRaw) {
            if (!isNaN(Number(tahunRaw))) {
              tahun = String(tahunRaw);
            } else if (String(tahunRaw).includes("/")) {
              tahun = String(tahunRaw).split("/")[0];
            }
          }

          // ===============================
          // PUSH DATA
          // ===============================
          assets.push({
            direktorat: "BAKTI",
            namaKaryawan: currentNama,
            namaAset: String(namaAset),
            merkAset: String(merk || ""),
            spesifikasiAset: String(spesifikasi || ""),
            kondisi: String(kondisi || "Baik"), // ✅ DEFAULT
            tahunPerolehan: tahun,
          });
        }

        console.log("HASIL IMPORT:", assets); // 🔥 DEBUG

        if (assets.length === 0) {
          toast({
            title: "Gagal import",
            description: "Data aset tidak ditemukan di Excel.",
            variant: "destructive",
          });
          return;
        }

        onImport(assets);

        toast({
          title: "Import berhasil",
          description: `${assets.length} data aset berhasil diimport.`,
        });

      } catch (error) {
        console.error(error);

        toast({
          title: "Error",
          description: "Gagal membaca file Excel.",
          variant: "destructive",
        });
      }
    };

    reader.readAsArrayBuffer(file);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center space-y-3">
        <FileSpreadsheet className="h-10 w-10 mx-auto text-muted-foreground" />

        <p className="text-sm text-muted-foreground">
          Upload file Excel (.xlsx, .xls)
        </p>

        <p className="text-xs text-muted-foreground">
          Format kolom:
          <br />
          NO | NAMA | NAMA ASET | MERK ASET | SPESIFIKASI | KONDISI | TAHUN
        </p>

        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={handleFile}
        />

        <Button
          variant="outline"
          className="gap-2"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-4 w-4" /> Pilih File
        </Button>
      </div>
    </div>
  );
};

export default ImportExcelContent;