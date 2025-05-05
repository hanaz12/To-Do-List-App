export default {
    testEnvironment: 'node',
    transform: {
      '^.+\\.js$': 'babel-jest', // تحويل الملفات باستخدام Babel
    },
    // إضافة دعم صريح لـ ES Modules
    transformIgnorePatterns: [], // عدم تجاهل أي ملفات أثناء التحويل
  };