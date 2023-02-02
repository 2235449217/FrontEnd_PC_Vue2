// 自定义起始节点
const width = 160;
const height = 40;
const radius = 2;
const background = '#F7F9FE';
const lightBackground = '#E3F6FF';
const borderColor = '#E1E3E5';
const hoverBorderColor = '#76BBEB';
const svgColor = '#0DB3A6';
const textVal = '流程发起节点';
export default function registerStart (lf) {
  lf.register('start', ({ RectNode, RectNodeModel, h }) => {
    class StartNode extends RectNode {
      getLabelShape () {
        const { model } = this.props;
        const { x, y } = model;
        return h(
          'svg',
          {
            x: x - width / 2 + 6,
            y: y - height / 2 + 6,
            width: 25,
            height: 25,
            viewBox: '0 0 1274 1024'
          },
          h('path', {
            fill: svgColor,
            d: 'M512 149.333333c200.298667 0 362.666667 162.368 362.666667 362.666667s-162.368 362.666667-362.666667 362.666667S149.333333 712.298667 149.333333 512 311.701333 149.333333 512 149.333333z m0 64c-164.949333 0-298.666667 133.717333-298.666667 298.666667s133.717333 298.666667 298.666667 298.666667 298.666667-133.717333 298.666667-298.666667-133.717333-298.666667-298.666667-298.666667z m-64 141.312a42.666667 42.666667 0 0 1 22.741333 6.570667l176.533334 111.232a42.666667 42.666667 0 0 1 0.32 71.978667l-176.533334 113.429333A42.666667 42.666667 0 0 1 405.333333 621.973333v-224.64a42.666667 42.666667 0 0 1 42.666667-42.666666z m21.333333 81.322667v146.922667l115.456-74.176L469.333333 435.968z'
          })
        );
      }
      /**
      * 完全自定义节点形状方法
      */
      getShape () {
        const { model } = this.props;
        const { x, y, width, height } = model;
        const style = model.getNodeStyle();
        return h('g', {}, [
          h('rect', {
            ...style,
            x: x - width / 2,
            y: y - height / 2,
            rx: radius,
            ry: radius,
            width,
            height
          }),
          this.getLabelShape()
        ]);
      }
    }
    class StartModel extends RectNodeModel {
      // 初始化节点样式
      initNodeData (data) {
        // 可以在super之前，强制设置节点文本位置不居中，而且在节点下面
        if (!data.text || typeof data.text === 'string') {
          data.text = {
            value: textVal,
            x: data.x,
            y: data.y
          };
        }
        super.initNodeData(data);
        // 不允许直接通过节点编辑文本
        this.text.editable = false;
        this.width = width;
        this.height = height;
      }
      // 自定义节点样式属性
      getNodeStyle () {
        const style = super.getNodeStyle();
        style.strokeWidth = 1;
        // hover和选中的颜色控制
        if (this.isSelected || this.isHovered) {
          style.fill = lightBackground;
          style.stroke = hoverBorderColor;
        } else {
          style.fill = background;
          style.stroke = borderColor;
        }
        return style;
      }
      // 自定义锚点样式
      getAnchorStyle () {
        const style = super.getAnchorStyle();
        if (this.isSelected || this.isHovered) {
          style.fill = lightBackground;
          style.stroke = hoverBorderColor;
        } else {
          style.fill = background;
        }
        style.hover.fill = hoverBorderColor;
        style.hover.stroke = hoverBorderColor;
        return style;
      }
      // 自定义文字样式
      getTextStyle () {
        const style = super.getTextStyle();
        style.fontSize = 14;
        return style;
      }
      // 自定义锚点脱出线的样式
      getAnchorLineStyle () {
        const style = super.getAnchorLineStyle();
        style.stroke = 'rgb(13, 179, 166)';
        return style;
      }
      // 起始节点作为目标时规则
      getConnectedTargetRules () {
        const rules = super.getConnectedTargetRules();
        const notAsTarget = {
          message: '起始节点不能作为连线的终点',
          validate: () => false
        };
        rules.push(notAsTarget);
        return rules;
      }
    }
    return {
      view: StartNode,
      model: StartModel
    };
  });
}
