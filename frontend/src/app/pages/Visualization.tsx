import { useState } from "react";
import { useNavigate } from "react-router";
import DashboardLayout from "../components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useData } from "../context/DataContext";
// @ts-ignore
import makanan1 from "../../assets/makanan1.jpg";
import { 
  Network, 
  AlertCircle, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  ChevronLeft, 
  ArrowRight,
  Info,
  LogOut
} from "lucide-react";

export default function Visualization() {
  const { currentModel } = useData();
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.4));
  const handleReset = () => setZoom(1);

  if (!currentModel) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        {/* HEADER CONSISTENCY */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl overflow-hidden shadow-md ring-2 ring-orange-50">
                <img src={makanan1} alt="Logo" className="h-full w-full object-cover" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Rumah Makan Nasi Padang</h1>
                <p className="text-xs text-orange-600 font-bold uppercase tracking-[0.2em]">Decision Tree Intelligence</p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-xl mx-auto mt-20 text-center px-6">
          <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-8 bg-white">
            <CardContent className="pt-6 space-y-6">
              <div className="mx-auto w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-orange-500" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-black text-gray-800">Visualisasi Belum Tersedia</CardTitle>
                <CardDescription className="text-gray-500 font-medium px-10">
                  Selesaikan pelatihan model terlebih dahulu untuk melihat struktur arsitektur Decision Tree.
                </CardDescription>
              </div>
              <Button 
                onClick={() => navigate("/training")}
                className="w-full py-7 rounded-2xl bg-orange-600 hover:bg-orange-700 font-black text-lg shadow-xl shadow-orange-100 transition-all active:scale-95"
              >
                Kembali ke Training
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const DecisionTreeSVG = () => (
    <svg 
      width="100%" 
      height="650" 
      viewBox="0 0 800 600" 
      className="drop-shadow-sm"
      style={{ 
        transform: `scale(${zoom})`, 
        transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        transformOrigin: "top center"
      }}
    >
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="#CBD5E1" />
        </marker>
      </defs>

      {/* Root Node */}
      <g>
        <rect x="340" y="20" width="120" height="70" fill="#2563EB" rx="16" />
        <text x="400" y="50" textAnchor="middle" fill="white" fontSize="13" fontWeight="900">FREQ_BELI</text>
        <text x="400" y="70" textAnchor="middle" fill="white" fontSize="10" opacity="0.8" fontWeight="bold">ROOT NODE</text>
      </g>

      {/* Branches & Nodes (Sesuai dengan logika sebelumnya) */}
      <path d="M400 90 L250 160" stroke="#CBD5E1" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M400 90 L550 160" stroke="#CBD5E1" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      
      <g>
        <rect x="190" y="160" width="120" height="70" fill="#7C3AED" rx="16" />
        <text x="250" y="195" textAnchor="middle" fill="white" fontSize="13" fontWeight="900">USIA</text>
      </g>
      <g>
        <rect x="490" y="160" width="120" height="70" fill="#7C3AED" rx="16" />
        <text x="550" y="195" textAnchor="middle" fill="white" fontSize="13" fontWeight="900">GENDER</text>
      </g>

      {/* Leaves */}
      <g>
        <rect x="90" y="310" width="120" height="70" fill="#DC2626" rx="16" />
        <text x="150" y="345" textAnchor="middle" fill="white" fontSize="13" fontWeight="900">TIDAK PUAS</text>
      </g>
      <g>
        <rect x="290" y="310" width="120" height="70" fill="#059669" rx="16" />
        <text x="350" y="345" textAnchor="middle" fill="white" fontSize="13" fontWeight="900">PUAS</text>
      </g>
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* 1. HEADER - IDENTIK DENGAN TRAINING & PREDICTION */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl overflow-hidden shadow-md ring-2 ring-orange-50">
              <img src={makanan1} alt="Logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Rumah Makan Nasi Padang</h1>
              <p className="text-xs text-orange-600 font-bold uppercase tracking-[0.2em]">Decision Tree Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <Button 
                variant="ghost" 
                className="rounded-xl gap-2 text-gray-500 font-semibold hover:bg-gray-100 transition-all" 
                onClick={() => navigate(-1)}
             >
                <ChevronLeft className="w-4 h-4" /> Kembali
             </Button>
             <Button 
                variant="outline" 
                className="rounded-xl border-gray-200 gap-2 text-gray-600 font-semibold hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all shadow-sm" 
                onClick={() => navigate('/login')}
             >
                <LogOut className="w-4 h-4" /> Logout
             </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 md:py-12 space-y-8">
        
        {/* MODEL INFO STRIP */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-2xl">
              <Network className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-800 leading-tight">{currentModel.modelName}</h2>
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Visualisasi Arsitektur</p>
            </div>
          </div>

          {/* ZOOM CONTROLS */}
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-100">
              <Button onClick={handleZoomOut} variant="ghost" size="icon" className="rounded-xl hover:bg-white hover:shadow-sm h-9 w-9">
                <ZoomOut className="w-4 h-4 text-gray-600" />
              </Button>
              <div className="px-4 text-xs font-black text-gray-500 w-16 text-center">
                {Math.round(zoom * 100)}%
              </div>
              <Button onClick={handleZoomIn} variant="ghost" size="icon" className="rounded-xl hover:bg-white hover:shadow-sm h-9 w-9">
                <ZoomIn className="w-4 h-4 text-gray-600" />
              </Button>
              <div className="w-px h-4 bg-gray-200 mx-1" />
              <Button onClick={handleReset} variant="ghost" className="rounded-xl font-bold text-xs gap-2 hover:bg-white hover:shadow-sm h-9">
                <Maximize2 className="w-3 h-3" /> Fit
              </Button>
          </div>
        </div>

        {/* TREE CANVAS */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[3rem] overflow-hidden">
          <CardContent className="p-10 pt-10">
            <div className="bg-[#F8FAFC] rounded-[2.5rem] border-2 border-dashed border-gray-100 p-8 min-h-[600px] flex justify-center overflow-hidden relative cursor-grab active:cursor-grabbing">
              <DecisionTreeSVG />
            </div>
          </CardContent>
        </Card>

        {/* BOTTOM NAV */}
        <div className="flex flex-col md:flex-row gap-4 pt-4">
          <Button 
            onClick={() => navigate("/prediction")}
            className="flex-1 py-8 rounded-[2rem] bg-gray-900 hover:bg-black text-white font-black text-lg shadow-xl shadow-gray-200 transition-all hover:scale-[1.02]"
          >
            Mulai Prediksi <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate("/evaluation")}
              className="py-8 px-8 rounded-[2rem] border-gray-200 font-bold text-gray-600 hover:bg-white hover:shadow-md transition-all"
            >
              Cek Evaluasi
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}