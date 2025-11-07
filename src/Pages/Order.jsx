import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Table, Button, Container, Spinner } from "react-bootstrap";
import "../styles/Orders.css";
import 'animate.css';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);

  // Load user email from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setUserEmail(storedEmail);
    } else {
      Swal.fire("Not Logged In", "Please log in to view your orders.", "warning");
    }
  }, []);

  // Fetch orders when userEmail is available
  useEffect(() => {
    if (!userEmail) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "https://dexter-e4919-default-rtdb.firebaseio.com/order.json"
        );
        const data = res.data;

        const filteredOrders = Object.entries(data || {})
          .map(([id, order]) => ({ id, ...order }))
          .filter((order) => order.email === userEmail);

        setOrders(filteredOrders.reverse());
      } catch (err) {
        Swal.fire("Error", "Failed to fetch orders.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userEmail]);

  // Cancel order function
  const cancelOrder = async (id) => {
    Swal.fire({
      icon: "warning",
      title: "Cancel Order?",
      text: "This will delete your order permanently.",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(
          `https://dexter-e4919-default-rtdb.firebaseio.com/order/${id}.json`
        );
        setOrders(orders.filter((o) => o.id !== id));
        Swal.fire("Cancelled!", "Your order has been deleted.", "success");
      }
    });
  };

  return (
    <Container className="order-container py-5 animate__animated animate__fadeIn">
      <h2 className="text-center mb-4 fw-bold text-dark">
        {/* Order */}
        {/* My Orders {userEmail && <>for <span className="text-primary">{userEmail}</span></>} */}
      </h2>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center text-muted fs-5">No orders found.</div>
      ) : (
        <div className="table-responsive">
          <Table bordered hover className="order-table">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Amount</th>
                <th>Shipping</th>
                <th>Date</th>
                <th>Txn ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <tr key={o.id}>
                  <td>{i + 1}</td>
                  <td className="d-flex align-items-center">
                    <img
                      src={o.cartItems[0]?.mainImage}
                      alt="product"
                      className="order-img me-2"
                    />
                    <div className="text-start">
                      <strong>{o.cartItems[0]?.name}</strong>
                      <p className="text-muted small m-0">{o.cartItems[0]?.description}</p>
                    </div>
                  </td>
                  <td>£{o.cartItems[0]?.price}</td>
                  <td>{o.cartItems[0]?.quantity}</td>
                  <td>£{o.amount}</td>
                  <td>
                    {o.shippingInfo.firstName} {o.shippingInfo.lastName}
                    <br />
                    {o.shippingInfo.city}, {o.shippingInfo.state}
                    <br />
                    <span className="small text-muted">{o.shippingInfo.phone}</span>
                  </td>
                  <td>{new Date(o.createdAt).toLocaleString()}</td>
                  <td className="text-primary">{o.transactionId}</td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => cancelOrder(o.id)}
                    >
                      Cancel
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default Order;
