/** When your routing table is too long, you can split it into small modules**/

import Layout from "@/views/layout/Layout";

const productSettingRouter = {
  path: "/productSetting",
  component: Layout,
  redirect: "product-types",
  name: "ProductSetting",
  meta: {
    title: "productSetting",
    icon: "list"
  },
  children: [
    {
      path: "/product-types",
      component: () => import("@/views/product-setting/productTypes"),
      name: "ProductTypes",
      meta: { title: "productTypes" }
    },
    {
      path: "/product-specs",
      component: () => import("@/views/product-setting/productSpecs"),
      name: "ProductSpecs",
      meta: { title: "productSpecs" }
    },
    {
      path: "/product-brands",
      component: () => import("@/views/product-setting/productBrands"),
      name: "ProductBrands",
      meta: { title: "productBrands" }
    }
  ]
};
export default productSettingRouter;
