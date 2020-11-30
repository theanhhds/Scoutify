import React from 'react';
import {NavLink} from 'react-router-dom';
import axios from 'axios';
import {URL} from '../../URL';
import './style.css';
import Navbar from '../navbar/Navbar';
import {withRouter} from 'react-router-dom';

class ChatBox extends React.Component{
	constructor(props){
		super(props);
		
		this.state = {
			info : {

			},
			mess : "",
			messages_raw : "",
		}
		this.verify = this.verify.bind(this);
		this.getUserInfo = this.getUserInfo.bind(this);
		this.handleMessChange = this.handleMessChange.bind(this);
		this.handleSend = this.handleSend.bind(this);
		this.getMessages = this.getMessages.bind(this);
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
						this.setState({info_username : usr});
						this.getUserInfo();
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
			url: URL + "/getUserInfo.php",
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
	
	componentDidMount(){
		this.verify();
		this.getMessages();
	}
	
	getMessages(){
		let s_username = localStorage.getItem("username");
		let s_token = localStorage.getItem("token");
		
		if (s_username === null){
			s_username = sessionStorage.getItem("username");
			s_token = sessionStorage.getItem("token");
		}
		
		var data = new FormData();
		data.set("username", s_username);
		data.set("token", s_token);
		axios({
			method: "post",
			url: URL + "/getMessages.php",
			data: data,
			headers: {'Content-Type': 'multipart/form-data'},
		}).then(response => {
			return response.data;
		}).then(data => {
			var elm = document.getElementById("messenger");
			elm.innerHTML = data;
			elm.scrollTop = elm.scrollHeight;
		});
	}
	
	handleSend(event){
		event.preventDefault();
		if (this.state.mess !== ""){
			var data = new FormData();
			data.set("sender_fullname", this.state.info.fullname);
			data.set("sender_username", this.state.info.username);
			data.set("content", this.state.mess.replace(/(["'])/g, "\\$1"));
			axios({
				method: "post",
				url: URL + "/sendMessage.php",
				data: data,
				headers: {'Content-Type': 'multipart/form-data'},
			}).then(response =>{
				return response.data;
			}).then (data =>{
				console.log("message sent!")
			})
			this.getMessages();
			this.setState({mess: ""});
		}
	}
	
	handleMessChange(event){
		 this.setState({mess: event.target.value});
	}
	
	render(){
		let header;
		let stl = {marginLeft:0};
		let send = "w3-hide";
		let titleStyle = "w3-center w3-wide w3-text-blue";
		let url = window.location.href;
		let sendas = "Create announcement as "+ this.state.info.fullname + " (" +this.state.info.username + ")";
		if (!url.includes("dashboard")){
			header = <Navbar/> ;
			send = "w3-container w3-margin";
			stl = {marginLeft:200};
			titleStyle = "w3-center w3-wide w3-text-indigo";
		}
		
		
		return(
		<div>
			{header}
			<br/><br/>
			<div className="w3-main" style={stl}>
				
				<div className="w3-container">
					<div className="w3-animate-zoom">
						<h2 className={titleStyle}> Announcements </h2>
						<div id="messenger" className="w3-pale-blue w3-container w3-card-4 chatbox w3-border w3-margin"></div>
						<div className={send}>
						<form>
							<div className="w3-row-padding">
								<textarea placeholder = {sendas} className="w3-col m8 mess-box w3-margin" onChange={this.handleMessChange} 	name="message" value={this.state.mess}/>
								<div className="w3-col m3">
									<input type="submit" className="w3-margin w3-btn w3-green w3-round-large" value="Send" 
										onClick = {this.handleSend}/>
									<div className="w3-margin w3-btn w3-green w3-round-large" 
										onClick = {this.getMessages}>Refresh</div>
								</div>
							</div>
						</form>
						</div>
					</div>
				</div>
			</div>
		</div>
		);
	}
}

export default withRouter(ChatBox);