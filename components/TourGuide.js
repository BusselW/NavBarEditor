// Interactive tour guide component for navbar editor
const { createElement: h, useState, useEffect } = React;

const TOUR_STEPS = [
    {
        id: 'welcome',
        title: 'Welkom bij de Navigatie Menu Editor',
        content: 'Deze tour leidt je door alle functies van de menu editor. Je leert hoe je menu items kunt maken, bewerken en organiseren.',
        target: null,
        position: 'center'
    },
    {
        id: 'header',
        title: 'Navigatie Header',
        content: 'Hier zie je de huidige lijst informatie en kun je terug naar het hoofdmenu. De header toont altijd je huidige locatie.',
        target: 'header',
        position: 'bottom'
    },
    {
        id: 'status',
        title: 'Status Informatie',
        content: 'Dit paneel toont de huidige status van je lijst, inclusief het aantal items en eventuele foutmeldingen.',
        target: '.status-bar',
        position: 'bottom'
    },
    {
        id: 'create-button',
        title: 'Nieuw Menu Item Maken',
        content: 'Klik hier om een nieuw menu item toe te voegen. Dit opent een formulier waar je alle details kunt invullen.',
        target: '.btn-secondary',
        position: 'bottom'
    },
    {
        id: 'table',
        title: 'Menu Items Overzicht',
        content: 'Hier zie je alle menu items in een hiërarchische structuur. Items met inspringen zijn onderliggende menu items.',
        target: '.table-modern',
        position: 'top'
    },
    {
        id: 'form-example',
        title: 'Menu Item Formulier',
        content: 'Laten we een voorbeeld menu item maken om te laten zien hoe het formulier werkt.',
        target: null,
        position: 'center',
        action: 'open-form'
    },
    {
        id: 'form-title',
        title: 'Titel Invullen',
        content: 'Vul hier de naam in van je menu item. Bijvoorbeeld: "Over Ons" of "Contact".',
        target: '#title',
        position: 'right',
        example: 'Over Ons'
    },
    {
        id: 'form-url',
        title: 'URL Toevoegen',
        content: 'Vul hier de link in waar het menu item naar toe moet leiden. Bijvoorbeeld: "https://som.org.om.local/over-ons".',
        target: '#url',
        position: 'right',
        example: 'https://som.org.om.local/over-ons'
    },
    {
        id: 'form-icon',
        title: 'Icoon Selecteren',
        content: 'Kies een passend icoon voor je menu item. Klik op de knop om de icoon picker te openen, of typ de naam handmatig.',
        target: '.icon-selector',
        position: 'left',
        example: 'info'
    },
    {
        id: 'form-order',
        title: 'Volgorde Instellen',
        content: 'Bepaal de volgorde waarin het menu item verschijnt. Lagere nummers verschijnen eerder in het menu.',
        target: '#order',
        position: 'right',
        example: '1'
    },
    {
        id: 'form-parent',
        title: 'Hiërarchie Instellen',
        content: 'Kies een bovenliggend menu item om een submenu te maken. Laat leeg voor hoofdmenu items.',
        target: '#parent',
        position: 'right',
        example: 'Selecteer bestaand item'
    },
    {
        id: 'form-save',
        title: 'Opslaan',
        content: 'Klik op "Opslaan" om je menu item toe te voegen aan de lijst.',
        target: 'button[type="submit"]',
        position: 'top'
    },
    {
        id: 'actions',
        title: 'Menu Item Acties',
        content: 'Gebruik de edit (✏️) en delete (🗑️) knoppen om bestaande menu items te bewerken of te verwijderen.',
        target: '.edit-item-btn',
        position: 'left'
    },
    {
        id: 'hierarchy',
        title: 'Hiërarchie Begrijpen',
        content: 'Items met een pijl (→) zijn submenu items. Ze worden ingesprongen weergegeven onder hun bovenliggende item.',
        target: '.hierarchy-icon',
        position: 'right'
    },
    {
        id: 'refresh',
        title: 'Lijst Vernieuwen',
        content: 'Gebruik de vernieuw knop om de lijst opnieuw te laden en eventuele wijzigingen van andere gebruikers te zien.',
        target: '[title="Vernieuwen"]',
        position: 'bottom'
    },
    {
        id: 'complete',
        title: 'Tour Voltooid!',
        content: 'Je weet nu hoe je de navigatie menu editor gebruikt. Veel succes met het beheren van je menu items!',
        target: null,
        position: 'center'
    }
];

export default function TourGuide({ isOpen, onClose, onOpenForm }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [highlightedElement, setHighlightedElement] = useState(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            highlightStep(TOUR_STEPS[currentStep]);
        } else {
            document.body.style.overflow = 'auto';
            removeHighlight();
        }

        return () => {
            document.body.style.overflow = 'auto';
            removeHighlight();
        };
    }, [isOpen, currentStep]);

    const highlightStep = (step) => {
        removeHighlight();
        
        if (step.target) {
            const element = document.querySelector(step.target);
            if (element) {
                element.style.position = 'relative';
                element.style.zIndex = '9999';
                element.style.boxShadow = '0 0 0 4px rgba(249, 115, 22, 0.5), 0 0 0 8px rgba(249, 115, 22, 0.2)';
                element.style.borderRadius = '8px';
                setHighlightedElement(element);
                
                // Scroll to element
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    const removeHighlight = () => {
        if (highlightedElement) {
            highlightedElement.style.position = '';
            highlightedElement.style.zIndex = '';
            highlightedElement.style.boxShadow = '';
            highlightedElement.style.borderRadius = '';
            setHighlightedElement(null);
        }
    };

    const nextStep = () => {
        const currentStepData = TOUR_STEPS[currentStep];
        
        // Handle special actions
        if (currentStepData.action === 'open-form') {
            onOpenForm?.();
        }
        
        // Fill example data
        if (currentStepData.example && currentStepData.target) {
            const element = document.querySelector(currentStepData.target);
            if (element && element.tagName === 'INPUT') {
                element.value = currentStepData.example;
                element.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
        
        if (currentStep < TOUR_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            closeTour();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const closeTour = () => {
        removeHighlight();
        onClose();
        setCurrentStep(0);
    };

    const getTooltipPosition = (position) => {
        switch (position) {
            case 'top':
                return 'bottom-full mb-2';
            case 'bottom':
                return 'top-full mt-2';
            case 'left':
                return 'right-full mr-2';
            case 'right':
                return 'left-full ml-2';
            default:
                return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
        }
    };

    const getTooltipArrow = (position) => {
        switch (position) {
            case 'top':
                return 'top-full left-1/2 transform -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white';
            case 'bottom':
                return 'bottom-full left-1/2 transform -translate-x-1/2 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white';
            case 'left':
                return 'left-full top-1/2 transform -translate-y-1/2 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-white';
            case 'right':
                return 'right-full top-1/2 transform -translate-y-1/2 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white';
            default:
                return 'hidden';
        }
    };

    if (!isOpen) return null;

    const step = TOUR_STEPS[currentStep];
    const isCenter = step.position === 'center';

    return h('div', {
        className: 'fixed inset-0 z-50 tour-overlay'
    }, [
        // Backdrop
        h('div', {
            key: 'backdrop',
            className: 'absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm'
        }),
        
        // Tooltip
        h('div', {
            key: 'tooltip',
            className: `absolute z-50 ${
                isCenter 
                    ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' 
                    : getTooltipPosition(step.position)
            }`,
            style: isCenter ? {} : step.target ? (() => {
                const element = document.querySelector(step.target);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const scrollTop = window.pageYOffset;
                    const scrollLeft = window.pageXOffset;
                    
                    switch (step.position) {
                        case 'top':
                            return {
                                top: rect.top + scrollTop - 10,
                                left: rect.left + scrollLeft + rect.width / 2,
                                transform: 'translateX(-50%)'
                            };
                        case 'bottom':
                            return {
                                top: rect.bottom + scrollTop + 10,
                                left: rect.left + scrollLeft + rect.width / 2,
                                transform: 'translateX(-50%)'
                            };
                        case 'left':
                            return {
                                top: rect.top + scrollTop + rect.height / 2,
                                left: rect.left + scrollLeft - 10,
                                transform: 'translateY(-50%)'
                            };
                        case 'right':
                            return {
                                top: rect.top + scrollTop + rect.height / 2,
                                left: rect.right + scrollLeft + 10,
                                transform: 'translateY(-50%)'
                            };
                        default:
                            return {};
                    }
                }
                return {};
            })() : {}
        }, [
            // Tooltip content
            h('div', {
                className: 'bg-white rounded-xl shadow-2xl border border-gray-200 p-6 max-w-sm relative',
                style: { minWidth: '300px' }
            }, [
                // Arrow
                !isCenter && h('div', {
                    key: 'arrow',
                    className: `absolute w-0 h-0 ${getTooltipArrow(step.position)}`
                }),
                
                // Header
                h('div', {
                    key: 'header',
                    className: 'flex items-center justify-between mb-4'
                }, [
                    h('div', {
                        className: 'flex items-center space-x-3'
                    }, [
                        h('div', {
                            className: 'w-10 h-10 bg-gradient-to-r from-brand-orange-500 to-brand-orange-600 rounded-xl flex items-center justify-center'
                        }, [
                            h('span', {
                                className: 'material-icons text-white text-lg'
                            }, 'school')
                        ]),
                        h('div', {}, [
                            h('h3', {
                                className: 'font-bold text-gray-900'
                            }, step.title),
                            h('p', {
                                className: 'text-xs text-gray-500'
                            }, `Stap ${currentStep + 1} van ${TOUR_STEPS.length}`)
                        ])
                    ]),
                    
                    h('button', {
                        className: 'p-2 hover:bg-gray-100 rounded-lg transition-colors',
                        onClick: closeTour
                    }, [
                        h('span', {
                            className: 'material-icons text-gray-400'
                        }, 'close')
                    ])
                ]),
                
                // Content
                h('div', {
                    key: 'content',
                    className: 'mb-6'
                }, [
                    h('p', {
                        className: 'text-gray-700 text-sm leading-relaxed'
                    }, step.content),
                    
                    // Show example if available
                    step.example && h('div', {
                        key: 'example',
                        className: 'mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200'
                    }, [
                        h('p', {
                            className: 'text-xs text-blue-600 font-medium mb-1'
                        }, 'Voorbeeld:'),
                        h('code', {
                            className: 'text-sm text-blue-800 font-mono'
                        }, step.example)
                    ])
                ]),
                
                // Progress bar
                h('div', {
                    key: 'progress',
                    className: 'mb-4'
                }, [
                    h('div', {
                        className: 'w-full bg-gray-200 rounded-full h-2'
                    }, [
                        h('div', {
                            className: 'bg-gradient-to-r from-brand-orange-500 to-brand-orange-600 h-2 rounded-full transition-all duration-300',
                            style: { width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }
                        })
                    ])
                ]),
                
                // Navigation buttons
                h('div', {
                    key: 'navigation',
                    className: 'flex justify-between items-center'
                }, [
                    h('button', {
                        className: 'btn-modern bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 text-sm disabled:opacity-50',
                        onClick: prevStep,
                        disabled: currentStep === 0
                    }, [
                        h('span', {
                            className: 'material-icons text-sm'
                        }, 'arrow_back'),
                        'Vorige'
                    ]),
                    
                    h('div', {
                        className: 'flex space-x-2'
                    }, [
                        h('button', {
                            className: 'btn-modern bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 text-sm',
                            onClick: closeTour
                        }, 'Sluiten'),
                        
                        h('button', {
                            className: 'btn-modern btn-secondary px-4 py-2 text-sm',
                            onClick: nextStep
                        }, [
                            currentStep === TOUR_STEPS.length - 1 ? 'Voltooien' : 'Volgende',
                            h('span', {
                                className: 'material-icons text-sm'
                            }, currentStep === TOUR_STEPS.length - 1 ? 'check' : 'arrow_forward')
                        ])
                    ])
                ])
            ])
        ])
    ]);
}

// Tour trigger button component
export function TourTriggerButton({ onClick, className = '' }) {
    return h('button', {
        className: `btn-modern bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm ${className}`,
        onClick,
        title: 'Start interactieve tour'
    }, [
        h('span', {
            className: 'material-icons text-sm'
        }, 'help'),
        'Tour'
    ]);
}