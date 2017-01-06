**this is a test source code of**
official source code in [Github](https://github.com/dsyer/spring-security-angular/tree/master/single)

#**Part I - Spring And Angular JS**#
[Spring And Angular JS](https://spring.io/blog/2015/01/12/spring-and-angular-js-a-secure-single-page-application)


#**Part II - The Login Page**#
英文原文链接:[The Login Page](https://spring.io/blog/2015/01/12/the-login-page-angular-js-and-spring-security-part-ii)

在第一节中我们讨论了如何在一个单页面应用中使用基础的Spring Security 和AngularJS.
这里我们开始展示怎么样使用怎样是用AngularJS来通过一个表单和的认证用户和获取后台资源来生成界面.
这是系列文章的第二章,你可以通过阅读第一篇文章来创建相关代码,或者直接访问**Dave Syer**在[Github](https://github.com/dsyer/spring-security-angular/tree/master/single)的代码(请查阅文件的开头)

在上一节中我们创建一个通过基础的Http Basic authentication来保护后台资源的简单程序.
在这一节我们将添加一个登陆界面,给用户忍着或者不认证的选择,并修改在上一节中讨论的CSRF攻击问题.

##添加 导航到Home页

静态页面"index.html"是这个单页面应用的核心. 我们已经有了一个非常基础的,我们需要在其上提供一些导航功能(例如:登陆,登出,Home).让我们一起来修改它(in "src/main/resources/static").
  
  ```html
  
<!doctype html>
<html>
<head>
<title>Hello AngularJS</title>
<link
	href="css/angular-bootstrap.css"
	rel="stylesheet">
<style type="text/css">
[ng\:cloak], [ng-cloak], .ng-cloak {
	display: none !important;
}
</style>
</head>

<body ng-app="hello" ng-cloak class="ng-cloak">
	<div ng-controller="navigation" class="container">
		<ul class="nav nav-pills" role="tablist">
			<li class="active"><a href="#/">home</a></li>
			<li><a href="#/login">login</a></li>
			<li ng-show="authenticated"><a href="" ng-click="logout()">logout</a></li>
		</ul>
	</div>
	<div ng-view class="container"></div>
	<script src="js/angular-bootstrap.js" type="text/javascript"></script>
	<script src="js/hello.js"></script>
</body>
</html>

```

```html
<div ng-controller="navigation" class="container">
		<ul class="nav nav-pills" role="tablist">
			<li class="active"><a href="#/">home</a></li>
			<li><a href="#/login">login</a></li>
			<li ng-show="authenticated"><a href="" ng-click="logout()">logout</a></li>
		</ul>
	</div>
```
代码与原来的区别事实上并不大,显著的特征:

   - 导航栏有一个\<ul>标签.所有链接都直接回到Home页,但是当我们建立routes后AngularJs会重新组织这些.
   - 所有的内容都会以**partials**的形势追加到被ng-view**标记** 的  \<div> 內.
   - "ng-cloak"被移动到了Body 上,我们希望在AngularJs能显示内容之前,整个页面都被银川. 否则当页面加载时,导航菜单和页面内容会出现"闪烁"现象.
   - 和第一节一样,前端的“angular-bootstrap.css” and “angular-bootstrap.js”编译JAR包的时候被生成.
   
##添加导航到Angular Application
   
让我们 来修改"hello" application(in "src/main/resources/public/js/hello.js")来添加一些导航功能
我们可以从添加一些"routes"路由配置开始,那样Home页的链接就能真正有用了. 例如:

```js
angular.module('hello', [ 'ngRoute' ])
  .config(function($routeProvider, $httpProvider) {

	$routeProvider.when('/', {
		templateUrl : 'home.html',
		controller : 'home'
	}).when('/login', {
		templateUrl : 'login.html',
		controller : 'navigation'
	}).otherwise('/');

    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

  })
  .controller('home', function($scope, $http) {
    $http.get('/resource/').success(function(data) {
      $scope.greeting = data;
    })
  })
  .controller('navigation', function() {});
```
我们添加了一个名为"ngRoute"的AngularJS 模块的依赖.
这允许我们在config方法中可以注入一个神奇的"$routeProvider"(AngularJS按照约定的名字进行依赖注入,并通过名字组织方法的参数).
"$routeProvider"在方法中被用来代替"/"("home"控制器)和"/login"("login"控制器)
The “templateUrls” are relative paths from the root of the routes (i.e. “/”) to “partial” views that will be used to render the model created by each controller.
"模板化的url"(英语原文**The"templateUrls"**)是 用于显示控制器创建的model 的"局部视图(记住这里是单页面应用程序)"相对于路由根目录(i.e. "/")的相对路径.

自定的"X-Requested-With"是一个习惯性从浏览器客户端发出的头参数.在AngularJS 1.3.0以后的版本被作为默认值.**Spring Security**会对其作出响应,但是不会在一个401响应中包含的发送一个"WWW-Authenticate"头信息.
这样的话流浪器就不会弹出一个验证对话框.(这是可以采用的,当我们要控制身份验证)

为了使用"ngRoute"模块,我们需要在"wro.xml"中添加一行配置(位于"src/main/wro").
```xml
<groups xmlns="http://www.isdc.ro/wro">
  <group name="angular-bootstrap">
    ...
    <js>webjar:angularjs/1.3.8/angular-route.min.js</js>
   </group>
</groups>
```

## 欢迎页面

欢迎的内容可以将旧页面的中移到"home.html"(在index.html边上创建"src/main/resources/static").
home.html
```html
<h1>Greeting</h1>
<div ng-show="authenticated">
	<p>The ID is {{greeting.id}}</p>
	<p>The content is {{greeting.content}}</p>
</div>
<div  ng-show="!authenticated">
	<p>Login to see your greeting</p>
</div>
```

因为用户现在可以决定是否登陆(在它完全被浏览器控制之前),我们需要在UI中区分那个需要安全控制和哪个不需要.我们通过引用"authenticated"变量(现在还不存在)来实现.

