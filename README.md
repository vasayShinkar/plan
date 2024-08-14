# plan
Vanilla javascript plugin for creating responsive adaptive schedules for your daily plans!
![how it Looks](https://github.com/vasayShinkar/plan/blob/main/image.png)


To start using the plugin, you need to create a new Plan object.  Then there are several commands to configure the object for the plan. For example:

plan.setTasks([category1, ..., categoryN]) - to add categories(number of vertical subscribed columns)


plan.addEvent(new Date(2024, 7, 1), new Date(2024, 8, 1), "category", "tasks(description)", {color: "red"}) - to add new taskюNote that the 5th parameter is an option object, but for this plugin I made it so that you can set your optional color there (By default, the colors are random)


let render = new Plan.Render(plan) - to create Render object
render.draw(".plan") - to draw our plan board.




