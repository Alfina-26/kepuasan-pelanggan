import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useData } from "../context/DataContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { 
  Activity, 
  Target, 
  Crosshair, 
  TrendingUp, 
  AlertCircle, 
  LogOut, 
  ChevronLeft,
  ArrowRight
} from "lucide-react";
// @ts-ignore
import makanan1 from "../../assets/makanan1.jpg";

export default function Evaluation() {
  const { currentModel } = useData();
  const navigate = useNavigate();

  // Header Component (Konsisten dengan Dashboard)
  const Header = () => (
    <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl overflow-hidden shadow-sm border border-orange-100 cursor-pointer" onClick={() => navigate('/developer-dashboard')}>
            <img src={makanan1} alt="Logo" className="h-full w-full object-cover" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-orange-900 leading-tight">Rumah Makan Nasi Padang</h1>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Evaluasi Model</p>
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
  );

  if (!currentModel) {
    return (
      <div className="min-h-screen bg-[#FDFCFB]">
        <Header />
        <main className="max-w-4xl mx-auto p-8 mt-10">
          <Card className="border-0 shadow-xl rounded-[32px] overflow-hidden bg-white">
            <CardHeader className="p-10 text-center">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-orange-500" />
              </div>
              <CardTitle className="text-2xl font-black text-gray-800">Belum Ada Model</CardTitle>
              <CardDescription className="text-base font-medium text-gray-500 mt-2">
                Silakan latih model terlebih dahulu untuk melihat hasil evaluasi performa.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-10 pt-0 flex justify-center">
              <Button 
                onClick={() => navigate("/training")}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 rounded-2xl font-bold shadow-lg shadow-orange-100 transition-all hover:-translate-y-1"
              >
                Mulai Training Sekarang
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const metricsData = [
    { name: "Accuracy", value: currentModel.accuracy * 100, color: "#2563eb" },
    { name: "Precision", value: currentModel.precision * 100, color: "#9333ea" },
    { name: "Recall", value: currentModel.recall * 100, color: "#10b981" },
    { name: "F1-Score", value: currentModel.f1Score * 100, color: "#f59e0b" },
  ];

  const confusionMatrix = { truePositive: 425, trueNegative: 398, falsePositive: 52, falseNegative: 45 };
  const total = confusionMatrix.truePositive + confusionMatrix.trueNegative + confusionMatrix.falsePositive + confusionMatrix.falseNegative;

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <Header />
      
      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        {/* Model Info Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
          <div>
            <h2 className="text-3xl font-black text-gray-800 tracking-tight">{currentModel.modelName}</h2>
            <p className="text-sm font-bold text-orange-500 uppercase tracking-widest mt-1">
              Dilatih pada: {currentModel.createdDate}
            </p>
          </div>
          <div className="flex gap-3">
             <Button onClick={() => navigate("/prediction")} className="rounded-xl font-bold bg-gray-900 hover:bg-black text-white gap-2 px-6">
                Lanjut Prediksi <ArrowRight className="w-4 h-4" />
             </Button>
          </div>
        </div>

        {/* Metrics Cards - Skema Warna Solid sesuai image_93f91d.jpg */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: "Accuracy", val: currentModel.accuracy, icon: Activity, bg: "bg-[#2563eb]", sub: "Overall accuracy" },
            { title: "Precision", val: currentModel.precision, icon: Target, bg: "bg-[#9333ea]", sub: "Predictive value" },
            { title: "Recall", val: currentModel.recall, icon: Crosshair, bg: "bg-[#10b981]", sub: "True positive rate" },
            { title: "F1-Score", val: currentModel.f1Score, icon: TrendingUp, bg: "bg-[#f59e0b]", sub: "Harmonic mean" },
          ].map((m, i) => (
            <Card key={i} className={`border-0 shadow-lg ${m.bg} text-white rounded-[28px] overflow-hidden`}>
              <CardContent className="p-8">
                <div className="flex items-center gap-2 mb-6 opacity-80">
                  <m.icon className="w-5 h-5" />
                  <span className="font-bold text-[10px] uppercase tracking-widest">{m.title}</span>
                </div>
                <p className="text-4xl font-black mb-1">{(m.val * 100).toFixed(2)}%</p>
                <p className="text-[10px] font-medium opacity-70 uppercase tracking-wide">{m.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Metrics Chart */}
          <Card className="border-none shadow-sm bg-white rounded-[32px] overflow-hidden">
            <CardHeader className="p-8 border-b border-gray-50">
              <CardTitle className="text-xl font-black text-gray-800">Visualisasi Performa</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metricsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontWeight: 'bold', fontSize: 12}} />
                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontWeight: 'bold', fontSize: 12}} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                      formatter={(value: number) => [`${value.toFixed(2)}%`, 'Skor']} 
                    />
                    <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={40}>
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
          <Card className="border-none shadow-sm bg-white rounded-[32px] overflow-hidden">
            <CardHeader className="p-8 border-b border-gray-50">
              <CardTitle className="text-xl font-black text-gray-800">Confusion Matrix</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-3 gap-3">
                <div />
                <div className="text-center font-bold text-[10px] uppercase text-gray-400 pb-2">Prediksi: Puas</div>
                <div className="text-center font-bold text-[10px] uppercase text-gray-400 pb-2">Prediksi: Tidak</div>
                
                <div className="flex items-center justify-end font-bold text-[10px] uppercase text-gray-400 pr-2">Aktual: Puas</div>
                <div className="p-5 bg-green-50 border border-green-100 rounded-2xl text-center">
                  <p className="text-2xl font-black text-green-700">{confusionMatrix.truePositive}</p>
                  <p className="text-[9px] font-bold text-green-600 uppercase">TP</p>
                </div>
                <div className="p-5 bg-red-50 border border-red-100 rounded-2xl text-center">
                  <p className="text-2xl font-black text-red-700">{confusionMatrix.falseNegative}</p>
                  <p className="text-[9px] font-bold text-red-600 uppercase">FN</p>
                </div>
                
                <div className="flex items-center justify-end font-bold text-[10px] uppercase text-gray-400 pr-2">Aktual: Tidak</div>
                <div className="p-5 bg-red-50 border border-red-100 rounded-2xl text-center">
                  <p className="text-2xl font-black text-red-700">{confusionMatrix.falsePositive}</p>
                  <p className="text-[9px] font-bold text-red-600 uppercase">FP</p>
                </div>
                <div className="p-5 bg-green-50 border border-green-100 rounded-2xl text-center">
                  <p className="text-2xl font-black text-green-700">{confusionMatrix.trueNegative}</p>
                  <p className="text-[9px] font-bold text-green-600 uppercase">TN</p>
                </div>
              </div>
              
              <div className="mt-8 flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="text-center">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Sampel</p>
                   <p className="text-lg font-black text-gray-800">{total.toLocaleString()}</p>
                </div>
                <div className="h-8 w-[1px] bg-gray-200" />
                <div className="text-center">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Prediksi Benar</p>
                   <p className="text-lg font-black text-green-600">
                     {(((confusionMatrix.truePositive + confusionMatrix.trueNegative) / total) * 100).toFixed(1)}%
                   </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}