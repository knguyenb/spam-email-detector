import React, {useState} from 'react';

function App() {

    
  const W = [-0.79365074, -1.42862919, -0.64267635,  0.23266496, -1.52451827, -1.52450185,
  0.28884792, -0.52293016,  0.64726848,  1.65930291,  0.65332517,  0.65101311,
  1.35870514, -0.79653738, -0.60817497,  0.55445534, -0.0541138,   1.27296465,
  0.05069324, -0.45358638,  2.42436609,  0.73294102,  1.02624552, -0.46603087,
  0.41433459, -0.50482713, -1.7667433 , -0.2400517 , -1.21638841, -0.90744347,
  -1.21745633 ,  1.23652847 , -0.62924694 , -0.71474333 ,  1.59727459 , -0.44611397,
  0.98359328, -1.18494044, -0.55345637,  0.97159092,  1.51319626,  0.94609796,
  0.6590814,   0.47362599, -0.70379231,  0.05488547,  0.31409091];

  const b = 0.94407526;

  const vocab = [
    "hello", "hope", "doing", "well", "check", "updates", "project", "discussed",
    "congratulations", "won", "free", "trip", "bahamas", "click", "claim", "prize",
    "dear", "customer", "noticed", "unusual", "activity", "account", "please", "log", "verify",
    "hi", "remind", "meeting", "tomorrow", "let", "know", "need", "additional", "information",
    "get", "rich", "quick", "amazing", "investment", "opportunity", "dont", "miss",
    "lifetime", "chance", "make", "money", "fast"
  ];

  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);

  const sigmioid = (x) => {
    return 1/(1+Math.exp(-x));
  };

  const emailToVector = (text) => {
    text = text.toLowerCase().replace(/[^\w\s]/g, '');
    const words = text.split(" ");

    return vocab.map(word => words.includes(word) ? 1 : 0);

  };

  const classifyEmail = () => {
    const vector = emailToVector(email);

    let z = 0;

    for (let i = 0; i < vector.length; i++) {
      z += vector[i] * W[i];
    }
    
    z += b;

    const probability = sigmioid(z);

    const isSpam = probability > 0.5;

    setResult({
      spam: isSpam,
      confidence: isSpam ? probability : 1 - probability
    });

    if (!email) {
      setResult(null);
    }
  };

  return (
    <div style={{ padding: '20px'}}>

      <div className='container'>
        <h1>Email Spam Detector</h1>

        <textarea
          rows="15"
          cols="70"
          placeholder="Enter email text here..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: '10px', padding: '10px', fontSize: '16px' }}
        />

        <br />

        <button id = "checkBtn"onClick = {classifyEmail} style={{ padding: '10px 20px', fontSize: '16px' }}>
          Check Email
        </button>

        {result && (
          <div style={{ marginTop: '20px', fontSize: '18px' }}>
            <h2>{result.spam ? "Spam Detected!" : "Not Spam"}</h2>
            <p className = "result">Confidence: {result.confidence.toFixed(2)}%</p>
          </div>
        )}

      </div>
    </div>


  );




}  

export default App; 