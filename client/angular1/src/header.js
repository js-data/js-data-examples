import angular from 'angular'

const config = {
  restrict: 'E',
  replace: true,
  template: `<div class="navbar navbar-default navbar-fixed-top">
    <div class="container">
      <div class="navbar-header">
        <a href="/" class="navbar-brand">js-data blog example</a>
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
            <a href="/">Home</a>
          </li>
          <li data-ng-if="loggedInUser" class="{{path === '/posts/new/edit' ? 'active' : ''}}">
            <a href="/posts/new/edit">New post</a>
          </li>
          <li data-ng-if="loggedInUser">
            <a href="/users/{loggedInUser.id}">
              Hi <strong>{{loggedInUser.displayName || loggedInUser.username}}</strong>!
            </a>
          </li>
          <li data-ng-if="!loggedInUser"><a href="/auth/github">Login with Github</a></li>
        </ul>
      </div>
    </div>
  </div>`
}

export const Header = function () {
  return config
}
