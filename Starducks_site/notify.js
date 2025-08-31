// Netlify Function: notify
// Sends an email via SendGrid when crew code is used or a post is created.
// 1) On Netlify, set environment variable SENDGRID_API_KEY
// 2) Optionally set TO_EMAIL (default is uefa.sorawit.chankarn@gmail.com)
// 3) Deploy. Client will POST {subject, body} here.

import fetch from 'node-fetch';

export async function handler(event) {
  if(event.httpMethod !== 'POST'){
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  const { subject, body } = JSON.parse(event.body||'{}');
  const apiKey = process.env.SENDGRID_API_KEY;
  const to = process.env.TO_EMAIL || 'uefa.sorawit.chankarn@gmail.com';
  if(!apiKey){
    return { statusCode: 200, body: 'No API key; skipping email.' };
  }
  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method:'POST',
    headers:{
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type':'application/json'
    },
    body: JSON.stringify({
      personalizations:[{ to:[{email: to}] }],
      from:{ email:'noreply@starducks.space', name:'Starducks Bot' },
      subject: subject || 'Starducks Notification',
      content:[{ type:'text/plain', value: body || '(no content)' }]
    })
  });
  if(!res.ok){
    const t = await res.text();
    return { statusCode: 500, body: t };
  }
  return { statusCode: 200, body: 'ok' };
}
