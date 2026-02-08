
export async function submitToIndexNow(host: string, key: string, keyLocation: string | null, urlList: string[]) {
  const endpoint = 'https://api.indexnow.org/indexnow';
  
  const body = {
    host,
    key,
    keyLocation,
    urlList
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(body),
    });

    return {
      success: response.ok,
      status: response.status,
      message: response.statusText
    };
  } catch (error) {
    console.error('IndexNow Submission Error:', error);
    return { success: false, message: (error as Error).message || 'Unknown error' };
  }
}
