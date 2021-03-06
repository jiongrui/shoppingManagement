import request from "@/utils/request";
const URL_PREFIX = "/shopping/orders";

export function fetchOrderList(query) {
  return request({
    url: `${URL_PREFIX}/list`,
    method: "get",
    params: query
  });
}

export function createOrder(query) {
  return request({
    url: `${URL_PREFIX}/create`,
    method: "post",
    data: query
  });
}

export function updateOrder(query) {
  return request({
    url: `${URL_PREFIX}/update`,
    method: "post",
    data: query
  });
}

export function deleteOrder(query) {
  return request({
    url: `${URL_PREFIX}/delete`,
    method: "get",
    params: query
  });
}

export function searchOrder(query) {
  return request({
    url: `${URL_PREFIX}/search`,
    method: "get",
    params: query
  });
}
