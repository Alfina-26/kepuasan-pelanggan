import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";
import { Lock, User, UtensilsCrossed } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Harap masukkan username dan password");
      return;
    }

    const success = login(username, password);

    if (success) {
      toast.success("Login berhasil!");

      // Navigate based on role
      if (username === "admin") {
        navigate("/admin");
      } else if (username === "developer") {
        navigate("/developer");
      } else if (username === "customer") {
        navigate("/customer");
      }
    } else {
      toast.error("Username atau password salah");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
            <UtensilsCrossed className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl text-orange-900">Rumah Makan Nasi Padang</CardTitle>
            <CardDescription className="text-base mt-2">
              Survei Kepuasan Pelanggan
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
              Login
            </Button>
          </form>
          <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-sm text-gray-700 mb-2">Akun Demo:</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Admin: <span className="font-mono">admin / admin123</span></li>
              <li>• Developer: <span className="font-mono">developer / developer123</span></li>
              <li>• Pelanggan: <span className="font-mono">customer / customer123</span></li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
