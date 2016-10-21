var margin = {
  top: 50, right: 20, bottom: 70, left: 40
};
var width = 350 - margin.left - margin.right;
var height = 350 - margin.top - margin.bottom;


var x = d3.scale.ordinal()
  .rangeRoundBands([0, width], .05);
var y = d3.scale.linear()
  .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .ticks(10);

var sleepChart = d3.select('#sleepygraph').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform',
          'translate(' + margin.left + ',' + margin.top + ')');

var workChart = d3.select('#workgraph').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform',
          'translate(' + margin.left + ',' + margin.top + ')');

var lessonChart = d3.select('#lessongraph').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform',
          'translate(' + margin.left + ',' + margin.top + ')');


d3.json('data.json', function(data) {

  // scaling
  x.domain(data.map(function(d) {
    return d.day;
  }));
  y.domain([0, d3.max(data, function(d) {
    return d.hours;
  })]);

  // axis
  sleepChart.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
    .selectAll('text')
      .attr('dy', '16px')

  sleepChart.append('g')
      .attr('class', 'axis')
      .call(yAxis)
    .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', - 35)
      .attr('x', - 125)
      .attr('dy', '11px')
      .text('Hours');

  workChart.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
    .selectAll('text')
      .attr('dy', '16px')

  workChart.append('g')
      .attr('class', 'axis')
      .call(yAxis)
    .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', - 35)
      .attr('x', - 125)
      .attr('dy', '11px')
      .text('Hours');

  lessonChart.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
    .selectAll('text')
      .attr('dy', '16px')

  lessonChart.append('g')
      .attr('class', 'axis')
      .call(yAxis)
    .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', - 35)
      .attr('x', - 125)
      .attr('dy', '11px')
      .text('Hours');


  // color
  function sleepyColorChange(d) {
       if(d.hours > 7) {
         return "#357fc6";
       } else if (d.hours == 7) {
         return "#24629f";
       } else {
         return "#4e1212"
       }
  }

  function workColorChange(d) {
       if(d.hours > 4) {
         return "#4e1212";
       } else if (d.hours <= 4 && d.hours >= 3) {
         return "#194f85";
       } else if (d.hours <= 3 && d.hours >= 2) {
         return "#24629f"
       } else {
         return "#357fc6"
       }
  }

  function lessonColorChange(d) {
       if(d.hours > 3) {
         return "#4e1212";
       } else if (d.hours <= 3 && d.hours >= 2) {
         return "#194f85";
       } else if (d.hours == 2) {
         return "#24629f"
       } else {
         return "#357fc6"
       }
  }



  // nesting
  var week = 0;
  var nestedData = d3.nest()
      .key(function(d) {
        return d.week;
      })
      .key(function(d) {
        return d.time;
      })
      .key(function(d) {
        return d.category;
      })
      .entries(data);

 // bars
 var sleepBars = sleepChart.selectAll('bar')
 .data(nestedData[week].values[0].values[0].values);

   sleepBars.enter().append('rect')
       .attr('class', 'bar')
       .attr('x', function(d) {
         return x(d.day);
       })
       .attr('width', x.rangeBand())
       .attr('y', function(d) {
         return y(d.hours);
       })
       .attr('height', function(d) {
         return height - y(d.hours);
       })
       .style('fill', sleepyColorChange);


 var workBars = workChart.selectAll('bar')
 .data(nestedData[week].values[0].values[1].values);

     workBars.enter().append('rect')
         .attr('class', 'bar')
         .attr('x', function(d) {
           return x(d.day);
         })
         .attr('width', x.rangeBand())
         .attr('y', function(d) {
           return y(d.hours);
         })
         .attr('height', function(d) {
           return height - y(d.hours);
         })
         .style('fill', workColorChange);

 var lessonBars = lessonChart.selectAll('bar')
 .data(nestedData[week].values[0].values[2].values);

     lessonBars.enter().append('rect')
         .attr('class', 'bar')
         .attr('x', function(d) {
           return x(d.day);
         })
         .attr('width', x.rangeBand())
         .attr('y', function(d) {
           return y(d.hours);
         })
         .attr('height', function(d) {
           return height - y(d.hours);
         })
         .style('fill', lessonColorChange);


  // emotion
  function changeHappiness(data) {

      var happiness = 0;
      data.forEach(function(item) {
          happiness += parseInt(item.happiness);
      });

      var emoImage = 'happy.svg';
      var averageHappiness = happiness / data.length;

      if (averageHappiness > 6) {
          emoImage = 'happy.svg';
        } else if (averageHappiness <= 6 && averageHappiness >= 5) {
          emoImage = 'neutral.svg';
        } else {
          emoImage = 'sad.svg';
      }

      d3.select('#happiness')
          .attr('data', emoImage)
          .attr('width', 100);
  }
  changeHappiness(nestedData[week].values[0].values[3].values);


  // prev next
  var prevButton = d3.selectAll('.updatePrev')
    .on('click', prevWeek)

  var nextButton = d3.selectAll('.updateNext')
    .on('click', nextWeek)


  var currentWeek = 0;
  var updateWeek = document.querySelector('.updateWeek');
  weekDays();

  function prevWeek() {
    if (currentWeek > 0) {
      currentWeek--;
      weekDays();
      update();
    }
  }

  function nextWeek() {
    if (currentWeek < 4) {
      currentWeek++;
      weekDays();
      update();
    }
  }

  function weekDays() {
    if (currentWeek == 0) {
      updateWeek.innerHTML = '5 sept - 11 sept';
    } else if (currentWeek == 1) {
      updateWeek.innerHTML = '12 sept - 18 sept';
    } else if (currentWeek == 2) {
      updateWeek.innerHTML = '19 sept - 25 sept';
    } else if (currentWeek == 3) {
      updateWeek.innerHTML = '26 sept - 2 okt';
    } else {
      updateWeek.innerHTML = '3 okt - 9 okt';
    }
  }

  // slider
  var input = document.getElementsByTagName('input')[0];

  input.addEventListener('input', function() {
    update();
    console.log(input.value);
  });

  // update
  function update() {
    sleepChart.selectAll('.bar').remove();
    workChart.selectAll('.bar').remove();
    lessonChart.selectAll('.bar').remove();

    week = currentWeek;

    var sleepBarsPerWeek = sleepChart.selectAll('bar')
    .data(nestedData[week].values[0].values[0].values);

    var workBarsPerWeek = workChart.selectAll('bar')
    .data(nestedData[week].values[input.value].values[1].values);

    var lessonBarsPerWeek = lessonChart.selectAll('bar')
    .data(nestedData[week].values[input.value].values[2].values);

    changeHappiness(nestedData[week].values[input.value].values[3].values);

    sleepBarsPerWeek.enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function(d) {
          return x(d.day);
        })
        .attr('width', x.rangeBand())
        .attr('y', function(d) {
          return y(d.hours);
        })
        .attr('height', function(d) {
          return height - y(d.hours);
        })
        .style('fill', sleepyColorChange);



    workBarsPerWeek.enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function(d) {
          return x(d.day);
        })
        .attr('width', x.rangeBand())
        .attr('y', height)
        .attr('height', 0)
        .style('fill', workColorChange);

    workBarsPerWeek.transition()
        .attr('height', function(d) {
          return height - y(d.hours);
        })
        .attr('y', function(d) {
          return y(d.hours);
        })
        .duration(300)
        .delay(function(data, index) {
            return index * 30;
        })



    lessonBarsPerWeek.enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function(d) {
          return x(d.day);
        })
        .attr('width', x.rangeBand())
        .attr('y', height)
        .attr('height', 0)
        .style('fill', lessonColorChange);

    lessonBarsPerWeek.transition()
        .attr('height', function(d) {
          return height - y(d.hours);
        })
        .attr('y', function(d) {
          return y(d.hours);
        })
        .duration(300)
        .delay(function(data, index) {
            return index * 30;
        })
    }
});



// button conclusion

var concButton = document.querySelector('.conclusion');
var zeroState = document.querySelector('.zerostate');
var back = document.querySelector('.back');
var notZeroState = document.querySelector('.notzerostate');

concButton.addEventListener('click', function() {
  zeroState.style.display = 'none';
  notZeroState.style.display = 'block';
})

back.addEventListener('click', function() {
  zeroState.style.display = 'block';
  notZeroState.style.display = 'none';
})
