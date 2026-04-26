import bcrypt from 'bcrypt';
try {
  const hash = await bcrypt.hash('test', 10);
  console.log('SUCCESS:', hash);
} catch (err) {
  console.error('ERROR:', err);
}
