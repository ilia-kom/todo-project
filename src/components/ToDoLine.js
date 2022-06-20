import React from "react";

export class ToDoLine extends React.Component {

    render() {
      const { provided, innerRef } = this.props;
      return (
        <div className={'toDoLine'} {...provided.draggableProps} {...provided.dragHandleProps} ref={innerRef}>
          <label className={'toDoLine__body' + (this.props.active ? '' : '_completed')}>
            <input type='checkbox' checked={!this.props.active} onClick={() => this.props.markCompleted()} className='checkbox' />
            <div className='checkbox_fake'></div>
            <span className='toDoLine__text'>{this.props.text}</span>
          </label>
          <div className='closeButton' onClick={() => this.props.deleteLine()} >{'╳'}</div>
        </div>
      );
    }
  }