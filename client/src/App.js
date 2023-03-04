import "./App.css";
import axios from "axios";
import react, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import BarChart from "./barChart";

function App() {
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [striked, setStriked] = useState(false);
  const [data, setData] = useState([]);
  const [year, setYear] = useState([]);
  const [month, setMonth] = useState([]);
  const [queryYear, setQueryYear] = useState("");
  const [queryMonth, setQueryMonth] = useState("");
  const [editId, setEditId] = useState(0);
  const [deleteId, setDeleteId] = useState(0);
  const [itemToBeDragged, setItemToBeDragged] = useState(-1);
  const [itemOnWhichDrag, setItemOnWhichDrag] = useState(-1);

  const fun = async () => {
    let tmpData = await axios.get(
      `http://localhost:5000/getTodo?month=${queryMonth}&year=${queryYear}`
    );
    let tmpYear = await axios.get("http://localhost:5000/getYear");
    let tmpMonth = await axios.get("http://localhost:5000/getMonth");
    setData(tmpData.data.data);
    setYear(tmpYear.data.data[0].distinctYear);
    setMonth(tmpMonth.data.data[0].distinctMonth);
  };

  const resetOptions = async () => {
    let tmpData = await axios.get("http://localhost:5000/getTodo?month=&year=");
    setYear([]);
    setMonth([]);
    setQueryMonth("");
    setQueryYear("");
    let tmpYear = await axios.get("http://localhost:5000/getYear");
    let tmpMonth = await axios.get("http://localhost:5000/getMonth");
    setData(tmpData.data.data);
    setYear(tmpYear.data.data[0].distinctYear);
    setMonth(tmpMonth.data.data[0].distinctMonth);
  };

  const clickHander = async () => {
    await axios.post("http://localhost:5000/postTodo", {
      text,
      date,
      striked,
    });
    fun();
  };

  const yearHandler = async (year) => {
    setQueryYear(year);
    let tmpData = await axios.get(
      `http://localhost:5000/getTodo?month=${queryMonth}&year=${year}`
    );
    setData(tmpData.data.data);
  };

  const monthHandler = async (month) => {
    setQueryMonth(month);
    let tmpData = await axios.get(
      `http://localhost:5000/getTodo?month=${month}&year=${queryYear}`
    );
    setData(tmpData.data.data);
  };

  const updateHandler = async (id) => {
    let data = await axios.post(`http://localhost:5000/updateTodo/${id}`, {
      text,
    });
    setEditId(0);
    fun();
  };

  const DragHandler = async () => {
    let tmp = data[itemToBeDragged];
    data[itemToBeDragged] = data[itemOnWhichDrag];
    data[itemOnWhichDrag] = tmp;
    console.log(itemOnWhichDrag, itemToBeDragged);
    await axios.post(
      `http://localhost:5000/updateTodo/${data[itemToBeDragged]._id}`,
      {
        index: itemToBeDragged,
      }
    );
    await axios.post(
      `http://localhost:5000/updateTodo/${data[itemOnWhichDrag]._id}`,
      {
        index: itemOnWhichDrag,
      }
    );
    setItemOnWhichDrag(-1);
    setItemToBeDragged(-1);
    fun();
  };

  const checkBoxHandler = async (id, striked) => {
    striked = !striked;
    await axios.post(`http://localhost:5000/updateTodo/${id}`, {
      striked,
    });
    fun();
  };

  const deleteFun = async () => {
    await axios.post(`http://localhost:5000/deleteTodo/${deleteId}`);
    setDeleteId(0);
  };

  useEffect(() => {
    fun();
  }, []);

  useEffect(() => {
    if (deleteId !== 0) {
      deleteFun();
      fun();
    }
  }, [deleteId]);

  return (
    <div style={{ display: "flex", marginTop: "3rem", marginRight: "1rem" }}>
      <div style={{ width: "45%" }}>
        <Box sx={{ minWidth: 275 }} className="card-wrapper">
          <Card variant="outlined" style={{ backgroundColor: "aqua" }}>
            <CardContent style={{ display: "flex", padding: "1rem" }}>
              <Typography
                variant="h5"
                component="div"
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-around",
                }}
              >
                Filters:
                <select onChange={(e) => yearHandler(e.target.value)}>
                  <option value="Select Year" selected>
                    Select Year
                  </option>
                  {year &&
                    year.map((ele, idx) => {
                      return <option key={idx}>{ele}</option>;
                    })}
                </select>
                <select onChange={(e) => monthHandler(e.target.value)}>
                  <option value="Select Month" selected>
                    Select Month
                  </option>
                  {month &&
                    month.map((ele, idx) => {
                      return <option key={idx + 10}>{ele}</option>;
                    })}
                </select>
                <button onClick={() => resetOptions()}>Clear</button>
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <div style={{ maxHeight: "37rem", overflow: "auto" }}>
          {data &&
            data.map((ele, idx) => {
              if (editId === ele._id)
                return (
                  <div className="editBox">
                    <input
                      type="text"
                      onChange={(e) => setText(e.target.value)}
                    />
                    <button onClick={() => updateHandler(ele._id)}>Save</button>
                  </div>
                );
              return (
                <Box sx={{ minWidth: 275 }} className="card-wrapper">
                  <Card
                    variant="outlined"
                    draggable={true}
                    key={idx}
                    onDragStart={() => setItemToBeDragged(idx)}
                    onDragEnter={() => setItemOnWhichDrag(idx)}
                    onDragEnd={() => DragHandler()}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <CardContent style={{ display: "flex" }}>
                      <Typography variant="h5" component="div">
                        <input
                          type="checkbox"
                          checked={ele.striked}
                          onClick={() => checkBoxHandler(ele._id, ele.striked)}
                        />
                      </Typography>
                      <Typography
                        variant="h5"
                        component="div"
                        style={{
                          textDecoration: ele.striked ? "line-through" : "",
                          display: "flex",
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ width: "53%" }}>{ele.text}</div>
                        <Chip label={ele.date.split("T")[0]} />
                        <div>
                          <button onClick={() => setEditId(ele._id)}>
                            Edit
                          </button>
                          <button onClick={() => setDeleteId(ele._id)}>
                            Delete
                          </button>
                        </div>
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              );
            })}
        </div>
        <Box sx={{ minWidth: 275 }} className="card-wrapper">
          <Card variant="outlined" style={{ backgroundColor: "aqua" }}>
            <CardContent style={{ display: "flex", padding: "1rem" }}>
              <Typography
                variant="h5"
                component="div"
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-around",
                }}
              >
                <input
                  type="text"
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter Todo"
                />
                <input type="date" onChange={(e) => setDate(e.target.value)} />
                <button onClick={() => clickHander()}>Submit</button>
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </div>
      <div style={{ width: "55%" }}>
        {data && <BarChart chartData={data} />}
      </div>
    </div>
  );
}

export default App;
