import { Component } from "react";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }
    static getDerivedStateFromError(error) {
        return { error };
    }
    render() {
        if (this.state.error) {
            return (
                <div className="flex min-h-screen items-center justify-center bg-obsidian px-6 text-center">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[0.3em] text-neon">
                            WEB CREATOR PY
                        </p>
                        <h1 className="mt-4 font-display text-xl font-bold text-white">
                            Algo salió mal — recarga la página
                        </h1>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
