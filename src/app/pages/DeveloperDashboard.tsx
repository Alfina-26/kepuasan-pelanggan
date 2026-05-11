import { useNavigate } from "react-router";
import DashboardLayout from "../components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useData } from "../context/DataContext";
import { BarChart3, Code, Database, Settings, Activity, Zap } from "lucide-react";

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
    <DashboardLayout title="Dashboard Developer">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Dataset
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{datasets.length}</p>
              <p className="text-sm opacity-90 mt-1">Total dataset</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Rata-rata Akurasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {avgAccuracy > 0 ? `${(avgAccuracy * 100).toFixed(1)}%` : "N/A"}
              </p>
              <p className="text-sm opacity-90 mt-1">Dari {models.length} model</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Status Sistem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">99.9%</p>
              <p className="text-sm opacity-90 mt-1">Uptime</p>
            </CardContent>
          </Card>
        </div>

        {/* Model Performance */}
        {models.length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Performa Model Terlatih</CardTitle>
              <CardDescription>Daftar semua model dengan metrik evaluasi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {models.map((model) => (
                  <div 
                    key={model.id} 
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{model.modelName}</p>
                        <p className="text-sm text-gray-500">{model.createdDate}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Accuracy</p>
                        <p className="font-semibold text-blue-600">
                          {(model.accuracy * 100).toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Precision</p>
                        <p className="font-semibold text-purple-600">
                          {(model.precision * 100).toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Recall</p>
                        <p className="font-semibold text-green-600">
                          {(model.recall * 100).toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">F1-Score</p>
                        <p className="font-semibold text-orange-600">
                          {(model.f1Score * 100).toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Features */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Fitur Developer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                  onClick={feature.action}
                >
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="ghost" 
                      className="w-full group-hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        feature.action();
                      }}
                    >
                      Buka Fitur
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
