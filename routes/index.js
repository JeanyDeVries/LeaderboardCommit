const express = require('express')

const { graphql } = require('@octokit/graphql')
const graphqlAuth = graphql.defaults({
  headers: { authorization: 'token ' + process.env.key },
})

const d3 = import("d3");

module.exports = express
  .Router()

  .get('/', function (req, res) {
    // Get the repository information from my GitHub account
    graphqlAuth(`
    {
      organization(login: "cmda-minor-web") {
        repositories(orderBy: {field: UPDATED_AT, direction: DESC}, first: 20) {
          nodes {
            name
          }
        }
      }
    }
  `).then((data) => {
      var repositories = data.organization.repositories.nodes;
      repositories.forEach(subject => {
        loadData(subject.name)
      });
    })
  })

  function loadData(subjectName){
    module.exports = express
      .Router()
      .get('/', function (req, res) {
        // Get the repository information from my GitHub account
        graphqlAuth(`
        {
          repository(owner: "cmda-minor-web", name: ${subjectName}) {
            name
            forkCount
            forks(first: 50, orderBy: {field: NAME, direction: DESC}) {
              totalCount
              nodes {
                name
                refs(refPrefix: "refs/heads/", first: 1) {
                  edges {
                    node {
                      name
                      target {
                        ... on Commit {
                          history(first: 0) {
                            totalCount
                          }
                          author {
                            name
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `).then((data) => {
          //set data in JSON file which will be read later on for the html rendering
          console.log(data)
        })
      })

  }

