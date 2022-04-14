const express = require('express')

const { graphql } = require('@octokit/graphql')
const graphqlAuth = graphql.defaults({
  headers: { authorization: 'token ' + process.env.key },
})

const d3 = import("d3");

const fs = require('fs');

module.exports = express
  .Router()

  .get('/', function (req,res){
    res.redirect('/home')
  })

  .get('/home', function (req, res) {
    // Get the repository information from my GitHub account
    graphqlAuth(`
    {
      rateLimit {
    limit
    cost
    remaining
    resetAt
  }
      organization(login: "cmda-minor-web") {
        repositories(orderBy: {field: UPDATED_AT, direction: DESC}, first:8) {
          edges {
            node {
              name
              forks(first: 48) {
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
      var data = {dataSubject:[]};
      var topPerSubject = []
      var subjectNames = []
      var totalCommitsPerSubject = [];

      subjects.forEach(subject => { 
          var group = []
          var dataTop = [];
          var subjectName = subject.node.name;
          var totalCommits = 0;
          var repositories = subject.node.forks.edges;

          subjectNames.push(subjectName);
          
          repositories.forEach(repository => 
          { 
              var references = repository.node.refs.edges
              references.forEach(reference => 
              {  
                  var commitCount = reference.node.target.history.totalCount;
                  totalCommits += commitCount;
                  var user = reference.node.target.author.name;
                  group.push({subject: subjectName, user: user, commits: commitCount})
              })
          })
          dataTop = group.sort((a,b)=> b.commits-a.commits)
          data.dataSubject.push(group)
          topPerSubject.push(dataTop)
          totalCommitsPerSubject.push({subject: subjectName, commits: totalCommits})
          let allData = JSON.stringify(totalCommitsPerSubject)
          fs.writeFileSync('public/topPerSubject.json', allData)
      }) 

      res.render('index', {
        subjects: data.dataSubject,
        names: subjectNames
      })
    })
  })

  .get('/detail/:id', function (req,res){
    var nameSubject = req.params.id;

    graphqlAuth(`
    {
      repository(owner: "cmda-minor-web", name: "${nameSubject}") {
        name
        description
        forkCount
        stargazerCount
        projectsUrl
        forks(first: 50, orderBy: {field: NAME, direction: DESC}) {
          totalCount
          edges{
            node {
            name
            refs(refPrefix: "refs/heads/", first: 1) {
              edges {
                node {
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
}

  `).then((data) => {

    var test = []

    var project = data.repository.forks.edges // ends on array
    // console.log(project)

    var group = []
    var dataTop = [];
    
    project.forEach(madeProject => {
      // console.log(madeProject.node.refs)
      var prjName = madeProject.node.name
      console.log(prjName)
      var test = madeProject.node.refs.edges
      test.forEach(reference => {
        console.log(reference.node.target) // shows history.totalcount & author.name
        // group.push({project: madeProject})
      });
    });
    
    var person = data.repository.forks.edges[0].node.refs.edges[0].node // shows a single totalcount & name 
    // console.log(person) 

      res.render('detail', {
          dataRepo: data.repository,
          nameRepo: nameSubject
      })
    })

  })  
