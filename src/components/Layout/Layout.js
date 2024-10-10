import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer";
import { useEffect, useState } from "react";
import { check_status } from "../../Slice/status";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../Spinner/Spinner";
import { fetchAllProducts } from "../../Slice/products";
import { fetchAllCategory } from "../../Slice/categorySlice";
import Mainpage from "../Mainpage/Mainpage";
import Login from "../Login/Login";
export default function Layout({ children }) {
  return (
    <div>
      <Header />
      <main>
        {/* {children.type.name === "Login" ? (
          isLogin ? (
            <Mainpage />
          ) : (
            children
          )
        ) : children.type.name === "MyAccount" && !isLogin ? (
          <Login />
        ) : (
          children
        )} */}
        {children}
      </main>
      <Footer />
    </div>
  );
}
