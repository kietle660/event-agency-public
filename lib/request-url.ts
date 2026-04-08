function firstForwardedValue(value: string | null) {
  return value?.split(",")[0]?.trim() || "";
}

export function createRequestUrl(req: Request, target: string) {
  const fallback = new URL(req.url);
  const protocol =
    firstForwardedValue(req.headers.get("x-forwarded-proto")) ||
    fallback.protocol.replace(":", "");
  const host =
    firstForwardedValue(req.headers.get("x-forwarded-host")) ||
    firstForwardedValue(req.headers.get("host")) ||
    fallback.host;

  return new URL(target, `${protocol}://${host}`);
}
