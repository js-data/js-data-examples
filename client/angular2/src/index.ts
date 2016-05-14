import 'es6-shim'
import 'es6-promise'
import '../node_modules/zone.js/dist/zone'
// import 'zone.js/lib/browser/zone-microtask'
// import 'zone.js'
import 'reflect-metadata'

import {bootstrap} from 'angular2/platform/browser'
import {provide} from 'angular2/core'
import {
  ROUTER_PROVIDERS,
  APP_BASE_HREF,
  LocationStrategy,
  HashLocationStrategy
} from 'angular2/router'
import {AppComponent} from './app'

bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  provide(LocationStrategy, {useClass: HashLocationStrategy})
])
