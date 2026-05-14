import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { Lock, User } from "lucide-react";

// Import gambar agar selaras dengan Login
// @ts-ignore
import makanan1 from "../../assets/makanan1.jpg";
// @ts-ignore
import makanan2 from "../../assets/makanan2.jpg";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password || !confirmPassword) {
      toast.error("Harap lengkapi semua kolom");
      return;
    }

    if (username.length < 3) {
      toast.error("Username minimal 3 karakter");
      return;
    }

    if (password.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password dan konfirmasi password tidak cocok");
      return;
    }

    setLoading(true);
    try {
      const success = await register(username, password);
      if (success) {
        toast.success("Registrasi berhasil! Selamat datang.");
        navigate("/customer");
      } else {
        toast.error("Username sudah digunakan, coba yang lain");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FDFBF0] overflow-hidden font-sans">
      
      {/* ── Sisi Kiri: Visual Makanan & Branding (Selaras dengan Login) ── */}
      <div className="relative w-full md:w-[40%] bg-[#F5A623] flex flex-col items-center justify-start py-12 overflow-hidden shadow-2xl">
        <div className="absolute top-10 left-5 opacity-20 rotate-12">
           <svg width="60" height="40" viewBox="0 0 60 40"><path d="M0 20 L15 0 L30 20 L45 0 L60 20" stroke="black" strokeWidth="4" fill="none"/></svg>
        </div>

        {/* Header Aesthetic */}
        <div className="z-10 text-center mb-8">
          <div className="text-white text-4xl font-serif italic tracking-wide drop-shadow-lg" 
               style={{ fontFamily: "'Playfair Display', serif, cursive" }}>
            Rumah Makan <br/>
            <span className="text-2xl font-sans not-italic font-black tracking-[0.2em] uppercase opacity-90">
              Nasi Padang
            </span>
          </div>
          <div className="w-20 h-1 bg-white/50 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Gambar Makanan Bulat */}
        <div className="relative z-10 flex flex-col gap-6 items-center transform scale-90 lg:scale-100">
          <div className="w-56 h-56 rounded-full border-8 border-white/20 overflow-hidden shadow-2xl">
            <img src={makanan1} alt="Makanan 1" className="w-full h-full object-cover" />
          </div>
          <div className="w-48 h-48 rounded-full border-8 border-white/20 overflow-hidden shadow-2xl -mt-10 ml-16">
            <img src={makanan2} alt="Makanan 2" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="absolute bottom-[-20px] left-[-20px] opacity-10 rotate-45">
           <svg width="200" height="200" viewBox="0 0 100 100" fill="black"><path d="M10 90 Q50 10 90 90 T10 90" /></svg>
        </div>
      </div>

      {/* ── Sisi Kanan: Form Register ── */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-12 relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-[#F5A623] clip-path-slant md:hidden"></div>

        <div className="w-full max-w-md z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-[#333] mb-6 tracking-tight uppercase">
            Daftar <span className="text-[#F5A623]">Akun Baru</span>
          </h2>
          <p className="text-gray-500 mb-10 font-medium italic">Gabung untuk memberikan penilaian terbaik Anda</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Username (Min. 3 Karakter)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-12 bg-gray-100 border-none rounded-full h-14 focus-visible:ring-[#F5A623]"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="password"
                placeholder="Kata Sandi (Min. 6 Karakter)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12 bg-gray-100 border-none rounded-full h-14 focus-visible:ring-[#F5A623]"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="password"
                placeholder="Konfirmasi Kata Sandi"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-12 bg-gray-100 border-none rounded-full h-14 focus-visible:ring-[#F5A623]"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-xl text-lg font-bold bg-[#7D8422] hover:bg-[#6a701d] text-white shadow-lg transition-transform active:scale-95 mt-4"
            >
              {loading ? "Mendaftarkan..." : "DAFTAR SEKARANG"}
            </Button>
          </form>

          <div className="mt-8">
            <p className="text-gray-600 font-medium">
              Sudah punya akun?{" "}
              <Link to="/login" className="text-[#F5A623] font-bold hover:underline">
                Login di sini
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .clip-path-slant {
          clip-path: polygon(0 0, 100% 0, 100% 60%, 0% 100%);
        }
      `}} />
    </div>
  );
}