import test from 'node:test';
import assert from 'node:assert';
import {
  registerAccount,
  loginAccount,
  clearRegisteredAccountsForTesting,
  authenticateWithGoogle,
} from './authStorage.ts';

test('loginAccount fails when account has not been created yet', () => {
  clearRegisteredAccountsForTesting();

  const result = loginAccount({
    email: 'newuser@wardrobe.com',
    password: 'securePassword123',
  });

  assert.strictEqual(result.success, false);
  assert.ok(result.error?.includes('No account found with this email'));
  assert.ok(result.error?.includes('Create Account'));
});

test('registerAccount creates a new account and then loginAccount succeeds', () => {
  clearRegisteredAccountsForTesting();

  // 1. Attempt login before registration -> must fail
  const preLogin = loginAccount({
    email: 'jefino@example.com',
    password: 'mySecretPassword99',
  });
  assert.strictEqual(preLogin.success, false);

  // 2. Register account
  const regResult = registerAccount({
    name: 'Jefino Wardrobe',
    email: 'jefino@example.com',
    password: 'mySecretPassword99',
  });
  assert.strictEqual(regResult.success, true);
  assert.strictEqual(regResult.user?.name, 'Jefino Wardrobe');
  assert.strictEqual(regResult.user?.email, 'jefino@example.com');

  // 3. Attempt duplicate registration -> must fail
  const dupReg = registerAccount({
    name: 'Duplicate Jefino',
    email: 'jefino@example.com',
    password: 'anotherPassword',
  });
  assert.strictEqual(dupReg.success, false);
  assert.ok(dupReg.error?.includes('already exists'));

  // 4. Login with incorrect password -> must fail
  const wrongPass = loginAccount({
    email: 'jefino@example.com',
    password: 'wrongPassword',
  });
  assert.strictEqual(wrongPass.success, false);
  assert.ok(wrongPass.error?.includes('Incorrect password'));

  // 5. Login with correct password -> succeeds!
  const validLogin = loginAccount({
    email: 'jefino@example.com',
    password: 'mySecretPassword99',
  });
  assert.strictEqual(validLogin.success, true);
  assert.strictEqual(validLogin.user?.name, 'Jefino Wardrobe');
  assert.strictEqual(validLogin.user?.email, 'jefino@example.com');
});

test('authenticateWithGoogle automatically registers and allows subsequent logins', () => {
  clearRegisteredAccountsForTesting();

  const googleLogin = authenticateWithGoogle({
    email: 'jefino2008@gmail.com',
    name: 'Jefino',
  });

  assert.strictEqual(googleLogin.success, true);
  assert.strictEqual(googleLogin.user?.email, 'jefino2008@gmail.com');
  assert.strictEqual(googleLogin.user?.name, 'Jefino');
});
