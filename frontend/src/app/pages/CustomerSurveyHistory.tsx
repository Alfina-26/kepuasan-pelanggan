import { useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useAuth } from "../context/AuthContext";
import { api } from "../../lib/api";
// @ts-ignore
import makanan1 from "../../assets/makanan1.jpg";
import {
  Calendar,
  Star,
  MessageSquare,
  Eye,
  Plus,
  UtensilsCrossed,
  ChevronLeft,
  LogOut,
  User as UserIcon,
  AlertCircle,
} from "lucide-react";

// ── INTERFACE ──
interface Survey {
  id: number;
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  feedback: string;
  foodQuality: number;
  cleanliness: number;
  serviceSpeed: number;
  staffFriendliness: number;
  priceValue: number;
  ambiance: number;
  overallSatisfaction: number;
  ratings?: any;
}

// ── DASHBOARD LAYOUT ──
function DashboardLayout({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl overflow-hidden shadow-md border-2 border-[#F5A623]">
              <img src={makanan1} alt="Logo" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-[#333] leading-tight">Rumah Makan Nasi Padang</span>
              <span className="text-xs text-gray-500 font-medium tracking-wider uppercase">History & Feedback</span>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => { logout(); navigate("/login"); }}
            className="rounded-xl border-gray-200 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

export default function CustomerSurveyHistory() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSurveys();
  }, []);

  const loadSurveys = async () => {
    setLoading(true);
    setError(null);
    try {
      // ✅ FIX: Pakai getMyHistory() — backend filter by user_id via JWT token
      // Tidak perlu filter manual di frontend yang rawan salah
      const res = await api.getMyHistory();
      const mySurveys: Survey[] = res.surveys || [];
      setSurveys(mySurveys.sort((a, b) => b.id - a.id));
    } catch (err: any) {
      // Jika 401, artinya token tidak valid / expired
      if (err.message?.includes("401") || err.message?.includes("Login")) {
        setError("Sesi Anda telah berakhir. Silakan login ulang.");
      } else {
        setError("Gagal memuat riwayat survei.");
      }
      setSurveys([]);
    } finally {
      setLoading(false);
    }
  };

  // Ambil nilai rating dari field langsung atau dari nested ratings object
  // karena backend bisa return keduanya
  const getRatingValue = (survey: Survey, key: keyof Survey): number => {
    const direct = survey[key];
    if (typeof direct === "number") return direct;
    if (survey.ratings && typeof survey.ratings[key] === "number") return survey.ratings[key];
    return 0;
  };

  const getOverallRating = (survey: Survey) =>
    getRatingValue(survey, "overallSatisfaction");

  const getSatisfactionLevel = (rating: number) => {
    if (rating >= 4.5) return { label: "Sangat Puas", color: "bg-green-500" };
    if (rating >= 3.5) return { label: "Puas", color: "bg-blue-500" };
    if (rating >= 2.5) return { label: "Cukup", color: "bg-yellow-500" };
    return { label: "Kurang Puas", color: "bg-red-500" };
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const RatingDisplay = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? "fill-[#F5A623] text-[#F5A623]" : "text-gray-200"}`}
        />
      ))}
    </div>
  );

  // Label Indonesia untuk masing-masing rating key
  const ratingLabels: Record<string, string> = {
    foodQuality: "Rasa Makanan",
    cleanliness: "Kebersihan",
    serviceSpeed: "Kecepatan Layanan",
    staffFriendliness: "Keramahan Staff",
    priceValue: "Harga",
    ambiance: "Suasana",
    overallSatisfaction: "Kepuasan Keseluruhan",
  };

  const ratingKeys: (keyof Survey)[] = [
    "foodQuality", "cleanliness", "serviceSpeed",
    "staffFriendliness", "priceValue", "ambiance", "overallSatisfaction",
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 pb-10">

        {/* Tombol Navigasi */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)} className="text-gray-500 hover:text-[#F5A623]">
            <ChevronLeft className="w-4 h-4 mr-1" /> Kembali
          </Button>
          <Button
            onClick={() => navigate("/customer-survey")}
            className="bg-[#F5A623] hover:bg-[#d98c1d] rounded-xl shadow-lg shadow-orange-100 font-bold"
          >
            <Plus className="w-4 h-4 mr-2" /> Survei Baru
          </Button>
        </div>

        {/* Info Header */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-[#333] tracking-tight">Riwayat Penilaian</h2>
            <p className="text-gray-400 font-medium">
              Terima kasih{user?.username ? `, ${user.username}` : ""} telah membantu kami berkembang
            </p>
          </div>
          <div className="text-right">
            <span className="block text-4xl font-black text-[#F5A623]">{surveys.length}</span>
            <span className="text-xs uppercase font-bold text-gray-400 tracking-widest">Total Survei</span>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="font-medium">{error}</span>
            {error.includes("login") && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/login")}
                className="ml-auto border-red-300 text-red-600 hover:bg-red-100"
              >
                Login Ulang
              </Button>
            )}
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center text-gray-400 font-medium animate-pulse">
            Memuat riwayat...
          </div>
        ) : !error && surveys.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-200 bg-transparent shadow-none">
            <CardContent className="py-20 text-center">
              <UtensilsCrossed className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-600">Belum Ada Riwayat</h3>
              <p className="text-gray-400 mt-2">Anda belum pernah mengisi survei kepuasan.</p>
              <Button
                onClick={() => navigate("/customer-survey")}
                className="mt-6 bg-[#F5A623] hover:bg-[#d98c1d] rounded-xl font-bold"
              >
                <Plus className="w-4 h-4 mr-2" /> Isi Survei Sekarang
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* List Kiri */}
            <div className="lg:col-span-5 space-y-4">
              {surveys.map((survey) => {
                const overall = getOverallRating(survey);
                const satisfaction = getSatisfactionLevel(overall);
                const isActive = selectedSurvey?.id === survey.id;

                return (
                  <Card
                    key={survey.id}
                    className={`cursor-pointer transition-all border-2 rounded-2xl ${
                      isActive
                        ? "border-[#F5A623] bg-orange-50/30 shadow-md"
                        : "border-transparent hover:border-gray-200"
                    }`}
                    onClick={() => setSelectedSurvey(survey)}
                  >
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <Badge
                          className={`${satisfaction.color} text-white hover:${satisfaction.color} border-none px-3 py-1 rounded-lg`}
                        >
                          {satisfaction.label}
                        </Badge>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                          {formatDate(survey.timestamp)}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-800 text-lg">
                        {survey.location || "Kunjungan Restoran"}
                      </h4>
                      <div className="mt-4 flex items-center justify-between">
                        <RatingDisplay rating={overall} />
                        <Eye className={`w-5 h-5 ${isActive ? "text-[#F5A623]" : "text-gray-300"}`} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Detail Kanan */}
            <div className="lg:col-span-7">
              {selectedSurvey ? (
                <Card className="border-none shadow-2xl rounded-3xl sticky top-24 overflow-hidden">
                  <div className="h-2 bg-[#F5A623]"></div>
                  <CardHeader className="bg-white pb-2">
                    <CardTitle className="text-2xl font-black text-[#333]">Detail Feedback</CardTitle>
                    <CardDescription>ID Referensi: #SRV-{selectedSurvey.id}</CardDescription>
                  </CardHeader>

                  <CardContent className="p-8 space-y-8">
                    {/* User Info */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Pelanggan</p>
                        <p className="font-bold text-gray-700">{selectedSurvey.name}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Kontak</p>
                        <p className="font-medium text-gray-600 text-sm">{selectedSurvey.email}</p>
                      </div>
                      {selectedSurvey.phone && (
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Telepon</p>
                          <p className="font-medium text-gray-600 text-sm">{selectedSurvey.phone}</p>
                        </div>
                      )}
                      {selectedSurvey.location && (
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Lokasi</p>
                          <p className="font-medium text-gray-600 text-sm">{selectedSurvey.location}</p>
                        </div>
                      )}
                    </div>

                    {/* Ratings Grid */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-800 flex items-center gap-2">
                        <Star className="w-4 h-4 text-[#F5A623]" /> Skor Penilaian
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        {ratingKeys.map((key) => (
                          <div
                            key={key}
                            className="flex justify-between items-center border-b border-gray-50 pb-2"
                          >
                            <span className="text-sm text-gray-500">
                              {ratingLabels[key as string] || key}
                            </span>
                            <RatingDisplay rating={getRatingValue(selectedSurvey, key)} />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Feedback Text */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-gray-800 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-[#F5A623]" /> Komentar Anda
                      </h4>
                      <div className="p-5 bg-orange-50 border border-orange-100 rounded-2xl italic text-gray-700">
                        "{selectedSurvey.feedback || "Tidak ada komentar tambahan."}"
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-gray-100/50 rounded-3xl border-2 border-dashed border-gray-200 text-gray-400">
                  <UserIcon className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-medium">Pilih salah satu riwayat untuk melihat detail</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}