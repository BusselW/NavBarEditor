// Main application component
import ErrorBoundary from './components/ErrorBoundary.js';
import { FullPageLoader } from './components/LoadingSpinner.js';
import StatusBar from './components/StatusBar.js';
import MenuItemsTable from './components/MenuItemsTable.js';
import MenuItemForm from './components/MenuItemForm.js';
import sharepointService from './services/sharepointService.js';
import menuService from './services/menuService.js';
import { STATUS_TYPES, SHAREPOINT_CONFIG } from './utils/constants.js';
import { getUrlParams, detectSiteUrl, formatError } from './utils/helpers.js';

const { createElement: h, useState, useEffect, useCallback } = React;

function NavbarEditor() {
    // State management
    const [status, setStatus] = useState(STATUS_TYPES.LOADING);
    const [statusMessage, setStatusMessage] = useState('Applicatie initialiseren...');
    const [listInfo, setListInfo] = useState(null);
    const [menuData, setMenuData] = useState({
        items: [],
        hierarchy: [],
        parentField: null,
        flatItems: []
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [availableParents, setAvailableParents] = useState([]);

    // Initialize application
    useEffect(() => {
        initializeApp();
    }, []);

    const initializeApp = async () => {
        try {
            setStatus(STATUS_TYPES.LOADING);
            setStatusMessage('Parameters valideren...');

            const params = getUrlParams();
            const siteUrl = detectSiteUrl();

            if (!params.listGuid) {
                throw new Error('Geen lijst GUID gevonden in URL parameters');
            }

            if (!siteUrl) {
                throw new Error('Kon site URL niet detecteren');
            }

            setStatusMessage('Lijstinformatie ophalen...');
            const listData = await sharepointService.getList(siteUrl, params.listGuid);
            
            setListInfo({
                siteUrl,
                listGuid: params.listGuid,
                listName: listData.title,
                entityType: listData.entityType,
                itemCount: listData.itemCount
            });

            setStatusMessage('Menu items laden...');
            await loadMenuItems(siteUrl, params.listGuid);

            setStatus(STATUS_TYPES.SUCCESS);
            setStatusMessage('Applicatie geladen');
        } catch (error) {
            console.error('Initialization error:', error);
            setStatus(STATUS_TYPES.ERROR);
            setStatusMessage(formatError(error));
        }
    };

    const loadMenuItems = async (siteUrl = listInfo?.siteUrl, listGuid = listInfo?.listGuid) => {
        if (!siteUrl || !listGuid) return;

        setIsLoading(true);
        try {
            const data = await menuService.getMenuItems(siteUrl, listGuid, true);
            setMenuData(data);
            
            // Update available parents for form
            const parents = menuService.getAvailableParents(data.items, null, data.parentField);
            setAvailableParents(parents);
            
        } catch (error) {
            console.error('Error loading menu items:', error);
            setStatus(STATUS_TYPES.ERROR);
            setStatusMessage(formatError(error));
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateItem = () => {
        setEditingItem(null);
        setShowForm(true);
    };

    const handleEditItem = (item) => {
        setEditingItem(item);
        setShowForm(true);
    };

    const handleDeleteItem = async (item) => {
        const confirmed = confirm(`Weet je zeker dat je "${item.Title}" wilt verwijderen?`);
        if (!confirmed) return;

        try {
            setIsLoading(true);
            await menuService.deleteMenuItem(listInfo.siteUrl, listInfo.listGuid, item.Id);
            await loadMenuItems();
            setStatus(STATUS_TYPES.SUCCESS);
            setStatusMessage('Menu item verwijderd');
        } catch (error) {
            console.error('Error deleting item:', error);
            setStatus(STATUS_TYPES.ERROR);
            setStatusMessage(formatError(error));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveItem = async (formData) => {
        try {
            setIsLoading(true);
            
            if (editingItem) {
                await menuService.updateMenuItem(
                    listInfo.siteUrl,
                    listInfo.listGuid,
                    editingItem.Id,
                    formData,
                    listInfo.entityType,
                    menuData.parentField
                );
                setStatusMessage('Menu item bijgewerkt');
            } else {
                await menuService.createMenuItem(
                    listInfo.siteUrl,
                    listInfo.listGuid,
                    formData,
                    listInfo.entityType,
                    menuData.parentField
                );
                setStatusMessage('Menu item aangemaakt');
            }
            
            await loadMenuItems();
            setShowForm(false);
            setEditingItem(null);
            setStatus(STATUS_TYPES.SUCCESS);
            
        } catch (error) {
            console.error('Error saving item:', error);
            setStatus(STATUS_TYPES.ERROR);
            setStatusMessage(formatError(error));
            throw error; // Re-throw to prevent form from closing
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingItem(null);
    };

    const handleRetry = () => {
        initializeApp();
    };

    // Show full page loader during initialization
    if (status === STATUS_TYPES.LOADING && !listInfo) {
        return h(FullPageLoader, {
            text: statusMessage
        });
    }

    return h('div', {
        className: 'min-h-screen bg-gray-50'
    }, [
        // Header
        h('header', {
            key: 'header',
            className: 'sticky top-0 z-40 bg-gradient-to-r from-brand-blue to-brand-blue-dark text-white shadow-md'
        }, [
            h('div', {
                className: 'px-4 py-3 flex justify-between items-center'
            }, [
                h('div', {
                    className: 'flex items-center space-x-2'
                }, [
                    h('span', {
                        className: 'material-icons'
                    }, 'edit'),
                    h('h1', {
                        className: 'text-xl font-bold'
                    }, 'Navigatie Menu Editor')
                ]),
                
                h('div', {
                    className: 'flex items-center space-x-2'
                }, [
                    h('a', {
                        href: `${SHAREPOINT_CONFIG.MENU_PATH}`,
                        className: 'hover:bg-white/20 px-3 py-1 rounded transition-colors text-sm flex items-center'
                    }, [
                        h('span', {
                            className: 'material-icons mr-1 text-sm'
                        }, 'arrow_back'),
                        'Terug naar Menu'
                    ])
                ])
            ])
        ]),
        
        // Main content
        h('main', {
            key: 'main',
            className: 'max-w-7xl mx-auto p-4'
        }, [
            // Status bar
            h(StatusBar, {
                key: 'status',
                status,
                message: statusMessage,
                listInfo,
                onRetry: handleRetry
            }),
            
            // Action bar
            h('div', {
                key: 'actions',
                className: 'mb-6 flex justify-between items-center'
            }, [
                h('div', {
                    className: 'flex items-center space-x-4'
                }, [
                    h('button', {
                        className: 'bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center space-x-2 transition-colors',
                        onClick: handleCreateItem,
                        disabled: isLoading || status === STATUS_TYPES.ERROR
                    }, [
                        h('span', {
                            className: 'material-icons text-sm'
                        }, 'add'),
                        h('span', {}, 'Nieuw Item')
                    ])
                ]),
                
                h('button', {
                    className: 'bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded flex items-center space-x-2 transition-colors',
                    onClick: () => loadMenuItems(),
                    disabled: isLoading
                }, [
                    h('span', {
                        className: `material-icons text-sm ${isLoading ? 'animate-spin' : ''}`
                    }, 'refresh'),
                    h('span', {}, 'Vernieuwen')
                ])
            ]),
            
            // Menu items table
            h(MenuItemsTable, {
                key: 'table',
                items: menuData.flatItems,
                isLoading,
                onEdit: handleEditItem,
                onDelete: handleDeleteItem,
                onRefresh: () => loadMenuItems()
            })
        ]),
        
        // Form modal
        showForm && h(MenuItemForm, {
            key: 'form',
            item: editingItem,
            availableParents: menuService.getAvailableParents(menuData.items, editingItem?.Id, menuData.parentField),
            onSave: handleSaveItem,
            onCancel: handleFormCancel,
            onDelete: editingItem ? () => handleDeleteItem(editingItem) : null,
            isLoading
        })
    ]);
}

// Application bootstrap
function App() {
    return h(ErrorBoundary, {}, [
        h(NavbarEditor, { key: 'navbar-editor' })
    ]);
}

// Initialize React app
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('app-root');
    const root = ReactDOM.createRoot(container);
    root.render(h(App));
});

export default App;