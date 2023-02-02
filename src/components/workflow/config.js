export const nodeList = [
  // {
  //   text: '开始',
  //   type: 'start',
  //   class: 'node-start'
  // },
  {
    type: 'approve',
    text: '审批节点',
    class: 'node-approve'
  },
  {
    type: 'send',
    text: '抄送节点',
    class: 'node-send'
  }
  // {
  //   type: 'end',
  //   text: '结束',
  //   class: 'node-end'
  // }
];

export const BpmnNode = [
  {
    type: 'bpmn:startEvent',
    text: '开始',
    class: 'bpmn-start'
  },
  {
    type: 'bpmn:endEvent',
    text: '结束',
    class: 'bpmn-end'
  },
  {
    type: 'bpmn:exclusiveGateway',
    text: '网关',
    class: 'bpmn-exclusiveGateway'
  },
  {
    type: 'bpmn:userTask',
    text: '用户',
    class: 'bpmn-user'
  }
];
