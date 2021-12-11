module.exports = {
    age(timestamp) {
      const today = new Date();
      const birthDate = new Date(timestamp);
  
      let age = today.getFullYear() - birthDate.getFullYear();
      const month = today.getMonth() - birthDate.getMonth();
  
      if (month < 0 || (month == 0 && today.getDate() <= birthDate.getDate())) {
        age = age - 1;
      }
  
      return age;
    },
  
    date(timestamp) {
      const date = new Date(timestamp);
      const day = date.getUTCDate();
      const month = date.getUTCMonth() + 1;
      const year = date.getUTCFullYear();
  
  
      function zeroDate(n){
        return n < 10? '0'+n:''+n;
      }
  
      return {
        day,
        month,
        year,
        iso: `${year}-${zeroDate(month)}-${zeroDate(day)}`,
        birthday: `${zeroDate(day)}/${zeroDate(month)}`,
        format: `${zeroDate(day)}/${zeroDate(month)}/${year}`
      }
      
    },
  };
  