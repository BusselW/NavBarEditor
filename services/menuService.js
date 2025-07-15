// Menu service for handling navbar-specific operations
import sharepointService from './sharepointService.js';
import { FIELD_NAMES, MENU_ITEM_DEFAULTS } from '../utils/constants.js';
import { buildHierarchy, sortMenuItems, getHierarchyLevel } from '../utils/helpers.js';

class MenuService {
    constructor() {
        this.sharepointService = sharepointService;
    }

    // Get menu items with hierarchy support
    async getMenuItems(siteUrl, listGuid, forceRefresh = false) {
        try {
            // Progressive field loading - try with all fields first, then fall back
            let items;
            let selectFields = 'Id,Title,URL,ParentID1,ParentID,VolgordeID,Icon';
            
            try {
                items = await this.sharepointService.getListItems(siteUrl, listGuid, {
                    select: selectFields,
                    orderby: 'VolgordeID asc,Title asc',
                    top: 5000,
                    forceRefresh
                });
            } catch (error) {
                console.warn('Failed with all fields, trying alternative field names:', error);
                
                // Try with different field combinations
                const fallbackAttempts = [
                    'Id,Title,URL,ParentID1,Icon', // Try without VolgordeID
                    'Id,Title,URL,Icon', // Try with minimal fields
                    'Id,Title' // Absolute minimum
                ];
                
                for (const fields of fallbackAttempts) {
                    try {
                        console.log(`Trying with fields: ${fields}`);
                        items = await this.sharepointService.getListItems(siteUrl, listGuid, {
                            select: fields,
                            orderby: 'Title asc',
                            top: 5000,
                            forceRefresh
                        });
                        console.log(`Success with fields: ${fields}`);
                        break;
                    } catch (fallbackError) {
                        console.warn(`Failed with fields ${fields}:`, fallbackError);
                        continue;
                    }
                }
                
                if (!items) {
                    throw new Error('Unable to load items with any field combination');
                }
            }

            // Determine which parent field is used
            const parentField = this.determineParentField(items);
            
            // Sort items by order and title
            const sortedItems = sortMenuItems(items);
            
            // Build hierarchy
            const hierarchy = buildHierarchy(sortedItems, parentField);
            
            return {
                items: sortedItems,
                hierarchy,
                parentField,
                flatItems: this.flattenHierarchy(hierarchy)
            };
        } catch (error) {
            throw error;
        }
    }

    // Determine which parent field is used in the list
    determineParentField(items) {
        // Check if any items have ParentID1 values
        const hasParentID1 = items.some(item => item.ParentID1 !== null && item.ParentID1 !== undefined && item.ParentID1 !== '');
        
        // Check if any items have ParentID values
        const hasParentID = items.some(item => item.ParentID !== null && item.ParentID !== undefined && item.ParentID !== '');
        
        // Prefer ParentID1 if available, otherwise use ParentID
        if (hasParentID1) {
            console.log('Using ParentID1 field for parent relationships');
            return FIELD_NAMES.PARENT_ID;
        } else if (hasParentID) {
            console.log('Using ParentID field for parent relationships');
            return FIELD_NAMES.PARENT_ID_FALLBACK;
        }
        
        console.log('No parent field data found, defaulting to ParentID1');
        return FIELD_NAMES.PARENT_ID; // Default
    }

    // Flatten hierarchy for display with indentation levels
    flattenHierarchy(hierarchy, level = 0) {
        const result = [];
        
        hierarchy.forEach(item => {
            result.push({
                ...item,
                level,
                indentClass: level > 0 ? `hierarchy-indent-${Math.min(level, 3)}` : ''
            });
            
            if (item.children && item.children.length > 0) {
                result.push(...this.flattenHierarchy(item.children, level + 1));
            }
        });
        
        return result;
    }

    // Create new menu item
    async createMenuItem(siteUrl, listGuid, itemData, entityType, parentField = FIELD_NAMES.PARENT_ID) {
        const formData = this.prepareItemData(itemData, parentField);
        
        try {
            const result = await this.sharepointService.createListItem(siteUrl, listGuid, formData, entityType);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // Update existing menu item
    async updateMenuItem(siteUrl, listGuid, itemId, itemData, entityType, parentField = FIELD_NAMES.PARENT_ID) {
        const formData = this.prepareItemData(itemData, parentField);
        
        try {
            const result = await this.sharepointService.updateListItem(siteUrl, listGuid, itemId, formData, entityType);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // Delete menu item
    async deleteMenuItem(siteUrl, listGuid, itemId) {
        try {
            const result = await this.sharepointService.deleteListItem(siteUrl, listGuid, itemId);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // Prepare item data for SharePoint
    prepareItemData(itemData, parentField = FIELD_NAMES.PARENT_ID) {
        const formData = {
            [FIELD_NAMES.TITLE]: itemData.title || MENU_ITEM_DEFAULTS.title,
            [FIELD_NAMES.ICON]: itemData.icon || MENU_ITEM_DEFAULTS.icon
        };

        // Handle URL field (SharePoint URL field type)
        if (itemData.url) {
            formData[FIELD_NAMES.URL] = {
                __metadata: { type: 'SP.FieldUrlValue' },
                Url: itemData.url,
                Description: itemData.title || ''
            };
        } else {
            formData[FIELD_NAMES.URL] = null;
        }

        // Handle parent ID - use the detected parent field
        if (itemData.parentId !== undefined) {
            formData[parentField] = itemData.parentId ? parseInt(itemData.parentId) : null;
        }

        // Handle order ID
        if (itemData.volgordeId !== undefined) {
            formData[FIELD_NAMES.VOLGORDE_ID] = itemData.volgordeId ? parseInt(itemData.volgordeId) : null;
        }

        return formData;
    }

    // Get available parent items for dropdown
    getAvailableParents(items, excludeItemId = null, parentField = FIELD_NAMES.PARENT_ID) {
        return items
            .filter(item => item.Id !== excludeItemId)
            .map(item => ({
                value: item.Id,
                label: item.Title || 'Naamloos item',
                level: getHierarchyLevel(item, items, parentField)
            }))
            .sort((a, b) => {
                if (a.level !== b.level) return a.level - b.level;
                return a.label.localeCompare(b.label);
            });
    }

    // Validate menu item data
    validateMenuItem(itemData) {
        const errors = [];

        if (!itemData.title || itemData.title.trim().length === 0) {
            errors.push('Titel is verplicht');
        }

        if (itemData.url && itemData.url.trim().length > 0) {
            try {
                new URL(itemData.url);
            } catch {
                errors.push('Ongeldige URL format');
            }
        }

        if (itemData.volgordeId !== undefined && itemData.volgordeId !== null) {
            const order = parseInt(itemData.volgordeId);
            if (isNaN(order) || order < 0) {
                errors.push('Volgorde moet een positief getal zijn');
            }
        }

        return errors;
    }

    // Get next available order number
    getNextOrderNumber(items) {
        const maxOrder = items.reduce((max, item) => {
            const order = parseInt(item.VolgordeID) || 0;
            return Math.max(max, order);
        }, 0);
        
        return maxOrder + 1;
    }
}

// Create singleton instance
export const menuService = new MenuService();
export default menuService;