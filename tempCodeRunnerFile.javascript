let getCount = liCount => {
switch (true) {
    case liCount == 0:
        console.log("0!");
        return "0!";
        // break;
    case liCount<=5 && liCount>0:
    console.log("0..5!");

        break;
    case liCount<=10 && liCount>5:
        setLayoutState('upload2Rows');
        console.log("5..10!");

        break;
    case liCount>10:
        console.log("10 and higher!");
        break;                  
}
}

getCount(0); 