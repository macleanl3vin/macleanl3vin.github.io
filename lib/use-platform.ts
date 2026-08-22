"use client";

import { useSyncExternalStore } from "react";

/** The platform never changes for the lifetime of the page. */
const subscribe = () => () => {};

function detectMac() {
  if (typeof navigator === "undefined") return true;
  return /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);
}

/**
 * True on Apple platforms, used to label the command palette shortcut as
 * `⌘K` rather than `^K`.
 *
 * `useSyncExternalStore` is the right tool here rather than an effect: it lets
 * the server render a deterministic snapshot (⌘, the more common case for this
 * audience) and swap to the real value at hydration, with no cascading render
 * and no hydration mismatch warning.
 */
export function useIsMac(): boolean {
  return useSyncExternalStore(subscribe, detectMac, () => true);
}
