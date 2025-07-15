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
            className: 'hierarchy-icon material-icons'
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
            className: 'flex items-center justify-center space-x-2'
        }, [
            h('button', {
                key: 'edit',
                className: 'p-2 text-brand-blue-600 hover:text-brand-blue-700 hover:bg-brand-blue-50 rounded-lg transition-all duration-200 edit-item-btn transform hover:scale-105',
                onClick: () => onEdit(item),
                title: 'Bewerken'
            }, [
                h('span', {
                    className: 'material-icons text-sm'
                }, 'edit')
            ]),
            
            h('button', {
                key: 'delete',
                className: 'p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 delete-item-btn transform hover:scale-105',
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
            className: `transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-orange-50 ${level > 0 ? 'bg-gray-25' : ''}`
        }, [
            // Order
            h('td', {
                className: 'text-center font-medium text-gray-700'
            }, [
                h('div', {
                    className: 'icon-badge text-sm'
                }, item.VolgordeID || '—')
            ]),
            
            // Title with hierarchy
            h('td', {
                className: `${indentClass}`
            }, [
                h('div', {
                    className: 'flex items-center'
                }, [
                    renderHierarchyIcon(level),
                    h('span', {
                        className: 'font-semibold text-gray-800 text-sm'
                    }, item.Title || 'Naamloos item')
                ])
            ]),
            
            // URL
            h('td', {
                className: 'text-sm'
            }, renderUrlField(item)),
            
            // Parent
            h('td', {
                className: 'text-sm'
            }, renderParentField(item)),
            
            // Icon preview
            h('td', {
                className: 'text-center'
            }, [
                h('div', {
                    className: 'icon-badge icon-badge-orange text-sm'
                }, [
                    h('span', {
                        className: 'material-icons text-sm',
                        title: item.Icon || 'Geen icoon'
                    }, item.Icon || 'chevron_right')
                ])
            ]),
            
            // Icon name
            h('td', {
                className: 'text-sm'
            }, [
                h('span', {
                    className: 'tag-modern'
                }, item.Icon || 'chevron_right')
            ]),
            
            // Actions
            h('td', {
                className: 'text-center'
            }, renderActionButtons(item))
        ]);
    };

    return h('div', {
        className: 'card-modern overflow-hidden'
    }, [
        // Header
        h('div', {
            key: 'header',
            className: 'flex justify-between items-center bg-gradient-to-r from-brand-orange-500 to-brand-orange-600 p-8 text-white'
        }, [
            h('div', {
                className: 'flex items-center space-x-4'
            }, [
                h('div', {
                    className: 'w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm'
                }, [
                    h('span', {
                        className: 'material-icons text-lg text-white'
                    }, 'list')
                ]),
                h('div', {}, [
                    h('h2', {
                        className: 'text-2xl font-bold'
                    }, 'Navigatie Items'),
                    h('p', {
                        className: 'text-sm text-orange-100 mt-1 font-medium'
                    }, 'Beheer uw menu structuur en hiërarchie')
                ])
            ]),
            
            h('div', {
                className: 'flex items-center space-x-4'
            }, [
                h('div', {
                    className: 'bg-white bg-opacity-20 px-4 py-2 rounded-xl backdrop-blur-sm'
                }, [
                    h('span', {
                        className: 'text-sm font-semibold'
                    }, `${items.length} items`)
                ]),
                
                h('button', {
                    className: 'bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2 backdrop-blur-sm',
                    onClick: onRefresh,
                    disabled: isLoading
                }, [
                    h('span', {
                        className: `material-icons text-sm ${isLoading ? 'animate-spin' : ''}`
                    }, 'refresh'),
                    h('span', {
                        className: 'text-sm font-semibold'
                    }, 'Vernieuwen')
                ])
            ])
        ]),
        
        // Table
        h('div', {
            key: 'table-container',
            className: 'overflow-x-auto'
        }, [
            h('table', {
                className: 'min-w-full table-modern'
            }, [
                // Table header
                h('thead', {
                    key: 'thead'
                }, [
                    h('tr', {}, [
                        h('th', {
                            className: 'text-center text-xs font-semibold uppercase tracking-wider'
                        }, 'Volgorde'),
                        
                        h('th', {
                            className: 'text-left text-xs font-semibold uppercase tracking-wider'
                        }, 'Titel'),
                        
                        h('th', {
                            className: 'text-left text-xs font-semibold uppercase tracking-wider'
                        }, 'URL'),
                        
                        h('th', {
                            className: 'text-left text-xs font-semibold uppercase tracking-wider'
                        }, 'Onderliggend aan'),
                        
                        h('th', {
                            className: 'text-center text-xs font-semibold uppercase tracking-wider'
                        }, 'Icoon'),
                        
                        h('th', {
                            className: 'text-left text-xs font-semibold uppercase tracking-wider'
                        }, 'Icoon Naam'),
                        
                        h('th', {
                            className: 'text-center text-xs font-semibold uppercase tracking-wider'
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