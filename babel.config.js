module.exports = function(api) {
  api.cache(true);
  
  return {
    presets: [
      'babel-preset-expo',
      ['@babel/preset-flow', { 
        allowDeclareFields: true 
      }]
    ]
  };
};
