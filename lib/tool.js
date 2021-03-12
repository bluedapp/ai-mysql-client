/**
 * 获取特定范围内的数
 * @param   {string} len  特定长度
 * @example getRandomSubscript(5)
 */
function getRandomSubscript(len) {
  return Math.floor(Math.random() * len + 1) - 1
}

/**
 * 判断值的类型
 * @param   {object} param  需要判断的值
 * @param   {string} type   类型
 * @example checkType([])
 */
function checkType(param, type) {
  return Object.prototype.toString.call(param) === `[object ${type}]`
}

module.exports = {
  checkType,
  getRandomSubscript,
}