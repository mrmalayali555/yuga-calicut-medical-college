"use client";

import React, { createContext, useContext } from "react";
import { WorldVariant } from "./types";

interface OvioContextValue {
  world: WorldVariant;
}

const OvioContext = createContext<OvioContextValue>({
  world: "minimal",
});

export function OvioProvider({
  children,
  world = "minimal",
}: {
  children: React.ReactNode;
  world?: WorldVariant;
}) {
  return (
    <OvioContext.Provider value={{ world }}>
      {children}
    </OvioContext.Provider>
  );
}

export function useOvio() {
  return useContext(OvioContext);
}
