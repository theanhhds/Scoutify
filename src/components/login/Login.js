import React from 'react';
import {NavLink} from 'react-router-dom';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class LoginForm extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			username : "",
			password : "",
			error : false,
			isValid : true,
			rememberMe: false,
			login_verified: false,
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.verify = this.verify.bind(this);
	}
	
	verify(){
		let ls_usr = localStorage.getItem('username');
		let ss_usr = sessionStorage.getItem('username');
		
		if (ls_usr === null && ss_usr === null)
			console.log("");			//If there's no username in storages
		else{
			let usr = ls_usr ? ls_usr : ss_usr;
			let token = localStorage.getItem('token') ? localStorage.getItem('token') : sessionStorage.getItem('token');
			if (token === null) 
				console.log("");		//if there's no token in storages
			else{
				var bodyFormData = new FormData();
				bodyFormData.set('username', usr);
				bodyFormData.set('token', token);
				axios({
					method: 'post',
					url: 'https://theanh9498.000webhostapp.com/scoutify/verify.php',
					data: bodyFormData,
					headers: {'Content-Type': 'multipart/form-data'},
				}).then(response =>{
					return response.data
				}).then(data => {
					if (data.status === "ok"){
						this.props.history.push('/dashboard');
					}
					else{
						localStorage.removeItem("username");
						localStorage.removeItem("token");
						sessionStorage.removeItem("username");
						sessionStorage.removeItem("token");
						this.props.history.push('/login');			//if status is error
					}
				});
			}
		}
	}
	
	componentDidMount(){
		this.verify()
	}
	
	handleSubmit(event){
		event.preventDefault();
		if (this.state.username && this.state.password){
			var bodyFormData = new FormData();
			this.setState({username: this.state.username.toLowerCase()});
			bodyFormData.set('username', this.state.username);
			bodyFormData.set('password', this.state.password);
			var self = this;
			axios({
				method: 'post',
				url: 'https://theanh9498.000webhostapp.com/scoutify/login.php',
				data: bodyFormData,
				headers: {'Content-Type': 'multipart/form-data',
						  },
			}).then(response =>{
				return response.data
			}).then(data => {
				if (data.status === "error"){
					self.setState({isValid: false});
				}
				else{
					//SAVE USER INFORMATION INTO LOCALSTORAGE/ SESSION
					if (self.state.rememberMe){
						localStorage.setItem('username',  self.state.username);
						localStorage.setItem('token', data.token);
					}
					else{
						sessionStorage.setItem('username', self.state.username);
						sessionStorage.setItem('token', data.token);
					}
					//REDIRECT TO DASHBOARD
					this.props.history.push("/dashboard")
				}
			})
			.catch(function (error) {
				if (error.response) {			//Check if errors happen
				  console.log(error.response.data);
				  console.log(error.response.status);
				  console.log(error.response.headers);
				}
			});
		}
		else{
			this.setState({error:true});
		}
	}
	
	handleChange(event){
		const target = event.target;
		const value = target.name === 'rememberMe'? target.checked : target.value;
		const name = target.name;
		this.setState({
			[name]: value
		});
		if (this.state.username && this.state.password)
			this.setState({error:false});
	}
	
	render(){
		let NotEnough, NoValid;		
		if (this.state.error)
			NotEnough = <div className="w3-container w3-red w3-center"><h5>Hey, you gotta fill everything man!</h5></div>;
		if (!this.state.isValid)
			NoValid = <div className="w3-container w3-red w3-center w3-animate-zoom"><h5>Hey, something goes wrong. Check again!</h5></div>;
	
		if (this.state.login_verified){
			console.log("it goes here login_verified");
			
		}
		else
		return(
		<div className="w3-pale-green">
			<br/><br/><br/><br/><br/>
			<div className="w3-container w3-animate-zoom">
				<div className="w3-third "><br/></div>
				<div className="w3-third w3-card-4 ">
					<header className="w3-container w3-wide w3-green w3-center">
						<h2>Remember your password carefully!</h2>
					</header>

					<div className="w3-container">
						<br/>
						<form className="w3-container">
							<label>Username</label>
							<input autofocus="on" autocapitalize="none" className="w3-input" name="username" value={this.state.username} onChange={this.handleChange} type="text"/>
							<br/>
							<label>Password</label>
							<input className="w3-input" name="password" value={this.state.password} onChange={this.handleChange} type="password"/>
							<br/>
							<input type="checkbox" className="w3-check w3-margin-right" name="rememberMe" value={this.state.rememberMe} onChange={this.handleChange}/>
							<label>Remember me</label>
							<br/><br/>
							<input type="submit" onClick={this.handleSubmit} className="w3-btn w3-light-green w3-block" value="Let's go"/>
						</form>
						<br/>
						<h5 className="w3-center w3-row">Hey, wanna join us? Make a new one <NavLink to="/register">here</NavLink></h5>
						
					</div>
					{NotEnough}<br/>
					{NoValid}
				</div>
				<div className="w3-third"><br/></div>
			</div>
			<br/><br/><br/>
			
		</div>
		);
	}
}

export default withRouter(LoginForm);