import type { DayHours, ProductListing, Store } from "@/lib/types";

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatPrice(value: number): string {
  return brl.format(value);
}

export function formatRating(value: number): string {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function fullAddress(store: Store & { neighborhood: { name: string } }): string {
  return `${store.address} - ${store.neighborhood.name}, Petrolina - PE, ${store.cep}`;
}

export function whatsappLink(product: ProductListing): string {
  const question =
    product.stock === "esgotado" ? "Vocês vão receber mais unidades?" : "Ainda está disponível?";
  const text =
    `Olá, ${product.store.name}! Vi o produto "${product.name}" ` +
    `por ${formatPrice(product.price)} no Ache em Petrolina. ${question}`;
  return `https://wa.me/${product.store.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function phoneLink(phone: string): string {
  return `tel:+55${phone.replace(/\D/g, "")}`;
}

export function directionsLink(store: Store & { neighborhood: { name: string } }): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress(store))}`;
}

export const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];

export function formatHour(hhmm: string): string {
  const [h, m] = hhmm.split(":");
  return m === "00" ? `${Number(h)}h` : `${Number(h)}h${m}`;
}

function sameHours(a: DayHours | null, b: DayHours | null): boolean {
  return a?.open === b?.open && a?.close === b?.close;
}

export function groupOpeningHours(hours: (DayHours | null)[]): { days: string; hours: string }[] {
  const groups: { start: number; end: number; value: DayHours | null }[] = [];

  for (const day of WEEK_ORDER) {
    const last = groups.at(-1);
    if (last && sameHours(last.value, hours[day])) {
      last.end = day;
    } else {
      groups.push({ start: day, end: day, value: hours[day] });
    }
  }

  return groups.map(({ start, end, value }) => ({
    days: start === end ? DAY_LABELS[start] : `${DAY_LABELS[start]} a ${DAY_LABELS[end]}`,
    hours: value ? `${formatHour(value.open)} às ${formatHour(value.close)}` : "Fechado",
  }));
}
