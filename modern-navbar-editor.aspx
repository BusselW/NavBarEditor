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
            backdrop-filter: blur(8px);
            animation: fadeIn 0.3s ease-out;
        }
        
        .glass-effect {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .gradient-bg {
            background: linear-gradient(135deg, #3B82F6 0%, #F97316 100%);
            position: relative;
            overflow: hidden;
        }
        
        .gradient-bg::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
            pointer-events: none;
        }
        
        .card-modern {
            background: white;
            border: 1px solid #E5E7EB;
            border-radius: 20px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }
        
        .card-modern::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #3B82F6, #F97316);
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .card-modern:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 40px -8px rgba(0, 0, 0, 0.15);
        }
        
        .card-modern:hover::before {
            opacity: 1;
        }
        
        .btn-modern {
            font-weight: 600;
            border-radius: 12px;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            position: relative;
            overflow: hidden;
            font-size: 0.875rem;
            letter-spacing: 0.025em;
        }
        
        .btn-modern::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transition: all 0.3s ease;
            transform: translate(-50%, -50%);
        }
        
        .btn-modern:hover::before {
            width: 300px;
            height: 300px;
        }
        
        .btn-modern:hover {
            transform: translateY(-2px);
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #3B82F6, #2563EB);
            color: white;
            border: none;
            box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
        }
        
        .btn-primary:hover {
            box-shadow: 0 8px 25px rgba(59, 130, 246, 0.5);
        }
        
        .btn-secondary {
            background: linear-gradient(135deg, #F97316, #EA580C);
            color: white;
            border: none;
            box-shadow: 0 4px 14px rgba(249, 115, 22, 0.4);
        }
        
        .btn-secondary:hover {
            box-shadow: 0 8px 25px rgba(249, 115, 22, 0.5);
        }
        
        .btn-ghost {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
        }
        
        .btn-ghost:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.3);
        }
        
        .input-modern {
            border: 2px solid #E5E7EB;
            border-radius: 12px;
            padding: 0.875rem 1rem;
            font-size: 0.875rem;
            transition: all 0.2s ease;
            background: white;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        
        .input-modern:focus {
            border-color: #3B82F6;
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
            outline: none;
            transform: translateY(-1px);
        }
        
        .table-modern {
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            border: 1px solid #E5E7EB;
        }
        
        .table-modern th {
            background: linear-gradient(135deg, #1E40AF, #1D4ED8);
            color: white;
            font-weight: 600;
            padding: 1.25rem 1rem;
            text-align: left;
            border: none;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .table-modern td {
            padding: 1.25rem 1rem;
            border-bottom: 1px solid #F3F4F6;
            vertical-align: middle;
        }
        
        .table-modern tr:hover {
            background: linear-gradient(90deg, #F8FAFC, #EFF6FF);
        }
        
        .table-modern tr:last-child td {
            border-bottom: none;
        }
        
        .status-bar {
            background: white;
            border: 1px solid #E5E7EB;
            border-radius: 16px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            position: relative;
            overflow: hidden;
        }
        
        .status-bar::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #3B82F6, #F97316);
        }
        
        .icon-badge {
            background: linear-gradient(135deg, #3B82F6, #2563EB);
            color: white;
            border-radius: 50%;
            width: 2.5rem;
            height: 2.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
            font-size: 1.25rem;
        }
        
        .icon-badge-orange {
            background: linear-gradient(135deg, #F97316, #EA580C);
            box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
        }
        
        .tag-modern {
            background: linear-gradient(135deg, #F3F4F6, #E5E7EB);
            color: #374151;
            padding: 0.375rem 0.75rem;
            border-radius: 8px;
            font-size: 0.75rem;
            font-weight: 500;
            letter-spacing: 0.025em;
            border: 1px solid #E5E7EB;
        }
        
        .hierarchy-icon {
            color: #F97316;
            font-size: 1rem;
            margin-right: 0.5rem;
        }
        
        .loading-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        .header-glow {
            box-shadow: 0 4px 20px rgba(59, 130, 246, 0.15);
        }
        
        .floating-action {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            z-index: 1000;
            border-radius: 50%;
            width: 3.5rem;
            height: 3.5rem;
            box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);
            transition: all 0.3s ease;
        }
        
        .floating-action:hover {
            transform: scale(1.1);
            box-shadow: 0 12px 35px rgba(249, 115, 22, 0.5);
        }
        
        .breadcrumb {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            padding: 0.75rem 1rem;
            margin-bottom: 1rem;
            font-size: 0.875rem;
            color: #6B7280;
        }
        
        .action-bar-enhanced {
            background: linear-gradient(135deg, #F8FAFC, #EFF6FF);
            border: 1px solid #E5E7EB;
            border-radius: 16px;
            padding: 1.5rem;
            margin-bottom: 2rem;
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
        
        .tour-overlay {
            animation: fadeIn 0.3s ease-out;
        }
        
        .tour-overlay .tour-highlight {
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(249, 115, 22, 0); }
            100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0); }
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
<body class="bg-gradient-to-br from-blue-50 via-white to-orange-50 font-sans">
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
    <script type="module" src="./components/TourGuide.js"></script>
    
    <!-- Load main app -->
    <script type="module" src="./app.js"></script>
</body>
</html>