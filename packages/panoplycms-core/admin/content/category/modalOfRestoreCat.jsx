import React, { Component } from 'react';
import { render } from 'react-dom';

import { restoreCategory } from '../../actions/category_action.js';

export default class ModalOfRestoreCat extends Component {
  restoreCategory(){
    Meteor.call('restore_category', this.props.data._id,function(err,data){
      if(err){
        console.log(err)
      }else{
        // console.log(data)
      }
    });
    return dispatch => {
      dispatch(restoreCategory(this.props.data._id))
    }
  }
  render(){
    return(
      <div id={this.props.data._id+'restoreCategory'} className="modal fade add-popup" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header centered">
              <button type="button" className="close" data-dismiss="modal">&times;</button>
              <h4 className="modal-title">Do you really want to restore ?</h4>
            </div>
            <div className="modal-footer centered">
              <button type="button" className="btn custom-default-btn" onClick={this.restoreCategory.bind(this)} data-dismiss="modal">YES</button>
              <button type="button" className="btn custom-default-btn" data-dismiss="modal">NO</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}