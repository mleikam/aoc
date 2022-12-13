// can you tell from a shorter string that a longer one is divisible by X
// for example, you only need to know the last digit to divide by 2

// 3
const digit = 3**6; 
console.log({ digit })

const chop = (num,factor) => {
  const digits = num.toString().split('');
  const hundreds= digits.slice(-3,1).pop();
  for(let i=0;i<digits.length;i++){
    const sliced = digits.slice(i);
    let test = parseInt(sliced.join(''),10);
    if( hundreds === '7') test += 1;
    console.log({i,num,test,sliced,hundreds})

    const ok = (test % factor === 0);
    if(ok) console.log(i,test,'is divisible by 3')
    if(!ok) console.log(i,test,'is not divisible by 3')
  }
}

chop(digit,3)