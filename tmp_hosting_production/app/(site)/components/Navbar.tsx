"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import type { SiteLocale } from "@/lib/site-locale";

type NavbarProps = {
  logoUrl: string;
  siteName: string;
  hotline: string;
  contactEmail: string;
  currentLocale: SiteLocale;
};

export default function Navbar({
  logoUrl,
  siteName,
  hotline,
  contactEmail,
  currentLocale,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const pathname = usePathname();
  const isEnglish = currentLocale === "en";

  const navItems = useMemo(
    () => [
      { label: isEnglish ? "Home" : "Trang chủ", href: "/" },
      { label: isEnglish ? "About" : "Giới thiệu", href: "/about" },
      { label: isEnglish ? "Services" : "Dịch vụ", href: "/services" },
      { label: isEnglish ? "Projects" : "Dự án", href: "/projects" },
      { label: isEnglish ? "News" : "Tin tức", href: "/news" },
      { label: isEnglish ? "Contact" : "Liên hệ", href: "/contact" },
    ],
    [isEnglish],
  );

  const forceSolid =
    pathname.startsWith("/news") ||
    pathname.startsWith("/projects") ||
    pathname.startsWith("/services") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/about");

  const isSolid = scrolled || forceSolid;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!openMobile) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [openMobile]);

  const hotlineHref = `tel:${hotline.replace(/\s+/g, "")}`;
  const redirectPath = pathname || "/";

  return (
    <header
      className={[
        "inset-x-0 top-0 z-50 transition-all duration-300",
        isSolid ? "fixed" : "absolute",
        isSolid
          ? "border-b border-black/10 bg-white/80 shadow-[0_12px_35px_rgba(0,0,0,0.12)] backdrop-blur-xl"
          : "bg-transparent",
      ].join(" ")}
    >
      {isSolid && (
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent" />
      )}

      <div
        className={[
          "hidden md:block",
          isSolid ? "border-b border-black/10" : "border-b border-white/15",
        ].join(" ")}
      >
        <div className="lx-container flex h-15 items-center justify-between text-sm">
          <div className={isSolid ? "text-zinc-600" : "text-white/80"}>
            {isEnglish
              ? "Event production partner • Brand communication"
              : "Đối tác tổ chức sự kiện • Truyền thông thương hiệu"}
            <span className={isSolid ? "text-zinc-300" : "text-white/30"}> | </span>
            <a className={isSolid ? "hover:text-black" : "hover:text-white"} href={hotlineHref}>
              Hotline:{" "}
              <span className={isSolid ? "font-semibold text-black" : "font-semibold text-white"}>
                {hotline}
              </span>
            </a>
          </div>

          <div
            className={[
              "hidden items-center gap-3 md:flex",
              isSolid ? "text-zinc-600" : "text-white/80",
            ].join(" ")}
          >
            <a
              className={isSolid ? "hover:text-black" : "hover:text-white"}
              href={`mailto:${contactEmail}`}
            >
              {contactEmail}
            </a>
            <span className={isSolid ? "text-zinc-300" : "text-white/30"}>•</span>
            <span>{isEnglish ? "Response within 24h" : "Phản hồi trong 24h"}</span>
          </div>
        </div>
      </div>

      <div className="lx-container flex h-[80px] items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={logoUrl}
            alt={siteName}
            width={190}
            height={54}
            priority
            className={[
              "h-auto w-[150px] transition-all duration-300 sm:w-[190px]",
              isSolid ? "" : "brightness-0 invert",
            ].join(" ")}
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "text-[16.5px] font-semibold tracking-wide",
                isSolid ? "text-zinc-800 hover:text-black" : "text-white/90 hover:text-white",
              ].join(" ")}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center rounded-full border border-black/10 bg-white/80 p-1 md:flex">
            <a
              href={`/api/locale?locale=vi&redirect=${encodeURIComponent(redirectPath)}`}
              className={[
                "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                !isEnglish ? "bg-black text-white" : "text-black/65 hover:text-black",
              ].join(" ")}
            >
              VI
            </a>
            <a
              href={`/api/locale?locale=en&redirect=${encodeURIComponent(redirectPath)}`}
              className={[
                "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                isEnglish ? "bg-black text-white" : "text-black/65 hover:text-black",
              ].join(" ")}
            >
              EN
            </a>
          </div>

          <Link
            href="/contact"
            className="hidden rounded-full bg-orange-500/90 px-7 py-3 text-[15px] font-semibold text-black shadow-md transition-all duration-300 hover:bg-orange-500 hover:shadow-lg md:inline-flex"
          >
            {isEnglish ? "Get a Quote" : "Nhận báo giá"}
          </Link>

          <button
            type="button"
            onClick={() => setOpenMobile((value) => !value)}
            aria-label="Open menu"
            aria-expanded={openMobile}
            aria-controls="mobile-nav-panel"
            className={[
              "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[15px] font-semibold transition-all duration-300 md:hidden",
              isSolid
                ? "border border-black/20 bg-white text-black hover:bg-black/5"
                : "border border-white/40 bg-white/10 text-white hover:bg-white/15",
            ].join(" ")}
          >
            <span className="relative block h-[14px] w-[18px]">
              <span className="absolute left-0 top-0 h-[2px] w-full rounded bg-current" />
              <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 rounded bg-current" />
              <span className="absolute bottom-0 left-0 h-[2px] w-full rounded bg-current" />
            </span>
            {isEnglish ? "Menu" : "Menu"}
          </button>
        </div>
      </div>

      {openMobile && (
        <div className="md:hidden">
          <button
            aria-label="Close menu overlay"
            onClick={() => setOpenMobile(false)}
            className="fixed inset-0 z-40 bg-black/40"
          />

          <div
            id="mobile-nav-panel"
            className="fixed right-0 top-0 z-50 h-dvh w-[86%] max-w-[360px] overflow-y-auto bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
              <div className="text-sm font-semibold">{isEnglish ? "Menu" : "Menu"}</div>
              <button
                type="button"
                onClick={() => setOpenMobile(false)}
                className="rounded-full border border-black/20 px-4 py-2 text-sm font-bold text-black hover:bg-black/10"
              >
                {isEnglish ? "Close" : "Đóng"}
              </button>
            </div>

            <div className="flex gap-2 px-5 pt-4">
              <a
                href={`/api/locale?locale=vi&redirect=${encodeURIComponent(redirectPath)}`}
                className={[
                  "rounded-full border px-4 py-2 text-sm font-semibold",
                  !isEnglish ? "border-black bg-black text-white" : "border-black/10 text-black",
                ].join(" ")}
              >
                VI
              </a>
              <a
                href={`/api/locale?locale=en&redirect=${encodeURIComponent(redirectPath)}`}
                className={[
                  "rounded-full border px-4 py-2 text-sm font-semibold",
                  isEnglish ? "border-black bg-black text-white" : "border-black/10 text-black",
                ].join(" ")}
              >
                EN
              </a>
            </div>

            <nav className="grid gap-1 px-5 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpenMobile(false)}
                  className="rounded-xl px-3 py-3 text-[16px] font-semibold text-zinc-900 hover:bg-black/5"
                >
                  {item.label}
                </Link>
              ))}

              <Link
                href="/contact"
                onClick={() => setOpenMobile(false)}
                className="mt-3 inline-flex justify-center rounded-xl bg-black px-4 py-3 text-[15px] font-semibold text-white"
              >
                {isEnglish ? "Get a Quote" : "Nhận báo giá"}
              </Link>

              <a
                href={hotlineHref}
                className="mt-2 inline-flex justify-center rounded-xl border border-black/10 px-4 py-3 text-[15px] font-semibold text-black"
              >
                {isEnglish ? "Call Hotline" : "Gọi hotline"}
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
