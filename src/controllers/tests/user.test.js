const { doLogin } = require('../users.ts');

describe('User Login Test', () => {
  it('should login successfully', () => {
    expect.assertions(3);
    return doLogin('1390000', 'password').then((res) => {
      //console.log('test.doLogin.res:', res);
      expect(res.result).toBe(true);
      expect(res.userName).toBe('何燕员');
      expect(res.roleName).toBe('中心核验员');
    });
  });

  it('should login fail', () => {
    expect.assertions(3);
    return doLogin('aadf', 'aidid').then((res) => {
      //console.log('test.doLogin.res:', res);
      expect(res.result).toBe(false);
      expect(res.userName).toBe('');
      expect(res.roleName).toBe('');
    });
  });

  it('password cannot be empty', () => {
    expect.assertions(3);
    return doLogin('1390000', '').then((res) => {
      expect(res.result).toBe(false);
      expect(res.userName).toBe('');
      expect(res.roleName).toBe('');
    });
  });

  it('should reject', () => {
    expect.assertions(3);
    return doLogin('000000', '').catch((res) => {
      expect(res.result).toBe(false);
      expect(res.userName).toBe('');
      expect(res.roleName).toBe('');
    });
  });
});
