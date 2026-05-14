import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
// Kita tidak pakai DashboardLayout lagi, kita buat layoutnya di sini
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
// @ts-ignore
import makanan1 from "../../assets/makanan1.jpg";
import {
  Users,
  Star,
  TrendingUp,
  Eye,
  Download,
  BarChart3,
  MessageSquare,
  ClipboardList,
  LogOut // Ditambah untuk tombol logout
} from "lucide-react";
import { toast } from "sonner";
import { api } from "../../lib/api";

interface Survey {
  id: number;
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  visitFrequency: string;
  averageSpending: string;
  favoriteMenu: string;
  ratings: {
    foodQuality: number;
    cleanliness: number;
    serviceSpeed: number;
    staffFriendliness: number;
    priceValue: number;
    menuVariety: number;
    ambiance: number;
    overallSatisfaction: number;
  };
  feedback: string;
}

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSurveys();
  }, []);

  const loadSurveys = async () => {
    setLoading(true);
    try {
      const res = await api.getAllSurveys();
      const data: Survey[] = res.surveys || [];
      setSurveys(data.sort((a, b) => b.id - a.id));
    } catch {
      setSurveys([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (surveys.length === 0) {
      toast.error("Tidak ada data untuk di-export");
      return;
    }

    const headers = [
      "ID", "Tanggal", "Nama", "Email", "Telepon", "Frekuensi Kunjungan",
      "Pengeluaran", "Menu Favorit", "Rating Makanan", "Rating Kebersihan",
      "Rating Kecepatan", "Rating Keramahan", "Rating Harga", "Rating Variasi",
      "Rating Suasana", "Rating Keseluruhan", "Feedback"
    ];

    const rows = surveys.map(s => [
      s.id,
      new Date(s.timestamp).toLocaleString("id-ID"),
      s.name,
      s.email,
      s.phone,
      s.visitFrequency || "-",
      s.averageSpending || "-",
      s.favoriteMenu || "-",
      s.ratings?.foodQuality ?? 0,
      s.ratings?.cleanliness ?? 0,
      s.ratings?.serviceSpeed ?? 0,
      s.ratings?.staffFriendliness ?? 0,
      s.ratings?.priceValue ?? 0,
      s.ratings?.menuVariety ?? 0,
      s.ratings?.ambiance ?? 0,
      s.ratings?.overallSatisfaction ?? 0,
      s.feedback || "-"
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `survei-kepuasan-${Date.now()}.csv`;
    link.click();
    toast.success("Data berhasil di-export!");
  };

  const calculateAverageRating = () => {
    if (surveys.length === 0) return 0;
    const total = surveys.reduce((sum, s) => sum + (s.ratings?.overallSatisfaction ?? 0), 0);
    return (total / surveys.length).toFixed(1);
  };

  const getSatisfactionLevel = (rating: number) => {
    if (rating >= 4.5) return { label: "Sangat Puas", color: "bg-green-500" };
    if (rating >= 3.5) return { label: "Puas", color: "bg-blue-500" };
    if (rating >= 2.5) return { label: "Cukup", color: "bg-yellow-500" };
    if (rating >= 1.5) return { label: "Kurang Puas", color: "bg-orange-500" };
    return { label: "Tidak Puas", color: "bg-red-500" };
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const countBySatisfaction = () => {
    const counts = { sangatPuas: 0, puas: 0, cukup: 0, kurangPuas: 0, tidakPuas: 0 };
    surveys.forEach(s => {
      const rating = s.ratings?.overallSatisfaction ?? 0;
      if (rating >= 4.5) counts.sangatPuas++;
      else if (rating >= 3.5) counts.puas++;
      else if (rating >= 2.5) counts.cukup++;
      else if (rating >= 1.5) counts.kurangPuas++;
      else counts.tidakPuas++;
    });
    return counts;
  };

  const satisfactionCounts = countBySatisfaction();

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      {/* 1. HEADER ATAS (PENGGANTI GARPU MERAH) */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* GAMBAR NASI PADANG SEBAGAI LOGO DI POJOK KIRI */}
            <div className="h-10 w-10 rounded-xl overflow-hidden shadow-sm border border-orange-100">
              <img src={makanan1} alt="Logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-orange-900 leading-tight">Rumah Makan Nasi Padang</h1>
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-gray-800">admin</p>
                <p className="text-[10px] text-gray-400">Admin</p>
             </div>
             <Button variant="outline" size="sm" className="rounded-xl border-gray-200 gap-2 text-gray-600 font-bold" onClick={() => navigate('/login')}>
                <LogOut className="w-4 h-4" /> Logout
             </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        
        {/* 2. HEADER DASHBOARD SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
          <div className="flex items-center gap-5">
            {/* GAMBAR NASI PADANG DI DALAM PANEL */}
            <div className="h-16 w-16 rounded-2xl overflow-hidden shadow-md border-2 border-[#F5A623] flex-shrink-0">
              <img src={makanan1} alt="Admin Logo" className="h-full w-full object-cover" />
            </div>
            <div>
              {/* JUDUL ADMIN SURVEY SESUAI PERMINTAAN */}
              <h2 className="text-2xl font-black text-[#333] tracking-tight uppercase">Admin Survey</h2>
              <p className="text-sm text-gray-500 font-medium italic">"Rumah Makan Nasi Padang - Cita Rasa Otentik"</p>
            </div>
          </div>
          <Button 
            onClick={handleExportCSV} 
            className="bg-[#F5A623] hover:bg-[#d98c1d] rounded-2xl shadow-lg shadow-orange-100 font-bold gap-2 px-8 h-12"
          >
            <Download className="w-4 h-4" /> Export Laporan (.CSV)
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Total Survei", val: surveys.length, sub: "Responden", icon: Users, color: "from-orange-400 to-[#F5A623]" },
            { label: "Rata-rata Rating", val: calculateAverageRating(), sub: "Skala 5.0", icon: Star, color: "from-amber-400 to-amber-500" },
            { label: "Tingkat Kepuasan", val: `${surveys.length > 0 ? Math.round(((satisfactionCounts.sangatPuas + satisfactionCounts.puas) / surveys.length) * 100) : 0}%`, sub: "Rating ≥ 3.5", icon: TrendingUp, color: "from-emerald-400 to-emerald-500" },
            { label: "Ulasan Teks", val: surveys.filter(s => s.feedback?.trim()).length, sub: "Saran & Kritik", icon: MessageSquare, color: "from-blue-400 to-blue-500" },
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-md overflow-hidden rounded-[28px]">
              <div className={`h-1.5 bg-gradient-to-r ${stat.color}`}></div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</p>
                    <h3 className="text-3xl font-black text-[#333]">{stat.val}</h3>
                    <p className="text-[10px] font-medium text-gray-400 mt-1 uppercase">{stat.sub}</p>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded-xl text-gray-400">
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Daftar & Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2 px-2 text-[#F5A623]">
               <ClipboardList className="w-5 h-5" />
               <h3 className="font-bold text-lg text-gray-800">Daftar Masukan Terbaru</h3>
            </div>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {loading ? (
                <div className="py-20 text-center text-gray-400">Memuat data...</div>
              ) : surveys.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
                   <p className="text-gray-400 font-medium">Belum ada data masuk</p>
                </div>
              ) : (
                surveys.map((survey) => {
                  const satisfaction = getSatisfactionLevel(survey.ratings?.overallSatisfaction ?? 0);
                  const isActive = selectedSurvey?.id === survey.id;
                  return (
                    <Card
                      key={survey.id}
                      className={`cursor-pointer transition-all border-2 rounded-2xl ${
                        isActive ? "border-[#F5A623] bg-orange-50/40 shadow-sm" : "border-transparent bg-white hover:border-gray-100 shadow-sm"
                      }`}
                      onClick={() => setSelectedSurvey(survey)}
                    >
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <Badge className={`${satisfaction.color} text-white border-none px-3 py-0.5 rounded-lg text-[10px] font-bold`}>
                            {satisfaction.label}
                          </Badge>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">
                            {new Date(survey.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-[#F5A623] font-bold">
                            {survey.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800 leading-none">{survey.name}</h4>
                            <p className="text-xs text-gray-400 mt-1">{survey.favoriteMenu || "Menu Favorit"}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>

          <div className="lg:col-span-7">
            {selectedSurvey ? (
              <Card className="border-none shadow-2xl rounded-[32px] overflow-hidden sticky top-28 animate-in fade-in slide-in-from-bottom-4">
                <div className="h-2 bg-[#F5A623]"></div>
                <CardHeader className="bg-white pb-4 border-b border-gray-50">
                   <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-2xl font-black text-[#333]">Detail Responden</CardTitle>
                      <CardDescription className="font-bold text-orange-500 uppercase text-[10px]">#SRV-{selectedSurvey.id}</CardDescription>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Waktu</p>
                       <p className="text-xs font-bold text-gray-600">{formatDate(selectedSurvey.timestamp)}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8 max-h-[550px] overflow-y-auto">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-gray-50 rounded-3xl">
                    {[
                      { label: "Nama Lengkap", val: selectedSurvey.name },
                      { label: "Email", val: selectedSurvey.email },
                      { label: "No. Telepon", val: selectedSurvey.phone },
                      { label: "Frekuensi", val: selectedSurvey.visitFrequency || "-" },
                      { label: "Pengeluaran", val: selectedSurvey.averageSpending || "-" },
                      { label: "Menu Favorit", val: selectedSurvey.favoriteMenu || "-" },
                    ].map((item, idx) => (
                      <div key={idx}>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{item.label}</p>
                        <p className="text-sm font-bold text-gray-700">{item.val}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-800 flex items-center gap-2">
                       Komentar Pelanggan
                    </h4>
                    <div className="p-6 bg-orange-50/50 border border-orange-100/50 rounded-2xl italic text-gray-700 text-sm leading-relaxed shadow-inner">
                      "{selectedSurvey.feedback || "Tidak ada komentar tertulis."}"
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-gray-50/50 rounded-[40px] border-2 border-dashed border-gray-200 text-gray-300">
                <Eye className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-bold">Pilih data untuk melihat detail</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}