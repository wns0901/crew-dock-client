import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

// 프로젝트 정보
export const fetchProject = async (projectId) => {
    const response = await axios.get(`${API_BASE_URL}/projects/${projectId}`);
    return response.json();
};

