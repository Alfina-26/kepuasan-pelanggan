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
  LogOut,
  ChevronLeft,
  UtensilsCrossed,
  Clock,
  DollarSign,
  MapPin,
} from "lucide-react";

// @ts-ignore
import makanan1 from "../../assets/makanan1.jpg";

// ── KOMPONEN LAYOUT ──
function DashboardLayout({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl overflow-hidden shadow-md border-2 border-[#F5A623]">
              <img src={makanan1} alt="Logo" className="h-full w-full object-cover" />
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
    age: "",
    gender: "",
    location: "",
    visitFrequency: "",
    averageSpending: "",
    favoriteMenu: "",
    visitTime: "",
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingClick = (category: keyof typeof ratings, value: number) => {
    setRatings((prev) => ({ ...prev, [category]: value }));
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

  const RatingStars = ({
    category,
    label,
  }: {
    category: keyof typeof ratings;
    label: string;
  }) => (
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
              className={`w-8 h-8 ${
                star <= ratings[category]
                  ? "fill-[#F5A623] text-[#F5A623]"
                  : "text-gray-200"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  // Reusable styled select
  const StyledSelect = ({
    name,
    value,
    children,
    icon,
  }: {
    name: string;
    value: string;
    children: ReactNode;
    icon?: ReactNode;
  }) => (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {icon}
        </div>
      )}
      <select
        name={name}
        value={value}
        onChange={handleInputChange}
        className={`w-full h-12 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623] appearance-none pr-10 ${
          icon ? "pl-10" : "pl-4"
        }`}
      >
        {children}
      </select>
      {/* Chevron icon */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
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
          {/* Header */}
          <CardHeader className="p-10 border-b border-gray-50">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 bg-[#FEF3C7] rounded-[2rem] flex items-center justify-center border-2 border-[#FDE68A] shadow-sm shrink-0">
                <img src={makanan1} alt="Icon" className="w-16 h-16 object-cover rounded-xl" />
              </div>
              <div className="text-center md:text-left space-y-2">
                <CardTitle className="text-4xl md:text-5xl font-black text-[#333] tracking-tighter">
                  Survei Kepuasan
                </CardTitle>
                <CardDescription className="text-lg text-gray-400 font-medium leading-tight">
                  Bantu kami meningkatkan kualitas pelayanan <br className="hidden md:block" />
                  Rumah Makan Nasi Padang
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-10">
            <form onSubmit={handleSubmit} className="space-y-12">

              {/* ── SECTION 1: Data Diri ── */}
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 bg-[#F5A623] rounded-full"></div>
                  <h3 className="text-xl font-bold text-gray-800 uppercase tracking-tight">
                    Data Diri Pelanggan
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nama */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Masukkan nama lengkap"
                      className="h-12 rounded-xl border-gray-200 focus:ring-[#F5A623]"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="4" width="20" height="16" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                      </span>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="email@example.com"
                        className="h-12 rounded-xl border-gray-200 pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* No. Telepon */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">No. Telepon *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.07 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
                        </svg>
                      </span>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="08xxxxxxxxxx"
                        className="h-12 rounded-xl border-gray-200 pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Usia — BARU */}
                  <div className="space-y-2">
                    <Label htmlFor="age">Usia</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </span>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        min={1}
                        max={120}
                        value={formData.age}
                        onChange={handleInputChange}
                        placeholder="Masukkan usia"
                        className="h-12 rounded-xl border-gray-200 pl-10"
                      />
                    </div>
                  </div>

                  {/* Jenis Kelamin — BARU */}
                  <div className="space-y-2">
                    <Label>Jenis Kelamin</Label>
                    <StyledSelect name="gender" value={formData.gender}>
                      <option value="">Pilih jenis kelamin</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                      <option value="Lainnya">Lainnya</option>
                    </StyledSelect>
                  </div>

                  {/* Lokasi */}
                  <div className="space-y-2">
                    <Label htmlFor="location">Lokasi</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Kota/Kabupaten"
                        className="h-12 rounded-xl border-gray-200 pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── SECTION 2: Informasi Kunjungan — BARU ── */}
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 bg-red-500 rounded-full"></div>
                  <h3 className="text-xl font-bold text-gray-800 uppercase tracking-tight flex items-center gap-2">
                    <UtensilsCrossed className="w-5 h-5 text-red-500" />
                    Informasi Kunjungan
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Frekuensi Kunjungan */}
                  <div className="space-y-2">
                    <Label>Frekuensi Kunjungan</Label>
                    <StyledSelect name="visitFrequency" value={formData.visitFrequency}>
                      <option value="">Pilih frekuensi</option>
                      <option value="Pertama kali">Pertama kali</option>
                      <option value="Jarang (1-2x/bulan)">Jarang (1–2x/bulan)</option>
                      <option value="Cukup sering (3-5x/bulan)">Cukup sering (3–5x/bulan)</option>
                      <option value="Sering (>5x/bulan)">Sering (&gt;5x/bulan)</option>
                    </StyledSelect>
                  </div>

                  {/* Pengeluaran Rata-rata */}
                  <div className="space-y-2">
                    <Label>Pengeluaran Rata-rata</Label>
                    <StyledSelect
                      name="averageSpending"
                      value={formData.averageSpending}
                      icon={<DollarSign className="w-4 h-4" />}
                    >
                      <option value="">Pilih range</option>
                      <option value="<25000">Di bawah Rp 25.000</option>
                      <option value="25000-50000">Rp 25.000 – Rp 50.000</option>
                      <option value="50000-100000">Rp 50.000 – Rp 100.000</option>
                      <option value=">100000">Di atas Rp 100.000</option>
                    </StyledSelect>
                  </div>

                  {/* Menu Favorit */}
                  <div className="space-y-2">
                    <Label htmlFor="favoriteMenu">Menu Favorit</Label>
                    <Input
                      id="favoriteMenu"
                      name="favoriteMenu"
                      value={formData.favoriteMenu}
                      onChange={handleInputChange}
                      placeholder="Contoh: Rendang, Ayam Pop, Gulai Ikan"
                      className="h-12 rounded-xl border-gray-200"
                    />
                  </div>

                  {/* Waktu Kunjungan */}
                  <div className="space-y-2">
                    <Label>Waktu Kunjungan</Label>
                    <StyledSelect
                      name="visitTime"
                      value={formData.visitTime}
                      icon={<Clock className="w-4 h-4" />}
                    >
                      <option value="">Pilih waktu</option>
                      <option value="Pagi (06.00-10.00)">Pagi (06.00–10.00)</option>
                      <option value="Siang (10.00-14.00)">Siang (10.00–14.00)</option>
                      <option value="Sore (14.00-18.00)">Sore (14.00–18.00)</option>
                      <option value="Malam (18.00-22.00)">Malam (18.00–22.00)</option>
                    </StyledSelect>
                  </div>
                </div>
              </div>

              {/* ── SECTION 3: Penilaian Layanan ── */}
              <div className="space-y-8 pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 bg-[#7D8422] rounded-full"></div>
                  <h3 className="text-xl font-bold text-gray-800 uppercase tracking-tight">
                    Penilaian Layanan
                  </h3>
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

              {/* ── SECTION 4: Kepuasan & Feedback ── */}
              <div className="space-y-6 pt-6">
                <div className="bg-gradient-to-r from-[#F5A623] to-[#FFC971] p-8 rounded-3xl shadow-lg shadow-orange-100">
                  <RatingStars category="overallSatisfaction" label="Kepuasan Keseluruhan *" />
                </div>
                <div className="space-y-3">
                  <Label className="font-bold text-gray-700">Pesan & Kesan Tambahan</Label>
                  <Textarea
                    name="feedback"
                    value={formData.feedback}
                    onChange={handleInputChange}
                    placeholder="Apa yang bisa kami tingkatkan?"
                    className="min-h-[150px] rounded-2xl border-gray-200 focus:ring-[#F5A623] p-4"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-16 text-lg font-bold bg-[#F5A623] hover:bg-[#d98c1d] rounded-2xl shadow-xl shadow-orange-100 transition-all active:scale-95 uppercase tracking-widest"
              >
                <Send className="w-5 h-5 mr-3" /> Kirim Penilaian
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}