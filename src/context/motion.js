import { createContext, useContext } from "react";
export const MotionContext = createContext({ enabled: false });
export const useMotion = () => useContext(MotionContext);
