"use client"; // Mark this as a Client Component
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [todos, setTodos] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResponse(null);
    try {
      const res = await axios.post("/api/ai", { prompt });
      console.log("AI Response:", res.data);
      if (res?.data) {
        setResponse(res.data);
        if (res.data.action === "fetched" && Array.isArray(res.data.data)) {
          setTodos(res.data.data);
        } else if (
          res.data.action === "created" ||
          res.data.action === "updated" ||
          res.data.action === "deleted"
        ) {
          setTodos([]);
        } else if (
          res.data.action === "searched" &&
          Array.isArray(res.data.data)
        ) {
          setTodos(res.data.data);
        } else if (res.data.action === "stats") {
          setTodos([]);
        } else {
          setError("Unexpected response format.");
          showErrorModalWithTimeout("Unexpected response format.");
        }
      } else {
        setError("Unexpected response from the server.");
        showErrorModalWithTimeout("Unexpected response from the server.");
      }
    } catch (err) {
      console.log("err", err);
      if (err.response && err.response.status === 503) {
        setError("The server is currently busy. Please try again later.");
        showErrorModalWithTimeout(
          "The server is currently busy. Please try again later."
        );
      } else {
        setError("An error occurred while processing your request.");
        showErrorModalWithTimeout(
          "An error occurred while processing your request."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const showErrorModalWithTimeout = (errorMessage) => {
    setError(errorMessage);
    setShowErrorModal(true);
    setTimeout(() => {
      setShowErrorModal(false);
    }, 4000);
  };

  // Ensure the error modal is only rendered on the client side
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-white p-6">
      {/* Backdrop Blur for Error Modal */}
      {isClient && showErrorModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
          onClick={(e) => e.stopPropagation()} // Prevent clicks on the backdrop
        ></div>
      )}

      {/* Main content */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg z-50 relative">
        <h1 className="text-3xl font-semibold text-center text-indigo-600 mb-6">
          Todo AI Assistant
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask something like: 'Create a todo', 'Get all todos', 'Get stats', etc."
              rows="6"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-800" // Fixed text color
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 text-white font-semibold rounded-lg focus:outline-none ${
              loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Processing..." : "Submit"}
          </button>
        </form>
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-indigo-700">
            AI Response:
          </h3>
          <div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
            {" "}
            {/* Fixed text color */}
            {response ? (
              <div>
                <strong>Action: </strong>
                {response.action}
                <br />
                {response.action === "stats" && (
                  <div>
                    <strong>Stats: </strong>
                    {response.data.count}
                  </div>
                )}
                {(response.action === "created" ||
                  response.action === "updated" ||
                  response.action === "deleted") && (
                  <div>
                    <strong>Message: </strong>
                    {response.data}
                  </div>
                )}
              </div>
            ) : (
              "Waiting for response..."
            )}
          </div>
        </div>
        {todos?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-indigo-700">
              All Todos:
            </h3>
            <table className="min-w-full mt-4 border-collapse text-gray-800">
              {" "}
              {/* Fixed text color */}
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left border-b">ID</th>
                  <th className="px-4 py-2 text-left border-b">Todo</th>
                  <th className="px-4 py-2 text-left border-b">Created At</th>
                  <th className="px-4 py-2 text-left border-b">Updated At</th>
                </tr>
              </thead>
              <tbody>
                {todos?.map((todo) => (
                  <tr key={todo.id}>
                    <td className="px-4 py-2 border-b">{todo?.id}</td>
                    <td className="px-4 py-2 border-b">{todo?.todo}</td>
                    <td className="px-4 py-2 border-b">{todo?.createdAt}</td>
                    <td className="px-4 py-2 border-b">{todo?.updatedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Error Popup */}
      {isClient && showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center"
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
          >
            <h3 className="text-xl font-semibold text-red-500">Error</h3>
            <p className="mt-2 text-gray-800">{error}</p>{" "}
          </div>
        </div>
      )}
    </div>
  );
}
