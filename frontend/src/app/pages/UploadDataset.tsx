import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useData } from "../context/DataContext";
import { toast } from "sonner";
import { api } from "../../lib/api";
// @ts-ignore
import makanan1 from "../../assets/makanan1.jpg";
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  LogOut, 
  ChevronLeft 
} from "lucide-react";

export default function UploadDataset() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const { addDataset } = useData();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const fileType = selectedFile.name.split(".").pop()?.toLowerCase();
      if (fileType !== "csv" && fileType !== "xlsx") {
        toast.error("Format file tidak didukung. Gunakan CSV atau XLSX");
        return;
      }
      setFile(selectedFile);
      setPreview(null);
      toast.success("File berhasil dimuat");
    }
  };

  const handleUpload = useCallback(async () => {
    if (!file) {
      toast.error("Pilih file terlebih dahulu");
      return;
    }

    setProcessing(true);

    try {
      const result = await api.uploadDataset(file);
      addDataset(result.dataset);

      setPreview({
        rows: result.dataset.rows,
        columns: result.dataset.columns,
        sample: result.sample || [],
      });

      toast.success("Dataset berhasil diupload dan diproses!");
      setTimeout(() => navigate("/training"), 1500);
    } catch (err: any) {
      toast.error(err.message || "Gagal mengupload dataset");
    } finally {
      setProcessing(false);
    }
  }, [file, addDataset, navigate]);

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      {/* 1. HEADER (Identik dengan image_93ea79.jpg) */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl overflow-hidden shadow-sm border border-orange-100">
              <img src={makanan1} alt="Logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-orange-900 leading-tight">Rumah Makan Nasi Padang</h1>
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Upload Dataset</p>
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

      <main className="max-w-4xl mx-auto p-6 md:p-10 space-y-8">
        {/* 2. UPLOAD CARD */}
        <Card className="border-none shadow-sm bg-white rounded-[32px] overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-black text-gray-800">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Upload className="w-6 h-6 text-orange-600" />
              </div>
              Upload Dataset Pelanggan
            </CardTitle>
            <CardDescription className="font-bold text-xs uppercase tracking-widest text-gray-400 mt-2">
              Unggah dataset dalam format CSV atau XLSX untuk analisis kepuasan pelanggan
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-4">
            <div className="space-y-6">
              <div className="group relative border-2 border-dashed border-gray-200 rounded-[24px] p-12 text-center hover:border-orange-400 hover:bg-orange-50/30 transition-all cursor-pointer">
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="file-upload"
                />
                <FileSpreadsheet className="w-20 h-20 mx-auto text-gray-300 mb-4 group-hover:scale-110 transition-transform duration-300" />
                <p className="text-xl font-black text-gray-800 mb-2">
                  {file ? file.name : "Klik untuk memilih file"}
                </p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                  Format yang didukung: CSV, XLSX (Maks. 50MB)
                </p>
              </div>

              {file && (
                <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl animate-in slide-in-from-top-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <span className="text-sm font-black text-emerald-800">File siap diupload: {file.name}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 3. PREVIEW CARD (Conditional) */}
        {preview && (
          <Card className="border-none shadow-sm bg-white rounded-[32px] overflow-hidden animate-in fade-in zoom-in duration-500">
            <CardHeader className="p-8 pb-4 bg-gray-50/50 border-b border-gray-100">
              <CardTitle className="text-xl font-black text-gray-800">Preview Data</CardTitle>
              <CardDescription className="font-bold text-xs uppercase tracking-widest text-orange-500">
                {preview.rows.toLocaleString()} baris • {preview.columns.length} kolom
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Kolom Dataset</p>
                  <div className="flex flex-wrap gap-2">
                    {preview.columns.map((col: string, idx: number) => (
                      <span key={idx} className="px-4 py-1.5 bg-blue-50 text-blue-700 text-[11px] font-black rounded-full border border-blue-100 uppercase">
                        {col}
                      </span>
                    ))}
                  </div>
                </div>

                {preview.sample.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Sample Data</p>
                    <div className="overflow-hidden rounded-2xl border border-gray-100">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                              {preview.columns.map((col: string, idx: number) => (
                                <th key={idx} className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {preview.sample.map((row: any, rowIdx: number) => (
                              <tr key={rowIdx} className="hover:bg-gray-50/50 transition-colors">
                                {preview.columns.map((col: string, colIdx: number) => (
                                  <td key={colIdx} className="px-6 py-4 text-gray-600 font-medium">
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
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 4. INFO CARD */}
        <Card className="border-none shadow-sm bg-blue-600 text-white rounded-[32px] overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-lg font-black flex items-center gap-3 uppercase tracking-tighter">
              <AlertCircle className="w-6 h-6 text-blue-200" />
              Validasi & Preprocessing
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Validasi struktur dataset sesuai format",
                "Pembersihan data (missing value handling)",
                "Encoding variabel kategorikal",
                "Normalisasi data untuk training"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl border border-white/10">
                  <CheckCircle2 className="w-5 h-5 text-blue-300" />
                  <span className="text-sm font-bold opacity-90">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 5. ACTION BUTTONS */}
        {file && (
          <div className="flex gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4">
            <Button
              onClick={handleUpload}
              disabled={processing}
              className="flex-1 py-8 rounded-[24px] text-lg font-black bg-gray-900 hover:bg-black text-white shadow-xl shadow-gray-200 transition-all hover:-translate-y-1 disabled:opacity-50"
            >
              {processing ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  MEMPROSES...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  UPLOAD & PROSES DATASET
                  <ArrowRight className="w-6 h-6" />
                </div>
              )}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}