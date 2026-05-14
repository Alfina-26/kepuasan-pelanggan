import { useState, ReactNode } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { api } from "../../lib/api";
import {
  Star,
  Send,
  User,
  Mail,
  Phone,
  MapPin,
  LogOut,
  ChevronLeft
} from "lucide-react";

// Menggunakan asset yang sama dengan dashboard
// @ts-ignore
import makanan1 from "../../assets/makanan1.jpg";

// ── KOMPONEN LAYOUT (Sama persis dengan Dashboard) ──
function DashboardLayout({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl overflow-hidden shadow-md border-2 border-[#F5A623]">
              <img 
                src={makanan1} 
                alt="Logo" 
                className="h-full w-full object-cover" 
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-[#333] leading-tight">
                Rumah Makan Nasi Padang
              </span>
              <span className="text-xs text-gray-500 font-medium tracking-wider">
                Survei Kepuasan Pelanggan
              </span>
            </div>
          </div>

          <Button 
            variant="outline" 
            onClick={() => { logout(); navigate("/login"); }}
            className="rounded-xl border-gray-200 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

// ── HALAMAN SURVEI ──
export default function CustomerSurvey() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    feedback: "",
  });

  const [ratings, setRatings] = useState({
    foodQuality: 0,
    cleanliness: 0,
    serviceSpeed: 0,
    staffFriendliness: 0,
    priceValue: 0,
    ambiance: 0,
    overallSatisfaction: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingClick = (category: keyof typeof ratings, value: number) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || ratings.overallSatisfaction === 0) {
      toast.error("Mohon lengkapi data dan rating kepuasan");
      return;
    }

    try {
      await api.submitSurvey({ ...formData, ...ratings });
      toast.success("Terima kasih! Masukan Anda sangat berharga.");
      setTimeout(() => navigate("/customer-survey-history"), 1500);
    } catch (err) {
      toast.error("Gagal mengirim survei");
    }
  };

  const RatingStars = ({ category, label }: { category: keyof typeof ratings; label: string }) => (
    <div className="space-y-3">
      <Label className="text-gray-600 font-bold uppercase text-xs tracking-widest">{label}</Label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingClick(category, star)}
            className="transition-all hover:scale-125"
          >
            <Star
              className={`w-8 h-8 ${star <= ratings[category] ? "fill-[#F5A623] text-[#F5A623]" : "text-gray-200"}`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Tombol Back */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-2 text-gray-500 hover:text-[#F5A623]"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Kembali ke Dashboard
        </Button>

        <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
          {/* Inner Header Sesuai image_cccf7c.jpg */}
          <CardHeader className="p-10 border-b border-gray-50">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 bg-[#FEF3C7] rounded-[2rem] flex items-center justify-center border-2 border-[#FDE68A] shadow-sm shrink-0">
                <img 
                  src={makanan1} 
                  alt="Icon" 
                  className="w-16 h-16 object-cover rounded-xl"
                />
              </div>
              <div className="text-center md:text-left space-y-2">
                <CardTitle className="text-4xl md:text-5xl font-black text-[#333] tracking-tighter">
                  Survei Kepuasan
                </CardTitle>
                <CardDescription className="text-lg text-gray-400 font-medium leading-tight">
                  Bantu kami meningkatkan kualitas pelayanan <br className="hidden md:block"/>
                  Rumah Makan Nasi Padang
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-10">
            <form onSubmit={handleSubmit} className="space-y-12">
              
              {/* Form Data Diri */}
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 bg-[#F5A623] rounded-full"></div>
                  <h3 className="text-xl font-bold text-gray-800 uppercase tracking-tight">Data Diri Pelanggan</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap *</Label>
                    <Input id="name" name="name" onChange={handleInputChange} placeholder="Masukkan nama" className="h-12 rounded-xl border-gray-200 focus:ring-[#F5A623]" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" name="email" type="email" onChange={handleInputChange} placeholder="contoh@mail.com" className="h-12 rounded-xl border-gray-200" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">No. Telepon</Label>
                    <Input id="phone" name="phone" onChange={handleInputChange} placeholder="08xxx" className="h-12 rounded-xl border-gray-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Lokasi Kunjungan</Label>
                    <Input id="location" name="location" onChange={handleInputChange} placeholder="Cabang / Kota" className="h-12 rounded-xl border-gray-200" />
                  </div>
                </div>
              </div>

              {/* Grid Rating */}
              <div className="space-y-8 pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 bg-[#7D8422] rounded-full"></div>
                  <h3 className="text-xl font-bold text-gray-800 uppercase tracking-tight">Penilaian Layanan</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12 bg-gray-50/50 p-8 rounded-3xl border border-gray-100">
                  <RatingStars category="foodQuality" label="Rasa Makanan" />
                  <RatingStars category="cleanliness" label="Kebersihan" />
                  <RatingStars category="serviceSpeed" label="Kecepatan" />
                  <RatingStars category="staffFriendliness" label="Pelayanan" />
                  <RatingStars category="priceValue" label="Harga" />
                  <RatingStars category="ambiance" label="Suasana" />
                </div>
              </div>

              {/* Final Feedback */}
              <div className="space-y-6 pt-6">
                <div className="bg-gradient-to-r from-[#F5A623] to-[#FFC971] p-8 rounded-3xl shadow-lg shadow-orange-100">
                  <RatingStars category="overallSatisfaction" label="Kepuasan Keseluruhan *" />
                </div>
                <div className="space-y-3">
                  <Label className="font-bold text-gray-700">Pesan & Kesan Tambahan</Label>
                  <Textarea 
                    name="feedback" 
                    onChange={handleInputChange} 
                    placeholder="Apa yang bisa kami tingkatkan?"
                    className="min-h-[150px] rounded-2xl border-gray-200 focus:ring-[#F5A623] p-4"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-16 text-lg font-bold bg-[#F5A623] hover:bg-[#d98c1d] rounded-2xl shadow-xl shadow-orange-100 transition-all active:scale-95 uppercase tracking-widest">
                <Send className="w-5 h-5 mr-3" /> Kirim Penilaian
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}