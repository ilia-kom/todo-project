import { Draggable } from "react-beautiful-dnd";
import { ToDoLine } from "./ToDoLine";
import Spinner from '../spinner.png';

import React from "react";

export class ToDoList extends React.Component {

    countFiltered() {
      let counter = 0;
      const { filter, lines } = this.props;
      for (let i of lines) {
        if ((i.active && (filter.all || filter.onlyActive)) || (!i.active && (filter.all || filter.onlyCompleted))) counter++;
      }
      return counter;
    }
  
    render() {

        if (this.props.fetching) return  <div className='toDoList'><img className="loadingPlaceholder" src={Spinner}/></div>

      const filter = this.props.filter;
      const token = localStorage.getItem("token");
  
      if (this.countFiltered() === 0) {
        if (this.props.lines.length === 0) {
          return (
            <div className='noElementsPlaceholder'>Let's start!
              </div>
            
          );
        }
        if (filter.onlyActive) {
          return <div className='noElementsPlaceholder'>No active tasks</div>
        }
        if (filter.onlyCompleted) {
          return <div className='noElementsPlaceholder'>No completed tasks</div>
        }
      } else {
        return (
          <div className='toDoList'>
            {this.props.lines.map((row, rowNum) => {
              if ((row.active && (filter.all || filter.onlyActive)) || (!row.active && (filter.all || filter.onlyCompleted))) {
                return (
                  <Draggable key={row.key} draggableId={'row' + row.key} index={rowNum}>
                    {(provided, snapshot) => {
                      return (
                        <ToDoLine
                          key={row.key}
                          text={row.text}
                          markCompleted={() => this.props.markCompleted(rowNum)}
                          deleteLine={() => this.props.deleteLine(rowNum)}
                          provided={provided}
                          innerRef={provided.innerRef}
                          isDragging={snapshot.isDragging}
                          active={row.active}
                        />
                      )
                    }}
                  </Draggable>
                )
              }
            })}
          </div>
        )
      }
    }
  }