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
          edges {
            node {
              name
              forks(first: 10) {
                edges {
                  node {
                    name
                    refs(refPrefix: "refs/heads/", first: 1) {
                      edges {
                        node {
                          name
                          target {
                            ... on Commit {
                              id
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
          }
        }
      }
    }
  `).then((data) => {
      var subjects = data.organization.repositories.edges;
      res.render('index', {
          subjects: subjects
      })

      var data = {dataSubject:[]};
      var topPerSubject = []
      subjects.forEach(subject => { 
          var group = []
          var dataTop = [];
          var subjectName = subject.node.name;
          var repositories = subject.node.forks.edges;
          repositories.forEach(repository => 
          { 
              var references = repository.node.refs.edges
              references.forEach(reference => 
              {  
                  var commitCount = reference.node.target.history.totalCount;
                  var user = reference.node.target.author.name;
                  group.push({subject: subjectName, user: user, commits: commitCount})
              })
          })
          dataTop = group.sort((a,b)=> b.commits-a.commits)
          data.dataSubject.push(group)
          topPerSubject.push(dataTop)
      }) 
    })
  })
