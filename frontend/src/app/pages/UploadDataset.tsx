import { useState } from "react";
import { useNavigate } from "react-router";
import DashboardLayout from "../components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useData } from "../context/DataContext";
import { toast } from "sonner";
import { api } from "../../lib/api";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export default function UploadDataset() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  const { addDataset } = useData();
  const navigate = useNavigate();

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      const fileType = selectedFile.name
        .split(".")
        .pop()
        ?.toLowerCase();

      if (fileType !== "csv" && fileType !== "xlsx") {
        toast.error(
          "Format file tidak didukung. Gunakan CSV atau XLSX"
        );
        return;
      }

      setFile(selectedFile);

      // Preview dummy
      setPreview({
        rows: 1000,
        columns: [
          "customer_id",
          "age",
          "gender",
          "purchase_frequency",
          "satisfaction",
        ],
        sample: [
          {
            customer_id: "C001",
            age: 25,
            gender: "F",
            purchase_frequency: 12,
            satisfaction: "Puas",
          },
          {
            customer_id: "C002",
            age: 34,
            gender: "M",
            purchase_frequency: 8,
            satisfaction: "Tidak Puas",
          },
          {
            customer_id: "C003",
            age: 28,
            gender: "F",
            purchase_frequency: 15,
            satisfaction: "Puas",
          },
        ],
      });

      toast.success("File berhasil dimuat");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Pilih file terlebih dahulu");
      return;
    }

    setProcessing(true);

    try {
      const result = await api.uploadDataset(file);

      addDataset(result.dataset);

      toast.success("Dataset berhasil diupload!");

      setTimeout(() => {
        navigate("/training");
      }, 1000);
    } catch (err: any) {
      toast.error(err.message || "Upload gagal");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <DashboardLayout title="Upload Dataset">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* isi JSX tetap */}
      </div>
    </DashboardLayout>
  );
}