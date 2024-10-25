import React, { useEffect } from "react";
const RadioAddress = React.memo(
  ({ id, name, phoneNumber, email, address, isDefault }) => {
    const handleSelectAddress = () => {
      document.querySelector("#rdo" + id).checked = true;
      const address = document.querySelectorAll(".radio-address");
      address.forEach((item) => {
        item.classList.remove("selected");
      });
      document
        .querySelector("#rdo" + id)
        .parentElement.classList.add("selected");
    };
    useEffect(() => {
      if (isDefault) {
        document
          .querySelector("#rdo" + id)
          .parentElement.classList.add("selected");
      }
    }, []);
    return (
      <div className="container-rdo-address">
        <div className="radio-address" onClick={handleSelectAddress}>
          <label htmlFor={"rdo" + id}>
            <div className="name">
              <span className="font-bold">Tên người nhận: </span>
              <span>{name}</span>
            </div>
            <div className="phoneNumber">
              <span className="font-bold">Số điện thoại: </span>
              <span>{phoneNumber}</span>
            </div>
            <div className="email">
              <span className="font-bold">Email: </span>
              <span>{email}</span>
            </div>
            <div className="address">
              <span className="font-bold">Địa chỉ: </span>
              <span>{address}</span>
            </div>
          </label>
          <input
            className="text-[#fd6d4f]"
            type="radio"
            name="address"
            id={"rdo" + id}
            checked={isDefault}
          />
        </div>
        <div className="rdo-address-btn">
          <button className="btn-edit text-[#fd6d4f]">Sửa</button>
          <button className="btn-delete text-[#fd6d4f]">Xóa</button>
        </div>
      </div>
    );
  }
);
export default RadioAddress;
