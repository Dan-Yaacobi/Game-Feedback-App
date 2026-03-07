import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

const camelToSnakeKeyMap = {
  reportType: 'report_type',
  playerEmail: 'player_email',
  playerName: 'player_name',
  screenshotUrl: 'screenshot_url',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};

function normalizeKeys(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeKeys);
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  return Object.entries(value).reduce((acc, [key, nestedValue]) => {
    const normalizedKey = camelToSnakeKeyMap[key] || key;
    acc[normalizedKey] = normalizeKeys(nestedValue);
    return acc;
  }, {});
}

apiClient.interceptors.response.use((response) => {
  const payload = response.data;

  if (payload && typeof payload === 'object' && payload.success === true && 'data' in payload) {
    const normalizedData = normalizeKeys(payload.data);

    response.data = Array.isArray(normalizedData)
      ? {
          reports: normalizedData,
        }
      : normalizedData;
  }

  return response;
});

export default apiClient;
