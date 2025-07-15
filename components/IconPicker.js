// Icon picker component for Material Icons
import { COMMON_ICONS } from '../utils/constants.js';
import { debounce } from '../utils/helpers.js';

const { createElement: h, useState, useEffect, useRef } = React;

export default function IconPicker({ selectedIcon, onIconSelect, onClose }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredIcons, setFilteredIcons] = useState(COMMON_ICONS);
    const searchInputRef = useRef(null);

    // Filter icons based on search term
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredIcons(COMMON_ICONS);
        } else {
            const filtered = COMMON_ICONS.filter(icon =>
                icon.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredIcons(filtered);
        }
    }, [searchTerm]);

    // Focus search input when opened
    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);

    // Debounced search handler
    const debouncedSearch = debounce((value) => {
        setSearchTerm(value);
    }, 300);

    const handleSearchChange = (e) => {
        debouncedSearch(e.target.value);
    };

    const handleIconClick = (icon) => {
        onIconSelect(icon);
        onClose();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    return h('div', {
        className: 'absolute z-20 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4',
        style: { width: '400px', minWidth: '400px' },
        onKeyDown: handleKeyDown
    }, [
        // Search input
        h('div', {
            key: 'search',
            className: 'mb-3'
        }, [
            h('input', {
                ref: searchInputRef,
                type: 'text',
                placeholder: 'Zoek iconen...',
                className: 'w-full p-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent',
                onChange: handleSearchChange
            })
        ]),
        
        // Icons grid
        h('div', {
            key: 'grid',
            className: 'max-h-64 overflow-y-auto'
        }, [
            h('div', {
                className: 'grid grid-cols-10 gap-2'
            }, filteredIcons.map(icon => 
                h('div', {
                    key: icon,
                    className: `w-8 h-8 rounded cursor-pointer hover:bg-gray-100 hover:scale-110 transition-all duration-200 flex items-center justify-center ${
                        selectedIcon === icon ? 'bg-brand-blue text-white' : 'text-gray-600'
                    }`,
                    onClick: () => handleIconClick(icon),
                    title: icon
                }, [
                    h('span', {
                        className: 'material-icons text-lg'
                    }, icon)
                ])
            ))
        ]),
        
        // No results message
        filteredIcons.length === 0 && h('div', {
            key: 'no-results',
            className: 'text-center py-4 text-gray-500 text-sm'
        }, 'Geen iconen gevonden'),
        
        // Footer with close button
        h('div', {
            key: 'footer',
            className: 'mt-3 pt-3 border-t border-gray-200 flex justify-between items-center'
        }, [
            h('div', {
                className: 'text-xs text-gray-500'
            }, `${filteredIcons.length} iconen`),
            
            h('button', {
                type: 'button',
                className: 'px-3 py-1 text-sm text-gray-600 hover:text-gray-800 focus:outline-none',
                onClick: onClose
            }, 'Sluiten')
        ])
    ]);
}

// Icon preview component
export function IconPreview({ icon, className = '' }) {
    return h('div', {
        className: `flex items-center justify-center w-10 h-10 bg-gray-100 rounded ${className}`
    }, [
        h('span', {
            className: 'material-icons text-gray-600 text-lg',
            key: icon || 'default'
        }, icon || 'chevron_right')
    ]);
}

// Icon selector button component
export function IconSelector({ selectedIcon, onIconSelect, disabled = false }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Close picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleToggle = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    const handleIconSelect = (icon) => {
        onIconSelect(icon);
        setIsOpen(false);
    };

    return h('div', {
        ref: containerRef,
        className: 'relative'
    }, [
        h('div', {
            key: 'selector',
            className: 'flex items-center space-x-2'
        }, [
            h(IconPreview, {
                icon: selectedIcon,
                className: disabled ? 'opacity-50' : ''
            }),
            
            h('button', {
                type: 'button',
                className: `p-2 rounded bg-gray-100 hover:bg-gray-200 transition-colors ${
                    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`,
                onClick: handleToggle,
                disabled,
                title: 'Selecteer icoon'
            }, [
                h('span', {
                    className: 'material-icons text-base'
                }, 'format_list_bulleted')
            ])
        ]),
        
        isOpen && h(IconPicker, {
            key: 'picker',
            selectedIcon,
            onIconSelect: handleIconSelect,
            onClose: () => setIsOpen(false)
        })
    ]);
}