export default class AssetsController{
    static async getArrowImage(req, res){
        try{
            const fileName = req.params.fileName
            res.download("./assets/arrow/" + fileName);
        }catch (e){
            console.log(e.message)
        }
    }

    static async getFishImage(req, res){
        try {
            const fileName = req.params.fileName
            res.download("./assets/fish/" + fileName);
        }catch (e){
            console.log(e.message)
        }
    }

    static async getSound(req, res){
        try {
            const fileName = req.params.fileName
            res.download("./assets/sound/" + fileName);
        }catch (e){
            console.log(e.message)
        }
    }
}