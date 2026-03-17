const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔌 Kết nối MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/shopdb")
  .then(() => console.log("✅ Kết nối MongoDB thành công"))
  .catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));

// 🛍️ Schema + Model
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String
});
const Product = mongoose.model("Product", productSchema);

// 📦 API trả danh sách sản phẩm
app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// ⚙️ Chạy server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));
