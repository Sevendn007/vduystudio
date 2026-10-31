// =============================================================================
// NHÀ XE KIM LÝ — nguồn dữ liệu dùng chung cho cả 2 bản demo (classic / future).
// Số liệu lấy từ banner + tờ rơi + card visit của nhà xe. Những gì KHÔNG có trong
// tài liệu gốc (giá vé, giá thuê xe, địa chỉ văn phòng) được đánh dấu demo:true
// để dễ thay bằng dữ liệu thật — tìm chuỗi "demo" trong file này là ra hết.
// =============================================================================

export const BRAND = {
  name: "Nhà xe Kim Lý",
  short: "Kim Lý",
  tagline: "Xe giường nằm cao cấp",
  slogan: "Được phục vụ quý khách là niềm hạnh phúc của nhà xe",
  hotline: "0984.605.825",
  email: "nhaxekimly@gmail.com",
  facebook: "xekimlysg-daknong",
  facebookUrl: "https://www.facebook.com/xekimlysg-daknong",
  ticketDesk: "Phòng vé số 13 — Bến xe Miền Đông",
  demoNote: "Bản demo thiết kế bởi VDuyStudio — giá vé & địa chỉ là dữ liệu minh hoạ.",
} as const;

export type VehicleId = "sleeper" | "limousine";

export const VEHICLES: Record<VehicleId, { label: string; shortLabel: string; seats: string; features: string[] }> = {
  sleeper: {
    label: "Giường nằm 40 chỗ (WC)",
    shortLabel: "Giường nằm",
    seats: "40 giường",
    features: ["WC khép kín", "Wi-Fi miễn phí", "Chăn gối, nước uống", "Điều hoà 2 chiều"],
  },
  limousine: {
    label: "Limousine 22 phòng (WC)",
    shortLabel: "Limousine",
    seats: "22 phòng",
    features: ["Phòng riêng khép kín", "Màn hình LCD + tai nghe", "WC khép kín", "Wi-Fi, nước uống"],
  },
};

export type Trip = {
  time: string;
  /** "Tài 01" — chỉ những chuyến có trong tờ rơi mới có số tài + biển số. */
  coach?: string;
  plate?: string;
  phone: string;
  vehicle: VehicleId;
};

export type RouteId = "dn-sg" | "sg-dn" | "bac-nam";

export type Route = {
  id: RouteId;
  from: string;
  to: string;
  label: string;
  note?: string;
  pickup?: string[];
  phones?: string[];
  contact?: string;
  trips: Trip[];
};

// Lịch chạy = gộp banner (5 khung giờ/chiều) + tờ rơi (4 tài có biển số).
export const ROUTES: Route[] = [
  {
    id: "dn-sg",
    from: "Đắk Nông",
    to: "Sài Gòn",
    label: "Đắk Nông → Sài Gòn",
    note: "Đón khách dọc tuyến: Đắk Sin – Đạo Nghĩa – Nhân Đạo – Nhân Cơ – Kiến Đức",
    pickup: ["Đắk Sin", "Đạo Nghĩa", "Nhân Đạo", "Nhân Cơ", "Kiến Đức"],
    trips: [
      { time: "06:00", coach: "Tài 01", plate: "51B-200.19", phone: "0981.259.259", vehicle: "sleeper" },
      { time: "07:30", phone: "0901.815.815", vehicle: "sleeper" },
      { time: "14:30", coach: "Tài 02", plate: "51B-141.70", phone: "0981.375.385", vehicle: "sleeper" },
      { time: "19:00", coach: "Tài 03", plate: "51B-193.05", phone: "0908.28.0055", vehicle: "sleeper" },
      { time: "20:00", coach: "Tài 04", plate: "51B-294.33", phone: "0989.591.275", vehicle: "limousine" },
    ],
  },
  {
    id: "sg-dn",
    from: "Sài Gòn",
    to: "Đắk Nông",
    label: "Sài Gòn → Đắk Nông",
    note: "Bán vé quầy 13 — Phòng vé số 13 Kim Lý",
    trips: [
      { time: "08:30", coach: "Tài 01", plate: "51B-141.70", phone: "0981.375.385", vehicle: "sleeper" },
      { time: "10:30", phone: "0908.28.0055", vehicle: "sleeper" },
      { time: "11:00", coach: "Tài 02", plate: "51B-193.05", phone: "0908.28.0055", vehicle: "sleeper" },
      { time: "12:30", phone: "0989.591.275", vehicle: "sleeper" },
      { time: "13:00", coach: "Tài 03", plate: "51B-294.33", phone: "0989.591.275", vehicle: "limousine" },
      { time: "15:00", phone: "0901.815.815", vehicle: "sleeper" },
      { time: "16:30", phone: "0981.259.259", vehicle: "sleeper" },
      { time: "17:00", coach: "Tài 04", plate: "51B-200.19", phone: "0981.259.259", vehicle: "sleeper" },
    ],
  },
  {
    id: "bac-nam",
    from: "Đắk Nông · Đắk Lắk · Gia Lai",
    to: "Nam Định · Thái Bình · Hải Dương · Hưng Yên",
    label: "Tuyến Bắc Nam",
    note: "Xe chất lượng cao chạy tuyến Bắc Nam, nhận đặt chỗ trước",
    phones: ["0966.033.816", "0908.835.815"],
    contact: "cô Lý",
    trips: [],
  },
];

export const BOOKABLE_ROUTES = ROUTES.filter((r) => r.trips.length > 0);

/** Giá vé: KHÔNG có trong tài liệu gốc → số minh hoạ. */
export const DEMO_PRICING = true;

export type Price = { vehicle: VehicleId; price: number; duration: string; demo: boolean };

export const PRICES: Record<"dn-sg" | "sg-dn", Price[]> = {
  "dn-sg": [
    { vehicle: "sleeper", price: 250000, duration: "≈ 6 giờ", demo: true },
    { vehicle: "limousine", price: 350000, duration: "≈ 6 giờ", demo: true },
  ],
  "sg-dn": [
    { vehicle: "sleeper", price: 250000, duration: "≈ 6 giờ", demo: true },
    { vehicle: "limousine", price: 350000, duration: "≈ 6 giờ", demo: true },
  ],
};

export type Rental = {
  id: string;
  title: string;
  price: number | null;
  unit: string;
  demo: boolean;
  image?: string;
  bullets: string[];
};

export const RENTALS: Rental[] = [
  {
    id: "limousine",
    title: "Thuê Limousine 22 phòng",
    price: 13500000,
    unit: "/ chuyến",
    demo: true,
    image: "/sitetemplate/xekhach/img/cabin-bx2-sq.webp",
    bullets: ["Phòng riêng khép kín, WC trên xe", "Màn hình LCD, tai nghe, Wi-Fi", "Đón trả tận nơi Đắk Nông – Sài Gòn"],
  },
  {
    id: "sleeper",
    title: "Thuê giường nằm 40 chỗ",
    price: 11000000,
    unit: "/ chuyến",
    demo: true,
    image: "/sitetemplate/xekhach/img/berth-wide-sq.webp",
    bullets: ["Xe giường nằm cao cấp, WC khép kín", "Chăn đắp, nước uống miễn phí", "Phục vụ 24/7 theo yêu cầu"],
  },
  {
    id: "doan",
    title: "Xe hợp đồng đoàn, du lịch",
    price: null,
    unit: "liên hệ",
    demo: true,
    image: "/sitetemplate/xekhach/img/fleet-rose-sq.webp",
    bullets: ["Đội xe Hyundai đời mới", "Lái xe kinh nghiệm tuyến Tây Nguyên", "Báo giá theo lịch trình riêng"],
  },
  {
    id: "hang",
    title: "Gửi hàng — ký gửi",
    price: null,
    unit: "liên hệ",
    demo: true,
    image: "/sitetemplate/xekhach/img/office-2-sq.webp",
    bullets: ["Nhận hàng tại văn phòng dọc tuyến", "Giao trong ngày Đắk Nông – Sài Gòn", "Hotline 0984.605.825"],
  },
];

export type Office = { area: string; items: { name: string; address: string; phone?: string; demo?: boolean }[] };

export const OFFICES: Office[] = [
  {
    area: "Đắk Nông",
    items: [
      { name: "VP Kiến Đức", address: "TT. Kiến Đức, Đắk R'lấp (demo)", phone: "0981.259.259", demo: true },
      { name: "VP Nhân Cơ", address: "Xã Nhân Cơ, Đắk R'lấp (demo)", phone: "0981.375.385", demo: true },
      { name: "VP Đạo Nghĩa", address: "Xã Đạo Nghĩa, Đắk R'lấp (demo)", phone: "0908.28.0055", demo: true },
      { name: "VP Đắk Sin", address: "Xã Đắk Sin, Đắk R'lấp (demo)", phone: "0989.591.275", demo: true },
    ],
  },
  {
    area: "Sài Gòn",
    items: [
      { name: "Phòng vé số 13 Kim Lý", address: "Quầy 13, Bến xe Miền Đông (demo)", phone: "0984.605.825", demo: true },
    ],
  },
];

export const PROMISES = [
  { title: "Đúng giờ", desc: "13 chuyến mỗi ngày, xuất bến đúng khung giờ niêm yết." },
  { title: "WC & Wi-Fi", desc: "Toàn bộ xe có WC khép kín, Wi-Fi, chăn đắp và nước uống." },
  { title: "Đón trả tận nơi", desc: "Đón dọc tuyến Đắk Sin – Kiến Đức, trả tận nơi nội thành." },
  { title: "Lái xe kinh nghiệm", desc: "Đội tài chạy tuyến Tây Nguyên nhiều năm, xe đời mới." },
];

export const NAV = [
  { label: "Trang chủ", href: "#top" },
  { label: "Lịch chạy", href: "#lich-chay" },
  { label: "Vé xe khách", href: "#gia-ve" },
  { label: "Thuê xe chuyến riêng", href: "#thue-xe" },
  { label: "Tuyến Bắc Nam", href: "#bac-nam" },
  { label: "Liên hệ", href: "#lien-he" },
];

export type Slide = {
  image: string;
  lq: string;
  kicker: string;
  title: string;
  sub: string;
};

const IMG = "/sitetemplate/xekhach/img";

export const SLIDES: Slide[] = [
  {
    image: `${IMG}/fleet-night.webp`,
    lq: `${IMG}/fleet-night-lq.webp`,
    kicker: "Đội xe",
    title: "Giường nằm & cabin cao cấp",
    sub: "Đội xe đời mới, WC khép kín, Wi-Fi và nước uống miễn phí trên mọi chuyến.",
  },
  {
    image: `${IMG}/cabin-amber.webp`,
    lq: `${IMG}/cabin-amber-lq.webp`,
    kicker: "Khoang cabin",
    title: "Phòng riêng khép kín",
    sub: "Cabin đôi và cabin đơn có rèm che, màn hình riêng, đèn đọc sách và ổ sạc.",
  },
  {
    image: `${IMG}/berth-night.webp`,
    lq: `${IMG}/berth-night-lq.webp`,
    kicker: "Chuyến đêm",
    title: "Ngủ một giấc là tới nơi",
    sub: "Giường ngả rộng, chăn gối sạch, xe chạy êm suốt đêm từ Đắk Nông về Sài Gòn.",
  },
  {
    image: `${IMG}/fleet-road.webp`,
    lq: `${IMG}/fleet-road-lq.webp`,
    kicker: "Dọc tuyến",
    title: "Đón tận nơi, trả tận chỗ",
    sub: "Đắk Sin – Đạo Nghĩa – Nhân Đạo – Nhân Cơ – Kiến Đức rồi thẳng về bến Sài Gòn.",
  },
];

/** Ảnh dùng rải rác ở hai bản demo. Nguồn: website hiện tại của nhà xe. */
export const GALLERY = {
  fleetNight: `${IMG}/fleet-night.webp`,
  fleetRose: `${IMG}/fleet-rose.webp`,
  fleetRoad: `${IMG}/fleet-road.webp`,
  cabinAmber: `${IMG}/cabin-amber.webp`,
  cabinBx2: `${IMG}/cabin-bx2.webp`,
  cabinBlue: `${IMG}/cabin-blue.webp`,
  berthNight: `${IMG}/berth-night.webp`,
  berthAisle: `${IMG}/berth-aisle.webp`,
  berthWide: `${IMG}/berth-wide.webp`,
  office1: `${IMG}/office-1.webp`,
  office2: `${IMG}/office-2.webp`,
  office3: `${IMG}/office-3.webp`,
} as const;

/** Dải ảnh cho mục "Hình ảnh nhà xe" của bản cổ điển. */
export const PHOTO_WALL: { src: string; lq: string; caption: string }[] = [
  { src: GALLERY.cabinAmber, lq: `${IMG}/cabin-amber-lq.webp`, caption: "Lối đi khoang cabin" },
  { src: GALLERY.cabinBx2, lq: `${IMG}/cabin-bx2-lq.webp`, caption: "Cabin đôi Bx2" },
  { src: GALLERY.berthNight, lq: `${IMG}/berth-night-lq.webp`, caption: "Khoang giường ban đêm" },
  { src: GALLERY.cabinBlue, lq: `${IMG}/cabin-blue-lq.webp`, caption: "Cabin đèn xanh" },
  { src: GALLERY.berthAisle, lq: `${IMG}/berth-aisle-lq.webp`, caption: "Giường nằm tầng dưới" },
  { src: GALLERY.fleetRose, lq: `${IMG}/fleet-rose-lq.webp`, caption: "Đội xe tại bến" },
  { src: GALLERY.berthWide, lq: `${IMG}/berth-wide-lq.webp`, caption: "Khoang giường ban ngày" },
  { src: GALLERY.office1, lq: `${IMG}/office-1-lq.webp`, caption: "Văn phòng nhà xe" },
];

export const ALL_TRIPS = ROUTES.flatMap((r) => r.trips.map((t) => ({ ...t, routeId: r.id, routeLabel: r.label })));

export function formatPrice(v: number): string {
  return v.toLocaleString("vi-VN") + " đ";
}
