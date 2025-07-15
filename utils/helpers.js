// Helper utilities for the navbar editor
export function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        listGuid: params.get('listGuid'),
        siteUrl: params.get('siteUrl')
    };
}

export function detectSiteUrl() {
    const params = getUrlParams();
    
    // First try URL parameter
    if (params.siteUrl) {
        return params.siteUrl;
    }
    
    // Try SharePoint context
    if (typeof _spPageContextInfo !== 'undefined' && _spPageContextInfo?.webAbsoluteUrl) {
        return _spPageContextInfo.webAbsoluteUrl;
    }
    
    // Fallback to current location
    const pathParts = window.location.pathname.split('/');
    const sitesIndex = pathParts.indexOf('sites');
    
    if (sitesIndex !== -1 && pathParts.length > sitesIndex + 1) {
        return `${window.location.protocol}//${window.location.host}/sites/${pathParts[sitesIndex + 1]}`;
    }
    
    return null;
}

export function isValidGuid(guid) {
    if (!guid || typeof guid !== 'string') return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(guid);
}

export function buildHierarchy(items, parentField = 'ParentID1') {
    const itemMap = new Map();
    const roots = [];
    
    // First pass: create map of all items
    items.forEach(item => {
        itemMap.set(item.Id, {
            ...item,
            children: []
        });
    });
    
    // Second pass: build hierarchy
    items.forEach(item => {
        const parentId = item[parentField];
        if (parentId && itemMap.has(parentId)) {
            itemMap.get(parentId).children.push(itemMap.get(item.Id));
        } else {
            roots.push(itemMap.get(item.Id));
        }
    });
    
    return roots;
}

export function sortMenuItems(items) {
    return items.sort((a, b) => {
        const aOrder = parseInt(a.VolgordeID) || 0;
        const bOrder = parseInt(b.VolgordeID) || 0;
        if (aOrder !== bOrder) return aOrder - bOrder;
        return (a.Title || '').localeCompare(b.Title || '');
    });
}

export function getHierarchyLevel(item, items, parentField = 'ParentID1', visited = new Set()) {
    if (visited.has(item.Id)) return 0; // Prevent infinite recursion
    visited.add(item.Id);
    
    const parentId = item[parentField];
    if (!parentId) return 0;
    
    const parent = items.find(i => i.Id === parentId);
    if (!parent) return 0;
    
    return 1 + getHierarchyLevel(parent, items, parentField, visited);
}

export function formatError(error) {
    if (typeof error === 'string') return error;
    
    if (error?.status) {
        switch (error.status) {
            case 401:
                return 'Authenticatie vereist - herlaad de pagina';
            case 403:
                return 'Onvoldoende rechten voor deze operatie';
            case 404:
                return 'Lijst of item niet gevonden';
            case 413:
                return 'Verzoek te groot - reduceer de hoeveelheid data';
            case 429:
                return 'Te veel verzoeken - probeer later opnieuw';
            default:
                return `Fout ${error.status}: ${error.message || 'Onbekende fout'}`;
        }
    }
    
    return error?.message || 'Onbekende fout opgetreden';
}

export function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const cloned = {};
        Object.keys(obj).forEach(key => {
            cloned[key] = deepClone(obj[key]);
        });
        return cloned;
    }
}