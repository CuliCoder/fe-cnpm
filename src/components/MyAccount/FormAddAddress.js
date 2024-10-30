import { Modal } from "flowbite-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "flowbite-react";
import { rgAddress, rgName, rgPhone, rgEmail } from "../../utils/regex";
import { clearAddAddress, fetchAddAddress } from "../../Slice/userSlice";
import MyToast from "../MyToast/MyToast";

const FormAddAddress = React.memo(({ show, onClose }) => {
  const [showToast, setShowToast] = React.useState({
    show: false,
    type: null,
    message: "",
  });
  const dispatch = useDispatch();
  const [lastName, setLastName] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [Province, setProvince] = React.useState({
    code: null,
    name: null,
  });
  const [District, setDistrict] = React.useState({
    code: null,
    name: null,
  });
  const [Ward, setWard] = React.useState({
    code: null,
    name: null,
  });
  const [detailAddress, setdetailAddress] = React.useState("");
  const dataProvince = useSelector((state) => state.address.provinces);
  const dataDistrict = useSelector((state) => state.address.districts);
  const dataWards = useSelector((state) => state.address.wards);
  const addAddress = useSelector((state) => state.user.addAddress);
  React.useEffect(() => {
    if (showToast.show) {
      setTimeout(() => {
        setShowToast({
          show: false,
          type: null,
          message: "",
        });
      }, 3000);
    }
  }, [showToast]);
  React.useEffect(() => {
    if (addAddress.error === 1) {
      setShowToast({
        show: true,
        type: "error",
        message: addAddress.message,
      });
      dispatch(clearAddAddress());
    }
  }, [addAddress.error]);
  React.useEffect(() => {
    if (Province.code) {
      setDistrict({
        code: null,
        name: null,
      });
    }
  }, [Province.code]);
  React.useEffect(() => {
    if (District.code) {
      setWard({
        code: null,
        name: null,
      });
    }
  }, [District.code]);
  const checkValid = () => {
    if (
      !lastName ||
      !firstName ||
      !phoneNumber ||
      !email ||
      !detailAddress ||
      !detailAddress ||
      !Province.code ||
      !District.code ||
      !Ward.code
    ) {
      return "Vui lòng điền đầy đủ thông tin";
    }
    if (!rgName.test(lastName)) {
      return "Tên không hợp lệ";
    }
    if (!rgName.test(firstName)) {
      return "Họ không hợp lệ";
    }
    if (!rgPhone.test(phoneNumber)) {
      return "Số điện thoại không hợp lệ";
    }
    if (!rgEmail.test(email)) {
      return "Email không hợp lệ";
    }
    if (!rgAddress.test(detailAddress)) {
      return "Địa chỉ không hợp lệ";
    }
    return null;
  };
  const handleAddAddress = () => {
    const valid = checkValid();
    if (valid) {
      setShowToast({
        show: true,
        type: "error",
        message: valid,
      });
      return;
    }
    dispatch(
      fetchAddAddress({
        phone_number: phoneNumber,
        email,
        firstName,
        lastName,
        province: Province.name,
        district: District.name,
        ward: Ward.name,
        detail: detailAddress,
      })
    );
  };
  return (
    <>
      <Modal show={show} onClose={() => onClose(false)}>
        {showToast.show && (
          <MyToast type={showToast.type} message={showToast.message} />
        )}
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Thêm địa chỉ nhận hàng</strong>
        </Modal.Header>
        <Modal.Body className="p-6 dark:bg-gray-800">
          <div className="p-4">
            <div className="flex gap-x-10 mt-5 justify-between">
              <div>
                <div className="flex gap-x-1">
                  <label htmlFor="name ">Tên </label>
                  <span className="inline text-[red]">*</span>
                </div>
                <input
                  type="text"
                  name=""
                  id="name"
                  placeholder="Nhập tên"
                  className="h-[30px] border-slate-200 focus:ring-0 w-[230px] "
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                  value={lastName}
                  required
                />
              </div>
              <div>
                <div className="flex gap-x-1">
                  <label htmlFor="">Họ</label>
                  <span className="inline text-[red]">*</span>
                </div>
                <input
                  type="text"
                  name=""
                  id="name"
                  placeholder="Nhập họ"
                  className="h-[30px] border-slate-200 focus:ring-0 w-[230px] "
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                  value={firstName}
                  required
                />
              </div>
            </div>

            <div className="flex gap-x-10 mt-7 justify-between">
              <div>
                <div className="flex gap-x-1">
                  <label htmlFor="name">Số điện thoại</label>
                  <span className="inline text-[red]">*</span>
                </div>
                <input
                  type="text"
                  name=""
                  id="phoneNumber"
                  placeholder="Số điện thoại"
                  className="h-[30px] border-slate-200 focus:ring-0 w-[230px] "
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                  }}
                  value={phoneNumber}
                  required
                />
              </div>
              <div>
                <div className="flex gap-x-1">
                  <label htmlFor="email ">Địa chỉ Email</label>
                  <span className="inline text-[red]">*</span>
                </div>
                <input
                  type="text"
                  name=""
                  id="email"
                  placeholder="Địa chỉ Email"
                  className="h-[30px] border-slate-200 focus:ring-0 w-[230px] "
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  value={email}
                  required
                />
              </div>
            </div>
            <div className="mt-10">
              <div className="flex justify-between gap-x-10">
                <div>
                  <div className="flex gap-x-1">
                    <label htmlFor="city block">Chọn tỉnh thành</label>
                    <span className="inline text-[red]">*</span>
                  </div>
                  <select
                    id="city"
                    onChange={(e) => {
                      const Province = JSON.parse(e.target.value);
                      setProvince(Province);
                    }}
                    className="block h-[40px] border-slate-200 focus:ring-0 w-[230px] mt-1"
                  >
                    <option value="" defaultValue>
                      Chọn tỉnh thành
                    </option>
                    {dataProvince.map((item) => (
                      <option
                        key={item.code}
                        value={JSON.stringify({
                          code: item.code,
                          name: item.name,
                        })}
                      >
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex gap-x-1">
                    <label htmlFor="district">Chọn quận, huyện</label>
                    <span className="inline text-[red]">*</span>
                  </div>
                  <select
                    id="district"
                    onChange={(e) => {
                      const District = JSON.parse(e.target.value);
                      setDistrict(District);
                    }}
                    className="block h-[40px] border-slate-200 focus:ring-0 w-[230px] mt-1"
                  >
                    <option value="" defaultValue>
                      Chọn quận huyện
                    </option>
                    {Province.code &&
                      dataDistrict.map((item) => {
                        if (item.province_code === Province.code)
                          return (
                            <option
                              key={item.code}
                              value={JSON.stringify({
                                code: item.code,
                                name: item.name,
                              })}
                            >
                              {item.name}
                            </option>
                          );
                      })}
                  </select>
                </div>
              </div>

              <div className="flex justify-between gap-x-10 mt-5">
                <div>
                  <div className="flex gap-x-1">
                    <label htmlFor="ward">Chọn phường, xã</label>
                    <span className="inline text-[red]">*</span>
                  </div>

                  <select
                    id="ward"
                    className="block h-[40px] border-slate-200 focus:ring-0 w-[230px] mt-1"
                    onChange={(e) => {
                      const Ward = JSON.parse(e.target.value);
                      setWard(Ward);
                    }}
                  >
                    <option value="" defaultValue>
                      Chọn phường xã
                    </option>
                    {District.code &&
                      dataWards.map((item) => {
                        if (item.district_code === District.code)
                          return (
                            <option
                              key={item.code}
                              value={JSON.stringify({
                                code: item.code,
                                name: item.name,
                              })}
                            >
                              {item.name}
                            </option>
                          );
                      })}
                  </select>
                </div>
                <div>
                  <div className="flex gap-x-1">
                    <label htmlFor="address">Địa chỉ</label>
                    <span className="inline text-[red]">*</span>
                  </div>

                  <input
                    type="text"
                    name=""
                    id="address"
                    className="block h-[40px] border-slate-200 focus:ring-0 w-[230px] mt-1"
                    placeholder="địa chỉ chi tiết"
                    onChange={(e) => {
                      setdetailAddress(e.target.value);
                    }}
                    value={detailAddress}
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button onClick={handleAddAddress}>Thêm</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
});
export default FormAddAddress;
