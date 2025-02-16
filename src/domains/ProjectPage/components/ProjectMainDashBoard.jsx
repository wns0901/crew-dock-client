import React from "react";
import { useParams } from "react-router-dom";
import ProjectCalendar from "./ProjectCalendar";
import UrgentIssues from "./UrgentIssues";

const ProjectMainDashboard = () => {
  const { projectId } = useParams(); // URL에서 projectId 가져오기

  return (
    <div>
      <ProjectCalendar projectId={projectId} />
      <UrgentIssues projectId={projectId} />
    </div>
  );
};

export default ProjectMainDashboard;
