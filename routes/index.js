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
        repositories(last: 20, orderBy: {field: CREATED_AT, direction: ASC}) {
          edges {
            node {
              name
            }
          }
        }
      }
    }
  `).then((data) => {
      res.render('index', {
          subjects: data.organization.repositories.edges
      })
    })
  })