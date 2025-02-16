import React from "react";
import { useParams } from "react-router-dom";
import ProjectCalendar from "./ProjectCalendar";
import UrgentIssues from "./UrgentIssues";
import ProjectMainNotice from "./ProjectMainNotice";

const ProjectMainDashboard = () => {
  const { projectId } = useParams(); // URL에서 projectId 가져오기

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
      {/* 프로젝트 캘린더 */}
      <ProjectCalendar projectId={projectId} />

      {/* 공지사항 & 긴급 이슈 섹션 */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        {/* 공지사항 */}
        <div style={{ flex: 1, minWidth: "50%" }}>
          <ProjectMainNotice projectId={projectId} />
        </div>
        
        {/* 긴급 이슈 */}
        <div style={{ flex: 1, minWidth: "50%" }}>
          <UrgentIssues projectId={projectId} />
        </div>
      </div>
    </div>
  );
};

export default ProjectMainDashboard;
