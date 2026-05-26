import { useState, useEffect } from "react";
import { Pencil, Trash2, AlertTriangle } from "lucide-react";

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

// ==============================
// TYPES
// ==============================
interface EditAssetDialogProps {
  asset: Asset;
  onSave: (updated: Asset) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

type KondisiType =
  | "Baik"
  | "Rusak Ringan"
  | "Rusak Berat";

type LabelType =
  | "Ada"
  | "Tidak Ada";

type FormType = {
  direktorat: string;
  namaKaryawan: string;
  namaAset: string;
  merkAset: string;
  spesifikasiAset: string;
  kondisi: KondisiType;
  tahunPerolehan: string;
  labelAset: LabelType;
};

// ==============================
// COMPONENT
// ==============================
const EditAssetDialog = ({
  asset,
  onSave,
  onDelete
}: EditAssetDialogProps) => {

  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<FormType>({
    direktorat: asset.direktorat || "",
    namaKaryawan: asset.namaKaryawan || "",
    namaAset: asset.namaAset || "",
    merkAset: asset.merkAset || "",
    spesifikasiAset: asset.spesifikasiAset || "",
    kondisi: asset.kondisi || "Baik",
    tahunPerolehan: asset.tahunPerolehan
      ? String(asset.tahunPerolehan)
      : "",
    labelAset: asset.labelAset || "Tidak Ada"
  });

  // ==============================
  // SYNC DATA
  // ==============================
  useEffect(() => {
    if (open) {
      setForm({
        direktorat: asset.direktorat || "",
        namaKaryawan: asset.namaKaryawan || "",
        namaAset: asset.namaAset || "",
        merkAset: asset.merkAset || "",
        spesifikasiAset: asset.spesifikasiAset || "",
        kondisi: asset.kondisi || "Baik",
        tahunPerolehan: asset.tahunPerolehan
          ? String(asset.tahunPerolehan)
          : "",
        labelAset: asset.labelAset || "Tidak Ada"
      });
    }
  }, [open, asset]);

  // ==============================
  // UPDATE FIELD
  // ==============================
  const updateField = (
    field: keyof FormType,
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
  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (!form.namaKaryawan || !form.namaAset) {
      alert("Field wajib belum diisi");
      return;
    }

    try {

      setLoading(true);

      const payload: Asset = {
        ...asset,
        direktorat: form.direktorat,
        namaKaryawan: form.namaKaryawan,
        namaAset: form.namaAset,
        merkAset: form.merkAset,
        spesifikasiAset: form.spesifikasiAset,
        kondisi: form.kondisi,
        tahunPerolehan: form.tahunPerolehan
          ? parseInt(form.tahunPerolehan)
          : null,
        labelAset: form.labelAset
      };

      console.log("🚀 UPDATE PAYLOAD:", payload);

      await onSave(payload);

      setOpen(false);

    } catch (err) {

      console.error("❌ Gagal update:", err);

      alert("Gagal update data");

    } finally {

      setLoading(false);

    }
  };

  // ==============================
  // DELETE
  // ==============================
  const handleDelete = async () => {

    try {

      setLoading(true);

      await onDelete(asset.id);

      setOpen(false);

    } catch (err) {

      console.error("❌ Gagal delete:", err);

      alert("Gagal hapus data");

    } finally {

      setLoading(false);

    }
  };

  // ==============================
  // UI
  // ==============================
  return (

    <Dialog open={open} onOpenChange={setOpen}>

      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-primary"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg h-[90vh] flex flex-col">

        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Kelola Data Aset
          </DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="edit"
          className="flex-1 flex flex-col overflow-hidden"
        >

          <TabsList className="grid w-full grid-cols-2">

            <TabsTrigger value="edit">
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </TabsTrigger>

            <TabsTrigger value="delete">
              <Trash2 className="h-4 w-4 mr-1" />
              Hapus
            </TabsTrigger>

          </TabsList>

          {/* ================= EDIT ================= */}

          <TabsContent
            value="edit"
            className="overflow-y-auto pr-2"
          >

            <form
              onSubmit={handleSubmit}
              className="space-y-4 mt-3 pb-4"
            >

              {/* DIREKTORAT */}
              <div>
                <Label>Direktorat</Label>

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
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>

                </Select>
              </div>

              {/* NAMA */}
              <div>
                <Label>Nama Karyawan</Label>

                <Input
                  value={form.namaKaryawan}
                  onChange={(e) =>
                    updateField(
                      "namaKaryawan",
                      e.target.value
                    )
                  }
                />
              </div>

              {/* ASET */}
              <div className="grid grid-cols-2 gap-3">

                <div>
                  <Label>Nama Aset</Label>

                  <Input
                    value={form.namaAset}
                    onChange={(e) =>
                      updateField(
                        "namaAset",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <Label>Merk</Label>

                  <Input
                    value={form.merkAset}
                    onChange={(e) =>
                      updateField(
                        "merkAset",
                        e.target.value
                      )
                    }
                  />
                </div>

              </div>

              {/* SPESIFIKASI */}
              <div>

                <Label>Spesifikasi</Label>

                <Textarea
                  value={form.spesifikasiAset}
                  onChange={(e) =>
                    updateField(
                      "spesifikasiAset",
                      e.target.value
                    )
                  }
                />

              </div>

              {/* KONDISI */}
              <div>

                <Label>Kondisi</Label>

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
              <div>

                <Label>Label Aset</Label>

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
              <div>

                <Label>Tahun</Label>

                <Input
                  value={form.tahunPerolehan}
                  onChange={(e) =>
                    updateField(
                      "tahunPerolehan",
                      e.target.value
                    )
                  }
                  placeholder="Contoh: 2024"
                />

              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading
                  ? "Menyimpan..."
                  : "Simpan Perubahan"}
              </Button>

            </form>

          </TabsContent>

          {/* ================= DELETE ================= */}

          <TabsContent value="delete">

            <div className="text-center space-y-4 py-6">

              <AlertTriangle
                className="mx-auto text-red-500"
                size={40}
              />

              <p>
                Hapus <b>{asset.namaAset}</b> milik{" "}
                <b>{asset.namaKaryawan}</b>?
              </p>

              <Button
                variant="destructive"
                className="w-full"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading
                  ? "Menghapus..."
                  : "Hapus Data"}
              </Button>

            </div>

          </TabsContent>

        </Tabs>

      </DialogContent>

    </Dialog>
  );
};

export default EditAssetDialog;