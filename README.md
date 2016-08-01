# Vue.Dragable.For
Vue directive for lists allowing drag-and-drop sorting in sync with View-Model. Based on [Sortable.js](https://github.com/RubaXa/Sortable)


##Motivation

Create a directive that displays a dragable list and keeps in sync the view and underlying view model.

##Demo

![demo gif](https://raw.githubusercontent.com/David-Desmaisons/Vue.Dragable.For/master/example.gif)

Simple:

https://jsfiddle.net/dede89/j62g58z7/

Two Lists:

https://jsfiddle.net/dede89/hqxranrd/

Example with list clone:

https://jsfiddle.net/dede89/u5ecgtsj/

##Features

* Full support of [Sortable.js](https://github.com/RubaXa/Sortable) options via options parameters
* Keeps in sync view model and view
* No jquery dependency

##Usage

Use it exactly as v-for directive, passing optional parameters using 'options' parameter.
Option parameter can be json string or a full javascript object.

  ``` html
  <div v-dragable-for="element in list1" options='{"group":"people"}'>
    <p>{{element.name}}</p>
  </div>
   ```
   
##Limitation

This directive works only when applied to arrays and not to javascript objects.


## Installation
- Available through:
``` js
 npm install vuedragablefor
```
``` js
 Bower install vue.dragable.for
```
- #### For Modules

  ``` js
  // ES6
  import Vue from 'vue'
  import VueDragableFor from 'vuedragablefor'
  Vue.use(VueDragableFor)

  // ES5
  var Vue = require('vue')
  Vue.use(require('vuedragablefor'))
  ```

- #### For `<script>` Include

  Just include `vue.dragable.for.js` after Vue and lodash(version >=3).
  
## License
  
  [MIT](https://github.com/David-Desmaisons/Vue.Dragable.For/blob/master/LICENSE)
