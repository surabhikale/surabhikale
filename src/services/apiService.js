export const fetchGet = async (url, headers = {}) => {
  try {
    const response = await fetch(`${url}`, {
      method: 'GET',
      headers: {
        ...headers,
      },
    });
    if (!response.ok) {
      throw new Error('API request failed');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchPost = async (url, headers, body) => {
  try {
    const response = await fetch(`${url}`, {
      method: 'POST',
      headers: {
        ...headers,
      },
      body: body ? JSON.stringify(body) : null,
    });
    if (!response.ok) {
      throw new Error('API request failed');
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
