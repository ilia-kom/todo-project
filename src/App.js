import logo from './logo.svg';
import myPhoto from './me.jpg'
import './App.scss';
import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Route, Routes, BrowserRouter, NavLink } from 'react-router-dom';


class InputLine extends React.Component {
  render() {
    return (
      <form name='inputLine' onSubmit={async (event) => await this.props.onSubmit(event)}>
        <input type='text' className='inputLine' placeholder='What will we do today?' />
      </form>
    );
  }
}

class ToDoLine extends React.Component {

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

class ToDoList extends React.Component {

  countFiltered() {
    let counter = 0;
    const { filter, lines } = this.props;
    for (let i of lines) {
      if ((i.active && (filter.all || filter.onlyActive)) || (!i.active && (filter.all || filter.onlyCompleted))) counter++;
    }
    return counter;
  }

  render() {
    const filter = this.props.filter;
    const token = sessionStorage.getItem("token");

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

class BottomBlock extends React.Component {
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

class Login extends React.Component {

  async onSubmit(event) {
    event.preventDefault();
    let login = document.getElementById("login").value.trim();
    let password = document.getElementById("password").value.trim();
    try {
      let response = await fetch("http://localhost:58128/token?username="+login+"&password="+password, {
        method: "POST",
        headers: {"Accept": "application/json"}
      });
      if (response.ok) {
        let result = await response.json();
        sessionStorage.setItem("token", result.access_token);
        sessionStorage.setItem("user", result.username);
        document.location = "todo-project";
      } else {
        let warning = document.querySelector(".loginWarning");
        warning.innerHTML = "Wrong login or password. Try again!";
        warning.hidden = false;
      }
    }
    catch(e) {
      alert(e);
    }
  }
  
  signOut() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    document.location = "todo-project";
  }

  render() {
    const token = sessionStorage.getItem("token");
    return (
      <div className='navLink' style={{ textAlign: 'left' }}>
        {token ? sessionStorage.user + " | " : ""} {token? <a onClick={this.signOut}>Sign out</a> : <a data-bs-toggle="modal" data-bs-target="#loginModal">Sign in</a> }
        
        
        <div className="modal fade" id="loginModal">
          <div className="modal-dialog">
            <div className="modal-content">

            <form onSubmit={(e) => this.onSubmit(e)}>
              <div className="modal-header">
                <h4 className="modal-title">Modal Heading</h4>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>


              <div className="modal-body">
                <table><tbody>
                  <tr>
                    <td><label for="login">Login</label></td>
                    <td><input type="email" id="login" className='form-control'/></td>
                  </tr>
                  <tr>
                    <td><label for="password">Password</label></td>
                    <td><input type="password" id="password" className='form-control'/></td>
                  </tr>
                  </tbody></table>
                <div className='loginWarning alert alert-warning fade show' hidden={true}></div>
                
              </div>


              <div className="modal-footer">
                <input type="submit" value="Sign In" className='btn btn-primary'></input>
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
              </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class ToDoApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lines: [],
      counter: 0,
      filter: {
        onlyActive: false,
        onlyCompleted: false,
        all: true,
      },
      token: null
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteLine = this.deleteLine.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.markCompleted = this.markCompleted.bind(this);
    this.filterActive = this.filterActive.bind(this);
    this.filterCompleted = this.filterCompleted.bind(this);
    this.filterAll = this.filterAll.bind(this);
    this.clearAll = this.clearAll.bind(this);
  }

  async componentDidMount() {

    if (sessionStorage.getItem("token")) {
      
      
        
        const response = await fetch("http://localhost:58128/api/todo", {
          method: "GET",
          headers: {"Authorization": "Bearer "+sessionStorage.getItem("token")}
        });
        if (response.ok) {
          const tasks = await response.json();
          let updatedLines = []; let i=0;
          for(let t of tasks) {
            updatedLines[i] = {};
            updatedLines[i].key = t.id;
            updatedLines[i].text = t.text;
            updatedLines[i].active = !t.completed;
            i++;
          }
          this.setState({
            lines: updatedLines,
          });
        } else if(response.status === 401) {
          sessionStorage.removeItem("token");
          document.location = 'todo-project';
        } else alert(response.status + ": " + response.statusText);

      }
    
    } 
  
    
  

  async checkAuthorization() {
    const token = sessionStorage.getItem("token");
    const response = await fetch("http://localhost:58128/api/authcheck", {
      headers: {"Authorization": "Bearer "+sessionStorage.getItem("token")}
    });
    return response.ok;
  }

  async getTasks() {

  }


  async deleteLine(rowNum) {
    try {
      const response = await fetch("http://localhost:58128/api/todo/" + this.state.lines[rowNum].key, {
        method: "DELETE",
        headers: { "Accept": "application/json", "Content-Type": "application/json", "Authorization": "Bearer "+sessionStorage.getItem("token")},
      });
      //alert(response.status +": "+ response.statusText);
      if (response.status === 200) {
        let stateLines = this.state.lines.slice();
        stateLines.splice(rowNum, 1);
        this.setState({
          lines: stateLines,
        }) 
      } else alert("Something's gone wrong! Server response: " + response.status +": "+ response.statusText);
    }
    catch(e) {
      alert(e);
    }   
  }

  async handleSubmit(event) {
    event.preventDefault();
    let text = event.target.firstElementChild.value.slice();
    text = text.trim();

    if (text === '') {
      return;
    }

    try {
      const response = await fetch("http://localhost:58128/api/todo", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer "+sessionStorage.getItem("token") },
        body: JSON.stringify({
            "Text": text,
            "Completed": false
        })
      });
      //alert(response.status +": "+ response.statusText);
      if (response.status === 200) {
          const task = await response.json();
          this.setState({
            lines: this.state.lines.concat([
              {
                key: task.id,
                text: text,
                active: true,
              }
            ]),
            counter: this.state.counter + 1,
          });
          event.target.firstElementChild.value = '';
      } else alert("Something's gone wrong! Server response: " + response.status +": "+ response.statusText);
    }
    catch(e) {
      alert(e);
    }

    // this.setState({
    //   lines: this.state.lines.concat([
    //     {
    //       key: this.state.counter,
    //       text: text,
    //       active: true,
    //     }
    //   ]),
    //   counter: this.state.counter + 1,
    // });
     //event.target.firstElementChild.value = '';
     //event.preventDefault();
  }

  onDragEnd(result) {

    const { destination, source, draggableId } = result;

    if (!destination) {
      return
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    let ourLines = this.state.lines.slice(0, this.state.lines.length);
    let sourceLine = ourLines.splice(source.index, 1);
    ourLines.splice(destination.index, 0, ...sourceLine);

    this.setState(
      {
        lines: ourLines,
      }
    )
  }

  async markCompleted(rowNum) {
    let lines = this.state.lines.slice();

    try {
      const response = await fetch("http://localhost:58128/api/todo", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer "+sessionStorage.getItem("token") },
        body: JSON.stringify({
            "Id": lines[rowNum].key,
            "Text": lines[rowNum].text,
            "Completed": !(!lines[rowNum].active)
        })
      });
      //alert(response.status +": "+ response.statusText);
      if (response.status === 200) {
        lines[rowNum].active = !lines[rowNum].active;
        this.setState({
          lines: lines,
        });
      } else alert("Something's gone wrong! Server response: " + response.status +": "+ response.statusText);
    }
    catch(e) {
      alert(e);
    }

    

  }

  filterActive() {
    this.setState({
      filter: {
        onlyActive: true,
        onlyCompleted: false,
        all: false,
      }
    })
  }

  filterCompleted() {
    this.setState({
      filter: {
        onlyActive: false,
        onlyCompleted: true,
        all: false,
      }
    })
  }

  filterAll() {
    this.setState({
      filter: {
        onlyActive: false,
        onlyCompleted: false,
        all: true,
      }
    })
  }

  async clearAll() {
    try {
      const response = await fetch("http://localhost:58128/api/todo", {
        method: "DELETE",
        headers: { "Accept": "application/json", "Content-Type": "application/json", "Authorization": "Bearer "+sessionStorage.getItem("token") },
      });
      //alert(response.status +": "+ response.statusText);
      if (response.status === 200) {
        this.setState({
          lines: [],
          counter: 0,
          filter: {
            onlyActive: false,
            onlyCompleted: false,
            all: true,
          }
        })
      } else alert("Something's gone wrong! Server response: " + response.status +": "+ response.statusText);
    }
    catch(e) {
      alert(e);
    }   
  }




  render() {

    return (
      <BrowserRouter>
      <div className='appContainer'>
        <div className='navBlock' style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
          <Login/>
          <div className='navLink' style={{textAlign: 'right'}}>
            <Routes>
              <Route path="/todo-project/about" element={<NavLink  to="/todo-project">Back to App</NavLink>}/>
              <Route path="/todo-project" element={<NavLink  to="/todo-project/about">About</NavLink>}/>
            </Routes>
          </div>
        </div>
        <h1 className='mt-5'>mylittletodo</h1>
        <Routes>
          <Route path='/todo-project' element={
            <div className='toDo'>
              <InputLine onSubmit={this.handleSubmit} />
              <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId={'ToDo'}>
                  {(provided) => {
                    return (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        <ToDoList
                          lines={this.state.lines}
                          deleteLine={this.deleteLine}
                          innerRef={provided.innerRef}
                          provided={provided}
                          placeholder={provided.placeholder}
                          markCompleted={this.markCompleted}
                          filter={this.state.filter}/>
                        {provided.placeholder}
                      </div>
                    )
                  }}
                </Droppable>
              </DragDropContext>
              <BottomBlock
                lines={this.state.lines}
                filter={this.state.filter}
                filterAll={this.filterAll}
                filterActive={this.filterActive}
                filterCompleted={this.filterCompleted}
                clearAll={this.clearAll}/>
            </div>}/>
            <Route path='/todo-project/about' element={<About/>}/>
          </Routes>
          </div>
        </BrowserRouter>
      

    )
  }
}

class About extends React.Component {
  render() {
    return (
      <div className='about'>
        <div className='about__mainContainer'>
          <div className='about__textContainer'>
            <h3>Hi!</h3>
            <p>My name is Ilya. You're using my small to do list project.</p>
            <p> I've made it to enhance my React knowledge and make my understanding of its main concepts more practical.</p>
            <p>What you can do with <strong>mylittletodo</strong>:</p>
            <ul className='about-list'>
              <li>Add new tasks to the To Do List</li>
              <li>Change tasks order by drag-and-drop</li>
              <li>Mark task as completed</li>
              <li>Delete task</li>
              <li>Filter tasks by completion status</li>
              <li>Clear all tasks</li>
              <li>Get here! :)</li>
            </ul>
          </div>
          <img className='myPhoto' src={myPhoto}/>
        </div>
        {/* <div className='navLink' style={{marginTop: '20px'}}><NavLink to="/todo-project">Back to App</NavLink> </div> */}
      </div>
    )
  }
}

class App extends React.Component {

  render() {

    return (

      // <div className='appContainer'>
      //   <h1>mylittletodo</h1>
        <ToDoApp/>
        // {/* <BrowserRouter>
        //   <Routes>
        //     <Route path='/todo-project' element={<ToDoApp/>}/>
        //     <Route path='/todo-project/about' element={<About/>}/>
        //   </Routes>
        // </BrowserRouter> */}
      // </div>

    )
  }

}

export default App;
