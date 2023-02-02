
const TurboType = {
  EDGE: 1,
  START: 2,
  END: 5,
  APPROVE: 3,
  SEND: 4
};

function getTurboType (type) {
  switch (type) {
    case 'customEdge':
      return TurboType.EDGE;
    case 'start':
      return TurboType.START;
    case 'end':
      return TurboType.END;
    case 'approve':
      return TurboType.APPROVE;
    case 'send':
      return TurboType.SEND;
    default:
      return type;
  }
}

function convertNodeToTurboElement (node) {
  const { id, type, x, y, text = '', properties } = node;
  return {
    incoming: [],
    outgoing: [],
    type: getTurboType(node.type),
    properties: {
      ...properties,
      name: text && text.value || '',
      minX: '',
      x: x,
      y: y,
      text,
      logicFlowType: type
    },
    key: id
  };
}
function convertEdgeToTurboElement (edge) {
  const {
    id,
    type,
    sourceNodeId,
    targetNodeId,
    startPoint,
    endPoint,
    pointsList,
    text = '',
    properties } = edge;
  return {
    incoming: [sourceNodeId],
    outgoing: [targetNodeId],
    type: getTurboType(type),
    properties: {
      ...properties,
      name: text && text.value || '',
      text,
      startPoint,
      endPoint,
      pointsList,
      logicFlowType: type
    },
    key: id
  };
}

export function toTurboData (data) {
  const nodeMap = new Map();
  const edgeMap = new Map();
  const turboData = {
    flowElementList: []
  };

  data.nodes.forEach((node) => {
    const flowElement = convertNodeToTurboElement(node);
    turboData.flowElementList.push(flowElement);
    nodeMap.set(node.id, flowElement);
  });

  data.edges.forEach((edge) => {
    edgeMap.set(edge.id, edge);
  });

  data.edges.forEach((edge) => {
    const flowElement = convertEdgeToTurboElement(edge);
    const sourceElement = nodeMap.get(edge.sourceNodeId);
    const targetNode = nodeMap.get(edge.targetNodeId);
    // 对Node的outgoing重新排序
    // outgoing存放的是edge，将edge的目标节点作为位置的判断条件
    // 优先比较x，其次比较y
    // x小的放在数组最前面，相同则比较y，y小的放在数组的最前面

    // TODO 抽离判断过程
    if (sourceElement.outgoing.length === 0) {
      sourceElement.outgoing.push(flowElement.key);
      sourceElement.minX = targetNode.properties.x;
    } else {
      // 若length>0,则表示需要判断顺序
      if (sourceElement.minX > targetNode.properties.x) {
        console.log('minx', sourceElement.minX);
        // 将outgoing[0]的对应线的目标节点的x 同 当前线对应目标节点的x 进行比较排序，始终保持最小的在最前面
        sourceElement.outgoing.unshift(flowElement.key);
        sourceElement.minX = targetNode.properties.x;
      } else if (nodeMap.get(edgeMap.get(sourceElement.outgoing[0]).targetNodeId).properties.y > targetNode.properties.y) {
        // x不相等，直接比较y
        sourceElement.outgoing.unshift(flowElement.key);
      } else {
        // 不符合上述中条件的正常插入
        sourceElement.outgoing.push(flowElement.key);
      }
    }
    targetNode.incoming.push(flowElement.key);
    turboData.flowElementList.push(flowElement);
  });
  return turboData;
}

function convertFlowElementToEdge (element) {
  const { incoming, outgoing, properties, key } = element;
  // console.log(properties.conditions);
  const {
    text,
    startPoint,
    endPoint,
    pointsList,
    logicFlowType
    // conditions
  } = properties;
  const edge = {
    id: key,
    type: logicFlowType,
    sourceNodeId: incoming[0],
    targetNodeId: outgoing[0],
    text,
    startPoint,
    endPoint,
    pointsList,
    properties: {}
  };
  // console.log(edge);
  const excludeProperties = ['startPoint', 'endPoint', 'pointsList', 'text', 'logicFlowType'];
  Object.keys(element.properties).forEach(property => {
    if (excludeProperties.indexOf(property) === -1) {
      // if (Array.isArray(element.properties[property])) {
      //   edge.properties[property] = [];
      //   for (const item of element.properties[property]) {
      //     edge.properties[property].push(item);
      //   }
      // } else {
      edge.properties[property] = element.properties[property];
      // }
    }
  });
  // console.log(edge);
  return edge;
}

function convertFlowElementToNode (element) {
  const { properties, key } = element;
  const { x, y, text, logicFlowType } = properties;
  const node = {
    id: key,
    type: logicFlowType,
    x,
    y,
    text,
    properties: {}
  };
  const excludeProperties = ['x', 'y', 'text', 'logicFlowType'];
  Object.keys(element.properties).forEach(property => {
    if (excludeProperties.indexOf(property) === -1) {
      node.properties[property] = element.properties[property];
    }
  });
  return node;
}

export function toLogicflowData (data) {
  const lfData = {
    nodes: [],
    edges: []
  };
  const list = data.flowElementList;
  list && list.length > 0 && list.forEach(element => {
    if (element.type === TurboType.EDGE) {
      const edge = convertFlowElementToEdge(element);
      lfData.edges.push(edge);
    } else {
      const node = convertFlowElementToNode(element);
      lfData.nodes.push(node);
    }
  });
  return lfData;
}
