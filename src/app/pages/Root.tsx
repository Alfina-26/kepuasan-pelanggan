import { Outlet } from "react-router";
import { AuthProvider } from "../context/AuthContext";
import { DataProvider } from "../context/DataContext";
import { Toaster } from "../components/ui/sonner";

export default function Root() {
  return (
    <AuthProvider>
      <DataProvider>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
          <Outlet />
          <Toaster />
        </div>
      </DataProvider>
    </AuthProvider>
  );
}
