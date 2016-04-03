import {Component,Input} from 'angular2/core'
import {ROUTER_DIRECTIVES} from 'angular2/router'
import {IUser} from './store'

@Component({
  selector: 'header',
  template: `
    <div class="navbar navbar-default navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <a [routerLink]="['Posts']" class="navbar-brand">js-data blog example</a>
          <button class="navbar-toggle" type="button" data-toggle="collapse" data-target="#navbar-main">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
        </div>
        <div class="navbar-collapse collapse" id="navbar-main">
          <ul class="nav navbar-nav">
            <li>
              <a href="https://github.com/js-data/js-data-examples" target="_blank">View source</a>
            </li>
            <li>
              <a href="https://www.js-data.io" target="_blank">js-data.io</a>
            </li>
          </ul>
          <ul class="nav navbar-nav navbar-right">
            <li class="{{!path || path === '/' ? 'active' : ''}}">
              <a [routerLink]="['Posts']">Home</a>
            </li>
            <li *ngIf="loggedInUser" class="{{path === '/posts/new/edit' ? 'active' : ''}}">
              <a [routerLink]="['Edit', { id: 'new' }]">New post</a>
            </li>
            <li *ngIf="loggedInUser">
              <a href="/users/{loggedInUser.id}">
                Hi <strong>{{loggedInUser.displayName || loggedInUser.username}}</strong>!
              </a>
            </li>
            <li *ngIf="!loggedInUser"><a href="/auth/github">Login with Github</a></li>
          </ul>
        </div>
      </div>
    </div>
  `,
  directives: [ROUTER_DIRECTIVES]
})
export class HeaderComponent {
  @Input() loggedInUser: IUser
}
