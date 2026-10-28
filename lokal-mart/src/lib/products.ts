export type Category =
  | "Makanan & Minuman"
  | "Fashion Lokal"
  | "Kerajinan Tangan"
  | "Kecantikan"
  | "Dekorasi Rumah"
  | "Ramah Lingkungan";

export type Product = {
  id: string;
  slug: string;
  name: string;
  umkm: string;
  location: string;
  categories: Category[];
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  badge?: "Best Seller" | "Produk Lokal" | "Baru" | "Terbatas";
  description: string;
  story: string;
  weight: string;
  image: string;
  featured?: boolean;
};

export const CATEGORIES: { name: Category; image: string; blurb: string; count: number }[] = [
  { name: "Makanan & Minuman", image: "/images/categories/makanan.jpg", blurb: "Rasa autentik dari dapur rumahan", count: 128 },
  { name: "Fashion Lokal", image: "/images/categories/fashion.jpg", blurb: "Gaya pribadi, jahitan lokal", count: 96 },
  { name: "Kerajinan Tangan", image: "/images/categories/kerajinan.jpg", blurb: "Dibuat tangan, dibuat hati", count: 142 },
  { name: "Kecantikan", image: "/images/categories/kecantikan.jpg", blurb: "Perawatan alami buatan sendiri", count: 74 },
  { name: "Dekorasi Rumah", image: "/images/categories/dekorasi.jpg", blurb: "Hangatkan sudut rumahmu", count: 88 },
  { name: "Ramah Lingkungan", image: "/images/categories/ramah-lingkungan.jpg", blurb: "Belanja baik untuk bumi", count: 61 },
];

export const PRODUCTS: Product[] = [
  {
    id: "p01",
    slug: "kopi-nusantara-gayo",
    name: "Kopi Nusantara Arabica Gayo 200g",
    umkm: "Kopi Sinar Gayo",
    location: "Aceh Tengah, Aceh",
    categories: ["Makanan & Minuman"],
    price: 68000,
    oldPrice: 85000,
    rating: 4.9,
    reviews: 1243,
    badge: "Best Seller",
    description:
      "Biji arabika dataran tinggi Gayo, digiling segar setiap pesanan. Notes cokelat hitam, karamel, dan sedikit citrus dengan body tebal.",
    story:
      "Dikelola petani koperasi Gayo yang memanggang dalam batch kecil setiap dua hari agar kesegaranya terjaga.",
    weight: "200 gram",
    image: "/images/products/kopi-nusantara.jpg",
    featured: true,
  },
  {
    id: "p02",
    slug: "keripik-pisang-karamel",
    name: "Keripik Pisang Karamel Renyah",
    umkm: "Dapur Sari",
    location: "Kediri, Jawa Timur",
    categories: ["Makanan & Minuman"],
    price: 25000,
    rating: 4.8,
    reviews: 867,
    badge: "Produk Lokal",
    description:
      "Pisang kepok pilihan diiris tipis, digoreng dua tahap, lalu dibalut karamel rumahan. Renyahnya bertahan hingga 3 bulan.",
    story:
      "Ibu Sari memulai dapurnya dari satu wajan di halaman rumah; kini 14 ibu rumah tangga kampung ikut meracik.",
    weight: "250 gram",
    image: "/images/products/keripik-pisang.jpg",
    featured: true,
  },
  {
    id: "p03",
    slug: "sambal-bawang-rumahan",
    name: "Sambal Bawang Rumahan Level 3",
    umkm: "Dapur Sari",
    location: "Kediri, Jawa Timur",
    categories: ["Makanan & Minuman"],
    price: 32000,
    rating: 4.9,
    reviews: 2041,
    badge: "Best Seller",
    description:
      "Cabai rawit merah segar diuleg dengan bawang putih dan minyak kelapa murni. Tanpa pengawet, pedasnya jujur.",
    story:
      "Resep turun-temurun tiga generasi. Setiap botol diuleg manual, tidak pernah lewat blender.",
    weight: "200 ml",
    image: "/images/products/sambal.jpg",
    featured: true,
  },
  {
    id: "p04",
    slug: "tote-bag-handmade",
    name: "Tote Bag Kanvas Handmade",
    umkm: "Ruang Jahit",
    location: "Bandung, Jawa Barat",
    categories: ["Fashion Lokal", "Ramah Lingkungan"],
    price: 95000,
    oldPrice: 120000,
    rating: 4.7,
    reviews: 532,
    badge: "Produk Lokal",
    description:
      "Kanvas katun 12 oz dengan jahitan ganda dan kantong dalam. Muat laptop 14 inci, kuat untuk pemakaian harian.",
    story:
      "Dijahit oleh tim lima penjahit rumahan; setiap tote melewati pemeriksaan jahitan satu per satu.",
    weight: "± 320 gram",
    image: "/images/products/tote-bag.jpg",
    featured: true,
  },
  {
    id: "p05",
    slug: "vas-kayu-handmade",
    name: "Pasangan Vas Kayu Mahoni Bubut",
    umkm: "Kayu & Kata",
    location: "Jepara, Jawa Tengah",
    categories: ["Kerajinan Tangan", "Dekorasi Rumah"],
    price: 185000,
    rating: 4.9,
    reviews: 218,
    badge: "Terbatas",
    description:
      "Dibubut dari kayu mahoni solid dengan tinggi 18 & 14 cm. Serat kayu tiap pasangan unik, tidak ada yang identik.",
    story:
      "Pak Warno membubut kayu sejak 1998; sisanya diolah menjadi pot dan aksesori kecil.",
    weight: "± 700 gram",
    image: "/images/products/kerajinan-rotan.jpg",
    featured: true,
  },
  {
    id: "p06",
    slug: "lilin-aromaterapi-soy",
    name: "Lilin Aromaterapi Soy Jeruk & Kayu Manis",
    umkm: "Terang Ruang",
    location: "Yogyakarta, DIY",
    categories: ["Dekorasi Rumah", "Kecantikan"],
    price: 75000,
    rating: 4.8,
    reviews: 396,
    description:
      "Lilin kedelai alami dengan sumbu kayu yang berdesis lembut. Aroma jeruk nipis dan kayu manis bertahan 25 jam.",
    story:
      "Dituang manual dalam batch 40 botol; wadahnya bisa dipakai ulang sebagai pot kecil.",
    weight: "180 gram",
    image: "/images/products/lilin.jpg",
  },
  {
    id: "p07",
    slug: "tas-tangan-kulit-lokal",
    name: "Tas Tangan Kulit Sapi Asli",
    umkm: "Studio Kala",
    location: "Jakarta Selatan",
    categories: ["Fashion Lokal"],
    price: 320000,
    oldPrice: 410000,
    rating: 4.8,
    reviews: 187,
    badge: "Baru",
    description:
      "Kulit sapi full-grain yang dijahit tangan di bagian pegangan. Warna hijau tosca dari pewarnaan alami.",
    story:
      "Dina merancang setiap pola sendiri; produksi maksimal 40 tas per bulan agar kualitas terjaga.",
    weight: "± 480 gram",
    image: "/images/products/tas-anyaman.jpg",
    featured: true,
  },
  {
    id: "p08",
    slug: "kaos-cotton-combed-rasa",
    name: "Kaos Cotton Combed 30s Grafis Rasa",
    umkm: "Studio Kala",
    location: "Bandung, Jawa Barat",
    categories: ["Fashion Lokal"],
    price: 110000,
    rating: 4.6,
    reviews: 743,
    badge: "Produk Lokal",
    description:
      "Katun combed 30s sablon plastisol dengan desain edisi 'Rasa Nusantara'. Adem, tidak melar setelah dicuci.",
    story:
      "Setiap grafis digambar ilustrator lokal; edisi tiap desain dibatasi 100 lembar.",
    weight: "± 180 gram",
    image: "/images/products/kaos.jpg",
  },
  {
    id: "p09",
    slug: "madu-hutan-murni",
    name: "Madu Hutan Murni 500 ml",
    umkm: "Madu Rimbawan",
    location: "Jambi, Sumatera",
    categories: ["Makanan & Minuman", "Ramah Lingkungan"],
    price: 95000,
    rating: 4.9,
    reviews: 1584,
    badge: "Best Seller",
    description:
      "Madu hutan multiflora hasil panen lestari tanpa pemanasan. Kental, aromatik, dengan kadar air rendah.",
    story:
      "Panen dilakukan maksimal dua kali setahun bersama petani madu lokal dengan prinsip sisakan untuk lebah.",
    weight: "500 ml",
    image: "/images/products/madu.jpg",
    featured: true,
  },
  {
    id: "p10",
    slug: "cokelat-artisan-70",
    name: "Cokelat Artisan 70% Single Origin",
    umkm: "Kakao Kartini",
    location: "Jembrana, Bali",
    categories: ["Makanan & Minuman"],
    price: 58000,
    rating: 4.8,
    reviews: 921,
    description:
      "Kakao Jembrana fermentasi 7 hari, dipanggang perlahan. Dark 70% dengan notes buah merah dan kacang panggang.",
    story:
      "Diproduksi oleh 22 petani perempuan yang memegang seluruh proses dari biji hingga batangan.",
    weight: "80 gram",
    image: "/images/products/cokelat.jpg",
    featured: true,
  },
  {
    id: "p11",
    slug: "sabun-natural-lemongrass",
    name: "Sabun Natural Serai & Arang Aktif",
    umkm: "Sabun Sejiwa",
    location: "Malang, Jawa Timur",
    categories: ["Kecantikan", "Ramah Lingkungan"],
    price: 38000,
    rating: 4.7,
    reviews: 654,
    description:
      "Cold-process dengan minyak zaitun, serai segar, dan arang aktif. Tanpa SLS, pewangi sintetis, maupun mikroplastik.",
    story:
      "Dipotong dan dikeringkan 6 minggu; kemasannya bisa dikomposkan sepenuhnya.",
    weight: "100 gram",
    image: "/images/products/sabun.jpg",
  },
  {
    id: "p12",
    slug: "keramik-handmade-cup",
    name: "Set 2 Cup Keramik Handmade Satu",
    umkm: "Tanah Liat Studio",
    location: "Kasongan, Yogyakarta",
    categories: ["Dekorasi Rumah", "Kerajinan Tangan"],
    price: 145000,
    rating: 4.9,
    reviews: 302,
    badge: "Terbatas",
    description:
      "Diputar tangan dan dibakar 1.240°C dengan glasir speckled. Ukuran 180 ml, aman untuk microwave dan mesin cuci piring.",
    story:
      "Setiap cup dibentuk di roda tanpa cetakan, jadi lengkungannya selalu sedikit berbeda — itu ciri buatan tangan.",
    weight: "± 600 gram",
    image: "/images/products/keramik.jpg",
    featured: true,
  },
];

export type Story = {
  name: string;
  role: string;
  quote: string;
  image: string;
  productLine: string;
};

export const STORIES: Story[] = [
  {
    name: "Ibu Sari",
    role: "Pendiri Dapur Sari — Kediri",
    quote:
      "Dulu saya hanya menjual ke tetangga. Sekarang sambal saya sampai ke Makassar dalam dua hari.",
    image: "/images/stories/dapur.jpg",
    productLine: "Makanan rumahan",
  },
  {
    name: "Ratna",
    role: "Kepala Roastery Kopi Sinar Gayo — Aceh",
    quote:
      "Setiap biji kopi punya nama keluarga petaninya. Kami ingin pembeli tahu siapa yang menanam kopi mereka.",
    image: "/images/stories/kopi.jpg",
    productLine: "Kopi & minuman",
  },
  {
    name: "Rina",
    role: "Pendiri Ruang Jahit — Bandung",
    quote:
      "Lima ibu di kampung saya bekerja dari rumah. Satu tote bag berarti satu harapan yang dijahit.",
    image: "/images/stories/pengrajin.jpg",
    productLine: "Jahit & kerajinan",
  },
  {
    name: "Dina",
    role: "Desainer Studio Kala — Jakarta",
    quote:
      "Brand lokal bukan soal harga murah. Ini soal desain yang berani dan kualitas yang tidak menyerah.",
    image: "/images/stories/studio.jpg",
    productLine: "Fashion lokal",
  },
];

export const ILLUSTRATIVE_STATS = [
  { value: 2400, suffix: "+", label: "UMKM terdaftar" },
  { value: 12500, suffix: "+", label: "produk lokal aktif" },
  { value: 87, suffix: "", label: "kota terjangkau" },
  { value: 98, suffix: "%", label: "ulasan positif" },
];

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);
