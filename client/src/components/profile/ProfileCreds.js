import React, { Component } from "react";
import Moment from "react-moment";
class ProfileCreds extends Component {
  render() {
    const { experience, education } = this.props;
    const expItems = experience.map(exp => (
      <li key={exp._id} classNmae="list-group-item">
        <h4>{exp.company}</h4>
        <p>
          <Moment format="YYYY/MM/DD">{exp.from}</Moment> -{" "}
          {exp.to === null ? (
            "Current"
          ) : (
            <Moment format="YYYY/MM/DD">{exp.to}</Moment>
          )}
        </p>
        <p>
          <strong>Position: </strong>
          {exp.title}
        </p>
        <p>
          {exp.location === "" ? null : (
            <span>
              <strong>Location: </strong>
              {exp.location}
            </span>
          )}
        </p>
        <p>
          {exp.description === "" ? null : (
            <span>
              <strong>Description: </strong>
              {exp.description}
            </span>
          )}
        </p>
      </li>
    ));
    return <div>ProfileCreds</div>;
  }
}

export default ProfileCreds;
