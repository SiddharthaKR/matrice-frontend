import {
  Backdrop,
  Fade,
  IconButton,
  Modal,
  Box,
  TextField,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Moment from "moment";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import taskApi from "../../api/taskApi";

import "../../css/custom-editor.css";
import SimpleDialog from "./SimpleDialog";
import boardApi from "../../api/boardApi";
import { useSelector } from "react-redux";

const modalStyle = {
  outline: "none",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  border: "0px solid #000",
  boxShadow: 24,
  p: 1,
  height: "80%",
};

let timer;
const timeout = 500;
let isModalClosed = false;

const TaskModal = (props) => {
  const user = useSelector((state) => state.user.value);
  const boardId = props.boardId;
  const [task, setTask] = useState(props.task);
  const [currUserTask, setcurrUserTask] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [deadline, setDeadline] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState({});
  const [users, setUsers] = useState([]);
  const editorWrapperRef = useRef();

  useEffect(() => {
    setTask(props.task);
    setTitle(props.task !== undefined ? props.task.title : "");
    setContent(props.task !== undefined ? props.task.content : "");
    setDeadline(props.task !== undefined ? Moment(props.task.deadline).format('YYYY-MM-DD') : "");
    console.log(user.username,props.task?.assignedTo?.username)
    if (task?.assignedTo)
      setcurrUserTask(user.username == props.task?.assignedTo?.username);
    console.log(currUserTask)
    if (props.task !== undefined) {
      isModalClosed = false;
      updateEditorHeight();
    }
  }, [props.task]);

  const updateEditorHeight = () => {
    setTimeout(() => {
      if (editorWrapperRef.current) {
        const box = editorWrapperRef.current;
        box.querySelector(".ck-editor__editable_inline").style.height =
          box.offsetHeight - 50 + "px";
      }
    }, timeout);
  };

  const onClose = () => {
    isModalClosed = true;
    props.onUpdate(task);
    props.onClose();
  };

  const deleteTask = async () => {
    try {
      await taskApi.delete(boardId, task.id);
      props.onDelete(task);
      setTask(undefined);
    } catch (err) {
      alert(err);
    }
  };

  const updateTitle = async (e) => {
    clearTimeout(timer);
    const newTitle = e.target.value;
    timer = setTimeout(async () => {
      try {
        await taskApi.update(boardId, task.id, { title: newTitle });
      } catch (err) {
        alert(err);
      }
    }, timeout);

    task.title = newTitle;
    setTitle(newTitle);
    props.onUpdate(task);
  };

  const updateContent = async (event, editor) => {
    clearTimeout(timer);
    const data = editor.getData();

    console.log({ isModalClosed });

    if (!isModalClosed) {
      timer = setTimeout(async () => {
        try {
          await taskApi.update(boardId, task.id, { content: data });
        } catch (err) {
          alert(err);
        }
      }, timeout);

      task.content = data;
      setContent(data);
      props.onUpdate(task);
    }
  };

  const updateDeadline = async (e) => {
    clearTimeout(timer);
    const newDeadline = e.target.value;
    setDeadline(newDeadline);
    timer = setTimeout(async () => {
      try {
        await taskApi.update(boardId, task.id, { deadline: newDeadline });
      } catch (err) {
        alert(err);
      }
    }, timeout);

    task.deadline = newDeadline;
    props.onUpdate(task);
  };

  const handleClickOpen = () => {
    if(props.isAdmin)
    setOpen(true);
  };

  const assignTask = async (value) => {
    try {
      const res = await taskApi.assign(boardId, task.id, {
        userId: value.userId,
      });
    } catch (err) {
      console.log(err);
    }
  };
  const handleClose = (value) => {
    setOpen(false);
    console.log(value);
    if (value && value.userId) assignTask(value);
  };

  return (
    <Modal
      open={task !== undefined}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={task !== undefined}>
        <Box sx={modalStyle}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            {task?.assignedTo && task?.assignedTo?.username ? (
              <Button onClick={handleClickOpen}>ASSIGEND: {task.assignedTo.username}</Button>
            ): props.isAdmin && <Button onClick={handleClickOpen}>ASSIGN</Button> }
              <SimpleDialog
                flag={true}
                sx={{ padding: 2 }}
                datas={props.members}
                selectedValue={selectedValue}
                open={open}
                onClose={handleClose}
              />
              {
                props.isAdmin && <IconButton variant="outlined" color="error" onClick={deleteTask}>
                <DeleteOutlinedIcon />
              </IconButton>
              }
          </Box>
          <Box
            sx={{
              display: "flex",
              height: "100%",
              flexDirection: "column",
              padding: "2rem 5rem 5rem",
            }}
          >
            <TextField
              value={title}
              onChange={updateTitle}
              disabled={user.username != props.task?.assignedTo?.username && !props.isAdmin}
              placeholder="Untitled"
              variant="outlined"
              fullWidth
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-input": { padding: 0 },
                "& .MuiOutlinedInput-notchedOutline": { border: "unset " },
                "& .MuiOutlinedInput-root": {
                  fontSize: "2.5rem",
                  fontWeight: "700",
                },
                marginBottom: "10px",
              }}
            />
            <Typography variant="body2" fontWeight="700">
              CREATED AT: {task !== undefined
                ? Moment(task.createdAt).format("YYYY-MM-DD")
                : ""}
            </Typography>
            <Box sx={{display:'flex', justifyContent:'flexStart',alignItems:'ceter',marginTop:'6px'}}>
            <Typography variant="body2" fontWeight="700">
              DEADLINE: <input style={{background:'transparent',fontSize: '18px',color:'white',border:'none',marginLeft:'6px'}} type="date" 
              value={deadline}
              onChange={updateDeadline}
              disabled = {!props.isAdmin}
              />
            </Typography>
            </Box>
            <Divider sx={{ margin: "1.5rem 0" }} />
            <Box
              ref={editorWrapperRef}
              sx={{
                position: "relative",
                height: "80%",
                overflowX: "hidden",
                overflowY: "auto",
              }}
            >
              <CKEditor
                editor={ClassicEditor}
                data={content}
                onChange={updateContent}
                onFocus={updateEditorHeight}
                onBlur={updateEditorHeight}
                disabled={user.username != props.task?.assignedTo?.username && !props.isAdmin}
              />
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default TaskModal;
