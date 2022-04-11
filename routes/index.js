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
        organization(login: "cmda-minor-web") 
        {
          repositories(last: 20, orderBy: {field: CREATED_AT, direction: ASC}) 
          {
            edges 
            {
              node 
              {
                forks(first: 10) 
                {
                  edges {
                    node 
                    {
                      name
                      refs(refPrefix: "refs/heads/", first: 100)
                      {
                        edges 
                        {
                          node 
                          {
                            name
                            target 
                            {
                              ... on Commit 
                              {
                                id
                                history(first: 0) 
                                {
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
    console.log(data)
      res.render('index', {
          dataRequest: data.organization.repositories.edges
      })
    })
  })