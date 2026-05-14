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
import { 
  TrendingUp, 
  AlertCircle, 
  User, 
  Calendar, 
  ShoppingCart, 
  Check, 
  X, 
  ChevronLeft, 
  FileText, 
  History,
  Zap,
  Target
} from "lucide-react";
import { api } from "../../lib/api";

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
        <div className="max-w-xl mx-auto mt-20 text-center">
          <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-8">
            <CardContent className="pt-6 space-y-6">
              <div className="mx-auto w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-orange-500" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-black text-gray-800">Model Belum Siap</CardTitle>
                <CardDescription className="text-gray-500 font-medium px-10">
                  Anda perlu melatih model Decision Tree terlebih dahulu sebelum dapat melakukan prediksi.
                </CardDescription>
              </div>
              <Button 
                onClick={() => navigate("/training")}
                className="w-full py-7 rounded-2xl bg-orange-600 hover:bg-orange-700 font-black text-lg shadow-xl shadow-orange-100 transition-all active:scale-95"
              >
                Mulai Training Sekarang
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

  const handlePredict = async () => {
    if (!currentModel) return;
    try {
      const result = await api.predict(currentModel.id, {
        age: parseInt(formData.age),
        gender: formData.gender === "male" ? 0 : 1,
        purchase_frequency: parseInt(formData.purchaseFrequency),
      });
      setPredictionResult({ result: result.result, probability: result.probability });
      addPrediction({ 
        id: `PRED-${Date.now().toString().slice(-4)}`, 
        inputData: formData, 
        ...result, 
        createdDate: new Date().toLocaleString("id-ID") 
      });
      toast.success("Analisis selesai!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleReset = () => {
    setFormData({ customerId: "", age: "", gender: "", purchaseFrequency: "" });
    setPredictionResult(null);
  };

  return (
    <DashboardLayout title="Prediksi Kepuasan">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* MODEL BADGE & INFO */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="font-black text-gray-800 tracking-tight">{currentModel.modelName}</h2>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Active Model Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Model Accuracy</p>
              <p className="text-lg font-black text-gray-800">{(currentModel.accuracy * 100).toFixed(1)}%</p>
            </div>
            <div className="h-10 w-px bg-gray-100" />
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Total Analysis</p>
              <p className="text-lg font-black text-gray-800">{predictions.length}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* INPUT FORM (KIRI) */}
          <Card className="lg:col-span-7 border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-10 pb-4">
              <CardTitle className="text-2xl font-black text-gray-800">Input Data</CardTitle>
              <CardDescription className="font-medium text-gray-500">Lengkapi parameter pelanggan di bawah ini</CardDescription>
            </CardHeader>
            <CardContent className="p-10 pt-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black text-gray-500 uppercase ml-1">Customer ID</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                    <Input
                      className="pl-11 h-12 rounded-xl bg-gray-50 border-none focus-visible:ring-2 focus-visible:ring-blue-500 font-medium"
                      placeholder="C001"
                      value={formData.customerId}
                      onChange={(e) => handleInputChange("customerId", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black text-gray-500 uppercase ml-1">Usia Pelanggan</Label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                    <Input
                      type="number"
                      className="pl-11 h-12 rounded-xl bg-gray-50 border-none focus-visible:ring-2 focus-visible:ring-blue-500 font-medium"
                      placeholder="Contoh: 25"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black text-gray-500 uppercase ml-1">Jenis Kelamin</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger className="h-12 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 font-medium px-4">
                      <SelectValue placeholder="Pilih Gender" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl font-medium">
                      <SelectItem value="male">Laki-laki</SelectItem>
                      <SelectItem value="female">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black text-gray-500 uppercase ml-1">Frekuensi (Bulan)</Label>
                  <div className="relative">
                    <ShoppingCart className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                    <Input
                      type="number"
                      className="pl-11 h-12 rounded-xl bg-gray-50 border-none focus-visible:ring-2 focus-visible:ring-blue-500 font-medium"
                      placeholder="Contoh: 12"
                      value={formData.purchaseFrequency}
                      onChange={(e) => handleInputChange("purchaseFrequency", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handlePredict}
                  className="flex-1 py-7 rounded-2xl bg-gray-900 hover:bg-black text-white font-black text-lg transition-all active:scale-95 shadow-xl shadow-gray-200"
                >
                  <Zap className="w-5 h-5 mr-2 fill-yellow-400 text-yellow-400" /> Jalankan Prediksi
                </Button>
                <Button variant="ghost" onClick={handleReset} className="px-8 rounded-2xl font-bold text-gray-400 hover:text-gray-600">
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* RESULT AREA (KANAN) */}
          <div className="lg:col-span-5 space-y-6">
            {predictionResult ? (
              <>
                <Card className={`border-none shadow-2xl rounded-[2.5rem] overflow-hidden ${
                  predictionResult.result === "Puas" ? "bg-emerald-600" : "bg-red-600"
                } text-white transition-all duration-500 animate-in zoom-in-95`}>
                  <CardContent className="p-10 space-y-8">
                    <div className="flex justify-between items-start">
                      <div className="p-4 bg-white/20 rounded-3xl backdrop-blur-md">
                        {predictionResult.result === "Puas" ? <Check className="w-10 h-10" /> : <X className="w-10 h-10" />}
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black uppercase tracking-[0.2em] opacity-70">Confidence</p>
                        <p className="text-3xl font-black">{(predictionResult.probability * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] opacity-70 mb-1">Hasil Analisis Model</p>
                      <h3 className="text-5xl font-black tracking-tight">{predictionResult.result}</h3>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
                  <CardHeader className="p-8 pb-2">
                    <CardTitle className="text-sm font-black text-gray-400 uppercase tracking-widest">Detail Input</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-4 space-y-3">
                    {[
                      { label: "Customer ID", value: formData.customerId },
                      { label: "Usia", value: `${formData.age} Tahun` },
                      { label: "Gender", value: formData.gender === "male" ? "Laki-laki" : "Perempuan" },
                      { label: "Frekuensi", value: `${formData.purchaseFrequency}x / bulan` }
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                        <span className="text-gray-500 font-bold text-sm">{item.label}</span>
                        <span className="text-gray-800 font-black text-sm">{item.value || "-"}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] h-full flex flex-col items-center justify-center p-10 text-center space-y-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-10 h-10 text-gray-200" />
                </div>
                <div>
                  <p className="text-lg font-black text-gray-800">Menunggu Input</p>
                  <p className="text-sm font-medium text-gray-400">Hasil prediksi akan muncul di sini secara real-time</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* HISTORY SECTION */}
        {predictions.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 ml-2">
              <History className="w-5 h-5 text-gray-400" />
              <h3 className="font-black text-gray-700">Riwayat Terakhir</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {predictions.slice(-3).reverse().map((pred) => (
                <div key={pred.id} className="p-6 bg-white rounded-[2rem] shadow-sm border border-gray-50 flex items-center justify-between group hover:shadow-md transition-all">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{pred.id}</p>
                    <p className={`font-black ${pred.result === "Puas" ? "text-emerald-600" : "text-red-600"}`}>{pred.result}</p>
                    <p className="text-[10px] font-bold text-gray-400">{pred.createdDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-gray-800">{(pred.probability * 100).toFixed(0)}%</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Confidence</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BOTTOM ACTIONS */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
           <Button variant="ghost" onClick={() => navigate(-1)} className="rounded-xl font-bold text-gray-500">
             <ChevronLeft className="w-4 h-4 mr-2" /> Kembali
           </Button>
           <Button onClick={() => navigate("/reports")} className="rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold px-6 border-none">
             <FileText className="w-4 h-4 mr-2" /> Lihat Laporan Lengkap
           </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}