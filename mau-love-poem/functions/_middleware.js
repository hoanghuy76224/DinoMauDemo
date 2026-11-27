// Đổi tiêu đề ảnh xem trước (Zalo/Facebook/Messenger) theo tên khách trong link ?to=...
export async function onRequest(context) {
  const res = await context.next();
  const url = new URL(context.request.url);
  const raw = url.searchParams.get('to');
  const type = res.headers.get('content-type') || '';
  if (!raw || !type.includes('text/html')) return res;

  const guest = raw.replace(/_/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80);
  if (!guest) return res;

  const title = `Kính gửi ${guest} · Thiệp cưới Hương Giang & Việt Phúc`;
  const desc = `Trân trọng kính mời ${guest} đến chung vui cùng Hương Giang & Việt Phúc · Chủ Nhật 27.12.2026`;
  const pageUrl = url.toString();

  let titleDone = false;
  const out = new HTMLRewriter()
    .on('meta[property="og:title"]', { element(e) { e.setAttribute('content', title); } })
    .on('meta[property="og:description"]', { element(e) { e.setAttribute('content', desc); } })
    .on('meta[name="description"]', { element(e) { e.setAttribute('content', desc); } })
    .on('meta[property="og:url"]', { element(e) { e.setAttribute('content', pageUrl); } })
    .on('title', { element(e) { if (!titleDone) { e.setInnerContent(title); titleDone = true; } } })
    .transform(res);

  const h = new Headers(out.headers);
  h.set('Cache-Control', 'no-cache');
  return new Response(out.body, { status: out.status, headers: h });
}
