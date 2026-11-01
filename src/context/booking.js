import { createContext, useContext } from "react";

export const BookingContext = createContext(null);
export const useBooking = () => useContext(BookingContext);
