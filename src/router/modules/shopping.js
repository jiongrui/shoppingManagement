/** When your routing table is too long, you can split it into small modules**/

import Layout from "@/views/layout/Layout";

const shoppingRouter = {
  path: "/shopping",
  component: Layout,
  redirect: "product-list",
  name: "Shopping",
  meta: {
    title: "shopping",
    icon: "shopping"
  },
  children: [
    {
      path: "/product-list",
      component: () => import("@/views/shopping/productList"),
      name: "ProductList",
      meta: { title: "productList" }
    },
    {
      path: "/order-list",
      component: () => import("@/views/shopping/orderList"),
      name: "OrderList",
      meta: { title: "orderList" }
    },
    {
      path: "/customer-list",
      component: () => import("@/views/shopping/customerList"),
      name: "CustomerList",
      meta: { title: "customerList" }
    }
  ]
};
export default shoppingRouter;
