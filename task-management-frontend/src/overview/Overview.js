
import { RiCloseCircleLine, RiDeleteBinLine, RiArrowUpSLine, RiArrowDownSLine, RiRefreshLine } from 'react-icons/ri';
import React, { useState, useEffect } from 'react';
import './Overview.css';

const api = 'http://localhost:3001';

function Overview() {
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [newTask, setNewTask] = useState("");
		const [value, setValue] = useState("default");
	const [showHigh, setShowHigh] = useState(true);
	const [showMedium, setShowMedium] = useState(true);
	const [showLow, setShowLow] = useState(true);

	useEffect(() => {
		GetTasks();
	}, []);

	const GetTasks = () => {
		setLoading(true);
		setError("");
		fetch(api + '/tasks')
			.then(res => res.json())
			.then(data => setTasks(data))
			.catch((err) => {
				console.error("Error: ", err);
				setError('Failed to load tasks');
			})
			.finally(() => setLoading(false));
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

	const clearPriority = async (priority) => {
		const list = tasks.filter(t => t.priority === priority);
		if (list.length === 0) return;
		// Optimistic UI update
		setTasks(prev => prev.filter(t => t.priority !== priority));
		try {
			await Promise.all(
				list.map(t => fetch(api + '/task/delete/' + t._id, { method: 'DELETE' }))
			);
		} catch (e) {
			console.error(e);
			// In case of error, refetch to restore state
			GetTasks();
		}
	}
	

	// Filter tasks by priority
	const highPriorityTasks = tasks.filter(task => task.priority === 'high');
	const mediumPriorityTasks = tasks.filter(task => task.priority === 'medium');
	const lowPriorityTasks = tasks.filter(task => task.priority === 'low');

	// Sort tasks alphabetically for a cleaner overview
	const sortByText = (a, b) => (a.text || '').localeCompare(b.text || '');
	const highSorted = [...highPriorityTasks].sort(sortByText);
	const mediumSorted = [...mediumPriorityTasks].sort(sortByText);
	const lowSorted = [...lowPriorityTasks].sort(sortByText);

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

		{loading && (
			<div className="loading-row">Loading tasks…</div>
		)}
		{!loading && error && (
			<div className="error-row">{error} <button className="retry-btn" onClick={GetTasks}><RiRefreshLine /> Retry</button></div>
		)}

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
        <div className="section-header">
          <h3>🔥 High Priority Tasks <span className="count-badge">{highPriorityTasks.length}</span></h3>
          <div className="section-controls">
            <button className="icon-button" aria-label={showHigh ? 'Collapse' : 'Expand'} onClick={() => setShowHigh(v => !v)}>
              {showHigh ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
            </button>
            <button className="icon-button danger" aria-label="Clear high priority" onClick={() => clearPriority('high')} disabled={highPriorityTasks.length === 0}>
              <RiDeleteBinLine />
            </button>
          </div>
        </div>
        {showHigh && (
        <div className="task-grid">
          {highSorted.length > 0 ? highSorted.map(task => (
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
        )}
      </div>

      {/* Medium Priority Tasks */}
      <div className="priority-section medium">
        <div className="section-header">
          <h3>⚡ Medium Priority Tasks <span className="count-badge">{mediumPriorityTasks.length}</span></h3>
          <div className="section-controls">
            <button className="icon-button" aria-label={showMedium ? 'Collapse' : 'Expand'} onClick={() => setShowMedium(v => !v)}>
              {showMedium ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
            </button>
            <button className="icon-button danger" aria-label="Clear medium priority" onClick={() => clearPriority('medium')} disabled={mediumPriorityTasks.length === 0}>
              <RiDeleteBinLine />
            </button>
          </div>
        </div>
        {showMedium && (
        <div className="task-grid">
          {mediumSorted.length > 0 ? mediumSorted.map(task => (
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
        )}
      </div>

      {/* Low Priority Tasks */}
      <div className="priority-section low">
        <div className="section-header">
          <h3>📝 Low Priority Tasks <span className="count-badge">{lowPriorityTasks.length}</span></h3>
          <div className="section-controls">
            <button className="icon-button" aria-label={showLow ? 'Collapse' : 'Expand'} onClick={() => setShowLow(v => !v)}>
              {showLow ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
            </button>
            <button className="icon-button danger" aria-label="Clear low priority" onClick={() => clearPriority('low')} disabled={lowPriorityTasks.length === 0}>
              <RiDeleteBinLine />
            </button>
          </div>
        </div>
        {showLow && (
        <div className="task-grid">
          {lowSorted.length > 0 ? lowSorted.map(task => (
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
        )}
      </div>
    </div>
	);
}

export default Overview;
