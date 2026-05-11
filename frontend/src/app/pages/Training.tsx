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
import { api } from "../../lib/api";
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

  const handleStartTraining = async () => {
    if (datasets.length === 0) {
      navigate("/upload");
      return;
    }

    setIsTraining(true);
    setTrainingProgress(0);

    // Simulasi progress
    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    try {
      const result = await api.startTraining({
        dataset_id: datasets[datasets.length - 1].id,
        target_column: "satisfaction",
        test_size: (100 - trainTestSplit[0]) / 100,
        max_depth: maxDepth[0],
        min_samples_split: minSamples[0],
      });

      addModel(result.model);

      clearInterval(interval);
      setTrainingProgress(100);
      setTrainingComplete(true);

      toast.success("Model berhasil dilatih!");
    } catch (err: any) {
      clearInterval(interval);
      toast.error(err.message || "Training gagal");
    } finally {
      setIsTraining(false);
    }
  };

  return (
  <DashboardLayout title="Training Model Decision Tree">
    <div>
      Halaman Training
    </div>
  </DashboardLayout>
  );
}