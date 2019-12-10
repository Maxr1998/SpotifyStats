import {alaSqlPromise, databaseName, historyTableName, statsSection} from './index'
import prettyMilliseconds from 'pretty-ms'

const attachStatement = 'ATTACH INDEXEDDB DATABASE ' + databaseName + '; USE ' + databaseName + '; ';

alaSqlPromise.then(({default: alaSql}) => {
    alaSql(attachStatement + '\
        SELECT SUM(msPlayed) AS playTime FROM ' + historyTableName + ' \
        WHERE endTime LIKE "2019%"', function(output) {
        console.log(prettyMilliseconds(output[2][0].playTime, {secondsDecimalDigits: 0, colonNotation: true}));
    });
    alaSql(attachStatement + '\
        SELECT artistName, COUNT(*) AS playCount FROM ' + historyTableName + ' \
        WHERE endTime LIKE "2019%" \
        GROUP BY artistName ORDER BY playCount DESC;', function(output) {
        console.log(output);
    });
    alaSql(attachStatement + '\
        SELECT artistName, SUM(msPlayed) AS playTime FROM ' + historyTableName + ' \
        WHERE endTime LIKE "2019%" \
        GROUP BY artistName ORDER BY playTime DESC;', function(output) {
        console.log(output);
        const result = output[2].map(v => v.artistName + " " + prettyMilliseconds(v.playTime, {
            secondsDecimalDigits: 0,
            colonNotation: true
        })).join('\n');
        statsSection.text(result);
    });
});