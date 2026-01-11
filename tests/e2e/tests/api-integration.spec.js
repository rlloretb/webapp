import { test, expect } from '@playwright/test';

test.describe('API Integration Tests', () => {
  const API_BASE = 'http://localhost:8000';

  test('should check health endpoint', async ({ request }) => {
    const response = await request.get(`${API_BASE}/health`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('status', 'ok');
  });

  test('should solve problem via API', async ({ request }) => {
    const payload = {
      vessels: [
        { vessel_id: 'API001', arrival_time: 0, processing_time: 5 },
        { vessel_id: 'API002', arrival_time: 3, processing_time: 8 }
      ],
      planning_horizon: 72,
      num_berths: 2
    };

    const response = await request.post(`${API_BASE}/solve`, {
      data: payload
    });

    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('problem_id');
    expect(data).toHaveProperty('schedule');
    expect(data).toHaveProperty('makespan');
    expect(data).toHaveProperty('solving_time');
    expect(data.schedule).toHaveProperty('API001');
    expect(data.schedule).toHaveProperty('API002');
  });

  test('should use custom parameters in API request', async ({ request }) => {
    const payload = {
      vessels: [
        { vessel_id: 'CUSTOM001', arrival_time: 0, processing_time: 10 }
      ],
      planning_horizon: 48,
      num_berths: 3
    };

    const response = await request.post(`${API_BASE}/solve`, {
      data: payload
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data).toHaveProperty('problem_id');
    expect(data.schedule.CUSTOM001).toBeDefined();
  });

  test('should handle invalid vessel data', async ({ request }) => {
    const payload = {
      vessels: [
        { vessel_id: 'INVALID', arrival_time: -1, processing_time: 5 }
      ],
      planning_horizon: 72,
      num_berths: 2
    };

    const response = await request.post(`${API_BASE}/solve`, {
      data: payload
    });

    // Should either accept or reject based on validation
    // Adjust expectation based on your API's behavior
    if (!response.ok()) {
      expect(response.status()).toBe(400);
    }
  });

  test('should handle missing vessels array', async ({ request }) => {
    const payload = {
      planning_horizon: 72,
      num_berths: 2
    };

    const response = await request.post(`${API_BASE}/solve`, {
      data: payload
    });

    expect(response.status()).toBe(422); // Validation error
  });

  test('should list solutions', async ({ request }) => {
    // First create a solution
    const payload = {
      vessels: [
        { vessel_id: 'LIST001', arrival_time: 0, processing_time: 5 }
      ],
      planning_horizon: 72,
      num_berths: 2
    };

    await request.post(`${API_BASE}/solve`, {
      data: payload
    });

    // Then list solutions
    const response = await request.get(`${API_BASE}/solutions?limit=10`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('solutions');
    expect(Array.isArray(data.solutions)).toBeTruthy();
  });

  test('should retrieve specific solution', async ({ request }) => {
    // Create a solution
    const payload = {
      vessels: [
        { vessel_id: 'GET001', arrival_time: 0, processing_time: 5 }
      ],
      planning_horizon: 72,
      num_berths: 2
    };

    const solveResponse = await request.post(`${API_BASE}/solve`, {
      data: payload
    });

    const solveData = await solveResponse.json();
    const problemId = solveData.problem_id;

    // Retrieve it
    const getResponse = await request.get(`${API_BASE}/solution/${problemId}`);
    expect(getResponse.ok()).toBeTruthy();
    
    const getData = await getResponse.json();
    expect(getData.problem_id).toBe(problemId);
    expect(getData).toHaveProperty('schedule');
  });

  test('should delete solution', async ({ request }) => {
    // Create a solution
    const payload = {
      vessels: [
        { vessel_id: 'DEL001', arrival_time: 0, processing_time: 5 }
      ],
      planning_horizon: 72,
      num_berths: 2
    };

    const solveResponse = await request.post(`${API_BASE}/solve`, {
      data: payload
    });

    const solveData = await solveResponse.json();
    const problemId = solveData.problem_id;

    // Delete it
    const deleteResponse = await request.delete(`${API_BASE}/solution/${problemId}`);
    expect(deleteResponse.ok()).toBeTruthy();

    // Verify deletion
    const getResponse = await request.get(`${API_BASE}/solution/${problemId}`);
    expect(getResponse.status()).toBe(404);
  });

  test('should handle 404 for non-existent solution', async ({ request }) => {
    const fakeId = 'non-existent-uuid-12345';
    const response = await request.get(`${API_BASE}/solution/${fakeId}`);
    expect(response.status()).toBe(404);
  });

  test('should respect default parameters when not provided', async ({ request }) => {
    const payload = {
      vessels: [
        { vessel_id: 'DEFAULT001', arrival_time: 0, processing_time: 5 }
      ]
      // No planning_horizon or num_berths - should use defaults
    };

    const response = await request.post(`${API_BASE}/solve`, {
      data: payload
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data).toHaveProperty('problem_id');
    expect(data.schedule.DEFAULT001).toBeDefined();
  });
});
