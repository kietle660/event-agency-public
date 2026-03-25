export type Partner = {
  name: string;
  logo: string;
  href?: string;
  size?: "sm" | "md" | "lg";
};


export const partners: Partner[] = [
  { name: "Action", logo: "/partners/action.png", size: "lg" },
  { name: "HoaCanh", logo: "/partners/hoacanh.png", size: "md" },
  { name: "danhkhoi", logo: "/partners/danhkhoi.png",size: "md" },
  { name: "Vietcombank", logo: "/partners/vcb.png", size: "md"},
  { name: "posco", logo: "/partners/posco.png", size: "lg" },
  { name: "thptlongthanh", logo: "/partners/thptlongthanh.png",size: "lg" },
];
