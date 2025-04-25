import request from '@/utils/request'

/**
 * @description Get the list of stocks
 *
 * @export
 * @param
 * @returns {Promise} API response
 */
export async function getStockList() {
  return await request.get('stocks')
}
