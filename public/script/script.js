// https://stackoverflow.com/questions/17214293/importing-local-json-file-using-d3-json-does-not-work
const svg = d3.select('section[title="total commits"] svg'),
   margin = 200,
   width = svg.attr("width") - margin,
   height = svg.attr("height") - margin;

var xScale = d3.scaleBand().range([0, width]).padding(0.4),
   yScale = d3.scaleLinear().range([height, 0]);

var g = svg.append("g").attr("transform", "translate(" + 40 + "," + 40 + ")");

d3.json('topPerSubject.json').then((data) => {
   // data.sort((a, b) => {
   //    return d3.descending(a.commits, b.commits)
   // })

   console.log(data)
   xScale.domain(data.map(function (d) {
      return d.subject
   }))
   yScale.domain([0, d3.max(data, function (d) {
      return d.commits
   })])

   g.append('g')
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));
   g.append("g").call(d3.axisLeft(yScale).tickFormat(function (d) {
      return d;
   }).ticks(10))

   g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function (d) {
         return xScale(d.subject);
      })
      .attr("y", function (d) {
         return yScale(d.commits);
      })
      .attr("width", xScale.bandwidth())
      .attr("height", function (d) {
         return height - yScale(d.commits);
      });

   const p = document.querySelector('section[title="total commits"] ul')
   data.forEach(element => {
      p.insertAdjacentHTML('beforeend', `<li><p>Course: ${element.subject}</p><p>commits: ${element.commits}</li>`)
   });
})