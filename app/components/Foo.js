import React, { Component, PropTypes } from 'react'
import { DragSource, DropTarget } from 'react-dnd'

const source = {
  beginDrag(props) {
    return {
      id: props.id,
      parent: 1,
      items: []
    }
  },

  isDragging(props, monitor) {
    return props.id == monitor.getItem().id
  }
}


@DragSource('ITEM', source, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
}))
export default class Foo extends Component {
  static propTypes = {
    id     : PropTypes.any.isRequired,
    parent : PropTypes.any,
    item   : PropTypes.object,
    move   : PropTypes.func,
    find   : PropTypes.func
  };

  render() {
    const {
      connectDropTarget, connectDragPreview, connectDragSource,
    } = this.props

    return connectDragPreview(
      <div>
        {connectDragSource(
          <div style={{
            background: 'white',
            border: '1px solid #ccc',
            padding: '1em',

          }}
          >I am draggable</div>
        )}
      </div>
    )
  }
}
