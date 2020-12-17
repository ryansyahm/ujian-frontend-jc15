import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { addToCartAction } from "../redux/actions";
import { Toast, ToastHeader } from "reactstrap";

class ProductModal extends Component {
	state = {
		isOpen: false,
		qty: 1,
		data: [],
		check: false,
	};

	toggle = () => {
		const { email } = this.props;
		if (email !== "") {
			this.setState({ isOpen: !this.state.isOpen });
		} else {
			alert("Please Login");
		}
	};

	toast = () => {
		return (
			<div className="p-3 my-2 rounded">
				<Toast>
					<ToastHeader>Product Has Added</ToastHeader>
				</Toast>
			</div>
		);
	};
	successBtn = () => {
		this.setState({
			isOpen: !this.state.isOpen,
			check: false,
		});
	};
	CartSuccess = () => {
		return (
			<div>
				<Button color="success" onClick={this.successBtn}>
					Close
				</Button>
			</div>
		);
	};
	selectedCart = () => {
		const { products, id } = this.props;
		let res = products.find((val) => {
			return id === val.id;
		});

		return (
			<div>
				<Button
					color="primary"
					onClick={this.addToCartBtn}
					disabled={res.stock === 0}
				>
					Add to Cart
				</Button>
				<Button color="secondary" onClick={this.toggle}>
					Cancel
				</Button>
			</div>
		);
	};
	addToCartBtn = () => {
		const { addToCartAction, products, id, userID, cart } = this.props;
		let res = products.find((val) => {
			return val.id === id;
		});
		let data = {
			name: res.name,
			categoryID: res.categoryID,
			image: res.image,
			qty: this.state.qty,
			userID: userID,
			price: res.price,
		};
		let result = cart.find((val) => {
			return val.name === res.name;
		});
		if (result) {
			let tot = result.qty + this.state.qty;
			if (tot <= res.stock) {
				addToCartAction(data);
				this.setState({
					check: true,
				});
			} else {
				alert("No Stock");
			}
		} else {
			addToCartAction(data);
			this.setState({
				check: true,
			});
		}
	};
	increaseBtn = () => {
		this.setState({
			qty: this.state.qty + 1,
		});
	};
	decreaseBtn = () => {
		this.setState({
			qty: this.state.qty - 1,
		});
	};
	renderProducts = () => {
		const { qty } = this.state;
		const { products, id } = this.props;
		let res = products.find((val) => {
			return val.id === id;
		});

		return (
			<div>
				<img src={res.image} alt={res.name} height="70px" />
				<div>Rp. {res.price.toLocaleString()}</div>
				<div>Available : {res.stock}</div>
				<div>
					<Button onClick={this.decreaseBtn} disabled={this.state.qty === 1}>
						-
					</Button>
					<span className="mx-2">{qty}</span>
					<Button
						onClick={this.increaseBtn}
						disabled={this.state.qty === res.stock}
					>
						+
					</Button>
				</div>
			</div>
		);
	};

	renderModal = () => {
		if (this.state.check) {
			return (
				<div>
					<Button color="info" onClick={this.toggle}>
						Add to Cart
					</Button>
					<Modal isOpen={this.state.isOpen} toggle={this.toggle}>
						<ModalHeader toggle={this.toggle}>
							Do You Want to Add to Cart?
						</ModalHeader>
						<ModalBody>{this.toast()}</ModalBody>
						<ModalFooter>{this.CartSuccess()}</ModalFooter>
					</Modal>
				</div>
			);
		} else {
			return (
				<div>
					<Button color="info" onClick={this.toggle}>
						Add to Cart
					</Button>
					<Modal isOpen={this.state.isOpen} toggle={this.toggle}>
						<ModalHeader toggle={this.toggle}>
							Do You Want to Add to Cart?
						</ModalHeader>
						<ModalBody>{this.renderProducts()}</ModalBody>
						<ModalFooter>{this.selectedCart()}</ModalFooter>
					</Modal>
				</div>
			);
		}
	};

	render() {
		return <div>{this.renderModal()}</div>;
	}
}

const mapStatetoProps = ({ product, cart, user }) => {
	return {
		products: product.productList,
		cart: cart.cart,
		email: user.email,
		userID: user.id,
	};
};
export default connect(mapStatetoProps, { addToCartAction })(ProductModal);
