import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongooseAggregatePaginate"
const videoSchema=new Schema(
    {
      videoFile:{
        type:String,
        required:true
      },
      thumbnail:{
        type:String,
        required:true
      },
      title:{
        type:string,
        required:true
      },
      description:{
        type:String,
        required:true
      },
       duration:{
        type:Number,
        required:true
      },
       views:{
        type:Number,
        default:0
      },
       isPublished:{
        type:Boolean,
        default:true
      },
       description:{
        type:Schema.Types.ObjectId,
        ref:"User"
      },
    },
    {
        timestamps:true
    }
)
videoSchema.plugin(mongooseAggregatePaginate)

export const Video=mongoose.model("Video",videoSchema)