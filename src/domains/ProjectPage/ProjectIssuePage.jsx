import React, { useState } from "react";
import IssueTable from "./components/IssueTable";
import IssueUpdateModal from "./components/IssueUpdateModal";
import IssueWriteModal from "./components/IssueWriteModal";

const ProjectIssuePage = () => {
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열고 닫는 상태
  const [modalType, setModalType] = useState(""); // 어떤 모달인지 구분

  const handleSaveTask = (task) => {
    if (editTask) {
      setTasks(tasks.map((t) => (t.id === editTask.id ? task : t)));
      setEditTask(null);
    } else {
      setTasks([...tasks, { ...task, id: tasks.length + 1 }]);
    }
    setIsModalOpen(false); // 작업 완료 후 모달 닫기
  };

  const handleDeleteTasks = (ids) => {
    setTasks(tasks.filter((task) => !ids.includes(task.id)));
  };

  const openModal = (type, task) => {
    setModalType(type); // 모달 종류 설정
    setEditTask(task);
    setIsModalOpen(true); // 모달 열기
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  return (
    <div>
      <IssueTable tasks={tasks} onDelete={handleDeleteTasks} onEdit={openModal} />
      
      {/* 모달이 열려 있으면 보여지도록 */}
      {isModalOpen && modalType === "edit" && (
        <IssueUpdateModal task={editTask} onSave={handleSaveTask} onClose={closeModal} />
      )}
      {isModalOpen && modalType === "create" && (
        <IssueWriteModal onSave={handleSaveTask} onClose={closeModal} />
      )}
    </div>
  );
};

export default ProjectIssuePage;
