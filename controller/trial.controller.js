import {SubjectModel} from '../model/SubjectModel.js';
import {TrialModel} from "../model/TrialModel.js";
import moment from "moment";
import * as XLSX from "xlsx";

function getAdultTrial(user, trialNumber){
    const cueLocation = ["nocue", "doublecue", "centercue", "spatialcue"]
    const targetLocation =  ["up", "down"]
    const targetDirection = ["left", "right"]
    const targetCongruency = ["congruent", "incongruent", "neutral"]

    const firstFixationDelay= 400 + Math.round(Math.random() * 1200);
    const cueDelay= 100;
    const secondFixationDelay= 400;
    const targetDelay= 1700;

    return {
        subject: user,
        blockNumber: 0,
        date: new Date(),
        cueLocation: cueLocation[Math.round(trialNumber / 12) % 4],
        targetLocation: targetLocation[Math.round(trialNumber / 6) % 2],
        targetDirection: targetDirection[Math.round(trialNumber / 3) % 2],
        targetCongruency: targetCongruency[trialNumber % 3],
        firstFixationDelay: firstFixationDelay,
        cueDelay: cueDelay,
        secondFixationDelay: secondFixationDelay,
        targetDelay: targetDelay,
        lastFixationDelay: 4000 - firstFixationDelay - cueDelay - secondFixationDelay - targetDelay,
        rt: 0,
        correct: -1,
        correctResponse: targetDirection[Math.round(trialNumber / 3) % 2]
    };
}

function getAdultData(user){
    const trialPerBlock = 96;
    const blockNumber = 3;
    const trial = [];

    let trialPractice = [];
    for (let i = 0; i < trialPerBlock; i++) {
        trialPractice[i] = getAdultTrial(user, i);
        trialPractice[i].blockNumber = 0;
    }
    //Randomize function
    for(let i = 0; i < trialPerBlock-1; i++){
        const randomPosition = Math.floor(Math.random() * (trialPerBlock - i));
        [trialPractice[i], trialPractice[randomPosition]] = [trialPractice[randomPosition], trialPractice[i]];
    }
    const trialTest = [];
    for (let i = 0; i < blockNumber; i++) {
        const trialTestBlock = [];
        for(let j =0 ; j < trialPerBlock; j++){
            trialTestBlock.push(getAdultTrial(user, j));
        }
        trialTest.push(trialTestBlock);
    }

    for(let i = 0; i < 24; i++){
        trial[i] = trialPractice[i];
    }

    for(let i = 0; i < blockNumber; i++){
        //Randomize function
        for(let j = 0; j < trialPerBlock-1; j++){
            const randomPosition = Math.floor(Math.random() * (trialPerBlock - j));
            [trialPractice[j], trialPractice[randomPosition]] = [trialPractice[randomPosition], trialPractice[j]];
        }
        for(let j = 0; j < trialPerBlock; j++){
            const position = i*trialPerBlock+j+24
            trial[position] = trialTest[i][j];
            trial[position].blockNumber = i+1;
        }
    }

    return trial;
}

function calculateAlerting(data, totalTrialNumber){
    const twoCueLocation = ['nocue', 'doublecue'];
    const threeCongruency = ['congruent', 'incongruent', 'neutral'];
    let totalRt = 0;
    for(let i =0; i< 1; ++i){
        for(let j = 0; j < 3; ++j){
            const temp = calculateMedianRt(twoCueLocation[i], threeCongruency[j], data, totalTrialNumber);
            if(temp === 0){
                return 'NA';
            }
            totalRt += temp;
        }
    }
    let tmpTotalRt = 0
    for(let i = 1; i <2; ++i){
        for(let j =0; j<3;j++){
            const temp = calculateMedianRt(twoCueLocation[i], threeCongruency[j], data, totalTrialNumber);
            if(temp === 0){
                return 'NA';
            }
            tmpTotalRt -= temp;
        }
    }

    return String(Math.round(totalRt/3));
}

function calculateOrienting(data, totalTrialNumber){
    const twoCueLocation = ['centercue', 'spatialcue'];
    const threeCongruency = ['congruent', 'incongruent', 'neutral'];
    let totalRt = 0;
    for(let i =0; i< 1; ++i){
        for(let j = 0; j < 3; ++j){
            const temp = calculateMedianRt(twoCueLocation[i], threeCongruency[j], data, totalTrialNumber);
            if(temp === 0){
                return 'NA';
            }
            totalRt += temp;
        }
    }
    for(let i = 1; i <2; ++i){
        for(let j =0; j<3;j++){
            const temp = calculateMedianRt(twoCueLocation[i], threeCongruency[j], data, totalTrialNumber);
            if(temp === 0){
                return 'NA';
            }
            totalRt -= temp;
        }
    }
    return String(Math.round(totalRt/3));
}

function calculateConflict(data, totalTrialNumber){
    const cueLocation = ["nocue", "doublecue", "centercue", "spatialcue"]
    const targetCongruency = ["congruent", "incongruent", "neutral"]
    let totalRt = 0;
    for(let i =0; i< 4; ++i){
        for(let j = 1; j < 2; ++j){
            const temp = calculateMedianRt(cueLocation[i], targetCongruency[j], data, totalTrialNumber);
            if(temp === 0){
                return 'NA';
            }
            totalRt += temp;
        }
    }
    for(let i = 0; i <4; ++i){
        for(let j =0; j<1;j++){
            const temp = calculateMedianRt(cueLocation[i], targetCongruency[j], data, totalTrialNumber);
            if(temp === 0){
                return 'NA';
            }
            totalRt -= temp;
        }
    }
    return String(Math.round(totalRt/4));
}

function calculateGrandMean(data, totalTrialNumber){
    const cueLocation = ["nocue", "doublecue", "centercue", "spatialcue"]
    const targetCongruency = ["congruent", "incongruent", "neutral"]
    let totalRt = 0;
    for(let i = 0; i < 4; ++i){
        for(let j = 0; j< 3; ++j){
            const temp = calculateMedianRt(cueLocation[i], targetCongruency[j], data, totalTrialNumber);
            if(temp === 0){
                return 'NA';
            }
            totalRt += temp;
        }
    }
    return String(Math.round(totalRt/12));
}

function calculateMeanACC(data, totalTrialNumber){
    let totalTrialCounter = 0;
    let correctTrialCounter = 0;
    for( let i =0; i< totalTrialNumber; ++i){
        if(data[i].block !== 0){
            ++totalTrialCounter;
            if(data[i].correctNess === 1){
                ++correctTrialCounter;
            }
        }
    }
    if(correctTrialCounter !== 0){
        return String(Math.round((100 * correctTrialCounter / totalTrialCounter)));
    }
    return 'NA';
}

function calculateMedianRt(condition1, condition2, data, totalTrialNumber){
    let totalTrialCounter = 0;
    let correctTrialCounter = 0;
    for(let i = 0; i < totalTrialNumber; ++i){
        if(data[i].block !== 0 && ((condition1 === data[i].cueLocation && condition2 === data[i].targetCongruency) || (condition1 === data[i].targetCongruency && condition2 === data[i].cueLocation))){
            ++totalTrialCounter;
            if(data[i].correctNess === 1 && data[i].rt < 1700 && data[i].rt > 100){
                ++correctTrialCounter;
            }
        }
    }
    if(correctTrialCounter === 0){
        return 0;
    }

    let correctRt = [];
    correctTrialCounter = 0;
    for(let i = 0; i < totalTrialNumber; ++i){
        if(data[i].block !== 0 && ((condition1 === data[i].cueLocation && condition2 === data[i].targetCongruency) || (condition1 === data[i].targetCongruency && condition2 === data[i].cueLocation))) {
            ++totalTrialCounter
            if (data[i].correctNess === 1 && data[i].rt < 1700 && data[i].rt > 100) {
                correctRt[correctTrialCounter] = data[i].rt;
                correctTrialCounter++;
            }
        }
    }
    //sort function
    for(let i = 1; i < correctTrialCounter; ++i){
        if(correctRt[i] < correctRt[i-1]){
            let position = i;
            const current = correctRt[i];
            do {
                correctRt[position] = correctRt[position - 1];
            } while (--position > 0 && correctRt[position - 1] > current);
            correctRt[position] = current;
        }
    }
    if(correctTrialCounter % 2 === 0){
        return (correctRt[Math.round(correctTrialCounter / 2) - 1] + Math.round(correctRt[Math.round(correctTrialCounter / 2)] / 2));
    }

    return correctRt[Math.round(correctTrialCounter / 2)];
}

function calculateMeanRT(condition1, condition2, mean, sd, data, totalTrialNumber){
    if(mean === undefined && sd === undefined){let totalRT = 0;
        let mean = 0;
        let sd = 0;
        let totalTrialCounter = 0;
        let correctTrialCounter = 0;
        for (let i = 0; i < totalTrialNumber; ++i) {
            if (data[i].block !== 0 && (condition1 === data[i].cueLocation && condition2 === data[i].targetCongruency) || (condition1 === data[i].targetCongruency && condition2 === data[i].cueLocation)) {
                ++totalTrialCounter;
                if (data[i].correct === 1 && data[i].rt < 1700 && data[i].rt > 100) {
                    ++correctTrialCounter;
                    totalRT += data[i].rt;
                }
            }
        }
        if (correctTrialCounter !== 0) {
            mean = Math.round((totalRT / correctTrialCounter));
            sd = calculateSD(condition1, condition2, mean, data, totalTrialNumber);
        }
        if (mean !== 0 && sd !== 0) {
            return calculateMeanRT(condition1, condition2, mean, sd, data, totalTrialNumber);
        }
        return 0;
    }else {
        let totalRT = 0;
        let totalTrialCounter = 0;
        let correctTrialCounter = 0;
        for (let i = 0; i < totalTrialNumber; ++i) {
            if (data[i].block !== 0 && ((condition1 === data[i].cueLocation && condition2 === data[i].targetCongruency)) || (condition1 === data[i].targetCongruency && condition2 === data[i].cueLocation)) {
                ++totalTrialCounter;
                if (data[i].correct() === 1 && data[i].rt < 1700 && data[i].rt() > 100 && data[i].rt < mean + 2 * sd && data[i].rt > mean - 2 * sd) {
                    ++correctTrialCounter;
                    totalRT += data[i].rt;
                }
            }
        }
        if (correctTrialCounter !== 0) {
            return Math.round(Math.round(totalRT / correctTrialCounter));
        }
        return 0;
    }

}

function calculateSD(condition1, condition2, mean, data, totalTrialNumber){
    let totalSumOfSquaredRT = 0;
    let totalTrialCounter = 0;
    let correctTrialCounter = 0;
    for (let i = 0; i < totalTrialNumber; ++i) {
        if (data[i].block !== 0 && ((condition1 === data[i].cueLocation && condition2 === data[i].targetCongruency) || (condition1 === data[i].targetCongruency) && (condition2 === data[i].cueLocation))) {
            ++totalTrialCounter;
            if (data[i].correct === 1 && data[i].rt < 1700 && data[i].rt > 100) {
                ++correctTrialCounter;
                totalSumOfSquaredRT += (data[i].rt - mean) * (data[i].rt - mean);
            }
        }
    }
    if (correctTrialCounter !== 0) {
        return Math.sqrt(Math.round(totalSumOfSquaredRT / correctTrialCounter));
    }
    return 0;
}

function calculateMedianRTForEachCondition(data, totalTrialNumber){
    const cueLocation = ["nocue", "doublecue", "centercue", "spatialcue"];
    const targetCongruency = ["congruent", "incongruent", "neutral"];
    let RT = "";
    let output = [];
    for (let i = 0; i < 4; ++i) {
        for (let j = 0; j < 3; ++j) {
            const temp = calculateMedianRt(cueLocation[i], targetCongruency[j], data, totalTrialNumber);
            if (temp === 0) {
                RT = "NA";
            }
            else {
                RT = String(temp);
            }
            output.push(`${cueLocation[i]}_${targetCongruency[j]}MedianRT`);
            output.push(RT);
        }
    }
    return output;
}

function calculateMeanRTForEachCondition(data, totalTrialNumber){
    const cueLocation = ["nocue", "doublecue", "centercue", "spatialcue"];
    const targetCongruency = ["congruent", "incongruent", "neutral"];

    let RT = "";
    let output = [];
    for (let i = 0; i < 4; ++i) {
        for (let j = 0; j < 3; ++j) {
            const temp = calculateMeanRT(cueLocation[i], targetCongruency[j], undefined, undefined, data, totalTrialNumber);
            if (temp === 0) {
                RT = "NA";
            }
            else {
                RT = String(temp);
            }
            output.push(`${cueLocation[i]}_${targetCongruency[j]}"MeanRT`);
            output.push(RT);
        }
    }
    return output;
}

function calculateSDForEachCondition(data, totalTrialNumber){
    const cueLocation = ["nocue", "doublecue", "centercue", "spatialcue"];
    const targetCongruency = ["congruent", "incongruent", "neutral"];
    let SD = "";
    let output = [];
    for (let i = 0; i < 4; ++i) {
        for (let j = 0; j < 3; ++j) {
            const mean = calculateMeanRT(cueLocation[i], targetCongruency[j],undefined, undefined, data, totalTrialNumber);
            let temp = 0;
            if (mean !== 0) {
                temp = calculateSD(cueLocation[i], targetCongruency[j], mean, data, totalTrialNumber);
            }
            if (temp === 0) {
                SD = "NA";
            }
            else {
                SD = temp.toString();
            }
            output.push(`${cueLocation[i]}_${targetCongruency[j]}SD`);
            output.push(SD);
        }
    }
    return output;
}

function calculateACCForEachCondition(data, totalTrialNumber){
    const cueLocation = ["nocue", "doublecue", "centercue", "spatialcue"];
    const targetCongruency = ["congruent", "incongruent", "neutral"];
    let ACC = 0.0;
    let output = [];
    for (let i = 0; i < 4; ++i) {
        for (let j = 0; j < 3; ++j) {
            ACC = calculateACC(cueLocation[i], targetCongruency[j], data, totalTrialNumber);
            output.push(`${cueLocation[i]}_${targetCongruency[j]}ACC`);
            output.push(ACC)
        }
    }
    return output;
}

function calculateACC(condition1, condition2, data, totalTrialNumber){
    let totalTrialCounter = 0;
    let correctTrialCounter = 0;
    for (let i = 0; i < totalTrialNumber; ++i) {
        if (data[i].block !== 0 && ((condition1 === data[i].cueLocation && condition2 === data[i].targetCongruency) || (condition1 === data[i].targetCongruency && condition2 === data[i].cueLocation))) {
            ++totalTrialCounter;
            if (data[i].correct === 1) {
                ++correctTrialCounter;
            }
        }
    }
    if (totalTrialCounter !== 0) {
        return correctTrialCounter / totalTrialCounter;
    }
    return 0.0;
}

export default class TrialController{
    static async getTaskList(req, res){
        const user = await SubjectModel.findById(req.query.id,'subjectName userId sessionNumber sex age trialCategory').catch(err => {
            console.log(err);
            res.status(500).json({
                status: "error",
                message: err.message
            });
        });

        if(user.age <= 12){
            /* Enable this if you want implement the "child" branch
            const cueLocationLong = ["nocue", "doublecue", "centercue", "spatialcue", "spatialcue", "centercue", "doublecue", "nocue", "centercue", "spatialcue", "spatialcue", "spatialcue", "nocue", "doublecue", "nocue", "doublecue", "centercue", "spatialcue", "spatialcue", "spatialcue", "nocue", "centercue", "centercue", "doublecue"];
            const targetLocationLong = ["up", "down", "up", "down", "down", "up", "up", "up", "down", "up", "down", "down", "up", "down", "up", "down", "up", "down", "up", "down", "up", "up", "down", "down"];
            const targetDirectionLong = ["left", "right", "left", "right", "right", "left", "left", "right", "right", "left", "left", "right", "left", "left", "right", "left", "right", "right", "right", "left", "left", "right", "right", "left"];
            const targetCongruencyLong = ["neutral", "neutral", "incongruent", "congruent", "neutral", "congruent", "congruent", "incongruent", "neutral", "incongruent", "congruent", "incongruent", "congruent", "neutral", "neutral", "congruent", "incongruent", "neutral", "incongruent", "congruent", "incongruent", "incongruent", "neutral", "congruent"];
            const targetDelayArray = [3600000, 3600000, 3600000, 3600000, 3600000, 3600000, 3600000, 3600000, 3600000, 3600000, 3600000, 3600000, 3600000, 3600000, 3600000, 3600000, 3400, 3400, 3400, 3400, 1700, 1700, 1700, 1700];
            */
            res.status(404).json({
                status: "unavailable",
                message: "Resources not ready"
            })
        }else {
            //Get Adult task list
            const data = getAdultData(user);
            res.json(data);
        }
    }

    static async saveTrial(req, res) {
        const trialList = [];
        for (let i = 0; i < req.body.length; i++) {
            const item = req.body[i];
            const beginTime = item.beginTime || Date.now();
            const blockNumber = item.blockNumber;
            const correct = item.correct;
            const correctResponse = item.correctResponse;
            const cueDelay = item.cueDelay;
            const cueLocation = item.cueLocation;
            const date = item.date;
            const firstFixationDelay = item.firstFixationDelay;
            const lastFixationDelay = item.lastFixationDelay;
            const rt = item.rt;
            const secondFixationDelay = item.secondFixationDelay;
            const subjectId = item.subject['_id'];
            const targetCongruency = item.targetCongruency;
            const targetDelay = item.targetDelay;
            const targetDirection = item.targetDirection;
            const targetLocation = item.targetLocation;
            const targetOnTime = item.targetOnTime || Date.now();
            const response = item.response || 'none';

            const trial = new TrialModel({
                userId: subjectId,
                block: blockNumber,
                cueLocation: cueLocation,
                targetLocation: targetLocation,
                targetDirection: targetDirection,
                targetCongruency: targetCongruency,
                trialStartTime: beginTime,
                targetOnTime: targetOnTime,
                firstFixationDelay: firstFixationDelay,
                rt: rt,
                subjectResponse: response,
                correctResponse: correctResponse,
                correctNess: correct,
                cueDelay: cueDelay,
                secondFixationDelay: secondFixationDelay,
                lastFixationDelay: lastFixationDelay,
                dateStarted: date,
                targetDelay: targetDelay
            })

            trialList.push(trial);
        }
        await TrialModel.insertMany(trialList).then(() =>{
            res.json({
                status: "success",
                message: `${req.body.length} trials saved`
            })
        }).catch(e => {
            res.status(500).json({
                status: "error",
                message: e.message
            })
        });
    }

    static async getTrialResult(req,res){
        const uid = req.params.id;
        TrialModel.find({userId: uid}).then(data => {
            SubjectModel.findById(uid).then(user => {
                if(data.length > 0){
                    let totalTrialNumber;
                    if(user.age <= 12){
                        totalTrialNumber = 168;
                    }else totalTrialNumber = 312;

                    const alert = calculateAlerting(data, totalTrialNumber);
                    const orient = calculateOrienting(data, totalTrialNumber);
                    const conflict = calculateConflict(data, totalTrialNumber);
                    const meanrt = calculateGrandMean(data, totalTrialNumber);
                    const accuracy = calculateMeanACC(data, totalTrialNumber);
                    res.json({
                        alert: alert,
                        orient: orient,
                        conflict: conflict,
                        meanrt: meanrt,
                        accuracy: accuracy
                    })
                }else res.status(404).json({
                    status: "error",
                    message: "No data found"
                })
            }).catch(e => {
                res.status(500).json({
                    status: "error",
                    message: e.message
                })
            })
        }).catch(e => {
            res.status(500).json({
                status: "error",
                message: e.message
            })
        })
    }

    static async downloadTrialRecord(req, res) {
        const uid = req.params.id;
        const finalData = [];
        SubjectModel.findById(uid).then(subject => {
            if(subject){
                TrialModel.find({userId: uid}).then(data => {
                    if(data.length > 0 ){
                        for (let i = 0; i < data.length; ++i) {
                            const trial = data[i];
                            const date = moment(trial.dateStarted).format("YYYY:MM:DD:HH:mm:ss");
                            const trialStarted = new Date(trial.trialStartTime).getTime();
                            const trialEnded = new Date(trial.targetOnTime).getTime();
                            const tmpFinalData = {
                                group: subject.subjectName,
                                subjectID: subject.userId,
                                session: subject.sessionNumber,
                                sex: (subject.sex === 'male' ? 'M' : 'F'),
                                age: subject.age,
                                category: subject.trialCategory,
                                block: trial.block,
                                date: date,
                                trial: i + 1,
                                cueLocation: trial.cueLocation,
                                targetLocation: trial.targetLocation,
                                targetDirection: trial.targetDirection,
                                targetCongruency: trial.targetCongruency,
                                trialStartTime: trialStarted,
                                targetOnTime: trialEnded,
                                firstFixation: trial.firstFixationDelay,
                                RT: trial.rt,
                                subjectResponse: trial.subjectResponse,
                                correctResponse: trial.correctResponse,
                                correctNess: trial.correctNess
                            }

                            finalData.push(tmpFinalData);
                        }

                        const summary = [
                            'group=',
                            subject.subjectName,
                            'subjectID=',
                            subject.userId,
                            'session=',
                            subject.sessionNumber,
                            'sex=',
                            (subject.sex === 'male' ? 'M' : 'F'),
                            'age=',
                            subject.age,
                            'category',
                            subject.trialCategory,
                            'AlertEffect=',
                            calculateAlerting(data, data.length),
                            'OrientingEffect=',
                            calculateOrienting(data, data.length),
                            'ConflictEffect=',
                            calculateConflict(data, data.length),
                            'GrandMeanEffect=',
                            calculateGrandMean(data, data.length),
                            'Accuracy=',
                            calculateMeanACC(data, data.length),
                            'TrialFinished=',
                            data.length
                        ];
                        const calculateMedianRt = calculateMedianRTForEachCondition(data, data.length);
                        const calculateMeanRT = calculateMeanRTForEachCondition(data, data.length)
                        const calculateSD = calculateSDForEachCondition(data, data.length);
                        const calculateAcc = calculateACCForEachCondition(data, data.length);
                        summary.concat(calculateMedianRt, calculateMeanRT, calculateSD, calculateAcc)

                        const wb = XLSX.utils.book_new();
                        const fileName = `ANT_Result_${subject.subjectName}_${subject.userId}_${subject.sessionNumber}`
                        const ws = XLSX.utils.json_to_sheet(finalData);
                        const rowSummary = [];
                        rowSummary[0] = summary
                        XLSX.utils.sheet_add_aoa(ws, rowSummary,{origin: `A${data.length+2}`})
                        XLSX.utils.book_append_sheet(wb, ws, "Trial Record");

                        const file = XLSX.write(wb, {
                            bookType: 'xlsx',
                            type: 'buffer'
                        });
                        res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        res.header('Content-Disposition', `attachment; filename=${fileName}.xlsx`);
                        res.header('Content-Length', file.length);
                        res.end(file);

                    }else res.status(404).json({
                        status: "error",
                        message: "No data found"
                    })
                }).catch(e => {
                    console.log(e);
                    res.status(500).json({
                        status: "error",
                        message: e.message
                    })
                });
            }else res.status(404).json({
                status: "error",
                message: "User not found"
            })
        }).catch(e => {
            console.log(e);
            res.status(500).json({
                status: "error",
                message: e.message
            })
        });
    }
}