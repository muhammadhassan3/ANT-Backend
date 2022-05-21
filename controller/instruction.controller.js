import { UserModel } from "../model/SubjectModel.js"

const childMessage= {
    instruction1: "You are going to play a computer game where your job will be to feed a hungry fish using the mouse.  The way that you feed a fish when it appears on the screen is by pressing the button on the mouse that hit the fish's mouth.",
    instruction2: "Sometimes the hungry fish will be alone, the way you just saw, and sometimes the fish will be swimming with some other fish as well.  When you see more than one fish, your job is to feed only the fish in the center.  So what matters is the direction the middle fish is swimming in.",
    instruction3: "You should try to feed the fish as quickly as they could, but not so fast that they would make many mistakes."
}

const adultMessage = {
    instruction1: "This is an experiment investigating attention. You will be shown an arrow on the screen pointing either to the left or to the right (for example -> or <- ).  Your task is to press the left arrow key on your keyboard when the central arrow points left and the right arrow key when the central arrow points right. On some trials, the central arrow will beflanked by two arrows to the left and two arrows to the right, for example:",
    instruction2: "Your task is to respond to the direction only of the CENTRAL arrow. Use your left index finger for the left arrow key and your right index finger for the right arrow key.  Please make your response as quickly and accurately as possible. Your reaction time and accuracy will be recorded.\n\nThere will be a cross (\"+\") in the center of the screen and the arrows will appear either above or below the cross.  You should try to fixate on the cross throughout the experiment.  Please do not move you eyes to the target.\n\nOn some trials there will be asterisk cues indicating when or where the arrow will occur.  If the cue is at the center or both above and below fixation it indicates only that the arrow will appear shortly.  If the cue is only above or below fixation it indicates both that the trial will occur shortly and where it will occur. Try to maintain fixation at all times.  However, you may attend when and where indicated by the cues. \n\nThe experiment contains four blocks. The first block is for practice and takes about two minutes. The other three blocks are experimental blocks and each takes about five minutes.  After each block there will be a message \"take a break\" and you may take a short rest.  After it, you can press the space bar to begin the next block.  The whole experiment takes about twenty minutes.  If you have any question, please ask the experimenter.  If you understand this instruction, you may start the practice session."
}

const fileName = {
    arrowImages : ["fixationpoint", "centralcue", "lllll", "rrlrr", "ooloo", "rrrrr", "llrll", "ooroo", "correct", "incorrect", "noresponse", "sample", ],
    fishImages : ["fixationpoint", "centralcue", "lllll", "rrlrr", "ooloo", "rrrrr", "llrll", "ooroo", "lllll1", "rrlrr1", "ooloo1", "rrrrr1", "llrll1", "ooroo1", "sample", "blank"],
    sounds : ["sound/correct", "sound/wrong", "sound/alert"]
}

const assetsUrl = {
    childImage : "/assets/fish/",
    adultImage : "/assets/arrow/",
    sound : "/assets/sound/"
}

export default class InstructionController{
    static async getMessage(req, res){
        const uid = req.query.id
        const user = await UserModel.findById(uid).catch(err => {
            res.status(500).json({
                status: "error",
                message: err.message
            })
        })
        if(!user){
            res.status(400).json({
                status: "error",
                message: "User not found"
            })
            return;
        }

        if(user.age <=12){
            res.json({
                type: "child",
                message: childMessage,
                assetsUrl : {
                    image : assetsUrl.childImage
                }
            })
        }else res.json({
            type: "adult",
            message: adultMessage,
            assetsUrl : {
                image : assetsUrl.adultImage
            }
        })
    }
}
