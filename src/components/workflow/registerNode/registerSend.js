// 自定义审批节点
const width = 160;
const height = 40;
const radius = 2;
const background = '#F7F9FE';
const lightBackground = '#E3F6FF';
const borderColor = '#E1E3E5';
const hoverBorderColor = '#76BBEB';
const svgColor = '#178cdf';
const textVal = '抄送节点';
export default function registerSend (lf) {
  lf.register('send', ({ RectNode, RectNodeModel, h }) => {
    // 形状相关，可以内置其他svg
    class SendNode extends RectNode {
      // 图标
      getLabelShape () {
        const { model } = this.props;
        const { x, y } = model;
        return h(
          'svg',
          {
            x: x - width / 2 + 5,
            y: y - height / 2 + 5,
            width: 25,
            height: 25,
            viewBox: '0 0 1274 1024'
          },
          h('path', {
            fill: svgColor,
            d:
              'M704 864c-6.4 0-12.8 0-19.2-6.4l-153.6-102.4L454.4 832c-6.4 6.4-25.6 12.8-32 6.4-12.8-6.4-19.2-19.2-19.2-32l0-140.8c0-6.4 0-12.8 6.4-19.2L652.8 384c12.8-12.8 32-12.8 44.8 0 12.8 12.8 12.8 32 0 44.8l-236.8 256 0 51.2 44.8-38.4c12.8-12.8 25.6-12.8 38.4-6.4l140.8 89.6 108.8-531.2L256 512l121.6 76.8C390.4 595.2 396.8 620.8 384 633.6c-6.4 12.8-32 19.2-44.8 12.8L172.8 537.6C166.4 531.2 160 524.8 160 512c0-12.8 6.4-19.2 19.2-25.6l640-320c12.8-6.4 25.6-6.4 32 0 12.8 6.4 12.8 19.2 12.8 32l-128 640c0 12.8-6.4 19.2-19.2 25.6C710.4 864 710.4 864 704 864z'
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
    // 样式相关
    class SendModel extends RectNodeModel {
      // constructor(data, graphModel) {
      //   super(data, graphModel);
      //   // this.radius = radius;
      // }
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
      // 自定义节点样式
      getNodeStyle () {
        const style = super.getNodeStyle();
        // const properties = super.getProperties();
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
        // console.log(style);
        // style.hover.r = 8;
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
      // 抄送节点作为源时
      // getConnectedSourceRules () {
      //   const rules = super.getConnectedSourceRules();
      //   const notAsTarget = {
      //     message: '抄送节点不能作为连线的起点',
      //     validate: () => false
      //   };
      //   rules.push(notAsTarget);
      //   return rules;
      // }
    }
    return {
      view: SendNode,
      model: SendModel
    };
  });
}
