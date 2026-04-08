import Link from "next/link";

export default function AdminSectionHeader({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col gap-5 rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] px-6 py-6 md:flex-row md:items-end md:justify-between print:hidden">
      <div>
        <div className="text-xs uppercase tracking-[0.28em] text-yellow-400/80">Khu vực quản trị</div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">{description}</p>
      </div>

      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="inline-flex h-11 items-center justify-center rounded-full bg-yellow-400 px-5 text-sm font-semibold text-black shadow-[0_14px_30px_rgba(250,204,21,0.2)] transition hover:bg-yellow-300"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
