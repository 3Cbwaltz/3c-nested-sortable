import React, { Component, PropTypes } from 'react'
import { DropTarget } from 'react-dnd'
import Item from './Item'
import _ from 'lodash'
import $ from 'jquery';

const target = {
  drop(props, monitor, component) {

    const hasDroppedOnChild = monitor.didDrop();
    if (hasDroppedOnChild) {
      return;
    }
    props.drop(monitor.getItem(), props.placeholderPos, props.parent);

    props.resetPlaceholder();
  },

  hover(props, monitor, component) {
    const {id: draggedId, parent, items, restrictions, type} = monitor.getItem()
    // console.log(component);
    

    if (!monitor.isOver({shallow: true})) return

    // if (descendantNode) return
    if (parent == props.parent || draggedId == props.parent) return



    // component.setState({
    //   restrictionsPassed: restrictionsPassed
    // });
      
    if(props.placeholderPos.parent != props.parent){
      props.moveToParent(props.parent, props.placeholderPos, props.realDepth);
    }
  }
}

@DropTarget('ITEM', target, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({ shallow: true }) 
}))
export default class Tree extends Component {
  static propTypes = {
    children  : PropTypes.array,
    parent : PropTypes.any,
    move   : PropTypes.func.isRequired,
    find   : PropTypes.func.isRequired
  };

  state = {
    restrictionsPassed: true
  };

  render() {
    // console.log(this.state.restrictionsPassed);
    const {connectDropTarget, children, parent, move, find, 
      movePlaceholderBefore, movePlaceholderAfter,
    placeholderPos, resetPlaceholder, movePlaceholderChild, isOverCurrent, drop,
    moveToParent, realDepth, dragRestrictions, type} = this.props
  
    if(children && !_.isEmpty(children)){
      var itemArr = [];
      this.props.children.forEach(function(item) {

        if(this.props.placeholderPos.position == "before"){
          if(this.props.placeholderPos.as == "sibling"){
            if(item.id === this.props.placeholderPos.id){
                itemArr.push(<li style={{backgroundColor: "#ccc", height: "50px", listStyleType: "none"}} key="placeholder"></li>);
            }
          }
        }

        itemArr.push(
          <Item
              key={item.id}
              id={item.id}
              parent={parent}
              item={item}
              move={move}
              find={find}
              movePlaceholderBefore={movePlaceholderBefore}
              movePlaceholderAfter={movePlaceholderAfter}
              placeholderPos={placeholderPos}
              resetPlaceholder={resetPlaceholder}
              movePlaceholderChild={movePlaceholderChild}
              drop={drop}
              moveToParent={moveToParent}
              parentDepth={realDepth}
              dragRestrictions={dragRestrictions}
              parentType={type}
            />
        );

        if(this.props.placeholderPos.as == "sibling"){
          if(this.props.placeholderPos.position == "after"){
            if(item.id === this.props.placeholderPos.id){
                itemArr.push(<li style={{backgroundColor: "#ccc", height: "50px", listStyleType: "none"}} key="placeholder"></li>);
            }
          }
        }

      }.bind(this));
    }else{
      var itemArr = [];
      if(this.props.placeholderPos.as == "parent"){
       if(parent === this.props.placeholderPos.id){
            itemArr.push(<li style={{backgroundColor: "#ccc", height: "50px", listStyleType: "none"}} key="placeholder"></li>);
        }
      }
    }

    return connectDropTarget(
      <ul>
        {itemArr}
      </ul>
    )
  }
}
