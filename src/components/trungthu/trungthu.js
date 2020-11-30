import React from 'react';
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import CurrencyFormat from 'react-currency-format';
import Navbar from '../navbar/Navbar';
import {URL} from '../../URL';
 
class TrungThu extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			info_username : "",
			info_token : "",
			info: {},
			n_id: "", n_ten : "",n_dt : "",n_diachi : "",n_sanpham : "",n_ghichu : "", n_shipper : "", n_note: "",
			list : [], users_list : [],
			tab : 0,
			submit_mess : "", 
			isUpdated: false,
		}
		this.verify = this.verify.bind(this);
		this.getUserInfo = this.getUserInfo.bind(this);
		this.getUsersList = this.getUsersList.bind(this);
		this.handleSwitch = this.handleSwitch.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleDelivery = this.handleDelivery.bind(this);
		this.handleRefresh = this.handleRefresh.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
		this.handleDone = this.handleDone.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
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
			this.getList();
			this.getUsersList();
		});
	}
	
	getUsersList(){
		axios.get(URL + "/getUsersList.php?pass=sC0t1fy").then(response =>{
			return response.data;
		}).then(data => {
			this.setState({users_list : data.list.sort()});
		});
	}
	
	getList(){
		let data = new FormData();
		data.set("psw", "trungthu2020");
		axios({
			method: "post",
			data : data,
			url: URL + "/trungthu/getList.php",
			headers: {'Content-Type': 'multipart/form-data'},
			}).then(res => {return res.data}).then(data => {
				// console.log(data);
				let new_data = data, new_list = [];
				new_data.map((i) => {
					let obj = i;
					obj.substring(1, obj.length-1);
					obj = JSON.parse(obj);
					// console.log(obj);
					new_list.push(obj);
				})
				// console.log(new_list);
				let tongtien = 0, tienthu = 0;
				new_list.map((i) => {
					tongtien += parseInt(i.ghichu);
					if (i.done==1 || i.shipper=="dịch vụ ngoài") tienthu += parseInt(i.ghichu);
				});
				this.setState({list: new_list, tongtien: tongtien, tienthu: tienthu});
			});
	}
	
	componentDidMount(){
		this.verify();
		// this.getEvents();
	}
	
	handleSwitch(e){
		let v = e.target.name;
		this.setState({tab: v, submit_mess:"", n_id: "", n_ten: "", n_dt:"", n_diachi: "", n_sanpham:"", n_ghichu: "", n_shipper: "", n_note: ""});
	}

	handleChange(e){
		let target = e.target;
		let value = target.value;
		let name = target.name;
		
		this.setState({[name]: value});
		
		// console.log(name, value);
	}
	
	handleDelivery(e, id){
		let value = e.target.name;
		// console.log(value, id);
		let list1 = this.state.list;
		// 1 là huỷ, 0 là nhận
		if (value == 1){
			
			list1[id].shipper = "";
		}
		else if (value == 0){
			list1[id].shipper = this.state.info_username;
		}
		this.setState({list: list1});
		// console.log(list);
		let data = new FormData();
		data.set("id", list1[id].id);
		data.set("shipper", list1[id].shipper);
		axios({
			method: "post",
			data : data,
			url: URL + "/trungthu/updateDelivery.php",
			headers: {'Content-Type': 'multipart/form-data'},
		});
	}
	
	handleSubmit(){
		// console.log(this.state.n_id, this.state.n_ten, this.state.n_dt, this.state.n_diachi, this.state.n_sanpham, this.state.n_ghichu, this.state.n_note, this.state.n_shipper);
		if (this.state.n_ten !== "" && this.state.n_sanpham !== ""){
			let data = new FormData();
			if (this.state.isUpdated === true)
				data.set("id", this.state.n_id);
			data.set("ten", this.state.n_ten);
			data.set("dienthoai", this.state.n_dt);
			data.set("diachi", this.state.n_diachi);
			data.set("sanpham", this.state.n_sanpham);
			if (this.state.n_shipper == "*")
				data.set("shipper", "");
			else
				data.set("shipper", this.state.n_shipper);
			data.set("ghichu", this.state.n_ghichu);
			data.set("note", this.state.n_note);
			axios({
				method: "post",
				url: URL + "/trungthu/new.php",
				data: data,
				headers: {'Content-Type': 'multipart/form-data'},
			}).then(res => {return res.data}).then(data => {
				// console.log(data);
				if (data.status == "ok"){
					if (this.state.isUpdated === false)
						this.setState({submit_mess: "Đã thêm đơn hàng thành công!", n_id: "", n_ten: "", n_dt:"", n_diachi: "", n_sanpham:"", n_ghichu: "", n_shipper: "", n_note: ""});
					else
						this.setState({submit_mess: "Đã chỉnh sửa đơn hàng thành công!"});
				this.getList();
				}
			});
		}
	}
	
	handleRefresh(){
		this.getList();
	}
	
	handleEdit(e){
		this.setState({submit_mess: ""});
		let v = e.target.value;
		if (v == ""){
			this.setState({isUpdated: false, n_id: "", n_ten: "", n_dt:"", n_diachi: "", n_sanpham:"", n_ghichu: "", n_shipper: "", n_note: ""});
		}
		else
		{
			let list1 = this.state.list;
			this.setState({isUpdated: true, n_id: list1[v].id ,n_ten: list1[v].ten, n_dt: list1[v].dienthoai, n_diachi: list1[v].diachi, n_sanpham : list1[v].sanpham, n_shipper: list1[v].shipper, n_ghichu: list1[v].ghichu, n_note: list1[v].note});
		}
	}
	
	handleDone(e, id){
			console.log(id);
			let list1 = this.state.list;
			let data = new FormData();
			data.set("id", list1[id].id);
			axios({
				method: "post",
				url: URL + "/trungthu/updateDone.php",
				data: data,
				headers: {'Content-Type': 'multipart/form-data'},
			}).then(res => {return res.data}).then(data => {
				if (data.status == "ok"){
					// console.log("đã xong");
					list1[id].done = "1";
					this.setState({list: list1});
					this.getList();
				}
			});
	}
	
	handleRemove(e){
		// console.log(this.state.n_id);
		let data = new FormData();
		data.set("id", this.state.n_id);
		axios({
			method: "post",
			url: URL + "/trungthu/removeOrder.php",
			data: data,
			headers: {'Content-Type': 'multipart/form-data'},
		}).then(res => {return res.data}).then(data => {
			if (data.status === "ok"){
				// console.log("removed");
				this.setState({isUpdated: false, n_id: "", n_ten: "", n_dt:"", n_diachi: "", n_sanpham:"", n_ghichu: "", n_shipper: "", n_note: ""});
				this.getList();
			}
		});
	}
	
	render(){
		let content;
		
		if (this.state.tab == 1){		//Thêm khách hàng !!!!
			let shippers_list = this.state.users_list;
			let shippers = shippers_list.map((i) => {
				return (<option value={i}>{i}</option>)
			});
			
			let orders = this.state.list;
			let danhsach_orders = orders.map((i, ind) => {
				if (i.done == 0)
					return (<option value={ind}>Chỉnh sửa: ({i.id}) {i.ten}</option>);
				else 
					return (<option disabled className="w3-text-grey" value={ind}>Đã giao: ({i.id}) {i.ten}</option>); 
			});
			let remove_btn;
			if (this.state.n_id !== ""){
				remove_btn = <button className="w3-btn w3-red w3-right" onClick={(e) => {if (window.confirm("Bạn có chắc muốn xoá đơn hàng này? Việc này không thể quay lại!")) this.handleRemove(e)}}>Xoá đơn hàng</button>;
			}
				
			content = (
				<div className="w3-container">
					<h2 className="w3-center w3-wide w3-text-blue">Thêm hoặc chỉnh sửa đơn hàng</h2>
					<br/>
					<div className="w3-row">
						<div className="w3-col l3"><br/></div>
						<div className="w3-col l6">
						<div className="w3-text-red w3-center w3-animate-zoom">{this.state.submit_mess}</div>
						<br/>
							<select className="w3-select w3-border w3-pale-blue" onChange={this.handleEdit}>
								<option value="" selected disabled>Chọn tạo mới hoặc chỉnh sửa ở đây</option>
								<option value="">Tạo mới</option>
								{danhsach_orders}
							</select>
							<br/><br/>
							<div className="w3-card w3-padding-large  w3-white">
								<input className="w3-input" type="text" placeholder="Tên khách hàng" 
									name="n_ten" value={this.state.n_ten} onChange={this.handleChange}/>
								<input className="w3-input" type="text" placeholder="Điện thoại" 
									name="n_dt" value={this.state.n_dt} onChange={this.handleChange}/>
								<input className="w3-input" type="text" placeholder="Địa chỉ giao hàng" 
									name="n_diachi" value={this.state.n_diachi} onChange={this.handleChange}/>
								<input className="w3-input" type="text" placeholder="Sản phẩm + số lượng" 
									name="n_sanpham" value={this.state.n_sanpham} onChange={this.handleChange}/>
								<select className="w3-select"
									name="n_shipper" value={this.state.n_shipper} onChange={this.handleChange}>
									<option value="" disabled selected>Chọn shipper</option>
									<option value="*">Tự do nhận việc</option>
									<option value="dịch vụ ngoài" className="w3-text-green">Dịch vụ ngoài</option>
									{shippers}
								</select>
								
									
								<input className="w3-input" type="number" placeholder="Tổng tiền sản phẩm (không tính ship) (chỉ ghi số, ví dụ 50000)" name="n_ghichu" value={this.state.n_ghichu} onChange={this.handleChange}/>
								
								<input className="w3-input" type="text" placeholder="Ghi chú" 
									name="n_note" value={this.state.n_note} onChange={this.handleChange}/>
								<br/>
								<div className="w3-bar">
									<button className="w3-btn w3-green w3-padding w3-left" onClick={this.handleSubmit}>OK</button>
									{remove_btn}
								</div>
							</div>	
						</div>
						<div className="w3-col l3"><br/></div>
					</div>
				</div>
			);
		}
		// !!!!!!!!!!!!!!!!! Các đơn hàng !!!!!!!!!!!!!!!!
		else if (this.state.tab == 2){
			let ds = this.state.list;
			let list = ds.map((i, ind) => {
				let last, style;
				
				if (i.done == "1")
					last = <div className="w3-padding w3-opacity w3-orange">{i.shipper} đã giao!</div>;
				else if (i.shipper != "" && i.shipper != this.state.info_username)
					last = <div className="w3-padding w3-sand"> {i.shipper} </div>;
				else if (i.shipper == this.state.info_username){
					last = <button className="w3-btn w3-red" name="1" 
						onClick={(e) => {this.handleDelivery(e, ind)}}>Huỷ</button>;
					style = "w3-pale-green";
				}
				else
					last = <button className="w3-btn w3-blue" name="0" onClick={(e) => {this.handleDelivery(e, ind)}}>Nhận</button>;
				
				return(
					<tr className={style}><td>{i.id}</td><td>{i.ten}</td><td>{i.dienthoai}</td><td>{i.diachi}</td><td>{i.sanpham}</td><td><CurrencyFormat displayType={'text'} value={i.ghichu} thousandSeparator={true} prefix={'đ '}/></td><td>{i.note}</td><td>{last}</td></tr>
				);
			})
			content = (
				<div className="w3-container">
					<h2 className="w3-center w3-wide w3-text-blue">Các đơn hàng đã được đặt</h2>
					<br/>
					<div className="w3-center">Bấm nút "Nhận" để nhận giao đơn hàng, "Huỷ" để huỷ giao đơn hàng</div>
					<br/>
					<div className="w3-center"><b>Tổng số tiền đã bán: </b><CurrencyFormat displayType={'text'} value={this.state.tongtien} thousandSeparator={true} prefix={'đ'}/></div>
					<br/><br/>
					<table className="w3-table w3-bordered w3-responsive">
						<tr><th>ID</th><th>Tên khách</th><th>Điện thoại</th><th>Địa chỉ</th><th>Sản phẩm</th><th>Tổng tiền</th><th>Ghi chú</th><th>Giao hàng</th></tr>
						{list}
					</table>
				</div>
			)
		}
		
		// ------------Code here part 3----------
		else if (this.state.tab == 3){
			let list1 = this.state.list, flag = 0;
			let danhsach_cuatoi;
			danhsach_cuatoi = list1.map((i, ind) => {
				if (i.shipper == this.state.info_username && i.done == 0){
					flag = 1;
					return (
						<div>
						<div className="w3-container w3-sand w3-card w3-padding">
							<h2 className="w3-red w3-padding">{i.ten}</h2>
							<br/>
							<div><b>Địa chỉ: </b> {i.diachi} </div>
							<div><b>Điện thoại: </b> {i.dienthoai}</div>
							<div><b>Sản phẩm: </b> {i.sanpham}</div>
							<div><b>Ghi chú: </b> {i.note}</div>
							<br/>
							<div><b>Số tiền phải thu: </b> <CurrencyFormat displayType={'text'} value={i.ghichu} thousandSeparator={true} prefix={'đ '}/></div>
							<br/>
							<div className="w3-btn w3-deep-orange" onClick={(e) => {if (window.confirm("Bạn có chắc đã giao hàng và thu đủ tiền cho đơn hàng này chưa? Nếu có gì cần chỉnh sửa thì hãy chỉnh sửa trước khi tiếp tục. Thao tác này không thể quay ngược lại.")) this.handleDone(e, ind)}}>Đã giao hàng!</div>
						</div>
						<br/>
						</div>
					);
				}
			});
			if (flag == 0) danhsach_cuatoi  = <h4 className="w3-center w3-red">Bạn không có đơn hàng phải giao.<br/>Chủ động nhận đơn hàng ở "Các đơn hàng". <br/>Hoặc đợi được phân công</h4>;
			content = (
				<div className="w3-container ">
					<h2 className="w3-center w3-wide  w3-text-blue">Để xem mình phải ship cho ai nào</h2>
					<br/><br/>
					<div className="w3-row">
						<div className="w3-col l3"><br/></div>
						<div className="w3-col l6">{danhsach_cuatoi}</div>
						<div className="w3-col l3"><br/></div>
					</div>
				</div>
			);
		}
		
		return(
		<div>
			<Navbar />
			<br/><br/>
			<div className="w3-container w3-main" style={{marginLeft: 200}}>
				<br/>
				<h1 className="w3-center w3-wide w3-text-indigo"> Để em nào cũng có trung thu 2020 </h1>
				<br/>
				<div className="w3-row-padding w3-bar w3-center  w3-animate-zoom">
					<div className="w3-col w3-large m4 w3-padding-large">
						<button className="w3-btn w3-blue" name="1"
							onClick={this.handleSwitch}>Quản lý đơn hàng</button>
					</div>
					<div className="w3-col w3-large m4 w3-padding-large">
						<button className="w3-btn w3-blue" name="2"
							onClick={this.handleSwitch}>Các đơn hàng</button>
					</div>
					<div className="w3-col w3-large m4 w3-padding-large">
						<button className="w3-btn w3-blue" name="3"
							onClick={this.handleSwitch}>Danh sách của tôi</button>
					</div>
				</div>
				<div className="w3-center  w3-animate-zoom">
					<button className="w3-btn w3-green" onClick={this.handleRefresh}>Refresh orders</button>
				</div>
				{content}
			</div>
		</div>	
		);
	}
}

export default withRouter(TrungThu);