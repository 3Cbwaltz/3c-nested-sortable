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

      //TODO find a better way to do restrictions
      if(props.placeholderPos.as){
        if(props.placeholderPos.as == "sibling"){
          if(props.dragRestrictions[props.parentType].validChildren != '*'){
            if(_.indexOf(props.dragRestrictions[props.parentType].validChildren, type) == -1){
              restrictionsPassed = false;
            }
          }
        }else{
          if(props.dragRestrictions[props.item.type].validChildren != '*'){
            if(_.indexOf(props.dragRestrictions[props.item.type].validChildren, type) == -1){
              restrictionsPassed = false;
            }
          }
        }

        if(props.dragRestrictions[props.item.type].validParents != '*'){
          if(_.indexOf(props.dragRestrictions[props.item.type].validParents, type) == -1){
            restrictionsPassed = false;
          }
        }

      }
      else{
         if(props.dragRestrictions[props.parentType].validChildren != '*'){
          if(_.indexOf(props.dragRestrictions[props.parentType].validChildren, type) == -1){
            restrictionsPassed = false;
          }
        }

        if(props.dragRestrictions[props.item.type].validParents != '*'){
          if(_.indexOf(props.dragRestrictions[props.item.type].validParents, type) == -1){
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
          if(_.indexOf(props.dragRestrictions[props.item.type].validChildren, type) == -1){
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
    find   : PropTypes.func
  };

  static contextTypes = {
    onItemSingleClick: React.PropTypes.func,
    onItemDoubleClick: React.PropTypes.func,
    onItemRename: React.PropTypes.func
  };

  constructor(props) {
    super(props);
    // this.handleMouseOver = this.handleMouseOver.bind(this);
    // this.handleMouseOut = this.handleMouseOut.bind(this);
    // this._deleteButton = this._deleteButton.bind(this);
    // this._revertButton = this._revertButton.bind(this);
    // this._confirmEditButton = this._confirmEditButton.bind(this);
    // this.onEditClick = this.onEditClick.bind(this);
    // this.onDeleteClick = this.onDeleteClick.bind(this);
    // this.onRevertClick = this.onRevertClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.enableRename = this.enableRename.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.getClickHandler = this.getClickHandler.bind(this);
    this.inputEscape = this.inputEscape.bind(this);
    this.onKey = this.onKey.bind(this);
    // this.collapseExpand = this.collapseExpand.bind(this);
    // this.addExpandCollapseBtn = this.addExpandCollapseBtn.bind(this);
  }


  state = {
    nodeTitleCopy: this.props.item.title,
    nodeTitle: this.props.item.title,
    editing: false,
  };

  getClickHandler(onClick, onDblClick, delay) {
    var timeoutID = null;
    delay = delay || 250;

    return function (event) {
        if (!timeoutID) {
            timeoutID = setTimeout(function () {
                onClick(event);
                timeoutID = null
            }, delay);
        } else {
            timeoutID = clearTimeout(timeoutID);
            onDblClick(event);
        }
    };
  }

  enableRename(){
    this.setState({ 
        editing: true,
        nodeTitleCopy: this.state.nodeTitle,
    });
  }

  getInput(){

    var inputStyle = {
      backgroundColor: '#ffffff',
     resize: "none",
     overflow: "hidden",
     display: "block",
     width: "100%"
    }

    return(
      <input
        ref="editable"
        type="text" 
        className="form-control"
        style={inputStyle} 
        autoFocus={true}
        value={this.state.nodeTitle} 
        onChange={this.onChange} 
        onKeyDown={this.onKey}
      />
    );
  }

  inputEscape(){
    this.setState({
        nodeTitle: this.state.nodeTitleCopy,
        editing: false
    });

    // this.props.onRenameCancel(this.props.item);
  }

  onKey(e){
    var key = e.keyCode;

    if(key == 13){
        //enter
        this.handleBlur();
    }
    else if(key == 27){
        //escape
        this.inputEscape(); 
    }
    
  }

  onChange(event) {
    this.setState({nodeTitle: event.target.value});
  }

  handleBlur(){
    //only if title text has changed
    if(this.state.nodeTitleCopy != this.state.nodeTitle){
        //set editing true
        this.setState({ editing: false });
        this.context.onItemRename(this.props.item, this.state.nodeTitle);
    }
    else{
        this.setState({ editing: false});
    }
  }

  render() {
    const {
      connectDropTarget, connectDragPreview, connectDragSource,
      item: {id, title, children, outline_title, type, real_depth}, parent, 
      find, movePlaceholderBefore, movePlaceholderAfter, placeholderPos, 
      resetPlaceholder, movePlaceholderChild, drop, moveToParent, 
      dragRestrictions
    } = this.props

    if(this.props.isDragging){
      return null;
    }

    if(this.state.editing){
      var titleArea = this.getInput();
    }else{
      var titleArea = title;
    }

    return connectDropTarget(connectDragPreview(
      <li style={{listStyleType: "none"}}>
        {connectDragSource(
          <div style={{
            background: 'white',
            border: '1px solid #ccc',
            padding: '1em',
            cursor: "move"
          }}
          onClick={this.getClickHandler(this.context.onItemSingleClick.bind(null, this.props.item), this.enableRename.bind(null, this.props.item))}
          >{titleArea}</div>
        )}
        <Tree
          parent={id}
          children={children}
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
