/** @jsx React.DOM */

var App = React.createClass({
    mixins: [ ReactFireMixin, CONSTANTS ],
    
    getInitialState: function() {
        return {
            loggedIn: false,
            email: ''
        };
    },
    
    authAltered: function(userData) {
        if(userData) this.setState({ loggedIn: true, email: userData.password.email });
    },
    
    componentWillMount: function() {
        var fireDataRef = new Firebase(this.firebaseURL);
        fireDataRef.getAuth();
        fireDataRef.onAuth(this.authAltered);
    },
    
   render: function() {
       var loginMessage = this.state.loggedIn ?
            <h3>Welcome, {this.state.email}</h3> :
            <h3>Uh oh</h3>;
       
       return (
            <div className='app' >
                <h1>Superb App</h1>
                {loginMessage}
           
                <RouteHandler loggedIn={this.state.loggedIn} />
            </div>
       );
   }
});

var Authentication = {
    statics: {
        willTransitionTo: function(transition) {
            var nextPath = transition.path;
            //if(! this.props.loggedIn) transition.redirect('/login', {}, { 'nextPath': nextPath });
        }
    }
};
