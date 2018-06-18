import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaGroup";
import { addEducation } from "../../actions/profileActions";

class AddEducation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      school: "",
      degree: "",
      major: "",
      from: "",
      to: "",
      current: false,
      description: "",
      errors: []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  onSubmit = e => {
    e.preventDefault();
    const eduData = {
      school: this.state.school,
      degree: this.state.degree,
      major: this.state.major,
      from: this.state.from,
      to: this.state.to,
      current: this.state.current,
      description: this.state.description,
      errors: []
    };
    this.props.addEducation(eduData, this.props.history);
  };

  onCheck = () => {
    this.setState({
      disabled: !this.state.disabled,
      current: !this.state.current
    });
  };
  render() {
    const { errors } = this.state;

    return (
      <div className="add-education">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to="/dashboard" className="btn btn-light">
                Go Back
              </Link>
              <h1 className="display-4 text-center">Add Education</h1>
              <p className="lead text-center">Add any Education</p>
              <small className="d-block mb-3">* = required fields</small>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="* School"
                  name="school"
                  value={this.state.school}
                  onChange={this.onChange}
                  error={errors.school}
                />
                <TextFieldGroup
                  placeholder="* Degree"
                  name="degree"
                  value={this.state.degree}
                  onChange={this.onChange}
                  error={errors.degree}
                />
                <TextFieldGroup
                  placeholder="* Major"
                  name="major"
                  value={this.state.major}
                  onChange={this.onChange}
                  error={errors.major}
                />
                <h6>From Date</h6>
                <TextFieldGroup
                  name="from"
                  type="date"
                  value={this.state.from}
                  onChange={this.onChange}
                  error={errors.from}
                />
                <h6>To Date</h6>
                <TextFieldGroup
                  name="to"
                  type="date"
                  value={this.state.to}
                  onChange={this.onChange}
                  error={errors.to}
                  disabled={this.state.disabled ? "disabled" : ""}
                />
                <div className="form-check mb-4">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="current"
                    value={this.state.current}
                    checked={this.state.current}
                    onChange={this.onCheck}
                    id="current"
                  />
                  <label htmlFor="current" className="form-check-label">
                    Current Education
                  </label>
                </div>
                <TextAreaFieldGroup
                  placeholder="Education description"
                  name="description"
                  value={this.state.description}
                  onChange={this.onChange}
                  error={errors.description}
                  info="Tell us about the major"
                />
                <input
                  type="submit"
                  value="submit"
                  className="btn btn-info btn-block mt-4"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addEducation }
)(withRouter(AddEducation));
