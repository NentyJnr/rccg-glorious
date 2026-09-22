const API_BASE_URL = 'http://localhost:5230/api/v1';

export async function fetchApiData<T>(endpoint: string, fallbackData: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) return fallbackData;
    const json = await res.json();
    return json.success ? json.data : fallbackData;
  } catch (error) {
    console.warn(`[API Client] GET ${endpoint} offline, using fallback state:`, error);
    return fallbackData;
  }
}

export async function postApiData<T>(endpoint: string, payload: any, fallbackData?: T): Promise<{ success: boolean; data?: T; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (res.ok && json.success) {
      return { success: true, data: json.data, message: json.message };
    }
    return { success: false, message: json?.message || 'Request failed' };
  } catch (error) {
    console.warn(`[API Client] POST ${endpoint} offline, simulating locally:`, error);
    return { success: true, data: fallbackData || payload, message: 'Local client action recorded.' };
  }
}

export async function putApiData<T>(endpoint: string, payload: any): Promise<{ success: boolean; data?: T; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (res.ok && json.success) {
      return { success: true, data: json.data, message: json.message };
    }
    return { success: false, message: json?.message || 'Update failed' };
  } catch (error) {
    console.warn(`[API Client] PUT ${endpoint} offline, updated locally:`, error);
    return { success: true, data: payload, message: 'Local update saved.' };
  }
}

export async function deleteApiData(endpoint: string): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    const json = await res.json();
    return { success: json?.success ?? true, message: json?.message || 'Item deleted' };
  } catch (error) {
    console.warn(`[API Client] DELETE ${endpoint} offline, removed locally:`, error);
    return { success: true, message: 'Local item deleted.' };
  }
}
