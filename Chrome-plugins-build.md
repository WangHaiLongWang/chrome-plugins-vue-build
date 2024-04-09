#### 具体实现
https://github.com/WangHaiLongWang/chrome-plugins-vue-build

#### 组成部分

chrome 插件通常由以下几部分组成

+ manifest.json：相当于插件的 meta 信息，包含插件的名称、版本号、图标、脚本文件名称等，这个文件是每个插件都必须提供的，其他几部分都是可选的。

+ 2. background script：可以调用全部的 chrome 插件 API，实现跨域请求、网页截屏、弹出 chrome 通知消息等功能。相当于在一个隐藏的浏览器页面内默默运行。

+ 3. 功能页面：包括点击插件图标弹出的页面（简称 popup）、插件的配置页面（简称 options）。
+ popup 无法通过程序打开，只能由用户点击打开。点击 popup 之外的区域会导致 popup 收起。
  
   ![image](https://raw.githubusercontent.com/WangHaiLongWang/images_source/main/technology/chrome-plugins/4a1f91c4de0846738a8fcf6f70498bd3%7Etplv-k3u1fbpfcp-zoom-in-crop-mark_1512_0_0_0.webp)

+ 4. content script：早期也被称为 injected script，是插件注入到页面的脚本，但是不会体现在页面 DOM 结构里。content script 可以操作 DOM，但是它和页面其他的脚本是隔离的，访问不到其他脚本定义的变量、函数等，相当于运行在单独的沙盒里。content script 可以调用有限的 chrome 插件 API，网络请求收到同源策略限制

+ 5. browser action 和 page action：这俩我们可以理解为插件的按钮。browser action 会固定在 chrome 的工具栏。而 page action 可以设置特定的网页才显示图标，在地址栏的右端，如下图 
+ page action 和 browser action 分别由 manifest.json 的 page_action 和 browser_action 字段配置。

![image](https://raw.githubusercontent.com/WangHaiLongWang/images_source/main/technology/chrome-plugins/9612fa8aff6e4991b3ebac3ac81c0d92%7Etplv-k3u1fbpfcp-zoom-in-crop-mark_1512_0_0_0.webp)

+ 6. 由于 content script 受到同源策略的限制，所以一般网络请求都交给 background script 处理。
+ content script、插件功能页面、background script 之间的通信架构如下图：

![image](https://raw.githubusercontent.com/WangHaiLongWang/images_source/main/technology/chrome-plugins/e6f57f795045ba854ce070e6dd372a%7Etplv-k3u1fbpfcp-zoom-in-crop-mark_1512_0_0_0.webp)

+ 7. chrome 可以打开多个浏览器窗口，而一个窗口会有多个 tab，所以插件的结构大致如下：

![image](https://raw.githubusercontent.com/WangHaiLongWang/images_source/main/technology/chrome-plugins/ee86a587f39c4841911ae4d57cdc8092%7Etplv-k3u1fbpfcp-zoom-in-crop-mark_1512_0_0_0.webp)



#### manifest.json

主要用于配置应用的基本信息，包括应用的显示名称、图标、应用入口文件的地址、需要使用的设备权限等。它是应用开发过程中的一个重要配置文件，确保应用能够正确地显示和运行。在不同的开发框架和平台中，manifest.json文件的具体用途可能有所不同，但总体上都是为了定义应用的基本属性和配置需求

```javascript
{
  "name": "My Extension", // 插件名称，字符串类型
  "version": "1.0.0",  // 插件版本号，字符串类型
  "description": "This is my first extension.", // 插件描述，字符串类型
  "icons": {
    "16": "icon16.png",  // 16x16 像素的图标文件路径
    "32": "icon32.png",  // 32x32 像素的图标文件路径
    "48": "icon48.png",  // 48x48 像素的图标文件路径
    "128": "icon128.png" // 128x128 像素的图标文件路径
  },
  "browser_action": {   // 浏览器动作，该字段用于定义当用户单击浏览器操作按钮时执行的操作
    "default_icon": "icon.png", // 默认图标的文件路径
    "default_title": "My Extension", // 鼠标指针悬停在浏览器操作按钮上显示的默认标题
    "default_popup": "popup.html" // 弹出窗口的 HTML 文件路径
  },
  "content_scripts": [ // 内容脚本，该字段定义了将应用于哪些网站，以及应用程序如何与网站交互
    {
      "matches": ["<all_urls>"], // 匹配的 URL，字符串数组。使用“*”通配符匹配所有 URL。
      "js": ["content.js"], // 要注入网页中的 JavaScript 文件列表
      "css": ["style.css"], // 要注入网页中的 CSS 文件列表
      "run_at": "document_idle" // 脚本何时运行。可选值有：document_start、document_end 和 document_idle。
    }
  ],
  "permissions": [ // 权限，该字段定义了插件需要访问的资源和功能，例如浏览器标签、存储、网络等等。
    "tabs", // 访问当前活动标签页
    "storage", // 访问扩展的本地存储
    "http://*/*" // 允许插件访问所有 http 协议的网站
  ],
  "background": { // 后台脚本，该字段在后台长时间运行的脚本，也称为持久化背景页
    "scripts": ["background.js"], // 后台脚本文件列表
    "persistent": false // 是否保持持久化，如果设置为 false，当插件不再需要后台页面时，将自动卸载后台页面
  },
  "options_page": "options.html", // 插件选项页面的 HTML 文件路径
  "manifest_version": 2, // manifest.json 文件版本号。必须设置为2。
  "service_worker": "js/background.js", // 指定一个 Service Worker 脚本作为后台页面。如果定义了此字段，则和 字段都将被忽略。使用字段时需要注意更多细节
}
```


#### 运行 
+ 将打包和生成的文件夹 放到chrome浏览器扩展程序安装文件夹位置
+ 1.地址栏输入chrome:version 回车
+ 2.用资源管理器打开"个人资料路径"栏的路径,该路径下的Extensions文件夹即默认的扩展安装路径
+ C:\Users\WangHaiLong\AppData\Local\Google\Chrome\User Data\Profile 1\Extensions