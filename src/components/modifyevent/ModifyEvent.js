import React from 'react';
import {withRouter} from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import axios from 'axios';
import './style.css';
import {URL} from '../../URL';

class ModifyEvent extends React.Component{
	constructor(){
		super();
		this.state = {
			info : {},
			info_username: "",
			events: [],
			selected_event : "",
			n_id : "",
			n_title : "",
			n_date : "",
			n_description : "",
			n_location : "",
			n_assignments : [],
			n_done : [],
			users_list : [],
			new_task : "",
			new_personels : [],
		}
		this.verify = this.verify.bind(this);
		this.getUserInfo = this.getUserInfo.bind(this);
		this.getEvents = this.getEvents.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
		this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
		this.addNew = this.addNew.bind(this);
		this.removeTask = this.removeTask.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
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
	
	getUsersList(){
		axios.get(URL + "/getUsersList.php?pass=sC0t1fy").then(response =>{
			return response.data;
		}).then(data => {
			this.setState({users_list : data.list.sort()});
		});
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
		this.getUsersList();
	}
	
	removeTask(index){
		let whereToRemove = 0, new_index = 1;
		// console.log(index);
		let cloneList = JSON.parse(JSON.stringify(this.state.n_assignments));
		cloneList.map((i, ind) => {
			if (i.id === index)
				whereToRemove = ind;
			else
			{
				i.id = new_index;
				new_index ++;
			}
		});
		
		let clone_done = this.state.n_done;
		if (whereToRemove !== 0) 			
			clone_done.splice(whereToRemove, 1);
		else
			this.state.n_done.shift();
		
		console.log(clone_done);		
		this.setState({n_done: clone_done});

		cloneList.splice(whereToRemove,1);		
		this.setState({n_assignments : cloneList});
	}
	
	handleChange(event){
		const target = event.target;
		const name = target.name;
		const value = target.value;
		
		this.setState({[name] : value});
	}
	
	handleSelect(e){
		let ID = e.target.value;
		let event = JSON.parse(this.state.events[ID]);
		// console.log(ID);
		let s_title = event.title;
		let s_date = event.date;
		let s_location = event.location;
		let s_description = event.description;
		let s_assignment = event.assignment;
		let s_done = event.done;
		let s_id = event.id;
		// console.log(event);
		// console.log(s_title, s_date, s_location, s_description, s_assignment, s_done, s_id);
		this.setState({n_title: s_title, n_date: s_date, n_location: s_location, 
			n_description: s_description, n_assignments: s_assignment, n_done: s_done, n_id: s_id});
	}
	
	handleCheckboxChange(e){
		let target = e.target;
		let name = target.value;
		let status = target.checked;
		let whereToRemove = 0;
		let clone_new_personels = JSON.parse(JSON.stringify(this.state.new_personels));
		// console.log(name, status);
		if (status)
			clone_new_personels.push(name);
		else{
			whereToRemove = clone_new_personels.indexOf(name);
			clone_new_personels.splice(whereToRemove);
		}
		this.setState({new_personels : clone_new_personels});
		// console.log(clone_new_personels);
	}
	
	addNew(){
		if (this.state.new_task && (this.state.new_personels!== [])){
			let clone = JSON.parse(JSON.stringify(this.state.n_assignments));
			//init a 'done' string that has length = personels.length, fills with 'n' (means no)
			let done = new Array(this.state.new_personels.length + 1).join('n');
			console.log("done = ", done);
			let clone_done = this.state.n_done;
			clone_done = clone_done.concat(done);
			this.setState({n_done: clone_done});
			console.log(clone_done);
			
			// handle assignments here
			let c_new = {'id': this.state.n_assignments.length+1, 'task': this.state.new_task, 'personels': this.state.new_personels};
			clone.push(c_new);		
			this.setState({n_assignments : clone, new_task : "", new_personels: []});
			document.querySelectorAll('input[type=checkbox]').forEach( el => el.checked = false );	//Uncheck all checkboxes
		}
	}
	
	handleSubmit(){
		let id = this.state.n_id;
		let creator = this.state.info_username;
		let title = this.state.n_title.replace(/(["'])/g, "\\$1");
		let date = this.state.n_date;
		let location = this.state.n_location.replace(/(["])/g, "\\$1");
		let description = this.state.n_description.replace(/(["'])/g, "\\$1");
		let assignment = JSON.stringify(this.state.n_assignments);		//CHANGE to string
		let done = JSON.stringify(this.state.n_done);
		console.log(creator, title, date, location, description, assignment);
		if (creator && title && date && location && description && assignment && done && id){
			
			let data = new FormData();
			data.set("id", id);
			data.set("creator", creator);
			data.set("title", title);
			data.set("date", date);
			data.set("location", location);
			data.set("description", description.replace(/\n/g, "<br>"));
			data.set("assignment", assignment);
			data.set("done", done);
			// console.log("ready to send");
			
			axios({
				method: "post",
				url: URL + "/updateEvent.php",
				data: data,
				headers: {'Content-Type': 'multipart/form-data'},
			}).then(response =>{
				return response.data;
			}).then(data =>{
				if (data.status === "ok")
				{
					console.log("Event added!");
					this.props.history.push('/events');
				}
			});
		}
	}
	
	render(){
		function isInPast(check_date){
			var today_date = new Date().toISOString().slice(0,10);
			// console.log(check_date, today_date);
			if (check_date < today_date)
				return true;
			else
				return false;
		}
		
		let option_list = this.state.events.map((event, eventID) => {
			let obj = JSON.parse(event);
			if (obj.creator == this.state.info_username && !isInPast(obj.date)){
				return <option value={eventID}>{obj.title}</option>;
			}
		});
		
		let list = this.state.users_list.map((pers) => {
			// console.log(pers);
			return(
			<div>
				<input className="w3-check" onChange={this.handleCheckboxChange} value={pers} type="checkbox" /> 
				<lable> {pers}</lable>
			</div>
			)}
		);
		
		let tasks = this.state.n_assignments.map((i) => 
			<tr><td>{i.id}</td> 
				<td><div className="wrap">{i.task}</div></td>
				<td><div className="wrap">{i.personels.map((per) =>" [" + per + "] ")}</div></td>
				<td> <button className="w3-btn w3-red" onClick={() => this.removeTask(i.id)}>Remove</button></td>
			</tr>
		);
		
		let addNewTask = 
			<tr>
				<td>{this.state.n_assignments.length + 1}</td>
				<td>
					<input className="w3-input" name="new_task" value={this.state.new_task} onChange={this.handleChange} />
				</td>
				<td>
					<div className="w3-dropdown-hover"> 
						<button className="w3-btn w3-deep-orange">Pick</button>
						<div className="w3-dropdown-content w3-padding dropdown w3-sand" style={{right:0}}>{list}</div>
					</div>
				</td>
				<td><button className="w3-btn w3-green" onClick={() => this.addNew()}>Add</button></td>
			</tr>
		
		return(
		<div>
			<Navbar/>
			<div className="w3-container w3-main" style={{marginLeft: 200}}>
				<br/><br/>
				<h1 className="w3-wide w3-center w3-text-indigo">Modify your event</h1>
				<h3 className="w3-center w3-text-cyan"> -- {this.state.info.fullname} --</h3>
				<br/><br/>
				<div className="w3-row">
					<div className="w3-col l3"><br/></div>
					<div className="w3-col l6">
						<select className="w3-select" name="chosen_name" onChange={this.handleSelect}>
							<option disabled selected>Click here to choose your event</option>
							{option_list}
						</select>
						<br/><br/>
						
						<div className="w3-container w3-card w3-pale-green w3-padding-large w3-animate-zoom">
							<form>
								<b className="">Title *</b>
								<input className="w3-input w3-margin" name="n_title" type="text" 
									onChange={this.handleChange} value={this.state.n_title}/>
								<b className="">Date (deadline) *</b>
								<input className="w3-input w3-margin" name="n_date" type="date" 
									onChange={this.handleChange} value={this.state.n_date}/>
								<b className="">Location *</b>
								<input className="w3-input w3-margin" name="n_location" type="text" 
									onChange={this.handleChange} value={this.state.n_location}/>
								<b className="">Description *</b><br/>
								<textarea placeholder="Maximum 1000 words" style={{height:200}} name="n_description" className="w3-block w3-margin" onChange={this.handleChange} value={this.state.n_description}></textarea>
								<br/>
							</form>
							<br/>
							<b>Assignments *</b>
							<table className="w3-margin w3-table w3-mobile w3-border">
								<tr className="w3-sand"><th>ID</th> <th>Task</th> <th>Personels</th> <th>Action</th> </tr>
								{tasks}
								{addNewTask}
							</table>
							<div className="w3-margin w3-left" >Check all the required fields with asterisk (*)</div>
							<button className="w3-btn w3-red w3-right" onClick={this.handleSubmit}> Modify event </button>
						</div>
					</div>
					<div className="w3-col l3"><br/></div>
				</div>
				<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
			</div>
		</div>
		);
	}
}

export default withRouter(ModifyEvent);