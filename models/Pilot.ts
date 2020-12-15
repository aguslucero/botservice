import {Schema, model, Document} from 'mongoose';



const schema = new Schema({
    userName: { type: String , unique: true },
    minutes: Number,
    newEntry: String,
})

 interface IPilot extends Document {
    userName: string,
    minutes: number,
    newEntry: string,
}

export default model<IPilot>('pilot', schema);