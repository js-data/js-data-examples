import angular from 'angular'
import ngRoute from 'angular-route'

import {store} from './store'

import {Header} from './header'
import {PostsConfig, Posts} from './posts'

angular.module('app', [ngRoute])
  .config(['$locationProvider', ($locationProvider) => {
    $locationProvider.html5Mode(true).hashPrefix('!')
  }])
  .config(PostsConfig)
  .directive('mainHeader', Header)
  .controller('PostsCtrl', Posts)
  .run(['$rootScope', ($rootScope) => {
    // Fetch the current user, if any
    store.getMapper('user').getLoggedInUser().then((user) => {
      $rootScope.loggedInUser = user
      console.log($rootScope.loggedInUser)
    })
    $rootScope.$on('$routeChangeSuccess', ($event, next) => {
      $rootScope.path = next.$$route.originalPath.substr(1).split('/')[0]
    })
  }])
