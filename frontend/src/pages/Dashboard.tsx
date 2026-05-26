import { useState, useMemo, useRef, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { API } from "@/lib/api";

import {
  Search,
  Printer,
  Package,
  Users,
  Filter
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import TopBar from "@/components/TopBar";

import Header from "@/components/Header";

import AddAssetDialog from "@/components/AddAssetDialog";

import EditAssetDialog from "@/components/EditAssetDialog";

import {
  Asset,
  DIREKTORAT_LIST
} from "@/types/asset";


const Dashboard = () => {

  const navigate =
    useNavigate();

  const printRef =
    useRef<HTMLDivElement>(null);

  const [assets, setAssets] =
    useState<Asset[]>([]);

  const [
    selectedDirektorat,
    setSelectedDirektorat
  ] = useState("all");

  const [
    searchQuery,
    setSearchQuery
  ] = useState("");

  // ================= LOAD =================

  const loadAssets =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await fetch(
            `${API}/aset`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        const data =
          await res.json();

        console.log(
          "DATA API:",
          data
        );

        // ================= SAFE ARRAY =================

        setAssets(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (err) {

        console.error(
          "Gagal load:",
          err
        );

        setAssets([]);
      }
    };

  useEffect(() => {

    loadAssets();

  }, []);

  // ================= LOGOUT =================

  const handleLogout =
    () => {

      localStorage.clear();

      navigate("/");
    };

  // ================= ADD =================

  const handleAddAsset =
    async (
      newAsset:
        Omit<Asset, "id">
    ) => {

      const token =
        localStorage.getItem(
          "token"
        );

      await fetch(
        `${API}/import-excel`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify([
            newAsset
          ])
        }
      );

      await loadAssets();
    };

  // ================= IMPORT =================

  const handleImportAssets =
    async (
      imported:
        Omit<Asset, "id">[]
    ) => {

      const token =
        localStorage.getItem(
          "token"
        );

      await fetch(
        `${API}/import-excel`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify(
            imported
          )
        }
      );

      await loadAssets();
    };

  // ================= EDIT =================

  const handleEditAsset =
    async (
      updated: Asset
    ) => {

      const token =
        localStorage.getItem(
          "token"
        );

      await fetch(
        `${API}/aset/${updated.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify(
            updated
          )
        }
      );

      await loadAssets();
    };

  // ================= DELETE =================

  const handleDeleteAsset =
    async (
      id: number
    ) => {

      const token =
        localStorage.getItem(
          "token"
        );

      await fetch(
        `${API}/aset/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      await loadAssets();
    };

  // ================= FORMAT =================

  const formatDirektorat =
    (val: string) => {

      if (val === "all")
        return "List Aset per Direktorat";

      return val.startsWith(
        "Direktorat"
      )
        ? val
        : `Direktorat ${val}`;
    };

  // ================= FILTER =================

  const filteredAssets =
    useMemo(() => {

      return (
        Array.isArray(assets)
          ? assets
          : []
      ).filter((a) => {

        const matchDir =

          selectedDirektorat ===
            "all" ||

          a.direktorat ===
            selectedDirektorat;

        const q =
          searchQuery.toLowerCase();

        const matchSearch =

          !q ||

          (
            a.namaKaryawan ||
            ""
          )
            .toLowerCase()
            .includes(q) ||

          (
            a.namaAset ||
            ""
          )
            .toLowerCase()
            .includes(q) ||

          (
            a.merkAset ||
            ""
          )
            .toLowerCase()
            .includes(q);

        return (
          matchDir &&
          matchSearch
        );
      });

    }, [
      assets,
      selectedDirektorat,
      searchQuery
    ]);

  // ================= STATS =================

  const stats =
    useMemo(() => ({

      total:
        Array.isArray(assets)
          ? assets.length
          : 0,

      filtered:
        filteredAssets.length,

      direktoratCount:
        new Set(
          (
            Array.isArray(assets)
              ? assets
              : []
          ).map(
            (a) =>
              a.direktorat
          )
        ).size,

      karyawanCount:
        new Set(
          (
            Array.isArray(assets)
              ? assets
              : []
          ).map(
            (a) =>
              a.namaKaryawan
          )
        ).size

    }), [
      assets,
      filteredAssets
    ]);

  // ================= PRINT =================

  const handlePrint =
    () => {

      document.title =
        formatDirektorat(
          selectedDirektorat
        );

      window.print();
    };

  // ================= LABEL =================

  const getLabel =
    (val?: string) =>
      val || "Tidak Ada";

  return (

    <div className="min-h-screen bg-background flex flex-col">

      <TopBar />

      <Header
        isLoggedIn
        onLogout={handleLogout}
      />

      {/* HERO */}

      <div className="hero-gradient text-primary-foreground py-8 px-4 no-print">

        <div className="container mx-auto">

          <h1 className="text-2xl md:text-3xl font-extrabold">

            Data Aset BAKTI Komdigi

          </h1>

          <p className="text-primary-foreground/70 mt-1">

            Sistem Manajemen dan Monitoring Aset

          </p>

        </div>

      </div>

      <div
        ref={printRef}
        className="container mx-auto px-4 -mt-4 pb-8 flex-1"
      >

        {/* STATS */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 no-print">

          {[
            {
              icon: Package,
              label: "Total Aset",
              value: stats.total
            },

            {
              icon: Filter,
              label: "Ditampilkan",
              value: stats.filtered
            },

            {
              icon: Users,
              label: "Karyawan",
              value: stats.karyawanCount
            },

            {
              icon: Package,
              label: "Direktorat",
              value: stats.direktoratCount
            }

          ].map((s) => (

            <Card
              key={s.label}
              className="border-0 shadow-md"
            >

              <CardContent className="p-4 flex items-center gap-3">

                <div className="rounded-xl bg-accent p-2.5">

                  <s.icon className="h-5 w-5 text-primary" />

                </div>

                <div>

                  <p className="text-2xl font-bold">

                    {s.value}

                  </p>

                  <p className="text-xs text-muted-foreground">

                    {s.label}

                  </p>

                </div>

              </CardContent>

            </Card>

          ))}

        </div>

        {/* TABLE */}

        <Card className="border-0 shadow-md mb-6">

          <CardHeader>

            <div className="flex flex-col md:flex-row justify-between gap-4">

              <CardTitle>

                {formatDirektorat(
                  selectedDirektorat
                )}

              </CardTitle>

              <div className="flex flex-wrap gap-3 no-print">

                <Select
                  value={
                    selectedDirektorat
                  }
                  onValueChange={
                    setSelectedDirektorat
                  }
                >

                  <SelectTrigger className="w-[220px]">

                    <SelectValue placeholder="Semua Direktorat" />

                  </SelectTrigger>

                  <SelectContent>

                    <SelectItem value="all">

                      Semua Direktorat

                    </SelectItem>

                    {DIREKTORAT_LIST.map(
                      (d) => (

                        <SelectItem
                          key={d}
                          value={d}
                        >

                          {d}

                        </SelectItem>

                      )
                    )}

                  </SelectContent>

                </Select>

                <div className="relative">

                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

                  <Input
                    className="pl-9"
                    placeholder="Cari..."
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(
                        e.target.value
                      )
                    }
                  />

                </div>

                <AddAssetDialog
                  onAdd={handleAddAsset}
                  onImport={handleImportAssets}
                />

                <Button
                  variant="outline"
                  onClick={handlePrint}
                >

                  <Printer className="h-4 w-4 mr-2" />

                  Print

                </Button>

              </div>

            </div>

          </CardHeader>

          <CardContent>

            <Table>

              <TableHeader>

                <TableRow>

                  <TableHead>No</TableHead>

                  <TableHead>
                    Direktorat
                  </TableHead>

                  <TableHead>
                    Nama
                  </TableHead>

                  <TableHead>
                    Aset
                  </TableHead>

                  <TableHead>
                    Merk
                  </TableHead>

                  <TableHead>
                    Spesifikasi
                  </TableHead>

                  <TableHead>
                    Kondisi
                  </TableHead>

                  <TableHead>
                    Tahun
                  </TableHead>

                  <TableHead>
                    Label
                  </TableHead>

                  <TableHead className="no-print">
                    Aksi
                  </TableHead>

                </TableRow>

              </TableHeader>

              <TableBody>

                {filteredAssets.map(
                  (
                    asset,
                    idx
                  ) => (

                    <TableRow
                      key={asset.id}
                    >

                      <TableCell>
                        {idx + 1}
                      </TableCell>

                      <TableCell>
                        {asset.direktorat || "-"}
                      </TableCell>

                      <TableCell>
                        {asset.namaKaryawan || "-"}
                      </TableCell>

                      <TableCell>
                        {asset.namaAset || "-"}
                      </TableCell>

                      <TableCell>
                        {asset.merkAset || "-"}
                      </TableCell>

                      <TableCell>
                        {asset.spesifikasiAset || "-"}
                      </TableCell>

                      <TableCell>
                        {asset.kondisi || "-"}
                      </TableCell>

                      <TableCell>
                        {asset.tahunPerolehan || "-"}
                      </TableCell>

                      <TableCell>

                        <span
                          className={
                            getLabel(
                              asset.labelAset
                            ) === "Ada"
                              ? "text-green-600 font-semibold"
                              : "text-red-500"
                          }
                        >

                          {getLabel(
                            asset.labelAset
                          )}

                        </span>

                      </TableCell>

                      <TableCell className="no-print">

                        <EditAssetDialog
                          asset={asset}
                          onSave={handleEditAsset}
                          onDelete={handleDeleteAsset}
                        />

                      </TableCell>

                    </TableRow>

                  )
                )}

              </TableBody>

            </Table>

          </CardContent>

        </Card>

      </div>

    </div>
  );
};

export default Dashboard;