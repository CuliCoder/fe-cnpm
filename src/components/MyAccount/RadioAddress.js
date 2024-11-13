import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { fetchDeleteAddress } from "../../Slice/userSlice";
const RadioAddress = React.memo(
  ({ listAddress, selectAddress, editAddress }) => {
    const handleClick = (event, id) => {
      event.stopPropagation();
      selectAddress(id);
    };
    const dispatch = useDispatch();

    const deleteAddress = (id) => {
      dispatch(fetchDeleteAddress(id));
    };
    return (
      <div className="container-address">
        {listAddress.length <= 0 ? (
          <div>Chưa có địa chỉ</div>
        ) : (
          listAddress[0].addressList.map((item) => {
            return (
              <div className="container-rdo-address" key={item.id}>
                <div
                  className={
                    item.default === "1"
                      ? "radio-address selected"
                      : "radio-address"
                  }
                  onClick={(event) => handleClick(event, item.id)}
                >
                  <div>
                    <div className="name">
                      <span className="font-bold">Tên người nhận: </span>
                      <span>{`${item.firstName} ${item.lastName}`}</span>
                    </div>
                    <div className="phoneNumber">
                      <span className="font-bold">Số điện thoại: </span>
                      <span>{item.phoneNumber}</span>
                    </div>
                    <div className="email">
                      <span className="font-bold">Email: </span>
                      <span>{item.email}</span>
                    </div>
                    <div className="address">
                      <span className="font-bold">Địa chỉ: </span>
                      <span>{`${item.detail}, ${item.ward}, ${item.district}, ${item.province}`}</span>
                    </div>
                  </div>
                  <input
                    className="text-[#fd6d4f]"
                    type="radio"
                    name="address"
                    id={"rdo" + item.id}
                    checked={item.default === "1"}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleClick(event, item.id);
                    }}
                  />
                </div>

                <div className="rdo-address-btn">
                  <button
                    className="btn-edit text-[#fd6d4f]"
                    onClick={() => editAddress(true, item)}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn-delete text-[#fd6d4f]"
                    onClick={() => deleteAddress(item.id)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  }
);
export default RadioAddress;
