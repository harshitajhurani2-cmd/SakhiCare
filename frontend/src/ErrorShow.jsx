import React from 'react';
export default class ErrorShow extends React.Component {
  constructor(p) { super(p); this.state = { e: null }; }
  static getDerivedStateFromError(e) { return { e }; }
  render() {
    if (this.state.e) return <pre style={{ whiteSpace: 'pre-wrap', color: '#A12B4B', padding: 16 }}>{String((this.state.e && this.state.e.stack) || this.state.e)}</pre>;
    return this.props.children;
  }
}
