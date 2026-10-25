import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error("PAGE CRASH:", error, info?.componentStack); }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 20, background: "#FFF1D6", borderRadius: 12, color: "#2D2630" }}>
          <h3 style={{ margin: 0 }}>Page error</h3>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 13 }}>{String(this.state.error?.stack || this.state.error)}</pre>
          <button onClick={() => this.setState({ error: null })} style={{ minHeight: 44, padding: "0 16px" }}>Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}
