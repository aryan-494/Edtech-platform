const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// create subsection 
exports.createSubSection = async (req, res) => {
    try {
        const { sectionId, title, timeDuration, description } = req.body;

        const video = req.files.videoFile;

        if (!sectionId || !title || !timeDuration || !video || !description ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required ",
            });
        }

        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        const SubSectionDetails = await SubSection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl: uploadDetails.secure_url,
        });

        const updatedSection = await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $push: {
                    subSection: SubSectionDetails._id
                }
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "subsection created successfully ",
            updatedSection,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server error ",
            error: error.message,
        });
    }
};

// update subsection 
exports.updateSubSection = async (req, res) => {
    try {
        const { subSectionId, title, description, timeDuration } = req.body;

        if (!subSectionId || !title || !description || !timeDuration) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const updatedSubSection = await SubSection.findByIdAndUpdate(
            subSectionId,
            {
                title: title,
                description: description,
                timeDuration: timeDuration
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Subsection updated successfully",
            updatedSubSection
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to update subsection",
            error: error.message,
        });
    }
};

// delete subsection 
exports.deleteSubSection = async (req, res) => {
    try {
        const { subSectionId, sectionId } = req.body;

        if (!subSectionId || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "Missing properties",
            });
        }

        await SubSection.findByIdAndDelete(subSectionId);

        await Section.findByIdAndUpdate(
            sectionId,
            { $pull: { subSection: subSectionId } }
        );

        return res.status(200).json({
            success: true,
            message: "Subsection deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to delete subsection",
            error: error.message,
        });
    }
};
