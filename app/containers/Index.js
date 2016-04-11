import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import DragList from '../components/DragList'
import Home from '../components/Home';

export default class Item extends Component {

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
            type: 'org',
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
            type: 'org',
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
      dragRestrictions: {
        org: {
          validParents: ['flow','org'], 
          validChildren: '*', 
        },
        flow: {
          validParents: [], 
          validChildren: ['org'], 
        },
        assistant: {
          validParents: '*', 
          validChildren: [], 
        },
        html: {
          validParents: '*', 
          validChildren: [], 
        },
        game: {
          validParents: '*', 
          validChildren: [], 
        },
        iframe: {
          validParents: '*', 
          validChildren: [], 
        },
      },
      nodeItems: [
      {
          title: "Org",
          type: "org",
          description: "Node 1 description"
      },
      {
          title: "Assistant",
          type: "assistant",
          description: "Node 2 description"
      },
    ]
    };

    constructor(props) {
      super(props);
      this.onSingleClick = this.onSingleClick.bind(this);
      this.onItemRename = this.onItemRename.bind(this);
      this.onItemDelete = this.onItemDelete.bind(this);
    }

    onSingleClick(obj){
      console.log(obj);
    }

    onDoubleClick(obj){
      console.log(obj);
    }

    onItemRename(obj, newTitle){
      let tree = this.state.tree;
      var renameObj = this.findItem(obj.id, tree.children);

      if(renameObj.status != "deleted" && renameObj.status != "new"){
        renameObj.status = "updated"; 
      }
      
      renameObj.title = newTitle;

      this.setState({
        tree: tree,
      });

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

  onItemDelete(obj){
    console.log(obj);
  }

  onItemDeleteRevert(){
    
  }

    render() {
        return (
          <div>
            <Home 
              tree={this.state.tree} 
              restrictions={this.state.dragRestrictions}
              rootType="Flow"
              onItemSingleClick={this.onSingleClick}
              onItemRename={this.onItemRename}
              onItemDelete={this.onItemDelete}
            />
            <DragList items={this.state.nodeItems} dragRestrictions={this.state.dragRestrictions} />
          </div>
        );
    }
}
