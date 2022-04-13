var xhr = new XMLHttpRequest();


xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
        console.log(data)
    }
  };

/*
d3.json('topPerSubject.json', (data) =>{
    var canvasMain = d3.select('body').append('svg')
    .attr('width:', 300)
    .attr('height:', 500)
    console.log(data)
})
*/