import React from 'react';
import axios from 'axios';
import './style.css';
import {URL} from '../../URL';

class TaskView extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			info_username : "",
			events : [],
		};
		
		this.getUserInfo = this.getUserInfo.bind(this);
		this.getEvents = this.getEvents.bind(this);
	}
	
	getUserInfo(){
		let ls_usr = localStorage.getItem('username');
		let ss_usr = sessionStorage.getItem('username');
		let usr = ls_usr ? ls_usr : ss_usr;
		this.setState({info_username: usr});
		
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
	
	getEvents(){
		let data = new FormData();
		let usrn = sessionStorage.getItem("username") ? sessionStorage.getItem("username") : localStorage.getItem("username")
		data.set("username",usrn);
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
		});	
	}
	
	componentDidMount(){
		this.getUserInfo();
		this.getEvents();
	}
	
	render(){
		let body;
		let events = this.state.events;
		let pers = "";
		
		function isInPast(check_date){
				var today_date = new Date().toISOString().slice(0,10);
				// console.log(check_date, today_date);
				if (check_date < today_date)
					return true;
				else
					return false;
			}
		
		body = events.map((i) =>{
			let obj = JSON.parse(i);
			let flag = 0;
			// console.log(obj);
			let task = obj.assignment.map((j, index) => {
				// console.log(j);
				pers = j.personels.map((k, ind) => {
					
					let check = "";
					
					if (k==this.state.info_username){
						
						if (obj.done[index][ind]==='y')
						check = '✓';

						flag = 1;
						if (check === '')
							return <div className="w3-margin">{j.task}</div>;
						else
							return <div className="w3-margin">{j.task} ✓ </div>;
					}
				});
				return pers;
			});
			if (flag == 1 && !isInPast(obj.date))
			return(
				<div className="w3-card-4 w3-pale-green w3-padding w3-margin">
					<fieldset>
						<legend><b className="w3-padding">{obj.title}</b></legend>
						{task}
					</fieldset>
					<br/>
				</div>
			);
		});
		
		return(
		<div className="w3-container">
			<br/><br/>
			<h2 className="w3-center w3-wide w3-text-blue"> Incoming tasks </h2>
			<div className="taskView">
				{body}
				<br/>
			</div>
		</div>
		);
	}
}

export default TaskView;