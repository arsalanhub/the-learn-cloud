import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import axios from "axios"
import Chip from '@mui/material/Chip';

export default function OutlinedCard({ text, striked, id, setEditId, setDeleteId, date }) {  
    const checkBoxHandler = async () => {
        striked=!striked;
        await axios.post(`http://localhost:5000/updateTodo/${id}`, {
            striked
        })
    }
  return (
    <Box sx={{ minWidth: 275 }} draggable={true}>
      <Card variant="outlined">
        <CardContent style={{ display: "flex"}}>
          <Typography variant="h5" component="div">
            <input type="checkbox" checked={striked} onClick={() => checkBoxHandler()}/>
          </Typography>
          <Typography variant="h5" component="div" style={{ textDecoration: striked ? "line-through" : "", display: "flex", width: "100%", justifyContent: "space-between" }}>
            <div>{text}</div>
            <Chip label={date.split('T')[0]} />
            <div>
               <button onClick={()=> setEditId(id)}>Edit</button>
               <button onClick={()=> setDeleteId(id)}>Delete</button>
            </div>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
