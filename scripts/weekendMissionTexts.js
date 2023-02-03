const fs = require('fs');

const weekendMission1 = JSON.parse(fs.readFileSync('./scripts/WeekendMissionsSeason1.lang.json', 'utf8'));
const weekendMission2 = JSON.parse(fs.readFileSync('./scripts/WeekendMissionsSeason2.lang.json', 'utf8'));
const allSeasons = [
    ...weekendMission1,
    ...weekendMission2,
];

const npcLookup = {
    'other26': 'Ariadne',
    'other27': 'Gemini',
    'other28': 'Mercury',
    'other29': 'Cronus',
    'other30': 'Selene',
    'other31': 'Helios',
    'other32': 'Hyperion',
    'other33': 'Tethys',
    'other34': 'Perses',
    'other35': 'Ares',
    'other36': 'Hesperus',
    'other37': 'Eos',
};

const outputs = {};
for (const season of allSeasons) {
    for (const stage of season.Stages) {
        const npcName = npcLookup[stage.IterationAppId];
        if (npcName == null) continue;

        outputs[npcName] = [
            ...(outputs[npcName] ?? []),
            ...(stage?.NpcMessageFlows?.IncomingMessages ?? [])
        ];
    }
}

for (const outputProp in outputs) {
    if (Object.hasOwnProperty.call(outputs, outputProp)) {
        const output = outputs[outputProp].map(outStr => `\t\"${outStr}\"`);
        fs.writeFileSync(
            `./scripts/output/${outputProp.toLocaleLowerCase()}.json`,
            '[\n' + output.join(',\n') + '\n]'
        );
    }
}
