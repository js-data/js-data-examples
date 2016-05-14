document.getElementsByTagName('html')[0].setAttribute('data-ng-app', 'app')

const container = document.createElement('div')
container.className = 'container'

const mainContainer = document.createElement('div')
mainContainer.setAttribute('data-ng-view', '')
mainContainer.className = 'container main-container'

container.appendChild(document.createElement('main-header'))
container.appendChild(mainContainer)

document.getElementById('app').appendChild(container)

import './app'
