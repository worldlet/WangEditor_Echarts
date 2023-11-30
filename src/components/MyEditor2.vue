<template>
  <div>
    <div>
      <button @click="printEditorHtml">print html</button>
      <button @click="insertTextHandler">insert text</button>
      <button @click="disableHandler">disable</button>
      <button @click="addEcharts">echarts</button>
    </div>
    <div style="border: 1px solid #ccc; margin-top: 10px;">
      <!-- 工具栏 -->
      <Toolbar
          style="border-bottom: 1px solid #ccc"
          :editor="editor"
          :defaultConfig="toolbarConfig"
      />
      <!-- 编辑器 -->
      <Editor
          style="height: 400px; overflow-y: hidden;"
          :defaultConfig="editorConfig"
          v-model="html"
          @onChange="onChange"
          @onCreated="onCreated"
      />
    </div>
    <div style="margin-top: 10px;">
            <textarea
                v-model="html"
                readonly
                style="width: 100%; height: 200px; outline: none;"
            ></textarea>
    </div>
  </div>
</template>

<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { Boot } from '@wangeditor/editor'
import 'echarts/theme/dark'
import * as echarts from 'echarts';
import { h } from 'snabbdom'
/**
 *
 * */
function renderAttachment(elm) {
  return h(
      // HTML tag
      'div',
      // HTML 属性、样式、事件
      {
        props: { contentEditable: true }, // HTML 属性，驼峰式写法
        // attrs: { id: 'echarts' },
        on: { click() { console.log('click =========> ', elm) } }
      }
  )
}
const renderElemConf = {
  type: 'echarts', // 新元素 type ，重要！！！
  renderElem: renderAttachment,
}
// Boot.registerRenderElem(renderElemConf)

function attachmentToHtml() {
  // 生成 HTML 代码
  return `<div data-w-e-is-void data-w-e-type="echarts">echarts<div id="echarts"></div></div>`
}
const elemToHtmlConf = {
  type: 'echarts', // 新元素的 type ，重要！！！
  elemToHtml: attachmentToHtml,
}

function parseAttachmentHtml() {
  // 生成“附件”元素（按照此前约定的数据结构）
  return {
    type: 'echarts',
    children: [{ text: '' }], // void node 必须有 children ，其中有一个空字符串，重要！！！
  }
}
const parseHtmlConf = {
  selector: 'div[data-w-e-type="echarts"]', // CSS 选择器，匹配特定的 HTML 标签
  parseElemHtml: parseAttachmentHtml,
}
const module = {
  renderElems: [renderElemConf],    // renderElem
  elemsToHtml: [elemToHtmlConf, /* 其他元素... */],  // elemToHtml
  parseElemsHtml: [parseHtmlConf, /* 其他元素... */]  // parseElemHtml
}
Boot.registerModule(module)

export default {
  name: 'MyEditor',
  components: { Editor, Toolbar },
  data() {
    return {
      editor: null,
      html: '<p>hello&nbsp;world</p>',
      toolbarConfig: {
        // toolbarKeys: [ /* 显示哪些菜单，如何排序、分组 */ ],
        // excludeKeys: [ /* 隐藏哪些菜单 */ ],
      },
      editorConfig: {
        placeholder: '请输入内容...',
        // autoFocus: false,

        // 所有的菜单配置，都要在 MENU_CONF 属性下
        MENU_CONF: {}
      },
    }
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor) // 【注意】一定要用 Object.seal() 否则会报错
    },
    onChange(editor) {
      console.log('onChange', editor.getHtml()) // onChange 时获取编辑器最新内容
    },
    insertTextHandler() {
      const editor = this.editor
      if (editor == null) return
      editor.insertText(' hello ')
    },
    printEditorHtml() {
      const editor = this.editor
      if (editor == null) return
      console.log(editor.getHtml())
    },
    disableHandler() {
      const editor = this.editor
      if (editor == null) return
      if (editor.isDisabled()) {
        editor.enable()
      } else {
        editor.disable()
      }
    },
    initCharts() {
      const chartContainer = document.createElement('div');
      chartContainer.style.width = '800px';
      chartContainer.style.height = '500px';

      const chart = echarts.init(chartContainer, 'dark');

      // 这里可以根据你的需求配置ECharts图表
      const option = {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            }
          }
        ]
      };

      chart.setOption(option);

      // console.log(this.editor)
      // 将图表插入到WangEditor中
      chart.on('finished', () => {
        // 获取图表的数据URL
        const dataURL = chart.getDataURL({
          pixelRatio: 2, // 可选，设置像素比例
          backgroundColor: '#fff', // 可选，设置背景颜色
        });
        this.editor.setHtml(`<p><img src="${dataURL}" alt="ECharts图表"></p>`);
      });
    },
    addEcharts() {
      // const node = { type: 'paragraph', children: [{ text: 'simple text' }] }
      // this.editor.insertNode(node)
      const node1 = { type: 'echarts', children: [{ text: '111' }] }
      this.editor.insertNode(node1)
      // this.editor.setHtml('<div id="echarts">abc</div>')
      this.editor.on('updateView', () => {
        console.log('=======> updateView')
      })
      /*setTimeout(() => {
        const chart = echarts.init(document.getElementById('echarts'));

        // 这里可以根据你的需求配置ECharts图表
        const option = {
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: [120, 200, 150, 80, 70, 110, 130],
              type: 'bar',
              showBackground: true,
              backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
              }
            }
          ]
        };

        chart.setOption(option);
      }, 1000)*/



      // SlateTransforms.insertNodes(this.editor, node1, { select: true });
      // this.editor.dangerouslyInsertHtml(`<span data-id="echarts">1212</span>`)
    },
  },
  mounted() {
    // 模拟 ajax 请求，异步渲染编辑器
    setTimeout(() => {
      // this.html = '<div id="echarts">echarts</div>'
      // this.initCharts()
    }, 1500)
    this.$nextTick(() => {
      // this.initCharts()
    })
    // Boot.registerRenderElem(this.renderElemConf)
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁 editor ，重要！！！
  },
}
</script>

<style>
#echarts {
  width: 600px;
  height: 400px;
}
</style>

<style src="@wangeditor/editor/dist/css/style.css"></style>
