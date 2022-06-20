import React from "react";
import myPhoto from '../me4.jpg'

export class About extends React.Component {
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