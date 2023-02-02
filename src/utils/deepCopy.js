/**
 * 深拷贝
 * @param {*} target 要深拷贝的值
 */
export function deepCopy(target) {
  if (typeof target !== 'object') return target;

  let obj;
  if (!Array.isArray) {
    Array.isArray = function(arg) {
      return Object.prototype.toString.call(arg) === '[object Array];';
    };
  }
  if (Array.isArray(target)) {
    obj = [];
  } else {
    obj = {};
  }
  for (const prop in target) {
    // obj.hasOwnProperty 判断某个对象是否含有指定的属性
    // 该方法会忽略掉从原型链上继承的属性
    if (target.hasOwnProperty(prop)) {
      if (typeof target === 'object') {
        obj[prop] = deepCopy(target[prop]);
      } else {
        obj[prop] = target[prop];
      }
    }
  }
  return obj;
}
