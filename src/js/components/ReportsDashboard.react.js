var React = require('react');
var AuthStore = require('../stores/AuthStore');
var ReportsStudent = require('./ReportsStudent.react');
var ClassroomStore = require('../stores/ClassroomStore');
var ClassroomActions = require('../actions/ClassroomActions');
var Navbar = require('./Navbar.react');
var _ = require('underscore');

var ReportsDashboard = React.createClass({
	getInitialState: function(){
	  //set list upon initialstate w/ ClassroomStore.getList
	  return {
	  	list: ClassroomStore.getList(),
	  	info: ClassroomStore.getInfo(),
	    loggedIn: AuthStore.checkAuth(),
	  }
	},

	componentWillMount: function(){
	  if(!AuthStore.checkAuth()){
	    this.render = function () {
	      return false;
	    }
	    location.hash = '/login';
	  }
	},

	componentDidMount: function(){ 
    ClassroomActions.initQuery(this.props.params.id);
    ClassroomStore.addChangeListener(this._onChange);
    AuthStore.addChangeListener(this._onChange);
    console.log(this.state.list)
  },


  componentWillUnmount: function(){
    ClassroomActions.endQuery();
    ClassroomStore.removeChangeListener(this._onChange);
    AuthStore.removeChangeListener(this._onChange);
  },

  _onChange: function(){
    this.setState({
      list: ClassroomStore.getList(),
      info: ClassroomStore.getInfo(),
      loggedIn: AuthStore.checkAuth(),
    });
  },

  render: function(){
  	var studentNodes = _.map(this.state.list, function(studentNode,index){
  	  return (
  	  	<ReportsStudent key={index} studentId={index} studentTitle={studentNode.studentTitle} />
  	  )
  	});
    return (
      <div className="reportsDashboard">
        <Navbar loggedIn = {this.state.loggedIn}/>
        <div className="container">
          <div className="row container">
          	<div className="col-md-3">
          		<div className="panel panel-default">
          		  <div className="panel-heading">
          		    <h3 className="panel-title">Students</h3>
          		  </div>
          		  {studentNodes}
          		</div>
          	</div>
          	<div className="col-md-9 well">
          		Reports Container
          	</div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ReportsDashboard;
