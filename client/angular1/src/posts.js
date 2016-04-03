import angular from 'angular'
import {store} from './store'

const PAGE_SIZE = 5

/**
 * @param {number} pageNum The page to retrieve.
 * @return {Promise} A Promise that resolves to a Page object.
 */
function fetchPage (pageNum) {
  return store.getMapper('post').findAll({
    limit: PAGE_SIZE,
    offset: (pageNum - 1) * PAGE_SIZE,
    orderBy: [['created_at', 'desc']]
  }).then(function (page) {
    page.data = store.add('post', page.data)
    return page
  })
}

export const PostsConfig = ['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/', {
    template: `<div data-ng-repeat="post in PostsCtrl.posts track by post.id">
      <h3>
        <a data-ng-href="/posts/{{ post.id }}">{{ post.title }}</a>
        <small class="pull-right">{{ post.created_at | date }}</small>
      </h3>
      <div>{{ post.content | limitTo:200 }}...</div>
      <hr>
    </div>
    <div data-ng-hide="PostsCtrl.posts.length">
      No posts yet...
    </div>
    <nav data-ng-if="PostsCtrl.total > PostsCtrl.PAGE_SIZE">
      <ul class="pagination">
        <li>
          <a href="" aria-label="Previous" data-ng-click="PostsCtrl.prev(1)">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li data-ng-if="PostsCtrl.currentPage > 2" data-ng-click="PostsCtrl.prev(2)">
          <a href="">{{ PostsCtrl.currentPage - 2}}</a>
        </li>
        <li data-ng-if="PostsCtrl.currentPage > 1" data-ng-click="PostsCtrl.prev(1)">
          <a href="">{{ PostsCtrl.currentPage - 1}}</a>
        </li>
        <li class="active"><a href="">{{ PostsCtrl.currentPage }}</a></li>
        <li data-ng-if="PostsCtrl.currentPage * PostsCtrl.PAGE_SIZE < PostsCtrl.total"
          data-ng-click="PostsCtrl.next(1)">
          <a href="">{{ PostsCtrl.currentPage + 1}}</a>
        </li>
        <li data-ng-if="(PostsCtrl.currentPage + 1) * PostsCtrl.PAGE_SIZE < PostsCtrl.total"
          data-ng-click="PostsCtrl.next(2)">
          <a href="">{{ PostsCtrl.currentPage + 2}}</a>
        </li>
        <li>
          <a href="" aria-label="Next" data-ng-click="PostsCtrl.next(1)">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>`,
    controller: 'PostsCtrl',
    controllerAs: 'PostsCtrl',
    resolve: {
      page: function () {
        return fetchPage(1)
      }
    }
  })
}]

export const Posts = ['$timeout', '$route', function ($timeout, $route) {
  this.PAGE_SIZE = PAGE_SIZE
  this.currentPage = $route.current.locals.page.page
  this.total = $route.current.locals.page.total
  this.posts = $route.current.locals.page.data

  this.fetchPage = function (pageNum) {
    fetchPage(pageNum).then((page) => {
      this.currentPage = page.page
      this.total = page.total
      $timeout(() => {
        this.posts = store.filter('post', {
          limit: this.PAGE_SIZE,
          offset: (this.currentPage - 1) * this.PAGE_SIZE,
          orderBy: [['created_at', 'DESC']]
        })
      })
    })
  }

  this.prev = function (pageDecrease) {
    if (this.currentPage > 1) {
      this.fetchPage(this.currentPage - pageDecrease)
    }
  }

  this.next = function (pageIncrease) {
    if ((this.currentPage * this.PAGE_SIZE) < this.total) {
      this.fetchPage(this.currentPage + pageIncrease)
    }
  }
}]
