import React from "react";

export class BottomBlock extends React.Component {
  render() {
    const { lines, filter } = this.props;

    if (lines.length === 0) {
      return (
        <div></div>
      )
    }
    let remain = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].active) { remain++ }
    }

    let remainText;

    if (remain === 1) {
      remainText = "1 task remain"
    } else remainText = remain + " tasks remain";


    return (
      <div className='bottomBlock'>
        <div className='col' style={{textAlign: "left"}}>{remainText}</div>
        <div className='filterBlock' style={{}}>
          <div className='filterBtn col' onClick={this.props.filterAll}><span className={(filter.all ? ' selected' : '')} >All</span></div>
          <div className='filterBtn col' onClick={this.props.filterActive}><span className={(filter.onlyActive ? ' selected' : '')} >Active</span></div>
          <div className='filterBtn col' onClick={this.props.filterCompleted}><span className={(filter.onlyCompleted ? ' selected' : '')} >Completed</span></div>
        </div>
        <div className={'filterBtn col'} onClick={this.props.clearAll} style={{textAlign: "right"}}>Clear all</div>
      </div>

    )
  }
}