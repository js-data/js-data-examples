import 'es6-shim'
import 'es6-promise'
import '../node_modules/zone.js/dist/zone'
import 'reflect-metadata'

import { bootstrap }    from '@angular/platform-browser-dynamic';
import {provide } from '@angular/core'
import { ROUTER_PROVIDERS, } from '@angular/router-deprecated';
import {LocationStrategy, HashLocationStrategy, APP_BASE_HREF} from '@angular/common';
import { AppComponent } from './app';

bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  provide(LocationStrategy, { useClass: HashLocationStrategy })
]);