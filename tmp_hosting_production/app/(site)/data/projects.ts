export type Project = {
  title: string;
  client: string;
  location: string;
  date: string;
  desc: string;
  image: string;
  gallery: string[];
  href: string;
  tags?: string[];
};

export const projects: Project[] = [
  {
    title: "TIỆC TÂN NIÊN CÔNG TY TNHH ACTION COMPOSITES HIGHTECH INDUSTRIES",
    client: "ACTION",
    location: "ĐỒNG NAI",
    date: "02/2025",
    desc: "Tổ chức tiệc tân niên quy mô lớn với check-in QR, sân khấu LED, livestream và media onsite.",
    image: "/projects/sukienaction/2.jpg",
    gallery: [
      "/projects/sukienaction/1.jpg",
      "/projects/sukienaction/2.jpg",
    ],
    href: "/projects/samsung-conference",
    tags: ["New Year's Party", "Công ty", "LED", "Livestream"],
  },
  {
    title: "HỘI NGHỊ ĐỊNH KỲ VIETCOMBANK KHU VỰC NHƠN TRẠCH, ĐỒNG NAI",
    client: "VIETCOMBANK",
    location: "ĐỒNG NAI",
    date: "02/2025",
    desc: "Tổ chức hội nghị đối tác với kịch bản chương trình, vận hành kỹ thuật, điều phối và âm thanh ánh sáng trọn gói.",
    image: "/projects/VIECOMBANK2024/1.jpg",
    gallery: [
      "/projects/VIECOMBANK2024/1.jpg",
      "/projects/sukienaction/1.jpg",
      "/projects/sukienaction/2.jpg",
    ],
    href: "/projects/bmw-opening",
    tags: ["Hội nghị", "Đối tác", "Production"],
  },
  {
    title: "TIỆC CƯỚI SANG TRỌNG TẠI LONG THÀNH, ĐỒNG NAI",
    client: "TIỆC CƯỚI",
    location: "ĐỒNG NAI",
    date: "12/2024",
    desc: "Thiết kế concept cá nhân hóa, dàn dựng nghi lễ, trang trí, âm thanh, ánh sáng và điều phối để ngày cưới trọn vẹn.",
    image: "/projects/tieccuoi122024/1.jpg",
    gallery: ["/projects/tieccuoi122024/1.jpg"],
    href: "/projects/yep-600",
    tags: ["Wedding", "Ceremony", "Decoration"],
  },
  {
    title: "ĐÊM NHẠC ACOUSTIC CHUÔNG NGÂN TRONG LÁ TẠI ĐỒNG NAI",
    client: "Chuông ngân trong lá",
    location: "Đồng Nai",
    date: "10/2025",
    desc: "Tổ chức đêm nhạc acoustic với không gian thân mật, sân khấu tối giản, âm thanh chuẩn acoustic và điều phối chương trình trọn gói.",
    image: "/projects/chuongngantrongla/1.jpg",
    gallery: ["/projects/chuongngantrongla/1.jpg"],
    href: "/projects/acoustic-music",
    tags: ["Acoustic", "Music Event", "Stage"],
  },
  {
    title: "LỄ KHÁNH THÀNH CÔNG VIÊN 26/4 TẠI LONG THÀNH, ĐỒNG NAI",
    client: "Dự án cộng đồng / Đơn vị địa phương",
    location: "ĐỒNG NAI",
    date: "11/2025",
    desc: "Tổ chức lễ khánh thành công viên với nghi thức cắt băng, sân khấu, âm thanh, ánh sáng, điều phối đại biểu và truyền thông sự kiện.",
    image: "/projects/KHANHTHANHCONGVIEN/1.jpg",
    gallery: ["/projects/KHANHTHANHCONGVIEN/1.jpg"],
    href: "/projects/khanh-thanh-cong-vien",
    tags: ["Inauguration", "Community Project", "Ceremony"],
  },
];
