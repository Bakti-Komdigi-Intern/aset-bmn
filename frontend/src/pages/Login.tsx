import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { API } from "@/lib/api";

import {
  LogIn,
  User,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent
} from "@/components/ui/card";

import TopBar from "@/components/TopBar";

import Header from "@/components/Header";



const Login = () => {

  const navigate =
    useNavigate();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  // ====================================
  // LOGIN LDAP
  // ====================================

  const handleLogin = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      setLoading(true);

      // =========================
      // REQUEST LOGIN
      // =========================

      const response =
        await fetch(
          `${API}/login`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              username,

              password
            })
          }
        );

      const data =
        await response.json();

      // =========================
      // LOGIN GAGAL
      // =========================

      if (!response.ok) {

        alert(
          data.message ||
          "Login gagal"
        );

        return;
      }

      // =========================
      // SAVE TOKEN
      // =========================

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "bakti_logged_in",
        "true"
      );

      localStorage.setItem(
        "bakti_role",
        data.user.role
      );

      localStorage.setItem(
        "bakti_user",
        JSON.stringify(
          data.user
        )
      );

      // =========================
      // REDIRECT
      // =========================

      if (
        data.user.role ===
        "admin"
      ) {

        navigate(
          "/dashboard"
        );

      } else {

        navigate(
          "/pegawai"
        );
      }

    } catch (err) {

      console.log(err);

      alert(
        "Server tidak bisa diakses"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-background flex flex-col">

      <TopBar />

      <Header />

      <div className="flex-1 flex items-center justify-center p-4">

        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">

          {/* LEFT */}

          <div className="hidden md:block">

            <div className="hero-gradient rounded-3xl p-10 text-white shadow-2xl">

              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm backdrop-blur">

                <ShieldCheck className="w-4 h-4" />

                Sistem Monitoring Aset

              </div>

              <h1 className="text-4xl font-extrabold mt-6 leading-tight">

                Data Aset
                <br />
                BAKTI Komdigi

              </h1>

              <p className="text-white/80 text-lg mt-4 leading-relaxed">

                Platform digital untuk pengelolaan,
                monitoring, dan pendataan aset pegawai
                di seluruh direktorat BAKTI Komdigi.

              </p>

              <div className="grid grid-cols-2 gap-4 mt-10">

                {[
                  {
                    label: "Direktorat",
                    value: "6 Unit"
                  },
                  {
                    label: "Total Aset",
                    value: "1.200+"
                  },
                  {
                    label: "Pegawai",
                    value: "500+"
                  },
                  {
                    label: "Kategori",
                    value: "15 Jenis"
                  }
                ].map((item) => (

                  <div
                    key={item.label}
                    className="bg-white/10 rounded-2xl p-5 backdrop-blur"
                  >

                    <p className="text-3xl font-bold">
                      {item.value}
                    </p>

                    <p className="text-sm text-white/70 mt-1">
                      {item.label}
                    </p>

                  </div>

                ))}

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden">

            <CardContent className="p-8 md:p-10">

              <div className="text-center mb-8">

                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">

                  <LogIn className="w-10 h-10 text-primary" />

                </div>

                <h2 className="text-3xl font-bold">
                  Login Portal
                </h2>

                <p className="text-muted-foreground mt-2">

                  Login menggunakan akun LDAP kantor

                </p>

              </div>

              {/* FORM */}

              <form
                onSubmit={handleLogin}
                className="space-y-5"
              >

                <div className="space-y-2">

                  <Label htmlFor="username">
                    Username LDAP
                  </Label>

                  <div className="relative">

                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                    <Input
                      id="username"
                      className="pl-10 h-12 rounded-xl"
                      placeholder="Masukkan username LDAP"
                      value={username}
                      onChange={(e) =>
                        setUsername(
                          e.target.value
                        )
                      }
                      required
                    />

                  </div>

                </div>

                <div className="space-y-2">

                  <Label htmlFor="password">
                    Password
                  </Label>

                  <div className="relative">

                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                    <Input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      className="pl-10 pr-10 h-12 rounded-xl"
                      placeholder="Masukkan password"
                      value={password}
                      onChange={(e) =>
                        setPassword(
                          e.target.value
                        )
                      }
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >

                      {showPassword ? (

                        <EyeOff className="w-4 h-4 text-muted-foreground" />

                      ) : (

                        <Eye className="w-4 h-4 text-muted-foreground" />

                      )}

                    </button>

                  </div>

                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl text-base font-semibold"
                >

                  <LogIn className="w-4 h-4 mr-2" />

                  {loading
                    ? "Memproses..."
                    : "Masuk"}

                </Button>

              </form>

              <div className="mt-8 text-center text-xs text-muted-foreground">

                © 2026 BAKTI Komdigi

              </div>

            </CardContent>

          </Card>

        </div>

      </div>

    </div>
  );
};

export default Login;