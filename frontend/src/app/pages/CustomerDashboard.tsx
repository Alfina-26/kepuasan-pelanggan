import { useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import {
  MessageSquare,
  Star,
  TrendingUp,
  CheckCircle2,
  ClipboardList,
  Utensils,
  LogOut
} from "lucide-react";

// @ts-ignore
import makanan1 from "../../assets/makanan1.jpg";

// ── KOMPONEN LAYOUT (Header & Struktur) ──
function DashboardLayout({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header dengan Fix Z-Index agar tidak numpuk saat scroll */}
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl overflow-hidden shadow-md border-2 border-[#F5A623]">
              <img 
                src={makanan1} 
                alt="Logo" 
                className="h-full w-full object-cover" 
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-[#333] leading-tight">
                Rumah Makan Nasi Padang
              </span>
              <span className="text-xs text-gray-500 font-medium tracking-wider">
                Dashboard Pelanggan
              </span>
            </div>
          </div>

          <Button 
            variant="outline" 
            onClick={() => { logout(); navigate("/login"); }}
            className="rounded-xl border-gray-200 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

// ── HALAMAN UTAMA ──
export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [surveyCount, setSurveyCount] = useState(0);

  useEffect(() => {
    const surveys = JSON.parse(localStorage.getItem("customerSurveys") || "[]");
    setSurveyCount(surveys.length);
  }, []);

  const features = [
    {
      title: "Isi Survei Kepuasan",
      description: "Berikan penilaian tentang makanan dan pelayanan kami",
      buttonText: "ISI SURVEI",
      icon: MessageSquare,
      color: "bg-[#F5A623]",
      action: () => navigate("/customer-survey"),
    },
    {
      title: "Riwayat Survei",
      description: "Lihat riwayat penilaian yang telah Anda berikan",
      buttonText: "RIWAYAT SURVEI",
      icon: ClipboardList,
      color: "bg-[#7D8422]",
      action: () => navigate("/customer-survey-history"),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-10">
        
        {/* Welcome Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-[#F5A623] p-8 text-white shadow-xl">
          <div className="absolute right-[-20px] top-[-20px] opacity-10 rotate-12">
            <Utensils size={200} />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner">
              <Star className="w-10 h-10 text-white fill-white" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-serif italic mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Selamat Datang!
              </h1>
              <p className="text-white/90 text-lg font-medium max-w-2xl leading-relaxed">
                Pendapat Anda adalah bumbu rahasia kami. Bantu kami meningkatkan cita rasa <span className="font-bold underline decoration-white/50">Rumah Makan Nasi Padang</span> hari ini.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none shadow-md bg-white rounded-2xl overflow-hidden group transition-all hover:shadow-lg">
            <div className="h-2 w-full bg-[#F5A623]"></div>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-gray-700">
                <TrendingUp className="w-5 h-5 text-[#F5A623]" />
                Total Kontribusi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-black text-[#F5A623] group-hover:scale-105 transition-transform origin-left">
                {surveyCount}
              </p>
              <p className="text-sm font-medium text-gray-400 mt-2 uppercase tracking-widest">Survei Terkirim</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white rounded-2xl overflow-hidden group transition-all hover:shadow-lg">
            <div className="h-2 w-full bg-[#7D8422]"></div>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-[#7D8422]" />
                Status Pelanggan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-black text-[#7D8422] group-hover:scale-105 transition-transform origin-left">
                Aktif
              </p>
              {/* Tulisan member terverifikasi sudah dihilangkan */}
              <div className="mt-2 h-5"></div> 
            </CardContent>
          </Card>
        </div>

        {/* Main Menu Section */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tighter">Menu Utama</h2>
            <div className="h-[2px] flex-1 bg-gray-200"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index}
                  className="border-none shadow-md rounded-2xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden bg-white cursor-pointer group"
                  onClick={feature.action}
                >
                  <CardHeader className="flex flex-row items-center gap-5 space-y-0">
                    <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform`}>
                      <Icon size={32} />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-800">{feature.title}</CardTitle>
                      <CardDescription className="text-gray-500 font-medium">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className={`w-full rounded-xl font-bold shadow-md transition-all ${
                        index === 0 
                        ? "bg-[#F5A623] hover:bg-[#d98c1d]" 
                        : "bg-[#7D8422] hover:bg-[#6a701d]"
                      } text-white uppercase tracking-wider`}
                    >
                      {feature.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}