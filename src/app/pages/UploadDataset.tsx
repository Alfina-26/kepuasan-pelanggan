import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import DashboardLayout from "../components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useData } from "../context/DataContext";
import { toast } from "sonner";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

export default function UploadDataset() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const { addDataset } = useData();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const fileType = selectedFile.name.split('.').pop()?.toLowerCase();
      
      if (fileType !== 'csv' && fileType !== 'xlsx') {
        toast.error("Format file tidak didukung. Gunakan CSV atau XLSX");
        return;
      }

      setFile(selectedFile);
      
      // Mock preview data
      setPreview({
        rows: 1000,
        columns: ["customer_id", "age", "gender", "purchase_frequency", "satisfaction"],
        sample: [
          { customer_id: "C001", age: 25, gender: "F", purchase_frequency: 12, satisfaction: "Puas" },
          { customer_id: "C002", age: 34, gender: "M", purchase_frequency: 8, satisfaction: "Tidak Puas" },
          { customer_id: "C003", age: 28, gender: "F", purchase_frequency: 15, satisfaction: "Puas" },
        ]
      });
      
      toast.success("File berhasil dimuat");
    }
  };

  const handleUpload = useCallback(() => {
    if (!file) {
      toast.error("Pilih file terlebih dahulu");
      return;
    }

    setProcessing(true);
    
    // Simulate upload and preprocessing
    setTimeout(() => {
      const dataset = {
        id: `DS${Date.now()}`,
        filename: file.name,
        uploadDate: new Date().toLocaleString('id-ID'),
        status: "processed" as const,
        rows: preview.rows,
        columns: preview.columns,
      };

      addDataset(dataset);
      setProcessing(false);
      toast.success("Dataset berhasil diupload dan diproses!");
      
      setTimeout(() => {
        navigate("/training");
      }, 1000);
    }, 2000);
  }, [file, preview, addDataset, navigate]);

  return (
    <DashboardLayout title="Upload Dataset">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Upload Card */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Dataset Pelanggan
            </CardTitle>
            <CardDescription>
              Unggah dataset dalam format CSV atau XLSX untuk analisis kepuasan pelanggan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <FileSpreadsheet className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    {file ? file.name : "Klik untuk memilih file"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Format yang didukung: CSV, XLSX (Maks. 50MB)
                  </p>
                </label>
              </div>

              {file && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-800">File siap diupload: {file.name}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Preview Card */}
        {preview && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Preview Data</CardTitle>
              <CardDescription>
                {preview.rows.toLocaleString()} baris • {preview.columns.length} kolom
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Kolom Dataset:</p>
                  <div className="flex flex-wrap gap-2">
                    {preview.columns.map((col: string, idx: number) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Sample Data (3 baris pertama):</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          {preview.columns.map((col: string, idx: number) => (
                            <th key={idx} className="px-4 py-2 text-left font-medium text-gray-700">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {preview.sample.map((row: any, rowIdx: number) => (
                          <tr key={rowIdx} className="border-t border-gray-200">
                            {preview.columns.map((col: string, colIdx: number) => (
                              <td key={colIdx} className="px-4 py-2 text-gray-600">
                                {row[col]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Validation Info */}
        <Card className="border-0 shadow-lg bg-blue-50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Validasi & Preprocessing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Validasi struktur dataset sesuai format</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Pembersihan data (missing value handling)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Encoding variabel kategorikal</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Normalisasi data untuk training</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {file && (
          <div className="flex gap-4">
            <Button
              onClick={handleUpload}
              disabled={processing}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {processing ? "Memproses..." : "Upload & Proses Dataset"}
              {!processing && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Kembali
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
