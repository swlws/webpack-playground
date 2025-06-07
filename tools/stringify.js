const formatter = (key, value) => {
  // null 保持原样
  if (value === null) return null;

  // 保留 Array 和普通 Object 的原始序列化方式
  if (Array.isArray(value)) return value;
  if (Object.prototype.toString.call(value) === '[object Object]') return value;

  // 处理特殊类型
  const type = Object.prototype.toString.call(value);

  switch (type) {
    case '[object Function]':
      return `[Function: ${value.name || 'anonymous'}]`;
    case '[object Map]':
      return `[Map(${value.size})]`;
    case '[object Set]':
      return `[Set(${value.size})]`;
    case '[object Date]':
      return `[Date: ${value.toISOString()}]`;
    case '[object RegExp]':
      return `[RegExp: ${value.toString()}]`;
    case '[object Symbol]':
      return `[Symbol: ${value.toString()}]`;
    case '[object BigInt]':
      return `[BigInt: ${value.toString()}]`;
  }

  // 其他非 Object 构造的自定义类
  if (
    typeof value === 'object' &&
    value.constructor &&
    value.constructor !== Object
  ) {
    return `[${value.constructor.name}]`;
  }

  return value;
};

/**
 * 自定义 JSON.stringify 函数，处理特殊类型
 * @param {*} obj
 * @returns
 */
function customStringify(obj) {
  return JSON.stringify(obj, formatter, 2);
}

exports.customStringify = customStringify;
