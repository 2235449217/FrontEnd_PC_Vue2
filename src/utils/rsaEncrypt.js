import JSEncrypt from 'jsencrypt/bin/jsencrypt';

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = 'MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAqSgrQRytCyTN/Qod7Muy\n' +
'CVP/oWTH9lVu6Yzd2OPIw9dVWuoJUVNfP5AfigJOTS5e9zBeNoZdBbdIRlweBs8l\n' +
'ZR8vv0yF94tcdUGQ/c5itHNR69rnPQmyAwQ9FCs8mSx+SpPBhsxPuhDoOM21gUtB\n' +
'YKzKLUzPz8tNyjO6Dxh8oCHeA0ostKEhPVNWa4KqPwjMeiZPEHmXvxK0SQ9f451L\n' +
'Y+ugTmhvcmwvJkSZbOzZ6ANIuflfii6V4pfE/0nkfTxIlQxVOidKbkGYI3i6t7kM\n' +
'5BjNHSNN13R4eU03Hczw2fxYrK5AabaUevBvjGWLm4rUDV/cTN2XQALy1cfzp7NW\n' +
'QnPzrnJdpLZmLh7YBxS4vM7OUbzt2cLArU1FJRw0R6EBRpjChKfqF96KuSEdv9Vm\n' +
'zeGbrZpzswYZ3PeAGUXooa273wJtx+VmAYABQbaxGbIDn8ftME33SrolqurdJ8UE\n' +
'N07tml9NJ9DvbsljT7Fw+5NfbQCDAsk4WJk04bijAcV6QMDWQ82Di5bJJSfpR9b0\n' +
'Z/x+GStxjmeolU/0XgRLq0zz+GpConNmoMuzT8UaO2IiVSt6fRg5NdXqV+XvLM48\n' +
'7u8c+cE7ulgfAL05m7ir8voqNKd/61MJ68bG1HQwv7vON7P2EwsGkFrlKo3IwElT\n' +
'PV5AwiPTAIi1XYj9xTt/ca0CAwEAAQ==';

// 加密
export function encrypt (txt) {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey); // 设置公钥
  return encryptor.encrypt(txt); // 对需要加密的数据进行加密
}
