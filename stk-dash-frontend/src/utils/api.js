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

/**
 * @description Get the Details of a specific stock
 *
 * @export
 * @param {string} symbol - The stock symbol
 * @returns {Promise} API response
 */
export async function getStockDetail(symbol) {
  return await request.get(`stocks/${symbol}`)
}
