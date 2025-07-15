<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Navigatie Menu Editor</title>
    <link rel="icon" href="data:,">
    
    <!-- Material Icons -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    
    <!-- React 18 via CDN -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <style>
        .material-icons {
            font-family: 'Material Icons';
            font-weight: normal;
            font-style: normal;
            font-size: 24px;
            line-height: 1;
            letter-spacing: normal;
            text-transform: none;
            display: inline-block;
            white-space: nowrap;
            word-wrap: normal;
            direction: ltr;
            -webkit-font-feature-settings: 'liga';
            -webkit-font-smoothing: antialiased;
        }
        
        .hierarchy-indent-1 { padding-left: 2rem; }
        .hierarchy-indent-2 { padding-left: 4rem; }
        .hierarchy-indent-3 { padding-left: 6rem; }
        
        .modal-backdrop {
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(2px);
        }
        
        .animate-spin {
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .fade-in {
            animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
    
    <script>
        // Tailwind Config
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'brand-blue': {
                            light: '#E6F0F8',
                            DEFAULT: '#004882',
                            dark: '#003B6B'
                        },
                        'brand-orange': {
                            light: '#FFF2E9',
                            DEFAULT: '#CA5010',
                            dark: '#A94210'
                        }
                    }
                }
            }
        };
    </script>
</head>
<body class="bg-gray-50 font-sans">
    <div id="app-root"></div>
    
    <!-- Load services first -->
    <script type="module" src="./services/sharepointService.js"></script>
    <script type="module" src="./services/menuService.js"></script>
    
    <!-- Load utilities -->
    <script type="module" src="./utils/constants.js"></script>
    <script type="module" src="./utils/helpers.js"></script>
    
    <!-- Load components -->
    <script type="module" src="./components/ErrorBoundary.js"></script>
    <script type="module" src="./components/LoadingSpinner.js"></script>
    <script type="module" src="./components/IconPicker.js"></script>
    <script type="module" src="./components/MenuItemForm.js"></script>
    <script type="module" src="./components/MenuItemsTable.js"></script>
    <script type="module" src="./components/StatusBar.js"></script>
    
    <!-- Load main app -->
    <script type="module" src="./app.js"></script>
</body>
</html>