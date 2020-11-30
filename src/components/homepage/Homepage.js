import React from 'react';
import {NavLink} from 'react-router-dom';

class Homepage extends React.Component{
	render(){
		return(
		<div className="w3-container w3-center w3-sand">
			<br/>
			<h1 className="w3-jumbo w3-wide w3-center ">Welcome to Scoutify!</h1>
			<br/><br/><br/><br/>
			<div className="w3-container">
				<div className="w3-quarter"><br/></div>
				<div className="w3-center w3-half">
					<NavLink to="/register" className="w3-section w3-block w3-blue w3-btn w3-jumbo w3-round-large">Register</NavLink>
					<NavLink to="/login" className="w3-block w3-green w3-btn w3-jumbo w3-round-large">Login</NavLink>
				</div>
				<div className="w3-quarter"><br/></div>
			</div>
			<br/><br/><br/><br/><br/><br/><br/>
		</div>
		);
	}
}

export default Homepage;