# voteDevelop
## 总结
在这个项目当中 
1.相对于比较麻烦的就是表单验证不过运用正则思想还是搞定啦 由于后台API给的是文档接口所以在这2部分中都用了正则匹配 避免了页面跳转之间的问题 
2.动态数据都是用es6的模板字符串绑定的并且封装了方法 这样可以使代码看起来很简洁并且工整。
3.在保存数据上用了本地存储localStorage对于setItem getItem也进行了封装
很多地方要是封装成函数，通过传参、回调来调用，逻辑应该会更清晰了所以JS代码变得简洁工整不到400行就轻松搞定 而且利用dropload插件完成页面下拉加载节省代码量模块化的必要性，webpack很轻便
