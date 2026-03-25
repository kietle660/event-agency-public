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
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">{description}</p>
      </div>

      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="inline-flex h-11 items-center justify-center rounded-full bg-yellow-400 px-5 text-sm font-semibold text-black transition hover:bg-yellow-300"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
