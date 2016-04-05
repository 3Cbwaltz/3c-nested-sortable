import React, { Component, PropTypes } from 'react'
import { DropTarget } from 'react-dnd'
import Item from './Item'
import _ from 'lodash'

const target = {
  drop(props, monitor, component) {
    props.resetPlaceholder();
  },

  hover(props, monitor) {
    const {id: draggedId, parent, items} = monitor.getItem()

    if (!monitor.isOver({shallow: true})) return

    // const descendantNode = props.find(props.parent, items)
    // if (descendantNode) return
    if (parent == props.parent || draggedId == props.parent) return
      
    // props.move(draggedId, props.id, props.parent)
    console.log(props.parent);
    props.movePlaceholderChild(props.parent, null);
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

  render() {
    // console.log(this.props);
    const {connectDropTarget, children, parent, move, find, 
      movePlaceholderBefore, movePlaceholderAfter,
    placeholderPos, resetPlaceholder, movePlaceholderChild, isOverCurrent} = this.props
  
    if(children && !_.isEmpty(children)){
      var itemArr = [];
      this.props.children.forEach(function(item) {

        if(this.props.placeholderPos.position == "before"){
            if(/*(isOver && this.state.restrictionsPassed) &&*/ item.id === this.props.placeholderPos.id){
                itemArr.push(<li style={{backgroundColor: "grey", height: "50px", listStyleType: "none", marginTop: "10px"}} key="placeholder"></li>);
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
            />
        );

        if(this.props.placeholderPos.position == "after"){
            if(/*(isOver && this.state.restrictionsPassed) &&*/ item.id === this.props.placeholderPos.id){
                itemArr.push(<li style={{backgroundColor: "grey", height: "50px", listStyleType: "none", marginTop: "10px"}} key="placeholder"></li>);
            }
        }

      }.bind(this));
    }else{
      var itemArr = [];
      if(this.props.placeholderPos.position == "parent"){
       if(/*(isOver && this.state.restrictionsPassed) &&*/ parent === this.props.placeholderPos.id){
            itemArr.push(<li style={{backgroundColor: "grey", height: "50px", listStyleType: "none", marginTop: "10px"}} key="placeholder"></li>);
        }
      }
    }

    var style = {
      position: 'relative',
        // marginLeft: '2em',
        // border: "1px solid black",
        // backgroundColor: "#ccc",
        minHeight: 10,
        paddingTop: 10,
        marginTop: -11
    };
    // if((isOverCurrent)){
    //     style.backgroundColor = "#ddd";
    // }


    return connectDropTarget(
      <ul style={style}>
        {itemArr}
      </ul>
    )
  }
}
