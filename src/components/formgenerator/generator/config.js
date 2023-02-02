// 下载到本地的地址依赖。
import { regionData } from 'element-china-area-data';
// 表单属性【右面板】
export const formConf = {
  formRef: 'elForm',
  formModel: 'formData',
  size: 'medium',
  labelPosition: 'right',
  labelWidth: 100,
  formRules: 'rules',
  // gutter：栅格布局中单元格左右padding之和
  gutter: 15,
  disabled: false,
  span: 24,
  formBtns: true
};

// 输入型组件 【左面板】【基础字段】
export const inputComponents = [
  {
    // 组件的自定义配置
    __config__: {
      label: '单行文本',
      labelWidth: null,
      showLabel: true,
      changeTag: true,
      tag: 'el-input',
      // tagIcon要设置成唯一的，后端将这个字段判断为唯一字段去用了
      tagIcon: 'input',
      defaultValue: undefined,
      required: true,
      layout: 'colFormItem',
      span: 24,
      document: 'https://element.eleme.cn/#/zh-CN/component/input',
      // 正则校验规则
      regList: [],
      typeNumber: 0
    },
    // 组件的插槽属性
    __slot__: {
      prepend: '',
      append: ''
    },
    // 其余的为可直接写在组件标签上的属性
    placeholder: '请输入',
    style: { width: '100%' },
    clearable: true,
    'prefix-icon': '',
    'suffix-icon': '',
    // 最多输入
    maxlength: null,
    'show-word-limit': false,
    readonly: false,
    disabled: false
  },
  {
    __config__: {
      label: '多行文本',
      labelWidth: null,
      showLabel: true,
      tag: 'el-input',
      tagIcon: 'textarea',
      defaultValue: undefined,
      required: true,
      layout: 'colFormItem',
      span: 24,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/input',
      typeNumber: 1
    },
    type: 'textarea',
    placeholder: '请输入',
    autosize: {
      minRows: 4,
      maxRows: 4
    },
    style: { width: '100%' },
    maxlength: null,
    'show-word-limit': false,
    readonly: false,
    disabled: false
  },
  {
    __config__: {
      label: '数字',
      labelWidth: null,
      showLabel: true,
      changeTag: true,
      tag: 'el-input',
      tagIcon: 'number',
      defaultValue: undefined,
      required: true,
      layout: 'colFormItem',
      span: 24,
      document: 'https://element.eleme.cn/#/zh-CN/component/input',
      regList: [],
      typeNumber: 2
    },
    __slot__: {
      prepend: '',
      append: ''
    },
    placeholder: '请输入',
    style: { width: '100%' },
    clearable: true,
    'prefix-icon': '',
    'suffix-icon': '',
    'show-word-limit': false,
    readonly: false,
    disabled: false,
    type: 'number'
  },
  {
    __config__: {
      label: '日期时间',
      tag: 'el-date-picker',
      tagIcon: 'date',
      defaultValue: null,
      showLabel: true,
      labelWidth: null,
      span: 24,
      layout: 'colFormItem',
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/date-picker',
      typeNumber: 3
    },
    placeholder: '请选择',
    type: 'date',
    style: { width: '100%' },
    disabled: false,
    clearable: true,
    format: 'yyyy-MM-dd',
    'value-format': 'yyyy-MM-dd',
    readonly: false
  },
  {
    __config__: {
      label: '单选按钮组',
      labelWidth: null,
      showLabel: true,
      tag: 'el-radio-group',
      tagIcon: 'radio',
      changeTag: true,
      defaultValue: undefined,
      layout: 'colFormItem',
      span: 24,
      optionType: 'default',
      regList: [],
      required: true,
      border: false,
      document: 'https://element.eleme.cn/#/zh-CN/component/radio',
      typeNumber: 4
    },
    __slot__: {
      options: [{
        label: '选项一',
        value: 1
      }, {
        label: '选项二',
        value: 2
      }]
    },
    style: {},
    size: 'medium',
    disabled: false
  },
  {
    __config__: {
      label: '复选框组',
      tag: 'el-checkbox-group',
      tagIcon: 'checkbox',
      defaultValue: [],
      span: 24,
      showLabel: true,
      labelWidth: null,
      layout: 'colFormItem',
      optionType: 'default',
      required: true,
      regList: [],
      changeTag: true,
      border: false,
      document: 'https://element.eleme.cn/#/zh-CN/component/checkbox',
      typeNumber: 5
    },
    __slot__: {
      options: [{
        label: '选项一',
        value: 1
      }, {
        label: '选项二',
        value: 2
      }]
    },
    style: {},
    size: 'medium',
    min: null,
    max: null,
    disabled: false
  },
  {
    __config__: {
      label: '下拉框',
      showLabel: true,
      labelWidth: null,
      tag: 'el-select',
      tagIcon: 'select',
      layout: 'colFormItem',
      span: 24,
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/select',
      typeNumber: 6
    },
    __slot__: {
      options: [{
        label: '选项一',
        value: 1
      }, {
        label: '选项二',
        value: 2
      }]
    },
    placeholder: '请选择',
    style: { width: '100%' },
    clearable: true,
    disabled: false,
    filterable: false,
    multiple: false
  },
  {
    __config__: {
      label: '下拉复选框',
      showLabel: true,
      labelWidth: null,
      tag: 'el-select',
      // 如何更改tagIcon(两步):1.去阿里图标库下载图标，下载到图标路径：src/icons/svg 2.修改tagIcon的属性值与下载的svg图标名相同
      tagIcon: 'selectTwo',
      layout: 'colFormItem',
      span: 24,
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/select',
      typeNumber: 7
    },
    __slot__: {
      options: [{
        label: '选项一',
        value: 1
      }, {
        label: '选项二',
        value: 2
      }]
    },
    placeholder: '请选择',
    style: { width: '100%' },
    clearable: true,
    disabled: false,
    filterable: false,
    multiple: true
  },
  {
    __config__: {
      label: '分割线',
      tag: 'el-divider',
      tagIcon: 'splitLine',
      defaultValue: null,
      showLabel: true,
      labelWidth: null,
      span: 24,
      layout: 'colFormItem',
      // required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/date-picker',
      typeNumber: 8
    },
    // 设置分割线方向：horizontal/vertical
    direction: 'horizontal',
    // 设置分割线文案位置：left/right/center
    contentPosition: 'center'
  }
];

// 选择型组件 【左面板】【增强字段】
export const selectComponents = [
  //       dataType: 'dynamic',
  {
    __config__: {
      label: '地址',
      url: 'https://www.fastmock.site/mock/f8d7a54fb1e60561e2f720d5a810009d/fg/cascaderList',
      method: 'get',
      dataPath: 'list',
      dataConsumer: 'options',
      showLabel: true,
      labelWidth: null,
      tag: 'el-cascader',
      tagIcon: 'address',
      layout: 'colFormItem',
      defaultValue: [],
      span: 24,
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/cascader',
      typeNumber: 9
    },
    options: regionData,
    placeholder: '请选择',
    style: { width: '100%' },
    props: {
      props: {
        multiple: false,
        label: 'label',
        value: 'value',
        children: 'children'
      }
    },
    'show-all-levels': true,
    disabled: false,
    clearable: true,
    filterable: false,
    separator: '/'
  },
  // {
  //   // 组件的自定义配置
  //   // __config__中定义的属性，都可以在自定义组件中访问
  //   __config__: {
  //     label: '定位',
  //     labelWidth: null,
  //     showLabel: true,
  //     changeTag: true,
  //     tag: 'mylocation', // 自定义组件的名称，myTree.vue， 要一致
  //     tagIcon: 'location',
  //     defaultValue: [''],
  //     required: true,
  //     layout: 'colFormItem',
  //     span: 24,
  //     document: 'https://element.eleme.cn/#/zh-CN/component/input',
  //     // 正则校验规则
  //     // regList: [],
  //     url: '',
  //     dataType: 'dynamic',
  //     method: 'get',
  //     dataPath: 'data', // 访问url返回结果中的数据键名
  //     dataConsumer: 'data_conf' // myTree组件中负责接收初始化值的属性，即tree各节点的值
  //   },
  //   // 组件的插槽属性
  //   __slot__: {
  //     prepend: '',
  //     append: ''
  //   },
  //   // 其余的为可直接写在组件标签上的属性
  //   // placeholder: '请输入',
  //   style: { width: '100%' },
  //   clearable: true,
  //   'prefix-icon': '',
  //   'suffix-icon': '',
  //   maxlength: null,
  //   'show-word-limit': false,
  //   readonly: false,
  //   disabled: false
  // },
  {
    __config__: {
      label: '图片',
      tag: 'el-upload',
      tagIcon: 'picture',
      layout: 'colFormItem',
      defaultValue: null,
      showLabel: true,
      labelWidth: null,
      required: true,
      span: 24,
      showTip: false,
      buttonText: '点击上传图片',
      // 规则
      regList: [],
      changeTag: true,
      // 上传图片最大限制：200MB
      fileSize: 200,
      sizeUnit: 'MB',
      document: 'https://element.eleme.cn/#/zh-CN/component/upload',
      typeNumber: 10
    },
    __slot__: {
      'list-type': true
    },
    action: 'https://jsonplaceholder.typicode.com/posts/',
    disabled: false,
    accept: '',
    name: 'file',
    'auto-upload': true,
    // 上传文件的类型：text/picture/picture-card
    'list-type': 'picture',
    multiple: false
  },
  {
    __config__: {
      label: '附件',
      tag: 'el-upload',
      tagIcon: 'upload',
      layout: 'colFormItem',
      defaultValue: null,
      showLabel: true,
      labelWidth: null,
      required: true,
      span: 24,
      showTip: false,
      buttonText: '点击上传',
      regList: [],
      changeTag: true,
      fileSize: 2,
      sizeUnit: 'MB',
      document: 'https://element.eleme.cn/#/zh-CN/component/upload',
      typeNumber: 11
    },
    __slot__: {
      'list-type': true
    },
    action: 'https://jsonplaceholder.typicode.com/posts/',
    disabled: false,
    accept: '',
    name: 'file',
    'auto-upload': true,
    'list-type': 'text',
    multiple: false
  },
  {
    __config__: {
      label: '手机',
      labelWidth: null,
      showLabel: true,
      changeTag: true,
      tag: 'el-input',
      tagIcon: 'phone',
      defaultValue: undefined,
      required: true,
      layout: 'colFormItem',
      span: 24,
      document: 'https://element.eleme.cn/#/zh-CN/component/input',
      // 正则校验规则
      regList: [{
        pattern: '/^1(3|4|5|7|8|9)\\d{9}$/',
        message: '手机号格式错误'
      }],
      typeNumber: 12
    },
    // 组件的插槽属性
    __slot__: {
      prepend: '',
      append: ''
    },
    __vModel__: 'mobile',
    placeholder: '请输入',
    style: { width: '100%' },
    clearable: true,
    'prefix-icon': 'el-icon-mobile',
    'suffix-icon': '',
    maxlength: 11,
    'show-word-limit': true,
    readonly: false,
    disabled: false
  }
];

// 布局型组件 【左面板】【部门成员字段】
export const layoutComponents = [
  // {
  //   __config__: {
  //     label: '按钮',
  //     showLabel: true,
  //     changeTag: true,
  //     labelWidth: null,
  //     tag: 'el-button',
  //     tagIcon: 'button',
  //     span: 24,
  //     layout: 'colFormItem',
  //     document: 'https://element.eleme.cn/#/zh-CN/component/button'
  //   },
  //   __slot__: {
  //     default: '主要按钮'
  //   },
  //   type: 'primary',
  //   icon: 'el-icon-search',
  //   round: false,
  //   size: 'medium',
  //   plain: false,
  //   circle: false,
  //   disabled: false
  // },
  // {
  //   // 组件的自定义配置
  //   // __config__中定义的属性，都可以在自定义组件中访问
  //   __config__: {
  //     label: '成员单选',
  //     labelWidth: null,
  //     showLabel: true,
  //     changeTag: true,
  //     tag: 'memberSingleChoice', // 自定义组件的名称，myTree.vue， 要一致
  //     tagIcon: 'amember',
  //     defaultValue: [''],
  //     required: true,
  //     layout: 'colFormItem',
  //     span: 24,
  //     document: 'https://element.eleme.io/#/zh-CN/component/cascader#events',
  //     // 正则校验规则
  //     // regList: [],
  //     url: '',
  //     dataType: 'dynamic',
  //     method: 'get',
  //     dataPath: 'data', // 访问url返回结果中的数据键名
  //     dataConsumer: 'data_conf' // myTree组件中负责接收初始化值的属性，即tree各节点的值
  //   },
  //   // 组件的插槽属性
  //   __slot__: {
  //     prepend: '',
  //     append: ''
  //   },
  //   // 其余的为可直接写在组件标签上的属性
  //   // placeholder: '请输入',
  //   style: { width: '100%' },
  //   clearable: true,
  //   'prefix-icon': '',
  //   'suffix-icon': '',
  //   maxlength: null,
  //   'show-word-limit': false,
  //   readonly: false,
  //   disabled: false
  // },
  // {
  //   // 组件的自定义配置
  //   // __config__中定义的属性，都可以在自定义组件中访问
  //   __config__: {
  //     label: '成员多选',
  //     labelWidth: null,
  //     showLabel: true,
  //     changeTag: true,
  //     tag: 'multiMemberSelection', // 自定义组件的名称，myTree.vue， 要一致
  //     tagIcon: 'moreMember',
  //     defaultValue: [''],
  //     required: true,
  //     layout: 'colFormItem',
  //     span: 24,
  //     document: 'https://element.eleme.cn/#/zh-CN/component/input',
  //     // 正则校验规则
  //     // regList: [],
  //     url: '',
  //     dataType: 'dynamic',
  //     method: 'get',
  //     dataPath: 'data', // 访问url返回结果中的数据键名
  //     dataConsumer: 'data_conf' // myTree组件中负责接收初始化值的属性，即tree各节点的值
  //   },
  //   // 组件的插槽属性
  //   __slot__: {
  //     prepend: '',
  //     append: ''
  //   },
  //   // 其余的为可直接写在组件标签上的属性
  //   // placeholder: '请输入',
  //   style: { width: '100%' },
  //   clearable: true,
  //   'prefix-icon': '',
  //   'suffix-icon': '',
  //   maxlength: null,
  //   'show-word-limit': false,
  //   readonly: false,
  //   disabled: false
  // },
  {
    __config__: {
      label: '成员单选',
      url: 'https://www.fastmock.site/mock/f8d7a54fb1e60561e2f720d5a810009d/fg/cascaderList',
      method: 'get',
      dataPath: 'list',
      dataConsumer: 'options',
      showLabel: true,
      labelWidth: null,
      tag: 'el-cascader',
      tagIcon: 'amember',
      layout: 'colFormItem',
      defaultValue: [],
      span: 24,
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/cascader',
      typeNumber: 13
    },
    options: [
      {
        id: 100,
        value: 100,
        label: '选项1',
        children: [
          {
            id: 110,
            value: 110,
            label: '选项1-1'
          },
          {
            id: 120,
            value: 120,
            label: '选项1-2'
          },
          {
            id: 130,
            value: 130,
            label: '选项1-3'
          }
        ]
      },
      {
        id: 200,
        value: 200,
        label: '选项2',
        children: [
          {
            id: 210,
            value: 210,
            label: '选项2-1'
          },
          {
            id: 220,
            value: 220,
            label: '选项2-2'
          },
          {
            id: 230,
            value: 230,
            label: '选项2-3'
          }
        ]
      },
      {
        id: 300,
        value: 300,
        label: '选项3',
        children: [
          {
            id: 310,
            value: 310,
            label: '选项3-1'
          },
          {
            id: 320,
            value: 320,
            label: '选项3-2'
          },
          {
            id: 330,
            value: 330,
            label: '选项3-3'
          }
        ]
      }
    ],
    placeholder: '请选择',
    style: { width: '100%' },
    props: {
      props: {
        multiple: false,
        label: 'label',
        value: 'value',
        children: 'children'
      }
    },
    'show-all-levels': true,
    disabled: false,
    clearable: true,
    filterable: false,
    separator: '/'
  },
  {
    __config__: {
      label: '成员多选',
      url: 'https://www.fastmock.site/mock/f8d7a54fb1e60561e2f720d5a810009d/fg/cascaderList',
      method: 'get',
      dataPath: 'list',
      dataConsumer: 'options',
      showLabel: true,
      labelWidth: null,
      tag: 'el-cascader',
      tagIcon: 'moreMember',
      layout: 'colFormItem',
      defaultValue: [],
      span: 24,
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/cascader',
      typeNumber: 14
    },
    options: [{
      id: 1,
      value: 1,
      label: '选项1',
      children: [{
        id: 2,
        value: 2,
        label: '选项1-1'
      }]
    }],
    placeholder: '请选择',
    style: { width: '100%' },
    props: {
      props: {
        multiple: true,
        label: 'label',
        value: 'value',
        children: 'children'
      }
    },
    'show-all-levels': true,
    disabled: false,
    clearable: true,
    filterable: false,
    separator: '/'
  },
  {
    __config__: {
      label: '部门单选',
      url: 'https://www.fastmock.site/mock/f8d7a54fb1e60561e2f720d5a810009d/fg/cascaderList',
      method: 'get',
      dataPath: 'list',
      dataConsumer: 'options',
      showLabel: true,
      labelWidth: null,
      tag: 'el-cascader',
      tagIcon: 'adepartment',
      layout: 'colFormItem',
      defaultValue: [],
      span: 24,
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/cascader',
      typeNumber: 15
    },
    options: [{
      id: 1,
      value: 1,
      label: '选项1',
      children: [{
        id: 2,
        value: 2,
        label: '选项1-1'
      }]
    }],
    placeholder: '请选择',
    style: { width: '100%' },
    props: {
      props: {
        multiple: false,
        label: 'label',
        value: 'value',
        children: 'children'
      }
    },
    'show-all-levels': true,
    disabled: false,
    clearable: true,
    filterable: false,
    separator: '/'
  },
  {
    __config__: {
      label: '部门多选',
      url: 'https://www.fastmock.site/mock/f8d7a54fb1e60561e2f720d5a810009d/fg/cascaderList',
      method: 'get',
      dataPath: 'list',
      dataConsumer: 'options',
      showLabel: true,
      labelWidth: null,
      tag: 'el-cascader',
      tagIcon: 'moredepartment',
      layout: 'colFormItem',
      defaultValue: [],
      span: 24,
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/cascader',
      typeNumber: 16
    },
    options: [{
      id: 1,
      value: 1,
      label: '选项1',
      children: [{
        id: 2,
        value: 2,
        label: '选项1-1'
      }]
    }],
    placeholder: '请选择',
    style: { width: '100%' },
    props: {
      props: {
        multiple: true,
        label: 'label',
        value: 'value',
        children: 'children'
      }
    },
    'show-all-levels': true,
    disabled: false,
    clearable: true,
    filterable: false,
    separator: '/'
  }
  // {
  //   // 组件的自定义配置
  //   // __config__中定义的属性，都可以在自定义组件中访问
  //   __config__: {
  //     label: '部门单选',
  //     labelWidth: null,
  //     showLabel: true,
  //     changeTag: true,
  //     tag: 'departmentSingleChoice', // 自定义组件的名称，myTree.vue， 要一致
  //     tagIcon: 'adepartment',
  //     defaultValue: [''],
  //     required: true,
  //     layout: 'colFormItem',
  //     span: 24,
  //     document: 'https://element.eleme.cn/#/zh-CN/component/input',
  //     // 正则校验规则
  //     // regList: [],
  //     url: '',
  //     dataType: 'dynamic',
  //     method: 'get',
  //     dataPath: 'data', // 访问url返回结果中的数据键名
  //     dataConsumer: 'data_conf' // myTree组件中负责接收初始化值的属性，即tree各节点的值
  //   },
  //   // 组件的插槽属性
  //   __slot__: {
  //     prepend: '',
  //     append: ''
  //   },
  //   // 其余的为可直接写在组件标签上的属性
  //   // placeholder: '请输入',
  //   style: { width: '100%' },
  //   clearable: true,
  //   'prefix-icon': '',
  //   'suffix-icon': '',
  //   maxlength: null,
  //   'show-word-limit': false,
  //   readonly: false,
  //   disabled: false
  // },
  // {
  //   // 组件的自定义配置
  //   // __config__中定义的属性，都可以在自定义组件中访问
  //   __config__: {
  //     label: '部门多选',
  //     labelWidth: null,
  //     showLabel: true,
  //     changeTag: true,
  //     tag: 'multiDepartmentSelection', // 自定义组件的名称，myTree.vue， 要一致
  //     tagIcon: 'moredepartment',
  //     defaultValue: [''],
  //     required: true,
  //     layout: 'colFormItem',
  //     span: 24,
  //     document: 'https://element.eleme.cn/#/zh-CN/component/input',
  //     // 正则校验规则
  //     // regList: [],
  //     url: '',
  //     dataType: 'dynamic',
  //     method: 'get',
  //     dataPath: 'data', // 访问url返回结果中的数据键名
  //     dataConsumer: 'data_conf' // myTree组件中负责接收初始化值的属性，即tree各节点的值
  //   },
  //   // 组件的插槽属性
  //   __slot__: {
  //     prepend: '',
  //     append: ''
  //   },
  //   // 其余的为可直接写在组件标签上的属性
  //   // placeholder: '请输入',
  //   style: { width: '100%' },
  //   clearable: true,
  //   'prefix-icon': '',
  //   'suffix-icon': '',
  //   maxlength: null,
  //   'show-word-limit': false,
  //   readonly: false,
  //   disabled: false
  // }
];
