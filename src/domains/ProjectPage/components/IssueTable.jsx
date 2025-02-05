import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const IssueTable = ({ tasks, onDelete, onEdit }) => {
  const [selectedTasks, setSelectedTasks] = useState([]);

  const handleSelect = (id) => {
    setSelectedTasks((prev) =>
      prev.includes(id) ? prev.filter((taskId) => taskId !== id) : [...prev, id]
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox
                onChange={(e) =>
                  setSelectedTasks(e.target.checked ? tasks.map((t) => t.id) : [])
                }
              />
            </TableCell>
            <TableCell>작업명</TableCell>
            <TableCell>담당자</TableCell>
            <TableCell>상태</TableCell>
            <TableCell>우선순위</TableCell>
            <TableCell>타임라인</TableCell>
            <TableCell align="center">
              <IconButton onClick={() => onDelete(selectedTasks)} color="error">
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} onClick={() => onEdit(task)}>
              <TableCell>
                <Checkbox
                  checked={selectedTasks.includes(task.id)}
                  onChange={() => handleSelect(task.id)}
                />
              </TableCell>
              <TableCell>{task.name}</TableCell>
              <TableCell>{task.assignee}</TableCell>
              <TableCell>{task.status}</TableCell>
              <TableCell>{task.priority}</TableCell>
              <TableCell>
                {task.startDate && task.endDate
                  ? `${task.startDate.format("YYYY-MM-DD")} ~ ${task.endDate.format("YYYY-MM-DD")}`
                  : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default IssueTable;
