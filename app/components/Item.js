import React, { Component, PropTypes } from 'react'
import { DragSource, DropTarget } from 'react-dnd'
import Tree from './Tree'
import ReactDOM from 'react-dom'

const source = {
  beginDrag(props, monitor, component) {

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
      // restrictions: dragValidParents 
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
    // const {id: draggedId} = monitor.getItem()
    // const {id: overId} = props

    // if (draggedId == overId || draggedId == props.parent) return
    // if (!monitor.isOver({shallow: true})) return

    //props.move(draggedId, overId, props.parent)

    if(monitor.isOver({ shallow: true })){
      // console.log(props)

           // Determine rectangle on screen
        let hoverBoundingRect = ReactDOM.findDOMNode(component).getBoundingClientRect();

        // Get horizontal middle
        let hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        // let hoverThird = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 3;

        let totalWidth = hoverBoundingRect.right - hoverBoundingRect.left;

        // Determine mouse position
        let clientOffset = monitor.getClientOffset();

        // Get pixels to the bottom
        let hoverClientY = hoverBoundingRect.bottom - clientOffset.y;


       //set up boundaries 

        // console.log(totalWidth * 0.2);

        if(clientOffset.x <= (totalWidth * 0.2)){
          //we want to add this as a sibling

              if (hoverClientY > hoverMiddleY) {
                //before
                // console.log("before");
                 props.movePlaceholderBefore(props.item.id, props.parent);
              } 
              else {
                //after
                // console.log("after");
                props.movePlaceholderAfter(props.item.id, props.parent);
              }   

        }else{
          //we want to add this as a child
          // console.log("child");
          props.movePlaceholderChild(props.item.id, props.parent);
        }
    }
  }
}

@DropTarget('ITEM', target, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource('ITEM', source, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
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
      item: {id, title, children, outline_title, type}, parent, move, 
      find, movePlaceholderBefore, movePlaceholderAfter, placeholderPos, resetPlaceholder,
      movePlaceholderChild, drop
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
          >{outline_title}</div>
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
        />
      </li>
    ))
  }
}
