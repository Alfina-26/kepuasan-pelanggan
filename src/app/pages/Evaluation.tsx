import { useNavigate } from "react-router";
import DashboardLayout from "../components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useData } from "../context/DataContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { Activity, Target, Crosshair, TrendingUp, AlertCircle } from "lucide-react";

export default function Evaluation() {
  const { currentModel } = useData();
  const navigate = useNavigate();

  if (!currentModel) {
    return (
      <DashboardLayout title="Evaluasi Model">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                Belum Ada Model
              </CardTitle>
              <CardDescription>
                Silakan latih model terlebih dahulu untuk melihat evaluasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/training")}>
                Mulai Training
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const metricsData = [
    {
      name: "Accuracy",
      value: currentModel.accuracy * 100,
      color: "#3b82f6",
    },
    {
      name: "Precision",
      value: currentModel.precision * 100,
      color: "#8b5cf6",
    },
    {
      name: "Recall",
      value: currentModel.recall * 100,
      color: "#10b981",
    },
    {
      name: "F1-Score",
      value: currentModel.f1Score * 100,
      color: "#f59e0b",
    },
  ];

  // Mock confusion matrix
  const confusionMatrix = {
    truePositive: 425,
    trueNegative: 398,
    falsePositive: 52,
    falseNegative: 45,
  };

  const total = confusionMatrix.truePositive + confusionMatrix.trueNegative + 
                confusionMatrix.falsePositive + confusionMatrix.falseNegative;

  return (
    <DashboardLayout title="Evaluasi Model">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Model Info */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle>{currentModel.modelName}</CardTitle>
            <CardDescription>
              Dilatih pada: {currentModel.createdDate}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="w-5 h-5" />
                Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {(currentModel.accuracy * 100).toFixed(2)}%
              </p>
              <p className="text-sm opacity-90 mt-1">Overall accuracy</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="w-5 h-5" />
                Precision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {(currentModel.precision * 100).toFixed(2)}%
              </p>
              <p className="text-sm opacity-90 mt-1">Positive predictive value</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Crosshair className="w-5 h-5" />
                Recall
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {(currentModel.recall * 100).toFixed(2)}%
              </p>
              <p className="text-sm opacity-90 mt-1">True positive rate</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="w-5 h-5" />
                F1-Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {(currentModel.f1Score * 100).toFixed(2)}%
              </p>
              <p className="text-sm opacity-90 mt-1">Harmonic mean</p>
            </CardContent>
          </Card>
        </div>

        {/* Metrics Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Perbandingan Metrik Evaluasi</CardTitle>
            <CardDescription>
              Visualisasi performa model berdasarkan berbagai metrik
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metricsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                  <Legend />
                  <Bar dataKey="value" name="Percentage" radius={[8, 8, 0, 0]}>
                    {metricsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Confusion Matrix */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Confusion Matrix</CardTitle>
            <CardDescription>
              Matriks klasifikasi untuk evaluasi performa model
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              {/* Headers */}
              <div></div>
              <div className="text-center font-semibold text-gray-700">Prediksi: Puas</div>
              <div className="text-center font-semibold text-gray-700">Prediksi: Tidak Puas</div>
              
              {/* Row 1 */}
              <div className="flex items-center justify-end font-semibold text-gray-700 pr-4">
                Aktual: Puas
              </div>
              <div className="p-6 bg-green-100 border-2 border-green-300 rounded-lg text-center">
                <p className="text-3xl font-bold text-green-800">{confusionMatrix.truePositive}</p>
                <p className="text-xs text-green-600 mt-1">True Positive</p>
                <p className="text-xs text-gray-600">{((confusionMatrix.truePositive / total) * 100).toFixed(1)}%</p>
              </div>
              <div className="p-6 bg-red-100 border-2 border-red-300 rounded-lg text-center">
                <p className="text-3xl font-bold text-red-800">{confusionMatrix.falseNegative}</p>
                <p className="text-xs text-red-600 mt-1">False Negative</p>
                <p className="text-xs text-gray-600">{((confusionMatrix.falseNegative / total) * 100).toFixed(1)}%</p>
              </div>
              
              {/* Row 2 */}
              <div className="flex items-center justify-end font-semibold text-gray-700 pr-4">
                Aktual: Tidak Puas
              </div>
              <div className="p-6 bg-red-100 border-2 border-red-300 rounded-lg text-center">
                <p className="text-3xl font-bold text-red-800">{confusionMatrix.falsePositive}</p>
                <p className="text-xs text-red-600 mt-1">False Positive</p>
                <p className="text-xs text-gray-600">{((confusionMatrix.falsePositive / total) * 100).toFixed(1)}%</p>
              </div>
              <div className="p-6 bg-green-100 border-2 border-green-300 rounded-lg text-center">
                <p className="text-3xl font-bold text-green-800">{confusionMatrix.trueNegative}</p>
                <p className="text-xs text-green-600 mt-1">True Negative</p>
                <p className="text-xs text-gray-600">{((confusionMatrix.trueNegative / total) * 100).toFixed(1)}%</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Total Sampel:</span> {total.toLocaleString()} data pelanggan
              </p>
              <p className="text-sm text-gray-700 mt-1">
                <span className="font-semibold">Prediksi Benar:</span> {(confusionMatrix.truePositive + confusionMatrix.trueNegative).toLocaleString()} 
                ({(((confusionMatrix.truePositive + confusionMatrix.trueNegative) / total) * 100).toFixed(1)}%)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button onClick={() => navigate("/prediction")} className="flex-1">
            Lanjut ke Prediksi
          </Button>
          <Button variant="outline" onClick={() => navigate("/visualization")}>
            Lihat Visualisasi
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Kembali
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
