import { createSlice } from "@reduxjs/toolkit";


const initialState={
    // 일주일치 웃음과 관련된 정보
    value:[],
};

export const weekCalendarSlice=createSlice({
    name:'weekCalendar',
    initialState,
    reducers:{
        // 일주일 전 달력 확인
        previousWeek:(state)=>{

        },
        // 일주일 후 달력 확인
        nextWeek:(state)=>{

        },
    }
})

export default weekCalendarSlice.reducer;