const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const url = 'https://obsuvuddqxvziehhfxnu.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ic3V2dWRkcXh2emllaGhmeG51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5MTEyNjQsImV4cCI6MjA5ODQ4NzI2NH0.hKyPAx4kEqVX8KZI2HKEjFh30nT_yu-NUav632RTNUU';

const sql = fs.readFileSync('supabase-migration-v2.sql', 'utf8');

async function run() {
  // Step 1: Create the exec_sql function first (need service_role for DDL)
  // Try using the management API
  const mgmtRes = await fetch('https://api.supabase.com/v1/projects/obsuvuddqxvz/database/sql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + (process.env.SUPABASE_ACCESS_TOKEN || '')
    },
    body: JSON.stringify({ query: sql })
  });
  const mgmtText = await mgmtRes.text();
  console.log('Management API status:', mgmtRes.status);
  if (mgmtText) console.log('Response:', mgmtText.substring(0, 1000));
}
run().catch(e => console.error('Error:', e.message));
