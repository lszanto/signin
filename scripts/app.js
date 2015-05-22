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
                <RouteHandler loggedIn={this.state.loggedIn} />
            </div>
       );
   }
});

var Login = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },

    getInitialState: function() {
        return {
            username: '',
            password: '',
            error: false
        };
    },

    changeProp: function(e) {
        var nState = this.state;
        nState[e.target.name] = e.target.value;
        this.setState(nState);
    },

    doLogin: function() {
        var { router } = this.context;
        var nextPath = router.getCurrentQuery().nextPath;
        var fireDataRef = new Firebase(CONSTANTS.firebaseURL);
        fireDataRef.authWithPassword({
            email: this.state.username + '@chicagapp.com',
            password: this.state.password },
            function(error, userData) {
                if(error) return this.setState({ error: true });
                if(nextPath) router.replaceWith(nextPath);
                else router.replaceWith('kidslist');
            }.bind(this)
        );
    },

    render: function() {
        var errors = this.state.error ? <p>Bad login information</p> : '';
        return (
            <div className='loginForm' >
                <form>
                    <label htmlFor='username' >Username</label>
                        <input type='text' placeholder='Username' name='username' id='username' value={this.state.username} onChange={this.changeProp} />

                    <label htmlFor='password' >Password</label>
                        <input type='password' placeholder='Password' name='password' id='password' value={this.state.password} onChange={this.changeProp} />

                    <button type='button' id='loginButton' onClick={this.doLogin} >Login</button>
                    {errors}
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
        }
    }
};
