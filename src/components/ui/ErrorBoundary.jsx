import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#09090b] text-zinc-100 p-4">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-red-500/10 blur-[120px] rounded-full opacity-50"></div>
          </div>

          <div className="z-10 w-full max-w-[400px] rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 text-center backdrop-blur-xl">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <h1 className="mb-2 text-xl font-semibold text-white">
              Something went wrong
            </h1>

            <p className="mb-6 text-sm text-zinc-400">
              An unexpected error occurred. Our team has been notified.
            </p>

            <div className="mb-6 max-h-[200px] overflow-auto rounded bg-zinc-950/50 p-4 text-left text-xs text-red-400 font-mono border border-zinc-800/50">
              {this.state.error && this.state.error.toString()}
            </div>

            <button
              onClick={() => window.location.reload()}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-100 hover:bg-zinc-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
