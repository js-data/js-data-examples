import angular from 'angular'
import {store} from './store'

const PAGE_SIZE = 5

export const PostsConfig = ['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/', {
    template: `<div data-ng-repeat="post in PostsCtrl.posts track by post.id">
      <a data-ng-href="/posts/{{ post.id }}">{{ post.title }}</a>
      <small class="pull-right">{{ post.created_at | date }}</small>
    </div>`,
    controller: 'PostsCtrl',
    controllerAs: 'PostsCtrl',
    resolve: {
      posts: function () {
        return store.findAll('post', {
          limit: PAGE_SIZE
        })
      }
    }
  })
}]

export const Posts = ['$scope', '$timeout', '$route', function ($scope, $timeout, $route) {
  this.page = 1
  this.posts = $route.current.locals.posts

  this.onChange = function () {
    console.log('onChange')
    $timeout(() => {
      this.posts = store.getAll('post')
      console.log(this.posts)
    })
  }

  store.on('all', this.onChange, this)

  $scope.$on('$destroy', () => {
    store.off('all', this.onChange)
  })
}]
