// 自定义结束节点
const width = 160;
const height = 40;
const radius = 2;
const background = '#F7F9FE';
const lightBackground = '#E3F6FF';
const borderColor = '#E1E3E5';
const hoverBorderColor = '#76BBEB';
const svgColor = '#E64340';
const textVal = '流程结束';
export default function registerEnd (lf) {
  lf.register('end', ({ RectNode, RectNodeModel, h }) => {
    class EndNode extends RectNode {
      getLabelShape () {
        const { model } = this.props;
        const { x, y } = model;
        return h(
          'svg',
          {
            x: x - width / 2 + 10,
            y: y - height / 2 + 10,
            width: 17,
            height: 17,
            viewBox: '0 0 1274 1024'
          },
          [
            h('path', {
              fill: svgColor,
              d: 'M788.842733 146.596542a485.068578 485.068578 0 0 1 86.347229 78.14224 510.614455 510.614455 0 0 1 64.763128 94.31408 465.389593 465.389593 0 0 1 41.014123 107.249385 475.088367 475.088367 0 0 1 14.071881 114.794079q0 100.245919-38.318816 188.097757t-103.62317 153.058773Q787.76028 947.470614 699.789372 985.735307t-188.346721 38.264693q-99.304185 0-187.264269-38.264693t-153.816489-103.471627Q104.516313 817.045922 66.738723 729.204908T28.961134 541.107151a468.701898 468.701898 0 0 1 13.487357-112.098773 497.495132 497.495132 0 0 1 38.318816-104.554079 461.005661 461.005661 0 0 1 61.526595-92.701225 524.231707 524.231707 0 0 1 82.039069-77.611839c15.825454-11.495645 32.841606-15.305877 51.264947-12.989429 11.906977 1.537082 24.192812 12.480676 25.253615 25.71907 1.786046 22.168626-13.963636 39.726004-31.726681 53.256659Q189.164092 278.525843 146.634536 363.487533T104.12663 546.086432q0 83.684397 31.72668 157.864861t86.942579 129.34224q55.205073 55.205073 129.461309 87.494629t158.038053 32.332854q83.770993 0 158.038054-32.332854t129.461309-87.494629q55.205073-55.205073 87.570401-129.34224T917.654571 546.086432a400.669763 400.669763 0 0 0-45.668668-187.036954q-45.690317-88.133276-128.184016-145.200167c-18.618182-12.675518-32.278731-30.655053-30.02723-52.845327 1.60203-15.749683 11.008541-23.911374 23.251078-25.71907 18.780549-2.781903 35.980718 0.541226 51.806173 11.311628z'
            }),
            h('path', {
              fill: svgColor,
              d: 'M501.245949 0.000011A42.930063 42.930063 0 0 1 544.208486 42.930074v429.354752a42.935475 42.935475 0 0 1-85.870951 0V42.930074A42.930063 42.930063 0 0 1 501.245949 0.000011z'
            })
          ]
        );
      }
      /**
      * 完全自定义节点形状方法
      */
      getShape () {
        const { model } = this.props;
        const { x, y } = model;
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
    class EndModel extends RectNodeModel {
      // 初始化节点样式
      // !如果出现连线拖拽时丢失的bug检查是否在此处赋值多余的属性
      // 已知对radius赋值会出现此错误
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
      getConnectedSourceRules () {
        const rules = super.getConnectedSourceRules();
        const notAsTarget = {
          message: '终止节点不能作为连线的起点',
          validate: () => false
        };
        rules.push(notAsTarget);
        return rules;
      }
    }
    return {
      view: EndNode,
      model: EndModel
    };
  });
}
