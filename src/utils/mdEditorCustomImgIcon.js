import { commands } from "@uiw/react-md-editor";
import Swal from "sweetalert2";
import api from "../apis/baseApi";
import { TextField, Button } from "@mui/material";
import { styled } from "@mui/material/styles";

// MUI 스타일 컴포넌트 정의
const StyledTextField = styled(TextField)({
  margin: "10px 0",
  width: "100%",
});

const StyledButton = styled(Button)({
  margin: "10px 0",
  width: "100%",
});

const addImagePrompt = (api) => {
  Swal.fire({
    title: "이미지 추가",
    html: `
      <div class="mui-container">
        <div class="mui-textfield-container">
          <input 
            type="text" 
            id="image-url" 
            class="swal2-input" 
            placeholder="이미지의 URL을 입력해주세요."
            style="
              width: 100%;
              padding: 8px;
              margin: 10px 0;
              border: 1px solid #ddd;
              border-radius: 4px;
              font-size: 14px;
            "
          >
        </div>
        <div class="mui-file-container">
          <input 
            type="file" 
            id="image-file" 
            accept="image/*"
            style="
              width: 100%;
              padding: 8px;
              margin: 10px 0;
              border: 1px solid #ddd;
              border-radius: 4px;
              font-size: 14px;
            "
          >
        </div>
      </div>
    `,
    customClass: {
      container: "mui-swal-container",
      popup: "mui-swal-popup",
      content: "mui-swal-content",
    },
    showCancelButton: true,
    confirmButtonColor: "#1976d2", // MUI primary color
    cancelButtonColor: "#d32f2f", // MUI error color
    confirmButtonText: "확인",
    cancelButtonText: "취소",
    willOpen: (popup) => {
      // 모달이 열리기 전에 호출
      document.head.insertAdjacentHTML("beforeend", addSweetAlert2Styles);
    },
    didOpen: () => {
      const fileInput = document.getElementById("image-file");
      const container = document.querySelector(".mui-file-container");

      fileInput.addEventListener("change", (e) => {
        const fileName = e.target.files[0]?.name;
        if (fileName) {
          const fileNameDisplay = document.createElement("div");
          fileNameDisplay.className = "file-name-display";
          fileNameDisplay.textContent = fileName;

          // 기존 파일 이름 표시 제거
          const existingDisplay = document.querySelector(".file-name-display");
          if (existingDisplay) {
            existingDisplay.remove();
          }

          // container에 직접 추가
          container.appendChild(fileNameDisplay);
        }
      });
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      const imageUrl = document.getElementById("image-url").value;
      const imageFile = document.getElementById("image-file").files[0];

      if (imageUrl && imageFile) {
        alert("이미지를 하나만 선택해주세요.");
        return;
      }

      if (imageUrl) {
        const modifyText = `![image](${imageUrl})`;
        api.replaceSelection(modifyText);
      } else if (imageFile) {
        const url = await createImgUrl(imageFile);
        const modifyText = `![image](${url})`;
        api.replaceSelection(modifyText);
      }
    }
  });
};

const customImgCommand = {
  name: "image",
  keyCommand: "image",
  buttonProps: { "aria-label": "Insert image" },
  icon: commands.image.icon,
  execute: (state, api) => {
    addImagePrompt(api);
  },
};

const createImgUrl = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post("/s3", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  console.log(response.data);

  return response.data;
};

const addSweetAlert2Styles = `
  <style>
    .mui-swal-container {
      font-family: 'Roboto', sans-serif;
    }
    
    .mui-swal-popup {
      padding: 20px;
    }
    
    .mui-swal-content {
      margin: 20px 0;
    }
    
    .mui-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .mui-textfield-container input {
      width: 100%;
      padding: 8px;
      margin: 10px 0;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }
    
    .swal2-confirm {
      background-color: #1976d2 !important;
      border: none !important;
      box-shadow: 0 3px 1px -2px rgba(0,0,0,0.2), 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12) !important;
      font-weight: 500 !important;
      text-transform: uppercase !important;
      padding: 6px 16px !important;
      font-size: 0.875rem !important;
      border-radius: 4px !important;
    }
    
    .swal2-cancel {
      background-color: #d32f2f !important;
      border: none !important;
      box-shadow: 0 3px 1px -2px rgba(0,0,0,0.2), 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12) !important;
      font-weight: 500 !important;
      text-transform: uppercase !important;
      padding: 6px 16px !important;
      font-size: 0.875rem !important;
      border-radius: 4px !important;
    }

    .mui-file-container {
      position: relative;
      width: 100%;
      height: 40px;  // min-height 제거하고 height로 변경
      margin: 10px 0;
    }

    .mui-file-container input[type="file"] {
      width: 100%;
      height: 40px;
      opacity: 0;
      z-index: 2;
      position: absolute;
      top: 0;
      cursor: pointer;
    }

    .mui-file-container:before {
      content: '파일 선택';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: 40px;
      z-index: 1;
      background-color: #1976d2;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      font-weight: 500;
      font-size: 0.875rem;
      pointer-events: none;
    }

    .file-name-display {
      width: 100%;
      padding: 8px;
      background-color: #f5f5f5;
      border-radius: 4px;
      font-size: 0.875rem;
      color: rgba(0, 0, 0, 0.87);
      word-break: break-all;
      margin-top: 8px;  // margin-top 줄임
      position: static;  // relative 대신 static으로 변경
    }
  </style>
`;

// 스타일 태그를 문서에 추가
document.head.insertAdjacentHTML("beforeend", addSweetAlert2Styles);

export const customCommands = [
  ...commands
    .getCommands()
    .map((cmd) => (cmd.name !== "image" ? cmd : customImgCommand)),
];
