"use client";

import { useSyncExternalStore } from "react";
import {
  getHistory,
  getHistoryServerSnapshot,
  removeHistory,
  subscribeHistory,
  upsertHistory,
} from "@/lib/storage/history";

export function useHistory() {
  const history = useSyncExternalStore(
    subscribeHistory,
    getHistory,
    getHistoryServerSnapshot,
  );

  return {
    history,
    count: history.length,
    upsertHistory,
    removeHistory,
  };
}
