// DataStore is mostly recommended for use in the browser
import {
  DataStore,
  Mapper,
  Record,
  Schema,
  utils
} from 'js-data'
import {FirebaseAdapter, IBaseFirebaseAdapter} from 'js-data-firebase'

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

const config = {
  apiKey: "AIzaSyBm19OK4uJG7opzSRcS91jp1zTP7FYk258",
  authDomain: "js-data-firebase-v3.firebaseapp.com",
  databaseURL: "https://js-data-firebase-v3.firebaseio.com/",
  storageBucket: "",
};
firebase.initializeApp(config);
export const firebaseAdapter: IBaseFirebaseAdapter = new FirebaseAdapter({
  // Our API sits behind the /api path
  db: firebase.database()
})
export const store = new DataStore({
  mapperDefaults: {
    // Override the original to make sure the date properties are actually Date
    // objects
    beforeCreate(props, opts) {
      props.created_at = new Date().toISOString()
      props.updated_at = new Date().toISOString()
      return props
    },
    beforeUpdate(props, opts) {
      props.updated_at = new Date().toISOString()
      return props
    },
    createRecord(props, opts) {
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

store.registerAdapter('firebase', firebaseAdapter, { default: true })

export interface IUser extends Record {
  id: string | number
  displayName: string
  username: string
  created_at: string | Date
  updated_at: string | Date
}

export interface IUserMapper extends Mapper {
  loggedInUser: IUser
  getLoggedInUser(): Promise<IUser>
  login(user: firebase.auth.AuthProvider): Promise<IUser>
}

// The User Resource
store.defineMapper('user', {
  // Our API endpoints use plural form in the path
  endpoint: 'users',
  schema: schemas.user,
  relations: relations.user,
  getLoggedInUser(): Promise<IUser> {
    if (this.loggedInUser) {
      return utils.resolve(this.loggedInUser)
    }
    //check local storage for user
    //todo figure this out. Doesn't work in v2
    // const authData = firebase.auth().currentUser
    // debugger
    // if (authData) {
    //   return store.find('user', authData.uid).then(user => {
    //     return this.loggedInUser = user
    //   })
     else {
       return utils.resolve(null)
    }
  },
  login(provider: firebase.auth.AuthProvider): Promise<IUser> {
    return firebaseAdapter.db.app.auth().signInWithPopup(provider).then((authData) => {
      console.log(authData)
      return store.create('user', {
        id: authData.user.uid,
        displayName: authData.user.displayName,
        name: authData.user.providerData[0].email
      }).then(user => {
        this.loggedInUser = user
        return this.loggedInUser
      })
    })
  }
})

export interface IPost extends Record {
  id: string | number
  title: string
  content: string
  user_id: string
  created_at: string | Date
  updated_at: string | Date
}

// The Post Resource
store.defineMapper('post', {
  // Our API endpoints use plural form in the path
  endpoint: 'posts',
  schema: schemas.post,
  relations: relations.post
})

export interface IComment extends Record {
  id: string | number
  user_id: string
  post_id: string
  created_at: string | Date
  updated_at: string | Date
}

// The Comment Resource
store.defineMapper('comment', {
  // Our API endpoints use plural form in the path
  endpoint: 'comments',
  schema: schemas.comment,
  relations: relations.comment
})
