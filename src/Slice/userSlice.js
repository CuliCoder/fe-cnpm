import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/configAxios";

export const fetchInfoUser = createAsyncThunk(
  "user/fetchInfoUser",
  async (_, rejectWithValue) => {
    try {
      const response = await axios.get("/api/user/info");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchOrderUser = createAsyncThunk(
  "user/fetchOrderUser",
  async (_, rejectWithValue) => {
    try {
      const response = await axios.get("/api/user/order");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchCouponUser = createAsyncThunk(
  "user/fetchCouponUser",
  async (_, rejectWithValue) => {
    try {
      const response = await axios.get("/api/user/coupon");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchChangeInfo = createAsyncThunk(
  "user/fetchChangeInfo",
  async (
    { firstName, lastName, fullName, password, newPassword, repeatPassword },
    { _, rejectWithValue }
  ) => {
    try {
      const response = await axios.put("/api/user/info/edit", {
        firstName,
        lastName,
        fullName,
        password,
        newPassword,
        repeatPassword,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const userSlice = createSlice({
  name: "user",
  initialState: {
    information: {
      loading: false,
      info: null,
    },
    order: {
      loading: false,
      orders: [],
    },
    coupon: {
      loading: false,
      coupons: [],
    },
    changeInfo: {
      loading: false,
      error: null,
      message: null,
    },
  },
  reducers: {
    clearChagneInfo: (state) => {
      state.changeInfo.error = null;
      state.changeInfo.message = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInfoUser.pending, (state) => {
        state.information.loading = true;
      })
      .addCase(fetchInfoUser.fulfilled, (state, action) => {
        state.information.info = action.payload;
        state.information.loading = false;
      })
      .addCase(fetchInfoUser.rejected, (state) => {
        state.information.loading = false;
      })
      .addCase(fetchOrderUser.pending, (state) => {
        state.order.loading = true;
      })
      .addCase(fetchOrderUser.fulfilled, (state, action) => {
        state.order.orders = action.payload;
        state.order.loading = false;
      })
      .addCase(fetchOrderUser.rejected, (state) => {
        state.order.loading = false;
      })
      .addCase(fetchCouponUser.pending, (state) => {
        state.coupon.loading = true;
      })
      .addCase(fetchCouponUser.fulfilled, (state, action) => {
        state.coupon.coupons = action.payload.coupons;
        state.coupon.loading = false;
      })
      .addCase(fetchCouponUser.rejected, (state) => {
        state.coupon.loading = false;
      })
      .addCase(fetchChangeInfo.pending, (state) => {
        state.changeInfo.loading = true;
      })
      .addCase(fetchChangeInfo.fulfilled, (state, action) => {
        state.changeInfo.error = action.payload.error;
        state.changeInfo.message = action.payload.message;
        state.changeInfo.loading = false;
      })
      .addCase(fetchChangeInfo.rejected, (state, action) => {
        state.changeInfo.loading = false;
        state.changeInfo.message = action.payload.message;
        state.changeInfo.loading = false;
      });
  },
});
export default userSlice.reducer;
export const { clearChagneInfo } = userSlice.actions;