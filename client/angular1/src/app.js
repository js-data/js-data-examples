import angular from 'angular'
import ngRoute from 'angular-route'

import {store} from './store'

import {Header} from './header'
import {PostsConfig, Posts} from './posts'
import {PostConfig, Post} from './post'
import {EditConfig, Edit} from './edit'

angular.module('app', [ngRoute])
  .config(['$locationProvider', ($locationProvider) => {
    $locationProvider.html5Mode(true).hashPrefix('!')
  }])
  .config(PostsConfig)
  .config(PostConfig)
  .config(EditConfig)
  .directive('mainHeader', Header)
  .controller('PostsCtrl', Posts)
  .controller('PostCtrl', Post)
  .controller('EditCtrl', Edit)
  .run(['$rootScope', ($rootScope) => {
    // Fetch the current user, if any
    store.getMapper('user').getLoggedInUser().then((user) => {
      $rootScope.loggedInUser = user
    })
    $rootScope.$on('$routeChangeSuccess', ($event, next) => {
      if (next) {
        $rootScope.path = next.$$route.originalPath.substr(1).split('/')[0]
      }
    })
  }])
