import React from 'react';
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import Navbar from '../navbar/Navbar';
import './style.css';
import {URL} from '../../URL';
 
class Events extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			info_username : "",
			info_token : "",
			info: {},
			events : [],
			showPast : false,
			showPast_mess : "Events in the past are hidden",
		}
		this.verify = this.verify.bind(this);
		this.getUserInfo = this.getUserInfo.bind(this);
		this.getEvents = this.getEvents.bind(this);
		this.handleShowPast = this.handleShowPast.bind(this);
		this.handleDone = this.handleDone.bind(this);
		this.removeEvent = this.removeEvent.bind(this);
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
						this.setState({info_token : token});		//Set token
						this.getUserInfo();
						this.getEvents(usr);
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
			url: URL + "/getUserInfo.php?pass=sC0t1fy",
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
	
	getEvents(usrn){
		let data = new FormData();
		data.set("username", usrn);
		// console.log(usrn);
		axios({
			method: "post",
			url : URL + "/getEvents.php",
			data: data,
			headers: {'Content-Type': 'multipart/form-data'}
		}).then(response => {
			return response.data;
		}).then(data => {
			// console.log(data);
			// this.setState({events : data});
			let new_data = data, new_events = [];
			new_data.map((i) => {
				//Need to cut 2 double quotes in the string, after "assignment": >"< [object, object] >"<
				let obj = i;
				// remove all the fucking 
				let position = obj.indexOf('"assignment"') + 13;
				obj = obj.slice(0, position) + obj.slice(position+1);
				position = obj.indexOf('"done"') - 3;
				obj = obj.slice(0, position) + obj.slice(position+1);
				position = obj.indexOf('"done"') + 8;
				obj = obj.slice(0, position) + obj.slice(position+1);
				position = obj.length - 2;
				obj = obj.slice(0, position) + obj.slice(position+1);
				obj = JSON.parse(JSON.stringify(obj));
				// console.log(obj);
				new_events.push(obj);
			});
			this.setState({events: new_events});
			// console.log(new_events);
		});	
	}
	
	
	componentDidMount(){
		this.verify();
		// this.getEvents();
	}
	
	handleShowPast(e){
		// console.log(e.target.checked);
		let value = e.target.checked;
		this.setState({showPast: value});
		if (value)
			this.setState({showPast_mess: "Events in the past are showing"});
		else
			this.setState({showPast_mess: "Events in the past are hidden"});
	}
	
	handleDone(e, ID){
		// let target = e.target;
		// console.log(this.state.events);
		let events = this.state.events;
		let clone_event = JSON.parse(this.state.events[ID.event]);
		// console.log(clone_event.done[ID.task]);
		let clone_done = clone_event.done[ID.task];
		let new_done = "";
		for (let i=0; i < clone_done.length; i++){
			let  a_c = clone_done[i];
			if (i===ID.pers)
				a_c = (clone_done[i] === 'y') ? 'n' : 'y';
			new_done += a_c;
		}
		clone_event.done[ID.task] = new_done;
		events[ID.event] = JSON.stringify(clone_event);
		this.setState({events: events});
		// UPDATE ON DATABASE
		// console.log(JSON.parse(events[ID.event]).id,clone_event.done);
		let data = new FormData();
		data.set("id", JSON.parse(events[ID.event]).id);
		data.set("done", JSON.stringify(clone_event.done));
		axios({
			method: "post",
			url : URL + "/updateDone.php",
			data: data,
			headers: {'Content-Type': 'multipart/form-data'}
		}).then((response)=>{return response.data}).then((data) => {
			console.log(data);
		});
	}
	
	removeEvent(e, id){
		// console.log(id);
		let data = new FormData();
		data.set("username", this.state.info_username);
		data.set("token", this.state.info_token);
		data.set("id", id);
		axios({
			method: "post",
			url : URL + "/removeEvent.php",
			data: data,
			headers: {'Content-Type': 'multipart/form-data'}
		}).then((response)=>{return response.data}).then((data) => {
			// console.log(data);
			if (data.status === "ok"){
				// console.log(data);
				// window.location.reload();
				this.getEvents(this.state.info_username);
			}
		});
	}
	
	render(){
		let events = this.state.events;
		// console.log(events);
		let body = events.map((i, eventID) =>{
			let obj = JSON.parse(i);
			let flag = 0;
			let hidePast = "";
			let tasks = obj.assignment.map((j, index) =>{ 
				let color = "";
				let action = "";
				let row_personels = j.personels.map((k, ind) =>{
					let check = "";
					// action_button = obj.done[index];
					// console.log(obj.done[index]);
					if (obj.done[index][ind]==='y'){
						check = '✓';
					}
					if (k == this.state.info_username){
						flag = 1;
						let par = JSON.parse('{"event": '+eventID+', "task": '+index+', "pers": '+ind+'}');
						action = <input type="checkbox" className="w3-check" disabled={isInPast(obj.date)?true:false} 
								checked={(obj.done[index][ind]=='y')?true:false}
								onChange={(e) => {this.handleDone(e, par)}}	/>;
						if (check === "") {
							// console.log("this guy not done", check, k, obj.done[index][ind]);
							
							color = "w3-pale-red"; 
							return <b className="w3-text-red">{" ["+k+check+"] "}</b>;
						}
						else{
							// console.log("this guy done", check, k, obj.done[index][ind]);
							color="w3-pale-green";
							return <b className="w3-text-green">{" ["+k+check+"] "}</b>;
						}
					}
					else{
						// console.log("not this guy",check, k, obj.done[index][ind]);
						return "["+k+check+"] ";
					}
				});
			
				return( 
					<tr className={color}>
						<td>{j.id}</td>
						<td><div className="">{j.task}</div></td>
						<td><div className="">{row_personels}</div></td>
						<td>{action}</td>
					</tr>
				);
				
				
			});
			//Try to add new line
			let description = obj.description.split("<br>").map((t) => {
				return (
					<div>
						{t}
						<br/>
					</div>
				);
			});
			
			function isInPast(check_date){
				var today_date = new Date().toISOString().slice(0,10);
				// console.log(check_date, today_date);
				if (check_date < today_date)
					return true;
				else
					return false;
			}
			
			let dateCheck="", date_pass="incoming", isPass="", status_color="w3-padding w3-center w3-green";
			if (isInPast(obj.date))
			{
				status_color = "w3-pale-red w3-padding w3-center";
				dateCheck = "w3-opacity-min";
				date_pass = "ended";
				isPass="w3-text-red";
				if (!this.state.showPast)
					hidePast = "w3-hide";
			}
			
			let toShow = "";
			if (flag == 0)
				toShow = "w3-hide";
			
			let owner = "", isOwner="";
			let removeHide = "w3-hide";

			if (obj.creator === this.state.info_username){
				owner = "w3-text-green bold";
				removeHide = "";
				isOwner = "(owner)";
			}
			
			
			return( 
				<div className={dateCheck}>
				<div>
				<div className={hidePast}>
					<div className="w3-row">
						<div className="w3-col l3"><br/></div>
						<div className="w3-col l6 w3-container w3-card-4 w3-pale-blue w3-animate-zoom" >
							<fieldset >
								<legend className="w3-center w3-padding-large"><h3 className={isPass}> {obj.title} </h3></legend>
								<div className={status_color}><b>Event {date_pass} </b></div>
								<br/>
								<div><b>Title:</b> {obj.title} </div>
								<div><b>Creator: </b> <span className={owner}>{obj.creator}</span> {isOwner}</div>
								<div><b>Date: </b> {obj.date}</div>
								<div><b>Location:</b> {obj.location}</div>
								<div><b>Description:</b> <div className="w3-margin">
									<span className="wrap_des">{description}</span>
								</div></div>
								<hr/>
								<div>
									<b>Tasks:</b>
									<table className="w3-table">
										<tr><th>ID</th><th>Task</th><th>Personels</th><th>Done</th></tr> 
										{tasks}
									</table>
								</div>
							</fieldset>
							<br/>
							<div className={removeHide}>
								<button onClick={(e) => {if (window.confirm("Are you sure want to remove this event? This can not be undone!")) this.removeEvent(e, obj.id)}}className="w3-btn w3-red w3-right w3-section">Remove Event</button>
							</div>
							<br/>
						</div>
						<div className="w3-col l3"><br/></div>
					</div>
					<br/><br/>
				</div>
				</div>
				</div>
		)}	
		);
		
		return(
		<div>
			<Navbar username={this.state.info_username}/>
			<br/><br/>
			<div className="w3-container w3-main" style={{marginLeft:200}}>
				<br/>
				<h1 className="w3-center w3-wide w3-text-indigo">My Events</h1>
				<h3 className="w3-center w3-text-cyan"> -- {this.state.info.fullname} -- </h3>
				<br/>
				<div className="w3-center">
					<input type="checkbox" className="w3-check" checked={this.state.showPast} onChange={this.handleShowPast}/>
					<lable className="w3-margin w3-padding"> Show/Hide </lable>
					<br/>
					<div className="w3-section"> {this.state.showPast_mess}</div>
				</div>
				<br/><br/><br/>
				<div>
					{body}
				</div>
			</div>
		</div>
		);
	}
}

export default withRouter(Events);