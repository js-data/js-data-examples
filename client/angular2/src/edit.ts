import {Component,Input} from 'angular2/core'
import {Router, RouteParams} from 'angular2/router'
import {store, IPost} from './store'

@Component({
  selector: 'edit',
  template: `
    <div>
      <form #editForm="ngForm" (submit)="onSubmit()">
        <div class="form-group">
          <label class="control-label" for="title">Title</label>
          <input type="text" required id="title" name="title" [(ngModel)]="post.title"
                  class="form-control"/>
        </div>
        <div class="form-group">
          <label class="control-label" for="content">Content</label>
          <textarea required id="content" name="content" [(ngModel)]="post.content"
                    class="form-control"></textarea>
        </div>
        <div class="form-group">
          <button type="onSubmit" class="btn btn-success">Save</button>
        </div>
      </form>
    </div>
  `
})
export class EditComponent {
  post: IPost = <IPost>store.createRecord('post')

  constructor (private _router: Router, private _routeParams: RouteParams) {
    const id = _routeParams.get('id')
    if (id && id !== 'new') {
      store.find('post', id).then((post) => {
        this.post.title = post.title
        this.post.content = post.content
      })
    }
  }
  onSubmit () {
    const id = this._routeParams.get('id')
    const props = {
      title: this.post.title,
      content: this.post.content
    }
    let promise
    if (id === 'new') {
      promise = store.create('post', props)
    } else {
      promise = store.update('post', id, props)
    }
    promise.then((post) => {
      this._router.navigate(['Post', { id: post.id }])
    })
  }
}
