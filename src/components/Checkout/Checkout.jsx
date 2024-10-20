import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Spinner, Toast } from "flowbite-react";
import { HiCheck } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../Slice/cartSlice";
import { FaCartPlus } from "react-icons/fa";
import "./Checkout.css";
import axiosConfig from "../../config/configAxios.js";
import { formatPrice } from "../../config/formatPrice.js";
const Checkout = React.memo(() => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [idProvince, setIdProvince] = useState(null);
  const [idDistrict, setIdDistrict] = useState(null);
  const [idWard, setIdWard] = useState(null);
  const [dataProvince, setdataProvince] = useState([]);
  const [dataDistrict, setdataDistrict] = useState([]);
  const [dataWardName, setdataWardName] = useState("");
  const [dataProvinceName, setdataProvinceName] = useState("");
  const [dataDistrictName, setdataDistrictName] = useState("");
  const [dataWards, setdataWards] = useState([]);
  const [detailAddress, setdetailAddress] = useState("");
  const [shipFee, setShipFee] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [isLoad, setLoad] = useState(false);
  const [isToast, setToast] = useState(false);
  const userInfo = useSelector((state) => state.user.information);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const productInCart = useSelector((state) => state.cart.getCart.items);

  useEffect(() => {
    axios
      .get("https://esgoo.net/api-tinhthanh/1/0.htm")
      .then((response) => {
        setdataProvince(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(` https://esgoo.net/api-tinhthanh/2/${idProvince}.htm`)
      .then((res) => {
        setdataDistrict(res.data.data);
        setdataProvinceName(res.data.data_name);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [idProvince]);

  useEffect(() => {
    axios
      .get(`https://esgoo.net/api-tinhthanh/3/${idDistrict}.htm`)
      .then((res) => {
        setdataWards(res.data.data);
        setdataDistrictName(res.data.data_name);
        setShipFee(idProvince === "79" ? 19000 : 35000);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [idDistrict]);

  const handleAcceptOrder = () => {
    async function sendOrder() {
      const res = await axiosConfig.post(
        "/api/user/add_order",
        JSON.stringify({
          employeeId: null,
          fullname: `${firstName} ${lastName}`,
          phoneNumber: phoneNumber,
          email: email,
          address: `${detailAddress}, ${dataWardName}, ${dataDistrictName}, ${dataProvinceName}`,
          products: productInCart,
          note: note,
          shipFee: shipFee,
          total: currentPrice,
        })
      );
      if (res.data.status) {
        setLoad(true);
        setTimeout(() => {
          setToast(true);
        }, 1000);
        setTimeout(() => {
          navigate("/");
          setLoad(false);
        }, 1500);
        dispatch(clearCart());
      } else {
        console.log(res.data.message);
      }
    }
    sendOrder();
  };

  useEffect(() => {
    const result = dataWards.find((item) => item.id === idWard);

    setdataWardName(result ? result.name : undefined);
  }, [idWard]);

  useEffect(() => {
    let total = 0;
    productInCart.forEach((item) => {
      total += parseInt(item.price * item.quantity);
    });
    setCurrentPrice(total);
  }, [productInCart]);

  return (
    <div>
      <div className="breadcrumb bg-[#f4f9fc] h-[110px] py-5 ">
        <div className="flex items-center justify-center">
          <Link to="/" className="px-1">
            Trang Chủ
          </Link>{" "}
          /{" "}
          <Link to="#" className="font-medium px-1">
            {" "}
            Thanh toán
          </Link>
        </div>
        <div className="text-3xl font-bold text-center">Thanh toán</div>
      </div>
      <div className="w-[1170px] m-auto relative">
        {isToast && (
          <Toast className="fixed top-[150px] right-10">
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
              <HiCheck className="h-5 w-5" />
            </div>
            <div className="ml-3 text-sm font-normal">
              Đơn hàng đã được đăt thành công
            </div>
            <Toast.Toggle />
          </Toast>
        )}
        <div className="checkout">
          <div></div>
          <div className="grid grid-cols-2 gap-x-[30px] mt-20">
            <div className="location border p-6  pt-[50px]">
              <p className="font-bold text-lg">THÔNG TIN GIAO HÀNG</p>
              <p className="text-base font-light text-slate-500 ">
                Vui lòng nhập thông tin của bạn vào bên dưới để tiếp tục thanh
                toán
              </p>
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
                        setIdProvince(e.target.value);
                      }}
                      className="block h-[40px] border-slate-200 focus:ring-0 w-[230px] mt-1"
                    >
                      <option value="" defaultValue>
                        Chọn tỉnh thành
                      </option>
                      {dataProvince.map((item, index) => (
                        <option key={index} value={item.id}>
                          {item.full_name}
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
                        setIdDistrict(e.target.value);
                      }}
                      className="block h-[40px] border-slate-200 focus:ring-0 w-[230px] mt-1"
                    >
                      <option value="" defaultValue>
                        Chọn quận huyện
                      </option>
                      {dataDistrict.map((item, index) => (
                        <option key={index} value={item.id}>
                          {item.full_name}
                        </option>
                      ))}
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
                        setIdWard(e.target.value);
                      }}
                    >
                      <option value="" defaultValue>
                        Chọn phường xã
                      </option>
                      {dataWards.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.full_name}
                        </option>
                      ))}
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
                <div className="note mt-20">
                  <h1 className="font-bold text-lg">THÔNG TIN KHÁC</h1>
                  <p className="font-semibold text-base text-slate-700 mb-[20]">
                    {" "}
                    Ghi chú đơn hàng (tuỳ chọn)
                  </p>
                  <textarea
                    name="note"
                    id="note"
                    rows="10"
                    placeholder="Ghi chú về đơn hàng, ví dụ: Làm ơn giao hàng ngoài giờ hành chính "
                    className="resize w-[520px] max-w-[520px] min-w-[420px] focus:ring-0"
                    onChange={(e) => {
                      setNote(e.target.value);
                    }}
                    value={note}
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="method-payment border p-6 pt-[50px]">
              <p className="font-bold text-lg">XÁC NHẬN ĐƠN HÀNG</p>
              <p className="text-base font-light text-slate-500 ">
                Hãy xác nhận lần cuối trước khi đặt hàng, bạn có thể thay đổi{" "}
                <Link to="/cart" className="text-red-400">
                  ở đây
                </Link>
              </p>
              <div className="mt-5">
                {productInCart.map((product) => (
                  <div className="flex justify-between items-center mb-2 bg-[#fcfcfc] pr-2">
                    <div className="w-[96px] h-[123px]">
                      <img src={product.thumbnail} alt="" />
                    </div>
                    <Link
                      to="/product/:product-id"
                      className="w-[218px] font-semibold"
                    >
                      <p>{product.name}</p>
                    </Link>
                    <div className="font-bold">
                      <span>{formatPrice(parseInt(product.price))}</span>
                    </div>
                    <div className="font-bold">
                      <span>x{product.quantity}</span>
                    </div>
                    <div className="total font-bold">
                      <p>{formatPrice(product.price * product.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-[20px] bg-[#ebebeb] p-5">
                <p className="font-bold text-xl">Giá trị đơn hàng</p>
                <div className="flex justify-between items-center">
                  <p className="font-base text-slate-500">Giá sản phẩm</p>
                  <span className="font-bold">{formatPrice(currentPrice)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-base text-slate-500">Giao hàng</p>
                  <span className="font-bold">
                    GHTK đường bộ: {formatPrice(shipFee)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-base text-slate-500">Tổng</p>
                  <span className="font-bold">
                    {formatPrice(currentPrice + shipFee)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <button
              type="button"
              className={`h-[40px] w-[180px] m-auto bg-orange-500 text-white p-2 font-bold
                    hover:bg-slate-900 duration-200 items-center justify-center flex my-20
                    `}
              onClick={handleAcceptOrder}
            >
              <FaCartPlus className=" w-5 h-10 px-1" />
              ĐẶT HÀNG
            </button>
          </div>
        </div>
        {isLoad && (
          <div className=" flex justify-center items-center absolute top-[50%] left-[42%] w-[200px] h-[200px] bg-[rgba(0,0,0,0.2)]">
            <div className=" flex-wrap  gap-2 ">
              <Spinner aria-label="Extra large spinner example" size="xl" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
export default Checkout;
