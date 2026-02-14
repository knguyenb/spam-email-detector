import React, { useState } from "react";
import model from "./model.json";
import "./App.css";

function App() {
  const W = model.weights;
  const b = model.bias;
  const vocab = model.vocabulary;

  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);

  const sigmoid = (x) => {
    return 1 / (1 + Math.exp(-x));
  };

  const emailToVector = (text) => {
    text = text.toLowerCase().replace(/[^\w\s]/g, "");
    const words = text.split(/\s+/);

    const wordCount = {};
    words.forEach((word) => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    return vocab.map((word) => wordCount[word] || 0);
  };

  const classifyEmail = () => {
    if (!email.trim()) {
      setResult(null);
      return;
    }

    const vector = emailToVector(email);

    let z = 0;
    const contributions = [];

    for (let i = 0; i < W.length; i++) {
      const contribution = vector[i] * W[i];

      if (vector[i] > 0) {
        contributions.push({
          word: vocab[i],
          value: contribution,
        });
      }

      z += contribution;
    }

    z += b;

    const probability = sigmoid(z);
    const isSpam = probability > 0.5;

    contributions.sort((a, b) => b.value - a.value);

    const topSpam = contributions
      .filter((item) => item.value > 0)
      .slice(0, 5);

    const topHam = contributions
      .filter((item) => item.value < 0)
      .slice(0, 5);

    setResult({
      spam: isSpam,
      confidence: isSpam ? probability : 1 - probability,
      topSpam,
      topHam,
    });
  };

  return (
    <div className="app">
      <div className="container">
        <h1 style = {{justifyContent:"center", display:"flex", alignItems:"center"}}>Spam Detection System 🤖</h1>

        <p className="subtitle" style = {{margin: "20px 40px"}}>
          Using a simple logistic regression model trained on a bag-of-words representation, this app classifies emails as spam or ham. It also provides insights into which words contributed most to the classification, making it an explainable AI tool for understanding email content.
        </p>

        <textarea
          rows="10"
          margin="20px"
          placeholder="Paste email text here..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button id="checkBtn" onClick={classifyEmail} style={{margin: "5px", justifyContent:"center", display:"flex", alignItems:"center"}}>
          Analyze Email
        </button>

        {result && (
          <div className="result">
            <h2 className={result.spam ? "spam" : "ham"}>
              {result.spam ? "SPAM EMAIL: Spam Detected" : "HAM EMAIL: Legitimate Email"}
            </h2>

            <p className="confidence-text">
              Confidence: {(result.confidence * 100).toFixed(2)}%
            </p>

            <div className="confidence-bar">
              <div
                className={`fill ${result.spam ? "spam-fill" : "ham-fill"}`}
                style={{ width: `${result.confidence * 100}%` }}
              ></div>
            </div>

            {result.topSpam.length > 0 && (
              <div className="indicators">
                <h3>🔍 Top Spam Indicators</h3>
                {result.topSpam.map((item, index) => (
                  <p key={index}>
                    "{item.word}" (+{item.value.toFixed(2)})
                  </p>
                ))}
              </div>
            )}

            {result.topHam.length > 0 && (
              <div className="indicators">
                <h3>🛡 Top Ham Indicators</h3>
                {result.topHam.map((item, index) => (
                  <p key={index}>
                    "{item.word}" ({item.value.toFixed(2)})
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="model-info">
          <p>Model: Logistic Regression</p>
          <p>Vocabulary Size: {vocab.length}</p>
          <p>Feature Engineering: Bag-of-Words</p>
        </div>
      </div>
    </div>
  );
}

export default App;
