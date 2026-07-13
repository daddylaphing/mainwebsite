"use client";

import { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#161616] border border-white/[0.08] rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-[#6E1D25]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-8 w-8 text-[#E7B52C]" />
            </div>
            
            <h3 
              className="text-[#F8F5EE] font-bold text-xl mb-3"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Something went wrong
            </h3>
            
            <p 
              className="text-[#C7BFB3] text-sm mb-6 leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              We encountered an error while loading this section. Please try refreshing the page.
            </p>

            <button
              onClick={() => {
                this.setState({ hasError: false, error: undefined });
                window.location.reload();
              }}
              className="inline-flex items-center gap-2 bg-[#E7B52C] text-black font-bold px-6 py-3 rounded-[14px] hover:bg-[#F4C542] hover:shadow-[0_8px_20px_rgba(231,181,44,0.3)] transition-all duration-300"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
