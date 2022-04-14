// d3.json('topPerSubject.json').then((data) => {
//     console.log(data) 

   //  const xScale = d3.scaleBand()
   //  .domain(data.map((dataPoint) => dataPoint.commits))
   //  .rangeRound([0, 400])
   //  .padding(0.3);

   //  const yScale = d3.scaleLinear()
   //  .domain([0, 5000])
   //  .range([200, 0]) // andersom zodat we van onder naar boven gaan ipv andersom

   

      // g.append("text")
      // .attr("y", 6) // ruimte tussen lijn en tekst
      // .attr("dy", "0.71em") // tekstgrootte
      // .attr("text-anchor", "end")
      // .text(`commits`);

      

   // .selectAll('p')
   // .data(data)
   // .enter()
   // .append('p')
   // .text(data => data.subject)

   

   // const bars = homeChart
   // .selectAll('.bar')
   // .data(data)
   // .enter()
   // .append('rect')
   // .classed('bar', true)
   // .attr('width', xScale.bandwidth())
   // .attr('height', (data) => yScale(data.commits)) // /5 omdat het aantal keer 5 word gedaan, idk why
   // .attr('x', data => xScale(data.subject))
   // .attr('y', data => yScale(data.commits))
   // console.log(data.commits)
// })



    // https://stackoverflow.com/questions/17214293/importing-local-json-file-using-d3-json-does-not-work
    const svg = d3.select('section[title="total commits"] svg'),
    margin = 200,
    width = svg.attr("width") - margin,
    height = svg.attr("height") - margin;

    var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
    yScale = d3.scaleLinear().range ([height, 0]);

    var g = svg.append("g").attr("transform", "translate(" + 40 + "," + 40 + ")");

    d3.json('topPerSubject.json').then((data) => {
       data.sort( (a,b)=> {
         return d3.descending(a.commits,b.commits)
       })

      console.log(data)
      xScale.domain(data.map(function(d){
         return d.subject
      }))
      yScale.domain([0, d3.max(data, function(d){
         return d.commits
      })])

      g.append('g')
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));
      g.append("g").call(d3.axisLeft(yScale).tickFormat(function(d){
          return d;
      }).ticks(10))

      g.selectAll(".bar")
         .data(data)
         .enter().append("rect")
         .attr("class", "bar")
         .attr("x", function(d) { return xScale(d.subject); })
         .attr("y", function(d) { return yScale(d.commits); })
         .attr("width", xScale.bandwidth())
         .attr("height", function(d) { return height - yScale(d.commits); });


         /* */

         const p = document.querySelector('section[title="total commits"] ul')
         data.forEach(element => {
            p.insertAdjacentHTML('beforeend',`<li><p>Course: ${element.subject}</p><p>commits: ${element.commits}</li>`)
         });
   })

  
