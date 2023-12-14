import { useState, useEffect } from "react";
import Data from "./historical_prices.csv";
import Papa from "papaparse";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(Data);
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder("utf-8");
      const csvData = decoder.decode(result.value);
      const parsedData = Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
      }).data;
      setData(parsedData);
    };
    fetchData();
  }, []);

  const filterData = () => {
    if (fromDate && toDate) {
      const filteredData = data.filter((row) => {
        const rowDate = new Date(row.date);
        return rowDate >= new Date(fromDate) && rowDate <= new Date(toDate);
      });
      return filteredData;
    }
    return data;
  };

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

  const filteredData = filterData();

  return (
    <div className="App">
      <h2>CSV Data</h2>
      <div className="date-filter">
        <label htmlFor="fromDate">From: </label>
        <input
          type="date"
          id="fromDate"
          value={fromDate}
          onChange={handleFromDateChange}
        />
        &nbsp; &nbsp; &nbsp;
        <label htmlFor="toDate">To: </label>
        <input
          type="date"
          id="toDate"
          value={toDate}
          onChange={handleToDateChange}
        />
      </div>
      {filteredData.length ? (
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Sl_No</th>
              <th>Date</th>
              <th>Price</th>
              <th>Instrument_Name</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index}>
                <td>{row.slno}</td>
                <td>{row.date}</td>
                <td>{row.price}</td>
                <td>{row.instrument_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  );
}

export default App;
