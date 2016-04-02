// DataStore is mostly recommended for use in the browser
import {
  DataStore,
  Schema,
  utils
} from 'js-data'
import HttpAdapter from 'js-data-http'
const schemas = require('../../../_shared/schemas')(Schema)
import * as relations from '../../../_shared/relations'

export const adapter = new HttpAdapter({
  // Our API sits behind the /api path
  basePath: '/api'
})
export const store = new DataStore()

store.registerAdapter('http', adapter, { default: true })

// The User Resource
store.defineMapper('user', {
  // Our API endpoints use plural form in the path
  endpoint: 'users',
  schema: schemas.user,
  relations: relations.user,
  getLoggedInUser () {
    if (this.loggedInUser) {
      return utils.resolve(this.loggedInUser)
    }
    return store.getAdapter('http').GET('/api/users/loggedInUser')
      .then((response) => {
        const user = this.loggedInUser = response.data
        if (user) {
          this.loggedInUser = store.add('user', user)
        }
        return this.loggedInUser
      })
  }
})

// The Post Resource
store.defineMapper('post', {
  // Our API endpoints use plural form in the path
  endpoint: 'posts',
  schema: schemas.post,
  relations: relations.post
})

// The Comment Resource
store.defineMapper('comment', {
  // Our API endpoints use plural form in the path
  endpoint: 'comments',
  schema: schemas.comment,
  relations: relations.comment
})
