import "./App.css";
import axios from "axios"
import react, { useEffect, useState } from "react"
import OutlinedCard from "./card";

function App() {
  const [text, setText] = useState("")
  const [date, setDate] = useState("")
  const [striked, setStriked] = useState(false)
  const [data, setData] = useState([])
  const [year, setYear] = useState([])
  const [queryYear, setQueryYear] = useState("");
  const [queryMonth, setQueryMonth] = useState("")

  const fun = async () => {
    let tmpData = await axios.get(`http://localhost:5000/getTodo?month=${queryMonth}&year=${queryYear}`);
    let tmpYear = await axios.get("http://localhost:5000/getYear")
    setData(tmpData.data.data);
    setYear(tmpYear.data.data[0].distinctYear)
  }

  const clickHander = async () => {
    await axios.post("http://localhost:5000/postTodo", {
      text,
      date,
      striked
    })
    fun()
  }

  const yearHandler = async (year) => {
    setQueryYear(year)
    let tmpData = await axios.get(`http://localhost:5000/getTodo?month=${queryMonth}&year=${year}`);
    setData(tmpData.data.data);
  }

  useEffect(() => {
    fun()
  }, [])
  return (
    <>
      <input type="text" onChange={(e)=>setText(e.target.value)} />
      <input type="date" onChange={(e)=>setDate(e.target.value)}/>
      <button onClick={()=>clickHander()}>Submit</button>
      <select onChange={(e)=> yearHandler(e.target.value)}>
        <option value="Select Year" selected disabled={true}>Select Year</option>
        {year && year.map((ele, idx) => { 
          return ( <option key={idx}>{ele}</option>)
        })}
      </select>
      {data && data.map((ele) => {
        return(<OutlinedCard text={ele.text} striked={ele.striked} key={ele._id} fun={fun} id={ele._id} /> )
      })}
    </>
  );
}

export default App;
