import "./App.css";
import axios from "axios";
import react, { useEffect, useState } from "react";
import OutlinedCard from "./card";

function App() {
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [striked, setStriked] = useState(false);
  const [data, setData] = useState([]);
  const [year, setYear] = useState([]);
  const [queryYear, setQueryYear] = useState("");
  const [queryMonth, setQueryMonth] = useState("");
  const [editId, setEditId] = useState(0);
  const [deleteId, setDeleteId] = useState(0);

  const fun = async () => {
    let tmpData = await axios.get(
      `http://localhost:5000/getTodo?month=${queryMonth}&year=${queryYear}`
    );
    let tmpYear = await axios.get("http://localhost:5000/getYear");
    setData(tmpData.data.data);
    setYear(tmpYear.data.data[0].distinctYear);
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

  const updateHandler = async (id) => {
    let data = await axios.post(`http://localhost:5000/updateTodo/${id}`, {
      text
    })
    setEditId(0)
    fun()
  }

  useEffect(() => {
    fun();
  }, []);

  useEffect(() => {
    if(deleteId !== 0) {
      setDeleteId(0);
      const deleteFun = async () => {
        await axios.post(`http://localhost:5000/deleteTodo/${deleteId}`)
      }
      deleteFun()
      fun()
    }
  }, [deleteId])

  return (
    <>
      <input type="text" onChange={(e) => setText(e.target.value)} />
      <input type="date" onChange={(e) => setDate(e.target.value)} />
      <button onClick={() => clickHander()}>Submit</button>
      <select onChange={(e) => yearHandler(e.target.value)}>
        <option value="Select Year" selected disabled={true}>
          Select Year
        </option>
        {year &&
          year.map((ele, idx) => {
            return <option key={idx}>{ele}</option>;
          })}
      </select>
      {data &&
        data.map((ele) => {
          if (editId === ele._id)
            return (
              <div className="editBox">
                <input type="text" onChange={(e)=> setText(e.target.value)} />
                <button onClick={()=>updateHandler(ele._id)}>Save</button>
              </div>
            );
          return (
            <OutlinedCard
              text={ele.text}
              striked={ele.striked}
              key={ele._id}
              id={ele._id}
              setEditId={setEditId}
              setDeleteId={setDeleteId}
            />
          );
        })}
    </>
  );
}

export default App;
