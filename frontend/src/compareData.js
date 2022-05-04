const compareData = (trend,shark) => {
    let score = 320;
    for(let i=0;i<trend.length-1;i++){
        let dif = Math.abs(trend[i]-shark[i]);
        if(dif > 8){
            dif = 20;
        }
        else if(dif > 4){
            dif = 10;
        }
        score -= dif
    }
    return Math.round((score/320)*100);
}

export default compareData;