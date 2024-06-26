import {
  Box,
  Button,
  Typography,
  Divider,
  TextField,
  IconButton,
  Card,
  Autocomplete,
} from "@mui/material";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import sectionApi from "../../api/sectionApi";
import taskApi from "../../api/taskApi";
import TaskModal from "./TaskModal";
import SimpleDialog from "./SimpleDialog";
import boardApi from "../../api/boardApi";
import Moment from "moment";

let timer;
const timeout = 500;

const Kanban = (props) => {
  const isAdmin = props.isAdmin;
  const boardId = props.boardId;
  const [data, setData] = useState([]);
  const [selectedTask, setSelectedTask] = useState(undefined);
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState({});
  const [deadline, setDeadline] = useState("");

  const users = props.users || [];

  useEffect(() => {
    console.log(props.data)
    setData(props.data);
    setDeadline(Moment(props.deadline).format('YYYY-MM-DD'))
  }, [props.data,props.deadline]);

  const onDragEnd = async ({ source, destination }) => {
    if (!destination) return;
    const sourceColIndex = data.findIndex((e) => e.id === source.droppableId);
    const destinationColIndex = data.findIndex(
      (e) => e.id === destination.droppableId
    );
    const sourceCol = data[sourceColIndex];
    const destinationCol = data[destinationColIndex];

    const sourceSectionId = sourceCol.id;
    const destinationSectionId = destinationCol.id;

    const sourceTasks = [...sourceCol.tasks];
    const destinationTasks = [...destinationCol.tasks];

    if (source.droppableId !== destination.droppableId) {
      const [removed] = sourceTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, removed);
      data[sourceColIndex].tasks = sourceTasks;
      data[destinationColIndex].tasks = destinationTasks;
    } else {
      const [removed] = destinationTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, removed);
      data[destinationColIndex].tasks = destinationTasks;
    }

    try {
      await taskApi.updatePosition(boardId, {
        resourceList: sourceTasks,
        destinationList: destinationTasks,
        resourceSectionId: sourceSectionId,
        destinationSectionId: destinationSectionId,
      });
      setData(data);
    } catch (err) {
      alert(err);
    }
  };

  const createSection = async () => {
    try {
      const section = await sectionApi.create(boardId);
      setData([...data, section]);
    } catch (err) {
      alert(err);
    }
  };

  const deleteSection = async (sectionId) => {
    try {
      await sectionApi.delete(boardId, sectionId);
      const newData = [...data].filter((e) => e.id !== sectionId);
      setData(newData);
    } catch (err) {
      alert(err);
    }
  };

  const updateSectionTitle = async (e, sectionId) => {
    clearTimeout(timer);
    const newTitle = e.target.value;
    const newData = [...data];
    const index = newData.findIndex((e) => e.id === sectionId);
    newData[index].title = newTitle;
    setData(newData);
    timer = setTimeout(async () => {
      try {
        await sectionApi.update(boardId, sectionId, { title: newTitle });
      } catch (err) {
        alert(err);
      }
    }, timeout);
  };

  const updateDeadline = async (e) => {
    clearTimeout(timer);
    const newDeadline = e.target.value;
    setDeadline(newDeadline);
    timer = setTimeout(async () => {
      try {
        await boardApi.update(boardId, { deadline: newDeadline });
      } catch (err) {
        alert(err);
      }
    }, timeout);
  };

  const createTask = async (sectionId) => {
    try {
      const task = await taskApi.create(boardId, { sectionId });
      const newData = [...data];
      const index = newData.findIndex((e) => e.id === sectionId);
      newData[index].tasks.unshift(task);
      setData(newData);
    } catch (err) {
      alert(err);
    }
  };

  const onUpdateTask = (task) => {
    const newData = [...data];
    const sectionIndex = newData.findIndex((e) => e.id === task.section.id);
    const taskIndex = newData[sectionIndex].tasks.findIndex(
      (e) => e.id === task.id
    );
    newData[sectionIndex].tasks[taskIndex] = task;
    setData(newData);
  };

  const onDeleteTask = (task) => {
    const newData = [...data];
    const sectionIndex = newData.findIndex((e) => e.id === task.section.id);
    const taskIndex = newData[sectionIndex].tasks.findIndex(
      (e) => e.id === task.id
    );
    newData[sectionIndex].tasks.splice(taskIndex, 1);
    setData(newData);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const addMemberToBoard = async (value) => {
    try {
      const { role = "Member" } = value;
      const res = await boardApi.addMember(boardId, {
        userId: value._id,
        role: role,
      });
    } catch (err) {
      console.log(err);
    }
  };
  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
    if (value && value._id) addMemberToBoard(value);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {isAdmin && (
          <Box sx={{ display: "flex" }}>
            <Button onClick={createSection}>Add section</Button>
            <Button onClick={handleClickOpen}>ADD USER</Button>
            <SimpleDialog
              sx={{ padding: 2 }}
              datas={users}
              selectedValue={selectedValue}
              open={open}
              onClose={handleClose}
            />
            {/* <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={users}
            getOptionLabel={(option) => option.username}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Users" />}
          /> */}
          </Box>
        )}
        
        <Box
          sx={{
            display: "flex",
            justifyContent: "flexStart",
            alignItems: "ceter",
            marginTop: "6px",
          }}
        >
          <Typography variant="body2" fontWeight="700">
            DEADLINE:{" "}
            <input
              style={{
                background: "transparent",
                fontSize: "18px",
                color: "white",
                border: "none",
                marginLeft: "6px",
              }}
              type="date"
              value={deadline}
              onChange={updateDeadline}
              disabled={!props.isAdmin}
            />
          </Typography>
          <Typography variant="body2" fontWeight="700">
          {data.length} Sections
        </Typography>
        </Box>
      </Box>
      <Divider sx={{ margin: "10px 0" }} />
      <DragDropContext onDragEnd={isAdmin ? onDragEnd : undefined}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            width: "calc(100vw - 400px)",
            overflowX: "auto",
          }}
        >
          {data.map((section) => (
            <div key={section.id} style={{ width: "300px" }}>
              <Droppable key={section.id} droppableId={section.id}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      width: "300px",
                      padding: "10px",
                      marginRight: "10px",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                      }}
                    >
                      <TextField
                        value={section.title}
                        onChange={(e) => updateSectionTitle(e, section.id)}
                        placeholder="Untitled"
                        variant="outlined"
                        sx={{
                          flexGrow: 1,
                          "& .MuiOutlinedInput-input": { padding: 0 },
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "unset ",
                          },
                          "& .MuiOutlinedInput-root": {
                            fontSize: "1rem",
                            fontWeight: "700",
                          },
                        }}
                      />
                      {isAdmin && (
                        <div>
                          <IconButton
                            variant="outlined"
                            size="small"
                            sx={{
                              color: "gray",
                              "&:hover": { color: "green" },
                            }}
                            onClick={() => createTask(section.id)}
                          >
                            <AddOutlinedIcon />
                          </IconButton>
                          <IconButton
                            variant="outlined"
                            size="small"
                            sx={{
                              color: "gray",
                              "&:hover": { color: "red" },
                            }}
                            onClick={() => deleteSection(section.id)}
                          >
                            <DeleteOutlinedIcon />
                          </IconButton>
                        </div>
                      )}
                    </Box>
                    {/* tasks */}
                    {section.tasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              padding: "10px",
                              marginBottom: "10px",
                              cursor: snapshot.isDragging
                                ? "grab"
                                : "pointer!important",
                            }}
                            onClick={() => setSelectedTask(task)}
                          >
                            <Typography>
                              {task.title === "" ? "Untitled" : task.title}
                            </Typography>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </div>
          ))}
        </Box>
      </DragDropContext>
      <TaskModal
        task={selectedTask}
        boardId={boardId}
        members={props.members}
        onClose={() => setSelectedTask(undefined)}
        onUpdate={onUpdateTask}
        onDelete={onDeleteTask}
        isAdmin={isAdmin}
      />
    </>
  );
};

export default Kanban;
