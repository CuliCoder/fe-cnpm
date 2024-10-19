import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import Cart from "./components/cart/Cart.jsx";
import Register from "./components/Register/Register.jsx";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword.jsx";
import Login from "./components/Login/Login.jsx";
import MyAccount from "./components/MyAccount/MyAccount.jsx";
import ContentProduct from "./components/ContentProduct/ContentProduct.jsx";
import Mainpage from "./components/Mainpage/Mainpage.jsx";
import Layout from "./components/Layout/Layout.js";
import Products from "./components/Products/Products.jsx";
import Payment from "./components/Checkout/Checkout.jsx";
import SearchProduct from "./components/SearchProduct/SearchProduct.jsx";
import Product_category from "./components/Product_category/Product_category.jsx";
import { useEffect, useState } from "react";
import { check_status } from "./Slice/status";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "./components/Spinner/Spinner";
import { fetchAllProducts } from "./Slice/products";
import { fetchAllCategory } from "./Slice/categorySlice";
import { fetchCart } from "./Slice/cartSlice";
import { fetchAllAuthor } from "./Slice/authorSlice.js";
import Author from "./components/Author/Author.js";
import axios from "./config/configAxios.js";
function App() {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.status);
  const products_page = useSelector((state) => state.products.products_page);
  const category = useSelector((state) => state.category);
  const getCart = useSelector((state) => state.cart.getCart);
  const itemsOfCart = useSelector((state) => state.cart.getCart.items);
  const addCart = useSelector((state) => state.cart.addCart);
  useEffect(() => {
    dispatch(check_status());
    dispatch(fetchAllProducts());
    dispatch(fetchAllCategory());
    dispatch(fetchAllAuthor());
  }, []);
  useEffect(() => {
    if (status.error === 0) {
      dispatch(fetchCart());
    }
  }, [status.error]);
  if (status.error === null) {
    return <Spinner />;
  }
  return (
    <Router>
      {(products_page.loading ||
        category.loading ||
        getCart.loading ||
        addCart.loading) && <Spinner />}
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Mainpage />
            </Layout>
          }
        ></Route>
        <Route
          path="/cart"
          element={
            <Layout>
              <Cart />
            </Layout>
          }
        ></Route>
        <Route
          path="/products"
          element={
            <Layout>
              <Products />
            </Layout>
          }
        ></Route>
        <Route
          path="/login"
          element={
            <Layout>{status.error === 0 ? <MyAccount /> : <Login />}</Layout>
          }
        ></Route>

        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        ></Route>
        <Route
          path="/product/:productId"
          element={
            <Layout>
              <ContentProduct />
            </Layout>
          }
        ></Route>
        <Route
          path="/search/:valueSearch"
          element={
            <Layout>
              <SearchProduct />
            </Layout>
          }
        ></Route>
        <Route
          path="/my-account"
          element={
            <Layout>{status.error === 0 ? <MyAccount /> : <Login />}</Layout>
          }
        ></Route>
        <Route
          path="/checkout"
          element={
            <Layout>
              {status.error === 0 ? (
                itemsOfCart.length > 0 ? (
                  <Payment />
                ) : (
                  <Products />
                )
              ) : (
                <Login />
              )}
            </Layout>
          }
        ></Route>
        <Route
          path="/new-product"
          element={
            <Layout>
              <newProduct />
            </Layout>
          }
        ></Route>
        <Route
          path="/recover-password"
          element={
            <Layout>
              <ForgotPassword />
            </Layout>
          }
        ></Route>
        <Route
          path="/products/category/:category_id"
          element={
            <Layout>
              <Product_category />
            </Layout>
          }
        ></Route>
        <Route
          path="/author/:id"
          element={
            <Layout>
              <Author />
            </Layout>
          }
        ></Route>
        <Route path="*" element={<h1>404 Not Found</h1>}></Route>
      </Routes>
    </Router>
  );
}

export default React.memo(App);
