import React from 'react';
import {connect} from 'react-redux';
import requiresLogin from './requires-login';
import {fetchProtectedData} from '../actions/protected-data';
import {clearAuth} from '../actions/auth';


export class Dashboard extends React.Component {
    componentDidMount() {
        this.props.dispatch(fetchProtectedData());
        this.startInactivityTimeout();
      
    }



    startInactivityTimeout() {
        this.timeoutInterval = setInterval(
            () => this.props.dispatch(clearAuth()),
            5 * 1000 
            
        );
    }

    activityhappened(){
        console.log('clearinterval')
        this.restartTimer = clearInterval(this.timeoutInterval)
        this.timeoutInterval = setInterval(
            () => this.props.dispatch(clearAuth()),
            5 * 1000 
            
        );
    }

    render() {
        return (
            <div onMouseMove={()=>this.activityhappened()} className="dashboard">
                <div className="dashboard-username">
                    Username: {this.props.username}
                </div>
                <div className="dashboard-name">Name: {this.props.name}</div>
                <div className="dashboard-protected-data">
                    Protected data: {this.props.protectedData}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const {currentUser} = state.auth;
    return {
        username: state.auth.currentUser.username,
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        protectedData: state.protectedData.data
    };
};

export default requiresLogin()(connect(mapStateToProps)(Dashboard));
