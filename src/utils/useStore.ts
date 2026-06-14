import { useState, useEffect, useRef, useCallback } from "react";
import { AppState } from "../types";
import { createEmptyWeekPlan } from "./engine";
import { io, Socket } from "socket.io-client";

const STORAGE_KEY = "tacho:state:v1";

const defaultState: AppState = {
  peopleCount: 4,
  weekPlan: createEmptyWeekPlan(),
  pantry: [],
  selectedSupermarkets: ["Continente", "Auchan"],
  boughtItems: [],
  sharedRoomId: null,
};

export function useStore() {
  const [state, setState] = useState<AppState>(() => {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      if (item) {
        return JSON.parse(item);
      }
    } catch (error) {
      console.warn("Error reading localStorage", error);
    }
    return defaultState;
  });

  const socketRef = useRef<Socket | null>(null);
  const isUpdatingFromSocket = useRef(false);

  useEffect(() => {
    // Connect to server
    socketRef.current = io();

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

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn("Error saving to localStorage", error);
    }

    // Broadcast change if we are in a room and change didn't come from socket
    if (
      state.sharedRoomId &&
      socketRef.current &&
      !isUpdatingFromSocket.current
    ) {
      socketRef.current.emit("state-update", state.sharedRoomId, state);
    }
  }, [state]);

  const updateState = useCallback((updates: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  return [state, updateState] as const;
}
