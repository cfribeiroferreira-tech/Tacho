import { useState, useEffect, useRef, useCallback } from "react";
import { AppState } from "../types";
import { createEmptyWeekPlan } from "./engine";
import io from "socket.io-client";
type Socket = ReturnType<typeof io>;
import { updatePriceMeta } from "./pricing";

const STORAGE_KEY = "tacho:state:v1";

const defaultState: AppState = {
  peopleCount: 4,
  adultsCount: 2,
  children: [{ age: 8 }, { age: 12 }],
  weekPlan: createEmptyWeekPlan(),
  pantry: [],
  selectedSupermarkets: ["Continente", "Auchan"],
  boughtItems: [],
  sharedRoomId: null,
  menuHistory: [],
};

export function useStore() {
  const [state, setState] = useState<AppState>(() => {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      if (item) {
        const parsed = JSON.parse(item);
        if (parsed.adultsCount === undefined) {
          parsed.adultsCount = parsed.peopleCount > 2 ? 2 : parsed.peopleCount;
          parsed.children =
            parsed.peopleCount > 2
              ? Array.from({ length: parsed.peopleCount - 2 }).map(() => ({
                  age: 10,
                }))
              : [];
        }
        if (parsed.weekPlan) {
          parsed.weekPlan = parsed.weekPlan.slice(0, 7).map((d: any) => ({
            ...d,
            pequeno_almoco: d.pequeno_almoco || null,
            lanche: d.lanche || null,
          }));
        }
        if (!parsed.menuHistory) {
          parsed.menuHistory = [];
        }
        return parsed;
      }
    } catch (error) {
      console.warn("Error reading localStorage", error);
    }
    return defaultState;
  });

  const socketRef = useRef<Socket | null>(null);
  const isUpdatingFromSocket = useRef(false);

  useEffect(() => {
    // Fetch initial prices
    fetch("/api/prices/meta")
      .then((r) => r.json())
      .then((d) => {
        updatePriceMeta(d.multiplier, d.lastScrapedAt);
        setState((s) => ({ ...s }));
      })
      .catch(console.error);

    // Connect to server
    socketRef.current = io();

    socketRef.current.on("prices-updated", (data: any) => {
      updatePriceMeta(data.multiplier, data.lastScrapedAt);
      setState((s) => ({ ...s }));
    });

    socketRef.current.on("state-sync", (newState: AppState) => {
      isUpdatingFromSocket.current = true;
      setState(newState);
      setTimeout(() => {
        isUpdatingFromSocket.current = false;
      }, 50);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (state.sharedRoomId && socketRef.current) {
      socketRef.current.emit("join-room", state.sharedRoomId, state);
    }
  }, [state.sharedRoomId]);

  const previousStateStr = useRef(JSON.stringify(state));

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn("Error saving to localStorage", error);
    }

    const stateStr = JSON.stringify(state);
    const prevStateStr = previousStateStr.current;
    previousStateStr.current = stateStr;

    // We need to know if the only thing that changed was sharedRoomId.
    let onlyRoomChanged = false;
    try {
      const p = JSON.parse(prevStateStr);
      const c = JSON.parse(stateStr);

      const pId = p.sharedRoomId;
      const cId = c.sharedRoomId;

      p.sharedRoomId = null;
      c.sharedRoomId = null;

      if (JSON.stringify(p) === JSON.stringify(c) && pId !== cId) {
        onlyRoomChanged = true;
      }
    } catch (e) {}

    // Broadcast change if we are in a room and change didn't come from socket
    if (
      state.sharedRoomId &&
      socketRef.current &&
      !isUpdatingFromSocket.current &&
      !onlyRoomChanged
    ) {
      socketRef.current.emit("state-update", state.sharedRoomId, state);
    }
  }, [state]);

  const updateState = useCallback(
    (updates: Partial<AppState> | ((prev: AppState) => Partial<AppState>)) => {
      setState((prev) => {
        const u = typeof updates === "function" ? updates(prev) : updates;
        return { ...prev, ...u };
      });
    },
    [],
  );

  return [state, updateState] as const;
}
