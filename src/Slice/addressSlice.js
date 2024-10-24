import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/configAxios.js";

export const fetchAddressWithId = createAsyncThunk(
  "address/fetchAddressWithId",
  async (_, rejectWithValue) => {
    try {
      const response = await axios.get(`/api/user/address`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState: {
    address: {
      loading: false,
      list: [],
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddressWithId.pending, (state) => {
        state.address.loading = true;
      })
      .addCase(fetchAddressWithId.fulfilled, (state, action) => {
        console.log(action.payload);
        state.address.list.push(action.payload);
        state.address.loading = false;
      })
      .addCase(fetchAddressWithId.rejected, (state) => {
        state.address.loading = false;
      });
  },
});
export default addressSlice.reducer;
