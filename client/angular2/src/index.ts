import 'es6-shim'
import 'es6-promise'
import '../node_modules/zone.js/dist/zone'
// import 'zone.js/lib/browser/zone-microtask'
// import 'zone.js'
import 'reflect-metadata'

import {bootstrap} from '@angular/platform-browser-dynamic'
import {provide} from '@angular/core'
import {LocationStrategy, HashLocationStrategy} from '@angular/common'
import {ROUTER_PROVIDERS} from '@angular/router-deprecated'
import {AppComponent} from './app'

bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  provide(LocationStrategy, {useClass: HashLocationStrategy})
])
