import Vue from 'vue';
import { loadScriptQueue } from '@/utils/loadScript';
import axios from 'axios';
import Tinymce from '@/components/formgenerator/tinymce/index.vue';

Vue.component('tinymce', Tinymce);
Vue.prototype.$axios = axios;

// 获取preview.html的引用
const $previewApp = document.getElementById('previewApp');
const childAttrs = {
  file: '',
  dialog: ' width="600px" class="dialog-width" v-if="visible" :visible.sync="visible" :modal-append-to-body="false" '
};

// 开始 (接受iframe中preview.html返回数据。)
window.addEventListener('message', init, false);

function init(event) {
  if (event.data.type === 'refreshFrame') {
    const code = event.data.data;
    const attrs = childAttrs[code.generateConf.type];
    let links = '';

    if (Array.isArray(code.links) && code.links.length > 0) {
      links = buildLinks(code.links);
    }

    $previewApp.innerHTML = `${links}<style>${code.css}</style><div id="app"></div>`;

    if (Array.isArray(code.scripts) && code.scripts.length > 0) {
      loadScriptQueue(code.scripts, () => {
        newVue(attrs, code.js, code.html);
      });
    } else {
      newVue(attrs, code.js, code.html);
    }
  }
}

function buildLinks(links) {
  let strs = '';
  links.forEach(url => {
    strs += `<link href="${url}" rel="stylesheet">`;
  });
  return strs;
}

function newVue(attrs, main, html) {
  // eval：将字符串解析成js代码并运行。（将json字符串解析为json对象。）
  // eslint-disable-next-line no-eval
  main = eval(`(${main})`);
  main.template = `<div>${html}</div>`;
  new Vue({
    components: {
      child: main
    },
    data() {
      return {
        visible: true
      };
    },
    template: `<div><child ${attrs}/></div>`
  }).$mount('#app');
}
