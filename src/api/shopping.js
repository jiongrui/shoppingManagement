import request from '@/utils/request'

export function queryList(query) {
  return request({
    url: '/shopping/products',
    method: 'get',
    params: query
  })
}
