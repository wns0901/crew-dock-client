import React, { useState } from "react";
import IssueTable from "./components/IssueTable"
import IssueUpdateModal from "./components/IssueUpdateModal";
import IssueWriteModal from "./components/IssueWriteModal";

const projectMembers = [
  { id: 1, name: "펜틴" },
  { id: 2, name: "크루1" },
  { id: 3, name: "크루2" },
  { id: 4, name: "크루3" },
];

const ProjectIssuePage = () => {
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);

  const handleSaveTask = (task) => {
    if (editTask) {
      setTasks(tasks.map((t) => (t.id === editTask.id ? task : t)));
      setEditTask(null);
    } else {
      setTasks([...tasks, { ...task, id: tasks.length + 1 }]);
    }
  };

  const handleDeleteTasks = (ids) => {
    setTasks(tasks.filter((task) => !ids.includes(task.id)));
  };

  return (
    <div>
      <IssueTable tasks={tasks} onDelete={handleDeleteTasks} onEdit={setEditTask} />
    </div>
  );
};

export default ProjectIssuePage;
