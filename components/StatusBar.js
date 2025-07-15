// Status bar component for showing application status
import { STATUS_TYPES } from '../utils/constants.js';

const { createElement: h } = React;

export default function StatusBar({ status, message, listInfo, onRetry }) {
    const getStatusIcon = (type) => {
        switch (type) {
            case STATUS_TYPES.LOADING:
                return h('span', {
                    className: 'material-icons animate-spin text-brand-blue'
                }, 'refresh');
            case STATUS_TYPES.SUCCESS:
                return h('span', {
                    className: 'material-icons text-green-600'
                }, 'check_circle');
            case STATUS_TYPES.ERROR:
                return h('span', {
                    className: 'material-icons text-red-600'
                }, 'error');
            default:
                return h('span', {
                    className: 'material-icons text-gray-500'
                }, 'info');
        }
    };

    const getStatusColor = (type) => {
        switch (type) {
            case STATUS_TYPES.LOADING:
                return 'bg-blue-50 border-blue-200';
            case STATUS_TYPES.SUCCESS:
                return 'bg-green-50 border-green-200';
            case STATUS_TYPES.ERROR:
                return 'bg-red-50 border-red-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    return h('div', {
        className: `mb-4 p-3 border rounded-lg shadow-sm ${getStatusColor(status)} fade-in`
    }, [
        h('div', {
            key: 'status-row',
            className: 'flex items-center justify-between'
        }, [
            h('div', {
                className: 'flex items-center'
            }, [
                getStatusIcon(status),
                h('span', {
                    className: 'ml-2 text-sm font-medium'
                }, message)
            ]),
            
            status === STATUS_TYPES.ERROR && onRetry && h('button', {
                className: 'px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors',
                onClick: onRetry
            }, 'Opnieuw proberen')
        ]),
        
        listInfo && h('div', {
            key: 'list-info',
            className: 'mt-2 ml-8 text-xs text-gray-600'
        }, [
            h('div', {}, `Site: ${listInfo.siteUrl}`),
            h('div', {}, `Lijst: ${listInfo.listName} (${listInfo.itemCount} items)`)
        ])
    ]);
}