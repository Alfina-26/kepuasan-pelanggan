import { useState } from "react";
import { useNavigate } from "react-router";
import DashboardLayout from "../components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useData } from "../context/DataContext";
import { toast } from "sonner";
import { TrendingUp, AlertCircle, User, Calendar, ShoppingCart, Check, X } from "lucide-react";

export default function Prediction() {
  const { currentModel, addPrediction, predictions } = useData();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    customerId: "",
    age: "",
    gender: "",
    purchaseFrequency: "",
  });
  
  const [predictionResult, setPredictionResult] = useState<{
    result: string;
    probability: number;
  } | null>(null);

  if (!currentModel) {
    return (
      <DashboardLayout title="Prediksi Kepuasan Pelanggan">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                Belum Ada Model
              </CardTitle>
              <CardDescription>
                Silakan latih model terlebih dahulu untuk melakukan prediksi
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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePredict = () => {
    // Validate inputs
    if (!formData.customerId || !formData.age || !formData.gender || !formData.purchaseFrequency) {
      toast.error("Harap lengkapi semua field");
      return;
    }

    // Mock prediction logic
    const age = parseInt(formData.age);
    const frequency = parseInt(formData.purchaseFrequency);
    
    let result = "Puas";
    let probability = 0.75;

    // Simple decision logic (mocking the decision tree)
    if (frequency <= 10) {
      if (age <= 30) {
        result = "Tidak Puas";
        probability = 0.72;
      } else {
        result = "Puas";
        probability = 0.68;
      }
    } else {
      result = "Puas";
      probability = formData.gender === "female" ? 0.85 : 0.80;
    }

    // Add some randomness
    probability += (Math.random() - 0.5) * 0.1;
    probability = Math.max(0.5, Math.min(0.99, probability));

    const prediction = {
      id: `PRD${Date.now()}`,
      inputData: { ...formData },
      result,
      probability,
      createdDate: new Date().toLocaleString('id-ID'),
    };

    addPrediction(prediction);
    setPredictionResult({ result, probability });
    toast.success("Prediksi berhasil!");
  };

  const handleReset = () => {
    setFormData({
      customerId: "",
      age: "",
      gender: "",
      purchaseFrequency: "",
    });
    setPredictionResult(null);
  };

  return (
    <DashboardLayout title="Prediksi Kepuasan Pelanggan">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Model Info */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {currentModel.modelName}
            </CardTitle>
            <CardDescription>
              Akurasi: {(currentModel.accuracy * 100).toFixed(2)}% • Total Prediksi: {predictions.length}
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Input Data Pelanggan</CardTitle>
              <CardDescription>
                Masukkan data pelanggan untuk memprediksi tingkat kepuasan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerId" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Customer ID
                </Label>
                <Input
                  id="customerId"
                  placeholder="Contoh: C001"
                  value={formData.customerId}
                  onChange={(e) => handleInputChange("customerId", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Usia
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Contoh: 25"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Laki-laki</SelectItem>
                    <SelectItem value="female">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchaseFrequency" className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Frekuensi Pembelian (per bulan)
                </Label>
                <Input
                  id="purchaseFrequency"
                  type="number"
                  placeholder="Contoh: 12"
                  value={formData.purchaseFrequency}
                  onChange={(e) => handleInputChange("purchaseFrequency", e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handlePredict}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Prediksi
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Prediction Result */}
          <div className="space-y-6">
            {predictionResult ? (
              <>
                <Card className={`border-0 shadow-lg ${
                  predictionResult.result === "Puas" 
                    ? "bg-gradient-to-br from-green-500 to-green-600" 
                    : "bg-gradient-to-br from-red-500 to-red-600"
                } text-white`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      {predictionResult.result === "Puas" ? (
                        <Check className="w-8 h-8" />
                      ) : (
                        <X className="w-8 h-8" />
                      )}
                      Hasil Prediksi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm opacity-90">Status Kepuasan</p>
                        <p className="text-4xl font-bold mt-1">
                          {predictionResult.result}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm opacity-90">Confidence Level</p>
                        <p className="text-2xl font-bold mt-1">
                          {(predictionResult.probability * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-base">Detail Prediksi</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Customer ID:</span>
                      <span className="font-medium">{formData.customerId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Usia:</span>
                      <span className="font-medium">{formData.age} tahun</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Gender:</span>
                      <span className="font-medium capitalize">{formData.gender === "male" ? "Laki-laki" : "Perempuan"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Frekuensi Pembelian:</span>
                      <span className="font-medium">{formData.purchaseFrequency}x/bulan</span>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-base">Hasil Prediksi</CardTitle>
                  <CardDescription>
                    Hasil akan ditampilkan setelah melakukan prediksi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-40 flex items-center justify-center text-gray-400">
                    <TrendingUp className="w-16 h-16" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Prediction History */}
        {predictions.length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Riwayat Prediksi</CardTitle>
              <CardDescription>
                5 prediksi terakhir
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {predictions.slice(-5).reverse().map((pred) => (
                  <div 
                    key={pred.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">ID: {pred.id}</p>
                      <p className="text-sm text-gray-500">{pred.createdDate}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-lg font-semibold ${
                      pred.result === "Puas" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {pred.result}
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm font-medium text-gray-700">
                        {(pred.probability * 100).toFixed(1)}%
                      </p>
                      <p className="text-xs text-gray-500">confidence</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate("/reports")}>
            Lihat Laporan
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Kembali
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
