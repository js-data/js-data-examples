import {Component} from '@angular/core'
import {ROUTER_DIRECTIVES, RouteConfig} from '@angular/router-deprecated'
import {HeaderComponent} from './header'
import {PostsComponent} from './posts'
import {PostComponent} from './post'
import {EditComponent} from './edit'
import {store, IUser, IUserMapper} from './store'

const UserMapper = <IUserMapper>store.getMapper('user')

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
  loggedInUser: IUser

  constructor () {
    // Fetch the current user, if any
    UserMapper.getLoggedInUser().then((user) => {
      this.loggedInUser = user
    })
  }
}
