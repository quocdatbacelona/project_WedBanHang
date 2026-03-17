// Địa chỉ file: server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();
app.use(cors());
app.use(express.json());

// Cho phép truy cập thư mục ảnh tĩnh
app.use("/img", express.static(path.join(__dirname, "public/img")));

// 🔌 Kết nối MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/shop")
  .then(() => console.log("✅ Kết nối MongoDB thành công"))
  .catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));

// 🛍️ Schema + Model (Sản phẩm)
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  category: String,
  isFeatured: Boolean,
  description: String 
});
const Product = mongoose.model("Product", productSchema);



// --- 1. Tạo Model Settings ---
const settingSchema = new mongoose.Schema({
  general: {
    storeName: String,
    phone: String,
    email: String,
    address: String,
    logo: String,
    description: String,
    facebook: String,
    website: String
  },
  payment: {
    shippingFee: Number,
    freeShipThreshold: Number,
    bankName: String,
    bankNumber: String,
    bankOwner: String
  }
});
const Setting = mongoose.model("Setting", settingSchema);

// --- 2. API Lấy cấu hình (GET) ---
app.get("/api/settings", async (req, res) => {
  try {
    // Tìm bản ghi đầu tiên, nếu chưa có thì trả về rỗng
    const settings = await Setting.findOne();
    res.json(settings || {});
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// --- 3. API Lưu cấu hình (PUT) ---
app.put("/api/settings", async (req, res) => {
  try {
    const updateData = req.body; // Dữ liệu gửi lên (có thể là general hoặc payment)
    
    // Dùng findOneAndUpdate với option { upsert: true }
    // Nghĩa là: Tìm bản ghi đầu tiên, nếu thấy thì update, không thấy thì tạo mới
    const settings = await Setting.findOneAndUpdate(
      {}, 
      { $set: updateData }, // Chỉ update trường được gửi lên
      { new: true, upsert: true } 
    );
    
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lưu cài đặt" });
  }
});


// 👤 Sửa: SCHEMA + MODEL (Người dùng) - Đã thêm 'cart'
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: "customer" }, 
  fullName: String, 
  address: String,  
  city: String,     
  
  
  // 1. THÊM TRƯỜNG NÀY:
  cart: [
    {
      productId: { type: String, required: true },
      name: String,
      price: Number,
      image: String,
      quantity: { type: Number, required: true, min: 1, default: 1 }
    }
  ]
});
const User = mongoose.model("User", userSchema);


// ===================================
// 🛒 API SẢN PHẨM (Code cũ của bạn)
// ===================================


// Gợi ý cho server.js (API GET products)
app.get("/api/products", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || ""; 
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } }, 
          { TenSP: { $regex: search, $options: "i" } } 
        ]
      };
    }

    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query); 

    res.json({
      data: products,
      pagination: {
        total: total,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// 🌟 API: sản phẩm nổi bật
app.get("/api/products/featured", async (req, res) => {
  const featured = await Product.find({ isFeatured: true });
  res.json(featured);
});

app.put("/api/users/profile", async (req, res) => {
  try {
    const { userId, fullName, phone, address, city } = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { fullName, phone, address, city },
      { new: true } // Trả về user mới
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    // Trả về user mới để frontend cập nhật AuthContext
    res.json({ 
      message: "Cập nhật thành công",
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        cart: user.cart,
        fullName: user.fullName,
        address: user.address,
        city: user.city
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// API: Xóa người dùng theo ID
app.delete("/api/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // 1. Kiểm tra xem user có tồn tại không
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    if (user.role === 'admin' && user.email === 'admin@gmail.com') {
       return res.status(400).json({ message: "Không thể xóa tài khoản Admin gốc" });
    }

    // 3. Thực hiện xóa
    await User.findByIdAndDelete(userId);

    res.json({ message: "Đã xóa người dùng thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi Server", error: err.message });
  }
});

// 🆔 API: chi tiết 1 sản phẩm
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server hoặc ID không hợp lệ" });
  }
});


// ===================================
// 👤 API NGƯỜI DÙNG (Code mới)
// ===================================

// 📝 API: Đăng Ký (Register)
app.post("/api/register", async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email này đã được sử dụng." });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = new User({
      email,
      phone,
      password: hashedPassword,
      cart: [] // ⬅️ Thêm: Khởi tạo giỏ hàng rỗng
    });
    
    await newUser.save();
    
    res.status(201).json({ message: "Đăng ký tài khoản thành công!" });

  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// 🔑 Sửa: API Đăng Nhập (Login) - Đã thêm 'cart'
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email hoặc mật khẩu không đúng." });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Email hoặc mật khẩu không đúng." });
    }
    
    // 3. Đăng nhập thành công - Trả về giỏ hàng
   res.status(200).json({ 
      message: "Đăng nhập thành công!",
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        cart: user.cart,
        role: user.role , // ⬅️ THÊM DÒNG NÀY
        fullName: user.fullName, 
    address: user.address,
    city: user.city
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// ===================================
// 🛒 API GIỎ HÀNG (API MỚI)
// ===================================
// (Thêm 3 API mới này vào)

// 1. LẤY GIỎ HÀNG (GET)
app.get("/api/cart/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// 2. THÊM VÀO GIỎ HÀNG (POST)
app.post("/api/cart/add", async (req, res) => {
  try {
    const { userId, product } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    const existingItem = user.cart.find(item => item.productId === product._id);

    if (existingItem) {
      existingItem.quantity += 1; // Tăng số lượng
    } else {
      user.cart.push({ // Thêm mới
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }

    await user.save(); // Lưu lại user
    res.status(200).json(user.cart); // Trả về giỏ hàng mới
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// 3. XÓA KHỎI GIỎ HÀNG (DELETE)
app.delete("/api/cart/remove", async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    user.cart = user.cart.filter(item => item.productId !== productId);

    await user.save(); // Lưu lại user
    res.status(200).json(user.cart); // Trả về giỏ hàng mới
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});
app.post("/api/cart/increase", async (req, res) => {
  try {
    const { userId, productId } = req.body;
    // Dùng $inc (increment) của MongoDB để tăng quantity lên 1
    const user = await User.findOneAndUpdate(
      { _id: userId, "cart.productId": productId },
      { $inc: { "cart.$.quantity": 1 } },
      { new: true } // Trả về document đã cập nhật
    );
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy" });
    }
    res.status(200).json(user.cart);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// 5. GIẢM SỐ LƯỢNG (POST)
app.post("/api/cart/decrease", async (req, res) => {
  try {
    const { userId, productId } = req.body;
    
    // Tìm user và item
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    const itemInCart = user.cart.find(item => item.productId === productId);
    if (!itemInCart) return res.status(404).json({ message: "Không tìm thấy item" });

    // Nếu số lượng > 1, thì giảm
    if (itemInCart.quantity > 1) {
      itemInCart.quantity -= 1;
    } else {
      // Nếu số lượng = 1, thì xóa luôn (giống như bấm nút Xóa)
      user.cart = user.cart.filter(item => item.productId !== productId);
    }

    await user.save();
    res.status(200).json(user.cart);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// ➕ API: Thêm 1 sản phẩm mới (POST)
app.post("/api/products", async (req, res) => {
  try {
    // 1. Lấy dữ liệu từ form (frontend) gửi lên
    const { name, price, image, category, description, isFeatured } = req.body;

    // 2. Kiểm tra dữ liệu (bạn có thể thêm validation ở đây)
    if (!name || !price || !image || !category) {
      return res.status(400).json({ message: "Vui lòng nhập đủ các trường bắt buộc" });
    }

    // 3. Tạo sản phẩm mới
    const newProduct = new Product({
      name,
      price,
      image,
      category,
      description,
      isFeatured: isFeatured || false, // Mặc định là false
    });

    // 4. Lưu vào MongoDB
    await newProduct.save();

    res.status(201).json({ message: "Thêm sản phẩm thành công!", product: newProduct });

  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, image, category, description, isFeatured } = req.body;

    // 1. Tìm và cập nhật sản phẩm
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        price,
        image,
        category,
        description,
        isFeatured,
      },
      { new: true } // 'new: true' để trả về document đã được cập nhật
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.status(200).json({ message: "Cập nhật sản phẩm thành công!", product: updatedProduct });

  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// ❌ API: Xóa 1 sản phẩm (DELETE)
app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.status(200).json({ message: "Xóa sản phẩm thành công!" });

  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// 1. 📰 SCHEMA: TIN TỨC (NEWS)
const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true }, // Đường dẫn ảnh
  description: { type: String, required: true }, // Mô tả ngắn
  content: { type: String, required: true }, // Nội dung chi tiết (HTML hoặc text dài)
  createdAt: { type: Date, default: Date.now }
});
const News = mongoose.model("News", newsSchema);
// 1. 🏷️ SCHEMA: MÃ GIẢM GIÁ (COUPON)
const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true }, // VD: SALE50
  discountType: { type: String, enum: ['percent', 'amount'], default: 'percent' }, // % hoặc số tiền
  discountValue: { type: Number, required: true }, // 10 (%) hoặc 50000 (vnđ)
  minOrderValue: { type: Number, default: 0 }, // Đơn tối thiểu để dùng
  expiryDate: { type: Date, required: true }, // Ngày hết hạn
  usageLimit: { type: Number, default: 100 }, // Số lần dùng tối đa
  usedCount: { type: Number, default: 0 }, // Số lần đã dùng
  isActive: { type: Boolean, default: true }
});
const Coupon = mongoose.model("Coupon", couponSchema);
// 🧾 SCHEMA + MODEL (Đơn hàng)
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: String, required: true },
      name: String,
      price: Number,
      image: String,
      quantity: { type: Number, required: true }
    }
  ],
  totalPrice: { type: Number, required: true }, // Giá gốc
  
  // SỬA LẠI ĐÚNG CÚ PHÁP TYPE:
  couponCode: { type: String, default: "" },      
  discountAmount: { type: Number, default: 0 },   
  finalPrice: { type: Number, required: true },   

  status: { type: String, required: true, default: "Pending" },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, required: true, default: "Unpaid" },
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model("Order", orderSchema);

// API: Lấy danh sách coupons (Có Search theo code & Pagination)
app.get("/api/coupons", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5; // Mặc định 5 nếu không truyền
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    // Tìm kiếm theo code (không phân biệt hoa thường)
    let query = {};
    if (search) {
      query = { code: { $regex: search, $options: "i" } };
    }

    const coupons = await Coupon.find(query)
      .sort({ createdAt: -1 }) // Mới nhất lên đầu
      .skip(skip)
      .limit(limit);

    const total = await Coupon.countDocuments(query);

    res.json({
      data: coupons,
      pagination: {
        total: total,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now } // Ngày gửi
});
const Contact = mongoose.model("Contact", contactSchema);

// 2. ADMIN: Tạo Coupon mới
app.post("/api/coupons", async (req, res) => {
  try {
    const newCoupon = new Coupon(req.body);
    await newCoupon.save();
    res.status(201).json(newCoupon);
  } catch (err) {
    res.status(400).json({ message: "Mã giảm giá đã tồn tại hoặc lỗi dữ liệu" });
  }
});

// 3. ADMIN: Xóa Coupon
app.delete("/api/coupons/:id", async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa mã giảm giá" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.post("/api/coupons/apply", async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    
    // Tìm mã
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    // Kiểm tra các điều kiện
    if (!coupon) return res.status(404).json({ message: "Mã giảm giá không tồn tại!" });
    if (new Date() > coupon.expiryDate) return res.status(400).json({ message: "Mã này đã hết hạn!" });
    if (coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ message: "Mã này đã hết lượt dùng!" });
    if (cartTotal < coupon.minOrderValue) return res.status(400).json({ message: `Đơn hàng tối thiểu phải từ ${coupon.minOrderValue.toLocaleString()}đ` });

    // Tính toán số tiền giảm
    let discountAmount = 0;
    if (coupon.discountType === 'percent') {
      discountAmount = (cartTotal * coupon.discountValue) / 100;
      // Có thể thêm giới hạn giảm tối đa (VD: giảm 10% nhưng tối đa 50k) nếu muốn
    } else {
      discountAmount = coupon.discountValue;
    }

    // Trả về kết quả cho Client
    res.json({
      success: true,
      discountAmount: discountAmount,
      code: coupon.code,
      message: "Áp dụng mã thành công!"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// 💳 API: TIẾN HÀNH THANH TOÁN (Checkout)
// 💳 API: TIẾN HÀNH THANH TOÁN (Lấy địa chỉ từ Profile)
// 💳 API: TIẾN HÀNH THANH TOÁN (Lấy địa chỉ từ Profile và Phương thức)
app.post("/api/checkout", async (req, res) => {
  try {
    // 1. Nhận thêm couponCode và discountAmount từ Frontend gửi lên
    const { userId, paymentMethod, couponCode, discountAmount } = req.body;

    const user = await User.findById(userId);
    if (!user || !user.cart || user.cart.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng rỗng hoặc user không tồn tại" });
    }
    if (!user.address || !user.phone) {
      return res.status(400).json({ message: "Vui lòng cập nhật địa chỉ giao hàng" });
    }

    // 2. Tính toán giá
    const totalPrice = user.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Validate tiền giảm giá (tránh lỗi null/undefined)
    const safeDiscount = discountAmount || 0;
    // Tính giá cuối cùng
    const finalPrice = (totalPrice - safeDiscount) > 0 ? (totalPrice - safeDiscount) : 0;

    // 3. Logic trạng thái
    let orderStatus = "Pending";
    let paymentStatus = "Unpaid";

    if (paymentMethod === "Cash") {
      orderStatus = "Processing"; 
      paymentStatus = "Unpaid"; 
    } else if (paymentMethod === "Transfer") {
      orderStatus = "Pending"; 
      paymentStatus = "Pending";
    }

    // 4. Tạo đơn hàng
    const newOrder = new Order({
      userId: user._id,
      items: user.cart,
      totalPrice: totalPrice, // Giá gốc
      couponCode: couponCode || "", // Mã giảm giá (nếu có)
      discountAmount: safeDiscount, // Tiền giảm
      finalPrice: finalPrice, // Giá thực trả
      status: orderStatus,
      paymentMethod: paymentMethod,
      paymentStatus: paymentStatus,
      shippingAddress: {
        fullName: user.fullName || user.email,
        phone: user.phone,
        address: user.address,
        city: user.city || "Việt Nam"
      }
    });

    // Nếu có mã giảm giá, tăng lượt sử dụng
    if (couponCode) {
      await Coupon.findOneAndUpdate({ code: couponCode }, { $inc: { usedCount: 1 } });
    }

    await newOrder.save();

    // 5. Xóa giỏ hàng
    user.cart = [];
    await user.save();

    res.status(201).json({ message: "Đặt hàng thành công!", order: newOrder, updatedCart: user.cart });

  } catch (err) {
    console.error("Lỗi Checkout:", err); 
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// Gợi ý server.js (API GET orders)
app.get("/api/orders", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      // Logic tìm kiếm cơ bản
      // Nếu search là mã đơn (24 ký tự hex), tìm chính xác _id
      if (search.match(/^[0-9a-fA-F]{24}$/)) {
         query = { _id: search };
      } else {
         // Tìm theo các trường khác (Cần cấu trúc dữ liệu ShippingAddress để query sâu)
         // Ví dụ tìm theo tên người nhận hoặc số điện thoại
         query = {
            $or: [
                { "shippingAddress.fullName": { $regex: search, $options: "i" } },
                { "shippingAddress.phone": { $regex: search, $options: "i" } }
            ]
         };
      }
    }

    const orders = await Order.find(query)
      .populate('userId', 'email fullName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    res.json({
      data: orders,
      pagination: {
        total: total,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// 2. ADMIN: CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (PUT)
app.put("/api/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
   const { status, paymentStatus } = req.body; // Chỉ cần nhận 'status' mới

    if (!status) {
      return res.status(400).json({ message: "Thiếu trạng thái (status)" });
    }

    let updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: status }, // ⬅️ Cập nhật trạng thái mới
      { new: true } // Trả về document đã cập nhật
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res.status(200).json(updatedOrder);

  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

app.get("/api/orders/my-orders/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    // Tìm đơn hàng có userId trùng khớp
    const orders = await Order.find({ userId: userId })
                             .sort({ createdAt: -1 }); // Mới nhất lên đầu
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});


// ... (API Login, Register, Products...)

// 🔐 API: ĐỔI MẬT KHẨU
app.put("/api/users/password", async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    // 1. Tìm user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

    // 2. Kiểm tra mật khẩu cũ có đúng không
    // (Lưu ý: Nếu user đăng nhập bằng Google thì user.password có thể null, cần xử lý riêng nếu muốn)
    if (user.password) {
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });
        }
    }

    // 3. Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 4. Cập nhật
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Đổi mật khẩu thành công!" });

  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});


app.get("/api/dashboard/stats", async (req, res) => {
  try {
    // 1. Đếm tổng số sản phẩm
    const totalProducts = await Product.countDocuments();
    
    // 2. Đếm tổng số người dùng (trừ admin ra)
    const totalUsers = await User.countDocuments({ role: "customer" });
    
    // 3. Đếm tổng số đơn hàng
    const totalOrders = await Order.countDocuments();

    // 4. Tính tổng doanh thu (Chỉ tính các đơn đã giao thành công 'Delivered')
    // Dùng aggregation pipeline của MongoDB để tính tổng nhanh
    const revenueData = await Order.aggregate([
      { $match: { status: "Delivered" } }, // Lọc đơn đã giao
      { $group: { _id: null, total: { $sum: "$totalPrice" } } } // Cộng tổng tiền
    ]);
    
    // Nếu chưa có đơn nào Delivered thì revenue = 0
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // Trả về kết quả
    res.json({
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue
    });

  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// API: Lấy danh sách Users (Search + Pagination)
app.get("/api/users", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    // Tìm kiếm: Tên, Email hoặc Số điện thoại
    let query = {};
    if (search) {
      query = {
        $or: [
          { fullName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } }
        ]
      };
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 }) // Mới nhất lên đầu
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      data: users,
      pagination: {
        total: total,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

app.get("/api/orders/detail/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'email fullName phone address city'); // ⬅️ Lấy tất cả thông tin liên hệ
    
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});


// ... (Các API khác giữ nguyên)

// 📊 API: Lấy dữ liệu biểu đồ doanh thu (7 ngày gần nhất)
app.get("/api/dashboard/chart", async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const revenueData = await Order.aggregate([
      { 
        $match: { 
          createdAt: { $gte: sevenDaysAgo }, // Lấy đơn trong 7 ngày qua
          status: { $ne: "Cancelled" } // Không tính đơn hủy
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%d/%m", date: "$createdAt" } }, // Nhóm theo ngày (VD: 30/11)
          total: { $sum: "$totalPrice" } // Cộng tổng tiền
        }
      },
      { $sort: { _id: 1 } } // Sắp xếp tăng dần theo ngày
    ]);

    res.json(revenueData);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});



app.post("/api/contacts", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    // Validate cơ bản
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();

    res.status(201).json({ message: "Gửi liên hệ thành công!", contact: newContact });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// API: Lấy danh sách liên hệ (Có Search & Pagination)
app.get("/api/contacts", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    // Logic tìm kiếm: Tìm trong Tên, Email hoặc Số điện thoại
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } }
        ]
      };
    }

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 }) // Mới nhất lên đầu
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments(query);

    res.json({
      data: contacts,
      pagination: {
        total: total,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// 3. ADMIN: Xóa liên hệ
app.delete("/api/contacts/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa tin nhắn liên hệ" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});



app.get("/api/news", async (req, res) => {
  try {
    const newsList = await News.find().sort({ createdAt: -1 });
    res.json(newsList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Lấy chi tiết 1 bài viết
app.get("/api/news/:id", async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: "Bài viết không tồn tại" });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. ADMIN: Thêm bài viết
app.post("/api/news", async (req, res) => {
  try {
    const newNews = new News(req.body);
    await newNews.save();
    res.status(201).json(newNews);
  } catch (err) {
    res.status(400).json({ message: "Lỗi dữ liệu" });
  }
});

// 4. ADMIN: Sửa bài viết
app.put("/api/news/:id", async (req, res) => {
  try {
    const updatedNews = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedNews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 5. ADMIN: Xóa bài viết
app.delete("/api/news/:id", async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa bài viết" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


const genAI = new GoogleGenerativeAI("AIzaSyBwja1t03RM5OTNzXpNgX6kcrfosP0bBRU"); // Nhớ giữ bảo mật key nhé!

app.post("/api/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        // 1. LẤY DỮ LIỆU TỪ DATABASE
        const products = await Product.find({}).limit(50); 
        
        // 2. BIẾN DATA THÀNH ĐOẠN TEXT CHO AI ĐỌC (Lấy thêm cái hình ảnh)
        const productInfo = products.map(p => {
            const name = p.name || p.TenSP;
            const price = p.price || p.Gia;
            const img = p.image || (p.sanpham_hinhanh && p.sanpham_hinhanh[0]?.DuongDan) || "";
            return `- Tên: ${name} | Giá: ${price}đ | Link_Ảnh: ${img}`;
        }).join("\n");

        // 3. MỚM DỮ LIỆU & ÉP KIỂU JSON
        const prompt = `Bạn là nhân viên CSKH của siêu thị thực phẩm GreenPlus/FreshFood. 
        🔴 ĐÂY LÀ DANH SÁCH SẢN PHẨM:
        ${productInfo}

        🔴 QUY TẮC QUAN TRỌNG: 
        Bạn PHẢI trả lời MỌI tin nhắn bằng MỘT chuỗi JSON hợp lệ với cấu trúc sau:
        {
          "text": "Câu trả lời của bạn (ngắn gọn, xưng mình-bạn)",
          "hasProduct": true hoặc false (true nếu bạn đang giới thiệu 1 món cụ thể có trong danh sách),
          "productName": "Tên sản phẩm (nếu có, nếu không để trống)",
          "productPrice": Giá tiền (số, nếu không có để 0),
          "productImage": "Link_Ảnh của sản phẩm (nếu có, nếu không để rỗng)"
        }

        Tuyệt đối KHÔNG in ra thêm bất kỳ chữ nào khác ngoài đoạn JSON trên, kể cả chữ \`\`\`json.
        
        Khách vừa hỏi: "${userMessage}"`;

        // 4. GỬI CHO GOOGLE GEMINI 
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 
        const result = await model.generateContent(prompt);
        let aiReplyText = result.response.text();

        // Xóa sạch các dấu ```json thừa nếu AI bị lú
        aiReplyText = aiReplyText.replace(/```json/g, "").replace(/```/g, "").trim();

        // Cố gắng dịch nó ra thành JSON thật
        let aiResponseJson;
        try {
            aiResponseJson = JSON.parse(aiReplyText);
        } catch (e) {
            // Nếu lỡ AI trả lời sai form, fallback về dạng text bình thường
            aiResponseJson = { text: aiReplyText, hasProduct: false };
        }

        // Trả nguyên cục JSON đó về cho Frontend
        res.json(aiResponseJson);

    } catch (error) {
        console.error("❌ LỖI GỌI GEMINI:", error);
        res.status(500).json({ text: "Xin lỗi, hệ thống AI đang bận cập nhật dữ liệu.", hasProduct: false });
    }
});


// ⚙️ Chạy server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));