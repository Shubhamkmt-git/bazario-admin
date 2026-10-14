const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const adminApi = async (endpoint, options = {}) => {
  const token = localStorage.getItem('bazario_admin_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // If body is FormData, delete Content-Type to let browser set boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (response.status === 401) {
      localStorage.removeItem('bazario_admin_token');
      localStorage.removeItem('bazario_admin_auth');
      window.dispatchEvent(new Event('bazario_admin_unauthorized'));
      throw new Error(data.message || 'Session expired. Please log in again.');
    }

    if (!response.ok) {
      throw new Error(data.message || `API error: ${response.status}`);
    }

    return data;
  } catch (err) {
    console.error(`[Admin API Error] ${endpoint}:`, err);
    throw err;
  }
};

// 1. Auth APIs
export const adminLoginApi = async (email, password) => {
  const res = await adminApi('/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (res.token) {
    localStorage.setItem('bazario_admin_token', res.token);
    localStorage.setItem('bazario_admin_auth', 'true');
    if (res.admin) {
      localStorage.setItem('bazario_admin_user', JSON.stringify(res.admin));
    }
  }
  return res;
};

export const getAdminMeApi = async () => {
  return await adminApi('/admin/auth/me');
};

export const updateAdminMeApi = async (profileData) => {
  const res = await adminApi('/admin/auth/me', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
  if (res.admin) {
    localStorage.setItem('bazario_admin_user', JSON.stringify(res.admin));
  }
  return res;
};

// 2. Dashboard Analytics
export const getDashboardStatsApi = async () => {
  return await adminApi('/admin/dashboard/stats');
};

// 3. Products Management
export const getAdminProductsApi = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return await adminApi(`/admin/products${query ? `?${query}` : ''}`);
};

export const getAdminProductByIdApi = async (id) => {
  return await adminApi(`/admin/products/${id}`);
};

export const createAdminProductApi = async (productData) => {
  return await adminApi('/admin/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
};

export const updateAdminProductApi = async (id, productData) => {
  return await adminApi(`/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  });
};

export const deleteAdminProductApi = async (id) => {
  return await adminApi(`/admin/products/${id}`, {
    method: 'DELETE',
  });
};

// 4. Categories Management
export const getAdminCategoriesApi = async () => {
  return await adminApi('/admin/categories');
};

export const createAdminCategoryApi = async (categoryData) => {
  return await adminApi('/admin/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData),
  });
};

export const updateAdminCategoryApi = async (id, categoryData) => {
  return await adminApi(`/admin/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(categoryData),
  });
};

export const deleteAdminCategoryApi = async (id) => {
  return await adminApi(`/admin/categories/${id}`, {
    method: 'DELETE',
  });
};

// 5. Orders Management
export const getAdminOrdersApi = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return await adminApi(`/admin/orders${query ? `?${query}` : ''}`);
};

export const updateAdminOrderStatusApi = async (id, status, assignedRider = null, note = '') => {
  return await adminApi(`/admin/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, assignedRider, note }),
  });
};

// 6. Stores Management
export const getAdminStoresApi = async () => {
  return await adminApi('/admin/stores');
};

export const createAdminStoreApi = async (storeData) => {
  return await adminApi('/admin/stores', {
    method: 'POST',
    body: JSON.stringify(storeData),
  });
};

export const updateAdminStoreApi = async (id, storeData) => {
  return await adminApi(`/admin/stores/${id}`, {
    method: 'PUT',
    body: JSON.stringify(storeData),
  });
};

export const deleteAdminStoreApi = async (id) => {
  return await adminApi(`/admin/stores/${id}`, {
    method: 'DELETE',
  });
};

export const getStoreManagersApi = async (storeId) => {
  return await adminApi(`/admin/stores/${storeId}/managers`);
};

export const assignStoreManagerApi = async (storeId, data) => {
  return await adminApi(`/admin/stores/${storeId}/managers`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const unassignStoreManagerApi = async (storeId, staffId) => {
  return await adminApi(`/admin/stores/${storeId}/managers/${staffId}`, {
    method: 'DELETE',
  });
};

export const getStoreStaffApi = async (storeId) => {
  return await adminApi(`/admin/stores/${storeId}/staff`);
};

export const assignStoreStaffApi = async (storeId, data) => {
  return await adminApi(`/admin/stores/${storeId}/staff`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const unassignStoreStaffApi = async (storeId, staffId) => {
  return await adminApi(`/admin/stores/${storeId}/staff/${staffId}`, {
    method: 'DELETE',
  });
};

export const getStoreDeliveryStaffApi = async (storeId) => {
  return await adminApi(`/admin/stores/${storeId}/delivery-staff`);
};

export const assignStoreDeliveryStaffApi = async (storeId, data) => {
  return await adminApi(`/admin/stores/${storeId}/delivery-staff`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const unassignStoreDeliveryStaffApi = async (storeId, riderId) => {
  return await adminApi(`/admin/stores/${storeId}/delivery-staff/${riderId}`, {
    method: 'DELETE',
  });
};

// 7. Customers Management
export const getAdminCustomersApi = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return await adminApi(`/admin/customers${query ? `?${query}` : ''}`);
};

// 8. Staff & Delivery Staff
export const getAdminStaffApi = async () => {
  return await adminApi('/admin/staff');
};

export const getAdminDeliveryStaffApi = async () => {
  return await adminApi('/admin/delivery-staff');
};

// 9. Offers & Hero Banners
export const getAdminOffersApi = async () => {
  return await adminApi('/admin/offers');
};

export const createAdminOfferApi = async (offerData) => {
  return await adminApi('/admin/offers', {
    method: 'POST',
    body: JSON.stringify(offerData),
  });
};

export const deleteAdminOfferApi = async (id) => {
  return await adminApi(`/admin/offers/${id}`, {
    method: 'DELETE',
  });
};

export const getAdminHeroBannersApi = async () => {
  return await adminApi('/admin/hero-banners');
};

export const createAdminHeroBannerApi = async (bannerData) => {
  return await adminApi('/admin/hero-banners', {
    method: 'POST',
    body: JSON.stringify(bannerData),
  });
};

export const deleteAdminHeroBannerApi = async (id) => {
  return await adminApi(`/admin/hero-banners/${id}`, {
    method: 'DELETE',
  });
};

// 10. Settings & Web Content
export const getAdminSettingsApi = async () => {
  return await adminApi('/admin/settings');
};

export const updateAdminSettingsApi = async (settingsData) => {
  return await adminApi('/admin/settings', {
    method: 'PUT',
    body: JSON.stringify(settingsData),
  });
};

// 11. Image Upload
export const uploadImageApi = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return await adminApi('/upload', {
    method: 'POST',
    body: formData,
  });
};

// 12. Staff Management
export const createAdminStaffApi = async (staffData) => {
  return await adminApi('/admin/staff', {
    method: 'POST',
    body: JSON.stringify(staffData),
  });
};

export const updateAdminStaffApi = async (id, staffData) => {
  return await adminApi(`/admin/staff/${id}`, {
    method: 'PUT',
    body: JSON.stringify(staffData),
  });
};

export const deleteAdminStaffApi = async (id) => {
  return await adminApi(`/admin/staff/${id}`, {
    method: 'DELETE',
  });
};

// 13. RBAC (Users, Roles, Permissions)
export const getAdminUsersApi = async () => {
  return await adminApi('/admin/rbac/users');
};

export const createAdminUserApi = async (userData) => {
  return await adminApi('/admin/rbac/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const updateAdminUserApi = async (id, userData) => {
  return await adminApi(`/admin/rbac/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};

export const deleteAdminUserApi = async (id) => {
  return await adminApi(`/admin/rbac/users/${id}`, {
    method: 'DELETE',
  });
};

export const getAdminRolesApi = async () => {
  return await adminApi('/admin/roles');
};

export const createAdminRoleApi = async (roleData) => {
  return await adminApi('/admin/roles', {
    method: 'POST',
    body: JSON.stringify(roleData),
  });
};

export const updateAdminRoleApi = async (id, roleData) => {
  return await adminApi(`/admin/roles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(roleData),
  });
};

export const deleteAdminRoleApi = async (id) => {
  return await adminApi(`/admin/roles/${id}`, {
    method: 'DELETE',
  });
};

export const getAdminPermissionsApi = async () => {
  return await adminApi('/admin/permissions');
};

export const createAdminPermissionApi = async (permData) => {
  return await adminApi('/admin/permissions', {
    method: 'POST',
    body: JSON.stringify(permData),
  });
};

export const updateAdminPermissionApi = async (id, permData) => {
  return await adminApi(`/admin/permissions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(permData),
  });
};

export const deleteAdminPermissionApi = async (id) => {
  return await adminApi(`/admin/permissions/${id}`, {
    method: 'DELETE',
  });
};

// 14. Web Manager (TopBar, Careers, About, CTA, Home Sections)
export const getAdminTopBarApi = async () => {
  return await adminApi('/admin/web-manager/topbar');
};

export const createAdminTopBarApi = async (data) => {
  return await adminApi('/admin/web-manager/topbar', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateAdminTopBarApi = async (id, data) => {
  return await adminApi(`/admin/web-manager/topbar/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteAdminTopBarApi = async (id) => {
  return await adminApi(`/admin/web-manager/topbar/${id}`, {
    method: 'DELETE',
  });
};

export const getAdminCareersApi = async () => {
  return await adminApi('/admin/web-manager/careers');
};

export const createAdminCareerApi = async (data) => {
  return await adminApi('/admin/web-manager/careers', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateAdminCareerApi = async (id, data) => {
  return await adminApi(`/admin/web-manager/careers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteAdminCareerApi = async (id) => {
  return await adminApi(`/admin/web-manager/careers/${id}`, {
    method: 'DELETE',
  });
};

export const getAdminAboutApi = async () => {
  return await adminApi('/admin/web-manager/about');
};

export const updateAdminAboutApi = async (data) => {
  return await adminApi('/admin/web-manager/about', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const getAdminCtaApi = async () => {
  return await adminApi('/admin/web-manager/cta');
};

export const updateAdminCtaApi = async (data) => {
  return await adminApi('/admin/web-manager/cta', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const getAdminHomeSectionsApi = async () => {
  return await adminApi('/admin/web-manager/home-sections');
};

export const updateAdminHomeSectionsApi = async (data) => {
  return await adminApi('/admin/web-manager/home-sections', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// ============================================================================
// 12. STORE MANAGER PORTAL APIS (Stock Control, Branch Orders, Branch Ops)
// ============================================================================
export const storeManagerLoginApi = async (email, password) => {
  const res = await adminApi('/store-manager/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (res.token) {
    localStorage.setItem('bazario_admin_token', res.token);
    localStorage.setItem('bazario_admin_auth', 'true');
    const userObj = {
      ...(res.manager || {}),
      role: 'Store Manager',
      store: res.store
    };
    localStorage.setItem('bazario_admin_user', JSON.stringify(userObj));
  }
  return res;
};

export const getStoreManagerProfileApi = async () => {
  return await adminApi('/store-manager/auth/me');
};

export const getStoreInventoryApi = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return await adminApi(`/store-manager/inventory${query ? '?' + query : ''}`);
};

export const updateStoreProductStockApi = async (productId, data, storeId) => {
  const query = storeId ? `?storeId=${storeId}` : '';
  return await adminApi(`/store-manager/inventory/${productId}${query}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const adjustStoreStockApi = async (productId, adjustment, reason, storeId) => {
  const query = storeId ? `?storeId=${storeId}` : '';
  return await adminApi(`/store-manager/inventory/adjust${query}`, {
    method: 'POST',
    body: JSON.stringify({ productId, adjustment, reason, storeId }),
  });
};

export const getStoreOrdersApi = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return await adminApi(`/store-manager/orders${query ? '?' + query : ''}`);
};

export const updateStoreOrderStatusApi = async (orderId, data) => {
  return await adminApi(`/store-manager/orders/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const getStoreDetailsApi = async (storeId) => {
  const query = storeId ? `?storeId=${storeId}` : '';
  return await adminApi(`/store-manager/store${query}`);
};

export const updateStoreStatusApi = async (status, storeId) => {
  const query = storeId ? `?storeId=${storeId}` : '';
  return await adminApi(`/store-manager/store/status${query}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};

export const getStoreRidersApi = async () => {
  return await adminApi('/store-manager/riders');
};

export const getStorePackersApi = async () => {
  return await adminApi('/store-manager/packers');
};

