// SharePoint API service following CLAUDE.md patterns
import { SHAREPOINT_CONFIG, ERROR_MESSAGES } from '../utils/constants.js';
import { isValidGuid, formatError } from '../utils/helpers.js';

class SharePointService {
    constructor() {
        this.cache = new Map();
        this.digestCache = new Map();
    }

    // Core API request method
    async makeRequest(url, options = {}) {
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json;odata=verbose',
                'Content-Type': 'application/json;odata=verbose'
            },
            credentials: 'include'
        };

        const finalOptions = { ...defaultOptions, ...options };
        
        // Merge headers
        if (options.headers) {
            finalOptions.headers = { ...defaultOptions.headers, ...options.headers };
        }

        try {
            const response = await fetch(url, finalOptions);
            
            if (!response.ok) {
                let errorMessage = `HTTP ${response.status}`;
                try {
                    const errorData = await response.json();
                    if (errorData.error && errorData.error.message) {
                        errorMessage = errorData.error.message.value || errorData.error.message;
                    }
                } catch (e) {
                    // If JSON parsing fails, use the status text
                    errorMessage = response.statusText || errorMessage;
                }
                
                throw {
                    status: response.status,
                    message: errorMessage
                };
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('SharePoint API request failed:', error);
            
            // If it's a network error or similar, format it properly
            if (!error.status) {
                throw {
                    status: 500,
                    message: error.message || 'Network error occurred'
                };
            }
            
            throw error;
        }
    }

    // Get request digest for write operations
    async getRequestDigest(siteUrl, forceRefresh = false) {
        const cacheKey = `digest_${siteUrl}`;
        
        if (!forceRefresh && this.digestCache.has(cacheKey)) {
            const cached = this.digestCache.get(cacheKey);
            if (cached.expires > Date.now()) {
                return cached.value;
            }
        }

        try {
            const data = await this.makeRequest(`${siteUrl}/_api/contextinfo`, {
                method: 'POST'
            });

            const digestValue = data.d.GetContextWebInformation.FormDigestValue;
            const expiresIn = data.d.GetContextWebInformation.FormDigestTimeoutSeconds * 1000;
            
            // Cache with 1-minute safety margin
            this.digestCache.set(cacheKey, {
                value: digestValue,
                expires: Date.now() + expiresIn - 60000
            });

            return digestValue;
        } catch (error) {
            throw {
                status: error.status || 500,
                message: `Fout bij ophalen request digest: ${formatError(error)}`
            };
        }
    }

    // Get list by GUID
    async getList(siteUrl, listGuid) {
        if (!isValidGuid(listGuid)) {
            throw { status: 400, message: ERROR_MESSAGES.INVALID_GUID };
        }

        const cacheKey = `list_${siteUrl}_${listGuid}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const url = `${siteUrl}/_api/web/lists(guid'${listGuid}')?$select=Title,Id,Hidden,ItemCount,BaseTemplate,Description,ListItemEntityTypeFullName`;
            const data = await this.makeRequest(url);
            
            const listInfo = {
                id: data.d.Id,
                title: data.d.Title,
                hidden: data.d.Hidden,
                itemCount: data.d.ItemCount,
                baseTemplate: data.d.BaseTemplate,
                description: data.d.Description || '',
                entityType: data.d.ListItemEntityTypeFullName,
                isDocumentLibrary: data.d.BaseTemplate === 101
            };

            this.cache.set(cacheKey, listInfo);
            return listInfo;
        } catch (error) {
            if (error.status === 404) {
                throw { status: 404, message: ERROR_MESSAGES.LIST_NOT_FOUND };
            }
            throw error;
        }
    }

    // Get list items with OData options
    async getListItems(siteUrl, listGuid, options = {}) {
        if (!isValidGuid(listGuid)) {
            throw { status: 400, message: ERROR_MESSAGES.INVALID_GUID };
        }

        const queryParams = [];
        
        if (options.select) {
            queryParams.push(`$select=${options.select}`);
        }
        
        if (options.filter) {
            queryParams.push(`$filter=${options.filter}`);
        }
        
        if (options.orderby) {
            queryParams.push(`$orderby=${options.orderby}`);
        }
        
        if (options.top) {
            queryParams.push(`$top=${options.top}`);
        }
        
        if (options.skip) {
            queryParams.push(`$skip=${options.skip}`);
        }

        const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
        const url = `${siteUrl}/_api/web/lists(guid'${listGuid}')/items${queryString}`;
        
        const cacheKey = `items_${siteUrl}_${listGuid}_${JSON.stringify(options)}`;
        
        if (!options.forceRefresh && this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const data = await this.makeRequest(url);
            const items = data.d.results || [];
            
            this.cache.set(cacheKey, items);
            return items;
        } catch (error) {
            throw {
                status: error.status || 500,
                message: `Fout bij ophalen items: ${formatError(error)}`
            };
        }
    }

    // Create new list item
    async createListItem(siteUrl, listGuid, itemData, entityType) {
        if (!isValidGuid(listGuid)) {
            throw { status: 400, message: ERROR_MESSAGES.INVALID_GUID };
        }

        const digest = await this.getRequestDigest(siteUrl);
        const url = `${siteUrl}/_api/web/lists(guid'${listGuid}')/items`;
        
        const formData = {
            __metadata: { type: entityType },
            ...itemData
        };

        try {
            const data = await this.makeRequest(url, {
                method: 'POST',
                headers: {
                    'X-RequestDigest': digest
                },
                body: JSON.stringify(formData)
            });

            // Clear relevant caches
            this.clearItemsCache(siteUrl, listGuid);
            
            return data.d;
        } catch (error) {
            throw {
                status: error.status || 500,
                message: `Fout bij aanmaken item: ${formatError(error)}`
            };
        }
    }

    // Update existing list item
    async updateListItem(siteUrl, listGuid, itemId, itemData, entityType) {
        if (!isValidGuid(listGuid)) {
            throw { status: 400, message: ERROR_MESSAGES.INVALID_GUID };
        }

        const digest = await this.getRequestDigest(siteUrl);
        const url = `${siteUrl}/_api/web/lists(guid'${listGuid}')/items(${itemId})`;
        
        const formData = {
            __metadata: { type: entityType },
            ...itemData
        };

        try {
            await this.makeRequest(url, {
                method: 'POST',
                headers: {
                    'X-RequestDigest': digest,
                    'IF-MATCH': '*',
                    'X-HTTP-Method': 'MERGE'
                },
                body: JSON.stringify(formData)
            });

            // Clear relevant caches
            this.clearItemsCache(siteUrl, listGuid);
            
            return true;
        } catch (error) {
            throw {
                status: error.status || 500,
                message: `Fout bij bijwerken item: ${formatError(error)}`
            };
        }
    }

    // Delete list item
    async deleteListItem(siteUrl, listGuid, itemId) {
        if (!isValidGuid(listGuid)) {
            throw { status: 400, message: ERROR_MESSAGES.INVALID_GUID };
        }

        const digest = await this.getRequestDigest(siteUrl);
        const url = `${siteUrl}/_api/web/lists(guid'${listGuid}')/items(${itemId})`;

        try {
            await this.makeRequest(url, {
                method: 'POST',
                headers: {
                    'X-RequestDigest': digest,
                    'IF-MATCH': '*',
                    'X-HTTP-Method': 'DELETE'
                }
            });

            // Clear relevant caches
            this.clearItemsCache(siteUrl, listGuid);
            
            return true;
        } catch (error) {
            throw {
                status: error.status || 500,
                message: `Fout bij verwijderen item: ${formatError(error)}`
            };
        }
    }

    // Clear cached items for a specific list
    clearItemsCache(siteUrl, listGuid) {
        const keys = Array.from(this.cache.keys());
        keys.forEach(key => {
            if (key.startsWith(`items_${siteUrl}_${listGuid}_`)) {
                this.cache.delete(key);
            }
        });
    }

    // Clear all caches
    clearAllCaches() {
        this.cache.clear();
        this.digestCache.clear();
    }
}

// Create singleton instance
export const sharepointService = new SharePointService();
export default sharepointService;