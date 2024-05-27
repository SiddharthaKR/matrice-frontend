import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import PersonIcon from "@mui/icons-material/Person";
import { blue } from "@mui/material/colors";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useState } from "react";
import { Box } from "@mui/material";

function SimpleDialog(props) {
  const [role, setRole] = useState("Member");
  const { onClose, selectedValue, open, datas = [] } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    value.role = role
    onClose(value);
  };
  const handleChange = (event) => {
    setRole(event.target.value);
  };
  const {flag=false} = props
  return (
    <Dialog onClose={handleClose} open={open}>
        {
            flag && <DialogTitle sx={{display:'flex',justifyContent:'center'}}>ASSIGN</DialogTitle>
        }
        {
           !flag &&  <Box sx={{ display: "flex",alignItems:'center',justifyContent:'center' }}>
           <DialogTitle>USER ROLE</DialogTitle>
             <FormControl>
               <RadioGroup
                 row
                 aria-labelledby="demo-row-radio-buttons-group-label"
                 name="row-radio-buttons-group"
                 value={role}
                 onChange={handleChange}
               >
                 <FormControlLabel
                   value="Admin"
                   control={<Radio />}
                   label="Admin"
                 />
                 <FormControlLabel value="Member" control={<Radio />} label="Member" />
               </RadioGroup>
             </FormControl>
           </Box>
        }
      <List sx={{ pt: 0 }}>
        {datas.map((data) => (
          <ListItem disableGutters key={data?._id||data?.username}>
            <ListItemButton onClick={() => handleListItemClick(data)}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={data?.username} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  datas: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.object.isRequired,
};

export default SimpleDialog;
