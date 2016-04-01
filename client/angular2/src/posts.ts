import {Component,Input} from 'angular2/core'
import {ROUTER_DIRECTIVES} from 'angular2/router'
import {store} from './store'

@Component({
  selector: 'posts',
  template: `
    <div *ngFor="#post of posts">
      <a [routerLink]="['Post', { id: post.id }]">{{ post.title }}</a>
      <small class="pull-right">{{ post.created_at }}</small>
    </div>
  `,
  directives: [ROUTER_DIRECTIVES]
})
export class PostsComponent {
  posts: any[]

  constructor () {
    store.findAll('post').then((posts) => {
      this.posts = posts
      store.on('all', this.onChange.bind(this))
    })
  }
  ngOnDestroy () { store.off('all', this.onChange) }
  onChange () { this.posts = store.getAll('post') }
}
