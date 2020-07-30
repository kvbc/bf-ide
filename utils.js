BF_INP.utils.is_slloop = function(txt, i) {
    let lstart = txt.indexOf('[', i);
    let lend   = txt.indexOf(']', i);
    return (lstart < 0 && lend < 0) || (lstart >= 0 && lstart < lend);
}