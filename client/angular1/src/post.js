import angular from 'angular'
import {store} from './store'

export const PostConfig = ['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/posts/:id', {
    template: `<div class="post">
      <h2 class="page-header">
        {{ PostCtrl.post.title }}
        <small>{{ PostCtrl.post.created_at | date }}</small>
      </h2>
      <div>{{ PostCtrl.post.content }}</div>
    </div>`,
    controller: 'PostCtrl',
    controllerAs: 'PostCtrl',
    resolve: {
      post: ['$route', function ($route) {
        return store.find('post', $route.current.params.id)
      }]
    }
  })
}]

export const Post = ['$scope', '$timeout', '$route', '$routeParams', function ($scope, $timeout, $route, $routeParams) {
  this.post = $route.current.locals.post

  this.onChange = function () {
    $timeout(() => {
      this.post = store.get('post', $routeParams.id)
    })
  }

  store.on('all', this.onChange, this)

  $scope.$on('$destroy', () => {
    store.off('all', this.onChange)
  })
}]
