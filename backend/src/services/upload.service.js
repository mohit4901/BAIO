const cloudinary = require('../config/cloudinary');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

class UploadService {
  async uploadImage(filePath, folder, publicId = null) {
    try {
      const options = {
        folder: `baio/${folder}`,
        resource_type: 'image',
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' },
        ],
      };
      if (publicId) options.public_id = publicId;

      const result = await cloudinary.uploader.upload(filePath, options);
      return { url: result.secure_url, publicId: result.public_id };
    } catch (error) {
      logger.error(`Image upload failed: ${error.message}`);
      throw new AppError('Image upload failed. Please try again.', 500);
    }
  }

  async uploadPDF(filePath, folder, fileName) {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: `baio/${folder}`,
        resource_type: 'raw',
        public_id: fileName,
        format: 'pdf',
      });
      return { url: result.secure_url, publicId: result.public_id };
    } catch (error) {
      logger.error(`PDF upload failed: ${error.message}`);
      throw new AppError('File upload failed. Please try again.', 500);
    }
  }

  async deleteFile(publicId, resourceType = 'image') {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
      logger.info(`File deleted: ${publicId}`);
    } catch (error) {
      logger.error(`File delete failed: ${error.message}`);
    }
  }

  async uploadProfilePhoto(filePath, studentId) {
    return this.uploadImage(filePath, 'profiles', `profile_${studentId}`);
  }

  async uploadOlympiadBanner(filePath, olympiadId) {
    return this.uploadImage(filePath, 'olympiad-banners', `banner_${olympiadId}`);
  }

  async uploadSyllabus(filePath, olympiadId) {
    return this.uploadPDF(filePath, 'syllabus', `syllabus_${olympiadId}`);
  }

  async uploadCertificate(filePath, rollNumber) {
    return this.uploadPDF(filePath, 'certificates', `cert_${rollNumber}`);
  }
}

module.exports = new UploadService();
