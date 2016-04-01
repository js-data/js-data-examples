import {Component,Input} from 'angular2/core'
import {ROUTER_DIRECTIVES, RouteParams} from 'angular2/router'
import {store} from './store'

@Component({
  selector: 'post',
  template: `
    <div>
      {{ post.title }}
    </div>
  `,
  directives: [ROUTER_DIRECTIVES]
})
export class PostComponent {
  post: any[]

  constructor (private _routeParams: RouteParams) {
    store.find('post', _routeParams.get('id')).then((post) => {
      this.post = post
      store.on('all', this.onChange.bind(this))
    })
  }
  ngOnDestroy () { store.off('all', this.onChange) }
  onChange () { this.post = store.get('post', this._routeParams.get('id')) }
}
