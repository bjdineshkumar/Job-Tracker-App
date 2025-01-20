const axios = require('axios');
const { login, register } = require('../src/services/authService.js');  // Corrected import statement

jest.mock('axios'); // Mock axios

describe('authService', () => {
  test('login should call the correct API endpoint', async () => {
    // Mock the API response
    axios.post.mockResolvedValue({ data: { message: 'Login Successful' } });

    const response = await login('test@example.com', 'password123');
    
    // Check if axios.post was called with the correct URL and payload
    expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    // Check if the response is as expected
    expect(response.data.message).toBe('Login Successful');
  });

  test('register should call the correct API endpoint', async () => {
    // Mock the API response
    axios.post.mockResolvedValue({ data: { message: 'Registration Successful' } });

    const response = await register('test@example.com', 'username123', 'password123');
    
    // Check if axios.post was called with the correct URL and payload
    expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/api/auth/register', {
      email: 'test@example.com',
      username: 'username123',
      password: 'password123'
    });
    
    // Check if the response is as expected
    expect(response.data.message).toBe('Registration Successful');
  });
});
