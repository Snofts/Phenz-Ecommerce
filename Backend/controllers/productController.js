import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// function for add product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resourse_type: "image",
        });

        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestseller: bestseller === "true" ? true : false,
      image: imagesUrl,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for list product
const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for remove product
const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;
    await productModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Product removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.body;                     // product id (required)
    if (!id) {
      return res.json({ success: false, message: "Product ID is required" });
    }

    // ---- 1. Gather the fields that can be updated ----
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    // ---- 2. Existing images (kept as-is) ----
    // We will keep the current images array unless a new file is uploaded for that slot
    const existingProduct = await productModel.findById(id);
    if (!existingProduct) {
      return res.json({ success: false, message: "Product not found" });
    }

    // ---- 3. New image files (optional) ----
    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    const newImages = [image1, image2, image3, image4].filter(Boolean);

    // Upload only the new files
    const uploadedUrls = await Promise.all(
      newImages.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    // ---- 4. Build the final image array ----
    // Preserve old URLs for slots that were NOT replaced
    const finalImageArray = existingProduct.image.map((url, idx) => {
      // idx 0 → image1, 1 → image2, etc.
      const newFileForSlot = [image1, image2, image3, image4][idx];
      return newFileForSlot ? uploadedUrls.shift() : url;
    });

    // If any extra new images were sent (e.g., user uploaded 3 new images
    // but only had 2 slots before), append them
    if (uploadedUrls.length) {
      finalImageArray.push(...uploadedUrls);
    }

    // ---- 5. Prepare update object (only fields that were sent) ----
    const updateData = {
      ...(name && { name }),
      ...(description && { description }),
      ...(price && { price: Number(price) }),
      ...(category && { category }),
      ...(subCategory && { subCategory }),
      ...(sizes && { sizes: JSON.parse(sizes) }),
      ...(bestseller !== undefined && {
        bestseller: bestseller === "true" ? true : false,
      }),
      image: finalImageArray,
    };

    // ---- 6. Perform the update ----
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export { addProduct, listProduct, singleProduct, removeProduct, updateProduct };
