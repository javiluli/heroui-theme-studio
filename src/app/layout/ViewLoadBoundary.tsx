import { Component, type ReactNode } from "react";

export class ViewLoadBoundary extends Component<{ children: ReactNode; fallback: ReactNode }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
