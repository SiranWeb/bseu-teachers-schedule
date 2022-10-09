var t = {};

t['%D0%B0']='%E0';t['%D0%B1']='%E1';t['%D0%B2']='%E2';t['%D0%B3']='%E3';t['%D0%B4']='%E4';
t['%D0%B5']='%E5';t['%D1%91']='%B8';t['%D0%B6']='%E6';t['%D0%B7']='%E7';t['%D0%B8']='%E8';
t['%D0%B9']='%E9';t['%D0%BA']='%EA';t['%D0%BB']='%EB';t['%D0%BC']='%EC';t['%D0%BD']='%ED';
t['%D0%BE']='%EE';t['%D0%BF']='%EF';t['%D1%80']='%F0';t['%D1%81']='%F1';t['%D1%82']='%F2';
t['%D1%83']='%F3';t['%D1%84']='%F4';t['%D1%85']='%F5';t['%D1%86']='%F6';t['%D1%87']='%F7';
t['%D1%88']='%F8';t['%D1%89']='%F9';t['%D1%8C']='%FC';t['%D1%8B']='%FB';t['%D1%8A']='%FA';
t['%D1%8D']='%FD';t['%D1%8E']='%FE';t['%D1%8F']='%FF';t['%D0%90']='%C0';t['%D0%91']='%C1';
t['%D0%92']='%C2';t['%D0%93']='%C3';t['%D0%94']='%C4';t['%D0%95']='%C5';t['%D0%81']='%A8';
t['%D0%96']='%C6';t['%D0%97']='%C7';t['%D0%98']='%C8';t['%D0%99']='%C9';t['%D0%9A']='%CA';
t['%D0%9B']='%CB';t['%D0%9C']='%CC';t['%D0%9D']='%CD';t['%D0%9E']='%CE';t['%D0%9F']='%CF';
t['%D0%A0']='%D0';t['%D0%A1']='%D1';t['%D0%A2']='%D2';t['%D0%A3']='%D3';t['%D0%A4']='%D4';
t['%D0%A5']='%D5';t['%D0%A6']='%D6';t['%D0%A7']='%D7';t['%D0%A8']='%D8';t['%D0%A9']='%D9';
t['%D0%AC']='%DC';t['%D0%AB']='%DB';t['%D0%AA']='%DA';t['%D0%AD']='%DD';t['%D0%AE']='%DE';
t['%D0%AF']='%DF';

function urlencode(str) {
    str = (str + '').toString();

    return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
    replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}

function convert_to_cp1251(str) {
    var ret='';

    var l=str.length;
    var i=0;
    while (i<l) {

        var f=0;
        for (let keyVar in t) {
            if (str.substring(i,i+6)==keyVar) {ret+=t[keyVar];i+=6;f=1;}
        }

        if (!f) {ret+=str.substring(i,i+1);i++;}
    }

    return ret;
}

export const encodingService = {
    encodeWin1251ToUrl: (str) => convert_to_cp1251(urlencode(str))
}
