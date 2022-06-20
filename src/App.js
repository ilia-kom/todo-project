import logo from './logo.svg';
import './App.scss';
import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Route, Routes, BrowserRouter, NavLink } from 'react-router-dom';
import { InputLine } from './components/InputLine';
import { ToDoLine } from './components/ToDoLine';
import { ToDoList } from './components/ToDoList';
import { BottomBlock } from './components/BottomBlock';
import { Login } from './components/Login';
import { About } from './components/About';




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
      authorized: null,
      fetching: false
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

    if (!localStorage.getItem("token")) {
      this.authorized = false;
      return;
    }

    const authOk = await this.checkAuthorization();
    if (authOk) {
      this.state.authorized = true;
      this.getTasks();
    } else {
      this.state.authorized = false;
      localStorage.removeItem("token");
    }
  } 

  async checkAuthorization() {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:58128/api/authcheck", {
      headers: {"Authorization": "Bearer "+localStorage.getItem("token")}
    });
    return response.ok;
  }

  async getTasks() {
    this.setState({
      fetching: true
    });
    const response = await fetch("http://localhost:58128/api/todo", {
      method: "GET",
      headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
    });
    if (response.ok) {
      const tasks = await response.json();
      let updatedLines = []; let i = 0;
      for (let t of tasks) {
        updatedLines[i] = {};
        updatedLines[i].key = t.id;
        updatedLines[i].text = t.text;
        updatedLines[i].active = !t.completed;
        i++;
      }
      this.setState({
        lines: updatedLines,
      });
    } else if (response.status === 401) {
      localStorage.removeItem("token");
      this.setState({
        authorized: false
      });
      document.location = 'todo-project';
    } else alert(response.status + ": " + response.statusText);
    this.setState({
      fetching: false
    });
  }


  async deleteLine(rowNum) {

    if (!this.state.authorized) {
      let stateLines = this.state.lines.slice();
        stateLines.splice(rowNum, 1);
        this.setState({
          lines: stateLines,
        });
        return;
    }

    try {
      const response = await fetch("http://localhost:58128/api/todo/" + this.state.lines[rowNum].key, {
        method: "DELETE",
        headers: { "Accept": "application/json", "Content-Type": "application/json", "Authorization": "Bearer "+localStorage.getItem("token")},
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

    if(!this.state.authorized) {
      this.setState({
        lines: this.state.lines.concat([
          {
            key: this.state.counter,
            text: text,
            active: true,
          }
        ]),
        counter: this.state.counter + 1,
      });
      event.target.firstElementChild.value = '';
      return;
    }

    try {
      const response = await fetch("http://localhost:58128/api/todo", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer "+localStorage.getItem("token") },
        body: JSON.stringify({
            "Text": text,
            "Completed": false
        })
      });
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

    if(!this.state.authorized) {
      lines[rowNum].active = !lines[rowNum].active;
        this.setState({
          lines: lines,
        });
        return;
    }

    try {
      const response = await fetch("http://localhost:58128/api/todo", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer "+localStorage.getItem("token") },
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

    if(!this.state.authorized) {
      this.setState({
        lines: [],
        counter: 0,
        filter: {
          onlyActive: false,
          onlyCompleted: false,
          all: true,
        }
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:58128/api/todo", {
        method: "DELETE",
        headers: { "Accept": "application/json", "Content-Type": "application/json", "Authorization": "Bearer "+localStorage.getItem("token") },
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
          {/* <Login/> */}
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
                          filter={this.state.filter}
                          fetching={this.state.fetching}/>
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
              {/* {this.state.authorized? "" : <div className='noElementsPlaceholder' style={{fontSize: 'smaller'}}>You are not authorized. You can still use the app, but your data will not be saved.</div>} */}
            </div>}/>
            <Route path='/todo-project/about' element={<About/>}/>
          </Routes>
          </div>
        </BrowserRouter>
      

    )
  }
}



class App extends React.Component {

  render() {
    return (
        <ToDoApp/>
    )
  }

}

export default App;
