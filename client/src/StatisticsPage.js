import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

function StatisticsPage() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/shorturls')
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  return (
    <List>
      {stats.map((s, i) => (
        <ListItem key={i}>
          <ListItemText primary={s.shortLink} secondary={`Clicks: ${s.totalClicks}, Expiry: ${s.expiryDate}`} />
        </ListItem>
      ))}
    </List>
  );
}

export default StatisticsPage;