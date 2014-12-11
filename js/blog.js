var blogServices = angular.module('blog', ['ngRoute', 'ngDisqus']);

var templateUrl =  './p/article.html';

blogServices.run(function($route) {
  $route.reload();
})

function blogRouteConfig($routeProvider) {
  $routeProvider.when('/tweet/:name?', {
    controller: ArticleController,
    templateUrl: templateUrl
  }).when('/project/:name?', {
    controller: ArticleController,
    templateUrl: templateUrl
  }).when('/technique/:name?', {
    controller: ArticleController,
    templateUrl: templateUrl
  }).when('/about-me', {
    controller:ArticleController,
    templateUrl: templateUrl
  }).otherwise({
    redirectTo: '/tweet'
  });
}

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
});

blogServices.config(blogRouteConfig);
window.disqus_shortname = 'ahui-blog';
function ArticleController($scope, $routeParams, $http, $sce, $location, $disqus){
  var url = $location.url();
  var name = $routeParams.name;

  if(url == '/about-me') {
    $disqus.commit('about-me');
    $http.get('./p/about-me/about-me.md').success(function(data) {
      var article = marked(data);
      $scope.article = $sce.trustAsHtml(article);
    });
  } else if(name) {
    $disqus.commit(name);
    $http.get('./p'+url+'.md').success(function(data) {
      var article = marked(data);
      $scope.article = $sce.trustAsHtml(article);
    });
  } else {
    $disqus.commit(url);
    $http.get('./p'+url+'/list.md').success(function(data) {
      var listMd = marked(data);
      $scope.article = $sce.trustAsHtml(listMd);
    });
  }
}
