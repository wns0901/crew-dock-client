import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import api from "../../../apis/baseApi";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Grid,
  Container,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  Box,
  Typography,
  Divider,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  IconButton,
  DialogActions,
} from "@mui/material";
import {
  position,
  proceedMethod,
  region,
} from "../../MainPage/components/Filter";
import { LoginContext } from "../../../contexts/LoginContextProvider";

const EditRecruitmentPost = () => {
  const navigate = useNavigate();
  const { userInfo } = useContext(LoginContext);
  const { recruitmentId } = useParams();

  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [recruitedField, setRecruitedField] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [recruitedNumber, setRecruitedNumber] = useState(1);
  const [content, setContent] = useState("");

  // 프로젝트 정보 상태
  const [projectName, setProjectName] = useState("");
  const [period, setPeriod] = useState("");
  const [stacks, setStacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectId, setProjectId] = useState("");

  // 첨부파일 상태
  const [attachments, setAttachments] = useState([]);
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [tempAttachments, setTempAttachments] = useState([]);

  console.log("📌 useParams()에서 받은 recruitmentId:", recruitmentId);
  
  // 기존 모집글 데이터 불러오기
  useEffect(() => {
    if (!recruitmentId) return; // recruitmentId 없으면 실행 안 함

    const fetchRecruitmentData = async () => {
      try {
        // 모집글 데이터 가져오기
        const response = await api.get(`/recruitments/${recruitmentId}`);
        const postData = response.data;
        console.log("postData", postData);

        // 프로젝트 정보 설정
        setProjectName(postData.projectName || "프로젝트명 없음");
        setPeriod(postData.period ? `${postData.period}개월` : "기간 없음");

        // 프로젝트 스택 불러오기
        if (postData.projectId) {
          const stackResponse = await api.get(
            `/projects/${postData.projectId}/stacks`
          );
          setStacks(
            stackResponse.data.map((s) => s.stack?.name || "스택 없음")
          );
        }

        // 모집글 정보 설정
        setTitle(postData.title || "");
        setDeadline(postData.deadline || "");
        setRecruitedField(postData.recruitedField || "");
        setSelectedRegion(postData.region || "");
        setSelectedMethod(postData.proceedMethod || "");
        setRecruitedNumber(postData.recruitedNumber || 1);
        setProjectName(postData.projectName);
        setProjectId(postData.projectId);
        setContent(postData.content || "");

        // 첨부파일 불러오기
        const attachmentResponse = await api.get(
          `/recruitments/${recruitmentId}/attachments`
        );
        console.log("attachmentResponse.data", attachmentResponse);

        const fetchedAttachments = attachmentResponse.data.map(
          (attachment) => ({
            type: "file",
            name: attachment.fileName,
            url: attachment.url,
          })
        );
        setAttachments(fetchedAttachments);
        console.log("fetchedAttachments", fetchedAttachments);

        setLoading(false);
      } catch (error) {
        console.error("모집글 데이터 불러오기 실패:", error);
        alert("모집글을 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
        navigate(-1);
      }
    };

    fetchRecruitmentData();
  }, []);

  const handleSubmit = async () => {
    // 유효성 검사
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }
    if (!recruitedField) {
      alert("모집 분야를 선택해주세요.");
      return;
    }
    if (!deadline) {
      alert("모집 마감일을 선택해주세요.");
      return;
    }
    if (!selectedRegion) {
      alert("지역을 선택해주세요.");
      return;
    }
    if (!selectedMethod) {
      alert("진행 방식을 선택해주세요.");
      return;
    }
    if (recruitedNumber < 1) {
      alert("모집 인원은 최소 1명 이상이어야 합니다.");
      return;
    }

    console.log(recruitmentId);

    try {
      // 모집글 수정 데이터 생성
      const postData = {
        id: recruitmentId,
        title,
        content,
        deadline,
        recruitedField,
        recruitedNumber,
        region: selectedRegion,
        proceedMethod: selectedMethod.toUpperCase(),
        user: {
          userId: userInfo?.id || null,
          userName: userInfo?.username || "",
          nickName: userInfo?.nickname || "",
        },
        projectId: projectId,
      };

      // 모집글 수정
      await api.patch(`/recruitments/${recruitmentId}`, postData);

      // 첨부파일 처리
      if (attachments.length > 0) {
        const formData = new FormData();
        const newFiles = attachments.filter((attachment) => attachment.file);
        newFiles.forEach((attachment) => {
          formData.append("file", attachment.file);
        });

        if (formData.has("file")) {
          await api.post(
            `/recruitments/${recruitmentId}/attachments`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
        }
      }

      alert("모집글이 성공적으로 수정되었습니다!");
      navigate(`/recruitments/${recruitmentId}`);
    } catch (error) {
      console.error("저장 실패:", error);
      alert(error.response?.data?.message || "저장 중 오류가 발생했습니다.");
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files) {
      const newAttachments = Array.from(files).map((file) => ({
        type: "file",
        name: file.name,
        file,
      }));
      setTempAttachments([...tempAttachments, ...newAttachments]);
    }
  };

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      setTempAttachments([...tempAttachments, { type: "url", url: urlInput }]);
      setUrlInput("");
    }
  };

  const handleRemoveTempAttachment = (index) => {
    setTempAttachments(tempAttachments.filter((_, i) => i !== index));
  };

  const handleSaveAttachments = () => {
    setAttachments([...attachments, ...tempAttachments]);
    setTempAttachments([]);
    setFileDialogOpen(false);
  };

  // 로딩 중일 때 로딩 화면 표시
  if (loading) {
    return (
      <Container maxWidth="md">
        <Typography variant="h6" sx={{ textAlign: "center", mt: 5 }}>
          로딩 중...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography
        variant="h4"
        sx={{ mt: 4, mb: 3, fontWeight: "bold", textAlign: "left" }}
      >
        {title} 수정
      </Typography>

      <Paper elevation={0} sx={{ p: 2, mb: 1 }}>
        <Typography variant="h6" sx={{ textAlign: "left" }}>
          모집 정보
        </Typography>
        <Divider sx={{ mb: 2 }} />

      <Grid container spacing={2}>

              <Grid item xs={4}>
                  <FormControl fullWidth>
                      <InputLabel>모집 분야</InputLabel>
                      <Select
                          multiple
                          value={recruitedField ? recruitedField.split(",") : []} // 문자열을 배열로 변환
                          onChange={(e) => setRecruitedField(e.target.value.join(","))} // 배열을 문자열로 변환하여 저장
                          renderValue={(selected) =>
                              selected
                                  .map(value => position.find(p => p.value === value)?.label || "알 수 없음")
                                  .join(", ") // 선택된 값들을 문자열로 표시
                          }
                      >
                          {position.map((item) => (
                              <MenuItem key={item.value} value={item.value}>
                                  {item.label}
                              </MenuItem>
                          ))}
                      </Select>
                  </FormControl>
              </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              label="진행 기간"
              variant="outlined"
              value={period || "로딩 중..."}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              type="date"
              label="모집 마감일"
              variant="outlined"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>지역</InputLabel>
              <Select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                {region.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>진행 방식</InputLabel>
              <Select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
              >
                {proceedMethod.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              type="number"
              label="모집 인원"
              variant="outlined"
              value={recruitedNumber}
              onChange={(e) => setRecruitedNumber(e.target.value)}
              inputProps={{ min: 1 }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* 기술 스택 */}
      <Paper elevation={0} sx={{ p: 2, mb: 1 }}>
        <Typography variant="h6" sx={{ textAlign: "left" }}>
          기술 스택
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box
          sx={{
            p: 2,
            minHeight: 50,
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        >
          {stacks.length > 0 ? (
            stacks.map((stackName, index) => (
              <Chip key={index} label={stackName} sx={{ mr: 1, mb: 1 }} />
            ))
          ) : (
            <Typography color="error">
              {stacks.length === 0 ? "프로젝트 스택이 없습니다." : "로딩 중..."}
            </Typography>
          )}
        </Box>
      </Paper>

      {/* 프로젝트 정보 */}
      <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ textAlign: "left" }}>
          프로젝트 정보
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <TextField
          fullWidth
          label="프로젝트명"
          variant="outlined"
          value={projectName}
          InputProps={{ readOnly: true }}
        />
      </Paper>

      {/* 제목 */}
      <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ textAlign: "left" }}>
          제목
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <TextField
          fullWidth
          label="모집글 제목"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Paper>

      {/* 소개 및 내용 */}
      <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ textAlign: "left" }}>
          소개 및 내용
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <MDEditor
          value={content}
          onChange={setContent}
          style={{ height: "300px" }}
        />
      </Paper>

      {/* 첨부파일 추가 */}
      <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ textAlign: "left" }}>
          첨부파일
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Button variant="outlined" onClick={() => setFileDialogOpen(true)}>
          첨부파일 추가
        </Button>

        <Box sx={{ mt: 3 }}>
          {attachments.map((item, index) => (
            <Stack key={index} direction="row" spacing={1} alignItems="center">
              {item.type === "file" ? (
                <Typography variant="body2">{item.name}</Typography>
              ) : (
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.url}
                </a>
              )}
            </Stack>
          ))}
        </Box>
      </Paper>

      <Dialog
        open={fileDialogOpen}
        onClose={() => {
          setTempAttachments([]);
          setFileDialogOpen(false);
        }}
      >
        <DialogTitle>첨부파일 추가</DialogTitle>
        <DialogContent>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            startIcon={<CloudUploadIcon />}
          >
            파일 선택
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
          <Divider sx={{ my: 2 }} />
          <TextField
            fullWidth
            label="이미지 URL 입력"
            variant="outlined"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddUrl}
            sx={{ mt: 2 }}
          >
            URL 추가
          </Button>
          <Box sx={{ mt: 2 }}>
            {tempAttachments.map((item, index) => (
              <Stack
                key={index}
                direction="row"
                spacing={1}
                alignItems="center"
              >
                {item.type === "file" ? (
                  <Typography variant="body2">{item.name}</Typography>
                ) : (
                  <Typography variant="body2">{item.url}</Typography>
                )}
                <IconButton
                  size="small"
                  onClick={() => handleRemoveTempAttachment(index)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Stack>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setTempAttachments([]);
              setFileDialogOpen(false);
            }}
            color="primary"
          >
            닫기
          </Button>
          <Button onClick={handleSaveAttachments} color="primary">
            저장
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ textAlign: "right", mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSubmit}
        >
          수정 완료
        </Button>
      </Box>
    </Container>
  );
};

export default EditRecruitmentPost;
