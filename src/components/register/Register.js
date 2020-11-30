import React from 'react';
import './style.css';
import axios from 'axios';
import {NavLink} from 'react-router-dom';

class RegisterFrom extends React.Component {
	constructor(){
		super();
		this.state = {
				username: "",
				password: "",
				fullname: "",
				email: "",
				phone:"",
				registerDone : false,
				error: false,
				message: "",
		}; 
		this.handleChangeInput = this.handleChangeInput.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	
	handleSubmit(event){
		event.preventDefault();
		if (this.state.username && this.state.password && this.state.fullname && this.state.email && this.state.phone){
			var bodyFormData = new FormData();
			bodyFormData.set('username', this.state.username.toLowerCase());
			bodyFormData.set('password', this.state.password);
			bodyFormData.set('fullname', this.state.fullname);
			bodyFormData.set('email', this.state.email);
			bodyFormData.set('phone', this.state.phone);
			var self = this;		//this inside axios refers to axios object
			axios({
				method: 'post',
				url: 'https://theanh9498.000webhostapp.com/scoutify/register.php',
				data: bodyFormData,
				headers: {'Content-Type': 'multipart/form-data',
						  // 'Access-Control-Allow-Origin': '*'
						  }
			}).then(response =>{
				return response.data;
			}).then (data =>{
				console.log(data.message);
				if (data.status === "ok")
					self.setState({registerDone: true});
				else
					self.setState({message: self.state.username + " >> " +data.message});
			})
			.catch(function (error) {
				if (error.response) {			//Check if errors happen
				  console.log(error.response.data);
				  console.log(error.response.status);
				  console.log(error.response.headers);
				}
			});
		}
		
		else{				// Not enough data to be sent
			this.setState({error: true});
		}
	}
	
	handleChangeInput(event){
		const target = event.target;
		const value = target.value;
		const name = target.name;
		this.setState({
			[name]: value
		});
		if (this.state.username && this.state.password && this.state.fullname && this.state.email && this.state.phone)
			this.setState({error:false});
	}
	
	render(){
		let footer, fill, mess;
		footer = <footer className="w3-container w3-center"><h5>Have an account already? Just <NavLink to="/login">log in</NavLink></h5></footer>;
		if (this.state.registerDone)
			footer = <footer className="w3-container w3-green w3-center"><h5>Thank you for joining us. Click <NavLink to="/login">here</NavLink> to log in!</h5></footer>;
		if (this.state.error)
			fill = <footer className="w3-container w3-red w3-center"><h5>Hey, make sure you fill in everything!</h5></footer>;
		if (this.state.message!== "")
				mess = <footer className="w3-container w3-red w3-center"><h5>{this.state.message}</h5></footer>;
		return(
		<div className="w3-container w3-pale-blue">
			<br/><br/><br/>
			<div className="w3-display-container w3-row w3-animate-zoom">
				<div className="w3-third "><br/></div>
				<div className="w3-card-4 w3-third">
					<header className="w3-container w3-wide w3-blue w3-center"><h2>Welcome to Scoutify!</h2></header>
					<br/>{mess}
					<form className="w3-padding-32 w3-container">
						<input autocapitalize="none" className="w3-input inputPadding" value={this.state.username} required autoComplete="off" placeholder="Username" name="username" onChange={this.handleChangeInput}/>
						<input type="password" className="w3-input inputPadding" required value={this.state.password} autoComplete="off" placeholder="Password" name="password" onChange={this.handleChangeInput}/>
						<input className="w3-input inputPadding" value={this.state.fullname} required autoComplete="off" placeholder="Full name" name="fullname" onChange={this.handleChangeInput}/>
						<input className="w3-input inputPadding" value={this.state.email} required autoComplete="off" placeholder="Contact" name="email" onChange={this.handleChangeInput}/>
						<input className="w3-input inputPadding" value={this.state.phone} required autoComplete="off" placeholder="Phone number" name="phone" onChange={this.handleChangeInput}/> <br/>
						<div>*Contact can be Facebook or email, etc.</div><br/>
						<input className="w3-btn w3-light-blue w3-block" type="submit" onClick={this.handleSubmit} value="Register"/>
					</form>
					
					<div className="w3-row">{footer}</div><br/>
					<div className="w3-row">{fill}</div><br/>
				</div>
				
			</div>
			<br/><br/><br/><br/>
		</div>
		);
	}
}

export default RegisterFrom;