const combineDates = (points) =>{
    const finalMonth = {date:points[0].date, count:0}
    for(let point of points){
        finalMonth.count += point.count;
    }
    finalMonth.count = (finalMonth.count/points.length)/5
    return finalMonth;
}

const streamlineDates = (dates) => {
    let finalDates = [];
    let date = dates[0].date;
    let monthPoints = [];
    for(let point of dates){
        if(point.date === date){
            monthPoints.push(point);
        }else{
            finalDates.push(combineDates(monthPoints));
            date = point.date;
            monthPoints = [point];
        }
    }
    return finalDates;
}

module.exports = streamlineDates;