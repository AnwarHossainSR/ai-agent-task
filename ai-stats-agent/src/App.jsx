import axios from "axios";
import { useState } from "react";
import { Chart } from "react-chartjs-2";
import { Button, Card, CardContent } from "./components";

const Dashboard = () => {
  const [query, setQuery] = useState("");
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleQuerySubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/query", // Replace with your backend endpoint
        {
          prompt: query,
        }
      );

      const { data } = response.data;
      console.log(data);

      // Assuming data is in format: { labels: [], datasets: [] }
      setChartData({
        labels: data.labels,
        datasets: data.datasets,
      });
    } catch (err) {
      console.log(err);
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8 space-y-6">
      <h1 className="text-3xl font-extrabold text-gray-800">
        Dynamic Analytic Dashboard
      </h1>

      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <input
            type="text"
            className="border rounded-lg p-3 w-full flex-1 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Ask a question (e.g., last 50 days' order stats)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button onClick={handleQuerySubmit} disabled={loading}>
            {loading ? "Loading..." : "Submit"}
          </Button>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      {chartData && (
        <Card className="w-full max-w-4xl">
          <CardContent>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Query Results
            </h2>
            <Chart
              type="bar" // Change chart type as needed
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "Query Results",
                  },
                },
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
