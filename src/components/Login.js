import React from "react";

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: false
    }
  }

  async onSubmitLogin(event) {
    event.preventDefault();
    let login = document.getElementById("login").value.trim();
    let password = document.getElementById("password").value.trim();
    this.setState({
      fetching: true
    });
    try {
      let response = await fetch("http://localhost:58128/token?username="+login+"&password="+password, {
        method: "POST",
        headers: {"Accept": "application/json"}
      });
      if (response.ok) {
        let result = await response.json();
        localStorage.setItem("token", result.access_token);
        localStorage.setItem("user", result.username);
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
    this.setState({
      fetching: false
    });
  }

  async onSubmitRegister(event) {
    event.preventDefault();
    let login = document.getElementById("registerLogin").value.trim();
    let password = document.getElementById("registerPassword").value.trim();
    let repeatPassword = document.getElementById("repeatPassword").value.trim();

    if (password !== repeatPassword) {
      let warning = document.querySelector(".registerWarning");
      warning.innerHTML = "Passwords are not equal!";
      warning.hidden = false;
      return;
    }

    this.setState({
      fetching: true
    });

    try {
      let response = await fetch("http://localhost:58128/register?username="+login+"&password="+password, {
        method: "POST",
        headers: {"Accept": "application/json"}
      });
      if (response.ok) {
        let result = await response.json();
        localStorage.setItem("token", result.access_token);
        localStorage.setItem("user", result.username);
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
    this.setState({
      fetching: false
    });
  }
  
  signOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.location = "todo-project";
  }

  render() {
    const token = localStorage.getItem("token");
    return (
      <div className='navLink' style={{ textAlign: 'left' }}>
        {token ? <div>{localStorage.user} | <a onClick={this.signOut}>Sign out</a></div> : <div><a data-bs-toggle="modal" data-bs-target="#loginModal">Sign in</a> | <a data-bs-toggle="modal" data-bs-target="#registerModal">Register</a></div>}
        
        <div className="modal fade" id="loginModal">
          <div className="modal-dialog container">
            <div className="modal-content">

            <form onSubmit={(e) => this.onSubmitLogin(e)}>
              <div className="modal-header">
                <h4 className="modal-title">Sign in</h4>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>


              <div className="modal-body">
                <table className="container" valign="middle"><tbody className="w-100">
                  <tr className="row">
                    <td className="col-4" valign="bottom"><label for="login">Email</label></td>
                    <td className="col-8"><input type="email" id="login" className='form-control'/></td>
                  </tr>
                  <tr className="row">
                    <td className="col-4" valign="middle"><label for="password">Password</label></td>
                    <td className="col-8"><input type="password" id="password" className='form-control' style={{width: '100%'}}/></td>
                  </tr>
                  </tbody></table>
                <div className='loginWarning alert alert-danger fade show' hidden={true}></div>
                
              </div>


              <div className="modal-footer" style={{display: 'flex', justifyContent: 'flex-start'}}>
                <button type="submit" className='btn rounded-pill btn-outline-warning text-dark'>{ this.state.fetching? <div class="spinner-border text-light spinner-grow-sm"></div> : ""} Sign in</button>
              </div>
              </form>
            </div>
          </div>
        </div>




        <div className="modal fade" id="registerModal">
           <div className="modal-dialog " style={{maxWidth: '40%'}}>
            <div className="container-md modal-content " >

            <form onSubmit={(e) => this.onSubmitRegister(e)}>
              <div className="modal-header">
                <h4 className="modal-title">Create new user</h4>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>


              <div className="modal-body">
                <table className="container" valign="middle"><tbody>
                  <tr className="row">
                    <td className="col" valign="bottom"><label for="registerLogin">Email<br/><span className="badge bg-warning" >Can be a fake one if you wish :)</span></label></td>
                    <td className="col"><input type="email" id="registerLogin" className='form-control'/></td>
                  </tr>
                  <tr className="row" style={{marginTop: "15px"}}>
                    <td className="col" valign="middle"><label for="registerPassword">Password<br/><span className="badge bg-warning">Any! Until I add the logic to server...</span></label></td>
                    <td className="col"><input type="password" id="registerPassword" className='form-control' style={{width: '100%'}}/></td>
                  </tr>
                  <tr className="row" style={{marginTop: "15px"}}>
                    <td className="col" valign="middle"><label for="repeatPassword">Repeat Password<br/><span className="badge bg-warning">Please!</span></label></td>
                    <td className="col"><input type="password" id="repeatPassword" className='form-control' style={{width: '100%'}}/></td>
                  </tr>
                  </tbody></table>
                <div className='registerWarning alert alert-danger fade show' hidden={true}></div>
                
              </div>


              <div className="modal-footer" style={{display: 'flex', justifyContent: 'flex-start'}}>
              <button type="submit" className='btn rounded-pill btn-outline-warning text-dark border border-5'>{ this.state.fetching? <div class="spinner-border text-light spinner-grow-sm"></div> : ""} Register</button>
                {/* <button type="button" className="btn btn-danger rounded-pill" data-bs-dismiss="modal">Close</button> */}
              </div>
              </form>
            </div>
          </div>
        </div>

      </div>
    )
  }
}