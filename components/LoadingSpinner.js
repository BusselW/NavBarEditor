// Loading spinner components
const { createElement: h } = React;

export default function LoadingSpinner({ size = 'md', text = 'Laden...', className = '' }) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12'
    };

    return h('div', {
        className: `flex flex-col items-center justify-center ${className}`
    }, [
        h('span', {
            key: 'spinner',
            className: `material-icons animate-spin text-brand-blue ${sizeClasses[size]} mb-2`
        }, 'refresh'),
        
        text && h('span', {
            key: 'text',
            className: 'text-gray-600 text-sm'
        }, text)
    ].filter(Boolean));
}

export function TableLoadingSpinner({ colSpan = 1, text = 'Items laden...' }) {
    return h('tr', {
        key: 'loading-row'
    }, [
        h('td', {
            colSpan,
            className: 'text-center py-8 text-gray-500'
        }, [
            h(LoadingSpinner, {
                text,
                className: 'py-4'
            })
        ])
    ]);
}

export function FullPageLoader({ text = 'Applicatie laden...' }) {
    return h('div', {
        className: 'min-h-screen flex items-center justify-center bg-gray-50'
    }, [
        h('div', {
            key: 'loader-content',
            className: 'text-center'
        }, [
            h(LoadingSpinner, {
                key: 'spinner',
                size: 'xl',
                text,
                className: 'mb-4'
            }),
            
            h('p', {
                key: 'subtitle',
                className: 'text-gray-500 text-sm'
            }, 'Een moment geduld...')
        ])
    ]);
}