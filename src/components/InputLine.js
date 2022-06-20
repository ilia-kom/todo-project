import React from "react";

export class InputLine extends React.Component {

  onFocus() {
    document.querySelector('.addBtn').hidden = false;
  }

  onBlur() {
    setTimeout(() => document.querySelector('.addBtn').hidden = true, 100)
  }

  async onSubmit(event) {
    await this.props.onSubmit(event);
    document.querySelector("inputLine").focus();
  }

    render() {
      return (
        <form name='inputLine' className="inputForm" onSubmit={async (event) => {await this.props.onSubmit(event); document.querySelector(".inputLine").focus()}}  >
          <input type='text' className='inputLine' placeholder='What will we do today?'  />
          <input type='submit' value="Add" className="addBtn" />
        </form>
      );
    }
  }
  //onFocus={this.onFocus} onBlur={this.onBlur}