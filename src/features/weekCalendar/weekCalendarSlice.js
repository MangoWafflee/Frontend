import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // 일주일치 웃음과 관련된 데이터
  value: [],
};

export const weekCalendarSlice = createSlice({
  name: 'weekCalendar',
  initialState,
  reducers: {
    // 일주일 전 달력 확인
    previousWeek: (state) => {},
    // 일주일 후 달력 확인
    nextWeek: (state) => {},
  },
});

// 상태에 대한 선택자 정의
export const selectValue = (state) =>
  state.weekCalendar.value;

export default weekCalendarSlice.reducer;
