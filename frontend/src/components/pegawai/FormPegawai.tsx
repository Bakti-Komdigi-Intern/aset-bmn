import { useState, type FormEvent } from "react";

import {
  API,
  authHeaders
} from "@/lib/api";

import {
  MapPin,
  Phone,
  Mail,
  LogOut
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { toast } from "sonner";

import logoBakti from "@/assets/logo-bakti.png";

const DIREKTORAT = [

  "Direktorat Infrastruktur",

  "Direktorat Layanan TI untuk Masyarakat dan Pemerintah",

  "Direktorat Layanan TI untuk Badan Usaha",

  "Direktorat Keuangan",

  "Direktorat Sumber Daya dan Administrasi",

  "Satuan Pemeriksaan Intern (SPI)"
];

const KONDISI = [

  "Baik",

  "Rusak Ringan",

  "Rusak Berat"
];

const LABEL_OPTIONS = [

  "Ada",

  "Tidak Ada"
];

const FormPegawai = () => {

  const [direktorat, setDirektorat] =
    useState("");

  const [kondisi, setKondisi] =
    useState("");

  const [labelAset, setLabelAset] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    const form =
      e.currentTarget;

    const data =
      new FormData(form);

    if (
      !direktorat ||
      !kondisi ||
      !labelAset
    ) {

      toast.error(
        "Mohon lengkapi semua field"
      );

      return;
    }

    const tahun =
      Number(
        data.get("tahun")
      );

    if (
      !tahun ||
      tahun < 1990
    ) {

      toast.error(
        "Tahun tidak valid"
      );

      return;
    }

    // =========================
    // PAYLOAD
    // =========================

    const payload = {

      direktorat,

      namaKaryawan:
        String(
          data.get(
            "namaLengkap"
          ) || ""
        ),

      namaAset:
        String(
          data.get(
            "namaAset"
          ) || ""
        ),

      merkAset:
        String(
          data.get(
            "merkAset"
          ) || ""
        ),

      spesifikasiAset:
        String(
          data.get(
            "spesifikasi"
          ) || ""
        ),

      kondisi,

      tahunPerolehan:
        tahun,

      labelAset:
        labelAset ||
        "Tidak Ada"
    };

    console.log(
      "🚀 PAYLOAD:",
      payload
    );

    try {

      setSubmitting(true);

      // =====================
      // TOKEN CHECK
      // =====================

      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {

        toast.error(
          "Session login habis"
        );

        window.location.href =
          "/";

        return;
      }

      // =====================
      // REQUEST
      // =====================

      const res =
        await fetch(
          `${API}/import-excel`,
          {
            method: "POST",

            headers:
              authHeaders(),

            body:
              JSON.stringify([
                payload
              ])
          }
        );

      // =====================
      // RESPONSE
      // =====================

      const result =
        await res.json();

      console.log(
        "✅ RESPONSE:",
        result
      );

      // =====================
      // TOKEN INVALID
      // =====================

      if (
        res.status === 401
      ) {

        toast.error(
          "Token tidak valid, silakan login ulang"
        );

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "bakti_logged_in"
        );

        localStorage.removeItem(
          "bakti_role"
        );

        localStorage.removeItem(
          "bakti_user"
        );

        setTimeout(() => {

          window.location.href =
            "/";

        }, 1500);

        return;
      }

      // =====================
      // ERROR
      // =====================

      if (!res.ok) {

        throw new Error(
          result.message ||
          "Gagal kirim"
        );
      }

      // =====================
      // SUCCESS
      // =====================

      toast.success(
        "Data aset berhasil disimpan"
      );

      form.reset();

      setDirektorat("");
      setKondisi("");
      setLabelAset("");

    } catch (err: any) {

      console.error(err);

      toast.error(
        err.message ||
        "Gagal kirim data"
      );

    } finally {

      setSubmitting(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "bakti_logged_in"
    );

    localStorage.removeItem(
      "bakti_role"
    );

    localStorage.removeItem(
      "bakti_user"
    );

    window.location.href =
      "/";
  };

  return (

    <div className="min-h-screen bg-gray-50">

      {/* TOP BAR */}

      <div className="bg-teal-600 text-white text-xs py-2 px-6 flex justify-between">

        <div className="flex gap-5">

          <span className="flex items-center gap-1">

            <MapPin className="w-3 h-3" />

            Jakarta Selatan

          </span>

          <span className="flex items-center gap-1">

            <Phone className="w-3 h-3" />

            (021) 31936590

          </span>

          <span className="flex items-center gap-1">

            <Mail className="w-3 h-3" />

            humas@baktikomdigi.id

          </span>

        </div>

        <span>

          Senin - Jumat,
          08.00 - 17.00

        </span>

      </div>

      {/* NAVBAR */}

      <div className="flex justify-between items-center px-6 py-3 bg-white border-b shadow-sm">

        <div className="flex items-center gap-3">

          <img
            src={logoBakti}
            className="h-10"
            alt="Logo"
          />

          <div>

            <p className="font-semibold">
              Data Aset BAKTI
            </p>

            <p className="text-xs text-muted-foreground">
              Komdigi
            </p>

          </div>

        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
        >

          <LogOut className="w-4 h-4 mr-2" />

          Keluar

        </Button>

      </div>

      {/* HERO */}

      <div className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-emerald-500 to-cyan-500 text-white py-16 px-6">

        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_white,_transparent_40%)]" />

        <div className="relative max-w-6xl mx-auto">

          <h1 className="text-4xl md:text-5xl font-bold">

            Form Pendataan

            <span className="block text-white/80">

              Aset Pegawai

            </span>

          </h1>

          <p className="mt-3 text-white/80 max-w-lg">

            Isi data aset yang anda pegang
            dengan lengkap dan akurat.

          </p>

        </div>

      </div>

      {/* FORM */}

      <div className="max-w-4xl mx-auto -mt-12 px-6 pb-16">

        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-gray-100 p-8">

          <div className="mb-6">

            <h3 className="text-xl font-semibold">
              Detail Aset
            </h3>

            <p className="text-sm text-gray-500">
              Lengkapi seluruh field dengan benar
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >

            <div className="md:col-span-2">

              <Label>
                Direktorat
              </Label>

              <Select
                value={direktorat}
                onValueChange={setDirektorat}
              >

                <SelectTrigger>

                  <SelectValue placeholder="Pilih direktorat" />

                </SelectTrigger>

                <SelectContent>

                  {DIREKTORAT.map((d) => (

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

            <div className="md:col-span-2">

              <Label>
                Nama Lengkap
              </Label>

              <Input
                name="namaLengkap"
                required
                className="rounded-lg"
              />

            </div>

            <div>

              <Label>
                Nama Aset
              </Label>

              <Input
                name="namaAset"
                required
                className="rounded-lg"
              />

            </div>

            <div>

              <Label>
                Merk
              </Label>

              <Input
                name="merkAset"
                required
                className="rounded-lg"
              />

            </div>

            <div className="md:col-span-2">

              <Label>
                Spesifikasi
              </Label>

              <Textarea
                name="spesifikasi"
                required
                className="rounded-lg"
              />

            </div>

            <div className="md:col-span-2">

              <Label>
                Label
              </Label>

              <Select
                value={labelAset}
                onValueChange={setLabelAset}
              >

                <SelectTrigger>

                  <SelectValue placeholder="Pilih label" />

                </SelectTrigger>

                <SelectContent>

                  {LABEL_OPTIONS.map((l) => (

                    <SelectItem
                      key={l}
                      value={l}
                    >

                      {l}

                    </SelectItem>

                  ))}

                </SelectContent>

              </Select>

            </div>

            <div>

              <Label>
                Kondisi
              </Label>

              <Select
                value={kondisi}
                onValueChange={setKondisi}
              >

                <SelectTrigger>

                  <SelectValue placeholder="Pilih kondisi" />

                </SelectTrigger>

                <SelectContent>

                  {KONDISI.map((k) => (

                    <SelectItem
                      key={k}
                      value={k}
                    >

                      {k}

                    </SelectItem>

                  ))}

                </SelectContent>

              </Select>

            </div>

            <div>

              <Label>
                Tahun Perolehan
              </Label>

              <Input
                name="tahun"
                type="number"
                required
                className="rounded-lg"
              />

            </div>

            <div className="md:col-span-2 flex justify-end gap-3 pt-4">

              <Button
                type="reset"
                variant="outline"
                disabled={submitting}
                onClick={() => {

                  setDirektorat("");
                  setKondisi("");
                  setLabelAset("");
                }}
              >

                Reset

              </Button>

              <Button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:opacity-90"
              >

                {submitting
                  ? "Menyimpan..."
                  : "Simpan Data"}

              </Button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default FormPegawai;