// Error Boundary component for React error handling
const { createElement: h } = React;

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error,
            errorInfo
        });
        
        // Log error to console for debugging
        console.error('React Error Boundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return h('div', {
                className: 'min-h-screen flex items-center justify-center bg-gray-50 p-4'
            }, [
                h('div', {
                    key: 'error-card',
                    className: 'max-w-md w-full bg-white border border-red-200 rounded-lg shadow-lg p-6'
                }, [
                    h('div', {
                        key: 'icon',
                        className: 'flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4'
                    }, [
                        h('span', {
                            className: 'material-icons text-red-600 text-2xl'
                        }, 'error')
                    ]),
                    
                    h('h2', {
                        key: 'title',
                        className: 'text-xl font-semibold text-gray-800 text-center mb-2'
                    }, 'Er is een fout opgetreden'),
                    
                    h('p', {
                        key: 'message',
                        className: 'text-gray-600 text-center mb-4'
                    }, 'De applicatie heeft een onverwachte fout ondervonden. Probeer de pagina te vernieuwen.'),
                    
                    // Show error details in development
                    process.env.NODE_ENV === 'development' && h('details', {
                        key: 'details',
                        className: 'mt-4 p-3 bg-gray-50 rounded text-sm'
                    }, [
                        h('summary', {
                            className: 'cursor-pointer font-medium mb-2'
                        }, 'Fout details'),
                        
                        h('pre', {
                            className: 'text-xs text-red-600 whitespace-pre-wrap'
                        }, this.state.error && this.state.error.toString()),
                        
                        h('pre', {
                            className: 'text-xs text-gray-600 whitespace-pre-wrap mt-2'
                        }, this.state.errorInfo && this.state.errorInfo.componentStack)
                    ]),
                    
                    h('div', {
                        key: 'actions',
                        className: 'flex justify-center space-x-3 mt-6'
                    }, [
                        h('button', {
                            className: 'px-4 py-2 bg-brand-blue text-white rounded hover:bg-brand-blue-dark transition-colors',
                            onClick: () => window.location.reload()
                        }, 'Pagina vernieuwen'),
                        
                        h('button', {
                            className: 'px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors',
                            onClick: () => this.setState({ hasError: false, error: null, errorInfo: null })
                        }, 'Probeer opnieuw')
                    ])
                ])
            ]);
        }

        return this.props.children;
    }
}

export default ErrorBoundary;