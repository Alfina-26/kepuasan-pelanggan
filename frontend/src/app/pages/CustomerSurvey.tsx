import { useState } from "react";
import { useNavigate } from "react-router";
import DashboardLayout from "../components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";
import { api } from "../../lib/api";
import {
  Star,
  Send,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  UtensilsCrossed,
  DollarSign,
  Clock
} from "lucide-react";

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
    foodQuality: "",
    cleanliness: "",
    serviceSpeed: "",
    staffFriendliness: "",
    priceValue: "",
    menuVariety: "",
    ambiance: "",
    overallSatisfaction: "",
    feedback: "",
  });

  const [ratings, setRatings] = useState({
    foodQuality: 0,
    cleanliness: 0,
    serviceSpeed: 0,
    staffFriendliness: 0,
    priceValue: 0,
    menuVariety: 0,
    ambiance: 0,
    overallSatisfaction: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingClick = (category: keyof typeof ratings, value: number) => {
    setRatings(prev => ({ ...prev, [category]: value }));
    setFormData(prev => ({ ...prev, [category]: value.toString() }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Mohon lengkapi data diri Anda");
      return;
    }

    if (ratings.overallSatisfaction === 0) {
      toast.error("Mohon berikan rating kepuasan keseluruhan");
      return;
    }

    try {
      await api.submitSurvey({ ...formData, ratings });
      toast.success("Terima kasih atas penilaian Anda! Selamat menikmati hidangan kami 🍛");
      setTimeout(() => {
        navigate("/customer-survey-history");
      }, 1500);
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan survey");
    }
  };

  const RatingStars = ({
    category,
    label
  }: {
    category: keyof typeof ratings;
    label: string;
  }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingClick(category, star)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`w-8 h-8 ${
                star <= ratings[category]
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600 self-center">
          {ratings[category] > 0 ? `${ratings[category]}/5` : "Belum dinilai"}
        </span>
      </div>
    </div>
  );

  return (
    <DashboardLayout title="Survei Kepuasan Pelanggan">
      <div className="max-w-4xl mx-auto">
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-2xl">Survei Kepuasan Pelanggan</CardTitle>
                <CardDescription className="text-white/90 mt-1">
                  Bagikan pengalaman kuliner Anda di Rumah Makan Nasi Padang kami
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-orange-600" />
                  Data Diri
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Masukkan nama lengkap"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">No. Telepon *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="08xxxxxxxxxx"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Usia</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        placeholder="Masukkan usia"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Jenis Kelamin</Label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Pilih jenis kelamin</option>
                      <option value="Pria">Pria</option>
                      <option value="Wanita">Wanita</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Lokasi</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="location"
                        name="location"
                        placeholder="Kota/Kabupaten"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Visit Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5 text-red-600" />
                  Informasi Kunjungan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="visitFrequency">Frekuensi Kunjungan</Label>
                    <select
                      id="visitFrequency"
                      name="visitFrequency"
                      value={formData.visitFrequency}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Pilih frekuensi</option>
                      <option value="Pertama kali">Pertama kali</option>
                      <option value="1-2 kali/bulan">1-2 kali/bulan</option>
                      <option value="3-5 kali/bulan">3-5 kali/bulan</option>
                      <option value="Lebih dari 5 kali/bulan">Lebih dari 5 kali/bulan</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="averageSpending">Pengeluaran Rata-rata</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <select
                        id="averageSpending"
                        name="averageSpending"
                        value={formData.averageSpending}
                        onChange={handleInputChange}
                        className="w-full h-10 pl-10 pr-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Pilih range</option>
                        <option value="< Rp 25.000">&lt; Rp 25.000</option>
                        <option value="Rp 25.000 - Rp 50.000">Rp 25.000 - Rp 50.000</option>
                        <option value="Rp 50.000 - Rp 100.000">Rp 50.000 - Rp 100.000</option>
                        <option value="> Rp 100.000">&gt; Rp 100.000</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="favoriteMenu">Menu Favorit</Label>
                    <Input
                      id="favoriteMenu"
                      name="favoriteMenu"
                      placeholder="Contoh: Rendang, Ayam Pop, Gulai Ikan"
                      value={formData.favoriteMenu}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="visitTime">Waktu Kunjungan</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <select
                        id="visitTime"
                        name="visitTime"
                        value={formData.visitTime}
                        onChange={handleInputChange}
                        className="w-full h-10 pl-10 pr-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Pilih waktu</option>
                        <option value="Pagi (06.00 - 10.00)">Pagi (06.00 - 10.00)</option>
                        <option value="Siang (11.00 - 14.00)">Siang (11.00 - 14.00)</option>
                        <option value="Sore (15.00 - 18.00)">Sore (15.00 - 18.00)</option>
                        <option value="Malam (18.00 - 21.00)">Malam (18.00 - 21.00)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Ratings */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Penilaian Rumah Makan
                </h3>
                <div className="space-y-4">
                  <RatingStars category="foodQuality" label="Rasa & Kualitas Makanan" />
                  <RatingStars category="cleanliness" label="Kebersihan Tempat & Peralatan" />
                  <RatingStars category="serviceSpeed" label="Kecepatan Pelayanan" />
                  <RatingStars category="staffFriendliness" label="Keramahan Pegawai" />
                  <RatingStars category="priceValue" label="Harga (Value for Money)" />
                  <RatingStars category="menuVariety" label="Variasi Menu" />
                  <RatingStars category="ambiance" label="Suasana Tempat Makan" />
                </div>
              </div>

              {/* Overall Satisfaction */}
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <RatingStars category="overallSatisfaction" label="Kepuasan Keseluruhan *" />
              </div>

              {/* Feedback */}
              <div className="space-y-2">
                <Label htmlFor="feedback">Saran dan Kritik</Label>
                <Textarea
                  id="feedback"
                  name="feedback"
                  placeholder="Ceritakan pengalaman Anda atau berikan saran untuk perbaikan menu dan pelayanan kami..."
                  value={formData.feedback}
                  onChange={handleInputChange}
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Kirim Penilaian
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/customer")}
                >
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}