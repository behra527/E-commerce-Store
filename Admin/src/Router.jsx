import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import {
  Dashboard,
  Geography,
  User,
  Item,
  Balance,
  Order,
  CancelOrder,
  History,
} from "./scenes";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/geography" element={<Geography />} />
          <Route path="/user" element={<User />} />
          <Route path="/item" element={<Item />} />
          <Route path="/balance" element={<Balance />} />
          <Route path="/order" element={<Order />} />
          <Route path="/cancel-order" element={<CancelOrder />} />
          <Route path="/history" element={<History />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
