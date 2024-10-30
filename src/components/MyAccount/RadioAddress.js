import React, { useEffect } from "react";
const RadioAddress = React.memo(
  ({ listAddress, selectAddress, editAddress }) => {
    const handleClick = (event, id) => {
      event.stopPropagation();
      selectAddress(id);
    };
    // useEffect(() => {
    //   if (listAddress.length > 0 && listAddress[0].addressList.length === 1) {
    //     const address = listAddress[0].addressList[0];
    //     if (address.default === "1") return;
    //     selectAddress(address.id);
    //   }
    // }, [listAddress]);
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
                      <span>{`${item.detail} ${item.ward} ${item.district} ${item.province}`}</span>
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
                    onClick={() => editAddress(true,item)}
                  >
                    Sửa
                  </button>
                  <button className="btn-delete text-[#fd6d4f]">Xóa</button>
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
