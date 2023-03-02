import "./App.css";
import axios from "axios"
import react, { useEffect, useState } from "react"
import OutlinedCard from "./card";

function App() {
  const [text, setText] = useState("")
  const [date, setDate] = useState("")
  const [striked, setStriked] = useState(false)
  const [data, setData] = useState([])

  const fun = async () => {
    let tmpData = await axios.get("http://localhost:5000/getTodo");
    setData(tmpData.data.data);
  }

  const clickHander = async () => {
    await axios.post("http://localhost:5000/postTodo", {
      text,
      date,
      striked
    })
    fun()
  }

  useEffect(() => {
    fun()
  }, [])
  return (
    <>
      <input type="text" onChange={(e)=>setText(e.target.value)} />
      <input type="date" onChange={(e)=>setDate(e.target.value)}/>
      <button onClick={()=>clickHander()}>Submit</button>

      {data && data.map((ele) => {
        return(<OutlinedCard text={ele.text} striked={ele.striked}/> )
      })}
    </>
  );
}

export default App;
