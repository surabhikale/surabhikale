import {createSlice} from '@reduxjs/toolkit';

export const idSlice = createSlice({
  name: 'id',
  initialState: {
    value: 0,
  },
  reducers: {
    setID(state, action) {
      state.value = action.payload;
    },
  },
});

export const {setID} = idSlice.actions;
export default idSlice.reducer;
