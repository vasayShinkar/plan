let Plan = function() {
    this.scope = {start: null, finish: null}
    this.tasks = []
    this.events = []
};
Plan.Render = function(plan) {
    if(plan instanceof Plan) {
        this.plan = plan
    }
    else {
         throw new Error("You should give the Plan.render() only the object of Plan")
    }
};


(() => {
  let monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  let colors = ['#FF9AAB', '#FFE5B4', '#FFFFC2', '#A3E2B2', '#A3C6E2', '#FF8EC7', '#FFC1B0', '#D6B8FF', '#FFD6E7', '#B7E1D4', '#FF9AAB', '#FFE5B4', '#FFFFC2', '#A3E2B2', '#A3C6E2', '#FF8EC7', '#FFC1B0', '#D6B8FF', '#FFD6E7', '#B7E1D4']

    function isValidDate(start, finish) {
       if(isDate(start) && isDate(finish) && checkOrder(start, finish)) {
         return true
       }
       else {
        throw new Error("Incorrect data, try to make sure that you have given the correct data")
       }
    }
    function isDate(date) {
       return date instanceof Date
    }
    function checkOrder(start, finish) {
       return finish > start;
    }
    function isValidArray(tasks) {
       if(tasks instanceof Array) {
        return true
       }
       else {
         throw new Error("setScope must recieve an array")
       }
    }
    function checkAvailable(item, array) {
        return array.indexOf(item) !== -1
    }
    function  checkDateBorders(startEvent, finishEvent, start, finish) {
        if (start <= startEvent && finishEvent <= finish) {
            return true;
        }
        else {
            throw new Error("You seems try to add Task, which is out of border, that you set in method setScope()")
        }
    }
    function checkContainer(selector) {
      if(!checkContainer) {
          throw new Error("There is no selector in DOM")
      }

  }
  function prettyFormattime(time) {
    let month = time.getDate() == 1 ? " "+ monthName[time.getMonth()]: ""
    let day = time.getDate()

    return `${day}${month}`

  }

    Plan.prototype.setScope =  function(start, finish){
            isValidDate(start, finish)
            this.scope = {start, finish}
    }
    Plan.prototype.setTasks =  function(tasks){
        isValidArray(tasks)
        for(let a of tasks) {
            if(!checkAvailable(a, this.tasks)) {
                this.tasks.push(a)
            }
        }
    }
    Plan.prototype.addEvent =  function(start, finish, task, desctiption, options){
        isValidDate(start, finish)
        if(!checkAvailable(task, this.tasks)) throw new Error(`You didn't create ${task} in setTasks()`)
        checkDateBorders(start, finish, this.scope.start, this.scope.finish)
        options = Object.prototype.toString.call(options) == "[object Object]" ? options : undefined
        this.events.push({start, finish, task, desctiption, options})   
    }
    
    Plan.Render.prototype.draw = function(selector) {
      let plan = this.plan
      function generateAside(selector) {
        let aside = selector.appendChild(document.createElement("aside"))
        aside.className = "aside"
        let ul = aside.appendChild(document.createElement("ul"))
        generateRowsForAside(ul)
      }
      function generateRowsForAside(ul) {
        for(let a of plan.tasks) {
            let li = ul.appendChild(document.createElement("li"))
            li.className = "item"
            li.textContent = a
        }
      }
      function generateSection(selector) {
        let section = selector.appendChild(document.createElement("section"))
        let header = generateHeader(section)
        
        let time = section.appendChild(document.createElement("time"))
        time.className = "scrollasync"
        let width = header.scrollWidth;
        generateRowsForTime(time, width)
      }
      function generateHeader(selector) {
         let header = selector.appendChild(document.createElement("header"))
         header.className = "scrollasync"
         let ul = header.appendChild(document.createElement("ul"))

         let time = new Date(plan.scope.start)
         let color_index = 0;
         while(time.getTime() < plan.scope.finish.getTime()) {
          if(time.getDate() == 1) color_index++;
            let li = ul.appendChild(document.createElement("li"))
            li.innerHTML = prettyFormattime(time) + ((+time == +plan.scope.start && time.getDate() !== 1) ? ` ${monthName[time.getMonth()]}` : "");
            li.style.background = colors[color_index]
            time.setDate(time.getDate() + 1)
         }
         return header
      }
      
      function generateRowsForTime(selector, width) {
        let ul = selector.appendChild(document.createElement("ul"))
        ul.style.width = width + "px"
        for(let t of plan.tasks) {
          let li = ul.appendChild(document.createElement("li"))
          findEvent(li, t)
        }
      }

      function findEvent(selector, task) {
        for(let e of plan.events) {
          if(task == e.task) {
            attachEvent(selector, e)
          }
        }
      }

      function attachEvent(selector, event) {
        let optionshas = event.options !== undefined;
        let color;
        if(optionshas) {
          color = event.options.color || colors[Math.floor(Math.random() * (colors.length ))]
        }

        let div = selector.appendChild(document.createElement("div"))
        div.className = "task"
        div.innerText = event.desctiption
        div.style.background = color;
        div.style.left = getPositionLeft(event)
        div.style.width = getOffsetOfEvent(event)
      }
      
      function getOffsetOfEvent(event) {
        let widthOfEvent = getDuraction(event.finish, event.start)
        let widthOfPlan = getDuraction(plan.scope.finish, plan.scope.start)
        return widthOfEvent/widthOfPlan * 100 + "%"
      }
      function getPositionLeft(event) {
        
         let widthOfBegins = getDuraction(event.start, plan.scope.start)
         let widthOfPlan = getDuraction(plan.scope.finish, plan.scope.start)
         return widthOfBegins/widthOfPlan*100 + "%"
      }

      function getDuraction(finish, start) {
        return (finish - start)/1000/60/60/24
      }
      function emptyNode(selector) {
        selector.innerHTML = ""
      }
      let selectr = document.querySelector(selector)
      checkContainer(selectr)
      emptyNode(selectr)
      generateAside(selectr)
      generateSection(selectr)
      
    }

})();
