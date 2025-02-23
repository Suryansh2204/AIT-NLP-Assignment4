import { useState } from "react";
import "./Home.css";
import Loader from "../../components/Loader/Loader";
import ProbabilityChart from "../../components/Charts/Chart";

type responseResult = {
  predicted_class: string;
  class_probabilities: number[];
};
const Home = () => {
  // state to store the user input for the prompt
  const [premise, setPremise] = useState<string>("");
  const [hypothesis, setHypothesis] = useState<string>("");

  // state to store the error message
  const [error, setError] = useState("");
  // state to store the loading state
  const [loading, setLoading] = useState(false);
  // state to store the result
  const [result, setResult] = useState<responseResult | null>(null);

  // Joins the array of strings with proper spacing

  // Function validates input and fetch the data from the server and update the state
  const handleSubmit = async () => {
    setError("");
    setResult(null);
    setLoading(true);

    if (premise === "" || premise === null) {
      setError("Please enter a valid prompt");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/infer?premise=${premise.trim()}&hypothesis=${hypothesis.trim()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const res = await response.json();
        if (res.error) {
          setError(res.error);
        } else {
          console.log(res);
          setResult(res.result);
        }
      }
    } catch (error) {
      if (error) console.error("Error:", error);
      setError("Something went wrong. Please try again later.");
    }
    setLoading(false);
  };

  return (
    <>
      {loading && (
        <div
          className="home-loader"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <Loader />
        </div>
      )}
      <div className="home">
        <h1 className="home-heading">
          Infer
          <span
            style={{
              fontSize: "5rem",
              color: "#bd1717",
            }}
          >
            X
          </span>
        </h1>
        <div className="home-search-container">
          <div className="home-search-text">
            <div className="home-search-label">
              <label htmlFor="premise">Premise </label>
              <label htmlFor="hypothesis">Hypothesis </label>
            </div>
            <div className="home-search-field">
              <input
                type="text"
                value={premise}
                onChange={(e) => setPremise(e.target.value)}
                placeholder="Enter a premise"
                className="home-search-input"
                id="premise"
                required
              />
              <input
                type="text"
                value={hypothesis}
                onChange={(e) => setHypothesis(e.target.value)}
                placeholder="Enter a hypothesis"
                className="home-search-input"
                id="hypothesis"
                required
              />
            </div>
          </div>
        </div>
        <button className="button" onClick={handleSubmit}>
          Test
        </button>
        {result && (
          <div style={{ marginTop: "2rem" }}>
            <h1>Predicted Class: {result.predicted_class}</h1>
            <div style={{ height: "600px", width: "700px" }}>
              <ProbabilityChart probabilities={result.class_probabilities} />
            </div>
          </div>
        )}

        {error && <div className="home-search-error">* {error}</div>}
      </div>
    </>
  );
};

export default Home;
