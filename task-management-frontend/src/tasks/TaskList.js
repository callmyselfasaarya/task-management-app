import "./Task.css";
import { RiCloseCircleLine, RiMicFill, RiMicOffFill } from 'react-icons/ri';
import React, { useState, useEffect, useRef } from 'react';

const api = 'http://localhost:3001';

function TaskList() {
	const [tasks, setTasks] = useState([]);
	const [newTask, setNewTask] = useState("");
  	const [value, setValue] = useState("default");
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef(null);

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
	
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    setSpeechSupported(true);

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };
    recognition.onresult = (event) => {
      if (!event.results || !event.results[0] || !event.results[0][0]) {
        return;
      }
      const transcript = event.results[0][0].transcript.trim();
      setNewTask((prev) => (prev ? `${prev} ${transcript}`.trim() : transcript));
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, []);

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) {
      return;
    }

    try {
      if (isListening) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
      }
    } catch (error) {
      console.error("Speech recognition failed to start:", error);
      setIsListening(false);
    }
  };


	return (
    <div className="task-container">
      <div className="task-header">
        <h2>Add a New Task</h2>
        <p className="task-subtitle">Organize your tasks by priority and stay productive</p>
      </div>
      
      <div className="task-form">
        <div className="inputGroup">
          <div className="taskInputWrapper">
            <input 
              type="text" 
              onChange={e => setNewTask(e.target.value)} 
              value={newTask} 
              placeholder='Type or dictate your task...'
              name='text'
              className='taskInput'
            />
            <button
              type="button"
              className={`micButton${isListening ? ' active' : ''}${!speechSupported ? ' disabled' : ''}`}
              onClick={toggleListening}
              aria-pressed={isListening}
              aria-label={speechSupported ? (isListening ? "Stop voice capture" : "Start voice capture") : "Voice capture not supported"}
              disabled={!speechSupported}
            >
              {isListening ? <RiMicOffFill className="micIcon" /> : <RiMicFill className="micIcon" />}
              <span className="micLabel">{isListening ? 'Listening' : 'Voice'}</span>
            </button>
          </div>
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
        <p className={`voice-hint${isListening ? ' active' : ''}${!speechSupported ? ' disabled' : ''}`}>
          {speechSupported ? (isListening ? "We're listening... describe your task." : "Tap the mic to dictate a task.") : "Voice capture is not supported in this browser."}
        </p>
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
