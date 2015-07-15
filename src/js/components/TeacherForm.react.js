var React = require('react');
var TeacherActions = require('../actions/TeacherActions');

var TeacherForm = React.createClass({
  getInitialState: function(){
    return null;
  },

  // Invoking the addClass method on our TeacherActions whenever a addClass user event occurs
  handleAddClass: function(e){
    e.preventDefault();
    var newClass = React.findDOMNode(this.refs.newClass).value;
    console.log(newClass);
    TeacherActions.addClass({classTitle: newClass});
    newClass.value = '';
  },

  render: function() {
    return (
      <div className="teacherForm container">
        <div className="row">
          <div className="col-sm-6 well text-center">
            <form onSubmit={this.handleAddClass}>
              <label for="">Give your class a name</label>
              <div className="form-group">
                <input type="text" ref="newClass" id="newClass" className="form-control" placeholder="Example: JD's English Class" />
              </div>
              <button type="submit" id="addNewClass" className="btn btn-primary btn-block submit-button">Create my class!</button>
            </form>
          </div> 
        </div> 
      </div>
    );
  }

});

module.exports = TeacherForm;
