import mongoose from "mongoose";
const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    website: {
        type: String
    },
    logo: {
        logo: { type: String, default: "" }
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
        required: true
    }
    
},{timestamps: true})
export const Company =mongoose.model('Company',companySchema)