import React from 'react';
import {connect} from 'react-redux';
import {Route, withRouter} from 'react-router-dom';

import HeaderBar from './header-bar';
import LandingPage from './landing-page';
import Dashboard from './dashboard';
import RegistrationPage from './registration-page';
import {refreshAuthToken, clearAuth} from '../actions/auth';

export class App extends React.Component {
    componentDidUpdate(prevProps) {
        if (!prevProps.loggedIn && this.props.loggedIn) {
            // When we are logged in, refresh the auth token periodically
            this.startPeriodicRefresh();
        } else if (prevProps.loggedIn && !this.props.loggedIn) {
            // Stop refreshing when we log out
            this.stopPeriodicRefresh();
        }
    }

    componentWillUnmount() {
        this.stopPeriodicRefresh();
    }

    componentDidMount() {
        this.startInactivityTimeout();
      
    }

    startInactivityTimeout() {
        this.timeoutInterval = setInterval(
            () => this.props.dispatch(clearAuth()),
            1 * 60 * 1000 
        );
    }

    alertInactiveUser () {
        this.timeoutInterval = setInterval(() => 
            alert('You will be logged after after 1 more minute of inactivity. Please press OK to continue'),
                10 * 1000
            );
    }


    activityhappened(){
        console.log('clearinterval')
        this.restartTimer = clearInterval(this.timeoutInterval)
        this.startInactivityTimeout();
        this.alertInactiveUser();
    }

    startPeriodicRefresh() {
        this.refreshInterval = setInterval(
            () => this.props.dispatch(refreshAuthToken()),
            10 * 60 * 1000 // refresh every 10 min

        );
    }

    stopPeriodicRefresh() {
        if (!this.refreshInterval) {
            return;
        }

        clearInterval(this.refreshInterval);
    }

   

    render() {
        const style = {
            height: '100%',
            width: '100%'
        }
        return (
            <div onMouseMove={()=> this.activityhappened()} className="app" style={style}>
                <HeaderBar />
                <Route exact path="/" component={LandingPage} />
                <Route exact path="/dashboard" component={Dashboard} />
                <Route exact path="/register" component={RegistrationPage} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    hasAuthToken: state.auth.authToken !== null,
    loggedIn: state.auth.currentUser !== null
});

// Deal with update blocking - https://reacttraining.com/react-router/web/guides/dealing-with-update-blocking
export default withRouter(connect(mapStateToProps)(App));
