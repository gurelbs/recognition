/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useEffect } from 'react';
import Footer from './Footer';
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'he-IL';

export default function App() {

  const [isList, setIsList] = useState(false);
  const [note, setNote] = useState(null);
  const [saveNote, setSaveNote] = useState([]);

try {
  const handleListen = () => {
    try {
      if(isList){
        recognition.start();
        recognition.onend = () => {
          console.log(`ממשיך...`);

          setTimeout(() => {
            recognition.start();
          },50)
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
        let current = e.resultIndex;
        let transcript = e.results[current][0].transcript;
        let mobileRepeatBug = (current === 1 && transcript === e.results[0][0].transcript);

        if (!mobileRepeatBug){
          setNote(transcript)
          recognition.onerror = e => console.log(e.error);
          if (transcript === 'מחק' || transcript === ' מחק'){
            setSaveNote([...saveNote]);
          }
        }

      }        
    } catch (error) {
      console.log(error);      
    }
  }
  useEffect(() => {
    handleListen()
  }, [handleListen, isList])

} catch (error) {
  console.log(error);
}

  const handleSaveNote = () => {
    setSaveNote([...saveNote, note]);
    setNote('');
  }

  return (
    <>
  <div className="container-fluid px-0 height-100 bg-dark text-light text-center pt-3">
    <div className="bg-dark text-light px-5 pt-2">
        <h1 className="display-1"><a href="http://gurelbs.github.io/recognition" className="nav-link">MiliM</a></h1>
        <h4 className="font-weight-light mb-2">תמלול בזמן אמת</h4>
          {isList ? <span>&#127908;</span> : <span>&#127908;	&#128308;</span>}
          <div className="row p-5 mx-2">
          <button onClick={() => setIsList(prevState => !prevState)} className="col-xl-5 mb-1 btn btn-outline-danger py-5">הקלטה / עצירה</button>
          <span className="col-2 "></span>
          <button onClick={handleSaveNote } disabled={!note} className="col-xl-5 mb-1 btn btn-outline-success py-5">שמירה</button>
            <p className="col-12 h4 mt-2">{note}</p>
          </div>
      </div>
      <div className="bg-dark text-light px-5 mx-auto ouput-size">
          <h1 className="h3">הטקסט שלך: {note}</h1>
          <div className="form-row justify-content-center pb-3">
            {saveNote.map(n => 
                    <span className="p mt-5 card text-dark" key={n}>{n}&#160;</span>
              )}         
          </div>
      </div>
      <Footer />      
  </div>
    </>
  );
}