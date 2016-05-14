import {Component,Input} from 'angular2/core'
import {ROUTER_DIRECTIVES} from 'angular2/router'
import {store, IPost} from './store'

const PAGE_SIZE: number = 5

interface IPage {
  total: number
  page: number
  data: IPost[]
}

/**
 * @param {number} pageNum The page to retrieve.
 * @return {Promise} A Promise that resolves to an IPage instance.
 */
function fetchPage (pageNum: number): Promise<IPage> {
  return store.getMapper('post').findAll({
    limit: PAGE_SIZE,
    offset: (pageNum - 1) * PAGE_SIZE,
    // We want the newest posts first
    orderBy: [['created_at', 'desc']]
  }).then(function (page) {
    // Since we didn't use DataStore#findAll to fetch the data (we used the
    // Post Mapper directly), we need to make sure the posts get injected into
    // the data store
    page.data = store.add('post', page.data)
    return page
  })
}

@Component({
  selector: 'posts',
  template: `<div>
    <div *ngFor="#post of posts">
      <h3>
        <a [routerLink]="['Post', { id: post.id }]">{{ post.title }}</a>
        <small class="pull-right">{{ post.created_at | date }}</small>
      </h3>
      <div>{{ post.content }}</div>
    </div>
    <div *ngIf="posts.length === 0">No posts yet...</div>
    <nav *ngIf="total > PAGE_SIZE">
      <ul class="pagination">
        <li>
          <a href="" aria-label="Previous" (click)="prev($event, 1)">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li *ngIf="currentPage > 2" (click)="prev($event, 2)">
          <a href="">{{ currentPage - 2}}</a>
        </li>
        <li *ngIf="currentPage > 1" (click)="prev($event, 1)">
          <a href="">{{ currentPage - 1}}</a>
        </li>
        <li class="active"><a href="">{{ currentPage }}</a></li>
        <li *ngIf="currentPage * PAGE_SIZE < total"(click)="next($event, 1)">
          <a href="">{{ currentPage + 1}}</a>
        </li>
        <li *ngIf="(currentPage + 1) * PAGE_SIZE < total" (click)="next($event, 2)">
          <a href="">{{ currentPage + 2}}</a>
        </li>
        <li>
          <a href="" aria-label="Next" (click)="next($event, 1)">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>`,
  directives: [ROUTER_DIRECTIVES]
})
export class PostsComponent {
  posts: IPost[] = []
  currentPage: number = 1
  total: number = 0
  PAGE_SIZE: number = PAGE_SIZE

  constructor () {
    this.fetchPage(this.currentPage)
  }
  fetchPage (pageNum: number): void {
    fetchPage(pageNum).then((page) => {
      this.currentPage = page.page
      this.total = page.total
      this.posts = store.filter('post', {
        limit: this.PAGE_SIZE,
        offset: (this.currentPage - 1) * this.PAGE_SIZE,
        orderBy: [['created_at', 'DESC']]
      })
    })
  }
  prev ($event: Event, pageDecrease: number): void {
    $event.preventDefault()
    if (this.currentPage > 1) {
      this.fetchPage(this.currentPage - pageDecrease)
    }
  }
  next ($event: Event, pageIncrease: number): void {
    $event.preventDefault()
    if ((this.currentPage * this.PAGE_SIZE) < this.total) {
      this.fetchPage(this.currentPage + pageIncrease)
    }
  }
}
