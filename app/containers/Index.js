import React, { Component } from 'react'
import Tree from '../components/Tree'
import _ from 'lodash'

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.movePlaceholderBefore = this.movePlaceholderBefore.bind(this);
    this.movePlaceholderAfter = this.movePlaceholderAfter.bind(this);
    this._getNodeIndex = this._getNodeIndex.bind(this);
    this.resetPlaceholder = this.resetPlaceholder.bind(this);
    this.movePlaceholderChild = this.movePlaceholderChild.bind(this);
    this.drop = this.drop.bind(this);
    this.removeNode = this.removeNode.bind(this);
    this._updatePositions = this._updatePositions.bind(this);
    this.makeNew = this.makeNew.bind(this);
    this.place = this.place.bind(this);
    this.moveToParent = this.moveToParent.bind(this);
  }

  state = {
    tree: {
      id: 99999999999,
      title: 'root',
      type: 'flow',
      position: 0,
      parent: null,
      real_depth: 0,
      children: [
        {
          id: 1, 
          title: 'Tatooine',
          type: 'org',
          position: 0,
          parent: 99999999999,
          real_depth: 1,
          children: [
            {
              id: 2, 
              title: 'Endor',
              type: 'assistant',
              position: 0,
              parent: 1,
              real_depth: 2,
              children: [
                {
                  id: 4, 
                  title: 'Dagobah',
                  type: 'assistant',
                  position: 0,
                  parent: 2,
                  real_depth: 3,
                  children: []
                }
              ]
            },
            {
              id: 3, 
              title: 'Hoth',
              type: 'assistant',
              position: 1,
              parent: 1,
              real_depth: 2,
              children: []
            },
          ]
        },
        {
          id: 5, 
          title: 'Death Star',
          type: 'assistant',
          position: 1,
          parent: 99999999999,
          real_depth: 1,
          children: [
            {
              id: 9,
              title: 'Carlac',
              type: 'assistant',
              real_depth: 2,
              parent: 5,
              position: 0,
            },
            {
              id: 10,
              title: 'Kalevala',
              type: 'assistant',
              real_depth: 2,
              parent: 5,
              position: 1,
              children: []
            }
          ]
        },
        {
          id: 6, 
          title: 'Alderaan',
          type: 'assistant',
          real_depth: 1,
          position: 2,
          parent: 99999999999,
          children: [
            {
              id: 7, 
              title: 'Bespin',
              type: 'assistant',
              position: 0,
              parent: 6,
              real_depth: 2,
              children: [
                {
                  id: 8, 
                  title: 'Jakku',
                  type: 'assistant',
                  position: 0,
                  real_depth: 3,
                  parent: 7,
                  children: []
                }
              ]
            }
          ]
        }
      ]
    },
    placeholderPos:{
      id: 0,
      position: null
    }
  };

  _getNodeIndex(id, arr){
    //find index of element in appMenuData
    var elementIndex = arr.map(function(x) {return x.id; }).indexOf(id);
    return elementIndex;
  }

  resetPlaceholder(){
    this.setState({
      placeholderPos: {
        id: 0,
        position: null
      }
    });
  }

  moveToParent(parent, placeholderPos, realDepth){
    // console.log(parent);
    // console.log(placeholderPos);
    let tree = this.state.tree;
    
    if(parent == tree.id){
      var parentObj = tree;
    }else{
      var parentObj = this.findItem(parent, tree.children);
    }

    // console.log(parentObj);
    // console.log(placeholderPos.parentDepth);

    //where was the placeholder

    //are we going in or out?

    if(placeholderPos.parentDepth){
      if(parentObj.real_depth < placeholderPos.parentDepth){
        //out
        // find nearest sibling in target parent and move placeholder above
        console.log("out");
        var placeholderParent = this.findItem(placeholderPos.parent, tree.children);
        this.setState({
          placeholderPos: {id: placeholderParent.id, position: "after", as: "sibling", parent: placeholderParent.parent, parentDepth: placeholderParent.real_depth}
        });
      }else{
        //in
        if(parentObj.children && parentObj.children.length){
          console.log("in");
          // //add placeholder to bottom of current level
          this.setState({
            placeholderPos: {id: parentObj.children[parentObj.children.length-1].id, position: "after", as: "sibling", parent: parentObj.children[parentObj.children.length-1].parent, parentDepth: parentObj.children[parentObj.children.length-1].real_depth-1}
          });
        }
      }
    }
  }

  movePlaceholderBefore(overObj, parent, parentDepth){
    let tree = this.state.tree;
    if(parent != tree.id){
      var parentObj = this.findItem(parent, tree.children);
    }
    else{
      var parentObj = tree;
    }

    //who is above me
    let overIndex = this._getNodeIndex(overObj.id, parentObj.children);

    this.setState({
      placeholderPos: {id: overObj.id, realDepth: overObj.real_depth, position: "before", as: "sibling", parent: parent, parentDepth: parentDepth}
    });

  }

  removeNode(id, items){
    for (const node of items) {
      if (node.id == id) {
        var pop = items.splice(items.indexOf(node), 1);
        return
      }

      if (node.children && node.children.length) {
        this.removeNode(id, node.children)
      }
    }
  }

  _updatePositions(startIndex, endIndex, increment, arr){
    for(var i = startIndex; i <= endIndex; i++){
      if(arr[i].status != "deleted" && arr[i].status != "new"){
        arr[i].status = "updated";
      }
      arr[i].position = i;
    }
  }

  makeNew(title, parentId, position, type, id, status, children){
    let node = {
      status: status,
      title: title,
      parent_id: parentId,
      position: position,
      type: type,
      children: children,
      id: id,
    }

    if(status == "new"){
      node.tmpId = id;
    }

    return node;
  }

  place(dropObj, dest, placeholderId, placeholderAs, placeholderPosition){
    if(placeholderAs == "sibling"){
      if(placeholderPosition == "after"){
        //check to see if placeholder is the last element in array
        var siblingIndex = this._getNodeIndex(placeholderId, dest);
        if(siblingIndex != dest.length-1){
          // dragged to middle
          console.log("middle");
          let node = this.makeNew(dropObj.title, placeholderId, siblingIndex+1, dropObj.type, dropObj.id, "updated", dropObj.children);
          dest.splice(siblingIndex+1, 0, node);
          this._updatePositions(siblingIndex+2, dest.length-1, 1, dest);
          // this.toggleChanged();
        }else{
          //dragged to bottom
          let node = this.makeNew(dropObj.title, placeholderId, dest.length, dropObj.type, dropObj.id, "updated", dropObj.children)
          dest.push(node);
        }
      }else{
        //before
        //check to see if placeholder is the first item
        var siblingIndex = this._getNodeIndex(placeholderId, dest);
        if(siblingIndex == 0){
          console.log("top");
          let node = this.makeNew(dropObj.title, placeholderId, 0, dropObj.type, dropObj.id, "updated", dropObj.children);
          dest.splice(0, 0, node);
          this._updatePositions(1, dest.length-1, 1, dest);
        }
        else{
          console.log("before middle");
          let node = this.makeNew(dropObj.title, placeholderId, siblingIndex, dropObj.type, dropObj.id, "updated", dropObj.children);
          dest.splice(siblingIndex, 0, node);
          this._updatePositions(siblingIndex+1, dest.length-1, 1, dest);
        }
      } 
    }
  }

  drop(dropObj, placeholderPos){
    //local vars
    var $this = this;
    let tree = this.state.tree;

    //check placeholder
    const placeholderId = placeholderPos.id;
    const placeholderPosition = placeholderPos.position;
    const placeholderAs = placeholderPos.as;
    const placeholderParent = placeholderPos.parent;

    // are we trying to drop into parent?
    if(placeholderAs == "parent"){
      if(placeholderId == tree.id){
        var destObj = tree;
      }
      else{
        var destObj = this.findItem(placeholderId, tree.children);
      }
    }
    else{
      if(placeholderParent == tree.id){
        var destObj = tree;
      }
      else{
        var destObj = this.findItem(placeholderParent, tree.children);
      }
    }

    let dest = destObj.children;

    console.log(dest);
    
    // const {status, errorMsg} = this.checkRestrictions(dropObj, destObj);

    // if(status != 'success'){
    //   //display error
    //   notification({
    //       message: errorMsg,
    //       type: 'danger', // can be 'success', 'info', 'warning', 'danger'
    //       duration: 10000, // time in milliseconds. 0 means infinite
    //   });
    //   return
    // }

    if(placeholderId && placeholderAs == "parent" && (_.isUndefined(dest) || _.isEmpty(dest))){
      console.log("no children");

       destObj.children = [];

      //if the drop item has a tempId
      if(dropObj.tmpId){
        //new
        var node = this.makeNew(dropObj.id, placeholderId, 0, dropObj.id, dropObj.tmpId, "new", []);
      }else{
        //existing

        //item dropped from another parent
        if(dropObj.parent != placeholderPos.id){
          if(dropObj.parent == tree.id){
            //drop object had no parent (was root child)
            var draggedIndex = this._getNodeIndex(dropObj.id, tree.children);
            this.removeNode(dropObj.id, tree.children);
            this._updatePositions(draggedIndex, tree.children.length-1, -1, tree.children);
           }else{
            //item had another parent (not root child)
            let oldParentChildren = this.findItem(dropObj.parent, tree.children).children;
            var draggedIndex = this._getNodeIndex(dropObj.id, oldParentChildren);
            this.removeNode(dropObj.id, tree.children);   
            this._updatePositions(draggedIndex, oldParentChildren.length-1, -1, oldParentChildren);
          }
        }
        // console.log(dropObj.children);
        var node = this.makeNew(dropObj.title, placeholderId, 0, dropObj.type, dropObj.id, "updated", dropObj.children);
      }

       destObj.children.push(node);
    }else{
      //new item is dragged
      if(dropObj.tmpId){
        this.place(dropObj, dest, placeholderId, placeholderAs, placeholderPosition);
      }
      else{
        //reorder

        //who is my old parent?
        //if old parent is defined
        if(!_.isUndefined(dropObj.parent)){

          //if item dropped from another parent
          if(dropObj.parent != placeholderParent){

           /* 
            * Item reordered/dropped into another parent
            */
            if(dropObj.parent == tree.id){
              console.log("root");
              //drop object had no parent (was root child)

              //need to update items for the root
              //get index of item in old parent
              var draggedIndex = this._getNodeIndex(dropObj.id, tree.children);
              this.removeNode(dropObj.id, tree.children);
              this._updatePositions(draggedIndex, tree.children.length-1, -1, tree.children);
              this.place(dropObj, dest, placeholderId, placeholderAs, placeholderPosition);

            }else{
              console.log("not root");
              //item had another parent

              //need to update items in the old parent
              //get index of item in old parent
              let oldParentChildren = this.findItem(dropObj.parent, tree.children).children;
              var draggedIndex = this._getNodeIndex(dropObj.id, oldParentChildren);
              this.removeNode(dropObj.id, tree.children);
              this._updatePositions(draggedIndex, oldParentChildren.length-1, -1, oldParentChildren);

              this.place(dropObj, dest, placeholderId, placeholderAs, placeholderPosition);
            }
          }
        }
      }
    }

    this.setState({
      tree: tree
    });
  }


  movePlaceholderAfter(overObj, parent, parentDepth){
     // console.log(overId);
      let tree = this.state.tree;
      if(parent != tree.id){
        var parentObj = this.findItem(parent, tree.children);
      }
      else{
        var parentObj = tree;
      }
      // console.log(parentObj);
      //who is below me
      let overIndex = this._getNodeIndex(overObj.id, parentObj.children);

       this.setState({
          placeholderPos: {id: overObj.id, realDepth: overObj.real_depth, position: "after", as: "sibling", parent: parent, parentDepth: parentDepth}
        });
  }

  movePlaceholderChild(overObj, parent, parentDepth){
    let tree = this.state.tree;
    //var overObj = this.findItem(overObj.id, tree.children);
      if(!overObj.children || _.isEmpty(overObj.children)){
        this.setState({
          placeholderPos: {id: overObj.id, realDepth: overObj.real_depth, position: "after", as: "parent", parent: parent, parentDepth: parentDepth}
        });
       }else{
        this.setState({
          placeholderPos: {id: overObj.children[0].id, realDepth: overObj.children[0].real_depth, position: "before", as: "sibling", parent: overObj.children[0].parent, parentDepth: parentDepth}
        });
      }
  }

  moveItem(id, afterId, nodeId) {
    if (id == afterId) return

    let {tree} = this.state

    const removeNode = (id, items) => {
      for (const node of items) {
        if (node.id == id) {
          items.splice(items.indexOf(node), 1)
          return
        }

        if (node.children && node.children.length) {
          removeNode(id, node.children)
        }
      }
    }

    const item = {...this.findItem(id, tree)}
    if (!item.id) {
      return
    }

    const dest = nodeId ? this.findItem(nodeId, tree).children : tree

    if (!afterId) {
      removeNode(id, tree)
      dest.push(item)
    } else {
      const index = dest.indexOf(dest.filter(v => v.id == afterId).shift())
      removeNode(id, tree)
      dest.splice(index, 0, item)
    }

    this.setState({tree})
  }

  findItem(id, items) {
    for (const node of items) {
      if (node.id == id) return node
      if (node.children && node.children.length) {
        const result = this.findItem(id, node.children)
        if (result) {
          return result
        }
      }
    }

    return false
  }

  render() {
    // console.log(this.state);

    return <div>
      <Tree
        parent={this.state.tree.id}
        children={this.state.tree.children}
        move={this.moveItem.bind(this)}
        find={this.findItem.bind(this)}
        movePlaceholderBefore={this.movePlaceholderBefore}
        movePlaceholderAfter={this.movePlaceholderAfter}
        placeholderPos={this.state.placeholderPos}
        resetPlaceholder={this.resetPlaceholder}
        movePlaceholderChild={this.movePlaceholderChild}
        drop={this.drop}
        moveToParent={this.moveToParent}
        realDepth={this.state.tree.real_depth}
      />
    </div>
  }
}
