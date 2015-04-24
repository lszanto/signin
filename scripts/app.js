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
            <h3>No loggy</h3>;
       
       return (
            <div className='app' >
                <h1>Chisignin</h1>
                {loginMessage}
           
                <RouteHandler loggedIn={this.state.loggedIn} />
            </div>
       );
   }
});

var Login = React.createClass({
    getInitialState: function() {
        return {
            username: '',
            password: ''
        };
    },

    changeProp: function(e) {
        var nState = this.state;
        nState[e.target.name] = e.target.value;
        this.setState(nState);
    },

    doLogin: function() {
        var fireDataRef = new Firebase(CONSTANTS.firebaseURL);
        fireDataRef.authWithPassword({ email: this.state.username + '@chicagapp.com', password: this.state.password }, function(error, userData) {
            console.log(userData, error);
        });
    },

    render: function() {
        return (
            <div className='loginForm' >
                <form>
                    <label htmlFor='username' >Username</label>
                        <input type='text' placeholder='Username' name='username' id='username' value={this.state.username} onChange={this.changeProp} />

                    <label htmlFor='password' >Password</label>
                        <input type='password' placeholder='Password' name='password' id='password' value={this.state.password} onChange={this.changeProp} />

                    <button type='button' id='loginButton' onClick={this.doLogin} >Login</button>
                </form>
            </div>
        );
    }
});

var Authentication = {
    statics: {
        willTransitionTo: function(transition) {
            var nextPath = transition.path;
            var fireDataRef = new Firebase(CONSTANTS.firebaseURL);
            if(! fireDataRef.getAuth()) transition.redirect('/login', {}, { 'nextPath': nextPath });
            else console.log(fireDataRef.getAuth());
        }
    }
};
