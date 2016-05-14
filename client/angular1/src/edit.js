import angular from 'angular'
import {store} from './store'

export const EditConfig = ['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/posts/:id/edit', {
    template: `<div>
      <form id="new-post-form" name="new-post-form" data-ng-submit="EditCtrl.onSubmit()">
        <div class="form-group">
          <label class="control-label" for="title">Title</label>
          <input type="text" required id="title" name="title" data-ng-model="EditCtrl.post.title"
                  class="form-control"/>
        </div>
        <div class="form-group">
          <label class="control-label" for="content">Content</label>
          <textarea required id="content" name="content" data-ng-model="EditCtrl.post.content"
                    class="form-control"></textarea>
        </div>
        <div class="form-group">
          <button class="btn btn-success">Save</button>
        </div>
      </form>
    </div>`,
    controller: 'EditCtrl',
    controllerAs: 'EditCtrl',
    resolve: {
      post: ['$route', function ($route) {
        const id = $route.current.params.id
        if (id && id !== 'new') {
          return store.find('post', id)
        }
      }]
    }
  })
}]

export const Edit = ['$route', '$routeParams', '$location', '$timeout', function ($route, $routeParams, $location, $timeout) {
  this.post = $route.current.locals.post || store.createRecord('post')

  this.onSubmit = function () {
    const id = $routeParams.id
    const props = {
      title: this.post.title,
      content: this.post.content
    }
    let promise
    if (id === 'new') {
      promise = store.create('post', props)
    } else {
      promise = store.update('post', id, props)
    }
    promise.then((post) => {
      $timeout(() => {
        $location.path(`/posts/${post.id}`)
      })
    }, console.error)
  }
}]
