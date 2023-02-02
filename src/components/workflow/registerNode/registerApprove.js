// TODO 抽离公共样式作为一个class

// 自定义审批节点
const width = 160;
const height = 40;
const radius = 2;
const background = '#F7F9FE';
const lightBackground = '#E3F6FF';
const borderColor = '#E1E3E5';
const hoverBorderColor = '#76BBEB';
const svgColor = '#0DB3A6';
const textVal = '审批节点';
export default function registerApprove (lf) {
  lf.register('approve', ({ RectNode, RectNodeModel, h }) => {
    // 形状相关，可以内置其他svg
    class ApproveNode extends RectNode {
      // svg图标
      getLabelShape () {
        const { model } = this.props;
        const { x, y } = model;
        return h(
          'svg',
          {
            x: x - width / 2 + 8,
            y: y - height / 2 + 8,
            width: 20,
            height: 20,
            viewBox: '0 0 1274 1024'
          },
          // svg路径
          [
            h('path', {
              fill: svgColor,
              d:
                'M800 960 224 960c-52.928 0-96-43.072-96-96L128 224c0-52.928 43.072-96 96-96l448 0c17.696 0 32 14.336 32 32s-14.304 32-32 32L224 192C206.368 192 192 206.368 192 224l0 640c0 17.664 14.368 32 32 32l576 0c17.664 0 32-14.336 32-32L832 352c0-17.664 14.304-32 32-32s32 14.336 32 32l0 512C896 916.928 852.928 960 800 960z'
            }),
            h('path', {
              fill: svgColor,
              d:
                'M612 448c-8.192 0-16.384-3.136-22.624-9.376-12.512-12.512-12.512-32.736 0-45.248l318.016-318.016c12.512-12.512 32.736-12.512 45.248 0s12.512 32.736 0 45.248l-318.016 318.016C628.384 444.896 620.192 448 612 448z'
            }),
            h('path', {
              fill: svgColor,
              d: 'M480 448 288 448c-17.664 0-32-14.336-32-32s14.336-32 32-32l192 0c17.664 0 32 14.336 32 32S497.664 448 480 448z'
            }),
            h('path', {
              fill: svgColor,
              d: 'M672 640 288 640c-17.664 0-32-14.304-32-32s14.336-32 32-32l384 0c17.696 0 32 14.304 32 32S689.696 640 672 640z'
            })
          ]
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
    // 样式相关
    class ApproveModel extends RectNodeModel {
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
        this.width = width;
        this.height = height;
        // 不允许直接通过节点编辑文本
        this.text.editable = false;
      }
      // 自定义节点样式
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
    }
    return {
      view: ApproveNode,
      model: ApproveModel
    };
  });
}
