export type Project = {
  title: string;
  client: string;
  location: string;
  date: string;
  desc: string;
  image: string;
  gallery: string[];    // ✅ slider ảnh
  href: string;
  tags?: string[];
};

export const projects: Project[] = [
  {
    title: "TIỆC TÂN NIÊN CÔNG TY TNHH ACTION COMPOSITES HIGHTECH INDUSTRIES",
    client: "ACTION",
    location: "ĐỒNG NAI",
    date: "02/2025",
    desc: "Tổ chức tiệc tân niên quy mô lớn, check-in QR, sân khấu LED, livestream & media onsite.",
    image: "/projects/sukienaction/2.jpg",
    gallery: [
      "/projects/sukienaction/1.jpg",
      "/projects/sukienaction/2.jpg",
      "/projects/sukienaction/1.jpg",
    ],
    href: "/projects/samsung-conference",
    tags: ["New Year's party", "Công Ty", "LED", "livestream & media onsite"],
  },
  {
    title: "HỘI NGHỊ ĐỊNH KÌ VIETCOMBANK KHU VỰC NHƠN TRẠCH , ĐỒNG NAI",
    client: "VIETCOMBANK",
    location: "ĐỒNG NAI",
    date: "02/2025",
    desc: "Hội Nghị, Đối tác, Kịch Bản, vận hành kỹ thuật & điều phối, âm thanh ánh sáng",
    image: "/projects/VIECOMBANK2024/1.jpg",
    gallery: [
      "/projects/sukienaction/1.jpg",
      "/projects/sukienaction/2.jpg",
      "/projects/VIECOMBANK2024/1.jpg",
    ],
    href: "/projects/bmw-opening",
    tags: ["Hội Nghị", "Đối tác", "Production"],
  },
  {
    title: "TIỆC CƯỚI SANG TRỌNG TẠI LONG THÀNH, ĐỒNG NAI",
    client: "TIỆC CƯỚI",
    location: "ĐỒNG NAI",
    date: "12/2024",
    desc: "Thiết kế concept cá nhân hoá, dàn dựng nghi lễ, trang trí, âm thanh/ánh sáng và điều phối để ngày cưới trọn vẹn.",
    image: "/projects/tieccuoi122024/1.jpg",
    gallery: [
      "/projects/tieccuoi122024/1.jpg",
    ],
    href: "/projects/yep-600",
    tags: ["Wedding", "Ceremony", "Decoration"],
  },
{
  title: "ĐÊM NHẠC ACOUSTIC CHUÔNG NGÂN TRONG LÁ TẠI ĐỒNG NAI",
  client: "Chuông ngân trong lá",
  location: "Đồng Nai",
  date: "10/2025",
  desc: "Tổ chức đêm nhạc acoustic với không gian thân mật, sân khấu tối giản, âm thanh chuẩn acoustic, ánh sáng ấm và điều phối chương trình trọn gói.",
  image: "/projects/chuongngantrongla/1.jpg",
  gallery: [
      "/projects/chuongngantrongla/1.jpg",
    ],
  href: "/projects/acoustic-music",
  tags: ["Acoustic", "Music Event", "Stage"],
},
{
  title: "LỄ KHÁNH THÀNH CÔNG VIÊN 26/4 TẠI LONG THÀNH ĐỒNG NAI",
  client: "Dự án cộng đồng / Đơn vị địa phương",
  location: "ĐỒNG NAI",
  date: "11/2025",
  desc: "Tổ chức lễ khánh thành công viên thuộc dự án cộng đồng với nghi thức cắt băng, sân khấu – âm thanh – ánh sáng, điều phối đại biểu, truyền thông và đảm bảo an ninh, an toàn sự kiện.",
  image: "/projects/KHANHTHANHCONGVIEN/1.jpg",
  gallery: [
      "/projects/KHANHTHANHCONGVIEN/1.jpg",
    ],
  href: "/projects/khanh-thanh-cong-vien",
  tags: ["Inauguration", "Community Project", "Ceremony"],
},
];
