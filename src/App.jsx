import './App.css';
import {useEffect, useState} from 'react'

function App() {
  const [feedbacks, setFeedbacks] = useState([])
  const [rate, setRate] = useState(0)
  const [inputVal, setInputVal] = useState('')
  const [selectedPoint, setSelectedPoint] = useState(0)
  const [isEdit, setIsEdit] = useState(false)

  const points = [1,2,3,4,5,6,7,8,9,10]
  useEffect(() => {
    handleFetch()
  }, [])
  
  const handleFetch = () => {
    fetch('http://localhost:3000/api/v1/feedbacks')
    .then((res) => res.json())
    .then((data) => {
      setFeedbacks(data)
      const totalPoints = data.reduce((acc, f) => acc + Number(f.point), 0);
      const newRate = totalPoints/data.length
      setRate(newRate)
    })
    .catch((err) => console.log(err))
  }
  const handleChange = (e) => {
    setInputVal(e.target.value)
  }

  const handleAdd = () => {
    if(!isEdit){
      const newFeedback = {
        content: inputVal,
        point: selectedPoint,
      };
      fetch('http://localhost:3000/api/v1/feedbacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFeedback),
      })
        .then((res) => res.json())
        .then((data) => {
          handleFetch();
          setInputVal(''); 
        })
        .catch((err) => console.log(err));
    }
    }
  
  const handleEdit = (f) => {
    setInputVal(f.content)
    setSelectedPoint(f.point)
    setIsEdit(true)
  }

  const handleDelete = (id) => {
    const confirm = window.confirm('Are you want to delete')
    if(confirm){
      fetch(`http://localhost:3000/api/v1/feedbacks/${id}`, 
    {
      method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
    }
    )
    .then((res) => res.json())
    .then((data) => handleFetch())
    .catch((err) => console.log(err))
    }
  }

  return (
    <div className="App">
      <div className="Navbar">Feedback TA</div>;
      <div className="section-feedback-form container">
        <div className="form-container">
          <h1 className="title">Thầy Phú dạy có hay không????</h1>
          <div className="point-container">
            {points.map((p, i) => (
              <div 
                key={i} 
                className={`point ${p === selectedPoint ? 'active' : ''}`}
                onClick={() => {setSelectedPoint(p)}}
              >{p}</div>
            ))}
          </div>
          <form className="main-form">
            <div className="input-wrapper">
              <input 
              type="text" 
              value={inputVal}
              onChange={handleChange}
              />
              <button onClick={handleAdd}>Send</button>
            </div>
          </form>
        </div>
      </div>
      <div className="section-total-review">
        <div className="total-review-container">
          <span>{feedbacks.length} Reviews</span>
          <span>Average Rating: {rate}</span>
        </div>
      </div>
      <div className="section-feedback-item container">
        <div className="feedback-container">

            {feedbacks.map(f => (
              <div className="feedback-item-container">
                  <p key={f.id} className="feedback-content">{f.content}</p>
                <span className="point">{f.point}</span>
                <div className="action-container">
                  <button onClick={() => handleEdit(f)}>Edit</button>
                  <button onClick={() => handleDelete(f.id)}>Delete</button>
                </div>
              </div>
            ))}

        </div>
      </div>
    </div>
  );
}

export default App;
