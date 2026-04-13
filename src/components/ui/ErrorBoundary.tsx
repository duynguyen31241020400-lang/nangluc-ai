"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Lumiq AI render error", error, errorInfo);
  }

  public render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10 text-slate-900">
        <div className="max-w-lg rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-100">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-700">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h2 className="mt-6 text-3xl font-black">Prototype vừa gặp lỗi hiển thị</h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Lumiq AI đang ở chế độ competition prototype, nên cách xử lý nhanh nhất là tải lại màn hình để quay về flow chính.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <RefreshCcw className="h-4 w-4" />
            Tải lại prototype
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
