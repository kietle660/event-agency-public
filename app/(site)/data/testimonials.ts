export type Testimonial = {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string; // 👈 thêm
};

export const testimonials: Testimonial[] = [
  {
    name: "LÊ TUẤN KIỆT",
    role: "CEO",
    company: "TUẤN VIỆT MARKETING",
    content:
      "Đội ngũ làm việc rất chuyên nghiệp, kiểm soát chương trình tốt và xử lý tình huống nhanh.",
    avatar: "/testimonials/TUANKIET.jpg",
  },
  {
    name: "ALEXANDER BEULEKE",
    role: "CEO",
    company: "CÔNG TY TNHH ACTION COMPOSITES HIGHTECH INDUSTRIES",
    content:
      "Concept sáng tạo, thi công chỉn chu và đặc biệt là phần điều phối onsite rất mượt.",
    avatar: "/testimonials/action.jpg",
  },
  {
    name: "THÁI HÒA",
    role: "",
    company: "",
    content:
      "Đám cưới của tôi trở thành buổi tiệc đáng nhớ nhờ Trọng Thái Event.",
    avatar: "/testimonials/THAIHOA.jpg",
  },
];
