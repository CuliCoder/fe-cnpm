import React, { useState, useEffect } from "react";
import { Carousel, Breadcrumb } from "flowbite-react";
import { HiCheck } from "react-icons/hi";
import { FaCartPlus } from "react-icons/fa";
import { useParams, Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { HiHome } from "react-icons/hi";
import { IoIosArrowForward } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import { addProduct } from "../../Slice/cartSlice";
import { formatPrice } from "../../config/formatPrice";
import { fetchAddToCart } from "../../Slice/cartSlice";
import { setShowToast } from "../../Slice/MyToastSlice";
import "./ContentProduct.css";

const ContentProduct = React.memo(() => {
  const [isSoldOut, setIsSoldOut] = useState(false);
  const dispatch = useDispatch();
  const itemsInCart = useSelector((state) => state.cart.getCart.items);
  let { productId } = useParams();
  const [currentProduct, setCurrentProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [productlimit, setProductLimit] = useState([]);
  const { byUpdatedAt } = useSelector((state) => state.products.products_page);
  const status = useSelector((state) => state.status);
  const addToCart = useSelector((state) => state.cart.addCart);
  useEffect(() => {
    if (byUpdatedAt) {
      setCurrentProduct(
        byUpdatedAt.find((product) => product.id === parseInt(productId))
      );
    }
  }, [productId, byUpdatedAt]);
  useEffect(() => {
    if (byUpdatedAt) {
      setProductLimit(byUpdatedAt.slice(0, 12));
    }
  }, [byUpdatedAt]);
  useEffect(() => {
    if (addToCart.error === null || addToCart.loading) return;
    dispatch(
      setShowToast({
        show: true,
        type: addToCart.error === 0 ? "success" : "error",
        message: addToCart.message,
      })
    );
  }, [addToCart.loading, addToCart.error]);
  return (
    <div className="relative">
      <div className="content pb-[120px]">
        <Breadcrumb
          aria-label="Solid background breadcrumb example"
          className="bg-[#f4f9fc] h-[60px]  items-centerpx-5 py-3 dark:bg-gray-800 flex items-center justify-center"
        >
          <div className="w-[1170px] m-auto flex">
            <Breadcrumb.Item href="/" icon={HiHome}>
              Trang Chủ
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/products">Sản phẩm </Breadcrumb.Item>
            <Breadcrumb.Item>
              {currentProduct && currentProduct.title}
            </Breadcrumb.Item>
          </div>
        </Breadcrumb>
        <div className="body-content flex gap-10  w-[1170px] m-auto py-[40px] px-[20px]">
          <div className="left w-[510px] h-[650px]">
            <div className="h-56 sm:h-64 xl:h-80 2xl:h-[600px]">
              <Carousel className="">
                {currentProduct &&
                  currentProduct.gallery.map((image) => (
                    <img
                      src={image}
                      alt="..."
                      className="w-[510px] object-cover"
                    />
                  ))}
              </Carousel>
            </div>
          </div>
          <div className="right w-[630px] text-left">
            <p className="name text-3xl font-medium">
              {currentProduct && currentProduct.title}
            </p>
            <p className="price py-4 font-bold text-l">
              {currentProduct && formatPrice(currentProduct.price)}
            </p>
            <p className="quote italic text-thin text-sm tracking-widest ">
              {currentProduct && currentProduct.introduce}
            </p>
            <div className="flex pt-[40px] gap-5">
              <div className="product-quantity border-slate-300 flex border justify-center items-center py-1 px-1">
                <div
                  className="decrease p-1 hover:cursor-pointer"
                  onClick={() => {
                    if (quantity <= 1 || isNaN(quantity)) {
                      setQuantity(1);
                    } else {
                      setQuantity((quantity) => quantity - 1);
                    }
                  }}
                >
                  <IoIosArrowBack />
                </div>
                <input
                  type="number"
                  className="quantity px-3 border-0 focus:outline-none w-[50px]"
                  value={quantity}
                  min="1"
                  onChange={(e) => {
                    setQuantity(parseInt(e.target.value));
                  }}
                />
                <div
                  className="increase p-1 hover:cursor-pointer"
                  onClick={() => {
                    setQuantity(isNaN(quantity) ? 1 : quantity + 1);
                  }}
                >
                  <IoIosArrowForward />
                </div>
              </div>
              <div
                className="flex items-center px-8 py-3 bg-orange-500 text-white gap-2 cursor-pointer  hover:bg-slate-900 duration-200"
                onClick={() => {
                  if (currentProduct) {
                    const itemCurrent = itemsInCart.find((item) => {
                      return item.id === currentProduct.id;
                    });
                    if (itemCurrent) {
                      if (
                        itemCurrent.quantity + quantity >
                        currentProduct.quantity
                      ) {
                        dispatch(
                          setShowToast({
                            show: true,
                            type: "error",
                            message:
                              "Số lượng sản phẩm trong giỏ hàng vượt quá số lượng trong kho",
                          })
                        );
                        return;
                      }
                    }
                    if (currentProduct.quantity < quantity) {
                      setIsSoldOut(true);
                      return;
                    }
                    dispatch(
                      addProduct({
                        id: currentProduct.id,
                        name: currentProduct.title,
                        price: currentProduct.price,
                        quantity,
                        total_price: currentProduct.price * quantity,
                        thumbnail: currentProduct.thumbnail,
                      })
                    );
                    {
                      status.error === 0 &&
                        dispatch(
                          fetchAddToCart({
                            id_product: currentProduct.id,
                            quantity,
                            price: currentProduct.price,
                          })
                        );
                    }
                    setIsSoldOut(false);
                  }
                }}
              >
                <FaCartShopping /> <p>Thêm vào giỏ hàng</p>
              </div>
            </div>
            <div className="pb-[40px]">
              {isSoldOut && (
                <p className="text-red-400">
                  Số lượng trong kho không đủ với số lượng của bạn. Còn :{" "}
                  {currentProduct.quantity}
                </p>
              )}
            </div>
            <div className="w-full h-[1px] bg-slate-300"></div>
            <div className="py-[50px]">
              <div className="font-bold text-medium py-1">
                Đơn vị: <span className="font-normal">VNĐ</span>
              </div>
              <div className="font-bold text-medium  py-1">
                Mã: <span className="font-normal">vnk-noan</span>
              </div>
              <div className="font-bold text-medium  py-1">
                Danh Mục:{/*  */}
                <span className="font-normal">
                  {currentProduct &&
                    currentProduct.category.map((cate, index) => (
                      <Link
                        className="text-black hover:text-red-500"
                        to={`/products/category/${cate.id}`}
                        key={cate.id}
                      >
                        {index === currentProduct.category.length - 1
                          ? " " + cate.name
                          : " " + cate.name + ","}{" "}
                      </Link>
                    ))}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[1px] bg-slate-300 my-10 w-[1170px] m-auto"></div>
        <div className="desc w-[1170px] m-auto py-8 px-10 text-left border-slate-300 border rounded-[5px]">
          {currentProduct && (
            <div
              dangerouslySetInnerHTML={{ __html: currentProduct.description }}
            />
          )}
        </div>
        <div className="text-left w-[1170px] m-auto py-20">
          <h1 className="font-medium text-md">SẢN PHẨM LIÊN QUAN</h1>
          <div className="h-56 sm:h-64 xl:h-80 2xl:h-96 py-5">
            <Carousel>
              <div className="flex justify-between gap-x-5 bg-slate-100">
                {productlimit &&
                  productlimit.slice(0, 4).map((product) => (
                    <Link
                      to={`/product/${product.id}`}
                      key={product.id}
                      className="h-[360px] product-item relative duration-1000 hover:cursor-pointer hover:shadow-md p-3"
                    >
                      <div className="h-[250px] object-cover">
                        <img
                          src={product.thumbnail}
                          alt=""
                          className="scale-90"
                        />
                      </div>
                      <div className="name duration-100">
                        <p className="mt-[40px] font-normal w-full mb-5">
                          {product.title}
                        </p>
                        <span className="font-medium my-4">
                          {product.price}₫
                        </span>
                      </div>
                      <button
                        type="button"
                        className={`h-[40px] w-11/12 m-auto bg-orange-500 text-white p-2 font-medium
                    hover:bg-slate-900 duration-200 items-center justify-center absolute top-[80%] left-3
                    `}
                      >
                        <FaCartPlus className="w-5 h-10 px-1" />
                        THÊM VÀO GIỎ HÀNG
                      </button>
                    </Link>
                  ))}
              </div>
              <div className="flex justify-between gap-x-5 bg-slate-100">
                {productlimit &&
                  productlimit.slice(4, 8).map((product) => (
                    <Link
                      to={`/product/${product.id}`}
                      key={product.id}
                      className="h-[360px] product-item relative duration-1000 hover:cursor-pointer hover:shadow-md p-3"
                    >
                      <div className="h-[250px] object-cover">
                        <img
                          src={product.thumbnail}
                          alt=""
                          className="scale-90"
                        />
                      </div>
                      <div className="name duration-100">
                        <p className="mt-[40px] font-normal w-full mb-5">
                          {product.title}
                        </p>
                        <span className="font-medium my-4">
                          {product.price}₫
                        </span>
                      </div>
                      <button
                        type="button"
                        className={`h-[40px] w-11/12 m-auto bg-orange-500 text-white p-2 font-medium
                    hover:bg-slate-900 duration-200 items-center justify-center absolute top-[80%] left-3
                    `}
                      >
                        <FaCartPlus className="w-5 h-10 px-1" />
                        THÊM VÀO GIỎ HÀNG
                      </button>
                    </Link>
                  ))}
              </div>
              <div className="flex justify-between gap-x-5 bg-slate-100">
                {productlimit &&
                  productlimit.slice(8, 12).map((product) => (
                    <Link
                      to={`/product/${product.id}`}
                      key={product.id}
                      className="h-[360px] product-item relative duration-1000 hover:cursor-pointer hover:shadow-md p-3"
                    >
                      <div className="h-[250px] object-cover">
                        <img
                          src={product.thumbnail}
                          alt=""
                          className="scale-90"
                        />
                      </div>
                      <div className="name duration-100">
                        <p className="mt-[40px] font-normal w-full mb-5">
                          {product.title}
                        </p>
                        <span className="font-medium my-4">
                          {product.price}₫
                        </span>
                      </div>
                      <button
                        type="button"
                        className={`h-[40px] w-11/12 m-auto bg-orange-500 text-white p-2 font-medium
                    hover:bg-slate-900 duration-200 items-center justify-center absolute top-[80%] left-3
                    `}
                      >
                        <FaCartPlus className="w-5 h-10 px-1" />
                        THÊM VÀO GIỎ HÀNG
                      </button>
                    </Link>
                  ))}
              </div>
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
});
export default ContentProduct;
