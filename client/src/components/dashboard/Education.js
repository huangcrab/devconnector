import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import Moment from "react-moment";

class Education extends Component {
  render() {
    const education = this.props.education.map(edu => (
      <tr key={edu.id}>
        <td>{edu.school}</td>
        <td>{edu.degree}</td>
        <td>
          <Moment format="YYYY-MM-DD">{edu.from}</Moment> to{" "}
          {edu.to ? <Moment format="YYYY-MM-DD">{edu.to}</Moment> : "Current"}
        </td>
        <td>
          <button className="btn btn-danger">Delete</button>
        </td>
      </tr>
    ));
    return (
      <div>
        <h4 className="mb-4">Education Credentials</h4>
        <table className="table">
          <thead>
            <tr>
              <th>School</th>
              <th>Degree</th>
              <th>Years</th>
              <th />
            </tr>
            {education}
          </thead>
        </table>
      </div>
    );
  }
}

export default connect(
  null,
  {}
)(withRouter(Education));
