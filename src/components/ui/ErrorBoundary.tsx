import { Component, type ReactNode } from "react";

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() { return { hasError: true }; }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#05080f] text-[#8FA2B5] text-sm font-mono">
          <div className="text-center space-y-4">
            <p className="text-[#FF4D6D] text-lg">WebGL crashed</p>
            <p>Your browser may not support WebGL or hardware acceleration is off.</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="btn-primary"
            >
              RETRY
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
