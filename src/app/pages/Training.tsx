import { useState } from "react";
import { useNavigate } from "react-router";
import DashboardLayout from "../components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Slider } from "../components/ui/slider";
import { Progress } from "../components/ui/progress";
import { useData } from "../context/DataContext";
import { toast } from "sonner";
import { Brain, Settings, PlayCircle, CheckCircle2, TrendingUp } from "lucide-react";

export default function Training() {
  const [trainTestSplit, setTrainTestSplit] = useState([80]);
  const [maxDepth, setMaxDepth] = useState([10]);
  const [minSamples, setMinSamples] = useState([2]);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingComplete, setTrainingComplete] = useState(false);
  const { datasets, addModel } = useData();
  const navigate = useNavigate();

  const handleStartTraining = () => {
    if (datasets.length === 0) {
      toast.error("Upload dataset terlebih dahulu");
      navigate("/upload");
      return;
    }

    setIsTraining(true);
    setTrainingProgress(0);
    setTrainingComplete(false);

    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Create mock model with realistic metrics
          const accuracy = 0.85 + Math.random() * 0.12; // 85-97%
          const precision = 0.82 + Math.random() * 0.15; // 82-97%
          const recall = 0.80 + Math.random() * 0.15; // 80-95%
          const f1Score = 2 * (precision * recall) / (precision + recall);
          
          const model = {
            id: `MDL${Date.now()}`,
            modelName: `Decision Tree Model ${new Date().toLocaleDateString('id-ID')}`,
            accuracy,
            precision,
            recall,
            f1Score,
            createdDate: new Date().toLocaleString('id-ID'),
          };

          addModel(model);
          setIsTraining(false);
          setTrainingComplete(true);
          toast.success("Model berhasil dilatih!");
          
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  return (
    <DashboardLayout title="Training Model Decision Tree">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Dataset Info */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Dataset yang Tersedia
            </CardTitle>
            <CardDescription>
              {datasets.length > 0 
                ? `${datasets.length} dataset siap untuk training` 
                : "Belum ada dataset yang diupload"}
            </CardDescription>
          </CardHeader>
          {datasets.length > 0 && (
            <CardContent>
              <div className="space-y-2">
                {datasets.map((ds) => (
                  <div 
                    key={ds.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{ds.filename}</p>
                      <p className="text-sm text-gray-500">
                        {ds.rows.toLocaleString()} baris • {ds.columns.length} kolom
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      {ds.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Parameters */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Parameter Training
            </CardTitle>
            <CardDescription>
              Sesuaikan parameter untuk optimasi model
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Train/Test Split Ratio</Label>
                <span className="text-sm font-medium text-blue-600">
                  {trainTestSplit[0]}% / {100 - trainTestSplit[0]}%
                </span>
              </div>
              <Slider
                value={trainTestSplit}
                onValueChange={setTrainTestSplit}
                min={60}
                max={90}
                step={5}
                className="w-full"
                disabled={isTraining}
              />
              <p className="text-xs text-gray-500">
                Perbandingan data training dan testing
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Maximum Depth</Label>
                <span className="text-sm font-medium text-blue-600">
                  {maxDepth[0]}
                </span>
              </div>
              <Slider
                value={maxDepth}
                onValueChange={setMaxDepth}
                min={3}
                max={20}
                step={1}
                className="w-full"
                disabled={isTraining}
              />
              <p className="text-xs text-gray-500">
                Kedalaman maksimal pohon keputusan
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Minimum Samples Split</Label>
                <span className="text-sm font-medium text-blue-600">
                  {minSamples[0]}
                </span>
              </div>
              <Slider
                value={minSamples}
                onValueChange={setMinSamples}
                min={2}
                max={10}
                step={1}
                className="w-full"
                disabled={isTraining}
              />
              <p className="text-xs text-gray-500">
                Minimum sampel untuk membagi node
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Training Progress */}
        {isTraining && (
          <Card className="border-0 shadow-lg bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600 animate-pulse" />
                Training in Progress...
              </CardTitle>
              <CardDescription>
                Mohon tunggu, model sedang dilatih
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-blue-600">{trainingProgress}%</span>
                </div>
                <Progress value={trainingProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Training Complete */}
        {trainingComplete && (
          <Card className="border-0 shadow-lg bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle2 className="w-5 h-5" />
                Training Selesai!
              </CardTitle>
              <CardDescription className="text-green-700">
                Model Decision Tree berhasil dilatih
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button 
                  onClick={() => navigate("/evaluation")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Lihat Evaluasi
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate("/visualization")}
                >
                  Visualisasi Pohon
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleStartTraining}
            disabled={isTraining || datasets.length === 0}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            {isTraining ? "Training..." : "Mulai Training"}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={isTraining}
          >
            Kembali
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
