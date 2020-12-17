import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	NavbarText,
	Badge,
} from "reactstrap";
import { logoutAction } from "../redux/actions";
import Cart from "../image/cart1.svg";

class NavigationBar extends Component {
	state = {
		isOpen: false,
		cartItem: 0,
	};

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.cart !== this.props.cart) {
			this.setState({
				cartItem: this.props.cart.length,
			});
		}
	}

	toggle = () => {
		this.setState({ isOpen: !this.state.isOpen });
	};
	logout = () => {
		const { logoutAction } = this.props;
		logoutAction();
		localStorage.removeItem("id");
	};
	Logged = () => {
		const { userID } = this.props;
		if (userID !== 0) {
			return (
				<DropdownMenu right>
					<Link to="/cart">
						<img
							style={{
								width: "30px",
								marginRight: "5px",
							}}
							src={Cart}
							alt=""
						/>
						<Badge color="danger">{this.state.cartItem}</Badge>
					</Link>
					<Link to="/history">
						<DropdownItem>History</DropdownItem>
					</Link>
					<DropdownItem divider />
					<Link to="/">
						<DropdownItem onClick={this.logout}>Logout</DropdownItem>
					</Link>
				</DropdownMenu>
			);
		} else {
			return (
				<DropdownMenu right>
					<Link to="/login">
						<DropdownItem>Login</DropdownItem>
					</Link>
					<DropdownItem divider />
				</DropdownMenu>
			);
		}
	};

	renderEmail = () => {
		const { email } = this.props;
		var emaillogin = email.split("@")[0];
		return emaillogin;
	};

	render() {
		return (
			<div>
				<Navbar
					style={{ backgroundColor: "#808080", color: "black" }}
					expand="md"
				>
					<NavbarBrand style={{ color: "black" }} href="/">
						My Store
					</NavbarBrand>
					<NavbarToggler onClick={this.toggle} />
					<Collapse isOpen={this.state.isOpen} navbar>
						<Nav className="mr-auto" navbar>
							<UncontrolledDropdown nav inNavbar>
								<DropdownToggle style={{ color: "black" }} nav caret>
									Options
								</DropdownToggle>
								{this.Logged()}
							</UncontrolledDropdown>
						</Nav>
						<NavbarText>{this.renderEmail()}</NavbarText>
					</Collapse>
				</Navbar>
			</div>
		);
	}
}
const mapStatetoProps = (state) => {
	return {
		userID: state.user.id,
		email: state.user.email,
		cart: state.cart.cart,
	};
};

export default connect(mapStatetoProps, { logoutAction })(NavigationBar);
// export default connect(mapStatetoProps)(NavigationBar);
