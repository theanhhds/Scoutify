import React from 'react';
import {NavLink} from 'react-router-dom';
import {withRouter} from 'react-router-dom';

class Navbar extends React.Component{
	constructor(){
		super();
		this.state = {};
		this.handleLogout = this.handleLogout.bind(this);
		this.openBar = this.openBar.bind(this);
		this.closeBar = this.closeBar.bind(this);
		this.barRef = React.createRef();
		this.OverlayRef = React.createRef();
		
	}
	
	handleLogout(){
		localStorage.removeItem('username');
		localStorage.removeItem('token');
		sessionStorage.removeItem('username');
		sessionStorage.removeItem('token');
		this.props.history.push("/");
	}
	
	openBar(){
		this.barRef.current.style.display = "block";
		this.OverlayRef.current.style.display = "block";
	}
	
	closeBar(){
		this.barRef.current.style.display = "none";
		this.OverlayRef.current.style.display = "none";
	}
	
	render(){
		return(
		<div>
			<div className="w3-top">
				<div className="w3-hide-large w3-bar w3-blue">
					<button className="w3-button w3-blue w3-xlarge w3-bar-item" onClick={this.openBar}>&#9776;</button>
					<h3 className="w3-center w3-wide">Scoutify</h3>
				</div>
				<div class="w3-overlay" onClick={this.closeBar} style={{cursor:"pointer"}} ref={this.OverlayRef}></div>
			</div>
			<div className="w3-blue w3-sidebar w3-bar-block w3-collapse w3-card w3-animate-left w3-display-container"
					style={{width:200}} ref={this.barRef}>
				<button className="w3-button w3-hide-large w3-right" onClick={this.closeBar}>[&times;]</button>
				<br/><br/>
				<h2 className="w3-center w3-wide w3-hide-small">Scoutify</h2>
				<br/><br/>
				<NavLink to="/dashboard"><div className="w3-button w3-left w3-blue w3-bar-item">Dashboard</div></NavLink> 
				<NavLink to="/chatbox"><div className="w3-button w3-left w3-blue w3-bar-item ">Announcements</div></NavLink>
				<NavLink to="/events"><div className="w3-button w3-left w3-blue w3-bar-item ">My Events</div></NavLink> 
				<NavLink to="/newevent"><div className="w3-button w3-left w3-blue w3-bar-item ">Create Event</div></NavLink> 
				<NavLink to="/modifyevent"><div className="w3-button w3-left w3-blue w3-bar-item ">Modify Event</div></NavLink> 
				<NavLink to="/users"><div className="w3-button w3-left w3-blue w3-bar-item ">Users</div></NavLink> 
				<NavLink to="/trungthu"><div className="w3-button w3-left w3-blue w3-bar-item ">Trung Thu</div></NavLink> 
				<div className="w3-button w3-red w3-bar-item w3-display-bottommiddle" onClick={this.handleLogout}>Log out</div>
			</div>
		</div>
		);
	}
}

export default withRouter(Navbar);