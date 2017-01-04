**this is a test source code of**
official source code in [Github](https://github.com/dsyer/spring-security-angular/tree/master/single)

#**Part I - Spring And Angular JS**#
[Spring And Angular JS](https://spring.io/blog/2015/01/12/spring-and-angular-js-a-secure-single-page-application)


#**Part II - The Login Page**#
[The Login Page](https://spring.io/blog/2015/01/12/the-login-page-angular-js-and-spring-security-part-ii)
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