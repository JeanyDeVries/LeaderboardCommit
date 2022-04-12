const express = require('express')

const { graphql } = require('@octokit/graphql')
const graphqlAuth = graphql.defaults({
  headers: { authorization: 'token ' + process.env.key },
})

module.exports = express
  .Router()

  .get('/', function (req, res) {
    // Get the repository information from my GitHub account
    graphqlAuth(`
    {
      organization(login: "cmda-minor-web") {
        repositories(orderBy: {field: UPDATED_AT, direction: DESC}, first: 20) {
          edges {
            node {
              name
              forks(first: 10) {
                edges {
                  node {
                    name
                    refs(refPrefix: "refs/heads/", first: 10) {
                      edges {
                        node {
                          name
                          target {
                            ... on Commit {
                              id
                              history(first: 0) {
                                totalCount
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
          }
        }
      }
    }
  `).then((data) => {
      res.render('index', {
          subjects: data.organization.repositories.edges,
      })
    })
  })