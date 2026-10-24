import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

app.all('*', async (req, res) => {
  try {
    const target = 'https://api.futureppo.top' + req.url;
    const headers = { ...req.headers };
    delete headers.host;
    delete headers.connection;
    headers['user-agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

    const upstream = await fetch(target, {
      method: req.method,
      headers,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body)
    });

    res.status(upstream.status);
    upstream.body.pipe(res);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy listening on port ${PORT}`));
