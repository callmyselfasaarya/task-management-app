
import { RiCloseCircleLine } from 'react-icons/ri';
import React, { useState, useEffect } from 'react';
import './Overview.css';

const api = 'http://localhost:3001';

function Overview() {
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
	

	// Filter tasks by priority
	const highPriorityTasks = tasks.filter(task => task.priority === 'high');
	const mediumPriorityTasks = tasks.filter(task => task.priority === 'medium');
	const lowPriorityTasks = tasks.filter(task => task.priority === 'low');

	// Calculate statistics
	const totalTasks = tasks.length;
	const completedTasks = 0; // You can add completion logic later
	const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

	return (
    <div className="overview-container">
      <div className="overview-header">
        <h2>Task Overview</h2>
        <p className="overview-subtitle">Manage and organize your tasks by priority</p>
      </div>

      {/* Statistics Section */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{totalTasks}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{highPriorityTasks.length}</div>
            <div className="stat-label">High Priority</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{mediumPriorityTasks.length}</div>
            <div className="stat-label">Medium Priority</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{lowPriorityTasks.length}</div>
            <div className="stat-label">Low Priority</div>
          </div>
        </div>
      </div>

      {/* High Priority Tasks */}
      <div className="priority-section high">
        <h3>🔥 High Priority Tasks</h3>
        <div className="task-grid">
          {highPriorityTasks.length > 0 ? highPriorityTasks.map(task => (
            <div key={task._id} className={`task-card high fade-in-up`}>
              <div className="task-content">
                <div className="task-text">{task.text}</div>
                <div className="task-actions">
                  <span className="priority-badge high">High</span>
                  <RiCloseCircleLine
                    onClick={() => deleteTask(task._id)}
                    className='deleteButton'
                    title="Delete task"
                  />
                </div>
              </div>
            </div>
          )) : (
            <div className="empty-priority">
              <div className="empty-priority-icon">🎯</div>
              <p>No high priority tasks</p>
            </div>
          )}
        </div>
      </div>

      {/* Medium Priority Tasks */}
      <div className="priority-section medium">
        <h3>⚡ Medium Priority Tasks</h3>
        <div className="task-grid">
          {mediumPriorityTasks.length > 0 ? mediumPriorityTasks.map(task => (
            <div key={task._id} className={`task-card medium fade-in-up`}>
              <div className="task-content">
                <div className="task-text">{task.text}</div>
                <div className="task-actions">
                  <span className="priority-badge medium">Medium</span>
                  <RiCloseCircleLine
                    onClick={() => deleteTask(task._id)}
                    className='deleteButton'
                    title="Delete task"
                  />
                </div>
              </div>
            </div>
          )) : (
            <div className="empty-priority">
              <div className="empty-priority-icon">📋</div>
              <p>No medium priority tasks</p>
            </div>
          )}
        </div>
      </div>

      {/* Low Priority Tasks */}
      <div className="priority-section low">
        <h3>📝 Low Priority Tasks</h3>
        <div className="task-grid">
          {lowPriorityTasks.length > 0 ? lowPriorityTasks.map(task => (
            <div key={task._id} className={`task-card low fade-in-up`}>
              <div className="task-content">
                <div className="task-text">{task.text}</div>
                <div className="task-actions">
                  <span className="priority-badge low">Low</span>
                  <RiCloseCircleLine
                    onClick={() => deleteTask(task._id)}
                    className='deleteButton'
                    title="Delete task"
                  />
                </div>
              </div>
            </div>
          )) : (
            <div className="empty-priority">
              <div className="empty-priority-icon">✅</div>
              <p>No low priority tasks</p>
            </div>
          )}
        </div>
      </div>
    </div>
	);
}

export default Overview;
