import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

import { Asset, DIREKTORAT_LIST } from "@/types/asset";

import ImportExcelContent from "@/components/ImportExcelContent";

// ==============================
// PROPS
// ==============================
interface AddAssetDialogProps {
  onAdd: (asset: Omit<Asset, "id">) => void;
  onImport: (assets: Omit<Asset, "id">[]) => void;
}

// ==============================
// COMPONENT
// ==============================
const AddAssetDialog = ({
  onAdd,
  onImport
}: AddAssetDialogProps) => {

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    direktorat: "",

    namaKaryawan: "",

    namaAset: "",

    merkAset: "",

    spesifikasiAset: "",

    tahunPerolehan: "",

    kondisi: "Baik" as
      | "Baik"
      | "Rusak Ringan"
      | "Rusak Berat",

    labelAset: "Tidak Ada" as
      | "Ada"
      | "Tidak Ada"
  });

  // ==============================
  // UPDATE FIELD
  // ==============================
  const updateField = (
    field: string,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // ==============================
  // SUBMIT
  // ==============================
  const handleSubmit = (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (
      !form.direktorat ||
      !form.namaKaryawan ||
      !form.namaAset
    ) {
      alert("Field wajib belum diisi");
      return;
    }

    onAdd({
      direktorat: form.direktorat,

      namaKaryawan: form.namaKaryawan,

      namaAset: form.namaAset,

      merkAset: form.merkAset,

      spesifikasiAset: form.spesifikasiAset,

      tahunPerolehan: form.tahunPerolehan
        ? parseInt(form.tahunPerolehan)
        : null,

      kondisi: form.kondisi,

      labelAset: form.labelAset
    });

    // RESET FORM
    setForm({
      direktorat: "",

      namaKaryawan: "",

      namaAset: "",

      merkAset: "",

      spesifikasiAset: "",

      tahunPerolehan: "",

      kondisi: "Baik" as
        | "Baik"
        | "Rusak Ringan"
        | "Rusak Berat",

      labelAset: "Tidak Ada" as
        | "Ada"
        | "Tidak Ada"
    });

    setOpen(false);
  };

  // ==============================
  // IMPORT
  // ==============================
  const handleImport = (
    assets: Omit<Asset, "id">[]
  ) => {
    onImport(assets);
    setOpen(false);
  };

  // ==============================
  // UI
  // ==============================
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >

      <DialogTrigger asChild>
        <Button className="gap-2 font-semibold">
          <Plus className="h-4 w-4" />
          Tambah Data
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">

        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Tambah Data Aset
          </DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="manual"
          className="mt-2"
        >

          <TabsList className="w-full">

            <TabsTrigger
              value="manual"
              className="flex-1"
            >
              Input Manual
            </TabsTrigger>

            <TabsTrigger
              value="excel"
              className="flex-1"
            >
              Import Excel
            </TabsTrigger>

          </TabsList>

          {/* ================= MANUAL ================= */}
          <TabsContent value="manual">

            <form
              onSubmit={handleSubmit}
              className="space-y-4 mt-2"
            >

              {/* DIREKTORAT */}
              <div className="space-y-2">

                <Label className="font-semibold">
                  Direktorat
                </Label>

                <Select
                  value={form.direktorat}
                  onValueChange={(v) =>
                    updateField("direktorat", v)
                  }
                >

                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Direktorat" />
                  </SelectTrigger>

                  <SelectContent>

                    {DIREKTORAT_LIST.map((d) => (
                      <SelectItem
                        key={d}
                        value={d}
                      >
                        {d}
                      </SelectItem>
                    ))}

                  </SelectContent>

                </Select>

              </div>

              {/* NAMA */}
              <div className="space-y-2">

                <Label className="font-semibold">
                  Nama Karyawan
                </Label>

                <Input
                  value={form.namaKaryawan}
                  onChange={(e) =>
                    updateField(
                      "namaKaryawan",
                      e.target.value
                    )
                  }
                  placeholder="Nama lengkap karyawan"
                  required
                  maxLength={100}
                />

              </div>

              {/* ASET */}
              <div className="grid grid-cols-2 gap-4">

                <div className="space-y-2">

                  <Label className="font-semibold">
                    Nama Aset
                  </Label>

                  <Input
                    value={form.namaAset}
                    onChange={(e) =>
                      updateField(
                        "namaAset",
                        e.target.value
                      )
                    }
                    placeholder="Nama aset"
                    required
                    maxLength={100}
                  />

                </div>

                <div className="space-y-2">

                  <Label className="font-semibold">
                    Merk Aset
                  </Label>

                  <Input
                    value={form.merkAset}
                    onChange={(e) =>
                      updateField(
                        "merkAset",
                        e.target.value
                      )
                    }
                    placeholder="Merk/brand"
                    maxLength={100}
                  />

                </div>

              </div>

              {/* SPESIFIKASI */}
              <div className="space-y-2">

                <Label className="font-semibold">
                  Spesifikasi Aset
                </Label>

                <Textarea
                  value={form.spesifikasiAset}
                  onChange={(e) =>
                    updateField(
                      "spesifikasiAset",
                      e.target.value
                    )
                  }
                  placeholder="Detail spesifikasi"
                  maxLength={500}
                  rows={2}
                />

              </div>

              {/* KONDISI */}
              <div className="space-y-2">

                <Label className="font-semibold">
                  Kondisi
                </Label>

                <Select
                  value={form.kondisi}
                  onValueChange={(v) =>
                    updateField("kondisi", v)
                  }
                >

                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kondisi" />
                  </SelectTrigger>

                  <SelectContent>

                    <SelectItem value="Baik">
                      Baik
                    </SelectItem>

                    <SelectItem value="Rusak Ringan">
                      Rusak Ringan
                    </SelectItem>

                    <SelectItem value="Rusak Berat">
                      Rusak Berat
                    </SelectItem>

                  </SelectContent>

                </Select>

              </div>

              {/* LABEL */}
              <div className="space-y-2">

                <Label className="font-semibold">
                  Label Aset
                </Label>

                <Select
                  value={form.labelAset}
                  onValueChange={(v) =>
                    updateField("labelAset", v)
                  }
                >

                  <SelectTrigger>
                    <SelectValue placeholder="Pilih label" />
                  </SelectTrigger>

                  <SelectContent>

                    <SelectItem value="Ada">
                      Ada
                    </SelectItem>

                    <SelectItem value="Tidak Ada">
                      Tidak Ada
                    </SelectItem>

                  </SelectContent>

                </Select>

              </div>

              {/* TAHUN */}
              <div className="space-y-2">

                <Label className="font-semibold">
                  Tahun Perolehan
                </Label>

                <Input
                  value={form.tahunPerolehan}
                  onChange={(e) =>
                    updateField(
                      "tahunPerolehan",
                      e.target.value
                    )
                  }
                  placeholder="Contoh: 2024"
                  maxLength={4}
                />

              </div>

              <Button
                type="submit"
                className="w-full font-semibold"
              >
                Simpan Data
              </Button>

            </form>

          </TabsContent>

          {/* ================= EXCEL ================= */}
          <TabsContent value="excel">

            <ImportExcelContent
              onImport={handleImport}
            />

          </TabsContent>

        </Tabs>

      </DialogContent>

    </Dialog>
  );
};

export default AddAssetDialog;