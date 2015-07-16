var AppDispatcher = require('../dispatcher/AppDispatcher');
var TeacherConstants = require('../constants/TeacherConstants');
var FirebaseStore = require('./FirebaseStore');
var objectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

var firebaseRef = FirebaseStore.getDb();

var _store = {
  list: {},
  info: {}
};

var initQuery = function(teacherId){
  firebaseRef.child('teachers/'+teacherId).on('value', function(snapshot){
    var teacherData = snapshot.val();
    _store.info = teacherData.info;
    _store.list = teacherData.classes || {};
    TeacherStore.emit(CHANGE_EVENT);
  });
};

var endQuery = function(){
  firebaseRef.child('teachers/'+_store.info.uid).off();
};

var addClass = function(newClass){
  newClass.teacherId = _store.info.uid;
  var newClassId = firebaseRef.child('teachers/' + _store.info.uid + '/classes').push(newClass).key();

  newClass.classId = newClassId;
  firebaseRef.child('classes/' + newClassId + '/info').set(newClass);
};

var removeClass = function(classId){
  firebaseRef.child('classes/' + classId).remove();
  firebaseRef.child('teachers/' + _store.info.uid + '/classes/' + classId).remove();
};

var TeacherStore = objectAssign({}, EventEmitter.prototype, {
  // Invoke the callback function (ie. the _onChange function in TeacherDashboard) whenever it hears a change event
  addChangeListener: function(cb){
    this.on(CHANGE_EVENT, cb);
  },

  removeChangeListener: function(cb){
    this.removeListener(CHANGE_EVENT, cb);
  },

  getList: function(){
    return _store.list;
  },

  getInfo: function(){
    return _store.info;
  }
});

AppDispatcher.register(function(payload){
  var action = payload.action;
  switch(action.actionType){
    case TeacherConstants.ADD_CLASS:
      // invoke the addClass setter function above to add new class to the list
      addClass(action.data);
      // Emit a change event
      TeacherStore.emit(CHANGE_EVENT);
      break;
    case TeacherConstants.REMOVE_CLASS:
      removeClass(action.data);
      TeacherStore.emit(CHANGE_EVENT);
      break;
    case TeacherConstants.INIT_QUERY:
      initQuery(action.data);
      break;
    case TeacherConstants.END_QUERY:
      endQuery();
      TeacherStore.emit(CHANGE_EVENT);
      break;
    default:
      return true;
  }
});

module.exports = TeacherStore;