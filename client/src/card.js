import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import axios from "axios"

export default function OutlinedCard({ text, striked, id, fun, setEditId }) {  
    const checkBoxHandler = async () => {
        striked=!striked;
        await axios.post(`http://localhost:5000/updateTodo/${id}`, {
            striked
        })
        fun()
    }
  return (
    <Box sx={{ minWidth: 275 }} draggable={true}>
      <Card variant="outlined">
        <CardContent style={{ display: "flex"}}>
          <Typography variant="h5" component="div">
            <input type="checkbox" checked={striked} onClick={() => checkBoxHandler()}/>
          </Typography>
          <Typography variant="h5" component="div" style={{ textDecoration: striked ? "line-through" : "" }}>
            {text}
            <button onClick={()=> setEditId(id)}>Edit</button>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
