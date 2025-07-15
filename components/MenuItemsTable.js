// Menu items table component with hierarchy support
import { TableLoadingSpinner } from './LoadingSpinner.js';
import { getHierarchyLevel } from '../utils/helpers.js';

const { createElement: h } = React;

export default function MenuItemsTable({ 
    items = [], 
    isLoading = false, 
    onEdit, 
    onDelete, 
    onRefresh 
}) {
    const renderHierarchyIcon = (level) => {
        if (level === 0) return null;
        
        const icons = ['', 'subdirectory_arrow_right', 'subdirectory_arrow_right', 'subdirectory_arrow_right'];
        return h('span', {
            className: 'material-icons text-brand-orange mr-2 text-sm'
        }, icons[Math.min(level, 3)]);
    };

    const renderUrlField = (item) => {
        if (!item.URL) return h('span', { className: 'text-gray-400 italic' }, 'Geen link');
        
        const url = typeof item.URL === 'object' ? item.URL.Url : item.URL;
        if (!url) return h('span', { className: 'text-gray-400 italic' }, 'Geen link');
        
        return h('a', {
            href: url,
            target: '_blank',
            rel: 'noopener noreferrer',
            className: 'text-brand-blue hover:text-brand-blue-dark underline truncate max-w-xs inline-block',
            title: url
        }, url);
    };

    const renderParentField = (item) => {
        // Check both possible parent fields
        const parentId = item.ParentID1 || item.ParentID;
        if (!parentId) return h('span', { className: 'text-gray-400 italic' }, 'Hoofdniveau');
        
        const parent = items.find(i => i.Id === parentId);
        if (!parent) return h('span', { className: 'text-gray-400 italic' }, 'Onbekend');
        
        return h('span', {
            className: 'text-gray-700'
        }, parent.Title || 'Naamloos');
    };

    const renderActionButtons = (item) => {
        return h('div', {
            className: 'flex items-center space-x-2'
        }, [
            h('button', {
                key: 'edit',
                className: 'p-1 text-brand-blue hover:text-brand-blue-dark hover:bg-blue-50 rounded transition-colors edit-item-btn',
                onClick: () => onEdit(item),
                title: 'Bewerken'
            }, [
                h('span', {
                    className: 'material-icons text-sm'
                }, 'edit')
            ]),
            
            h('button', {
                key: 'delete',
                className: 'p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors delete-item-btn',
                onClick: () => onDelete(item),
                title: 'Verwijderen'
            }, [
                h('span', {
                    className: 'material-icons text-sm'
                }, 'delete')
            ])
        ]);
    };

    const renderTableRow = (item) => {
        const level = getHierarchyLevel(item, items);
        const indentClass = level > 0 ? `hierarchy-indent-${Math.min(level, 3)}` : '';
        
        return h('tr', {
            key: item.Id,
            className: `hover:bg-gray-50 transition-colors ${level > 0 ? 'bg-gray-25' : ''}`
        }, [
            // Order
            h('td', {
                className: 'text-center py-3 px-4 border-b border-gray-200'
            }, item.VolgordeID || '—'),
            
            // Title with hierarchy
            h('td', {
                className: `py-3 px-4 border-b border-gray-200 ${indentClass}`
            }, [
                h('div', {
                    className: 'flex items-center'
                }, [
                    renderHierarchyIcon(level),
                    h('span', {
                        className: 'font-medium text-gray-800'
                    }, item.Title || 'Naamloos item')
                ])
            ]),
            
            // URL
            h('td', {
                className: 'py-3 px-4 border-b border-gray-200'
            }, renderUrlField(item)),
            
            // Parent
            h('td', {
                className: 'py-3 px-4 border-b border-gray-200'
            }, renderParentField(item)),
            
            // Icon preview
            h('td', {
                className: 'text-center py-3 px-4 border-b border-gray-200'
            }, [
                h('span', {
                    className: 'material-icons text-gray-600',
                    title: item.Icon || 'Geen icoon'
                }, item.Icon || 'chevron_right')
            ]),
            
            // Icon name
            h('td', {
                className: 'py-3 px-4 border-b border-gray-200'
            }, [
                h('code', {
                    className: 'text-sm bg-gray-100 px-2 py-1 rounded'
                }, item.Icon || 'chevron_right')
            ]),
            
            // Actions
            h('td', {
                className: 'text-center py-3 px-4 border-b border-gray-200'
            }, renderActionButtons(item))
        ]);
    };

    return h('div', {
        className: 'bg-white border border-gray-200 rounded-lg shadow-md'
    }, [
        // Header
        h('div', {
            key: 'header',
            className: 'flex justify-between items-center border-b border-gray-200 bg-brand-orange p-4'
        }, [
            h('h2', {
                className: 'text-lg font-semibold text-white'
            }, 'Navigatie Items'),
            
            h('div', {
                className: 'flex items-center space-x-3'
            }, [
                h('span', {
                    className: 'text-white text-sm'
                }, `${items.length} items`),
                
                h('button', {
                    className: 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-1 rounded transition-colors',
                    onClick: onRefresh,
                    disabled: isLoading
                }, [
                    h('span', {
                        className: `material-icons text-sm ${isLoading ? 'animate-spin' : ''}`
                    }, 'refresh')
                ])
            ])
        ]),
        
        // Table
        h('div', {
            key: 'table-container',
            className: 'overflow-x-auto'
        }, [
            h('table', {
                className: 'min-w-full'
            }, [
                // Table header
                h('thead', {
                    key: 'thead',
                    className: 'bg-brand-blue-dark'
                }, [
                    h('tr', {}, [
                        h('th', {
                            className: 'text-center text-xs font-medium text-white uppercase tracking-wider py-3 px-4 border-b border-black'
                        }, 'Volgorde'),
                        
                        h('th', {
                            className: 'text-left text-xs font-medium text-white uppercase tracking-wider py-3 px-4 border-b border-black'
                        }, 'Titel'),
                        
                        h('th', {
                            className: 'text-left text-xs font-medium text-white uppercase tracking-wider py-3 px-4 border-b border-black'
                        }, 'URL'),
                        
                        h('th', {
                            className: 'text-left text-xs font-medium text-white uppercase tracking-wider py-3 px-4 border-b border-black'
                        }, 'Onderliggend aan'),
                        
                        h('th', {
                            className: 'text-center text-xs font-medium text-white uppercase tracking-wider py-3 px-4 border-b border-black'
                        }, 'Icoon'),
                        
                        h('th', {
                            className: 'text-left text-xs font-medium text-white uppercase tracking-wider py-3 px-4 border-b border-black'
                        }, 'Icoon Naam'),
                        
                        h('th', {
                            className: 'text-center text-xs font-medium text-white uppercase tracking-wider py-3 px-4 border-b border-black'
                        }, 'Acties')
                    ])
                ]),
                
                // Table body
                h('tbody', {
                    key: 'tbody',
                    className: 'bg-white divide-y divide-gray-200'
                }, [
                    isLoading ? h(TableLoadingSpinner, {
                        key: 'loading',
                        colSpan: 7,
                        text: 'Menu items laden...'
                    }) : (
                        items.length === 0 ? h('tr', {
                            key: 'empty'
                        }, [
                            h('td', {
                                colSpan: 7,
                                className: 'text-center py-8 text-gray-500'
                            }, [
                                h('div', {
                                    className: 'flex flex-col items-center'
                                }, [
                                    h('span', {
                                        className: 'material-icons text-4xl text-gray-300 mb-2'
                                    }, 'inbox'),
                                    h('span', {}, 'Geen menu items gevonden')
                                ])
                            ])
                        ]) : items.map(renderTableRow)
                    )
                ])
            ])
        ])
    ]);
}