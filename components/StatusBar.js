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
        className: `status-bar fade-in ${getStatusColor(status)}`
    }, [
        h('div', {
            key: 'status-row',
            className: 'flex items-center justify-between'
        }, [
            h('div', {
                className: 'flex items-center space-x-3'
            }, [
                getStatusIcon(status),
                h('div', {}, [
                    h('span', {
                        className: 'text-sm font-semibold text-gray-800'
                    }, message),
                    listInfo && h('div', {
                        key: 'list-info',
                        className: 'text-xs text-gray-600 mt-1'
                    }, [
                        h('div', {
                            key: 'site-url'
                        }, `📍 ${listInfo.siteUrl}`),
                        h('div', {
                            key: 'list-name'
                        }, `📋 ${listInfo.listName} • ${listInfo.itemCount} items`)
                    ])
                ])
            ]),
            
            status === STATUS_TYPES.ERROR && onRetry && h('button', {
                className: 'btn-modern bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 text-sm',
                onClick: onRetry
            }, [
                h('span', {
                    className: 'material-icons text-sm mr-1'
                }, 'refresh'),
                'Opnieuw proberen'
            ])
        ])
    ]);
}