import { createSlice } from "@reduxjs/toolkit";

const discountSlice = createSlice({
  name: "discount",
  initialState: {
    discount: { code: "", negative: 0 },
  },
  reducers: {
    setDiscountCode: (state, action) => {
      state.discount = action.payload;
    },
    clearDiscountCode: (state) => {
      state.discount = {
        code: "",
        negative: 0,
      };
    },
  },
});

export const { setDiscountCode, clearDiscountCode } = discountSlice.actions;

export default discountSlice.reducer;
