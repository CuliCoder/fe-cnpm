import React, { useState, useEffect, useCallback } from "react";
import { Sidebar, Button, Modal, Accordion, Badge } from "flowbite-react";
import { IoLocation } from "react-icons/io5";
import { BiSolidCoupon } from "react-icons/bi";
import { IoCheckmarkCircle } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { HiArrowSmLeft, HiUser, HiViewBoards } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";

import { FaTachometerAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Slice/status";
import { setIsLogin } from "../../Slice/loginSlice";
import {
  fetchCouponUser,
  fetchInfoUser,
  fetchOrderUser,
  fetchChangeInfo,
  clearChagneInfo,
  fetchSelectAddress,
  clearSelectAddress,
  clearAddAddress,
  clearEditAddress,
  clearDeleteAddress,
} from "../../Slice/userSlice";
import { fetchAddressWithId } from "../../Slice/userSlice";
import { formatPrice } from "../../config/formatPrice";
import "./MyAccount.css";
import { handleCopyToClipboard } from "../../config/copyToClipboard";
import { clearCart } from "../../Slice/cartSlice";
import { setShowToast } from "../../Slice/MyToastSlice";
import FormAddAddress from "./FormAddAddress";
import RadioAddress from "./RadioAddress";
import FormEditAddress from "./FromEditAddress";

const MyAccount = React.memo(() => {
  const [account, setAccount] = useState(true);
  const [order, setOrder] = useState(false);
  const [address, setAddress] = useState(false);
  const [infoAccount, setInfoAccount] = useState(false);
  const [discount, setDiscount] = useState(false);

  const [addressForm, setAddressForm] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [openEditAddressForm, setOpenEditAddressForm] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [rePass1, setRePass1] = useState("");
  const [rePass2, setRePass2] = useState("");
  const userInfo = useSelector((state) => state.user.information);
  const allOrderUser = useSelector((state) => state.user.order);
  const userCoupon = useSelector((state) => state.user.coupon);
  const userAddress = useSelector((state) => state.user.address);
  const userChangeInfo = useSelector((state) => state.user.changeInfo);
  const selectAddress = useSelector((state) => state.user.selectAddress);
  const addAddress = useSelector((state) => state.user.addAddress);
  const usereditAddress = useSelector((state) => state.user.editAddress);
  const userdeleteAddress = useSelector((state) => state.user.deleteAddress);
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    setOpenModal(true);
    dispatch(logout());
    dispatch(setIsLogin(1));
    dispatch(clearCart());
    navigate("/login");
  };
  useEffect(() => {
    if (account || infoAccount) {
      dispatch(fetchInfoUser());
    }
  }, [account, infoAccount]);
  useEffect(() => {
    if (address) {
      dispatch(fetchAddressWithId());
    }
  }, [address]);
  useEffect(() => {
    if (order) {
      dispatch(fetchOrderUser());
    }
  }, [order]);
  useEffect(() => {
    if (discount) {
      dispatch(fetchCouponUser());
    }
  }, [discount]);
  useEffect(() => {
    if (userInfo.info) {
      setFirstName(userInfo.info.first_name);
      setLastName(userInfo.info.last_name);
      setFullName(userInfo.info.fullname);
    }
  }, [userInfo.info]);
  useEffect(() => {
    if (!userChangeInfo.loading && userChangeInfo.error !== null) {
      setPassword("");
      setRePass1("");
      setRePass2("");
      dispatch(
        setShowToast({
          show: true,
          type: userChangeInfo.error !== 0 ? "error" : "success",
          message: userChangeInfo.message,
        })
      );
      dispatch(clearChagneInfo());
    }
  }, [userChangeInfo.error, userChangeInfo.loading]);
  const handleChangeInfo = () => {
    let rgName =
      /^(?!\s*$)[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/;
    if (!firstName || !lastName || !fullName) {
      dispatch(
        setShowToast({
          show: true,
          type: "error",
          message: "First name, last name, display name là bắt buộc",
        })
      );
      return;
    }
    if (
      !rgName.test(fullName) ||
      !rgName.test(firstName) ||
      !rgName.test(lastName)
    ) {
      dispatch(
        setShowToast({
          show: true,
          type: "error",
          message:
            "First name, last name, display name không được có kí tự đặc biệt",
        })
      );
      return;
    }
    if (password || rePass1 || rePass2) {
      if (!password || !rePass1 || !rePass2) {
        dispatch(
          setShowToast({
            show: true,
            type: "error",
            message: "Mật khẩu không được để trống",
          })
        );
        return;
      }
      let rgPass = /^(?=.*[A-Z]).{8,}$/;
      if (!rgPass.test(rePass1)) {
        dispatch(
          setShowToast({
            show: true,
            type: "error",
            message:
              "Mật khẩu phải có ít nhất 8 ký tự, trong đó có ít nhất 1 ký tự viết hoa",
          })
        );
        return;
      }
      if (rePass1 !== rePass2) {
        dispatch(
          setShowToast({
            show: true,
            type: "error",
            message: "Mật khẩu không trùng khớp",
          })
        );
        return;
      }
    }
    dispatch(
      fetchChangeInfo({
        firstName,
        lastName,
        fullName,
        password,
        newPassword: rePass1,
        repeatPassword: rePass2,
      })
    );
  };
  useEffect(() => {
    if (addAddress.error === 0) {
      setAddressForm(false);
      dispatch(
        setShowToast({
          show: true,
          message: addAddress.message,
          type: "success",
        })
      );
      dispatch(clearAddAddress());
      dispatch(fetchAddressWithId());
    }
  }, [addAddress.error]);
  useEffect(() => {
    if (usereditAddress.error === 0) {
      setOpenEditAddressForm(false);
      dispatch(
        setShowToast({
          show: true,
          message: usereditAddress.message,
          type: "success",
        })
      );
      dispatch(clearEditAddress());
      dispatch(fetchAddressWithId());
    }
  }, [usereditAddress.error]);
  useEffect(() => {
    if (selectAddress.error !== null) {
      dispatch(
        setShowToast({
          show: true,
          message: selectAddress.message,
          type: selectAddress.error === 1 ? "error" : "success",
        })
      );
      dispatch(clearSelectAddress());
      dispatch(fetchAddressWithId());
    }
  }, [selectAddress.error]);
  useEffect(() => {
    if (userdeleteAddress.error !== null) {
      dispatch(
        setShowToast({
          show: true,
          message: userdeleteAddress.message,
          type: userdeleteAddress.error === 0 ? "success" : "error",
        })
      );
      dispatch(clearDeleteAddress());
      dispatch(fetchAddressWithId());
    }
  }, [userdeleteAddress.error]);
  const handleSelectAddress = useCallback((id) => {
    dispatch(fetchSelectAddress(id));
  }, []);
  const setShowFormEditAddress = useCallback((show, item) => {
    setOpenEditAddressForm(show);
    setEditAddress(item);
  }, []);
  return (
    <div>
      <div className="breadcrumb bg-[#f4f9fc] h-[110px] py-5 ">
        <div className="flex items-center justify-center">
          <a href="/" className="px-1">
            Trang Chủ
          </a>{" "}
          / <p className="font-medium px-1"> Tài khoản của tôi</p>
        </div>
        <div className="text-3xl font-bold text-center">Tài khoản của tôi</div>
      </div>
      <div className="w-[1170px] m-auto">
        <div className="my-account flex gap-x-[50px] my-[40px]">
          <Sidebar
            aria-label="Default sidebar example"
            className="max-h-[320px]"
          >
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                <Sidebar.Item
                  href="#"
                  icon={FaTachometerAlt}
                  onClick={() => {
                    setAccount(true);
                    setOrder(false);
                    setAddress(false);
                    setInfoAccount(false);
                    setDiscount(false);
                  }}
                >
                  Trang tài khoản
                </Sidebar.Item>
                <Sidebar.Item
                  href="#"
                  icon={HiViewBoards}
                  labelColor="dark"
                  onClick={() => {
                    setOrder(true);
                    setAccount(false);
                    setAddress(false);
                    setInfoAccount(false);
                    setDiscount(false);
                  }}
                >
                  Đơn hàng
                </Sidebar.Item>
                <Sidebar.Item
                  href="#"
                  icon={BiSolidCoupon}
                  onClick={() => {
                    setOrder(false);
                    setAccount(false);
                    setAddress(false);
                    setDiscount(true);
                    setInfoAccount(false);
                  }}
                >
                  Mã giảm giá
                </Sidebar.Item>
                <Sidebar.Item
                  href="#"
                  icon={IoLocation}
                  onClick={() => {
                    setOrder(false);
                    setAccount(false);
                    setAddress(true);
                    setInfoAccount(false);
                    setDiscount(false);
                  }}
                >
                  Địa chỉ
                </Sidebar.Item>
                <Sidebar.Item
                  href="#"
                  icon={HiUser}
                  onClick={() => {
                    setOrder(false);
                    setAccount(false);
                    setAddress(false);
                    setInfoAccount(true);
                    setDiscount(false);
                  }}
                >
                  Tài khoản
                </Sidebar.Item>
                <Sidebar.Item
                  href="#"
                  icon={HiArrowSmLeft}
                  onClick={() => {
                    setOpenModal(true);
                  }}
                >
                  Đăng xuất
                </Sidebar.Item>
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </Sidebar>
          <Modal show={openModal} onClose={() => setOpenModal(false)}>
            <Modal.Header>Xác nhận đăng xuất</Modal.Header>
            <Modal.Body>
              <div className="space-y-6">
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  Quý khách hàng có chắn chắn muốn đăng xuất không?
                </p>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={handleLogout}>Đăng xuất</Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                Hủy
              </Button>
            </Modal.Footer>
          </Modal>
          <div className="right ml-10">
            {account && (
              <div>
                <p>
                  Xin chào{" "}
                  <strong>
                    {userInfo.info &&
                      (userInfo.info.fullname || userInfo.info.email)}
                  </strong>{" "}
                  (không phải tài khoản{" "}
                  <strong>
                    {userInfo.info &&
                      (userInfo.info.fullname || userInfo.info.email)}
                  </strong>
                  ? Hãy thoát ra và đăng nhập vào tài khoản của bạn)
                </p>
                <p className="mt-3">
                  Từ trang quản lý tài khoản bạn có thể xem đơn hàng mới, quản
                  lý địa chỉ giao hàng và thanh toán, và sửa mật khẩu và thông
                  tin tài khoản.
                </p>
              </div>
            )}

            {order &&
              (allOrderUser.orders.length <= 0 ? (
                <div className="pt-10">
                  <p className="text-4xl font-extrabold">Orders</p>
                  <div className="flex justify-between items-center border-t-[#fd6e4f] border-t-4 w-full h-[70px] mt-2 bg-[#f7f6f7] p-3">
                    <div className="flex items-center">
                      <IoCheckmarkCircle className="fill-[#fd6e4f]" />
                      <p className="font-thin text-base text-slate-500 ml-2">
                        Bạn chưa có đơn hàng nào.
                      </p>
                    </div>
                    <Link
                      to="/productS"
                      className="h-full w-[200px] bg-orange-500 text-white p-2 font-bold hover:bg-slate-900 duration-200 my-10 text-center"
                    >
                      Đến trang sản phẩm
                    </Link>
                  </div>
                </div>
              ) : (
                <div>
                  <Accordion collapseAll>
                    {allOrderUser.orders.map((order) => (
                      <Accordion.Panel>
                        <Accordion.Title className="flex items-center justify-between">
                          <div>Đơn hàng có mã {order.id}</div>
                          <div>Ngày đặt: {order.order_date}</div>
                        </Accordion.Title>
                        <Accordion.Content>
                          <div>
                            <div>
                              <div>Mã đơn: {order.id}</div>
                              {order.order_detail.map((product) => (
                                <div
                                  className="flex items-center justify-between "
                                  key={product.id}
                                >
                                  <p className="font-bold">{product.name}</p>
                                  <p>
                                    Đơn giá: {formatPrice(product.unitPrice)}
                                  </p>
                                  <p>x{product.quantity}</p>
                                  <p>
                                    {formatPrice(
                                      (() => {
                                        return (
                                          product.unitPrice * product.quantity
                                        );
                                      })()
                                    )}
                                  </p>
                                </div>
                              ))}
                            </div>
                            {order.status === 2 ? (
                              <Badge
                                color="warning"
                                className="w-[100px] mt-2 ml-[90%]"
                              >
                                Chờ xác nhận
                              </Badge>
                            ) : (
                              <Badge
                                color="success"
                                className="w-[100px] mt-2 ml-[90%]"
                              >
                                Đã giao hàng
                              </Badge>
                            )}

                            <p className="text-2xl font-normal mt-5 ml-[70%]">
                              Tổng tiền:
                              {formatPrice(order.total_money)}
                            </p>
                          </div>
                        </Accordion.Content>
                      </Accordion.Panel>
                    ))}
                  </Accordion>
                </div>
              ))}

            {discount && (
              <div className="pt-10">
                <p className="text-3xl font-bold">My Coupon</p>
                <p className="font-thin text-base text-slate-500">
                  Mã giảm giá của bạn
                </p>
                <div className="border border-slate-600 p-5 rounded mt-4 grid grid-cols-2 gap-y-5">
                  {userCoupon.coupons.length > 0 ? (
                    userCoupon.coupons.map((item) => {
                      if (Date.parse(item.expiration_date) > Date.now()) {
                        return (
                          <div className="w-[350px] h-[150px] bg-gradient-to-r from-purple-500 to-pink-500 rounded-md relative shadow-lg shadow-pink-400/50 text-center p-[4px]">
                            <div className="ml-[300px]">
                              <img
                                width="40"
                                height="40"
                                src="https://cdn-icons-png.flaticon.com/512/9528/9528844.png"
                                alt="discount"
                              />
                            </div>
                            <p className="text-sm text-white">
                              Mã giảm giá được áp dụng cho tất cả sản phẩm
                            </p>
                            <p className="text-[20px] mt-1 font-bold">
                              {" "}
                              {item.discount_value} Cho Giá Trị Hơn{" "}
                              {formatPrice(item.value_apply)}
                            </p>
                            <p className="font-semibold">
                              Mã: {item.coupon_code}{" "}
                              <span
                                className="border text-center bg-gray-300 leading-[8px] px-1 cursor-pointer"
                                onClick={() => {
                                  handleCopyToClipboard(item.coupon_code);
                                }}
                              >
                                copy
                              </span>
                            </p>
                            <p className="text-sm">
                              Hạn sử dụng: {item.expiration_date}
                            </p>
                          </div>
                        );
                      }
                    })
                  ) : (
                    <div>Không có mã giảm giá</div>
                  )}
                </div>
              </div>
            )}

            {address && (
              <div className="pt-10">
                <p className="text-3xl font-bold">My Address</p>
                <p className="font-thin text-base text-slate-500">
                  Địa chỉ này sẽ được làm địa chỉ mặc định để nhận hàng
                </p>
                <button
                  className="text-[#fd6d4f] flex items-center space-x-1"
                  onClick={() => setAddressForm(true)}
                >
                  <CiEdit className="fill-[#fd6e4f] " />
                  <span>Thêm</span>
                </button>
                <RadioAddress
                  listAddress={userAddress.list}
                  selectAddress={handleSelectAddress}
                  editAddress={setShowFormEditAddress}
                />
              </div>
            )}
            <FormAddAddress show={addressForm} onClose={setAddressForm} />
            <FormEditAddress
              show={openEditAddressForm}
              onClose={setOpenEditAddressForm}
              address={editAddress}
            />
            {infoAccount && (
              <div className="">
                <div className="flex justify-between items-center">
                  <div className="w-[48%]">
                    <div className="flex mb-1">
                      <label className="font-semibold " htmlFor="first-name">
                        First Name
                      </label>{" "}
                      <span className="inline text-[red]">*</span>
                    </div>
                    <div className="flex gap-x-1 h-[40px] items-center">
                      <input
                        type="text"
                        name=""
                        id="first-name"
                        className="outline-none border w-full my-2 px-2 py-2"
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-[48%]">
                    <div className="flex mb-1">
                      <label className="font-semibold " htmlFor="last-name">
                        Last Name
                      </label>{" "}
                      <span className="inline text-[red]">*</span>
                    </div>
                    <div className="flex gap-x-7 h-[40px] items-center">
                      <input
                        type="text"
                        name=""
                        id="last-name"
                        className="outline-none border w-[100%] my-2 px-2 py-2"
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full mt-5">
                  <div className="flex mb-1">
                    <label className="font-semibold " htmlFor="first-name">
                      Display Name
                    </label>{" "}
                    <span className="inline text-[red]">*</span>
                  </div>
                  <div className="flex gap-x-1 h-[40px] items-center">
                    <input
                      type="text"
                      name=""
                      id="first-name"
                      className="outline-none border w-full my-2 px-2 py-2"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <p className="text-base text-slate-500 font-thin mt-2">
                  Tên này sẽ hiển thị ở trang cá nhân và phần đánh giá sản phẩm
                </p>
                <div className="h-[1px] w-full bg-slate-600 mt-10"></div>
                <div>
                  <p className="text-2xl font-bold mt-3">Password Change</p>
                  <div className="w-full mt-8">
                    <div className="flex mb-1">
                      <label className="font-medium" htmlFor="current-pass">
                        Mật khẩu hiện tại
                      </label>{" "}
                    </div>
                    <div className="flex gap-x-1 h-[40px] items-center">
                      <input
                        type="password"
                        name=""
                        id="current-pass"
                        className="outline-none border w-full my-2 px-2 py-2"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-full mt-8">
                    <div className="flex mb-1">
                      <label className="font-medium" htmlFor="new-pass">
                        Mật khẩu mới
                      </label>{" "}
                    </div>
                    <div className="flex gap-x-1 h-[40px] items-center">
                      <input
                        type="password"
                        name=""
                        id="new-pass"
                        className="outline-none border w-full my-2 px-2 py-2"
                        value={rePass1}
                        onChange={(e) => {
                          setRePass1(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-full mt-8">
                    <div className="flex mb-1">
                      <label className="font-medium" htmlFor="repeat-pass">
                        Nhập lại mật khẩu mới
                      </label>{" "}
                    </div>
                    <div className="flex gap-x-1 h-[40px] items-center">
                      <input
                        type="password"
                        name=""
                        id="repeat-pass"
                        className="outline-none border w-full my-2 px-2 py-2"
                        value={rePass2}
                        onChange={(e) => {
                          setRePass2(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="h-full w-[150px] bg-orange-500 text-white p-2 font-bold hover:bg-slate-900 duration-200 my-10"
                    onClick={handleChangeInfo}
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
export default MyAccount;
