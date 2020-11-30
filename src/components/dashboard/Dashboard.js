import React from 'react';
import {NavLink} from 'react-router-dom';
import {URL} from '../../URL';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import Chatbox from '../chatbox/Chatbox';
import TaskView from '../taskview/TaskView';
import './style.css';
import Navbar from '../navbar/Navbar';

class Dashboard extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			login_verified : true,
			logout : false,
			info_username : "",
			info : {
				username : "",
				fullname : "",
				phone : "",
				email : "",
			},	
		}
		this.verify = this.verify.bind(this);
		this.handleLogout = this.handleLogout.bind(this);
		this.getUserInfo = this.getUserInfo.bind(this);
	}
	
	verify(){
		let ls_usr = localStorage.getItem('username');
		let ss_usr = sessionStorage.getItem('username');
		let token = localStorage.getItem('token') ? localStorage.getItem('token') : sessionStorage.getItem('token');
		
		if (ls_usr === null && ss_usr === null)
			this.props.history.push('/login');			//If there's no username in storages
		else{
			if (token === null) 
				this.props.history.push('/login');		//if there's no token in storages
			else{
				let usr = ls_usr ? ls_usr : ss_usr;
				// console.log(usr + " " + token)
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
						// console.log(data.status);
						this.setState({info_username : usr});
						// console.log(this.state.info_username);
						this.getUserInfo();
						// console.log(this.state.info_fullname, data.fullname);
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
	
	getUserInfo(){
		var bodyFormData = new FormData();
		bodyFormData.set('username', this.state.info_username);
		// console.log(this.state.info_username);
		axios({
			method: "post",
			url: "https://theanh9498.000webhostapp.com/scoutify/getUserInfo.php",
			data: bodyFormData,
			headers: {'Content-Type': 'multipart/form-data'},
		}).then(response =>{
			return response.data;
		}).then(data => {
			// console.log(data);
			this.setState({info : data});
			// console.log(this.state.info);
		});
	}
	
	handleLogout(){
		localStorage.removeItem('username');
		localStorage.removeItem('token');
		sessionStorage.removeItem('username');
		sessionStorage.removeItem('token');
		this.props.history.push("/login");
	}
	
	componentDidMount(){
		this.verify();
	}

	render(){
		// console.log(this.state.info);
		if (this.state.logout)
			this.props.history.push("/");
		else
		return(
		<div >
			<Navbar username={this.state.info.username}/>
			<br/><br/>
			<div className="w3-container w3-main"  style={{marginLeft:200}}>
					<div className="w3-container w3-margin w3-animate-right">
					<h1 className="w3-center w3-wide w3-text-indigo"> Welcome to Scoutify</h1>
					<h3 className="w3-center w3-text-cyan"> -- {this.state.info.fullname} -- </h3>
					<br/>
					<div className="w3-row-padding">
						<div style={{}} className="w3-half height80 w3-container"><TaskView usrn={this.state.info_username}/></div>
						<div style={{}} className="w3-half height80 w3-container"><Chatbox info={this.state.info}/></div>
					</div>
				</div>
			</div>
		</div>
		);
	}
}

export default withRouter(Dashboard);