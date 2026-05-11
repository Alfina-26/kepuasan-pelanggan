import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import DashboardLayout from "../components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  MessageSquare,
  Star,
  TrendingUp,
  CheckCircle2,
  ClipboardList
} from "lucide-react";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [surveyCount, setSurveyCount] = useState(0);

  useEffect(() => {
    // Load survey count from localStorage
    const surveys = JSON.parse(localStorage.getItem("customerSurveys") || "[]");
    setSurveyCount(surveys.length);
  }, []);

  const features = [
    {
      title: "Isi Survei Kepuasan",
      description: "Berikan penilaian tentang makanan dan pelayanan kami",
      icon: MessageSquare,
      color: "from-orange-500 to-orange-600",
      action: () => navigate("/customer-survey"),
    },
    {
      title: "Riwayat Survei",
      description: "Lihat riwayat penilaian yang telah Anda berikan",
      icon: ClipboardList,
      color: "from-red-500 to-red-600",
      action: () => navigate("/customer-survey-history"),
    },
  ];

  return (
    <DashboardLayout title="Dashboard Pelanggan">
      <div className="space-y-6">
        {/* Welcome Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-600 text-white">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-2xl">Selamat Datang di Rumah Makan Kami!</CardTitle>
                <CardDescription className="text-white/90 mt-1">
                  Terima kasih telah menjadi pelanggan setia kami
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-white/90">
              Pendapat Anda sangat berharga bagi kami. Mari bagikan pengalaman kuliner Anda untuk membantu kami meningkatkan cita rasa dan pelayanan.
            </p>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                Total Kunjungan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-orange-600">{surveyCount}</p>
              <p className="text-sm text-gray-600 mt-1">Kali memberikan penilaian</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Member Setia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-600">Aktif</p>
              <p className="text-sm text-gray-600 mt-1">Pelanggan terdaftar</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Features */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Menu Utama</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                  onClick={feature.action}
                >
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="ghost"
                      className="w-full group-hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        feature.action();
                      }}
                    >
                      Buka
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
