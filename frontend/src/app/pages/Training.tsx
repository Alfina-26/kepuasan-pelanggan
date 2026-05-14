import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Slider } from "../components/ui/slider";
import { Progress } from "../components/ui/progress";
import { useData } from "../context/DataContext";
import { toast } from "sonner";
import { api } from "../../lib/api";
// @ts-ignore
import makanan1 from "../../assets/makanan1.jpg";
import { 
  Brain, 
  Settings, 
  PlayCircle, 
  CheckCircle2, 
  TrendingUp, 
  LogOut, 
  ChevronLeft 
} from "lucide-react"; // Pastikan menggunakan lucide-react

export default function Training() {
  const [trainTestSplit, setTrainTestSplit] = useState([80]);
  const [maxDepth, setMaxDepth] = useState([10]);
  const [minSamples, setMinSamples] = useState([2]);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingComplete, setTrainingComplete] = useState(false);
  const { datasets, addModel } = useData();
  const navigate = useNavigate();

  const handleStartTraining = async () => {
    if (datasets.length === 0) {
      toast.error("Upload dataset terlebih dahulu");
      navigate("/upload");
      return;
    }

    setIsTraining(true);
    setTrainingProgress(0);
    setTrainingComplete(false);

    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 90) { clearInterval(interval); return 90; }
        return prev + 5;
      });
    }, 200);

    try {
      const result = await api.startTraining({
        dataset_id: datasets[datasets.length - 1].id,
        target_column: "Rating Keseluruhan",
        test_size: (100 - trainTestSplit[0]) / 100,
        max_depth: maxDepth[0],
        min_samples_split: minSamples[0],
      });

      clearInterval(interval);
      setTrainingProgress(100);
      addModel(result.model);
      setTrainingComplete(true);
      toast.success("Model berhasil dilatih!");
    } catch (err: any) {
      clearInterval(interval);
      toast.error(err.message || "Gagal melatih model");
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      {/* 1. HEADER (Sesuai image_93f253.jpg) */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl overflow-hidden shadow-sm border border-orange-100">
              <img src={makanan1} alt="Logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-orange-900 leading-tight">Rumah Makan Nasi Padang</h1>
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Training Model Decision Tree</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-xl gap-2 text-gray-500 font-bold hover:bg-gray-100" 
                onClick={() => navigate(-1)}
             >
                <ChevronLeft className="w-4 h-4" /> Kembali
             </Button>
             <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl border-gray-200 gap-2 text-gray-600 font-bold hover:bg-red-50 hover:text-red-600" 
                onClick={() => navigate('/login')}
             >
                <LogOut className="w-4 h-4" /> Logout
             </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 md:p-10 space-y-8">
        
        {/* 2. DATASET INFO CARD */}
        <Card className="border-none shadow-sm bg-white rounded-[32px] overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-black text-gray-800">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              Dataset yang Tersedia
            </CardTitle>
            <CardDescription className="font-bold text-xs uppercase tracking-widest text-orange-500">
              {datasets.length > 0 ? `${datasets.length} dataset siap untuk training` : "Belum ada dataset yang diupload"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-2">
            {datasets.length > 0 ? (
              <div className="space-y-3">
                {datasets.map((ds) => (
                  <div key={ds.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between hover:border-blue-200 transition-colors">
                    <div>
                      <p className="font-black text-gray-800">{ds.filename}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">
                        {ds.rows.toLocaleString()} baris • {ds.columns.length} kolom
                      </p>
                    </div>
                    <span className="px-4 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase rounded-full tracking-tighter">
                      {ds.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
                <p className="text-sm font-bold text-gray-400">Silakan unggah dataset di Manajemen Data</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 3. PARAMETER TRAINING CARD */}
        <Card className="border-none shadow-sm bg-white rounded-[32px] overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-black text-gray-800">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              Parameter Training
            </CardTitle>
            <CardDescription className="font-bold text-xs uppercase tracking-widest text-orange-500">Sesuaikan parameter untuk optimasi model</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-2 space-y-10">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="font-black text-gray-700 text-sm uppercase tracking-wide">Train/Test Split Ratio</Label>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-black">{trainTestSplit[0]}% / {100 - trainTestSplit[0]}%</span>
              </div>
              <Slider value={trainTestSplit} onValueChange={setTrainTestSplit} min={60} max={90} step={5} disabled={isTraining} className="py-4" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="font-black text-gray-700 text-sm uppercase tracking-wide">Maximum Depth</Label>
                <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-black">{maxDepth[0]}</span>
              </div>
              <Slider value={maxDepth} onValueChange={setMaxDepth} min={3} max={20} step={1} disabled={isTraining} className="py-4" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="font-black text-gray-700 text-sm uppercase tracking-wide">Minimum Samples Split</Label>
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-black">{minSamples[0]}</span>
              </div>
              <Slider value={minSamples} onValueChange={setMinSamples} min={2} max={10} step={1} disabled={isTraining} className="py-4" />
            </div>
          </CardContent>
        </Card>

        {/* 4. PROGRESS & COMPLETION STATUS */}
        {isTraining && (
          <Card className="border-none shadow-lg bg-blue-600 text-white rounded-[32px] overflow-hidden animate-in fade-in zoom-in">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                   <TrendingUp className="w-6 h-6 animate-pulse" />
                   <span className="font-black uppercase tracking-widest text-sm">Training in Progress...</span>
                </div>
                <span className="font-black text-2xl">{trainingProgress}%</span>
              </div>
              <Progress value={trainingProgress} className="h-3 bg-blue-400/30 indicator-white" />
            </CardContent>
          </Card>
        )}

        {trainingComplete && (
          <Card className="border-none shadow-lg bg-emerald-600 text-white rounded-[32px] overflow-hidden animate-in fade-in zoom-in">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-white/20 p-3 rounded-2xl">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-black text-2xl">Training Selesai!</p>
                  <p className="text-sm opacity-80 font-bold uppercase tracking-widest">Model Anda siap dievaluasi</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => navigate("/evaluation")} 
                  className="bg-white text-emerald-700 hover:bg-emerald-50 font-black rounded-2xl py-6 flex-1 shadow-lg"
                >
                  Lihat Evaluasi
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/visualization")}
                  className="border-white/30 bg-transparent text-white hover:bg-white/10 font-black rounded-2xl py-6 flex-1"
                >
                  Visualisasi Pohon
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 5. ACTION BUTTONS */}
        <div className="flex gap-4 pt-4">
          <Button 
            onClick={handleStartTraining} 
            disabled={isTraining || datasets.length === 0}
            className="flex-1 py-8 rounded-[24px] text-lg font-black bg-gray-900 hover:bg-black text-white shadow-xl shadow-gray-200 transition-all hover:-translate-y-1 disabled:opacity-50"
          >
            {isTraining ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                MELATIH MODEL...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <PlayCircle className="w-6 h-6" />
                MULAI TRAINING
              </div>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}