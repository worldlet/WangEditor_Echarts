## WangEditor实现插入Echarts图表功能

### 思路一：通过Echarts的getDataURL方法把图表生成图片并以图片的方式插入到编辑器中

```js
  chart.on('finished', () => {  
    // 获取图表的数据URL  
    const dataURL = chart.getDataURL({  
      pixelRatio: 2,             // 设置像素比例
      backgroundColor: '#fff',   // 设置背景颜色
    });  
    this.editor.setHtml(`<p><img src="${dataURL}" alt="ECharts图表"></p>`)
  })
```

### 思路二：通过自定义新元素的方式插入DOM节点，并渲染为Echarts图表

**创建自定义节点**
```js
// 通过h函数创建div虚拟节点
function renderAttachment(elm) {
  return h(
      // 自定义html标签
      'div',
      // HTML 属性、样式、事件
      {
        props: { contentEditable: true }, // HTML 属性，驼峰式写法
        attrs: { id: 'echart' },  // 设置标签id
        // style: { width: '1em', marginRight: '0.1em',  /* 其他... */ },  // style样式
        on: { click() { console.log('click =========> ', elm) } }
      }
  )
}
// 定义 renderElem 配置
const renderElemConf = {
  type: 'echarts', // 新元素 type ，重要！！！
  renderElem: renderAttachment,
}
// 注册自定义元素到编辑器
Boot.registerRenderElem(renderElemConf)
```
> 注意：
> 必须在创建编辑器之前注册
> 全局只能注册一次，不要重复注册

**向编辑器中插入自定义节点**
```js
const node = { type: 'echarts', children: [{ text: '' }] }  
this.editor.insertNode(node) 
```
**通过ID获取DOM元素，然后渲染Echarts图表**
```js
  setTimeout(() => {  
    const chart = echarts.init(document.getElementById('echarts'));  
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
  }, 100)  
```






