import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header';
import Footer from './components/Footer';
import Tasks from './components/Tasks';
import AddTask from './components/AddTask';
import About from './components/About';

function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    getTasks()
  }, [])

  const fetchTasks = async () => {
    const response = await fetch('http://localhost:5000/tasks')
    const data = await response.json()

    return data
  }

  const fetchTask = async (id) => {
    const response = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await response.json()

    return data
  }

  const addTask = async (task) => {
    const response = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })

    const data = await response.json()
    setTasks([...tasks, data])
  }

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE'
    })

    setTasks(tasks.filter((task) => task.id !== id))
  }

  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updatedTask = { ...taskToToggle, reminder: !taskToToggle.reminder }

    const response = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(updatedTask)
    })

    const data = await response.json()

    setTasks(tasks.map(task => task.id === id ? { ...task, reminder: data.reminder } : task))
  }

  return (
    <Router>
      <div className="container">
        <Header onAdd={() => setShowAddTask(!showAddTask)} showAddTask={showAddTask} />
        <Routes>
          <Route path='/' exact element={
            <>
            {showAddTask && <AddTask onAdd={addTask} />}
            {tasks.length > 0 ? (<Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} />) : 'No tasks to display'}
            </>
          }/>
          <Route path='/about' element={<About />} />
        </Routes>
        <Footer />
      </div>

    </Router>
  )
}

export default App;
