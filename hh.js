// filestructure.js
// Script to generate the full MERN E-Commerce project structure

const fs = require("fs");
const path = require("path");

const structure = {
  "ecommerce-mern": {
    "package.json": "",
    "README.md": "",
    ".gitignore": "",
    "server": {
      "package.json": "",
      ".env.example": "",
      "server.js": "",
      "src": {
        "config": {
          "db.js": "",
          "cloudinary.js": ""
        },
        "models": {
          "User.js": "",
          "Product.js": "",
          "Order.js": ""
        },
        "controllers": {
          "authController.js": "",
          "productController.js": "",
          "orderController.js": "",
          "uploadController.js": ""
        },
        "routes": {
          "authRoutes.js": "",
          "productRoutes.js": "",
          "orderRoutes.js": "",
          "uploadRoutes.js": ""
        },
        "middleware": {
          "authMiddleware.js": "",
          "errorMiddleware.js": ""
        },
        "utils": {
          "generateToken.js": ""
        },
        "seed": {
          "seed.js": ""
        }
      }
    },
    "client": {
      "package.json": "",
      ".env.example": "",
      "tailwind.config.js": "",
      "postcss.config.js": "",
      "public": {
        "index.html": "",
        "favicon.ico": "",
        "manifest.json": "",
        "robots.txt": ""
      },
      "src": {
        "index.js": "",
        "index.css": "",
        "App.js": "",
        "api": {
          "axios.js": ""
        },
        "app": {
          "store.js": ""
        },
        "features": {
          "user": {
            "userSlice.js": ""
          },
          "cart": {
            "cartSlice.js": ""
          },
          "order": {
            "orderSlice.js": ""
          }
        },
        "components": {
          "Navbar.js": "",
          "Footer.js": "",
          "ProductCard.js": "",
          "ImageUpload.js": "",
          "Loader.js": "",
          "PrivateRoute.js": "",
          "AdminRoute.js": ""
        },
        "pages": {
          "Home.js": "",
          "Products.js": "",
          "ProductDetails.js": "",
          "Cart.js": "",
          "Checkout.js": "",
          "Orders.js": "",
          "Login.js": "",
          "Register.js": "",
          "admin": {
            "AdminDashboard.js": "",
            "ProductManagement.js": "",
            "ProductForm.js": "",
            "OrderManagement.js": ""
          }
        }
      }
    }
  }
};

// recursive function to create folders and files
function createStructure(base, obj) {
  for (const name in obj) {
    const targetPath = path.join(base, name);
    if (typeof obj[name] === "string") {
      fs.writeFileSync(targetPath, obj[name]);
    } else {
      fs.mkdirSync(targetPath, { recursive: true });
      createStructure(targetPath, obj[name]);
    }
  }
}

// Run
createStructure(".", structure);

console.log("✅ Project structure created successfully!");
