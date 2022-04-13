var http = new XMLHttpRequest();
console.log(http)
var data = (http.responseText)
console.log(data)

/*
d3.json('topPerSubject.json', (data) =>{
    var canvasMain = d3.select('body').append('svg')
    .attr('width:', 300)
    .attr('height:', 500)
    console.log(data)
})
*/