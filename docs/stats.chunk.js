(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{1:function(e,o,s){"use strict";s.r(o);var n=s(0),i=s(50),t=s.n(i),a="ATTACH INDEXEDDB DATABASE "+n.databaseName+"; USE "+n.databaseName+"; ";n.alaSqlPromise.then((function(e){var o=e.default;o(a+"        SELECT SUM(msPlayed) AS playTime FROM "+n.historyTableName+'         WHERE endTime LIKE "2019%"',(function(e){console.log(t()(e[2][0].playTime,{secondsDecimalDigits:0,colonNotation:!0}))})),o(a+"        SELECT artistName, COUNT(*) AS playCount FROM "+n.historyTableName+'         WHERE endTime LIKE "2019%"         GROUP BY artistName ORDER BY playCount DESC;',(function(e){console.log(e)})),o(a+"        SELECT artistName, SUM(msPlayed) AS playTime FROM "+n.historyTableName+'         WHERE endTime LIKE "2019%"         GROUP BY artistName ORDER BY playTime DESC;',(function(e){console.log(e);var o=e[2].map((function(e){return e.artistName+" "+t()(e.playTime,{secondsDecimalDigits:0,colonNotation:!0})})).join("\n");n.statsSection.text(o)}))}))},50:function(e,o,s){"use strict";const n=s(51);e.exports=(e,o={})=>{if(!Number.isFinite(e))throw new TypeError("Expected a finite number");o.colonNotation&&(o.compact=!1,o.formatSubMilliseconds=!1,o.separateMilliseconds=!1,o.verbose=!1),o.compact&&(o.secondsDecimalDigits=0,o.millisecondsDecimalDigits=0);const s=[],i=(e,n,i,t)=>{if(!(0!==s.length&&o.colonNotation||0!==e||o.colonNotation&&"m"===i))return;let a,c;if(t=(t||e||"0").toString(),o.colonNotation){a=s.length>0?":":"",c="";const e=t.includes(".")?t.split(".")[0].length:t.length,o=s.length>0?2:1;t="0".repeat(Math.max(0,o-e))+t}else a="",c=o.verbose?" "+((e,o)=>1===o?e:e+"s")(n,e):i;s.push(a+t+c)};if(("number"==typeof o.secondsDecimalDigits?o.secondsDecimalDigits:1)<1){const o=1e3-e%1e3;o<500&&(e+=o)}const t=n(e);if(i(Math.trunc(t.days/365),"year","y"),i(t.days%365,"day","d"),i(t.hours,"hour","h"),i(t.minutes,"minute","m"),o.separateMilliseconds||o.formatSubMilliseconds||e<1e3)if(i(t.seconds,"second","s"),o.formatSubMilliseconds)i(t.milliseconds,"millisecond","ms"),i(t.microseconds,"microsecond","µs"),i(t.nanoseconds,"nanosecond","ns");else{const e=t.milliseconds+t.microseconds/1e3+t.nanoseconds/1e6,s="number"==typeof o.millisecondsDecimalDigits?o.millisecondsDecimalDigits:0,n=s?e.toFixed(s):Math.ceil(e);i(parseFloat(n,10),"millisecond","ms",n)}else{const s=e/1e3%60,n="number"==typeof o.secondsDecimalDigits?o.secondsDecimalDigits:1,t=s.toFixed(n),a=o.keepDecimalsOnWholeSeconds?t:t.replace(/\.0+$/,"");i(parseFloat(a,10),"second","s",a)}return 0===s.length?"0"+(o.verbose?" milliseconds":"ms"):o.compact?"~"+s[0]:"number"==typeof o.unitCount?"~"+s.slice(0,Math.max(o.unitCount,1)).join(" "):o.colonNotation?s.join(""):s.join(" ")}},51:function(e,o,s){"use strict";e.exports=e=>{if("number"!=typeof e)throw new TypeError("Expected a number");const o=e>0?Math.floor:Math.ceil;return{days:o(e/864e5),hours:o(e/36e5)%24,minutes:o(e/6e4)%60,seconds:o(e/1e3)%60,milliseconds:o(e)%1e3,microseconds:o(1e3*e)%1e3,nanoseconds:o(1e6*e)%1e3}}}}]);