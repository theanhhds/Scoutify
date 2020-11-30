import React from 'react';
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import Navbar from '../navbar/Navbar';
import {URL} from '../../URL';

class Users extends React.Component{
	constructor(){
		super();
		this.state = {
			full_users : [],
			users : [],
			s_username : "",
			s_fullname : "This is...",
			s_email : "",
			s_phone : "",
			s_regDate: "",
		}
		this.verify = this.verify.bind(this);
		this.getUsersList = this.getUsersList.bind(this);
		this.handleChange = this.handleChange.bind(this);
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
				let usr = ls_usr ? ls_usr : ss_usr;		//Username whether from session or local storage
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
						this.setState({info_username : usr});		//If verify ok then update info_username
						this.getUsersList();
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
	
	getUsersList(){
		axios.get(URL + "/getUsersList.php?pass=sC0t1fy").then((response) => {
			return response.data;
		}).then((data) =>{
			this.setState({users: data.list.sort()});
			this.setState({full_users : data.full_list});
		});
	}
	
	componentDidMount(){
		this.verify();
	}
	
	handleChange(e){
		let user = e.target.value;
		this.state.full_users.map((i) => {
			if (i.username === user){
				this.setState({s_username: i.username, s_fullname: i.fullname, s_email: i.email, s_phone: i.phone, s_regDate: i.reg_date});
			}
		});
	}
	
	render(){
		let option_list = this.state.users.sort().map((per) => {
			return <option value={per}> {per} </option>
		});
		
		
		return(
		<div>
			<Navbar/>
			<div className="w3-container w3-main fullScreen" style={{marginLeft: 200}}>
				<br/><br/><br/>
				<h1 className="w3-wide w3-center w3-text-indigo"> People Finder </h1>
				<br/><br/><br/>
				<div className="w3-container w3-col l3"><br/></div>
				<div className="w3-container w3-col l6">
					<select className="w3-select" name="chosen_name" onChange={this.handleChange}>
						<option disabled selected>Choose username below</option>
						{option_list}
					</select>
					<br/><br/><br/>
					<div className="w3-card w3-animate-zoom w3-pale-blue">
						<div className="w3-blue w3-padding w3-wide"><h1><b>{this.state.s_fullname}</b></h1></div>
						<div className="w3-container w3-margin w3-padding-large">
							<div ><b>Username: </b>{this.state.s_username}</div>
							<div ><b>Fullname: </b>{this.state.s_fullname}</div>
							<div ><b>Contact: </b>{this.state.s_email}</div>
							<div ><b>Phone number: </b>{this.state.s_phone}</div>
							<div ><b>Joined on: </b>{this.state.s_regDate.slice(0,10)}</div>
						</div>
					</div>
				</div>
				<div className="w3-container w3-col l3"><br/></div>
			</div>
		</div>
		)
	}
}

export default withRouter(Users);