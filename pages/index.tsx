import { useState } from "react";

const Home = () => {
  const [id, setId] = useState("");
  const [data, setData] = useState("");

  const handlePost = async () => {
    const res = await fetch("/api/dynamo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, data }),
    });
    const result = await res.json();
    console.log(result);
  };

  const handleGet = async () => {
    const res = await fetch(`/api/dynamo?id=${id}`);
    const result = await res.json();
    console.log(result);
  };

  return (
    <div>
      <h1>DynamoDB CRUD</h1>
      <input value={id} onChange={(e) => setId(e.target.value)} placeholder="ID" />
      <input value={data} onChange={(e) => setData(e.target.value)} placeholder="Data" />
      <button onClick={handlePost}>Add/Update</button>
      <button onClick={handleGet}>Get</button>
    </div>
  );
};

export default Home;
