import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Table } from "reactstrap";
import {
	fetchCartAction,
	deleteCartAction,
	addQtyAction,
	subQtyAction,
	checkoutAction,
} from "../redux/actions";
import Swal from "sweetalert2";

class CartPage extends Component {
	state = {};
	componentDidMount() {
		const { userID, fetchCartAction } = this.props;
		fetchCartAction(userID);
	}
	deleteBtn = (id, userID) => {
		const { deleteCartAction } = this.props;
		deleteCartAction(id, userID);
	};
	addBtn = (name, qty, id) => {
		const { addQtyAction, userID } = this.props;
		addQtyAction(name, qty, id, userID);
	};
	MinBtn = (name, qty, id) => {
		const { subQtyAction, userID } = this.props;
		subQtyAction(name, qty, id, userID);
	};
	renderCart = () => {
		const { cart } = this.props;
		return cart.map((val) => {
			return (
				<tr>
					<td>{val.categoryID}</td>
					<td>{val.name}</td>
					<td>
						<img src={val.image} alt={val.name} height="50px" />
					</td>

					<td>
						<Button onClick={() => this.MinBtn(val.name, val.qty, val.id)}>
							-
						</Button>
						{val.qty}
						<Button onClick={() => this.addBtn(val.name, val.qty, val.id)}>
							+
						</Button>
					</td>
					<td>{val.price}</td>
					<td>Rp. {(val.qty * val.price).toLocaleString()}</td>
					<td>
						<Button
							onClick={() => this.deleteBtn(val.id, val.userID)}
							color="danger"
						>
							Delete
						</Button>
					</td>
				</tr>
			);
		});
	};

	grandTotal = () => {
		const { cart } = this.props;
		let total = 0;
		cart.forEach((val) => {
			total += val.qty * val.price;
		});
		return total;
	};
	checkOut = () => {
		const { cart, userID, checkoutAction } = this.props;
		let date = new Date();
		let day = date.getDate();
		let month = date.getMonth();
		let year = date.getFullYear();
		const data = {
			date: `${day}/${month}/${year}`,
			total: this.grandTotal(),
			items: cart,
			userID: userID,
		};

		checkoutAction(data);
	};
	checkOutAlert = () => {
		Swal.fire({
			title: "Checkout?",
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: "green",
			cancelButtonColor: "red",
			confirmButtonText: "Yes",
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire("Thank You!", "Make Sure You Pay Now!", "success");
				this.checkOut();
			}
		});
	};
	render() {
		const { cart } = this.props;
		if (cart.length === 0) {
			return (
				<div>
					<h1>Go Buy Something!</h1>
				</div>
			);
		}
		return (
			<div>
				<Table style={{ textAlign: "center" }} dark>
					<thead>
						<tr>
							<th>Category ID</th>
							<th>name</th>
							<th>image</th>
							<th>qty</th>
							<th>price</th>
							<th>Total</th>
							<th>action</th>
						</tr>
					</thead>
					<tbody>{this.renderCart()}</tbody>
					<tfoot>
						<tr>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td>
								<h4>Grand Total:</h4>
							</td>
							<td> Rp. {this.grandTotal().toLocaleString()}</td>
							<td>
								<Button onClick={this.checkOutAlert}>check out</Button>
							</td>
						</tr>
					</tfoot>
				</Table>
			</div>
		);
	}
}
const mapStatetoProps = (state) => {
	return {
		userID: state.user.id,
		cart: state.cart.cart,
	};
};
export default connect(mapStatetoProps, {
	fetchCartAction,
	deleteCartAction,
	addQtyAction,
	subQtyAction,
	checkoutAction,
})(CartPage);
