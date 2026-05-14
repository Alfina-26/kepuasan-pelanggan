import { useNavigate } from "react-router";
import DashboardLayout from "../components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useData } from "../context/DataContext";
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line 
} from "recharts";
import { 
  FileText, Download, TrendingUp, Users, Brain, 
  Target, ChevronLeft, LogOut, Sparkles 
} from "lucide-react";
import { toast } from "sonner";
// @ts-ignore
import makanan1 from "../../assets/makanan1.jpg";

export default function Reports() {
  const { predictions, currentModel, models } = useData();
  const navigate = useNavigate();

  const satisfactionData = [
    {
      name: "Puas",
      value: predictions.filter(p => p.result === "Puas").length,
      color: "#10B981", // Emerald-500
    },
    {
      name: "Tidak Puas",
      value: predictions.filter(p => p.result === "Tidak Puas").length,
      color: "#EF4444", // Red-500
    },
  ];

  const modelPerformanceData = models.map((model, index) => ({
    name: `Model ${index + 1}`,
    accuracy: model.accuracy * 100,
    precision: model.precision * 100,
    recall: model.recall * 100,
    f1Score: model.f1Score * 100,
  }));

  const timeSeriesData = [
    { month: "Jan", puas: 65, tidakPuas: 35 },
    { month: "Feb", puas: 68, tidakPuas: 32 },
    { month: "Mar", puas: 72, tidakPuas: 28 },
    { month: "Apr", puas: 75, tidakPuas: 25 },
    { month: "Mei", puas: 78, tidakPuas: 22 },
    { month: "Jun", puas: 82, tidakPuas: 18 },
  ];

  const handleExportPDF = () => toast.success("Laporan PDF sedang disiapkan...");
  const handleExportExcel = () => toast.success("Data Excel berhasil diunduh!");

  const totalPredictions = predictions.length;
  const satisfiedRate = totalPredictions > 0 
    ? (predictions.filter(p => p.result === "Puas").length / totalPredictions) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* HEADER - CONSISTENT BRANDING */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl overflow-hidden shadow-md ring-2 ring-orange-50">
              <img src={makanan1} alt="Logo Padang" className="h-full w-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Rumah Makan Nasi Padang</h1>
              <p className="text-xs text-orange-600 font-bold uppercase tracking-[0.2em]">Analytical Reports</p>
            </div>
          </div>
          <div className="flex gap-3">
             <Button variant="ghost" className="rounded-xl gap-2 font-bold text-gray-500" onClick={() => navigate(-1)}>
                <ChevronLeft className="w-4 h-4" /> Kembali
             </Button>
             <Button variant="outline" className="rounded-xl border-gray-200 gap-2 font-bold text-red-600 hover:bg-red-50" onClick={() => navigate('/login')}>
                <LogOut className="w-4 h-4" /> Logout
             </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:py-12 space-y-8">
        
        {/* ACTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              Laporan Komprehensif <Sparkles className="w-6 h-6 text-orange-500" />
            </h2>
            <p className="text-gray-500 font-medium">Monitoring performa model dan tren kepuasan pelanggan secara real-time.</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleExportPDF} variant="outline" className="rounded-2xl border-gray-200 bg-white font-bold h-12 px-6 hover:shadow-md transition-all">
              <Download className="w-4 h-4 mr-2 text-red-500" /> Export PDF
            </Button>
            <Button onClick={handleExportExcel} variant="outline" className="rounded-2xl border-gray-200 bg-white font-bold h-12 px-6 hover:shadow-md transition-all">
              <Download className="w-4 h-4 mr-2 text-green-600" /> Export Excel
            </Button>
          </div>
        </div>

        {/* SUMMARY STATS - FLOATING CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Prediksi", val: totalPredictions, sub: "Data Dianalisis", icon: Users, color: "bg-blue-600" },
            { label: "Kepuasan", val: `${satisfiedRate.toFixed(1)}%`, sub: "Pelanggan Puas", icon: Target, color: "bg-emerald-600" },
            { label: "Model Aktif", val: models.length, sub: "Tersimpan", icon: Brain, color: "bg-purple-600" },
            { label: "Avg. Accuracy", val: `${models.length > 0 ? ((models.reduce((s, m) => s + m.accuracy, 0) / models.length) * 100).toFixed(1) : 0}%`, sub: "Sangat Stabil", icon: TrendingUp, color: "bg-orange-600" }
          ].map((item, i) => (
            <Card key={i} className="border-none shadow-[0_10px_40px_rgba(0,0,0,0.03)] rounded-[2rem] overflow-hidden group hover:scale-[1.02] transition-transform">
              <CardContent className="p-0">
                <div className={`p-6 ${item.color} text-white`}>
                  <item.icon className="w-8 h-8 opacity-20 absolute right-6 top-6" />
                  <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-1">{item.label}</p>
                  <p className="text-3xl font-black">{item.val}</p>
                </div>
                <div className="p-4 bg-white">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">{item.sub}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Performance Comparison - Bar Chart */}
          <Card className="lg:col-span-8 border-none shadow-sm bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8">
              <CardTitle className="text-xl font-black text-gray-800 tracking-tight">Perbandingan Performa Model</CardTitle>
              <CardDescription className="font-medium text-gray-400 uppercase text-[10px] tracking-widest">Model Evaluation Metrics</CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={modelPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 700}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                    <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                    <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                    <Bar dataKey="accuracy" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Akurasi" />
                    <Bar dataKey="precision" fill="#8B5CF6" radius={[6, 6, 0, 0]} name="Presisi" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Distribution - Pie Chart */}
          <Card className="lg:col-span-4 border-none shadow-sm bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 text-center">
              <CardTitle className="text-xl font-black text-gray-800 tracking-tight">Distribusi Hasil</CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={satisfactionData}
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {satisfactionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-gray-600">Puas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-xs font-bold text-gray-600">Tidak Puas</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* TREND & INSIGHTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Line Chart */}
           <Card className="border-none shadow-sm bg-white rounded-[2.5rem]">
              <CardHeader className="p-8">
                <CardTitle className="text-xl font-black text-gray-800 tracking-tight">Tren Kepuasan Bulanan</CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="puas" stroke="#10B981" strokeWidth={4} dot={{r: 6, fill: '#10B981', strokeWidth: 3, stroke: '#fff'}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
           </Card>

           {/* AI INSIGHTS */}
           <Card className="border-none shadow-sm bg-indigo-900 text-white rounded-[2.5rem] p-4">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-black flex items-center gap-3">
                  <Brain className="w-6 h-6 text-indigo-300" /> AI Insights
                </CardTitle>
                <CardDescription className="text-indigo-200 font-medium italic">Berdasarkan hasil analisis data terbaru</CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8 space-y-5">
                {[
                  { text: "Tingkat kepuasan menunjukkan tren positif dengan kenaikan stabil sejak Januari.", num: "1" },
                  { text: "Model Decision Tree memiliki stabilitas prediksi di atas 85% untuk data baru.", num: "2" },
                  { text: "Fokus pada peningkatan layanan untuk segmen pelanggan di bawah 30 tahun.", num: "3" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 bg-indigo-800/50 p-4 rounded-2xl border border-indigo-700/50">
                    <span className="font-black text-indigo-300 text-lg opacity-50">{item.num}</span>
                    <p className="text-sm font-bold text-indigo-50 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </CardContent>
           </Card>
        </div>

        {/* FINAL BUTTONS */}
        <div className="flex gap-4 pb-10">
          <Button 
            onClick={() => navigate("/prediction")}
            className="flex-1 py-8 rounded-[2rem] bg-orange-600 hover:bg-orange-700 text-white font-black text-lg shadow-xl shadow-orange-100 transition-all hover:scale-[1.01]"
          >
            Lakukan Prediksi Baru
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="px-10 rounded-[2rem] border-gray-200 bg-white font-bold text-gray-500 hover:bg-gray-50"
          >
            Kembali
          </Button>
        </div>
      </main>
    </div>
  );
}