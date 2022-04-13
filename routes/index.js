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
      repository(
        owner: "cmda-minor-web"
        name: "browser-technologies-2122"
      ) {
        name
        forkCount
        forks(
          first: 50
          orderBy: { field: NAME, direction: DESC }
        ) {
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
    console.log(data.repository.forks)
    /*
      var subjects = data.organization.repositories.edges;
      var data = {dataSubject:[]};
      var topPerSubject = []
      var subjectNames = []

      subjects.forEach(subject => { 
          var group = []
          var dataTop = [];
          var subjectName = subject.node.name;
          subjectNames.push(subjectName);
          
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

      res.render('index', {
        subjects: data.dataSubject,
        names: subjectNames
      })
      console.log(subjects)
    */
    })
  })

