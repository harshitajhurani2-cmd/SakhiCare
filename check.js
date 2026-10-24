const fs=require('fs');
const paths=['C:/Users/harshita jhurani/Downloads/New folder/sakhi/backend/main.py','C:/Users/harshita jhurani/Downloads/New folder/sakhi/backend/pcos_api.py','C:/Users/harshita jhurani/Downloads/New folder/sakhi/backend/app_unified.py'];
paths.forEach(p=>{
  const s=fs.readFileSync(p,'utf8');
  console.log('===',p,'===');
  const m=s.match(/@app\.(get|post|options|put|delete)\([^)]+\)/g);
  console.log(m?m.join('\n'):'none');
  console.log('models:', /load_model|lr_model|features\.pkl|scaler/.test(s));
  console.log('');
});
