// Environment variable validation
const validateEnv = () => {
  const required = [
    'DB_HOST',
    'DB_USER',
    'DB_NAME'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\nPlease check your .env file or environment configuration.');
    process.exit(1);
  }

  // Warning for production without proper JWT secret
  if (process.env.NODE_ENV === 'production' && 
      (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('change-in-production'))) {
    console.warn('⚠️  WARNING: Using default JWT secret in production is insecure!');
    console.warn('   Please set a strong JWT_SECRET in your environment variables.');
  }

  console.log('✓ Environment variables validated');
};

module.exports = { validateEnv };
