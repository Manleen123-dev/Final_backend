import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/apierror.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asynchandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    // Since the user is asking for their uploaded video on the dashboard, we will filter by req.user._id if no userId provided, or by userId if requested
    
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;
    
    let matchCondition = {};
    
    if (userId) {
        matchCondition.owner = new mongoose.Types.ObjectId(userId);
    } else {
        // Default for dashboard
        matchCondition.owner = new mongoose.Types.ObjectId(req.user._id);
    }
    
    if (query) {
        matchCondition.title = { $regex: query, $options: "i" };
    }

    const videos = await Video.find(matchCondition)
        .sort({ [sortBy]: sortType === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(limitNumber);
        
    const totalVideos = await Video.countDocuments(matchCondition);

    return res.status(200).json(
        new ApiResponse(
            200, 
            {
                videos,
                total: totalVideos,
                page: pageNumber,
                limit: limitNumber
            }, 
            "Videos fetched successfully"
        )
    );
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }

    let videoFileLocalPath;
    if (req.files && Array.isArray(req.files.videoFile) && req.files.videoFile.length > 0) {
        videoFileLocalPath = req.files.videoFile[0].path;
    }

    let thumbnailLocalPath;
    if (req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0) {
        thumbnailLocalPath = req.files.thumbnail[0].path;
    }

    if (!videoFileLocalPath) {
        throw new ApiError(400, "Video file is required");
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail is required");
    }

    const videoUploadResult = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnailUploadResult = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoUploadResult) {
        throw new ApiError(500, "Failed to upload video to Cloudinary");
    }

    if (!thumbnailUploadResult) {
        throw new ApiError(500, "Failed to upload thumbnail to Cloudinary");
    }

    // Cloudinary video upload result contains duration in seconds
    const duration = videoUploadResult.duration || 0;

    const video = await Video.create({
        title,
        description,
        videoFile: videoUploadResult.url,
        thumbnail: thumbnailUploadResult.url,
        duration,
        owner: req.user._id,
        isPublished: true
    });

    return res.status(201).json(
        new ApiResponse(201, video, "Video published successfully")
    );
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId).populate("owner", "username fullName avatar");

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    return res.status(200).json(
        new ApiResponse(200, video, "Video fetched successfully")
    );
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById
}
