'use strict';

const fs = require('fs');
const Joi = require('joi');

const VIDEO_INDEX = 0;

const validateBody = (body) => {
    const schema = Joi.object({
        video: Joi.string().uri().min(2).max(300).required(),
        start: Joi.number().min(0).max(119),
        end: Joi.number().min(1).max(120),
    });

    return schema.validate({
        video: body.video,
        start: body.start,
        end: body.end,
    });
};

const createJson = (body) => {
    return new Promise((resolve, reject) => {
        const valid = validateBody(body);

        if (valid.error) {
            reject(valid.error.details[0].message);
        }

        const videoUrl = body.video;
        const { start, end } = body;

        fs.readFile(__dirname + '/template.json', 'utf-8', function (err, data) {
            if (err) {
                console.error(err);
                reject(err);
            }

            let jsonParsed = JSON.parse(data);

            jsonParsed.timeline.tracks[VIDEO_INDEX].clips[0].asset.src = videoUrl;
            jsonParsed.timeline.tracks[VIDEO_INDEX].clips[0].length = end - start;
            jsonParsed.timeline.tracks[VIDEO_INDEX].clips[0].asset.trim = Number(start);

            const json = JSON.stringify(jsonParsed);

            return resolve(json);
        });
    });
};

module.exports = {
    createJson,
};
