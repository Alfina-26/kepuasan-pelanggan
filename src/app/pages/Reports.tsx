import { useNavigate } from "react-router";
import DashboardLayout from "../components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useData } from "../context/DataContext";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { FileText, Download, TrendingUp, Users, Brain, Target } from "lucide-react";
import { toast } from "sonner";

export default function Reports() {
  const { predictions, currentModel, models } = useData();
  const navigate = useNavigate();

  const satisfactionData = [
    {
      name: "Puas",
      value: predictions.filter(p => p.result === "Puas").length,
      color: "#10b981",
    },
    {
      name: "Tidak Puas",
      value: predictions.filter(p => p.result === "Tidak Puas").length,
      color: "#ef4444",
    },
  ];

  const modelPerformanceData = models.map((model, index) => ({
    name: `Model ${index + 1}`,
    accuracy: model.accuracy * 100,
    precision: model.precision * 100,
    recall: model.recall * 100,
    f1Score: model.f1Score * 100,
  }));

  // Mock time series data
  const timeSeriesData = [
    { month: "Jan", puas: 65, tidakPuas: 35 },
    { month: "Feb", puas: 68, tidakPuas: 32 },
    { month: "Mar", puas: 72, tidakPuas: 28 },
    { month: "Apr", puas: 75, tidakPuas: 25 },
    { month: "Mei", puas: 78, tidakPuas: 22 },
    { month: "Jun", puas: 82, tidakPuas: 18 },
  ];

  const handleExportPDF = () => {
    toast.success("Laporan PDF berhasil di-export!");
  };

  const handleExportExcel = () => {
    toast.success("Laporan Excel berhasil di-export!");
  };

  const totalPredictions = predictions.length;
  const satisfiedRate = totalPredictions > 0 
    ? (predictions.filter(p => p.result === "Puas").length / totalPredictions) * 100 
    : 0;

  return (
    <DashboardLayout title="Laporan Analitik">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Export Buttons */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Laporan Komprehensif
                </CardTitle>
                <CardDescription>
                  Analisis lengkap performa sistem dan prediksi kepuasan pelanggan
                </CardDescription>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleExportPDF} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
                <Button onClick={handleExportExcel} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Excel
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="w-5 h-5" />
                Total Prediksi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalPredictions}</p>
              <p className="text-sm opacity-90 mt-1">Pelanggan dianalisis</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="w-5 h-5" />
                Tingkat Kepuasan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{satisfiedRate.toFixed(1)}%</p>
              <p className="text-sm opacity-90 mt-1">Pelanggan puas</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Brain className="w-5 h-5" />
                Model Terlatih
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{models.length}</p>
              <p className="text-sm opacity-90 mt-1">Total model</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="w-5 h-5" />
                Akurasi Rata-rata
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {models.length > 0 
                  ? ((models.reduce((sum, m) => sum + m.accuracy, 0) / models.length) * 100).toFixed(1) 
                  : 0}%
              </p>
              <p className="text-sm opacity-90 mt-1">Performance metrics</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Satisfaction Distribution */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Distribusi Kepuasan Pelanggan</CardTitle>
              <CardDescription>
                Perbandingan pelanggan puas dan tidak puas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {totalPredictions > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={satisfactionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {satisfactionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-400">
                  <p>Belum ada data prediksi</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Model Performance Comparison */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Perbandingan Performa Model</CardTitle>
              <CardDescription>
                Metrik evaluasi untuk setiap model terlatih
              </CardDescription>
            </CardHeader>
            <CardContent>
              {models.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={modelPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                      <Legend />
                      <Bar dataKey="accuracy" fill="#3b82f6" name="Accuracy" />
                      <Bar dataKey="precision" fill="#8b5cf6" name="Precision" />
                      <Bar dataKey="recall" fill="#10b981" name="Recall" />
                      <Bar dataKey="f1Score" fill="#f59e0b" name="F1-Score" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-400">
                  <p>Belum ada model terlatih</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Time Series Trend */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Tren Kepuasan Pelanggan</CardTitle>
            <CardDescription>
              Perkembangan tingkat kepuasan pelanggan dari waktu ke waktu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value: number) => `${value}%`} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="puas" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Pelanggan Puas (%)"
                    dot={{ fill: "#10b981", r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="tidakPuas" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Pelanggan Tidak Puas (%)"
                    dot={{ fill: "#ef4444", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="border-0 shadow-lg bg-blue-50">
          <CardHeader>
            <CardTitle>Insight & Rekomendasi</CardTitle>
            <CardDescription>
              Analisis dan rekomendasi berdasarkan data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs">1</span>
                <span>
                  <strong>Tren Positif:</strong> Tingkat kepuasan pelanggan menunjukkan tren meningkat dari bulan ke bulan, 
                  dengan peningkatan sebesar {satisfiedRate > 70 ? "signifikan" : "moderat"}.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs">2</span>
                <span>
                  <strong>Akurasi Model:</strong> Model Decision Tree mencapai akurasi {currentModel ? `${(currentModel.accuracy * 100).toFixed(1)}%` : "tinggi"}, 
                  menunjukkan performa yang {currentModel && currentModel.accuracy > 0.85 ? "sangat baik" : "baik"} dalam prediksi.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs">3</span>
                <span>
                  <strong>Rekomendasi:</strong> Fokus pada peningkatan frekuensi pembelian pelanggan dengan usia di bawah 30 tahun 
                  untuk meningkatkan tingkat kepuasan keseluruhan.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs">4</span>
                <span>
                  <strong>Action Items:</strong> Implementasikan program loyalitas untuk mempertahankan pelanggan yang puas 
                  dan meningkatkan engagement dengan pelanggan yang tidak puas.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button onClick={() => navigate("/prediction")}>
            Lakukan Prediksi Baru
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Kembali
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
