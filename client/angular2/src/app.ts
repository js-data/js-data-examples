import {Component} from 'angular2/core'
import {ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router'
import {HeaderComponent} from './header'
import {PostsComponent} from './posts'
import {PostComponent} from './post'
import {EditComponent} from './edit'
import {UserMapper} from './store'

@Component({
  selector: '#app',
  template: `
    <div class="container">
      <header [loggedInUser]="loggedInUser"></header>
      <div class="container main-container">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  directives: [ROUTER_DIRECTIVES, HeaderComponent]
})
@RouteConfig([
  { path: '/', component: PostsComponent, name: 'Posts' },
  { path: '/posts/:id', component: PostComponent, name: 'Post' },
  { path: '/posts/:id/edit', component: EditComponent, name: 'Edit' }
])
export class AppComponent {
  loggedInUser: any

  constructor () {
    UserMapper.getLoggedInUser().then((user) => {
      this.loggedInUser = user
    })
  }
}
