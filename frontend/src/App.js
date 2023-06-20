import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Swal from "sweetalert2";

const App = () => {
  const [file, setFile] = useState();
  const [fileContent, setFileContent] = useState();
  const [filesList, setFilesList] = useState();

  useEffect(() => {
    let ignore = false;

    if (!ignore) getFilesList();
    return () => {
      ignore = true;
    };
  }, []);

  const handleChange = (event) => {
    setFile(event.target.value);
    setFileContent(event.target.files[0]);
  };

  const getFilesList = async () => {
    await axios({
      method: "get",
      url: "https://ti28z9r6c8.execute-api.us-east-1.amazonaws.com/dev/files",
    }).then((data) => {
      setFilesList(data);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    Swal.fire({
      title: "Subiendo archivo",
      html: "Espere por favor",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const data = await axios({
      method: "post",
      url: "https://ti28z9r6c8.execute-api.us-east-1.amazonaws.com/dev/upload",
      data: {
        filename: file.split("\\").pop(),
      },
    }).then((res) => res);

    const form = new FormData();
    Object.keys(data.data.fields).forEach((key) => {
      form.append(key, data.data.fields[key]);
    });
    form.append("file", fileContent);

    await axios({
      method: "post",
      url: data.data.url,
      data: form,
    }).then(() => {
      getFilesList();
    });

    Swal.close();

    Swal.fire({
      icon: "success",
      title: "Archivo subido con éxito",
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
        <h1>Archivos subidos</h1>
        <table>
          {filesList
            ? filesList.data.map((f) => (
                <tr>
                  <td>{f.Key}</td>
                  <td>{f.Size}</td>
                  <td>
                    <button
                      onClick={async () => {
                        await axios({
                          method: "get",
                          url:
                            "https://ti28z9r6c8.execute-api.us-east-1.amazonaws.com/dev/download/" +
                            f.Key,
                        }).then(async (response) => {
                          window.open(response.data, "_blank");
                        });
                      }}
                    >
                      Descargar
                    </button>
                  </td>
                </tr>
              ))
            : ""}
        </table>
      </header>
    </div>
  );
};

export default App;
