const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const url = 'https://obsuvuddqxvziehhfxnu.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ic3V2dWRkcXh2emllaGhmeG51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5MTEyNjQsImV4cCI6MjA5ODQ4NzI2NH0.hKyPAx4kEqVX8KZI2HKEjFh30nT_yu-NUav632RTNUU';

const sql = fs.readFileSync('supabase-migration-v2.sql', 'utf8');

async function run() {
  // First, create the exec_sql function using the raw Supabase SQL endpoint
  // This requires the service_role key, which we don't have.
  // Let's try via supabase.rpc if there's already an exec function
  
  const supabase = createClient(url, anonKey);
  
  // Try calling an existing exec function
  const { data: rpcData, error: rpcError } = await supabase.rpc('exec_sql', { sql_text: sql });
  if (!rpcError) {
    console.log('Migration completed via exec_sql RPC');
    return;
  }
  console.log('exec_sql RPC not available:', rpcError.message);

  // Try other common RPC names
  for (const name of ['exec', 'run_sql', 'execute_sql', 'pg_exec']) {
    const { data, error } = await supabase.rpc(name, { query: sql });
    if (!error) {
      console.log('Migration completed via', name);
      return;
    }
  }

  // None available - provide instructions
  console.log('\nCould not execute migration via API.');
  console.log('Please run this SQL in the Supabase SQL Editor:');
  console.log('https://supabase.com/dashboard/project/obsuvuddqxvz/sql/new');
  console.log('\nOr paste the content of supabase-migration-v2.sql there.');
}

run().catch(e => console.error('Error:', e.message));
