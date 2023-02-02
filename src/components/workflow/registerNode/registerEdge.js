const baseColor = 'rgb(13, 179, 166)';
const selectedColor = 'rgb(57,153,255)';
export default function registerEdge (lf) {
  lf.register('customEdge', ({ PolylineEdge, PolylineEdgeModel }) => {
    class Edge extends PolylineEdge {

    }
    class Model extends PolylineEdgeModel {
      // 初始化节点样式
      initEdgeData (data) {
        super.initEdgeData(data);
        this.properties.conditions = [];
        // 不允许直接通过节点编辑文本
        this.text.editable = false;
      }
      // 自定义边样式
      getEdgeStyle () {
        const style = super.getEdgeStyle();
        if (this.isSelected) {
          style.stroke = selectedColor;
        } else {
          style.stroke = baseColor;
        }
        return style;
      }
      // 自定义边文字
      getTextStyle () {
        const style = super.getTextStyle();
        style.color = '#3451F1';
        style.fontSize = 14;
        return style;
      }
      // 自定义虚线框
      getOutlineStyle () {
        const style = super.getOutlineStyle();
        style.stroke = 'red';
        style.hover.stroke = 'red';
        return style;
      }
    }
    return {
      type: 'customEdge',
      view: Edge,
      model: Model
    };
  });
}
