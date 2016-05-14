import {Component,Input} from 'angular2/core'
import {ROUTER_DIRECTIVES, RouteParams} from 'angular2/router'
import {store, IPost} from './store'

@Component({
  selector: 'post',
  template: `
    <div class="post">
      <h2 class="page-header">
        {{ post?.title }}
        <small>{{ post?.created_at | date }}</small>
      </h2>
      <div>{{ post?.content }}</div>
    </div>
  `,
  directives: [ROUTER_DIRECTIVES]
})
export class PostComponent {
  post: IPost

  constructor (private _routeParams: RouteParams) {
    store.find('post', _routeParams.get('id')).then((post) => {
      this.post = post
      store.on('all', this.onChange, this)
    })
  }
  ngOnDestroy () { store.off('all', this.onChange) }
  onChange () { this.post = store.get('post', this._routeParams.get('id')) }
}
