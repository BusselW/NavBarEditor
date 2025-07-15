<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Navigatie Menu Editor</title>
    <link rel="icon" href="data:,">
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
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
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(4px);
        }
        
        .glass-effect {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .gradient-bg {
            background: linear-gradient(135deg, #3B82F6 0%, #F97316 100%);
        }
        
        .card-modern {
            background: white;
            border: 1px solid #E5E7EB;
            border-radius: 16px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        }
        
        .card-modern:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.15);
        }
        
        .btn-modern {
            font-weight: 500;
            border-radius: 8px;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }
        
        .btn-modern:hover {
            transform: translateY(-1px);
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #3B82F6, #2563EB);
            color: white;
            border: none;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        
        .btn-primary:hover {
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }
        
        .btn-secondary {
            background: linear-gradient(135deg, #F97316, #EA580C);
            color: white;
            border: none;
            box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
        }
        
        .btn-secondary:hover {
            box-shadow: 0 6px 20px rgba(249, 115, 22, 0.4);
        }
        
        .input-modern {
            border: 2px solid #E5E7EB;
            border-radius: 8px;
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
            transition: all 0.2s ease;
            background: white;
        }
        
        .input-modern:focus {
            border-color: #3B82F6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            outline: none;
        }
        
        .table-modern {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .table-modern th {
            background: linear-gradient(135deg, #1E40AF, #1D4ED8);
            color: white;
            font-weight: 600;
            padding: 1rem;
            text-align: left;
            border: none;
        }
        
        .table-modern td {
            padding: 1rem;
            border-bottom: 1px solid #F3F4F6;
        }
        
        .table-modern tr:hover {
            background: #F8FAFC;
        }
        
        .status-bar {
            background: white;
            border: 1px solid #E5E7EB;
            border-radius: 12px;
            padding: 1rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.06);
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
                            50: '#EFF8FF',
                            100: '#DBEAFE',
                            200: '#BFDBFE',
                            300: '#93C5FD',
                            400: '#60A5FA',
                            500: '#3B82F6',
                            600: '#2563EB',
                            700: '#1D4ED8',
                            800: '#1E40AF',
                            900: '#1E3A8A',
                            950: '#172554'
                        },
                        'brand-orange': {
                            50: '#FFF7ED',
                            100: '#FFEDD5',
                            200: '#FED7AA',
                            300: '#FDBA74',
                            400: '#FB923C',
                            500: '#F97316',
                            600: '#EA580C',
                            700: '#C2410C',
                            800: '#9A3412',
                            900: '#7C2D12',
                            950: '#431407'
                        }
                    },
                    fontFamily: {
                        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif']
                    },
                    boxShadow: {
                        'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.05)',
                        'medium': '0 4px 12px 0 rgba(0, 0, 0, 0.08)',
                        'strong': '0 8px 25px 0 rgba(0, 0, 0, 0.12)'
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