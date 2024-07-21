import { configureStore } from "@reduxjs/toolkit";
import weekCalendarReducer from "../features/weekCalendar/weekCalendarSlice";
import authReducer from "../features/auth/authSlice";

export const store=configureStore({
    reducer:{
        weekCalendar : weekCalendarReducer,
        auth: authReducer
    }
})