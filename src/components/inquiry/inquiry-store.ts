"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * The visitor's "inquiry list" — products they want a quote on. Lives in
 * localStorage (survives navigation and reloads, syncs across tabs) behind a
 * tiny external store, so any component can read/modify it without a provider
 * and the server render always sees an empty list (no hydration mismatch).
 */
export interface InquiryItem {
  slug: string;
  categorySlug: string;
  name: string;
  styleNumber?: string;
  image?: string;
}

const KEY = "abd.inquiry.v1";
export const MAX_INQUIRY_ITEMS = 30;
const EMPTY: InquiryItem[] = [];

let cache: InquiryItem[] | null = null;
const listeners = new Set<() => void>();

const keyOf = (i: Pick<InquiryItem, "categorySlug" | "slug">) => `${i.categorySlug}/${i.slug}`;

function read(): InquiryItem[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return EMPTY;
    return parsed
      .filter(
        (i): i is InquiryItem =>
          !!i && typeof i.slug === "string" && typeof i.categorySlug === "string" && typeof i.name === "string",
      )
      .slice(0, MAX_INQUIRY_ITEMS);
  } catch {
    return EMPTY;
  }
}

function snapshot(): InquiryItem[] {
  if (cache === null) cache = read();
  return cache;
}

function commit(next: InquiryItem[]) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // storage blocked (private mode) — the list still works for this page view
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useInquiry() {
  const items = useSyncExternalStore(subscribe, snapshot, () => EMPTY);

  const has = useCallback(
    (i: Pick<InquiryItem, "categorySlug" | "slug">) => items.some((x) => keyOf(x) === keyOf(i)),
    [items],
  );
  const add = useCallback((item: InquiryItem) => {
    const current = snapshot();
    if (current.some((x) => keyOf(x) === keyOf(item)) || current.length >= MAX_INQUIRY_ITEMS) return;
    commit([...current, item]);
  }, []);
  const remove = useCallback((item: Pick<InquiryItem, "categorySlug" | "slug">) => {
    commit(snapshot().filter((x) => keyOf(x) !== keyOf(item)));
  }, []);
  const toggle = useCallback(
    (item: InquiryItem) => {
      if (snapshot().some((x) => keyOf(x) === keyOf(item))) remove(item);
      else add(item);
    },
    [add, remove],
  );
  const clear = useCallback(() => commit([]), []);

  return { items, count: items.length, has, add, remove, toggle, clear, isFull: items.length >= MAX_INQUIRY_ITEMS };
}

/* Drawer open/closed — same external-store pattern so header, cards and the mobile bar share it. */
let drawerOpen = false;
const drawerListeners = new Set<() => void>();
export function setInquiryDrawerOpen(open: boolean) {
  drawerOpen = open;
  drawerListeners.forEach((l) => l());
}
export function useInquiryDrawer() {
  const open = useSyncExternalStore(
    (l) => {
      drawerListeners.add(l);
      return () => drawerListeners.delete(l);
    },
    () => drawerOpen,
    () => false,
  );
  return { open, setOpen: setInquiryDrawerOpen };
}
