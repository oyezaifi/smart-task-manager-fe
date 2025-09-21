

 export function formatMinutes(mins){
    if (!mins) return '0m';
    const h = Math.floor(mins/60), m = mins%60;
    return h ? `${h}h ${m}m` : `${m}m`;
  }
  
  