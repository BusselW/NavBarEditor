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
            const items = await this.sharepointService.getListItems(siteUrl, listGuid, {
                select: 'Id,Title,URL,ParentID1,ParentID,VolgordeID,Icon',
                orderby: 'VolgordeID asc,Title asc',
                top: 5000,
                forceRefresh
            });

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
        const hasParentID1 = items.some(item => item.ParentID1 !== null && item.ParentID1 !== undefined);
        
        // Check if any items have ParentID values
        const hasParentID = items.some(item => item.ParentID !== null && item.ParentID !== undefined);
        
        // Prefer ParentID1 if available, otherwise use ParentID
        if (hasParentID1) {
            return FIELD_NAMES.PARENT_ID;
        } else if (hasParentID) {
            return FIELD_NAMES.PARENT_ID_FALLBACK;
        }
        
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
    async createMenuItem(siteUrl, listGuid, itemData, entityType) {
        const formData = this.prepareItemData(itemData);
        
        try {
            const result = await this.sharepointService.createListItem(siteUrl, listGuid, formData, entityType);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // Update existing menu item
    async updateMenuItem(siteUrl, listGuid, itemId, itemData, entityType) {
        const formData = this.prepareItemData(itemData);
        
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
    prepareItemData(itemData) {
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

        // Handle parent ID
        if (itemData.parentId !== undefined) {
            formData[FIELD_NAMES.PARENT_ID] = itemData.parentId ? parseInt(itemData.parentId) : null;
        }

        // Handle order ID
        if (itemData.volgordeId !== undefined) {
            formData[FIELD_NAMES.VOLGORDE_ID] = itemData.volgordeId ? parseInt(itemData.volgordeId) : null;
        }

        return formData;
    }

    // Get available parent items for dropdown
    getAvailableParents(items, excludeItemId = null) {
        return items
            .filter(item => item.Id !== excludeItemId)
            .map(item => ({
                value: item.Id,
                label: item.Title || 'Naamloos item',
                level: getHierarchyLevel(item, items)
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