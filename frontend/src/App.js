import { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [file, setFile] = useState();
  const [fileContent, setFileContent] = useState();

  const handleChange = (event) => {
    setFile(event.target.value);
    setFileContent(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = await axios({
      method: "post",
      url: "https://ti28z9r6c8.execute-api.us-east-1.amazonaws.com/dev/upload",
      data: {
        filename: file.split("\\").pop(),
      },
    }).then((res) => res);
    console.log("data => ", data);
    console.log("file => ", file);
    console.log("fileContent => ", fileContent);

    const form = new FormData();
    Object.keys(data.data.fields).forEach((key) => {
      form.append(key, data.data.fields[key]);
    });
    form.append("file", fileContent);

    await axios({
      method: "post",
      url: data.data.url,
      data: form,
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
