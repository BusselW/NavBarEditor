// Constants for the navbar editor application
export const SHAREPOINT_CONFIG = {
    BASE_URL: 'https://som.org.om.local/sites/',
    API_PATH: '/_api/',
    MENU_PATH: 'https://som.org.om.local/sites/MulderT/CustomPW/HBS/MENU'
};

export const FIELD_NAMES = {
    TITLE: 'Title',
    URL: 'URL',
    PARENT_ID: 'ParentID1', // Primary parent field
    PARENT_ID_FALLBACK: 'ParentID', // Fallback parent field
    VOLGORDE_ID: 'VolgordeID',
    ICON: 'Icon'
};

export const MENU_ITEM_DEFAULTS = {
    title: '',
    url: '',
    parentId: null,
    volgordeId: 1,
    icon: 'chevron_right'
};

export const COMMON_ICONS = [
    'home', 'house', 'cottage', 'apartment', 'people', 'person', 'group', 'groups', 
    'diversity_3', 'supervisor_account', 'psychology', 'engineering', 'school', 
    'biotech', 'business', 'description', 'assignment', 'menu_book', 'book', 
    'auto_stories', 'library_books', 'folder', 'folder_shared', 'content_paste', 
    'grading', 'event', 'calendar_today', 'calendar_month', 'schedule', 'today', 
    'gavel', 'rate_review', 'checklist', 'fact_check', 'verified', 'verified_user', 
    'thumb_up', 'task_alt', 'high_quality', 'devices', 'computer', 'memory', 'lan', 
    'desktop_windows', 'wifi', 'code', 'upload_file', 'download', 'cloud_upload', 
    'build', 'build_circle', 'handyman', 'settings_suggest', 'troubleshoot', 
    'report_problem', 'warning', 'error', 'place', 'map', 'location_on', 'explore', 
    'navigation', 'local_parking', 'traffic', 'speed', 'hearing', 'record_voice_over', 
    'mail', 'email', 'chat', 'forum', 'comment', 'phone', 'call', 'video_call', 
    'meeting_room', 'public', 'language', 'web_asset', 'link', 'support', 
    'contact_support', 'support_agent', 'help', 'settings', 'admin_panel_settings', 
    'dashboard', 'analytics', 'insights', 'trending_up', 'bar_chart', 'summarize', 
    'timeline', 'assignment_turned_in', 'format_list_bulleted', 'checklist_rtl', 
    'euro', 'payments', 'account_balance_wallet', 'savings', 'account_balance', 
    'security', 'policy', 'highlight', 'lightbulb', 'print', 'scanner', 
    'chevron_right', 'calculate', 'calculator', 'stacked_bar_chart', 'data_usage', 
    'data_exploration', 'functions', 'query_stats', 'pin', 'format_paint', 
    'construction', 'architecture', 'article', 'text_snippet', 'history_edu', 
    'receipt_long', 'shopping_cart', 'shopping_bag', 'storefront', 'local_shipping', 
    'receipt', 'paid', 'attach_money', 'price_check', 'credit_card', 'badge', 
    'card_membership', 'card_giftcard', 'redeem', 'loyalty', 'discount', 'percent', 
    'local_offer', 'sell', 'category', 'newspaper', 'feed', 'rss_feed', 'wysiwyg', 
    'model_training', 'app_registration', 'integration_instructions', 'developer_mode', 
    'smart_button', 'terminal', 'table_view', 'view_agenda', 'web'
];

export const ERROR_MESSAGES = {
    INVALID_GUID: 'Ongeldige lijst GUID opgegeven',
    SITE_URL_MISSING: 'Site URL ontbreekt',
    LIST_NOT_FOUND: 'Lijst niet gevonden',
    PERMISSION_DENIED: 'Onvoldoende rechten',
    NETWORK_ERROR: 'Netwerkfout opgetreden',
    UNKNOWN_ERROR: 'Onbekende fout opgetreden'
};

export const STATUS_TYPES = {
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info'
};