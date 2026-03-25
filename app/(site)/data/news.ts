export type NewsItem = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
};

export const news: NewsItem[] = [
  {
    slug: "xu-huong-to-chuc-su-kien-2026",
    title: "Xu hướng tổ chức sự kiện nổi bật năm 2026",
    excerpt:
      "Những xu hướng mới trong thiết kế, công nghệ và trải nghiệm khách mời mà doanh nghiệp cần biết.",
    content: `
      <p>Năm 2026 đánh dấu sự bùng nổ của các sự kiện kết hợp công nghệ số...</p>
      <p>Các doanh nghiệp ngày càng chú trọng trải nghiệm cá nhân hóa...</p>
    `,
    image: "/slides/slide-1.jpg",
    date: "08/01/2026",
  },
  {
    slug: "checklist-to-chuc-hoi-nghi",
    title: "Checklist tổ chức hội nghị chuyên nghiệp",
    excerpt:
      "Danh sách các đầu việc quan trọng giúp hội nghị diễn ra suôn sẻ và hiệu quả.",
    content: `
      <p>Để một hội nghị thành công, khâu chuẩn bị là yếu tố quyết định...</p>
    `,
    image: "/slides/slide-2.jpg",
    date: "05/01/2026",
  },
];
