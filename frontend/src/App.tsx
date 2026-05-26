import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query";

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

import FormPegawai from "./components/pegawai/FormPegawai";

import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (

  <QueryClientProvider client={queryClient}>

    <TooltipProvider>

      <Toaster />
      <Sonner />

      <BrowserRouter>

        <Routes>

          {/* LOGIN */}
          <Route
            path="/"
            element={<Login />}
          />

          {/* DASHBOARD ADMIN */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="admin">

                <Dashboard />

              </ProtectedRoute>
            }
          />

          {/* FORM PEGAWAI */}
          <Route
            path="/pegawai"
            element={
              <ProtectedRoute role="pegawai">

                <FormPegawai />

              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>

      </BrowserRouter>

    </TooltipProvider>

  </QueryClientProvider>
);

export default App;