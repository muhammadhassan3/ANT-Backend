import {SubjectModel} from '../model/SubjectModel.js';
import {v4} from "uuid";
import {UserModel} from "../model/UserModel.js";

function isRequiredParamNull(req) {
    if(req.body.id == null || req.body.name == null || req.body.session == null || req.body.age == null || req.body.sex == null || req.body.category == null || req.body.windowSize == null){
        return {
            result: true,
            message: "Harap isi seluruh form yang wajib di isi"
        }
    }else return {
        result: false,
    }
}

function getDistanceEyesAndScreen(windowSize){
    return (Math.round((windowSize * 2.32) * 100) / 100).toFixed(2);
}


export default class UserController{
    static async apiSaveUser(req, res){
        const userId = req.body.id
        const subjectName = req.body.name
        const session = req.body.session
        const age = req.body.age
        const sex = req.body.sex
        const trialCategory = req.body.category
        const windowSize = req.body.windowSize;
        const distanceEyesAndScreen = getDistanceEyesAndScreen(windowSize)

        //check Required param is null or not
        if(isRequiredParamNull(req).result){
            res.status(400).json({
                status: "error",
                message: isRequiredParamNull(req).message
            })
            return;
        }

        //Check user session is valid or not
        const userSession = await SubjectModel.count({sessionNumber: session, subjectName: subjectName}).catch(err => {
            res.status(500).json({
                status: "error",
                message: err.message
            })
        })
        if(userSession > 0){
            res.status(400).json({
                status: "error",
                message: "Anda sudah berpartisipasi dalam sesi ini, silahkan hubungi admin untuk mengkonfirmasi kehadiran anda"
            })
        }else {
            //Check subject id is existed or not
            const userIdCount = await SubjectModel.count({userId: userId, sessionNumber: session}).catch(err => {
                res.status(500).json({
                    status: "error",
                    message: err.message
                })
            })

            if(userIdCount > 0){
                res.status(400).json({
                    status: "error",
                    message: "Id anda sudah terdaftar silahkan cek kembali id anda"
                })
            }else{
                //Save user
                const userData = {
                    userId: userId,
                    subjectName: subjectName,
                    sessionNumber: session,
                    age: age,
                    sex: sex,
                    trialCategory: trialCategory,
                    diagonalWindowSize: windowSize,
                    distanceEyesAndScreen: distanceEyesAndScreen,
                    createDate: new Date()
                }
                const newUser = new SubjectModel(userData)
                newUser.save().then(response => {
                    res.json({
                        status: "success",
                        message: "User berhasil disimpan",
                        token: response.id
                    })
                }).catch(err => {
                    res.status(500).json({
                        status: "error",
                        message: err.message
                    })
                })
            }
        }
    }

    static async apiGetAllUsers(req, res){
        const authToken = req.get("Authorization").split(" ")[1]
        const user = await UserModel.findOne({accessToken: authToken}).catch(err => {
            res.status(500).json({
                status: "error",
                message: err.message
            })
        })
        if(user){
            SubjectModel.find({}).then(users => {
                res.json({
                    status: "success",
                    data: users
                })
            }).catch(err => {
                res.status(500).json({
                    status: "error",
                    message: err.message
                })
            })
        }else {
            res.status(401).json({
                status: "error",
                message: "Anda tidak memiliki akses"
            })
        }
    }

    static async login(req, res){
        const login =  req.body.username
        const password = req.body.password
        const user = await UserModel.findOne({username: login}).catch(err => {
            res.status(500).json({
                status: "error",
                message: err.message
            })
        })
        if(user){
            if(password === user.password){
                user.accessToken = v4()
                await user.save().catch(err => {
                    res.status(500).json({
                        status: "error",
                        message: err.message
                    })
                })

                res.json({
                    status: "success",
                    message: "Login berhasil",
                    token: user.accessToken
                })
            }else{
                res.status(400).json({
                    status: "error",
                    message: "Kombinasi username dan password yang kamu gunakan tidak tepat, silahkan diperbaiki kembali"
                })
            }
        }else res.json({
            status: 'error',
            message: 'Username tidak ditemukan'
        })
    }
}