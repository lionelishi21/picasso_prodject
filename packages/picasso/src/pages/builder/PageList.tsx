/**
 * PageList.tsx
 * Component for displaying and managing pages within a site
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getSitePages, 
  createPage, 
  deletePage,
  clonePage
} from '../../store/slices/pageSlice';
import { getSiteById } from '../../store/slices/siteSlice';
import type { AppDispatch, RootState } from '../../store/index';

// TypeScript interfaces
interface RouteParams {
  [key: string]: string | undefined;
  siteId: string;
}

interface Component {
  id: string;
  type: string;
  props: Record<string, unknown>;
}

interface Page {
  _id: string;
  name: string;
  path: string;
  title?: string;
  description?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  components: Component[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
  };
}

interface CreatePageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (pageData: Partial<Page>) => void;
  isCreating: boolean;
}

const CreatePageModal: React.FC<CreatePageModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isCreating 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    path: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSubmit({
        ...formData,
        path: formData.path || `/${formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`
      });
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      path: prev.path || `/${name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`
    }));
  };

  useEffect(() => {
    if (!isOpen) {
      setFormData({ name: '', path: '', description: '' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Page</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Page Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleNameChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter page name"
                required
                autoFocus
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="path" className="block text-sm font-medium text-gray-700 mb-1">
                URL Path
              </label>
              <input
                type="text"
                id="path"
                value={formData.path}
                onChange={(e) => setFormData(prev => ({ ...prev, path: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="/page-url-path"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to auto-generate from name
              </p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of the page"
                rows={3}
              />
            </div>
            
            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={isCreating}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formData.name.trim() || isCreating}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Creating...' : 'Create Page'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const PageList: React.FC = () => {
  const { siteId = '' } = useParams<RouteParams>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  // Get data from Redux store
  const { pages, isLoading: pagesLoading, isError: pagesError, message: pagesMessage } = useSelector((state: RootState) => state.page);
  const { currentSite, isLoading: siteLoading } = useSelector((state: RootState) => state.site);
  
  console.log('pages', pages);
  // Local state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [deletingPageId, setDeletingPageId] = useState<string | null>(null);
  const [duplicatingPageId, setDuplicatingPageId] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  // Load initial data
  useEffect(() => {
    if (siteId && !dataLoaded) {
      // dispatch(getSiteById(siteId));
      dispatch(getSitePages({ 
        siteId, 
        options: {}     // or whatever config you actually need 
      }));
      setDataLoaded(true);
    }
  }, [dispatch, siteId, dataLoaded]);

  // Reset dataLoaded when siteId changes
  useEffect(() => {
    setDataLoaded(false);
  }, [siteId]);

  // Filter pages based on search and status
  const filteredPages = pages.filter((page: Page) => {
    const matchesSearch = page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (page.description && page.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'published' && page.published) ||
                         (filterStatus === 'draft' && !page.published);
    
    return matchesSearch && matchesStatus;
  });

  // Handle create page
  const handleCreatePage = async (pageData: Partial<Page>) => {
    setIsCreating(true);
    try {
      const newPageData = {
        ...pageData,
        site: siteId,
        published: false,
        components: []
      };
      
      const newPage = await dispatch(createPage(newPageData)).unwrap();
      
      setShowCreateModal(false);
      // Navigate to the new page editor
      navigate(`/builder/${siteId}/pages/${newPage._id}`);
    } catch (error) {
      console.error('Failed to create page:', error);
    } finally {
      setIsCreating(false);
    }
  };

  // Handle delete page
  const handleDeletePage = async (pageId: string) => {
    if (window.confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
      setDeletingPageId(pageId);
      try {
        await dispatch(deletePage(pageId)).unwrap();
      } catch (error) {
        console.error('Failed to delete page:', error);
      } finally {
        setDeletingPageId(null);
      }
    }
  };

  // Handle duplicate page
  const handleDuplicatePage = async (pageId: string) => {
    const originalPage = pages.find((p: Page) => p._id === pageId);
    if (!originalPage) return;

    setDuplicatingPageId(pageId);
    try {
      const duplicatedPage = await dispatch(clonePage({
        pageId,
        name: `${originalPage.name} (Copy)`,
        path: `${originalPage.path}-copy`
      })).unwrap();
      
      // Optionally navigate to the duplicated page
      navigate(`/builder/${siteId}/pages/${duplicatedPage._id}`);
    } catch (error) {
      console.error('Failed to duplicate page:', error);
    } finally {
      setDuplicatingPageId(null);
    }
  };

  // Handle edit page
  const handleEditPage = (pageId: string) => {
    navigate(`/builder/${siteId}/pages/${pageId}`);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isLoading = pagesLoading || siteLoading;

  // if (isLoading) {
  //   return (
  //     <div className="h-full flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
  //         <p className="text-gray-600">Loading pages...</p>
  //       </div>
  //     </div>
  //   );
  // }

  if (pagesError) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-2">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-gray-600">Failed to load pages</p>
          <p className="text-sm text-gray-500 mb-4">{pagesMessage}</p>
          <button
            onClick={() => {
              dispatch(getSitePages(siteId));
            }}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Pages</h1>
            {currentSite && (
              <p className="text-sm text-gray-600 mt-1">
                Managing pages for <span className="font-medium">{currentSite.name}</span>
              </p>
            )}
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Page
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search pages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'published' | 'draft')}
              className="block px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Pages</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-500">
            {filteredPages.length} of {pages.length} pages
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {filteredPages.length === 0 ? (
          <div className="text-center py-12">
            {pages.length === 0 ? (
              <>
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No pages</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating your first page.</p>
                <div className="mt-6">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Page
                  </button>
                </div>
              </>
            ) : (
              <>
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No pages found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
              </>
            )}
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md mx-6 my-6">
            <ul className="divide-y divide-gray-200">
              {filteredPages.map((page: Page) => (
                <li key={page._id}>
                  <div className="px-4 py-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`w-2 h-2 rounded-full ${page.published ? 'bg-green-400' : 'bg-yellow-400'}`} />
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {page.name}
                          </p>
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            page.published 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {page.published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-gray-600">
                            {page.path}
                          </p>
                          {page.description && (
                            <p className="text-sm text-gray-500 mt-1">
                              {page.description}
                            </p>
                          )}
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <p>
                            Updated {formatDate(page.updatedAt)}
                          </p>
                          <span className="mx-2">•</span>
                          <p>
                            {page.components.length} component{page.components.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditPage(page._id)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      
                      <button
                        onClick={() => handleDuplicatePage(page._id)}
                        disabled={duplicatingPageId === page._id}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {duplicatingPageId === page._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                        ) : (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleDeletePage(page._id)}
                        disabled={deletingPageId === page._id}
                        className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                      >
                        {deletingPageId === page._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Create Page Modal */}
      <CreatePageModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreatePage}
        isCreating={isCreating}
      />
    </div>
  );
};

export default PageList;