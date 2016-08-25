(function(){
  function buildVueDragFor(_, Sortable){

    function mix(source, functions){
      _.forEach(['bind', 'update', 'unbind'],function(value){
          var original = source[value];
          source[value] = function(){
            functions[value].apply(this, arguments);
            return original.apply(this, arguments);
          };
      });
    }

    function getFragment(elt){
      return elt.__v_frag;
    }

    function getCollectionFragment(fr){
      if (!fr || !!fr.forId){
        return fr;
      }
      return getCollectionFragment(fr.parentFrag);
    }

    function getRootFragment(elt){
      return getCollectionFragment(getFragment(elt));
    }

    function getVmObject(elt){
      var fragment = getRootFragment(elt);
      return fragment.scope.element;
    }

    function removeNode(node){
      node.parentElement.removeChild(node);
    }

    function insertNodeAt(fatherNode, node, position){
      if (position<fatherNode.children.length)
        fatherNode.insertBefore(node, fatherNode.children[position]);
      else
        fatherNode.appendChild(node);
    }

    function computeIndexes(nodes){
      return nodes.map(getRootFragment).filter(function(elt){return !!elt;}).map(function (elt){return (elt).scope.$index;}).value();
    }
    
    var vueDragFor = {
      install : function(Vue) {
        var forDirective = Vue.directive('for');
        var dragableForDirective = _.clone(forDirective);
        dragableForDirective.params = dragableForDirective.params.concat('root', 'options');

        mix(dragableForDirective, {
          bind : function () {    
            var ctx = this;    
            var options = this.params.options;
            var indexes;

            function updatePosition(collection, newIndex, oldIndex ){
              var realnew = indexes[newIndex], realOld = indexes[oldIndex];
              if (!!collection){
                collection.splice(realnew, 0, collection.splice(realOld, 1)[0] );
              }
            }

            options = _.isString(options)? JSON.parse(options) : options;
            options = _.merge(options,{
              onStart: function (evt) {
                indexes = computeIndexes(_.chain(evt.from.children));
                console.log(indexes);
              },
              onUpdate: function (evt) {
                if (ctx.params.trackBy==="$index"){
                  removeNode(evt.item);           
                  insertNodeAt(evt.from, evt.item, evt.oldIndex);
                }
                updatePosition(ctx.collection, evt.newIndex, evt.oldIndex);
                removeNode(evt.item);
                insertNodeAt(evt.from, evt.item, evt.oldIndex) 
              },
              onAdd: function (evt) {             
                if (!!ctx.collection){                  
                  var addElement= getVmObject(evt.item);
                  var localIndexes =  computeIndexes(_.chain(evt.to.children).filter(function(elt){return elt!==evt.item;}));
                  var length = localIndexes.length;
                  if (evt.newIndex>= length){
                    ctx.collection.push(addElement);
                  }
                  else{
                    var newIndex =  localIndexes[evt.newIndex];
                    ctx.collection.splice(newIndex, 0, addElement);
                  }
                  removeNode(evt.item);
                  insertNodeAt(evt.from, evt.item, evt.oldIndex)            
                }
              },
              onRemove: function (evt) {
                var collection = ctx.collection;
                var isCloning = !!evt.clone;
                if (!!collection && !isCloning){
                  //If is cloning is set no need to remove element from collection
                  var realOld = indexes[evt.oldIndex];
                  collection.splice(realOld, 1);
                }
                if (isCloning){    
                  removeNode(evt.clone);           
                  insertNodeAt(evt.from, evt.item, evt.oldIndex);
                }
                else{
                  //Need to remove added node if Vue is not tracking it: Vue will add it for us
                  var elt = evt.item
                  if (!!getFragment(elt).parentFrag){
                    removeNode(elt);
                  }
                } 
              }
            });
            var parent = (!!this.params.root) ? document.getElementById(this.params.root) : this.el.parentElement;
            this._sortable = new Sortable(parent, options);
          },
          update : function (value){
            if ((!!value) && (!Array.isArray(value)))
              throw new Error('should received an Array');

            this.collection = value;
          },
          unbind : function (){
            this._sortable.destroy();
          }
        });

        //With typo: should be removed in next release
        Vue.directive('dragable-for', dragableForDirective);
        Vue.directive('draggable-for', dragableForDirective);
      }
    };
    return vueDragFor;
  }

  if (typeof exports == "object") {
    var _ = require("lodash");
    var Sortable =  require("sortablejs");
    module.exports = buildVueDragFor(_, Sortable);
  } else if (typeof define == "function" && define.amd) {
    define(['lodash', 'Sortable'], function(_, Sortable){ return buildVueDragFor(_, Sortable);});
  } else if ((window.Vue) && (window._) && (window.Sortable)) {
    window.vueDragFor = buildVueDragFor(window._, window.Sortable);
    Vue.use(window.vueDragFor);
  }
})();
