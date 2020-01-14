export default function(spec) {

  spec.describe('Logging in', function() {

    spec.it('works', async function() {
      await spec.exists('Login.AppIDInput');
      await spec.exists('Login.AppSecretInput');

      await spec.fillIn('Login.AppIDInput', 'UvkSwWR5FCEdha2tHZMRdXHS');
      await spec.fillIn('Login.AppSecretInput', 'XiAxV3Uy-czfyauK8NKtYa0LYRspECBn_4nCFbvoMgelZDKT');
      await spec.press('Login.LoginButton');
      await spec.exists('Login.PrivacyPolicyModal');
      await spec.press('Login.PrivacyPolicyConfirmButton');
    });
  });
}