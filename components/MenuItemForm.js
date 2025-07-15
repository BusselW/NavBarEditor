// Menu item form component for creating/editing menu items
import { IconSelector } from './IconPicker.js';
import { MENU_ITEM_DEFAULTS } from '../utils/constants.js';

const { createElement: h, useState, useEffect } = React;

export default function MenuItemForm({ 
    item = null, 
    availableParents = [], 
    onSave, 
    onCancel, 
    onDelete, 
    isLoading = false 
}) {
    const [formData, setFormData] = useState({
        title: '',
        url: '',
        icon: MENU_ITEM_DEFAULTS.icon,
        volgordeId: MENU_ITEM_DEFAULTS.volgordeId,
        parentId: null
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form data when item changes
    useEffect(() => {
        if (item) {
            setFormData({
                title: item.Title || '',
                url: item.URL ? (item.URL.Url || item.URL) : '',
                icon: item.Icon || MENU_ITEM_DEFAULTS.icon,
                volgordeId: item.VolgordeID || MENU_ITEM_DEFAULTS.volgordeId,
                parentId: item.ParentID1 || item.ParentID || null
            });
        } else {
            // For new items, suggest next order number
            const maxOrder = availableParents.reduce((max, parent) => 
                Math.max(max, parseInt(parent.volgordeId) || 0), 0);
            
            setFormData({
                title: '',
                url: '',
                icon: MENU_ITEM_DEFAULTS.icon,
                volgordeId: maxOrder + 1,
                parentId: null
            });
        }
    }, [item, availableParents]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Titel is verplicht';
        }

        if (formData.url && formData.url.trim()) {
            try {
                new URL(formData.url);
            } catch {
                newErrors.url = 'Ongeldige URL format';
            }
        }

        if (formData.volgordeId !== null && formData.volgordeId !== undefined) {
            const order = parseInt(formData.volgordeId);
            if (isNaN(order) || order < 0) {
                newErrors.volgordeId = 'Volgorde moet een positief getal zijn';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        
        try {
            await onSave(formData);
        } catch (error) {
            console.error('Error saving menu item:', error);
            // Error handling should be done by parent component
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!item || !onDelete) return;
        
        const confirmed = confirm(`Weet je zeker dat je "${item.Title}" wilt verwijderen?`);
        if (!confirmed) return;

        setIsSubmitting(true);
        
        try {
            await onDelete(item.Id);
        } catch (error) {
            console.error('Error deleting menu item:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };

    const isFormDisabled = isLoading || isSubmitting;

    return h('div', {
        className: 'fixed inset-0 z-50 flex items-center justify-center modal-backdrop'
    }, [
        h('div', {
            key: 'modal',
            className: 'card-modern w-full max-w-2xl max-h-[90vh] flex flex-col fade-in m-4 overflow-hidden'
        }, [
            // Header
            h('div', {
                key: 'header',
                className: 'bg-gradient-to-r from-brand-blue-600 to-brand-blue-700 p-6 text-white'
            }, [
                h('div', {
                    className: 'flex items-center justify-between'
                }, [
                    h('div', {
                        className: 'flex items-center space-x-3'
                    }, [
                        h('div', {
                            className: 'w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center'
                        }, [
                            h('span', {
                                className: 'material-icons text-white'
                            }, item ? 'edit' : 'add')
                        ]),
                        h('div', {}, [
                            h('h3', {
                                className: 'text-xl font-bold'
                            }, item ? 'Menu Item Bewerken' : 'Nieuw Menu Item'),
                            h('p', {
                                className: 'text-sm text-blue-100 mt-1'
                            }, item ? 'Wijzig de eigenschappen van dit menu item' : 'Voeg een nieuw menu item toe')
                        ])
                    ]),
                    
                    h('button', {
                        type: 'button',
                        className: 'p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors',
                        onClick: onCancel,
                        disabled: isFormDisabled
                    }, [
                        h('span', {
                            className: 'material-icons text-white'
                        }, 'close')
                    ])
                ])
            ]),
            
            // Form
            h('form', {
                key: 'form',
                onSubmit: handleSubmit,
                className: 'p-6 overflow-y-auto flex-1 bg-gray-50'
            }, [
                // Title field
                h('div', {
                    key: 'title-field',
                    className: 'mb-4'
                }, [
                    h('label', {
                        htmlFor: 'title',
                        className: 'block text-sm font-medium text-gray-700 mb-1'
                    }, 'Titel *'),
                    
                    h('input', {
                        type: 'text',
                        id: 'title',
                        value: formData.title,
                        onChange: (e) => handleInputChange('title', e.target.value),
                        className: `input-modern w-full ${
                            errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                        }`,
                        disabled: isFormDisabled
                    }),
                    
                    errors.title && h('p', {
                        className: 'mt-1 text-sm text-red-600'
                    }, errors.title)
                ]),
                
                // URL field
                h('div', {
                    key: 'url-field',
                    className: 'mb-4'
                }, [
                    h('label', {
                        htmlFor: 'url',
                        className: 'block text-sm font-medium text-gray-700 mb-1'
                    }, 'URL'),
                    
                    h('input', {
                        type: 'url',
                        id: 'url',
                        value: formData.url,
                        onChange: (e) => handleInputChange('url', e.target.value),
                        placeholder: 'https://example.com',
                        className: `input-modern w-full ${
                            errors.url ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                        }`,
                        disabled: isFormDisabled
                    }),
                    
                    errors.url && h('p', {
                        className: 'mt-1 text-sm text-red-600'
                    }, errors.url),
                    
                    h('p', {
                        className: 'mt-1 text-xs text-gray-500'
                    }, 'Leeg laten voor items zonder link')
                ]),
                
                // Icon field
                h('div', {
                    key: 'icon-field',
                    className: 'mb-4'
                }, [
                    h('label', {
                        className: 'block text-sm font-medium text-gray-700 mb-1'
                    }, 'Icoon'),
                    
                    h('div', {
                        className: 'flex items-center space-x-2'
                    }, [
                        h('input', {
                            type: 'text',
                            value: formData.icon,
                            onChange: (e) => handleInputChange('icon', e.target.value),
                            className: 'input-modern flex-1',
                            disabled: isFormDisabled
                        }),
                        
                        h(IconSelector, {
                            selectedIcon: formData.icon,
                            onIconSelect: (icon) => handleInputChange('icon', icon),
                            disabled: isFormDisabled
                        })
                    ]),
                    
                    h('p', {
                        className: 'mt-1 text-xs text-gray-500'
                    }, 'Material icon naam (bijv. home, info, etc.)')
                ]),
                
                // Order field
                h('div', {
                    key: 'order-field',
                    className: 'mb-4'
                }, [
                    h('label', {
                        htmlFor: 'order',
                        className: 'block text-sm font-medium text-gray-700 mb-1'
                    }, 'Volgorde'),
                    
                    h('input', {
                        type: 'number',
                        id: 'order',
                        value: formData.volgordeId,
                        onChange: (e) => handleInputChange('volgordeId', e.target.value),
                        min: '0',
                        className: `input-modern w-full ${
                            errors.volgordeId ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                        }`,
                        disabled: isFormDisabled
                    }),
                    
                    errors.volgordeId && h('p', {
                        className: 'mt-1 text-sm text-red-600'
                    }, errors.volgordeId)
                ]),
                
                // Parent field
                h('div', {
                    key: 'parent-field',
                    className: 'mb-4'
                }, [
                    h('label', {
                        htmlFor: 'parent',
                        className: 'block text-sm font-medium text-gray-700 mb-1'
                    }, 'Onderliggend aan'),
                    
                    h('select', {
                        id: 'parent',
                        value: formData.parentId || '',
                        onChange: (e) => handleInputChange('parentId', e.target.value || null),
                        className: 'input-modern w-full',
                        disabled: isFormDisabled
                    }, [
                        h('option', {
                            key: 'none',
                            value: ''
                        }, 'Geen (hoofdniveau)'),
                        
                        ...availableParents.map(parent => 
                            h('option', {
                                key: parent.value,
                                value: parent.value
                            }, `${'  '.repeat(parent.level)}${parent.label}`)
                        )
                    ])
                ])
            ]),
            
            // Footer
            h('div', {
                key: 'footer',
                className: 'p-6 bg-white border-t border-gray-200 flex justify-between items-center'
            }, [
                // Delete button (only for existing items)
                item && onDelete ? h('button', {
                    type: 'button',
                    className: 'btn-modern bg-red-600 hover:bg-red-700 text-white py-3 px-6 disabled:opacity-50 disabled:cursor-not-allowed',
                    onClick: handleDelete,
                    disabled: isFormDisabled
                }, [
                    h('span', {
                        className: 'material-icons text-sm'
                    }, 'delete'),
                    'Verwijderen'
                ]) : h('div'),
                
                // Action buttons
                h('div', {
                    className: 'flex space-x-3'
                }, [
                    h('button', {
                        type: 'button',
                        className: 'btn-modern bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 disabled:opacity-50',
                        onClick: onCancel,
                        disabled: isFormDisabled
                    }, 'Annuleren'),
                    
                    h('button', {
                        type: 'submit',
                        className: 'btn-modern btn-primary py-3 px-6 disabled:opacity-50 disabled:cursor-not-allowed',
                        disabled: isFormDisabled
                    }, [
                        isSubmitting ? h('span', {
                            className: 'material-icons text-sm animate-spin'
                        }, 'refresh') : h('span', {
                            className: 'material-icons text-sm'
                        }, 'save'),
                        'Opslaan'
                    ])
                ])
            ])
        ])
    ]);
}