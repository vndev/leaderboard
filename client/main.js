import React from 'react';

import { Router, Route, browserHistory } from 'react-router';

import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
 
import App from '../imports/ui/App.jsx';

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/aa" component={App}>
      
    </Route>
  </Router>
); 
Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('render-target'));
  toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-center",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }
});