import React, { useState, useEffect } from 'react';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();


recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'he-IL'
function App() {

  const [isList, setIsList] = useState(false);
  const [note, setNote] = useState(null);
  const [saveNote, setSaveNote] = useState([]);


try {
  useEffect(() => {
    handleListen()
  }, [isList])

  const handleListen = () => {
    try {
      if(isList){
        recognition.start();
        recognition.onend = () => {
          console.log(`ממשיך...`);
          recognition.start();
        }
      } else {
        recognition.stop();
        recognition.onend = () => {
          console.log(`מפסיק`);
        }
      }
      recognition.onstart = () => {
        console.log(`מיקרופון פועל`);
      }
      recognition.onresult = e => {
        const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
        console.log(transcript);
        setNote(transcript)
        recognition.onerror = e => console.log(e.error);
      }        
    } catch (error) {
      console.log(error);      
    }
  }
} catch (error) {
  console.log(error);
}

  const handleSaveNote = () => {
    setSaveNote([...saveNote, note]);
    setNote('');
  }

  return (
    <>
  <div className="container-fluid height-100 bg-dark text-light text-center pt-3">
    <div className="bg-dark text-light px-5 pt-2">
        <h1 className="h1">תמלול בזמן אמת</h1>
          {isList ? <span>&#127908;</span> : <span>&#127908;	&#128308;</span>}
          <div className="row p-2">
          <button onClick={() => setIsList(prevState => !prevState)} className="col m-1 btn btn-outline-danger">הקלטה/עצירה</button>
          <button onClick={handleSaveNote } disabled={!note} className="col m-1 btn btn-outline-success">שמירה</button>
            <p className="col-12">{note}</p>
          </div>
      </div>
      <div className="bg-dark text-light px-5 pt-2 mt-3 mx-auto">
        <h1 className="h1">פלט</h1>
          <div className="form-row justify-content-center pb-3">
            {saveNote.map(n => 
                    <span className="p card text-dark" key={n}>{n}&#160;</span>
              )}         
          </div>
      </div>
      
  </div>
    </>
  );
}

export default App;
