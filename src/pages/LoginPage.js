import Axios from "axios";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Button, Input } from "reactstrap";
import { api_url } from "../helpers/api_url";
import { loginAction, fetchCartAction } from "../redux/actions";

class LoginPage extends Component {
	state = {
		loginInfo: {
			email: "",
			password: "",
		},
	};

	onchangeInput = (e) => {
		this.setState({
			loginInfo: {
				...this.state.loginInfo,
				[e.target.id]: e.target.value,
			},
		});
	};
	clickLogin = () => {
		const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		var regexPass = /^(?=.*\d)(?=.*[a-z]).{6,}$/;
		const { email, password } = this.state.loginInfo;
		if (email.match(regexEmail) && password.match(regexPass)) {
			Axios.get(`${api_url}/users?email=${email}&password=${password}`)
				.then((res) => {
					if (res.data.length === 1) {
						this.props.loginAction(res.data[0]);
						localStorage.setItem("id", res.data[0].id);
						this.props.fetchCartAction(res.data[0].id);
					} else if (res.data.length === 0) {
						Axios.post(`${api_url}/users`, { email: email, password: password })
							.then((res) => {
								this.props.loginAction(res.data);
								localStorage.setItem("id", res.data.id);
								console.log(res.data);
								this.props.fetchCartAction(res.data.id);
							})
							.catch((err) => {
								console.log(err);
							});
					}
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			alert(
				"email harus lengkap dan password minimal 6 karakter (1 simbol, 1 angka, 1 huruf besar)"
			);
		}
	};
	render() {
		const { userID } = this.props;
		if (userID !== 0) {
			return <Redirect to="/" />;
		}
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "column",
					minHeight: "80vh",
				}}
			>
				<div className="my-2">
					<Input
						placeholder="email"
						type="email"
						id="email"
						onChange={this.onchangeInput}
					/>
				</div>
				<div className="my-2">
					<Input
						placeholder="password"
						type="password"
						id="password"
						onChange={this.onchangeInput}
					/>
				</div>
				<div className="my-2">
					<Button
						style={{
							backgroundColor: "#333333",
							border: "none",
							color: "#D6D6D6",
						}}
						onClick={this.clickLogin}
					>
						Login
					</Button>
				</div>
			</div>
		);
	}
}
const mapStatetoPros = (state) => {
	return {
		userID: state.user.id,
		emailUser: state.user.email,
	};
};

export default connect(mapStatetoPros, { loginAction, fetchCartAction })(
	LoginPage
);
