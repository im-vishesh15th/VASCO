import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import {  persistor } from "./redux/store";
import { store} from  "./redux/store";
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter as Router } from "react-router-dom";



ReactDOM.createRoot(document.getElementById('root')).render(
  
     <Provider  store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router>
    <App />
    </Router>
    </PersistGate>
  </Provider>
  
)
