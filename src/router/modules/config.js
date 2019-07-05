/** When your routing table is too long, you can split it into small modules**/

import Layout from "@/views/layout/Layout";

const configRouter = {
  path: "/config",
  component: Layout,
  redirect: "product-types",
  name: "Config",
  meta: {
    title: "config",
    icon: "list"
  },
  children: [
    {
      path: "/product-types",
      component: () => import("@/views/config/productTypes"),
      name: "ProductTypes",
      meta: { title: "productTypes" }
    },
    {
      path: "/product-specs",
      component: () => import("@/views/config/productSpecs"),
      name: "ProductSpecs",
      meta: { title: "productSpecs" }
    },
    {
      path: "/product-imps",
      component: () => import("@/views/config/productImps"),
      name: "ProductImps",
      meta: { title: "productImps" }
    }
  ]
};
export default configRouter;
