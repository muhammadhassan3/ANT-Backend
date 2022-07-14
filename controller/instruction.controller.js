import { SubjectModel } from "../model/SubjectModel.js"
import {TrialModel} from "../model/TrialModel.js";

const childMessage= {
    instruction1: "You are going to play a computer game where your job will be to feed a hungry fish using the mouse.  The way that you feed a fish when it appears on the screen is by pressing the button on the mouse that hit the fish's mouth.",
    instruction2: "Sometimes the hungry fish will be alone, the way you just saw, and sometimes the fish will be swimming with some other fish as well.  When you see more than one fish, your job is to feed only the fish in the center.  So what matters is the direction the middle fish is swimming in.",
    instruction3: "You should try to feed the fish as quickly as they could, but not so fast that they would make many mistakes."
}

const adultMessage = {
    instruction1: "Ini adalah eksperimen untuk menilai tingkat atensi. Anda akan ditayangkan anak panah pada layar yang mengarah ke kiri atau ke kanan (seperti contoh -> atau <-). Tugas Anda adalah menekan tombol panah kiri pada keyboard Anda ketika panah tengah menunjuk ke kiri dan tombol panah kanan ketika panah tengah menunjuk ke kanan. Pada beberapa percobaan, panah tengah akan diapit oleh dua panah ke kiri dan dua panah ke kanan, misalnya:",
    instruction2: "Tugas Anda adalah merespon arah panah TENGAH saja. Gunakan jari telunjuk kiri Anda untuk tombol panah kiri dan jari telunjuk kanan Anda untuk tombol panah kanan. Harap merespon secepat dan seakurat mungkin. Waktu reaksi dan akurasi Anda akan dicatat.\n\nAkan ada tanda silang (\" +\") di tengah layar dan anak panah akan muncul baik di atas atau di bawah tanda silang. Anda harus mencoba untuk terpaku atau memfokuskan pandangan pada tanda silang sepanjang percobaan. Harap jangan mengarahkan mata Anda ke target.\n\nPada beberapa percobaan akan ada tanda asterisk yang menunjukkan kapan atau di mana panah akan muncul. Jika isyarat berada di tengah atau keduanya di atas dan di bawah fiksasi, itu hanya menunjukkan bahwa panah akan segera muncul. Jika isyarat hanya di atas atau di bawah fiksasi, ini menunjukkan bahwa percobaan akan segera terjadi dan di mana itu akan terjadi. Cobalah untuk mempertahankan fiksasi setiap saat. Namun, Anda dapat hadir kapan dan di mana ditunjukkan oleh isyarat . \n\nEksperimen terdiri dari empat blok. Blok pertama adalah untuk latihan dan memakan waktu sekitar dua menit. Tiga blok lainnya adalah blok eksperimental dan masing-masing membutuhkan waktu sekitar lima menit. Setelah setiap blok akan ada pesan \"istirahatlah\" dan Anda boleh beristirahat sejenak. Setelah itu, Anda dapat menekan bilah spasi untuk memulai blok berikutnya. Seluruh percobaan memakan waktu sekitar dua puluh menit. Jika Anda memiliki pertanyaan, silakan tanyakan pada orang yang menjalankan eksperimen. Jika Anda memahami instruksi ini, Anda dapat memulai sesi latihan."
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
        const trialData = await TrialModel.find({userId: uid})
        if(trialData.length > 0){
            const redirectUrl = `/${uid}/result`
            console.log(redirectUrl)
            res.status(302).json({
                status: "redirect",
                target: redirectUrl
            })
        }else{
            const user = await SubjectModel.findById(uid).catch(err => {
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
}
