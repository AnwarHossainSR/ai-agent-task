import axios from "axios";
import { useState } from "react";

const TodoAIComponent = () => {
  const [prompt, setPrompt] = useState(""); // Store the user's input prompt
  const [response, setResponse] = useState(null); // Store the AI response
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(""); // Store any errors
  const [todos, setTodos] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false); // For displaying error modal

  // Handle sending the prompt to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset the error message
    setResponse(null); // Reset the response

    try {
      const res = await axios.post("http://localhost:3000/ai", { prompt });

      console.log("AI Response:", res.data); // Log the full response to inspect it

      if (res?.data) {
        setResponse(res.data); // Set the AI's response in the state

        // Handle different actions based on the response
        if (res.data.action === "fetched" && Array.isArray(res.data.data)) {
          setTodos(res.data.data); // Set todos for display
        } else if (
          res.data.action === "created" ||
          res.data.action === "updated" ||
          res.data.action === "deleted"
        ) {
          // Handle success messages for create, update, delete
          setTodos([]); // Clear todos if necessary
        } else if (
          res.data.action === "searched" &&
          Array.isArray(res.data.data)
        ) {
          setTodos(res.data.data); // Set search results
        } else if (res.data.action === "stats") {
          // Handle stats response
          setTodos([]); // Clear todos if necessary
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
        // Handle the 503 Service Unavailable error
        setError("The server is currently busy. Please try again later.");
        showErrorModalWithTimeout(
          "The server is currently busy. Please try again later."
        );
      } else {
        // Handle other errors
        setError("An error occurred while processing your request.");
        showErrorModalWithTimeout(
          "An error occurred while processing your request."
        );
      }
    } finally {
      setLoading(false); // Turn off loading spinner
    }
  };

  // Function to show the error modal and auto-hide it after 4 seconds
  const showErrorModalWithTimeout = (errorMessage) => {
    setError(errorMessage);
    setShowErrorModal(true);
    setTimeout(() => {
      setShowErrorModal(false);
    }, 4000); // Hide the error after 4 seconds
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100 p-6">
      {/* Main content */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg z-10">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          <div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-lg">
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

        {/* Conditionally show the todos table */}
        {todos?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-indigo-700">
              All Todos:
            </h3>
            <table className="min-w-full mt-4 border-collapse">
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
      {showErrorModal && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg z-50">
          <h3 className="text-xl font-semibold text-red-500">Error</h3>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
      )}
    </div>
  );
};

export default TodoAIComponent;
