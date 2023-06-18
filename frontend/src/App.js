import { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [file, setFile] = useState();

  const handleChange = (event) => {
    setFile(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    axios({
      method: "post",
      url: "https://ti28z9r6c8.execute-api.us-east-1.amazonaws.com/dev/upload",
      data: {
        filename: file.split("\\").pop(),
      },
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleSubmit}>
          <label>
            <input type="file" value={file} onChange={handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </header>
    </div>
  );
};

export default App;
