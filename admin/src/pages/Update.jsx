import React from "react";
import { assets } from "../assets/assets";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// 1. For JSON requests (list, single, remove)
const apiJson = axios.create({
  baseURL: backendUrl,
  headers: { "Content-Type": "application/json" },
});

// 2. For file uploads (add, update)
const api = axios.create({
  baseURL: backendUrl,
  headers: { "Content-Type": "multipart/form-data" },
});

// Add token to both
[apiJson, api].forEach((api) => {
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
});

// const GetProductId = (id) => {
//     const ProductId = id;
//     return ProductId;
// }

const Update = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false); // ✅ Loader state
  const [fetching, setFetching] = useState(true); // For loading product

  // Fetch product on mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setFetching(true);
        const res = await apiJson.post("/api/product/single", { productId: id });
        if (res.data.success) {
          const p = res.data.product;

          setName(p.name);
          setDescription(p.description);
          setPrice(p.price);
          setCategory(p.category);
          setSubCategory(p.subCategory);
          setBestseller(p.bestseller);
          setSizes(p.sizes || []);

          // Store existing image URLs for preview (we'll keep them unless replaced)
          setImage1(p.image[0] || false);
          setImage2(p.image[1] || false);
          setImage3(p.image[2] || false);
          setImage4(p.image[3] || false);
        } else {
          toast.error("Product not found");
        }
      } catch (error) {
        toast.error("Failed to load product");
        console.error(error);
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("id", id); // Critical: send product ID

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      // Only append new files if user selected them
      image1 && typeof image1 === "object" && formData.append("image1", image1);
      image2 && typeof image2 === "object" && formData.append("image2", image2);
      image3 && typeof image3 === "object" && formData.append("image3", image3);
      image4 && typeof image4 === "object" && formData.append("image4", image4);

      const response = await api.put("/api/product/update", formData);
      // Use PUT to match REST convention

      if (response.data.success) {
        toast.success(response.data.message);
        // Optionally refetch or redirect
        navigate("/list")
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper: show preview (URL or File)
  const getImageSrc = (img) => {
    if (!img) return assets.upload_area;
    if (typeof img === "string") return img; // existing URL
    return URL.createObjectURL(img); // new file
  };

  if (fetching) {
    return <div className="text-center py-10">Loading product...</div>;
  }

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full gap-3 items-start"
    >
      <div>
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((num) => {
      const img = eval(`image${num}`);
      const setImg = eval(`setImage${num}`);
      return (
        <label key={num} htmlFor={`image${num}`}>
          <img
            className="w-20 h-20 object-cover rounded border"
            src={getImageSrc(img)}
            alt={`Product image ${num}`}
          />
          <input
            onChange={(e) => setImg(e.target.files[0] || false)}
            type="file"
            id={`image${num}`}
            hidden
            accept="image/*"
          />
        </label>
      );
    })}
        </div>
      </div>
      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Type here"
          required
        />
      </div>
      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Write content here"
          required
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product Category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="w-ful px-3 py-3"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
        <div>
          <p className="mb-2">Sub Category</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-ful px-3 py-3"
          >
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winter">Winter</option>
          </select>
        </div>
        <div>
          <p className="mb-2">Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-ful px-3 py-3 sm:w-[120px]"
            type="Number"
            placeholder="25"
          />
        </div>
      </div>
      <div>
        <p>Product Sizes</p>
        <div className="flex gap-3">
          <div
            onClick={() =>
              setSizes((prev) =>
                prev.includes("S")
                  ? prev.filter((item) => item != "S")
                  : [...prev, "S"]
              )
            }
          >
            <p
              className={`${
                sizes.includes("S") ? "green-bg" : "bg-slate-200"
              }  cursor-pointer px-3 py-1`}
            >
              S
            </p>
          </div>
          <div
            onClick={() =>
              setSizes((prev) =>
                prev.includes("M")
                  ? prev.filter((item) => item != "M")
                  : [...prev, "M"]
              )
            }
          >
            <p
              className={`${
                sizes.includes("M") ? "green-bg" : "bg-slate-200"
              }  cursor-pointer px-3 py-1`}
            >
              M
            </p>
          </div>
          <div
            onClick={() =>
              setSizes((prev) =>
                prev.includes("L")
                  ? prev.filter((item) => item != "L")
                  : [...prev, "L"]
              )
            }
          >
            <p
              className={`${
                sizes.includes("L") ? "green-bg" : "bg-slate-200"
              }  cursor-pointer px-3 py-1`}
            >
              L
            </p>
          </div>
          <div
            onClick={() =>
              setSizes((prev) =>
                prev.includes("XL")
                  ? prev.filter((item) => item != "XL")
                  : [...prev, "XL"]
              )
            }
          >
            <p
              className={`${
                sizes.includes("XL") ? "green-bg" : "bg-slate-200"
              }  cursor-pointer px-3 py-1`}
            >
              XL
            </p>
          </div>
          <div
            onClick={() =>
              setSizes((prev) =>
                prev.includes("XXL")
                  ? prev.filter((item) => item != "XXL")
                  : [...prev, "XXL"]
              )
            }
          >
            <p
              className={`${
                sizes.includes("XXL") ? "green-bg" : "bg-slate-200"
              }  cursor-pointer px-3 py-1`}
            >
              XXL
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
        />
        <label className="cursor-pointer" htmlFor="bestseller">
          BestSeller
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-28 py-3 mt-4 text-white ${
          loading ? "bg-gray-500 cursor-not-allowed" : "bg-black"
        }`}
      >
        {loading ? "Updating..." : "UPDATE"}
      </button>
    </form>
  );
};

export { Update };
