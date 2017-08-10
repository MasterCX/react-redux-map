# React-Redux实践：地图APP
## 说明
### 目录结构
* `map-app`:
  * `build`: webpack打包好的发布内容
    * `static`: 静态资源，包括打包好的js和css
  * `public`: 静态页面
  * `src`:开发环境
    * `actions`: redux action
    * `components`: 展示组件
        * `Charts`: 统计图表组件
        * `DistanceFilter`: 地理距离过滤组件
        * `QueryByBorough`: 按地区查询组件
        * `QueryByDate`: 按日期查询组件
    * `containers`: 容器组件
        * `MapContainer`: 地图容器组件
        * `MenuContainer`: 菜单容器组件
    * `reducers`: reducer函数
    * `stylesheets`: CSS样式表文件
* `server`: 生产目录

### 运行方法
1. 准备数据库、设置`server.js`相关参数
本示例使用了MySQL数据库存储原csv数据表中的所有内容。修改`server.js`中连接数据库的相关参数。
```js
server.register({
    register: require('hapi-plugin-mysql'),
    options: {
        host: "127.0.0.1",
        user: "root",
        password: "root",
        database: "nypd",
        port: "3306"
    }
}, function (err) {
    if (err) console.log(err);
});
```
>**注意：如果使用`webpack-dev-server`调试，可能需要开启`hapi`服务器的跨域：**
```js
const server = new Hapi.Server({
    connections: {
        routes: {
            cors: true
        }
    }
});
```
2. 安装依赖
打包好的静态资源已经在生产目录里面，可以直接运行
```js
npm install
node server.js
```
然后访问[localhost:4000](http://localhost:4000)查看DEMO。
在线DEMO可以访问[这里](http://123.206.110.199:4000)。
>**注意**：
1. 由于使用了Google地图API，访问DEMO需要翻墙。
2. 交通事故数据来源是纽约警察局公开数据，统计了2017年3月24日之前的数据。为确保可以显示数据，请确定筛选条件为**3月24日之前**。

### 基本功能特性
1. 特性
* 使用ES6编写
* 前端页面使用React + Redux框架
* 后端使用HapiJS
2. 功能
* 在地图上显示出事故发生的地点
* 展示事故详情
* 显示当前展示数据的统计图表
  * 事故发生的时间分布
  * 发生事故的车辆类型
  * 发生事故的原因占比
* 按照时间、地区过滤
* 在地图上指定任意点按地理半径过滤数据
  * 支持1-5公里、10、15、20、25公里半径

### 部分实现使用的库
1. 地图
* 使用Google地图API呈现纽约州地图。  
* 使用Google地图API中的Geometry库实现地理距离过滤判定。
2. UI
* Material Design风格的React组件库
2. 统计图表
* 百度Echart
