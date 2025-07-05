const crypto = require('crypto');

module.exports = (req, res) => {
  const secret = "q0hdscntgukvdzjjjb9tbug75cdkijxz";
  const expires = 2; // segundos

  const { lp_key } = req.query;
  if (!lp_key || lp_key.length < 25) {
    return res.status(403).send('Chave inválida');
  }

  const hash = lp_key.slice(0, 5) + lp_key.slice(10, 15) + lp_key.slice(20);
  const timeStr = lp_key.slice(5, 10) + lp_key.slice(15, 20);
  const time = parseInt(timeStr, 10);

  const userAgent = req.headers['user-agent'] || '';
  const calc = crypto.createHash('md5').update(secret + time + userAgent).digest('hex');
  const now = Math.floor(Date.now() / 1000);

  if (calc !== hash || now - time > expires) {
    return res.status(403).send('Acesso negado');
  }

  return res.status(200).send('Acesso liberado');
};
