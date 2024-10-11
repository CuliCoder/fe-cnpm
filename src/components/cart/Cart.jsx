import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Toast } from "flowbite-react";
import { HiX } from "react-icons/hi";
import { FaTimes } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { CiShoppingCart } from "react-icons/ci";
import { FaLock } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  increaseQuantity,
  unincreaseQuantity,
  deleteProduct,
  changeQuantity,
  removeFromCart,
} from "../../Slice/cartSlice";
import { formatPrice } from "../../config/formatPrice";

export default function Cart() {
  const itemsOfCart = useSelector((state) => state.cart.getCart.items);
  const [showToast, setShowToast] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [status_login, setStatus_login] = useState(false);
  const status = useSelector((state) => state.status);
  const products = useSelector((state) => state.products.products_page);
  const dispatch = useDispatch();
  const increaseItem = (item) => {
    const product = products.byUpdatedAt.find(
      (product) => product.id === item.id
    );
    if (product.quantity < item.quantity + 1) {
      return;
    }
    dispatch(increaseQuantity(item));
    {
      status.error === 0 && dispatch(changeQuantity({ item, offset: 1 }));
    }
  };

  const decreaseItem = (item) => {
    if (item.quantity === 1) {
      return;
    }
    dispatch(unincreaseQuantity(item));
    {
      status.error === 0 && dispatch(changeQuantity({ item, offset: -1 }));
    }
  };
  useEffect(() => {
    let total = 0;
    itemsOfCart.forEach((item) => {
      total += parseInt(item.price * item.quantity);
    });
    setCurrentPrice(total);
  }, [itemsOfCart]);
  useEffect(() => {
    setStatus_login(status.error === 0);
  }, [status.error]);
  return (
    <div>
      <div className="cart relative">
        {showToast && (
          <Toast className="absolute top-[-200px] right-5">
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
              <HiX className="h-5 w-5" />
            </div>
            <div className="ml-3 text-sm font-normal">
              Xóa sản phẩm thành công
            </div>
            <Toast.Toggle onDismiss={() => setShowToast(false)} />
          </Toast>
        )}
        <div className="breadcrumb bg-[#f4f9fc] h-20 flex items-center justify-center">
          <a href="/" className="px-1">
            Trang Chủ
          </a>{" "}
          / <p className="font-medium px-1"> Giỏ hàng</p>
        </div>
        {/* Cart Content */}
        <div className="cart-content py-10">
          <div className="heading font-extrabold text-2xl pb-10 w-[1170px] m-auto">
            <p>Giỏ hàng</p>
          </div>
          <div className="cart-box w-[1170px] m-auto">
            {/* Print List */}
            {itemsOfCart.map((item) => (
              <div
                className="item h-[154px] bg-[#fcfcfc] flex items-center justify-between my-2"
                key={item.id}
              >
                <div className="product-img w-[120px] object-cover">
                  <img src={item.thumbnail} alt="Anh san pham" />
                </div>
                <div className="product-name w-[280px] font-light">
                  <a href="/#">{item.name}</a>
                </div>
                <div className="product-price">{formatPrice(item.price)}</div>
                <div className="product-quantity border-slate-300 flex border justify-center items-center py-1 px-1">
                  <div
                    className="decrease p-1"
                    onClick={() => decreaseItem(item)}
                  >
                    <IoIosArrowBack />
                  </div>
                  <div className="quantity px-3">{item.quantity}</div>
                  <div
                    className="increase p-1"
                    onClick={() => {
                      increaseItem(item);
                    }}
                  >
                    <IoIosArrowForward />
                  </div>
                </div>
                <div className="product-total">
                  Giá sản phẩm: {formatPrice(item.total_price)}
                </div>
                <div
                  className="product-cancel border p-1 mr-5"
                  onClick={() => {
                    dispatch(deleteProduct(item));
                    setShowToast(true);
                    {
                      status.error === 0 && dispatch(removeFromCart(item.id));
                    }
                  }}
                >
                  <FaTimes />
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between w-[1170px] m-auto py-10 border-b-2">
            <div className="coupons border-gray-700 border-solid border p-1 rounded-sm">
              <input
                type="text"
                name=""
                id=""
                placeholder="Nhập mã giảm giá"
                className="border-none outline-none w-[300px] px-2"
              />
              <button
                type="button"
                className="h-full w-28 bg-orange-500 text-white p-2 font-bold hover:bg-slate-900 duration-200"
              >
                Apply
              </button>
            </div>
            <Link
              to="/products"
              className=" border flex items-center p-3 px-4 font-semibold"
            >
              <CiShoppingCart />
              <p>TIẾP TỤC MUA SẮM</p>
            </Link>
          </div>
        </div>

        {/* After Cart */}
        <div className="w-[1170px] m-auto mb-[40px]">
          <div className="flex justify-between">
            <div></div>
            <div>
              <div className="bg-[#fcfcfc] w-[540px] py-[40px] px-[30px] text-left rounded">
                <p className="font-bold mb-7">Cộng giỏ hàng</p>
                <div className="flex justify-between items-center">
                  <p className="text-thin text-sm">Tạm tính</p>
                  <span className="inline-block font-bold">
                    {formatPrice(currentPrice)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-thin text-sm">Giao hàng</p>
                  <span className="inline-block font-bold">
                    Phí vận chuyển sẽ báo sau.
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-thin text-sm">Tổng</p>
                  <span className="inline-block font-bold">
                    {formatPrice(currentPrice)}
                  </span>
                </div>
                <Link to={status_login ? "/checkout" : "/login"}>
                  <button
                    type="button"
                    className="h-full w-[300px] bg-orange-500 text-white p-2 font-bold hover:bg-slate-900 duration-200 mt-5 flex items-center justify-center "
                  >
                    <FaLock className="mr-2" /> TIẾN HÀNH THANH TOÁN
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
