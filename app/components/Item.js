import React, { Component, PropTypes } from 'react'
import { DragSource, DropTarget } from 'react-dnd'
import Tree from './Tree'
import ReactDOM from 'react-dom'
import $ from 'jquery';
const source = {
  beginDrag(props, monitor, component) {

    //get restrictions
    let dragValidParents = props.dragRestrictions[props.item.type].validParents;

    return {
      id: props.id,
      parent: props.parent,
      outline_title: props.item.outline_title,
      children: props.item.children,
      title: props.item.title,
      type: props.item.type,
      // deleted: props.item.deleted,
      // new: props.item.new,
      // height: ReactDOM.findDOMNode(component).offsetHeight,
      restrictions: dragValidParents 
    }
  },

  isDragging(props, monitor) {
    return props.id == monitor.getItem().id
  },
}

const target = {
  canDrop() {
    return false
  },

  hover(props, monitor, component) {

    const {id: draggedId, parent, items, restrictions, type} = monitor.getItem()

    if(monitor.isOver({ shallow: true })){
      var restrictionsPassed = true;
      // console.log(props.placeholderPos.as);

      if(props.placeholderPos.as){
        if(props.placeholderPos.as == "sibling"){
          if(props.dragRestrictions[props.parentType].validChildren != '*'){
            if(_.indexOf(props.dragRestrictions[props.parentType].validChildren, type) == -1){
              // console.log("valid sibling failed");
              restrictionsPassed = false;
            }
          }
        }else{
          if(props.dragRestrictions[props.item.type].validChildren != '*'){
            // console.log(props.dragRestrictions[props.item.type].validChildren);
            if(_.indexOf(props.dragRestrictions[props.item.type].validChildren, type) == -1){
              // console.log("valid children failed");
              restrictionsPassed = false;
            }
          }
        }

        if(props.dragRestrictions[props.item.type].validParents != '*'){
          if(_.indexOf(props.dragRestrictions[props.item.type].validParents, type) == -1){
            // console.log("valid parents failed");
            restrictionsPassed = false;
          }
        }

      }
      else{
        // console.log("no placeholderAs");

         if(props.dragRestrictions[props.parentType].validChildren != '*'){
          if(_.indexOf(props.dragRestrictions[props.parentType].validChildren, type) == -1){
            console.log("valid children failed");
            restrictionsPassed = false;
          }
        }

        if(props.dragRestrictions[props.item.type].validParents != '*'){
          if(_.indexOf(props.dragRestrictions[props.item.type].validParents, type) == -1){
            console.log("valid parents failed");
            restrictionsPassed = false;
          }
        }
      }

    

      if(restrictionsPassed == true){


      // Determine rectangle on screen
      let hoverBoundingRect = ReactDOM.findDOMNode(component).getBoundingClientRect();
      
      // Get horizontal middle
      let hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // let hoverThird = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 3;

      let totalWidth = hoverBoundingRect.right - hoverBoundingRect.left;

      // Determine mouse position\
      let clientOffset = monitor.getClientOffset();
      
      // Get pixels to the bottom
      let hoverClientY = hoverBoundingRect.bottom - clientOffset.y;


       //set up boundaries 
      if(clientOffset.x <= (totalWidth * 0.2)){
        //we want to add this as a sibling
        if (hoverClientY > hoverMiddleY) {
          //before
           props.movePlaceholderBefore(props.item, props.parent, props.parentDepth);
        } 
        else {
          //after
          props.movePlaceholderAfter(props.item, props.parent, props.parentDepth);
        }   
      }else{
        //we want to add this as a child
          let restrict = true
         if(props.dragRestrictions[props.item.type].validChildren != '*'){
          // console.log(props.dragRestrictions[props.item.type].validChildren);
          if(_.indexOf(props.dragRestrictions[props.item.type].validChildren, type) == -1){
            console.log("valid children failed");
            restrict = false;
          }
        }

        if(restrict){
          props.movePlaceholderChild(props.item, props.parent, props.parentDepth);
        }
      }
    }
    }
  }
}


@DragSource('ITEM', source, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
}))
@DropTarget('ITEM', target, connect => ({
  connectDropTarget: connect.dropTarget()
}))
export default class Item extends Component {
  static propTypes = {
    id     : PropTypes.any,
    parent : PropTypes.any,
    item   : PropTypes.object,
    move   : PropTypes.func,
    find   : PropTypes.func
  };

  render() {
    const {
      connectDropTarget, connectDragPreview, connectDragSource,
      item: {id, title, children, outline_title, type, real_depth}, parent, move, 
      find, movePlaceholderBefore, movePlaceholderAfter, placeholderPos, resetPlaceholder,
      movePlaceholderChild, drop, moveToParent, dragRestrictions
    } = this.props

    if(this.props.isDragging){
      return null;
    }

    return connectDropTarget(connectDragPreview(
      <li style={{listStyleType: "none"}}>
        {connectDragSource(
          <div style={{
            background: 'white',
            border: '1px solid #ccc',
            padding: '1em',
            cursor: "move"
            // marginBottom: -1
          }}
          >{title}</div>
        )}
        <Tree
          parent={id}
          children={children}
          move={move}
          find={find}
          movePlaceholderBefore={movePlaceholderBefore}
          movePlaceholderAfter={movePlaceholderAfter}
          placeholderPos={placeholderPos}
          resetPlaceholder={resetPlaceholder}
          movePlaceholderChild={movePlaceholderChild}
          drop={drop}
          moveToParent={moveToParent}
          realDepth={real_depth}
          dragRestrictions={dragRestrictions}
          type={type}
        />
      </li>
    ))
  }
}
