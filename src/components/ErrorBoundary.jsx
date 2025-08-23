import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Global Error:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, errorMessage: "" });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4">
          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 w-full max-w-md text-center border border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-red-600 mb-4 animate-pulse">
              Something went wrong 😢
            </h2>
            <p className="text-gray-700 mb-6 break-words text-sm sm:text-base">
              {this.state.errorMessage}
            </p>
            <button
              onClick={this.handleReload}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-md transition transform hover:scale-105 w-full sm:w-auto"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

