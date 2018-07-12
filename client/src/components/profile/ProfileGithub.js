import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
class ProfileGithub extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientId: "fa3e81c432c0b345a503",
      clientSecret: "345d732c2aed61df240f1449ccd927591d4b7928",
      count: 5,
      sort: "created: asc",
      repos: []
    };
  }
  componentDidMount() {
    const { username } = this.props;
    const { count, sort, clientId, clientSecret } = this.state;

    fetch(
      `https://api.github.com/users/${username}/repos?per_page=${count}&sort=${sort}&client_id=${clientId}&client_secret=${clientSecret}`
    )
      .then(res => res.json())
      .then(data => {
        if (this.refs.myRef) {
          this.setState({ repos: data });
        }
      })
      .catch(err => console.log(err));
  }

  render() {
    const { repos } = this.state;
    const repoItems = repos.map(repo => (
      <div key={repo.id} className="card card-body mb-2">
        <div className="row">
          <div className="col-md-6">
            <h4>
              <Link to={repo.html_url} className="text-info" target="_blank">
                {repo.name}
              </Link>
            </h4>
            <p>{repo.description}</p>
          </div>
          <div className="col-md-6">
            <span className="badge badge-info mr-1">
              Stars: {repos.stargazers_count}
            </span>
            <span className="badge badge-secondary mr-1">
              Watchers: {repos.watchers_count}
            </span>
            <span className="badge badge-success">
              Forks: {repos.forks_count}
            </span>
          </div>
        </div>
      </div>
    ));
    return (
      //for console err of memory leak
      <div ref="myRef">
        <hr />
        <h3 className="mb-4">Latest GitHub Repos</h3>
        {repoItems}
      </div>
    );
  }
}

ProfileGithub.propTypes = {
  username: PropTypes.string.isRequired
};

export default ProfileGithub;