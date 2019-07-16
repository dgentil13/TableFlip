function meeting(s) {
    let masterArray = [];
    let newS = s.toUpperCase().split(';');
    newS.forEach(element => {
        let changing = element.split(':');
        masterArray.push(`(${changing[1]}, ${changing[0]})`)
    });
    return masterArray.sort().join('') 
}

meeting("Fred:Corwill;Wilfred:Corwill;Barney:Tornbull;Betty:Tornbull;Bjon:Tornbull;Raphael:Corwill;Alfred:Corwill")