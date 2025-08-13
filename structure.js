// create-structure.js
const fs = require("fs");
const path = require("path");

const structure = {
  app: {
    "(auth)": {
      "sign-in": { "page.tsx": "" },
      "sign-up": { "page.tsx": "" }
    },
    admin: {
      "layout.tsx": "",
      "page.tsx": "",
      products: {
        "page.tsx": "",
        "[id]": { "page.tsx": "" }
      },
      categories: {
        "page.tsx": "",
        "[id]": { "page.tsx": "" }
      },
      orders: {
        "page.tsx": "",
        "[id]": { "page.tsx": "" }
      }
    },
    api: {
      products: {
        "route.ts": "",
        "[id]": { "route.ts": "" }
      },
      categories: {
        "route.ts": "",
        "[id]": { "route.ts": "" }
      },
      cart: {
        "route.ts": "",
        items: {
          "route.ts": "",
          "[id]": { "route.ts": "" }
        }
      },
      orders: {
        "route.ts": "",
        "[id]": { "route.ts": "" }
      }
    },
    cart: { "page.tsx": "" },
    category: { "[slug]": { "page.tsx": "" } },
    checkout: { "page.tsx": "" },
    orders: { "page.tsx": "", "[id]": { "page.tsx": "" } },
    product: { "[slug]": { "page.tsx": "" } },
    "layout.tsx": "",
    "page.tsx": ""
  },
  components: {
    ui: {
      "button.tsx": "",
      "input.tsx": "",
      "label.tsx": "",
      "textarea.tsx": "",
      "select.tsx": "",
      "badge.tsx": "",
      "card.tsx": "",
      "table.tsx": "",
      "dialog.tsx": "",
      "sheet.tsx": "",
      "form.tsx": "",
      "toast.tsx": "",
      "toaster.tsx": "",
      "skeleton.tsx": ""
    },
    layout: { "navbar.tsx": "", "footer.tsx": "" },
    products: {
      "product-card.tsx": "",
      "product-grid.tsx": "",
      "product-filters.tsx": ""
    },
    cart: { "cart-item.tsx": "", "cart-summary.tsx": "" }
  },
  lib: {
    supabase: { "client.ts": "", "server.ts": "" },
    auth: { "helpers.ts": "" },
    cache: { "redis.ts": "" },
    email: { "service.ts": "" },
    "rate-limit": { "middleware.ts": "" },
    schemas: {
      "product.ts": "",
      "category.ts": "",
      "cart.ts": "",
      "order.ts": ""
    },
    "utils.ts": ""
  },
  types: { "supabase.ts": "", "index.ts": "" },
  styles: { "globals.css": "" },
  sql: { "001_init.sql": "", "002_seed.sql": "" },
  public: { "favicon.ico": "" },
  "middleware.ts": "",
  "package.json": "",
  "tsconfig.json": "",
  "next.config.mjs": "",
  "tailwind.config.ts": "",
  "postcss.config.js": "",
  ".gitignore": "",
  ".env.local.example": "",
  "README.md": ""
};

// Recursive function to create folders & files
function createStructure(basePath, obj) {
  for (const name in obj) {
    const fullPath = path.join(basePath, name);
    if (typeof obj[name] === "string") {
      fs.writeFileSync(fullPath, obj[name]);
    } else {
      fs.mkdirSync(fullPath, { recursive: true });
      createStructure(fullPath, obj[name]);
    }
  }
}

// Run
createStructure(process.cwd(), structure);
console.log("✅ Project structure created successfully!");
