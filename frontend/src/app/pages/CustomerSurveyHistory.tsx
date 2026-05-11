import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import DashboardLayout from "../components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  ClipboardList,
  Calendar,
  Star,
  MessageSquare,
  Trash2,
  Eye,
  Plus,
  UtensilsCrossed
} from "lucide-react";
import { toast } from "sonner";

interface Survey {
  id: number;
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  age: string;
  gender: string;
  location: string;
  visitFrequency: string;
  averageSpending: string;
  favoriteMenu: string;
  visitTime: string;
  feedback: string;
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
}

export default function CustomerSurveyHistory() {
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
    if (confirm("Apakah Anda yakin ingin menghapus penilaian ini?")) {
      const updatedSurveys = surveys.filter(s => s.id !== id);
      localStorage.setItem("customerSurveys", JSON.stringify(updatedSurveys));
      setSurveys(updatedSurveys);
      setSelectedSurvey(null);
      toast.success("Penilaian berhasil dihapus");
    }
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
      month: "long",
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

  return (
    <DashboardLayout title="Riwayat Penilaian">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-semibold">Riwayat Penilaian Anda</h2>
            <p className="text-gray-600 mt-1">Total {surveys.length} kali memberikan penilaian</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/customer")}
            >
              Kembali ke Dashboard
            </Button>
            <Button
              onClick={() => navigate("/customer-survey")}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Beri Penilaian Baru
            </Button>
          </div>
        </div>

        {surveys.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="py-16 text-center">
              <UtensilsCrossed className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Belum Ada Penilaian
              </h3>
              <p className="text-gray-500 mb-6">
                Anda belum memberikan penilaian. Mulai berikan penilaian sekarang!
              </p>
              <Button
                onClick={() => navigate("/customer-survey")}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Beri Penilaian
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Survey List */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Daftar Penilaian</h3>
              {surveys.map((survey) => {
                const satisfaction = getSatisfactionLevel(survey.ratings.overallSatisfaction);
                return (
                  <Card
                    key={survey.id}
                    className={`border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer ${
                      selectedSurvey?.id === survey.id ? "ring-2 ring-orange-500" : ""
                    }`}
                    onClick={() => setSelectedSurvey(survey)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            {formatDate(survey.timestamp)}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {survey.name}
                            {survey.favoriteMenu && ` • Menu: ${survey.favoriteMenu}`}
                          </CardDescription>
                        </div>
                        <Badge className={`${satisfaction.color} text-white border-0`}>
                          {satisfaction.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Kepuasan Keseluruhan:</span>
                          <RatingDisplay rating={survey.ratings.overallSatisfaction} />
                        </div>
                        {survey.visitFrequency && (
                          <div className="text-xs text-gray-500">
                            Frekuensi: {survey.visitFrequency}
                          </div>
                        )}
                        <div className="flex gap-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSurvey(survey);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Detail
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(survey.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Survey Detail */}
            <div className="lg:sticky lg:top-24 h-fit">
              {selectedSurvey ? (
                <Card className="border-0 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
                    <CardTitle className="text-xl">Detail Penilaian</CardTitle>
                    <CardDescription className="text-white/90">
                      {formatDate(selectedSurvey.timestamp)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {/* Personal Info */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-orange-600" />
                        Data Diri
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Nama:</span>
                          <span className="font-medium">{selectedSurvey.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium">{selectedSurvey.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Telepon:</span>
                          <span className="font-medium">{selectedSurvey.phone}</span>
                        </div>
                        {selectedSurvey.age && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Usia:</span>
                            <span className="font-medium">{selectedSurvey.age} tahun</span>
                          </div>
                        )}
                        {selectedSurvey.gender && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Jenis Kelamin:</span>
                            <span className="font-medium">{selectedSurvey.gender}</span>
                          </div>
                        )}
                        {selectedSurvey.location && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Lokasi:</span>
                            <span className="font-medium">{selectedSurvey.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Visit Info */}
                    {(selectedSurvey.visitFrequency || selectedSurvey.averageSpending || selectedSurvey.favoriteMenu || selectedSurvey.visitTime) && (
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <UtensilsCrossed className="w-4 h-4 text-red-600" />
                          Informasi Kunjungan
                        </h4>
                        <div className="space-y-2 text-sm">
                          {selectedSurvey.visitFrequency && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Frekuensi:</span>
                              <span className="font-medium">{selectedSurvey.visitFrequency}</span>
                            </div>
                          )}
                          {selectedSurvey.averageSpending && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Pengeluaran:</span>
                              <span className="font-medium">{selectedSurvey.averageSpending}</span>
                            </div>
                          )}
                          {selectedSurvey.favoriteMenu && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Menu Favorit:</span>
                              <span className="font-medium">{selectedSurvey.favoriteMenu}</span>
                            </div>
                          )}
                          {selectedSurvey.visitTime && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Waktu Kunjungan:</span>
                              <span className="font-medium">{selectedSurvey.visitTime}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Ratings */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        Penilaian
                      </h4>
                      <div className="space-y-3">
                        {selectedSurvey.ratings.foodQuality > 0 && (
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-600">Rasa & Kualitas Makanan</span>
                              <RatingDisplay rating={selectedSurvey.ratings.foodQuality} />
                            </div>
                          </div>
                        )}
                        {selectedSurvey.ratings.cleanliness > 0 && (
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-600">Kebersihan Tempat & Peralatan</span>
                              <RatingDisplay rating={selectedSurvey.ratings.cleanliness} />
                            </div>
                          </div>
                        )}
                        {selectedSurvey.ratings.serviceSpeed > 0 && (
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-600">Kecepatan Pelayanan</span>
                              <RatingDisplay rating={selectedSurvey.ratings.serviceSpeed} />
                            </div>
                          </div>
                        )}
                        {selectedSurvey.ratings.staffFriendliness > 0 && (
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-600">Keramahan Pegawai</span>
                              <RatingDisplay rating={selectedSurvey.ratings.staffFriendliness} />
                            </div>
                          </div>
                        )}
                        {selectedSurvey.ratings.priceValue > 0 && (
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-600">Harga (Value for Money)</span>
                              <RatingDisplay rating={selectedSurvey.ratings.priceValue} />
                            </div>
                          </div>
                        )}
                        {selectedSurvey.ratings.menuVariety > 0 && (
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-600">Variasi Menu</span>
                              <RatingDisplay rating={selectedSurvey.ratings.menuVariety} />
                            </div>
                          </div>
                        )}
                        {selectedSurvey.ratings.ambiance > 0 && (
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-600">Suasana Tempat Makan</span>
                              <RatingDisplay rating={selectedSurvey.ratings.ambiance} />
                            </div>
                          </div>
                        )}
                        <div className="pt-3 border-t">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Kepuasan Keseluruhan</span>
                            <RatingDisplay rating={selectedSurvey.ratings.overallSatisfaction} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Feedback */}
                    {selectedSurvey.feedback && (
                      <div>
                        <h4 className="font-semibold mb-2">Saran dan Kritik</h4>
                        <p className="text-sm text-gray-700 bg-orange-50 p-3 rounded-lg border border-orange-200">
                          {selectedSurvey.feedback}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="pt-4 border-t">
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => handleDelete(selectedSurvey.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Hapus Penilaian
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-0 shadow-lg">
                  <CardContent className="py-16 text-center">
                    <Eye className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Pilih Penilaian
                    </h3>
                    <p className="text-gray-500">
                      Klik pada penilaian di sebelah kiri untuk melihat detailnya
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
