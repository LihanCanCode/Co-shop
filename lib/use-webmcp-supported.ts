"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

function getSnapshot() {
  return "modelContext" in document;
}

function getServerSnapshot() {
  return false;
}

/** True once we can confirm the browser exposes document.modelContext. */
export function useWebMCPSupported(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
