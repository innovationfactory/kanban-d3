// kanban.js
(function(){
  var board;

  var init = function(){

    window.data = [
      {
        id: 1,
        name: "Story 1",
        step: 1
      },
      {
        id: 2,
        name: "Story 2",
        step: 1
      },
      {
        id: 3,
        name: "Story 3",
        step: 2
      },
      {
        id: 4,
        name: "Story 4",
        step: 2
      }
    ];

    board = d3.select("#board");
    update();

    var steps = board.selectAll("[data-step]").call(addDragHandlers);
  }

  var update = function(){
    var stories = board.select("#stories").selectAll("div").data(data, function(s){ return s.id; });
    //stories.transition();

    // new
    var story = stories.enter().append("div");
    // HTML5 drag-n-drop example from http://www.html5rocks.com/en/tutorials/dnd/basics/
    story.on("dragstart", function(d){ d3.event.dataTransfer.setData('text/plain', d.id) });
    story.attr("data-id", function(s){ return s.id });
    story.attr("draggable", "true");
    story.text(function(s){ return s.name; });
    story.insert("button")
      .text("<<")
      .on("click", function(d){ move(d, d.step - 1) });
    story.insert("button")
      .text(">>")
      .on("click", function(d){ move(d, d.step + 1) });

    // existing and new
    stories.transition().style("left", calcLeft).style("top", calcTop);

    // removed
    stories.exit().remove();
  }

  var calcLeft = function(s){
    return 20 + (334 * (s.step-1)) + "px";
  }

  var calcTop = function(s, i){
    return 20 + (120 * indexByStep(s)) + "px";
  }

  var indexByStep = function(story) {
    return data.filter(function(s){ return story.step === s.step }).indexOf(story)
  }

  var move = function(story, step){
    story.step = step;
    update();
  }

  var addDragHandlers = function(step){
    console.log(this)
    step.on("dragover",  function(){ d3.event.preventDefault();});
    step.on("dragenter", function(){ this.classList.add("dragover") });
    step.on("dragleave", function(){ this.classList.remove("dragover") });
    step.on("drop", function(){
      d3.event.stopPropagation();
      var storyId = parseInt(d3.event.dataTransfer.getData('text/plain'), 10),
          story   = data.filter(function(s){ return s.id == storyId })[0],
          step    = parseInt(this.dataset.step, 10);
      move(story, step);
      this.classList.remove("dragover")
    });
  }

  d3.select(document).on('DOMContentLoaded', init);
})();