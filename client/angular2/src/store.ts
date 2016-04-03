// DataStore is mostly recommended for use in the browser
import {
  DataStore,
  Schema,
  utils
} from 'js-data'
const HttpAdapter = require('js-data-http')

declare var require: any

const schemas = require('../../../_shared/schemas')(Schema)
const relations = require('../../../_shared/relations')

const convertToDate = function (record) {
  if (typeof record.created_at === 'string') {
    record.created_at = new Date(record.created_at)
  }
  if (typeof record.updated_at === 'string') {
    record.updated_at = new Date(record.updated_at)
  }
}

export const adapter = new HttpAdapter({
  // Our API sits behind the /api path
  basePath: '/api'
})
export const store = new DataStore({
  mapperDefaults: {
    // Override the original to make sure the date properties are actually Date
    // objects
    createRecord (props, opts) {
      const result = this.constructor.prototype.createRecord.call(this, props, opts)
      if (Array.isArray(result)) {
        result.forEach(convertToDate)
      } else if (this.is(result)) {
        convertToDate(result)
      }
      return result
    }
  }
})

store.registerAdapter('http', adapter, { default: true })

export interface IUser extends JSData.Record {
  id: string|number
  displayName: string
  username: string
  created_at: string|Date
  updated_at: string|Date
}

export interface IUserMapper extends JSData.Mapper {
  loggedInUser: IUser
  getLoggedInUser(): Promise<IUser>
}

// The User Resource
store.defineMapper('user', {
  // Our API endpoints use plural form in the path
  endpoint: 'users',
  schema: schemas.user,
  relations: relations.user,
  getLoggedInUser (): Promise<IUser> {
    if (this.loggedInUser) {
      return utils.resolve(this.loggedInUser)
    }
    return store.getAdapter('http').GET('/api/users/loggedInUser')
      .then((response) => {
        const user = this.loggedInUser = response.data
        if (user) {
          this.loggedInUser = <IUser>store.add('user', user)
        }
        return this.loggedInUser
      })
  }
})

export interface IPost extends JSData.Record {
  id: string|number
  title: string
  content: string
  user_id: string
  created_at: string|Date
  updated_at: string|Date
}

// The Post Resource
store.defineMapper('post', {
  // Our API endpoints use plural form in the path
  endpoint: 'posts',
  schema: schemas.post,
  relations: relations.post,
  // "GET /posts" doesn't return data as JSData expects, so we override the
  // default "wrap" method and add some extra logic to make sure that the
  // correct data gets turned into Record instances
  wrap (data, opts) {
    console.log(opts.op, data.data)
    if (opts.op === 'afterFindAll') {
      data.data = this.createRecord(data.data)
      return data
    } else {
      // Normally JSData expects the returned data to be directly wrappable
      return this.createRecord(data)
    }
  }
})

export interface IComment extends JSData.Record {
  id: string|number
  user_id: string
  post_id: string
  created_at: string|Date
  updated_at: string|Date
}

// The Comment Resource
store.defineMapper('comment', {
  // Our API endpoints use plural form in the path
  endpoint: 'comments',
  schema: schemas.comment,
  relations: relations.comment
})
