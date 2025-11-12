import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { currency } from "../App";
import axios from "axios";
import { toast } from 'react-toastify';


// AXIOS INSTANCE — PURE BEARER (SAME AS EVERYWHERE)
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("phenzAdminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const List = () => {
  const [list, setList] = useState([]);

  const fetchList = async () => {

    try{
      const response = await api.get("/api/product/list");
    if(response.data.success){
      setList(response.data.products);
    }else {
      toast.error(response.data.message)
    }

    } catch (error){
      console.log(error)
      toast.error(error.message)
    }
    
    
  };

  const removeProduct = async (id) => {

    try{
      const response = await api.post("/api/product/remove", { id });
      if(response.data.success){
        toast.success(response.data.message)
        await fetchList();
      } else {
        console.log(response.data.message)
        toast.error(response.data.message)
      }
    } catch (error){
      console.log(error)
      toast.error(error.message)
    }

  }

  useEffect(() => {
    fetchList();
  }, []);

  return (
  <>
  <p className="mb-2">All Products List</p>
  <div className="flex flex-col gap-2">

    {/* Table title */}
    <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
      <b>Image</b>
      <b>Name</b>
      <b>Category</b>
      <b>Price</b>
      <b className="text-center">Action</b>
    </div>

    {/* Product List */}
    {
      list.map((item, index) => (
        <div className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center px-2 py-1 gap-2 border text-sm" key={index}>
          <img className="w-12" src={item.image[0]} alt="Product Image 1" />
          <p>{item.name}</p>
          <p>{item.category}</p>
          <p>{currency} {item.price}</p>
          <p onClick={() => removeProduct(item._id)} className="text-right md:text-center cursor-pointer text-lg">X</p>
        </div>
      ))
    }

  </div>
  </>
  );
};

export default List;
