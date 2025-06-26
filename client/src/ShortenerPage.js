import React, { useState } from 'react';
import { TextField, Button, List, ListItem, ListItemText } from '@mui/material';

function ShortenerPage() {
  const [urls, setUrls] = useState([{ url: '', validity: '', shortcode: '' }]);
  const [shortened, setShortened] = useState([]);

  const handleChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

  const handleSubmit = async () => {
    const validUrls = urls.filter(u => isValidUrl(u.url) && (!u.validity || !isNaN(u.validity)));
    const responses = await Promise.all(validUrls.map(u =>
      fetch('http://localhost:3001/shorturls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: u.url, validity: u.validity || 30, shortcode: u.shortcode })
      }).then(res => res.json())
    ));
    setShortened(responses);
  };

  return (
    <div>
      {urls.map((u, i) => (
        <div key={i}>
          <TextField label="URL" value={u.url} onChange={e => handleChange(i, 'url', e.target.value)} />
          <TextField label="Validity (minutes)" value={u.validity} onChange={e => handleChange(i, 'validity', e.target.value)} />
          <TextField label="Shortcode" value={u.shortcode} onChange={e => handleChange(i, 'shortcode', e.target.value)} />
        </div>
      ))}
      <Button onClick={() => setUrls([...urls, { url: '', validity: '', shortcode: '' }])}>Add URL</Button>
      <Button onClick={handleSubmit}>Shorten</Button>
      <List>
        {shortened.map((s, i) => (
          <ListItem key={i}><ListItemText primary={s.shortLink} secondary={`Expires: ${s.expiry}`} /></ListItem>
        ))}
      </List>
    </div>
  );
}

function isValidUrl(string) {
  try { new URL(string); return true; } catch (_) { return false; }
}

export default ShortenerPage;