import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useData } from "../context/DataContext";
// @ts-ignore
import makanan1 from "../../assets/makanan1.jpg";
import { 
  BarChart3, 
  Code, 
  Database, 
  Activity, 
  Zap, 
  LogOut,
  ChevronRight 
} from "lucide-react";

export default function DeveloperDashboard() {
  const navigate = useNavigate();
  const { models, datasets } = useData();

  const features = [
    {
      title: "Evaluasi Model",
      description: "Analisa performa model secara detail",
      icon: BarChart3,
      color: "from-blue-500 to-blue-600",
      action: () => navigate("/evaluation"),
    },
    {
      title: "Training Model",
      description: "Tuning dan training model machine learning",
      icon: Code,
      color: "from-purple-500 to-purple-600",
      action: () => navigate("/training"),
    },
    {
      title: "Manajemen Data",
      description: "Kelola dataset dan preprocessing",
      icon: Database,
      color: "from-green-500 to-green-600",
      action: () => navigate("/upload"),
    },
  ];

  const avgAccuracy = models.length > 0 
    ? models.reduce((sum, m) => sum + m.accuracy, 0) / models.length 
    : 0;

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      {/* 1. HEADER ATAS (Navigasi Utama) */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl overflow-hidden shadow-sm border border-orange-100">
              <img src={makanan1} alt="Logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-orange-900 leading-tight">Rumah Makan Nasi Padang</h1>
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Dashboard Developer</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-gray-800">developer</p>
                <p className="text-[10px] text-gray-400">Developer</p>
             </div>
             <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl border-gray-200 gap-2 text-gray-600 font-bold hover:bg-red-50 hover:text-red-600 transition-colors" 
                onClick={() => navigate('/login')}
             >
                <LogOut className="w-4 h-4" /> Logout
             </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        
        {/* 2. STATS CARDS (Versi Warna Solid Sesuai image_94007e.jpg) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-md bg-[#2563eb] text-white rounded-[28px] overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-2 mb-6 opacity-90">
                <Database className="w-5 h-5" />
                <span className="font-bold text-xs uppercase tracking-widest">Dataset</span>
              </div>
              <p className="text-5xl font-black mb-1">{datasets.length}</p>
              <p className="text-xs font-medium opacity-80 uppercase tracking-wide">Total dataset</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-[#9333ea] text-white rounded-[28px] overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-2 mb-6 opacity-90">
                <Activity className="w-5 h-5" />
                <span className="font-bold text-xs uppercase tracking-widest">Rata-rata Akurasi</span>
              </div>
              <p className="text-5xl font-black mb-1">
                {avgAccuracy > 0 ? `${(avgAccuracy * 100).toFixed(1)}%` : "N/A"}
              </p>
              <p className="text-xs font-medium opacity-80 uppercase tracking-wide">Dari {models.length} model</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-[#10b981] text-white rounded-[28px] overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-2 mb-6 opacity-90">
                <Zap className="w-5 h-5" />
                <span className="font-bold text-xs uppercase tracking-widest">Status Sistem</span>
              </div>
              <p className="text-5xl font-black mb-1">99.9%</p>
              <p className="text-xs font-medium opacity-80 uppercase tracking-wide">Uptime</p>
            </CardContent>
          </Card>
        </div>

        {/* 3. FITUR DEVELOPER SECTION */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2">
             <h2 className="text-2xl font-black text-gray-800 tracking-tight uppercase">Fitur Developer</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="border-none shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group bg-white rounded-[32px] overflow-hidden"
                  onClick={feature.action}
                >
                  <CardHeader className="p-8 pb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-gray-100`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-xl font-black text-gray-800">{feature.title}</CardTitle>
                    <CardDescription className="text-sm font-medium text-gray-500 mt-2">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 pt-4">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between font-bold text-gray-700 group-hover:bg-gray-50 group-hover:text-orange-600 rounded-xl"
                      onClick={(e) => {
                        e.stopPropagation();
                        feature.action();
                      }}
                    >
                      Buka Fitur
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* 4. PERFORMANCE LIST (Optional, disesuaikan tampilannya) */}
        {models.length > 0 && (
          <Card className="border-none shadow-sm bg-white rounded-[32px] overflow-hidden">
            <CardHeader className="p-8 border-b border-gray-50">
              <CardTitle className="text-xl font-black text-gray-800">Performa Model Terlatih</CardTitle>
              <CardDescription className="font-medium uppercase text-[10px] tracking-widest text-orange-500 mt-1">Metrik Evaluasi Real-time</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-4">
                {models.map((model) => (
                  <div 
                    key={model.id} 
                    className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-orange-200 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2">
                      <div>
                        <p className="font-black text-lg text-gray-800">{model.modelName}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{model.createdDate}</p>
                      </div>
                      <Badge className="bg-orange-100 text-orange-700 border-none px-4 py-1 rounded-full text-[10px] font-black uppercase">Active Model</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {[
                        { label: "Accuracy", val: (model.accuracy * 100).toFixed(2), color: "text-blue-600" },
                        { label: "Precision", val: (model.precision * 100).toFixed(2), color: "text-purple-600" },
                        { label: "Recall", val: (model.recall * 100).toFixed(2), color: "text-emerald-600" },
                        { label: "F1-Score", val: (model.f1Score * 100).toFixed(2), color: "text-orange-600" },
                      ].map((metric, mIdx) => (
                        <div key={mIdx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-50">
                          <p className="text-[10px] font-black text-gray-400 uppercase mb-1">{metric.label}</p>
                          <p className={`text-xl font-black ${metric.color}`}>{metric.val}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}