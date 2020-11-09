import React, { Component, memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { estateSelector } from 'src/views/selectors';
import { logoutUser } from 'src/views/actions';
import { Link } from "react-router-dom";

import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse,
  NavItem,
  NavLink
} from "shards-react";

import ModalConfirmation from 'src/components/common/ModalConfirmation';
import userAva from "src/assets/images/avatars/0.jpg";

class UserActions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      modalLogout : false
    };

    this.toggleUserActions = this.toggleUserActions.bind(this);
  }

  toggleUserActions() {
    this.setState({
      visible: !this.state.visible
    });
  }

  signOut(){
    this.setState({modalLogout:false});
    this.props.logoutUser();
  }

  render() {
    let { modalLogout } = this.state;
    return (
      <div>
        <NavItem tag={Dropdown} caret toggle={this.toggleUserActions}>
          <DropdownToggle caret tag={NavLink} className="text-nowrap px-3">
            <img
              className="user-avatar rounded-circle mr-2"
              src={userAva}
              alt="User Avatar"
            />{" "}
            <span className="d-none d-md-inline-block">Sierra Brooks</span>
          </DropdownToggle>
          <Collapse tag={DropdownMenu} right small open={this.state.visible}>
            <DropdownItem tag={Link} to="user-profile-lite">
              <i className="material-icons">&#xE7FD;</i> Profile
          </DropdownItem>
            <DropdownItem tag={Link} to="edit-user-profile">
              <i className="material-icons">&#xE8B8;</i> Edit Profile
          </DropdownItem>
            <DropdownItem tag={Link} to="file-manager-list">
              <i className="material-icons">&#xE2C7;</i> Files
          </DropdownItem>
            <DropdownItem tag={Link} to="transaction-history">
              <i className="material-icons">&#xE896;</i> Transactions
          </DropdownItem>
            <DropdownItem divider />
            <DropdownItem className="text-danger" to="" onClick={()=>this.setState({modalLogout:true})}>
              <i className="material-icons text-danger">&#xE879;</i> Logout
          </DropdownItem>
          </Collapse>
        </NavItem>
        <ModalConfirmation
          open={modalLogout}
          message={'Are you sure you want logout?'}
          onConfirm={() => this.signOut()}
          onClose={() => this.setState({ modalLogout: false })}
        ></ModalConfirmation>
      </div>

    );
  }
}


UserActions.propTypes = {
  logoutUser: PropTypes.func,
}
const mapStateToProps = createStructuredSelector({
  logoutUserResult: estateSelector('logoutUserResult'),
  logoutUserError: estateSelector('logoutUserError'),
  logoutUserSuccess: estateSelector('logoutUserSuccess'),
  logoutUserFailed: estateSelector('logoutUserFailed'),
})

export function mapDispatchToProps(dispatch) {
  return {
    logoutUser: () => dispatch(logoutUser()),
  };
}
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(UserActions);