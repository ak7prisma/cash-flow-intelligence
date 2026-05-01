import React from "react";

export interface ChatMessage {
  id: string;
  type: "bot" | "user";
  message: string | React.ReactNode;
  time: string;
  insight?: {
    title: string;
    content: string;
  };
}

// Returns the current time formatted as "HH:MM AM/PM".
export function getCurrentTime(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Formats a number as IDR currency string.
 * Example: 75000 → "Rp 75.000"
 */
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

//Generates a unique ID for each chat message.
let messageCounter = 0;
export function generateId(): string {
  return `msg-${Date.now()}-${++messageCounter}`;
}
