import { useState } from "react";
import { useNavigate } from "react-router";
import DashboardLayout from "../components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useData } from "../context/DataContext";
import { Network, AlertCircle, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

export default function Visualization() {
  const { currentModel } = useData();
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(1);

  if (!currentModel) {
    return (
      <DashboardLayout title="Visualisasi Pohon Keputusan">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                Belum Ada Model
              </CardTitle>
              <CardDescription>
                Silakan latih model terlebih dahulu untuk melihat visualisasi
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

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5));
  const handleReset = () => setZoom(1);

  // Mock decision tree visualization
  const DecisionTreeSVG = () => (
    <svg 
      width="100%" 
      height="600" 
      viewBox="0 0 800 600" 
      style={{ transform: `scale(${zoom})`, transition: "transform 0.3s" }}
    >
      {/* Root Node */}
      <g>
        <rect x="350" y="20" width="100" height="60" fill="#3b82f6" rx="8" />
        <text x="400" y="45" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
          Purchase
        </text>
        <text x="400" y="65" textAnchor="middle" fill="white" fontSize="10">
          Frequency
        </text>
      </g>

      {/* Left Branch */}
      <line x1="400" y1="80" x2="250" y2="150" stroke="#6b7280" strokeWidth="2" />
      <text x="320" y="115" fill="#6b7280" fontSize="10">&lt;= 10</text>
      
      <g>
        <rect x="200" y="150" width="100" height="60" fill="#8b5cf6" rx="8" />
        <text x="250" y="175" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
          Age
        </text>
        <text x="250" y="195" textAnchor="middle" fill="white" fontSize="10">
          Category
        </text>
      </g>

      {/* Left-Left Leaf */}
      <line x1="250" y1="210" x2="150" y2="280" stroke="#6b7280" strokeWidth="2" />
      <text x="195" y="245" fill="#6b7280" fontSize="10">&lt;= 30</text>
      
      <g>
        <rect x="100" y="280" width="100" height="60" fill="#ef4444" rx="8" />
        <text x="150" y="305" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
          Tidak Puas
        </text>
        <text x="150" y="325" textAnchor="middle" fill="white" fontSize="9">
          Samples: 180
        </text>
      </g>

      {/* Left-Right Leaf */}
      <line x1="250" y1="210" x2="350" y2="280" stroke="#6b7280" strokeWidth="2" />
      <text x="305" y="245" fill="#6b7280" fontSize="10">&gt; 30</text>
      
      <g>
        <rect x="300" y="280" width="100" height="60" fill="#10b981" rx="8" />
        <text x="350" y="305" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
          Puas
        </text>
        <text x="350" y="325" textAnchor="middle" fill="white" fontSize="9">
          Samples: 220
        </text>
      </g>

      {/* Right Branch */}
      <line x1="400" y1="80" x2="550" y2="150" stroke="#6b7280" strokeWidth="2" />
      <text x="480" y="115" fill="#6b7280" fontSize="10">&gt; 10</text>
      
      <g>
        <rect x="500" y="150" width="100" height="60" fill="#8b5cf6" rx="8" />
        <text x="550" y="175" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
          Gender
        </text>
        <text x="550" y="195" textAnchor="middle" fill="white" fontSize="10">
          Category
        </text>
      </g>

      {/* Right-Left Leaf */}
      <line x1="550" y1="210" x2="450" y2="280" stroke="#6b7280" strokeWidth="2" />
      <text x="495" y="245" fill="#6b7280" fontSize="10">Female</text>
      
      <g>
        <rect x="400" y="280" width="100" height="60" fill="#10b981" rx="8" />
        <text x="450" y="305" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
          Puas
        </text>
        <text x="450" y="325" textAnchor="middle" fill="white" fontSize="9">
          Samples: 285
        </text>
      </g>

      {/* Right-Right Leaf */}
      <line x1="550" y1="210" x2="650" y2="280" stroke="#6b7280" strokeWidth="2" />
      <text x="605" y="245" fill="#6b7280" fontSize="10">Male</text>
      
      <g>
        <rect x="600" y="280" width="100" height="60" fill="#10b981" rx="8" />
        <text x="650" y="305" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
          Puas
        </text>
        <text x="650" y="325" textAnchor="middle" fill="white" fontSize="9">
          Samples: 235
        </text>
      </g>
    </svg>
  );

  return (
    <DashboardLayout title="Visualisasi Pohon Keputusan">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Model Info */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="w-5 h-5" />
              {currentModel.modelName}
            </CardTitle>
            <CardDescription>
              Visualisasi interaktif pohon keputusan • Akurasi: {(currentModel.accuracy * 100).toFixed(2)}%
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Zoom Controls */}
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-4">
              <Button onClick={handleZoomOut} variant="outline" size="sm">
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium text-gray-700 w-20 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button onClick={handleZoomIn} variant="outline" size="sm">
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button onClick={handleReset} variant="outline" size="sm">
                <Maximize2 className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Decision Tree Visualization */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Struktur Pohon Keputusan</CardTitle>
            <CardDescription>
              Pohon keputusan menampilkan alur klasifikasi berdasarkan fitur-fitur pelanggan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-6 overflow-auto">
              <div className="flex justify-center">
                <DecisionTreeSVG />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-base">Keterangan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Root Node</p>
                  <p className="text-xs text-gray-500">Node awal untuk klasifikasi</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Decision Node</p>
                  <p className="text-xs text-gray-500">Node keputusan berdasarkan fitur</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Leaf - Puas</p>
                  <p className="text-xs text-gray-500">Hasil klasifikasi: Pelanggan Puas</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500 rounded"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Leaf - Tidak Puas</p>
                  <p className="text-xs text-gray-500">Hasil klasifikasi: Pelanggan Tidak Puas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button onClick={() => navigate("/prediction")}>
            Lanjut ke Prediksi
          </Button>
          <Button variant="outline" onClick={() => navigate("/evaluation")}>
            Lihat Evaluasi
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Kembali
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
