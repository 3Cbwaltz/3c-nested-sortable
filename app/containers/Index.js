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
    this.findLastLeaf = this.findLastLeaf.bind(this);
    this.movePlaceholderChild = this.movePlaceholderChild.bind(this);
  }

  state = {
    tree: {
      id: 99999999999,
      title: 'root',
      children: [
        {
          id: 1, 
          title: 'Tatooine',
          children: [
            {
              id: 2, 
              title: 'Endor', 
              children: [
                {
                  id: 4, 
                  title: 'Dagobah', 
                  children: []
                }
              ]
            },
            {
              id: 3, 
              title: 'Hoth', 
              children: []
            },
          ]
        },
        {
          id: 5, 
          title: 'Death Star',
          children: [
            {
              id: 9,
              title: 'Carlac',
              children: []
            },
            {
              id: 10,
              title: 'Kalevala',
              children: []
            }
          ]
        },
        {
          id: 6, 
          title: 'Alderaan',
          children: [
            {
              id: 7, 
              title: 'Bespin',
              children: [
                {
                  id: 8, 
                  title: 'Jakku', 
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

  movePlaceholderBefore(overId, parent){
    // console.log(overId);
    let tree = this.state.tree;
    if(parent != tree.id){
      var parentObj = this.findItem(parent, tree.children);
    }
    else{
      var parentObj = tree;
    }
    // console.log(parentObj);
    //who is above me
    let overIndex = this._getNodeIndex(overId, parentObj.children);

    // if(overIndex != 0){
    //   // console.log("not zero");
    //   //Not over the first item
    //   var nextObj = parentObj.children[overIndex - 1];

    //   //is nextObj a parent?
    //   if(nextObj.children && !_.isEmpty(nextObj.children)){
    //     // console.log("has children");
    //     //find last leaf
    //     var lastChild = nextObj.children[nextObj.children.length-1];
    //     var lastLeaf = this.findLastLeaf(lastChild);
    //     this.setState({
    //       placeholderPos: {id: lastLeaf.id, position: "after"}
    //     });

    //   }else{
    //     this.setState({
    //       placeholderPos: {id: overId, position: "before"}
    //     });
    //   }

    // }
    // else{
      this.setState({
          placeholderPos: {id: overId, position: "before"}
        });
    // }

  }
  movePlaceholderAfter(overId, parent){
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
      let overIndex = this._getNodeIndex(overId, parentObj.children);

       this.setState({
          placeholderPos: {id: overId, position: "after"}
        });
  }

  movePlaceholderChild(overId, parent){
    console.log(overId);
    let tree = this.state.tree;
    var overObj = this.findItem(overId, tree.children);

      if(!overObj.children || _.isEmpty(overObj.children)){
        this.setState({
          placeholderPos: {id: overObj.id, position: "parent"}
        });
      }
  }

  findLastLeaf(rootNode){
    if (rootNode.children && rootNode.children.length){
      var last = this.findLastLeaf(rootNode.children[rootNode.children.length-1]);
    }
    else{
      return rootNode;
    }

    return last;
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
    // const {tree} = this.state;

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
      />
    </div>
  }
}
