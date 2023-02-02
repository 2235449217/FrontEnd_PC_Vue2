export function getComponentMap (data) {
  const map = new Map();
  for (const item of data) {
    const {
      '__config__': {
        'label': label = '',
        'renderKey': renderKey = '',
        'tag': tag = '',
        'type': type = ''
      },
      '__slot__': {
        'options': options = []
      } = {}
    } = item;
    const obj = {
      label: label,
      renderKey: renderKey, // 唯一标识
      tag: tag, // 决定条件卡片的内容选择形式
      type: type, // 决定条件卡片的条件选项有哪些
      options: options // 如果内容选项为下拉列表时，通过options展示
    };
    obj.judgeList = judgeListMap[obj.type]; // 依照type添加条件列表
    obj.componentFormat = contentTypeMap[obj.tag]; // 依照tag添加内容展示形式
    map.set(obj.renderKey, obj);
  }
  return map;
}
// 依照tag判断
const contentTypeMap = {
  'el-input': 'input',
  'el-textarea': 'input',
  'el-input-number': 'input',
  'el-date-picker': 'date',
  'el-radio-group': 'select',
  'el-checkbox-group': 'select',
  'el-select': 'select',
  'el-cascader': 'tree',
  'el-upload': 'none'
};
// 依照type判断
const judgeListMap = {
  // 单行文本
  '0': [
    { label: '等于', value: 0 },
    { label: '不等于', value: 1 },
    { label: '包含', value: 2 },
    { label: '不包含', value: 3 },
    { label: '为空', value: 4 },
    { label: '不为空', value: 5 }
  ],
  // 多行文本
  '1': [
    { label: '包含', value: 2 },
    { label: '不包含', value: 3 },
    { label: '为空', value: 4 },
    { label: '不为空', value: 5 }
  ],
  // 数字
  '2': [
    { label: '等于', value: 0 },
    { label: '不等于', value: 1 },
    { label: '大于', value: 6 },
    { label: '大于等于', value: 7 },
    { label: '小于', value: 8 },
    { label: '小于等于', value: 9 },
    { label: '选择范围', value: 10 },
    { label: '为空', value: 4 },
    { label: '不为空', value: 5 }
  ],
  // 日期时间
  '3': [
    { label: '等于', value: 0 },
    { label: '不等于', value: 1 },
    { label: '大于等于', value: 7 },
    { label: '小于等于', value: 9 },
    { label: '选择范围', value: 10 },
    { label: '为空', value: 4 },
    { label: '不为空', value: 5 }
  ],
  // 单选按钮组
  '4': [
    { label: '等于', value: 0 },
    { label: '不等于', value: 1 },
    { label: '等于任意一个', value: 11 },
    { label: '不等于任意一个', value: 12 },
    { label: '包含', value: 2 },
    { label: '不包含', value: 3 },
    { label: '为空', value: 4 },
    { label: '不为空', value: 5 }
  ],
  // 复选框组
  '5': [
    { label: '等于', value: 0 },
    { label: '包含任意一个', value: 13 },
    { label: '同时包含', value: 14 },
    { label: '为空', value: 4 },
    { label: '不为空', value: 5 }
  ],
  // 单选列表
  '6': [
    { label: '等于', value: 0 },
    { label: '不等于', value: 1 },
    { label: '等于任意一个', value: 11 },
    { label: '不等于任意一个', value: 12 },
    { label: '包含', value: 2 },
    { label: '不包含', value: 3 },
    { label: '为空', value: 4 },
    { label: '不为空', value: 5 }
  ],
  // 复选列表
  '7': [
    { label: '等于', value: 0 },
    { label: '包含任意一个', value: 13 },
    { label: '同时包含', value: 14 },
    { label: '为空', value: 4 },
    { label: '不为空', value: 5 }
  ],
  // 地址
  '9': [
    { label: '属于', value: 15 },
    { label: '不属于', value: 16 },
    { label: '为空', value: 4 },
    { label: '不为空', value: 5 }
  ],
  // 图片
  '10': [
    { label: '为空', value: 4 },
    { label: '不为空', value: 5 }
  ],
  // 附件
  '11': [
    { label: '为空', value: 4 },
    { label: '不为空', value: 5 }
  ],
  // 手机
  '12': [
    { label: '包含', value: 2 },
    { label: '已验证', value: 17 },
    { label: '未验证', value: 18 },
    { label: '为空', value: 4 },
    { label: '不为空', value: 5 }
  ],
  // 成员单选
  '13': [
    { label: '等于', value: 0 },
    { label: '不等于', value: 1 },
    { label: '等于任意一个', value: 11 },
    { label: '不等于任意一个', value: 12 },
    { label: '为空', value: 4 },
    { label: '不为空', value: 5 }
  ],
  // 成员多选
  '14': [
    { label: '等于', value: 0 },
    { label: '为空', value: 4 },
    { label: '不为空', value: 5 },
    { label: '包含任意一个', value: 13 },
    { label: '同时包含', value: 14 }
  ],
  // 成员单选
  '15': [
    { label: '等于', value: 0 },
    { label: '不等于', value: 1 },
    { label: '等于任意一个', value: 11 },
    { label: '不等于任意一个', value: 12 },
    { label: '为空', value: 4 },
    { label: '不为空', value: 5 }
  ],
  // 部门多选
  '16': [
    { label: '等于', value: 0 },
    { label: '为空', value: 4 },
    { label: '不为空', value: 5 },
    { label: '包含任意一个', value: 13 },
    { label: '同时包含', value: 14 }
  ]
};
// { label: '等于', value: 0 },
// { label: '不等于', value: 1 },
// { label: '包含', value: 2 },
// { label: '不包含', value: 3 },
// { label: '为空', value: 4 },
// { label: '不为空', value: 5 }
// { label: '大于', value: 6 },
// { label: '大于等于', value: 7 },
// { label: '小于', value: 8 },
// { label: '小于等于', value: 9 },
// { label: '选择范围', value: 10 },
// { label: '等于任意一个', value: 11 },
// { label: '不等于任意一个', value: 12 },
// { label: '包含任意一个', value: 13 },
// { label: '同时包含', value: 14 },
// { label: '属于', value: 15 },
// { label: '不属于', value: 16 },
// { label: '已验证', value: 17 },
// { label: '未验证', value: 18 },

