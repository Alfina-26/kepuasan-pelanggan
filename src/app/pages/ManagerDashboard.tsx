import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import DashboardLayout from "../components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Users,
  Star,
  TrendingUp,
  Calendar,
  Eye,
  Trash2,
  Download,
  BarChart3,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";

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

  useEffect(() => {
    loadSurveys();
  }, []);

  const loadSurveys = () => {
    const storedSurveys = JSON.parse(localStorage.getItem("customerSurveys") || "[]");
    setSurveys(storedSurveys.sort((a: Survey, b: Survey) => b.id - a.id));
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus data survei ini?")) {
      const updatedSurveys = surveys.filter(s => s.id !== id);
      localStorage.setItem("customerSurveys", JSON.stringify(updatedSurveys));
      setSurveys(updatedSurveys);
      setSelectedSurvey(null);
      toast.success("Data survei berhasil dihapus");
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
      s.ratings.foodQuality,
      s.ratings.cleanliness,
      s.ratings.serviceSpeed,
      s.ratings.staffFriendliness,
      s.ratings.priceValue,
      s.ratings.menuVariety,
      s.ratings.ambiance,
      s.ratings.overallSatisfaction,
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
    const total = surveys.reduce((sum, s) => sum + s.ratings.overallSatisfaction, 0);
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
    const date = new Date(timestamp);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const RatingDisplay = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-1 text-sm font-medium">{rating}/5</span>
    </div>
  );

  const countBySatisfaction = () => {
    const counts = {
      sangatPuas: 0,
      puas: 0,
      cukup: 0,
      kurangPuas: 0,
      tidakPuas: 0
    };

    surveys.forEach(s => {
      const rating = s.ratings.overallSatisfaction;
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
    <DashboardLayout title="Dashboard Admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Manajemen Survei Kepuasan Pelanggan</h2>
            <p className="text-gray-600 mt-1">Kelola dan analisa feedback pelanggan rumah makan</p>
          </div>
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="w-5 h-5" />
                Total Survei
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{surveys.length}</p>
              <p className="text-xs opacity-90 mt-1">Responden</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Star className="w-5 h-5" />
                Rata-rata Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{calculateAverageRating()}</p>
              <p className="text-xs opacity-90 mt-1">Dari skala 5</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="w-5 h-5" />
                Pelanggan Puas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {surveys.length > 0
                  ? Math.round(((satisfactionCounts.sangatPuas + satisfactionCounts.puas) / surveys.length) * 100)
                  : 0}%
              </p>
              <p className="text-xs opacity-90 mt-1">Rating ≥ 3.5</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="w-5 h-5" />
                Ada Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {surveys.filter(s => s.feedback && s.feedback.trim() !== "").length}
              </p>
              <p className="text-xs opacity-90 mt-1">Saran & Kritik</p>
            </CardContent>
          </Card>
        </div>

        {/* Satisfaction Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Distribusi Kepuasan Pelanggan</CardTitle>
            <CardDescription>Breakdown tingkat kepuasan berdasarkan rating</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">{satisfactionCounts.sangatPuas}</div>
                <div className="text-xs text-gray-600 mt-1">Sangat Puas (4.5-5)</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{satisfactionCounts.puas}</div>
                <div className="text-xs text-gray-600 mt-1">Puas (3.5-4.4)</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-600">{satisfactionCounts.cukup}</div>
                <div className="text-xs text-gray-600 mt-1">Cukup (2.5-3.4)</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="text-2xl font-bold text-orange-600">{satisfactionCounts.kurangPuas}</div>
                <div className="text-xs text-gray-600 mt-1">Kurang Puas (1.5-2.4)</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="text-2xl font-bold text-red-600">{satisfactionCounts.tidakPuas}</div>
                <div className="text-xs text-gray-600 mt-1">Tidak Puas (1-1.4)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Survey List */}
        {surveys.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="py-16 text-center">
              <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Belum Ada Data Survei
              </h3>
              <p className="text-gray-500">
                Data survei dari pelanggan akan muncul di sini
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Survey List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Riwayat Survei ({surveys.length})</h3>
              </div>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {surveys.map((survey) => {
                  const satisfaction = getSatisfactionLevel(survey.ratings.overallSatisfaction);
                  return (
                    <Card
                      key={survey.id}
                      className={`border-0 shadow hover:shadow-lg transition-all cursor-pointer ${
                        selectedSurvey?.id === survey.id ? "ring-2 ring-orange-500" : ""
                      }`}
                      onClick={() => setSelectedSurvey(survey)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-500" />
                              {survey.name}
                            </CardTitle>
                            <CardDescription className="text-xs mt-1">
                              <Calendar className="w-3 h-3 inline mr-1" />
                              {formatDate(survey.timestamp)}
                            </CardDescription>
                          </div>
                          <Badge className={`${satisfaction.color} text-white border-0 text-xs`}>
                            {satisfaction.label}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Rating:</span>
                            <RatingDisplay rating={survey.ratings.overallSatisfaction} />
                          </div>
                          {survey.favoriteMenu && (
                            <div className="text-xs text-gray-500">
                              Menu: {survey.favoriteMenu}
                            </div>
                          )}
                          <div className="flex gap-2 mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-xs h-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSurvey(survey);
                              }}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Detail
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(survey.id);
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Survey Detail */}
            <div className="lg:sticky lg:top-24 h-fit">
              {selectedSurvey ? (
                <Card className="border-0 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
                    <CardTitle className="text-lg">Detail Survei</CardTitle>
                    <CardDescription className="text-white/90 text-sm">
                      {formatDate(selectedSurvey.timestamp)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4 max-h-[550px] overflow-y-auto">
                    {/* Personal Info */}
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Data Pelanggan</h4>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Nama:</span>
                          <span className="font-medium">{selectedSurvey.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium text-xs">{selectedSurvey.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Telepon:</span>
                          <span className="font-medium">{selectedSurvey.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Visit Info */}
                    {(selectedSurvey.visitFrequency || selectedSurvey.averageSpending || selectedSurvey.favoriteMenu) && (
                      <div className="pt-3 border-t">
                        <h4 className="font-semibold mb-2 text-sm">Informasi Kunjungan</h4>
                        <div className="space-y-1.5 text-sm">
                          {selectedSurvey.visitFrequency && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Frekuensi:</span>
                              <span className="font-medium text-xs">{selectedSurvey.visitFrequency}</span>
                            </div>
                          )}
                          {selectedSurvey.averageSpending && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Pengeluaran:</span>
                              <span className="font-medium text-xs">{selectedSurvey.averageSpending}</span>
                            </div>
                          )}
                          {selectedSurvey.favoriteMenu && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Menu Favorit:</span>
                              <span className="font-medium text-xs">{selectedSurvey.favoriteMenu}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Ratings */}
                    <div className="pt-3 border-t">
                      <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        Penilaian Detail
                      </h4>
                      <div className="space-y-2.5">
                        {selectedSurvey.ratings.foodQuality > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">Rasa & Kualitas</span>
                            <RatingDisplay rating={selectedSurvey.ratings.foodQuality} />
                          </div>
                        )}
                        {selectedSurvey.ratings.cleanliness > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">Kebersihan</span>
                            <RatingDisplay rating={selectedSurvey.ratings.cleanliness} />
                          </div>
                        )}
                        {selectedSurvey.ratings.serviceSpeed > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">Kecepatan Layanan</span>
                            <RatingDisplay rating={selectedSurvey.ratings.serviceSpeed} />
                          </div>
                        )}
                        {selectedSurvey.ratings.staffFriendliness > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">Keramahan Pegawai</span>
                            <RatingDisplay rating={selectedSurvey.ratings.staffFriendliness} />
                          </div>
                        )}
                        {selectedSurvey.ratings.priceValue > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">Harga</span>
                            <RatingDisplay rating={selectedSurvey.ratings.priceValue} />
                          </div>
                        )}
                        {selectedSurvey.ratings.menuVariety > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">Variasi Menu</span>
                            <RatingDisplay rating={selectedSurvey.ratings.menuVariety} />
                          </div>
                        )}
                        {selectedSurvey.ratings.ambiance > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">Suasana</span>
                            <RatingDisplay rating={selectedSurvey.ratings.ambiance} />
                          </div>
                        )}
                        <div className="pt-2 border-t">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-sm">Keseluruhan</span>
                            <RatingDisplay rating={selectedSurvey.ratings.overallSatisfaction} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Feedback */}
                    {selectedSurvey.feedback && (
                      <div className="pt-3 border-t">
                        <h4 className="font-semibold mb-2 text-sm">Saran & Kritik</h4>
                        <p className="text-xs text-gray-700 bg-orange-50 p-3 rounded-lg border border-orange-200">
                          {selectedSurvey.feedback}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="pt-3 border-t">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        onClick={() => handleDelete(selectedSurvey.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Hapus Data Survei
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-0 shadow-lg">
                  <CardContent className="py-16 text-center">
                    <Eye className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Pilih Survei
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Klik pada survei di sebelah kiri untuk melihat detailnya
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
