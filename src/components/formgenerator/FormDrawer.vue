<template>
  <div class="myForm">
    <!-- show-close:是否显示关闭按钮 -->
    <!-- v-bind="$attrs"：当前组件用props[]接受父组件通过属性绑定的属性，有些属性未被接收，将传给当前组件的子组件，同样用props【】接收。 -->
    <!-- @opened：打开动画结束时的回调  @close：关闭的回调-->
    <el-drawer :show-close="showClose" v-bind="$attrs" v-on="$listeners" @opened="onOpen" @close="onClose">
      <iframe
        v-show="isIframeLoaded"
        ref="previewPage"
        class="result-wrapper"
        frameborder="0"
        src="preview.html"
        @load="iframeLoad"
      />
      <div v-show="!isIframeLoaded" v-loading="true" class="result-wrapper" />
      <div style="display: none">
        <div id="editorHtml" />
        <div id="editorJs" />
        <div id="editorCss" />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { parse } from '@babel/parser';
import {
  makeUpHtml,
  vueTemplate,
  vueScript,
  cssStyle
} from '@/components/formgenerator/generator/html';
import { makeUpJs } from '@/components/formgenerator/generator/js';
import { makeUpCss } from '@/components/formgenerator/generator/css';
import {
  exportDefault,
  beautifierConf
} from '@/utils/index';
import loadMonaco from '@/utils/loadMonaco';
import loadBeautifier from '@/utils/loadBeautifier';

const editorObj = {
  html: null,
  js: null,
  css: null
};
const mode = {
  html: 'html',
  js: 'javascript',
  css: 'css'
};
let beautifier;
let monaco;

export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['generateConf', 'formData'],
  data() {
    return {
      htmlCode: '',
      jsCode: '',
      cssCode: '',
      isIframeLoaded: false,
      isInitcode: false, // 保证open后两个异步只执行一次runcode
      isRefreshCode: false, // 每次打开都需要重新刷新代码
      scripts: [],
      links: [],
      showClose: true
    };
  },
  computed: {
    resources() {
      return this.scripts.concat(this.links);
    }
  },
  methods: {
    onOpen() {
      // 这就是你心心念念的根据json还原表单的html,js,css
      const { type } = this.generateConf;
      this.htmlCode = makeUpHtml(this.formData, type);
      this.jsCode = makeUpJs(this.formData, type);
      this.cssCode = makeUpCss(this.formData);
      loadBeautifier(btf => {
        beautifier = btf;
        this.htmlCode = beautifier.html(this.htmlCode, beautifierConf.html);
        this.jsCode = beautifier.js(this.jsCode, beautifierConf.js);
        this.cssCode = beautifier.css(this.cssCode, beautifierConf.html);
        loadMonaco(val => {
          monaco = val;
          this.setEditorValue('editorHtml', 'html', this.htmlCode);
          this.setEditorValue('editorJs', 'js', this.jsCode);
          this.setEditorValue('editorCss', 'css', this.cssCode);
          if (!this.isInitcode) {
            this.isRefreshCode = true;
            this.isIframeLoaded && (this.isInitcode = true) && this.runCode();
          }
        });
      });
    },
    onClose() {
      this.isInitcode = false;
      this.isRefreshCode = false;
    },
    iframeLoad() {
      if (!this.isInitcode) {
        this.isIframeLoaded = true;
        this.isRefreshCode && (this.isInitcode = true) && this.runCode();
      }
    },
    setEditorValue(id, type, codeStr) {
      if (editorObj[type]) {
        editorObj[type].setValue(codeStr);
      } else {
        console.log(document.getElementById(id));
        editorObj[type] = monaco.editor.create(document.getElementById(id), {
          value: codeStr,
          theme: 'vs-dark',
          language: mode[type],
          automaticLayout: true
        });
      }
      // ctrl + s 刷新
      editorObj[type].onKeyDown(e => {
        if (e.keyCode === 49 && (e.metaKey || e.ctrlKey)) {
          this.runCode();
        }
      });
    },
    runCode() {
      const jsCodeStr = editorObj.js.getValue();
      try {
        const ast = parse(jsCodeStr, { sourceType: 'module' });
        const astBody = ast.program.body;
        if (astBody.length > 1) {
          this.$confirm(
            'js格式不能识别，仅支持修改export default的对象内容',
            '提示',
            {
              type: 'warning'
            }
          );
          return;
        }
        if (astBody[0].type === 'ExportDefaultDeclaration') {
          const postData = {
            type: 'refreshFrame',
            data: {
              generateConf: this.generateConf,
              html: editorObj.html.getValue(),
              js: jsCodeStr.replace(exportDefault, ''),
              css: editorObj.css.getValue(),
              scripts: this.scripts,
              links: this.links
            }
          };
          this.$refs.previewPage.contentWindow.postMessage(
            postData,
            location.origin
          );
        } else {
          this.$message.error('请使用export default');
        }
      } catch (err) {
        this.$message.error(`js错误：${err}`);
        console.error(err);
      }
    },
    // generateCode：生成代码
    generateCode() {
      const html = vueTemplate(editorObj.html.getValue());
      const script = vueScript(editorObj.js.getValue());
      const css = cssStyle(editorObj.css.getValue());
      return beautifier.html(html + script + css, beautifierConf.html);
    }
  }
};
</script>

<style lang="scss" scoped>
.myForm{
  height: 100%;
}
.myForm ::v-deep .el-drawer__wrapper{
  width: 40%;
  left: unset;
  height: 100%;
}
.myForm .result-wrapper{
    width: 100%;
    height: 100%;
}
</style>
