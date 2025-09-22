import "./Task.css";
import { RiCloseCircleLine } from 'react-icons/ri';
import React, { useState, useEffect } from 'react';

const api = 'http://localhost:3001';

function TaskList() {
	const [tasks, setTasks] = useState([]);
	const [newTask, setNewTask] = useState("");
  	const [value, setValue] = useState("default");

	useEffect(() => {
		GetTasks();
	}, []);

	const GetTasks = () => {
		fetch(api + '/tasks')
			.then(res => res.json())
			.then(data => setTasks(data))
			.catch((err) => console.error("Error: ", err));
	}
	
	const addPriority = (e) => {
		setValue(e.target.value);
	}
	
	const addTask = async () => {
		if (value === "default") {
			alert("Set priority");
		}
		else {
			if (newTask === "") {
				alert("Set text")
			}
			else {
			const data = await fetch(api + "/task/new", {
				method: "POST",
				headers: {
					"Content-Type": "application/json" 
				},
				body: JSON.stringify({
					text: newTask,
					priority: value
				})
			}).then(res => res.json());

			
			if (newTask !== "") {
			setTasks([...tasks, data]);
			}
			setNewTask("");
			setValue("default");
				}	
			}
	}
	const deleteTask = async id => {
		const data = await fetch(api + '/task/delete/' + id, { method: "DELETE" })
    .then(res => res.json());

		setTasks(tasks => tasks.filter(task => task._id !== data.result._id));
	}
	

	return (
    <div className="task-container">
      <div className="task-header">
        <h2>Add a New Task</h2>
        <p className="task-subtitle">Organize your tasks by priority and stay productive</p>
      </div>
      
      <div className="task-form">
        <div className="inputGroup">
          <input 
            type="text" 
            onChange={e => setNewTask(e.target.value)} 
            value={newTask} 
            placeholder='Enter task name...'
            name='text'
            className='taskInput'
          />
          <select 
            defaultValue="default" 
            value={value} 
            onChange={addPriority} 
            className="priority-select"
          >
            <option value="default" disabled hidden>Select Priority</option>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option> 
          </select>
          <button className='taskButton' onClick={addTask}>
            Add Task
          </button>
        </div>
      </div>
      
      <div className="task-list">
        {tasks.length > 0 ? tasks.map(task => (
          <div key={task._id} className={`task-item ${task.priority} fade-in-up`}>
            <div className="task-text">{task.text}</div>
            <div className="task-actions">
              <RiCloseCircleLine
                onClick={() => deleteTask(task._id)}
                className='deleteButton'
                title="Delete task"
              />
            </div>
          </div>
        )) : (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <p>No tasks added yet</p>
            <p>Create your first task above to get started!</p>
          </div>
        )}
      </div>
    </div>
	);
}

export default TaskList;
