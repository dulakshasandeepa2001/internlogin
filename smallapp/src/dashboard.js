import "./App.css";
import "./dashboard.css";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [, setData] = useState(null);
    const [formsData, setFormsData] = useState(null);
    const [templateData, setTemplateData] = useState(null);
    const [sectionData, setSectionData] = useState(null);
    const [activeCategory, setActiveCategory] = useState('forms');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createType, setCreateType] = useState('');
    const [newItemName, setNewItemName] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const handleLogout = () => {
        navigate('/');
    };

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch forms and folders
                const [formsResponse, foldersResponse] = await Promise.all([
                    fetch('http://xgendev.ddns.net:100/scws/persistence/api/v1/form'),
                    fetch('http://xgendev.ddns.net:100/scws/persistence/api/v1/form/folder')
                ]);

                let formItems = [];
                let folderItems = [];

                if (formsResponse.ok) {
                    const formsResult = await formsResponse.json();
                    console.log('Forms API Data:', formsResult);
                    if (Array.isArray(formsResult)) {
                        formItems = formsResult;
                    } else if (formsResult && formsResult.data) {
                        formItems = Array.isArray(formsResult.data) ? formsResult.data : [];
                    }
                }

                if (foldersResponse.ok) {
                    const foldersResult = await foldersResponse.json();
                    console.log('Folders API Data:', foldersResult);
                    if (Array.isArray(foldersResult)) {
                        folderItems = foldersResult;
                    } else if (foldersResult && foldersResult.data) {
                        folderItems = Array.isArray(foldersResult.data) ? foldersResult.data : [];
                    }
                }

                // Combine forms and folders
                const combinedData = [...folderItems, ...formItems];
                console.log('Combined Forms Data:', combinedData);
                console.log('Folder items count:', folderItems.length);
                console.log('Form items count:', formItems.length);
                console.log('Total combined count:', combinedData.length);
                
                setData(combinedData);
                setFormsData(combinedData);
            } catch (error) {
                console.error('Error fetching forms data:', error);
                // Set empty array to show sample data as fallback
                setFormsData([]);
            }
        };

        const fetchTemplateData = async () => {
            try {
                const response = await fetch('http://xgendev.ddns.net:100/scws/persistence/api/v1/form/template');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                console.log('Template API Data:', result);
                
                let items = [];
                if (Array.isArray(result)) {
                    items = result;
                } else if (result && result.data && Array.isArray(result.data)) {
                    items = result.data;
                }
                
                console.log('Template items count:', items.length);
                setTemplateData(items);
            } catch (error) {
                console.error('Error fetching template data:', error);
                setTemplateData([]);
            }
        };

        const fetchSectionData = async () => {
            try {
                const response = await fetch('http://xgendev.ddns.net:100/scws/persistence/api/v1/form/section');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                console.log('Section API Data:', result);
                
                let items = [];
                if (Array.isArray(result)) {
                    items = result;
                } else if (result && result.data && Array.isArray(result.data)) {
                    items = result.data;
                }
                
                console.log('Section items count:', items.length);
                setSectionData(items);
            } catch (error) {
                console.error('Error fetching section data:', error);
                setSectionData([]);
            }
        };

        fetchData();
        fetchTemplateData();
        fetchSectionData();
    }, []);

    const handleCreateClick = (type) => {
        setCreateType(type);
        setNewItemName('');
        setShowCreateModal(true);
    };

    const handleCreateCancel = () => {
        setShowCreateModal(false);
        setCreateType('');
        setNewItemName('');
    };

    const handleCreateSubmit = async () => {
        if (!newItemName.trim()) return;
        
        try {
            const requestBody = {
                title: newItemName,
                dataKey: Date.now().toString(),
                type: createType,
                subtype: activeCategory,
                lastModified: Date.now(),
                children: []
            };

            console.log('Creating item for category:', activeCategory, requestBody);

            // Determine the correct API endpoint based on category
            let createUrl = 'http://xgendev.ddns.net:100/scws/persistence/api/v1/form';
            if (activeCategory === 'template') {
                createUrl = 'http://xgendev.ddns.net:100/scws/persistence/api/v1/form/template';
            } else if (activeCategory === 'section') {
                createUrl = 'http://xgendev.ddns.net:100/scws/persistence/api/v1/form/section';
            }

            const response = await fetch(createUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Created successfully:', result);
                
                // Refresh data based on active category
                if (activeCategory === 'forms') {
                    const refreshData = async () => {
                        try {
                            const [formsResponse, foldersResponse] = await Promise.all([
                                fetch('http://xgendev.ddns.net:100/scws/persistence/api/v1/form'),
                                fetch('http://xgendev.ddns.net:100/scws/persistence/api/v1/form/folder')
                            ]);

                            let formItems = [];
                            let folderItems = [];

                            if (formsResponse.ok) {
                                const formsResult = await formsResponse.json();
                                if (Array.isArray(formsResult)) {
                                    formItems = formsResult;
                                } else if (formsResult && formsResult.data) {
                                    formItems = Array.isArray(formsResult.data) ? formsResult.data : [];
                                }
                            }

                            if (foldersResponse.ok) {
                                const foldersResult = await foldersResponse.json();
                                if (Array.isArray(foldersResult)) {
                                    folderItems = foldersResult;
                                } else if (foldersResult && foldersResult.data) {
                                    folderItems = Array.isArray(foldersResult.data) ? foldersResult.data : [];
                                }
                            }

                            const combinedData = [...folderItems, ...formItems];
                            setFormsData(combinedData);
                        } catch (error) {
                            console.error('Error refreshing forms data:', error);
                        }
                    };
                    await refreshData();
                } else if (activeCategory === 'template') {
                    const response = await fetch('http://xgendev.ddns.net:100/scws/persistence/api/v1/form/template');
                    if (response.ok) {
                        const result = await response.json();
                        let items = Array.isArray(result) ? result : (result.data || []);
                        setTemplateData(items);
                    }
                } else if (activeCategory === 'section') {
                    const response = await fetch('http://xgendev.ddns.net:100/scws/persistence/api/v1/form/section');
                    if (response.ok) {
                        const result = await response.json();
                        let items = Array.isArray(result) ? result : (result.data || []);
                        setSectionData(items);
                    }
                }
            } else {
                console.error('Failed to create:', response.statusText);
                const errorText = await response.text();
                console.error('Error details:', errorText);
            }
        } catch (error) {
            console.error('Error creating item:', error);
        }

        setShowCreateModal(false);
        setCreateType('');
        setNewItemName('');
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setItemToDelete(null);
    };

    const handleDeleteConfirm = async () => {
        if (!itemToDelete) return;
        
        try {
            const dataKey = itemToDelete.dataKey || itemToDelete.id || Date.now().toString();
            console.log('Deleting item with dataKey:', dataKey, 'from category:', activeCategory);
            
            // Determine the correct endpoint based on item type and category
            let deleteUrl;
            
            if (activeCategory === 'forms') {
                if (itemToDelete.type === 'folder' || getItemIcon(itemToDelete) === '📁') {
                    deleteUrl = `http://xgendev.ddns.net:100/scws/persistence/api/v1/form/folder?dataKey=${dataKey}`;
                } else {
                    deleteUrl = `http://xgendev.ddns.net:100/scws/persistence/api/v1/form?dataKey=${dataKey}`;
                }
            } else if (activeCategory === 'template') {
                if (itemToDelete.type === 'folder') {
                    deleteUrl = `http://xgendev.ddns.net:100/scws/persistence/api/v1/form/template/folder?dataKey=${dataKey}`;
                } else {
                    deleteUrl = `http://xgendev.ddns.net:100/scws/persistence/api/v1/form/template?dataKey=${dataKey}`;
                }
            } else if (activeCategory === 'section') {
                if (itemToDelete.type === 'folder') {
                    deleteUrl = `http://xgendev.ddns.net:100/scws/persistence/api/v1/form/section/folder?dataKey=${dataKey}`;
                } else {
                    deleteUrl = `http://xgendev.ddns.net:100/scws/persistence/api/v1/form/section?dataKey=${dataKey}`;
                }
            }
            
            console.log('Delete URL:', deleteUrl);
            
            const response = await fetch(deleteUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.ok) {
                console.log('Deleted successfully');
                
                // Remove item from UI state immediately
                const updateStateData = (prevData) => {
                    if (!prevData) return prevData;
                    return prevData.filter(item => 
                        (item.dataKey || item.id) !== (itemToDelete.dataKey || itemToDelete.id)
                    );
                };
                
                // Update the appropriate state based on active category
                switch(activeCategory) {
                    case 'forms':
                        setFormsData(updateStateData);
                        setData(updateStateData);
                        break;
                    case 'template':
                        setTemplateData(updateStateData);
                        break;
                    case 'section':
                        setSectionData(updateStateData);
                        break;
                    default:
                        console.log('Unknown category for delete:', activeCategory);
                        break;
                }
                
                // Refresh data from API to stay in sync
                if (activeCategory === 'forms') {
                    const refreshData = async () => {
                        try {
                            const [formsResponse, foldersResponse] = await Promise.all([
                                fetch('http://xgendev.ddns.net:100/scws/persistence/api/v1/form'),
                                fetch('http://xgendev.ddns.net:100/scws/persistence/api/v1/form/folder')
                            ]);

                            let formItems = [];
                            let folderItems = [];

                            if (formsResponse.ok) {
                                const formsResult = await formsResponse.json();
                                if (Array.isArray(formsResult)) {
                                    formItems = formsResult;
                                } else if (formsResult && formsResult.data) {
                                    formItems = Array.isArray(formsResult.data) ? formsResult.data : [];
                                }
                            }

                            if (foldersResponse.ok) {
                                const foldersResult = await foldersResponse.json();
                                if (Array.isArray(foldersResult)) {
                                    folderItems = foldersResult;
                                } else if (foldersResult && foldersResult.data) {
                                    folderItems = Array.isArray(foldersResult.data) ? foldersResult.data : [];
                                }
                            }

                            const combinedData = [...folderItems, ...formItems];
                            setFormsData(combinedData);
                        } catch (error) {
                            console.error('Error refreshing data after delete:', error);
                        }
                    };
                    await refreshData();
                } else if (activeCategory === 'template') {
                    const response = await fetch('http://xgendev.ddns.net:100/scws/persistence/api/v1/form/template');
                    if (response.ok) {
                        const result = await response.json();
                        let items = Array.isArray(result) ? result : (result.data || []);
                        setTemplateData(items);
                    }
                } else if (activeCategory === 'section') {
                    const response = await fetch('http://xgendev.ddns.net:100/scws/persistence/api/v1/form/section');
                    if (response.ok) {
                        const result = await response.json();
                        let items = Array.isArray(result) ? result : (result.data || []);
                        setSectionData(items);
                    }
                }
            } else {
                console.error('Failed to delete:', response.statusText);
                const errorText = await response.text();
                console.error('Error details:', errorText);
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
        
        setShowDeleteModal(false);
        setItemToDelete(null);
    };

    const getItemIcon = (item) => {
        // Check if it's a folder
        if (item.type === 'folder' || 
            item.children || 
            item.items || 
            item.itemCount !== undefined ||
            (item.type && item.type.toLowerCase().includes('folder'))) {
            return '📁'; // Folder icon
        }
        // Check if it's a section
        if (item.type === 'section' || activeCategory === 'section') {
            return '🗂️'; // Section/tabs icon
        }
        // Check if it's a template
        if (item.type === 'template' || activeCategory === 'template') {
            return '📄'; // Template document icon
        }
        // Otherwise it's a form
        return '📄'; // Form document icon
    };

    const renderCategoryContent = () => {
        let currentData = null;
        
        switch(activeCategory) {
            case 'forms':
                currentData = formsData;
                break;
            case 'template':
                currentData = templateData;
                break;
            case 'section':
                currentData = sectionData;
                break;
            default:
                currentData = null;
        }

        if (!currentData || (Array.isArray(currentData) && currentData.length === 0)) {
            return (
                <div className="content-area">
                    <div className="content-header">
                        <h2>{activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}</h2>
                        <div className="create-buttons">
                            <button 
                                className="create-btn create-file-btn"
                                onClick={() => handleCreateClick('file')}
                            >
                                Create File
                            </button>
                            <button 
                                className="create-btn create-folder-btn"
                                onClick={() => handleCreateClick('folder')}
                            >
                                Create Folder
                            </button>
                        </div>
                    </div>
                    <div className="folder-grid">
                        {/* Empty state - no items to show */}
                    </div>
                </div>
            );
        }

        // Handle different data structures from API
        let items = [];
        
        if (Array.isArray(currentData)) {
            items = currentData;
        } else if (currentData && typeof currentData === 'object') {
            // If it's an object, try to extract items from common properties
            if (currentData.data && Array.isArray(currentData.data)) {
                items = currentData.data;
            } else if (currentData.items && Array.isArray(currentData.items)) {
                items = currentData.items;
            } else if (currentData.forms && Array.isArray(currentData.forms)) {
                items = currentData.forms;
            } else if (currentData.content && Array.isArray(currentData.content)) {
                items = currentData.content;
            } else if (currentData.results && Array.isArray(currentData.results)) {
                items = currentData.results;
            } else {
                // If no array found, treat the object itself as a single item
                items = [currentData];
            }
        }

        // Debug log to see what we're working with
        console.log('Current data type:', typeof currentData);
        console.log('Is array?:', Array.isArray(currentData));
        console.log('Extracted items:', items);
        console.log('Items length:', items.length);

        // Process API data to match our expected format
        if (items.length > 0) {
            items = items.map(item => {
                // Determine item type based on API data structure
                let itemType = 'form'; // default
                
                if (activeCategory === 'forms') {
                    // For forms category, check if it has children or is explicitly a folder
                    if (item.type === 'folder' || item.children !== undefined || item.itemCount !== undefined) {
                        itemType = 'folder';
                    } else {
                        itemType = 'form';
                    }
                } else if (activeCategory === 'template') {
                    // For templates, check if it's a folder or template
                    if (item.type === 'folder' || item.children !== undefined || item.itemCount !== undefined) {
                        itemType = 'folder';
                    } else {
                        itemType = 'template';
                    }
                } else if (activeCategory === 'section') {
                    // For sections, check if it's a folder or section
                    if (item.type === 'folder' || item.children !== undefined || item.itemCount !== undefined) {
                        itemType = 'folder';
                    } else {
                        itemType = 'section';
                    }
                }
                
                return {
                    name: item.title || item.name || item.id || 'Unnamed',
                    type: itemType,
                    category: activeCategory.toUpperCase(),
                    itemCount: item.children ? item.children.length : item.itemCount,
                    id: item.id || item.dataKey,
                    dataKey: item.dataKey || item.id,
                    created: item.lastModified ? new Date(item.lastModified) : undefined,
                    ...item
                };
            });
            
            console.log('Processed API items for', activeCategory, ':', items);
        } else {
            console.log('No API data available for', activeCategory);
        }

        // Only show real API data - no sample data mixing
        console.log('Final items to render:', items);

        console.log('Rendering items:', items);

        // Function to get item count for folders
        const getItemCount = (item) => {
            if (item.itemCount !== undefined) return `${item.itemCount} ${item.itemCount === 1 ? 'item' : 'items'}`;
            if (item.children) return `${item.children.length} items`;
            if (item.items && typeof item.items === 'number') return `${item.items} items`;
            return '';
        };

        return (
            <div className="content-area">
                <div className="content-header">
                    <h2>{activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}</h2>
                    <div className="create-buttons">
                        <button 
                            className="create-btn create-file-btn"
                            onClick={() => handleCreateClick('file')}
                        >
                            Create File
                        </button>
                        <button 
                            className="create-btn create-folder-btn"
                            onClick={() => handleCreateClick('folder')}
                        >
                            Create Folder
                        </button>
                    </div>
                </div>
                <div className="folder-grid">
                    {items.map((item, index) => {
                        const isFolder = getItemIcon(item) === '📁';
                        const isTemplate = item.type === 'template' || activeCategory === 'template';
                        const isSection = item.type === 'section' || activeCategory === 'section';
                        const itemCount = getItemCount(item);
                        
                        let itemClass = 'folder-item';
                        if (isFolder) {
                            itemClass += ' folder-type';
                        } else if (isSection) {
                            itemClass += ' section-type';
                        } else if (isTemplate) {
                            itemClass += ' template-type';
                        } else {
                            itemClass += ' form-type';
                        }
                        
                        return (
                            <div key={index} className={itemClass}>
                                <div className="folder-icon">
                                    {getItemIcon(item)}
                                </div>
                                <div className="folder-name">
                                    {item.name || item.title || item.id || `${activeCategory} ${index + 1}`}
                                </div>
                                <div className="folder-details">
                                    {isFolder && itemCount && (
                                        <span className="item-count">{itemCount}</span>
                                    )}
                                    {!isFolder && item.category && (
                                        <span className="form-category">{item.category}</span>
                                    )}
                                    {item.tag && (
                                        <span className="form-tag">{item.tag}</span>
                                    )}
                                    {item.created && <span className="folder-date">{new Date(item.created).toLocaleDateString()}</span>}
                                </div>
                                <div className="folder-actions">
                                    <button 
                                        className="delete-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClick(item);
                                        }}
                                        title="Delete"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {/* Create Modal */}
                {showCreateModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>{createType === 'folder' ? 'Folder Name:' : 'File Name:'}</h3>
                            <input 
                                type="text"
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                placeholder={createType === 'folder' ? 'New Folder' : 'New File'}
                                className="modal-input"
                                autoFocus
                            />
                            <div className="modal-buttons">
                                <button 
                                    className="modal-btn add-btn"
                                    onClick={handleCreateSubmit}
                                >
                                    Add
                                </button>
                                <button 
                                    className="modal-btn cancel-btn"
                                    onClick={handleCreateCancel}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="modal-overlay">
                        <div className="modal-content delete-modal">
                            <h3>Confirm Delete</h3>
                            <p>Are you sure you want to delete "{itemToDelete?.name || itemToDelete?.title || 'this item'}"?</p>
                            <p className="warning-text">This action cannot be undone.</p>
                            <div className="modal-buttons">
                                <button 
                                    className="modal-btn delete-confirm-btn"
                                    onClick={handleDeleteConfirm}
                                >
                                    Delete
                                </button>
                                <button 
                                    className="modal-btn cancel-btn"
                                    onClick={handleDeleteCancel}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

   


    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="header-left">
                    <div className="logo">
                       
                        <h1>X GEN</h1>
                    </div>
                </div>
               
                <div className="header-right ">
                    <div className="search-container">
                        <span className="search-icon">🔍</span>
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            className="search-bar"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    <button className="logout-btn" onClick={handleLogout}>
                        Log Out
                    </button>
                </div>
            </header>
            
            <div className="dashboard-content">
                <div className="sidebar">
                    <div className="category-buttons">
                        <button 
                            className={`category-btn ${activeCategory === 'forms' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('forms')}
                        >
                            Forms
                        </button>
                        <button 
                            className={`category-btn ${activeCategory === 'template' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('template')}
                        >
                            Template
                        </button>
                        <button 
                            className={`category-btn ${activeCategory === 'section' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('section')}
                        >
                            Section
                        </button>
                    </div>
                </div>
                
                <div className="main-content">
                    {renderCategoryContent()}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;