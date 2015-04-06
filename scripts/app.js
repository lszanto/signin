/** @jsx React.DOM */

var KidsList = React.createClass({
    mixins: [ReactFireMixin, CONSTANTS],

    getInitialState: function() {
        return {
            kids: [ ]
        };
    },
    
    componentWillMount: function() {
        var fireDataRef = new Firebase(this.firebaseURL);
        this.bindAsArray(fireDataRef, 'kids');
    },
    
    componentWillUnmount: function() {
        this.firebaseRef.off();
    },
    
    addKid: function(k) {
        this.firebaseRefs.kids.push(k);
    },
    
    deleteKid: function(ref) {
        var removeRef = new Firebase(this.firebaseURL + ref);
        removeRef.remove();
    },
    
    updateKid: function(k) {
        var updateRef = new Firebase(this.firebaseURL + k._ref);
        k._ref = null;
        updateRef.update(k);
    },

    render: function() {
        this.state.kids.sort(function(a, b) {
            if(a.year < b.year) return -1;
            if(a.year > b.year) return 1;
            return 0;
        });
        
        var kidsList = this.state.kids.map(function(kid, key) {
            return <KidComponent details={kid} onDelete={this.deleteKid} onUpdate={this.updateKid} />;
        }.bind(this));
        
        if(this.state.kids.length < 1) kidsList = 'No kids yet';

        return (
            <div className="kidsList" >
                <div className="list" >
                    { kidsList }
                </div>
                
                <hr />
            
                <AddKid onAdd={this.addKid} />
            </div>
        );
    }
});

// component for each individual kid
var KidComponent = React.createClass({
    handleDelete: function(e) {
        this.props.onDelete(this.props.details._ref);
    },
    
    changeProp: function(e) {
        var uKid = this.props.details;
        uKid[e.target.name] = e.target.value;
        this.props.onUpdate(uKid);
    },

    render: function() {
        return (
            <div className="kidComponent" >
                <input type='text' name='name' className='name' placeholder='Full Name' onChange={this.changeProp} value={this.props.details.name} />
                <select name='gender' onChange={this.changeProp} defaultValue={this.props.details.gender} >
                    <option value='boy' >Boy</option>
                    <option value='girl' >Girl</option>
                </select>
                <select name='year' onChange={this.changeProp} defaultValue={this.props.details.year} >
                    <option value='6' >6</option>
                    <option value='7' >7</option>
                    <option value='8' >8</option>
                    <option value='9' >9</option>
                    <option value='10' >10</option>
                    <option value='11' >11</option>
                    <option value='12' >12</option>
                </select>
                <input type='text' name='school' className='school' placeholder='School' onChange={this.changeProp} value={this.props.details.school} />
                <input type="text" name="parent" className="parent" placeholder="Parent" value={this.props.details.parent} onChange={this.changeProp} />
                <input type="text" name="parent_phone" className="parent_phone" placeholder="Parents Phone" value={this.props.details.parent_phone} onChange={this.changeProp} />
                <input type="text" name="allergies" className="allergies" placeholder="Allergies" value={this.props.details.allergies} onChange={this.changeProp} />
                <button onClick={this.handleDelete} >Delete</button>
            </div>
        );
    }
});

// component for adding a kid
var AddKid = React.createClass({
    getInitialState: function() {
        return {
            name: '',
            gender: 'boy',
            year: 6,
            school: '',
            parent: '',
            parent_phone: '',
            allergies: ''
        };
    },
    
    handleAdd: function() {
        this.props.onAdd({ name: this.state.name, gender: this.state.gender, year: this.state.year, school: this.state.school, parent: this.state.parent, parent_phone: this.state.parent_phone, allergies: this.state.allergies });
        this.setState(this.getInitialState());
    },
    
    changeProp: function(e) {
        // grab current state
        var ns = this.state;
        
        // update selected property
        ns[e.target.name] = e.target.value;
        
        // set our new state
        this.setState(ns);
    },

    render: function() {
        return (
            <div className="addKid" >
                <input type="text" name="name" className="name" placeholder="Full Name" value={this.state.name} onChange={this.changeProp} />
                <select name='gender' onChange={this.changeProp} defaultValue={this.state.gender} >
                    <option value='boy' >Boy</option>
                    <option value='girl' >Girl</option>
                </select>
                <select name='year' onChange={this.changeProp} defaultValue={this.state.year} >
                    <option value='6' >6</option>
                    <option value='7' >7</option>
                    <option value='8' >8</option>
                    <option value='9' >9</option>
                    <option value='10' >10</option>
                    <option value='11' >11</option>
                    <option value='12' >12</option>
                </select>
                <input type="text" name="school" className="school" placeholder="School" value={this.state.school} onChange={this.changeProp} />
                <input type="text" name="parent" className="parent" placeholder="Parent" value={this.state.parent} onChange={this.changeProp} />
                <input type="text" name="parent_phone" className="parent_phone" placeholder="Parents Phone" value={this.state.parent_phone} onChange={this.changeProp} />
                <input type="text" name="allergies" className="allergies" placeholder="Allergies" value={this.state.allergies} onChange={this.changeProp} />
                <button onClick={this.handleAdd} >Add</button>
            </div>
        );
    }
});

React.render(
    <KidsList />,
    document.getElementById('app')
);