import React from 'react';
import './App.css';
import RegisterForm from './components/register/Register';
import {Route, Switch, BrowserRouter} from 'react-router-dom';
import Error from './Error';
import HomePage from './components/homepage/Homepage';
import LoginForm from './components/login/Login';
import Dashboard from './components/dashboard/Dashboard';
import Chatbox from './components/chatbox/Chatbox';
import NewEvent from './components/newevent/NewEvent';
import Events from './components/events/Events';
import Users from './components/users/Users';
import ModifyEvent from './components/modifyevent/ModifyEvent';
import TrungThu from './components/trungthu/trungthu';

function App() {
  return (
    <div>
		<BrowserRouter>
			<Switch>
				<Route path="/" exact component={HomePage} />
				<Route path="/register" component={RegisterForm}/>
				<Route path="/login" component={LoginForm}/>
				<Route path="/dashboard" component={Dashboard}/>
				<Route path="/chatbox" component={Chatbox}/>
				<Route path="/newevent" component={NewEvent}/>
				<Route path="/events" component={Events}/>
				<Route path="/users" component={Users}/>
				<Route path="/modifyevent" component={ModifyEvent}/>
				<Route path="/trungthu" component={TrungThu}/>
				<Route component={Error} />
			</Switch>
		</BrowserRouter>
    </div>
  );
}

export default App;
