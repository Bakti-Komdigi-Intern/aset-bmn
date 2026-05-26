import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  role?: "admin" | "pegawai";
}

const ProtectedRoute = ({
  children,
  role
}: Props) => {

  const loggedIn =
    localStorage.getItem(
      "bakti_logged_in"
    );

  const userRole =
    localStorage.getItem(
      "bakti_role"
    );

  // =========================
  // BELUM LOGIN
  // =========================

  if (!loggedIn) {

    return <Navigate to="/" replace />;
  }

  // =========================
  // ROLE TIDAK SESUAI
  // =========================

  if (
    role &&
    userRole !== role
  ) {

    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;